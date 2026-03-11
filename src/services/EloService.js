// src/services/EloService.js

import ratingConfig from '../config/rating.js';

/**
 * EloService - Glicko-2 rating calculations
 * Pure business logic with no state management
 *
 * Uses a unified Glicko-2 algorithm for all rating updates.
 * Rating, RD, and volatility are all updated by a single coherent formula.
 *
 * Two modes:
 * - calculateFullGlicko2Update(): single-opponent update (iterative)
 * - calculateBatchGlicko2Update(): snapshot-based batch (order-independent)
 */
class EloService {
    constructor(activityConfig) {
        this.config = activityConfig;

        this.DEFAULT_RATING = ratingConfig.RATING_CONSTANTS.DEFAULT;
        this.GLICKO2 = ratingConfig.GLICKO2;
    }

    /**
     * Calculate expected match outcome using Glicko-2 E() function.
     *
     * @param {number} playerRating - Player's current rating
     * @param {number} opponentRating - Opponent's current rating
     * @param {number} opponentRd - Opponent's RD (optional, defaults to INITIAL_RD)
     * @returns {number} Expected score (0-1, where 1 = 100% win probability)
     */
    calculateExpectedScore(playerRating, opponentRating, opponentRd) {
        const mu = this.toGlicko2Scale(playerRating);
        const muJ = this.toGlicko2Scale(opponentRating);
        const phiJ = this.rdToGlicko2Scale(opponentRd ?? this.GLICKO2.INITIAL_RD);
        return this.E(mu, muJ, phiJ);
    }

    /**
     * Full Glicko-2 update: rating, RD, and volatility in one coherent pass.
     *
     * @param {number} rating - Player's current rating
     * @param {number} rd - Player's current RD
     * @param {number} vol - Player's current volatility (σ)
     * @param {number} oppRating - Opponent's rating
     * @param {number} oppRd - Opponent's RD
     * @param {number} score - Actual score (1=win, 0.5=draw, 0=loss)
     * @returns {Object} { newRating, newRd, newVolatility }
     */
    calculateFullGlicko2Update(rating, rd, vol, oppRating, oppRd, score) {
        const g2 = this.GLICKO2;

        const mu = this.toGlicko2Scale(rating);
        const phi = this.rdToGlicko2Scale(rd);
        const muJ = this.toGlicko2Scale(oppRating);
        const phiJ = this.rdToGlicko2Scale(oppRd);

        const gPhiJ = this.g(phiJ);
        const eMuJ = this.E(mu, muJ, phiJ);
        const v = 1 / (gPhiJ * gPhiJ * eMuJ * (1 - eMuJ));
        const delta = v * gPhiJ * (score - eMuJ);

        let newSigma = this.calculateNewVolatility(vol, phi, v, delta);
        newSigma = Math.max(g2.MIN_VOLATILITY, Math.min(g2.MAX_VOLATILITY, newSigma));

        const phiStar = Math.sqrt(phi * phi + newSigma * newSigma);
        const newPhi = 1 / Math.sqrt(1 / (phiStar * phiStar) + 1 / v);
        const newMu = mu + newPhi * newPhi * gPhiJ * (score - eMuJ);

        let newRd = this.rdFromGlicko2Scale(newPhi);
        newRd = Math.max(g2.MIN_RD, Math.min(g2.MAX_RD, newRd));

        return {
            newRating: Math.round(this.fromGlicko2Scale(newMu)),
            newRd: Math.round(newRd * 10) / 10,
            newVolatility: Math.round(newSigma * 10000) / 10000
        };
    }

    /**
     * Get adaptive initial RD based on pool size.
     *
     * @param {number} poolSize - Number of players in the position pool
     * @returns {number} Initial RD for this pool size
     */
    getInitialRD(poolSize) {
        const g2 = this.GLICKO2;
        const adaptive = g2.ADAPTIVE_RD;
        if (!adaptive || !poolSize || poolSize <= 2) return g2.INITIAL_RD;
        const scaled = Math.round(g2.INITIAL_RD * Math.sqrt(poolSize / adaptive.REFERENCE_POOL));
        return Math.max(adaptive.MIN, Math.min(adaptive.MAX, scaled));
    }

    /**
     * Batch Glicko-2 update for a player given win/loss/draw counts.
     *
     * All opponents are assumed to start from the same snapshot state (rating, RD, vol),
     * making the result purely a function of (wins, losses, draws) — order-independent.
     *
     * This is intentionally a "linear ranking wrapped in Glicko-2": since all opponents
     * share the same snapshot, g(φ) and E() are constants, and the final rating is
     * determined by (wins - losses). The Glicko-2 framework still provides correct
     * RD narrowing and volatility adaptation based on result count.
     *
     * @param {number} wins - Number of wins
     * @param {number} losses - Number of losses
     * @param {number} draws - Number of draws
     * @param {number} poolSize - Pool size (for adaptive initial RD)
     * @returns {Object} { newRating, newRd, newVolatility } or null if no comparisons
     */
    calculateBatchGlicko2Update(wins, losses, draws, poolSize) {
        const totalComparisons = wins + losses + draws;
        if (totalComparisons === 0) return null;

        const g2 = this.GLICKO2;
        const snapshotRd = this.getInitialRD(poolSize);
        const snapshotVol = g2.INITIAL_VOLATILITY;

        const phi = this.rdToGlicko2Scale(snapshotRd);
        const mu = this.toGlicko2Scale(this.DEFAULT_RATING);
        const gPhiJ = this.g(phi);
        const eMuJ = this.E(mu, mu, phi); // 0.5

        const v = 1 / (totalComparisons * gPhiJ * gPhiJ * eMuJ * (1 - eMuJ));
        const delta = v * gPhiJ * ((wins - losses) / 2);

        let newSigma = this.calculateNewVolatility(snapshotVol, phi, v, delta);
        newSigma = Math.max(g2.MIN_VOLATILITY, Math.min(g2.MAX_VOLATILITY, newSigma));

        const phiStar = Math.sqrt(phi * phi + newSigma * newSigma);
        const newPhi = 1 / Math.sqrt(1 / (phiStar * phiStar) + 1 / v);
        const newMu = mu + newPhi * newPhi * gPhiJ * ((wins - losses) / 2);

        let newRd = this.rdFromGlicko2Scale(newPhi);
        newRd = Math.max(g2.MIN_RD, Math.min(g2.MAX_RD, newRd));

        return {
            newRating: Math.round(this.fromGlicko2Scale(newMu)),
            newRd: Math.round(newRd * 10) / 10,
            newVolatility: Math.round(newSigma * 10000) / 10000
        };
    }

    // ==========================================
    // Glicko-2 internals
    // ==========================================

    toGlicko2Scale(rating) {
        return (rating - this.DEFAULT_RATING) / this.GLICKO2.SCALE;
    }

    fromGlicko2Scale(mu) {
        return mu * this.GLICKO2.SCALE + this.DEFAULT_RATING;
    }

    rdToGlicko2Scale(rd) {
        return rd / this.GLICKO2.SCALE;
    }

    rdFromGlicko2Scale(phi) {
        return phi * this.GLICKO2.SCALE;
    }

    g(phi) {
        return 1 / Math.sqrt(1 + 3 * phi * phi / (Math.PI * Math.PI));
    }

    E(mu, muJ, phiJ) {
        return 1 / (1 + Math.exp(-this.g(phiJ) * (mu - muJ)));
    }

    /**
     * Calculate new volatility (σ') using the Glicko-2 algorithm (Illinois method).
     */
    calculateNewVolatility(sigma, phi, v, delta) {
        const tau = this.GLICKO2.TAU;
        const a = Math.log(sigma * sigma);
        const epsilon = this.GLICKO2.CONVERGENCE_TOLERANCE;

        const phiSq = phi * phi;
        const deltaSq = delta * delta;

        const f = (x) => {
            const ex = Math.exp(x);
            const num1 = ex * (deltaSq - phiSq - v - ex);
            const denom1 = 2 * (phiSq + v + ex) * (phiSq + v + ex);
            return num1 / denom1 - (x - a) / (tau * tau);
        };

        let A = a;
        let B;

        if (deltaSq > phiSq + v) {
            B = Math.log(deltaSq - phiSq - v);
        } else {
            let k = 1;
            while (f(a - k * tau) < 0) {
                k++;
                if (k > this.GLICKO2.MAX_ITERATIONS) break;
            }
            B = a - k * tau;
        }

        let fA = f(A);
        let fB = f(B);

        for (let i = 0; i < this.GLICKO2.MAX_ITERATIONS; i++) {
            if (Math.abs(B - A) <= epsilon) break;

            const C = A + (A - B) * fA / (fB - fA);
            const fC = f(C);

            if (fC * fB <= 0) {
                A = B;
                fA = fB;
            } else {
                fA = fA / 2;
            }
            B = C;
            fB = fC;
        }

        return Math.exp(A / 2);
    }

    /**
     * Calculate team strength based on player ratings
     * @param {Array} players - Team players
     * @returns {Object} Team strength statistics
     */
    calculateTeamStrength(players) {
        if (!players || players.length === 0) {
            return {
                totalRating: 0,
                averageRating: 0,
                playerCount: 0
            };
        }

        let totalRating = 0;

        players.forEach(player => {
            const position = player.assignedPosition || player.positions?.[0];
            const rating = position && player.ratings?.[position]
                ? player.ratings[position]
                : this.DEFAULT_RATING;

            totalRating += rating;
        });

        return {
            totalRating: Math.round(totalRating),
            averageRating: Math.round(totalRating / players.length),
            playerCount: players.length
        };
    }
}

export default EloService;
