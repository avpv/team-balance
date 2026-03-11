// src/services/EloService.js

import ratingConfig from '../config/rating.js';

/**
 * EloService - Glicko-2 rating calculations
 * Pure business logic with no state management
 *
 * This service uses a unified Glicko-2 algorithm for all rating updates.
 * Rating, RD, and volatility are all updated by a single coherent formula.
 *
 * Previous hybrid ELO+Glicko-2 approach was replaced because:
 * - ELO formula for rating + Glicko-2 for RD/volatility caused rdt rdt divergence
 * - RD-based K-multiplier duplicated what Glicko-2 already does via newPhi
 * - Base-10 (ELO) and base-e (Glicko-2) expected scores were incompatible
 * - Pool adjustment was redundant with RD's natural adaptation
 *
 * Now: calculateFullGlicko2Update() handles everything in one coherent pass.
 */
class EloService {
    constructor(activityConfig) {
        // Store activity config
        this.config = activityConfig;

        // Import rating constants from centralized config
        this.DEFAULT_RATING = ratingConfig.RATING_CONSTANTS.DEFAULT;
        this.RATING_DIVISOR = ratingConfig.RATING_CONSTANTS.RATING_DIVISOR;
        this.PROBABILITY_BASE = ratingConfig.RATING_CONSTANTS.PROBABILITY_BASE;

        // K-factor thresholds (kept for getEnhancedPlayerStats backward compat)
        this.K_FACTORS = ratingConfig.K_FACTORS;
        this.BASE_K_FACTOR = ratingConfig.K_FACTORS.BASE;

        // Pool adjustment settings (kept for backward compat, no longer used in rating calc)
        this.POOL_ADJUSTMENT = ratingConfig.POOL_ADJUSTMENT;

        // Glicko-2 settings
        this.GLICKO2 = ratingConfig.GLICKO2;

        // Balance thresholds
        this.BALANCE_THRESHOLDS = ratingConfig.BALANCE_THRESHOLDS;

        // Confidence levels
        this.CONFIDENCE_LEVELS = ratingConfig.CONFIDENCE_LEVELS;

        // Reliability threshold (kept for backward compat)
        this.RELIABILITY_THRESHOLD = ratingConfig.RATING_CONSTANTS.RELIABILITY_THRESHOLD;
    }

    /**
     * Calculate expected match outcome using Glicko-2 E() function.
     * Uses base-e (consistent with Glicko-2 internals).
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
     * Get the comparison count at the start of the current round.
     * A "round" is one complete cycle where each player compares with every
     * other player at their position exactly once (poolSize - 1 comparisons).
     *
     * Within a round, this returns the same base count for all comparisons,
     * ensuring that a player's K-factor and damped rating stay consistent
     * regardless of comparison order. This eliminates order-dependent unfairness
     * where two players with identical results could end up with different ratings.
     *
     * @param {number} comparisons - Actual number of comparisons completed
     * @param {number|null} poolSize - Number of players in the position pool
     * @returns {number} Round-base comparison count
     */
    getRoundBaseComparisons(comparisons, poolSize) {
        if (!poolSize || poolSize <= 1) return comparisons;
        const roundSize = poolSize - 1;
        return Math.floor(comparisons / roundSize) * roundSize;
    }

    /**
     * Full Glicko-2 update: rating, RD, and volatility in one coherent pass.
     *
     * This replaces the old hybrid where ELO updated rating and Glicko-2 updated RD/vol.
     * Now all three values come from the same mathematical framework:
     * - No K-factor needed (Glicko-2 controls update magnitude via φ')
     * - No pool adjustment needed (RD adapts naturally to data quantity)
     * - No damping needed (g(φ) already accounts for opponent uncertainty)
     * - Consistent base-e throughout
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

        // Step 1: Convert to Glicko-2 scale
        const mu = this.toGlicko2Scale(rating);
        const phi = this.rdToGlicko2Scale(rd);
        const muJ = this.toGlicko2Scale(oppRating);
        const phiJ = this.rdToGlicko2Scale(oppRd);

        // Step 2: Compute v and delta
        const gPhiJ = this.g(phiJ);
        const eMuJ = this.E(mu, muJ, phiJ);
        const v = 1 / (gPhiJ * gPhiJ * eMuJ * (1 - eMuJ));
        const delta = v * gPhiJ * (score - eMuJ);

        // Step 3: New volatility
        let newSigma = this.calculateNewVolatility(vol, phi, v, delta);
        newSigma = Math.max(g2.MIN_VOLATILITY, Math.min(g2.MAX_VOLATILITY, newSigma));

        // Step 4: New RD
        const phiStar = Math.sqrt(phi * phi + newSigma * newSigma);
        const newPhi = 1 / Math.sqrt(1 / (phiStar * phiStar) + 1 / v);

        // Step 5: New rating (Glicko-2 formula)
        const newMu = mu + newPhi * newPhi * gPhiJ * (score - eMuJ);

        // Step 6: Convert back and clamp
        let newRd = this.rdFromGlicko2Scale(newPhi);
        newRd = Math.max(g2.MIN_RD, Math.min(g2.MAX_RD, newRd));

        return {
            newRating: Math.round(this.fromGlicko2Scale(newMu)),
            newRd: Math.round(newRd * 10) / 10,
            newVolatility: Math.round(newSigma * 10000) / 10000
        };
    }

    // === Legacy K-factor methods (kept for backward compatibility with UI stats) ===

    /**
     * @deprecated Use calculateFullGlicko2Update instead. Kept for getEnhancedPlayerStats.
     */
    calculateKFactor(comparisons, rating) {
        const thresholds = this.K_FACTORS.THRESHOLDS;
        if (comparisons < thresholds.NOVICE_COMPARISONS) return this.K_FACTORS.NOVICE;
        if (rating > thresholds.MASTER_RATING && comparisons > thresholds.MASTER_COMPARISONS) return this.K_FACTORS.MASTER;
        if (rating > thresholds.EXPERT_RATING && comparisons > thresholds.EXPERT_COMPARISONS) return this.K_FACTORS.EXPERT;
        return this.BASE_K_FACTOR;
    }

    /**
     * @deprecated Use calculateFullGlicko2Update instead. Kept for getEnhancedPlayerStats.
     */
    calculateEffectiveKFactor(comparisons, rating, poolSize = null, rd = this.GLICKO2.INITIAL_RD) {
        return this.calculateKFactor(comparisons, rating);
    }

    /**
     * Get adaptive initial RD based on pool size.
     * Scales RD so that smaller pools converge faster and larger pools spread more.
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
    // Glicko-2 Rating Deviation & Volatility
    // ==========================================

    /**
     * Convert ELO rating to Glicko-2 internal scale (μ)
     * @param {number} rating - ELO rating (e.g. 1500)
     * @returns {number} Glicko-2 μ value
     */
    toGlicko2Scale(rating) {
        return (rating - this.DEFAULT_RATING) / this.GLICKO2.SCALE;
    }

    /**
     * Convert Glicko-2 internal scale (μ) back to ELO rating
     * @param {number} mu - Glicko-2 μ value
     * @returns {number} ELO rating
     */
    fromGlicko2Scale(mu) {
        return mu * this.GLICKO2.SCALE + this.DEFAULT_RATING;
    }

    /**
     * Convert RD to Glicko-2 internal scale (φ)
     * @param {number} rd - Rating Deviation (e.g. 350)
     * @returns {number} Glicko-2 φ value
     */
    rdToGlicko2Scale(rd) {
        return rd / this.GLICKO2.SCALE;
    }

    /**
     * Convert Glicko-2 φ back to RD
     * @param {number} phi - Glicko-2 φ value
     * @returns {number} Rating Deviation
     */
    rdFromGlicko2Scale(phi) {
        return phi * this.GLICKO2.SCALE;
    }

    /**
     * Glicko-2 g(φ) function - reduces impact based on opponent's RD uncertainty
     * @param {number} phi - Opponent's φ (RD in Glicko-2 scale)
     * @returns {number} g value (0-1)
     */
    g(phi) {
        return 1 / Math.sqrt(1 + 3 * phi * phi / (Math.PI * Math.PI));
    }

    /**
     * Glicko-2 E(μ, μj, φj) function - expected score against opponent
     * @param {number} mu - Player's μ
     * @param {number} muJ - Opponent's μ
     * @param {number} phiJ - Opponent's φ
     * @returns {number} Expected score (0-1)
     */
    E(mu, muJ, phiJ) {
        return 1 / (1 + Math.exp(-this.g(phiJ) * (mu - muJ)));
    }

    /**
     * Calculate new volatility (σ') using the Glicko-2 algorithm (Illinois method).
     *
     * This determines how much a player's rating is expected to fluctuate.
     * High volatility = rating is changing a lot; low = stable.
     *
     * @param {number} sigma - Current volatility (σ)
     * @param {number} phi - Current φ (RD in Glicko-2 scale)
     * @param {number} v - Variance of expected outcomes
     * @param {number} delta - Rating change magnitude
     * @returns {number} New volatility (σ')
     */
    calculateNewVolatility(sigma, phi, v, delta) {
        const tau = this.GLICKO2.TAU;
        const a = Math.log(sigma * sigma);
        const epsilon = this.GLICKO2.CONVERGENCE_TOLERANCE;

        const phiSq = phi * phi;
        const deltaSq = delta * delta;

        // f(x) function from Glicko-2 paper
        const f = (x) => {
            const ex = Math.exp(x);
            const num1 = ex * (deltaSq - phiSq - v - ex);
            const denom1 = 2 * (phiSq + v + ex) * (phiSq + v + ex);
            return num1 / denom1 - (x - a) / (tau * tau);
        };

        // Initialize bounds for Illinois algorithm
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

        // Illinois algorithm iteration
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
     * @deprecated Use calculateFullGlicko2Update instead.
     * Kept for backward compatibility with processRanking batch mode.
     */
    calculateGlicko2Update(rating, rd, volatility, opponentRating, opponentRd, score) {
        const result = this.calculateFullGlicko2Update(rating, rd, volatility, opponentRating, opponentRd, score);
        return {
            newRd: result.newRd,
            newVolatility: result.newVolatility
        };
    }

    /**
     * Get the confidence level label based on RD value.
     * Lower RD = higher confidence in the rating.
     *
     * @param {number} rd - Rating Deviation
     * @returns {string} Confidence level: 'high', 'medium', 'low', 'very-low'
     */
    getRdConfidenceLevel(rd) {
        const thresholds = this.GLICKO2.CONFIDENCE;
        if (rd <= thresholds.HIGH) return 'high';
        if (rd <= thresholds.MEDIUM) return 'medium';
        if (rd <= thresholds.LOW) return 'low';
        return 'very-low';
    }

    /**
     * Get the approximate rating range (95% confidence interval) from RD.
     * A player's true rating is ~95% likely within rating ± 2*RD.
     *
     * @param {number} rating - ELO rating
     * @param {number} rd - Rating Deviation
     * @returns {Object} { low, high } - 95% confidence interval bounds
     */
    getRatingInterval(rating, rd) {
        const margin = Math.round(2 * rd);
        return {
            low: Math.max(0, rating - margin),
            high: Math.min(3000, rating + margin)
        };
    }

    /**
     * Calculate rating changes for a position using unified Glicko-2.
     *
     * Both rating AND RD/volatility are updated by the same Glicko-2 formula.
     * No K-factor, no pool adjustment, no damping — Glicko-2 handles all of this
     * through its φ' (new RD) and g(φ) (opponent uncertainty) mechanisms.
     *
     * @param {Object} winner - Winner player object
     * @param {Object} loser - Loser player object
     * @param {string} position - Position being compared
     * @param {number} poolSize - Optional: kept for backward compat in return value
     * @returns {Object} Rating change details
     */
    calculateRatingChange(winner, loser, position, poolSize = null) {
        if (winner.id === loser.id) {
            throw new Error('Cannot calculate rating change for same player');
        }

        const winnerRating = winner.ratings?.[position] || this.DEFAULT_RATING;
        const loserRating = loser.ratings?.[position] || this.DEFAULT_RATING;

        if (winnerRating < 0 || loserRating < 0) {
            throw new Error('Invalid rating value: ratings cannot be negative');
        }
        if (!isFinite(winnerRating) || !isFinite(loserRating)) {
            throw new Error('Invalid rating value: ratings must be finite numbers');
        }

        const winnerRd = winner.rd?.[position] ?? this.GLICKO2.INITIAL_RD;
        const loserRd = loser.rd?.[position] ?? this.GLICKO2.INITIAL_RD;
        const winnerVol = winner.volatility?.[position] ?? this.GLICKO2.INITIAL_VOLATILITY;
        const loserVol = loser.volatility?.[position] ?? this.GLICKO2.INITIAL_VOLATILITY;

        // Unified Glicko-2 update for both players
        const winnerResult = this.calculateFullGlicko2Update(
            winnerRating, winnerRd, winnerVol,
            loserRating, loserRd, 1.0
        );
        const loserResult = this.calculateFullGlicko2Update(
            loserRating, loserRd, loserVol,
            winnerRating, winnerRd, 0.0
        );

        // Expected scores for reporting (using Glicko-2 E())
        const winnerExpected = this.calculateExpectedScore(winnerRating, loserRating, loserRd);
        const loserExpected = this.calculateExpectedScore(loserRating, winnerRating, winnerRd);

        return {
            winner: {
                oldRating: winnerRating,
                newRating: winnerResult.newRating,
                change: winnerResult.newRating - winnerRating,
                kFactor: 0,  // No longer used; Glicko-2 controls update magnitude
                baseKFactor: 0,
                expected: winnerExpected,
                newRd: winnerResult.newRd,
                newVolatility: winnerResult.newVolatility
            },
            loser: {
                oldRating: loserRating,
                newRating: loserResult.newRating,
                change: loserResult.newRating - loserRating,
                kFactor: 0,
                baseKFactor: 0,
                expected: loserExpected,
                newRd: loserResult.newRd,
                newVolatility: loserResult.newVolatility
            },
            poolSize: poolSize || null,
            poolAdjusted: false
        };
    }

    /**
     * Calculate rating changes for a Win-Win (draw)
     * Both players receive a score of 0.5, updated via unified Glicko-2.
     *
     * @param {Object} player1 - First player object
     * @param {Object} player2 - Second player object
     * @param {string} position - Position being compared
     * @param {number} poolSize - Optional: kept for backward compat
     * @returns {Object} Rating change details
     */
    calculateDrawRatingChange(player1, player2, position, poolSize = null) {
        if (player1.id === player2.id) {
            throw new Error('Cannot calculate rating change for same player');
        }

        const p1Rating = player1.ratings?.[position] || this.DEFAULT_RATING;
        const p2Rating = player2.ratings?.[position] || this.DEFAULT_RATING;

        if (p1Rating < 0 || p2Rating < 0) {
            throw new Error('Invalid rating value: ratings cannot be negative');
        }
        if (!isFinite(p1Rating) || !isFinite(p2Rating)) {
            throw new Error('Invalid rating value: ratings must be finite numbers');
        }

        const p1Rd = player1.rd?.[position] ?? this.GLICKO2.INITIAL_RD;
        const p2Rd = player2.rd?.[position] ?? this.GLICKO2.INITIAL_RD;
        const p1Vol = player1.volatility?.[position] ?? this.GLICKO2.INITIAL_VOLATILITY;
        const p2Vol = player2.volatility?.[position] ?? this.GLICKO2.INITIAL_VOLATILITY;

        // Unified Glicko-2 update with score=0.5 for both
        const p1Result = this.calculateFullGlicko2Update(
            p1Rating, p1Rd, p1Vol, p2Rating, p2Rd, 0.5
        );
        const p2Result = this.calculateFullGlicko2Update(
            p2Rating, p2Rd, p2Vol, p1Rating, p1Rd, 0.5
        );

        const p1Expected = this.calculateExpectedScore(p1Rating, p2Rating, p2Rd);
        const p2Expected = this.calculateExpectedScore(p2Rating, p1Rating, p1Rd);

        return {
            player1: {
                oldRating: p1Rating,
                newRating: p1Result.newRating,
                change: p1Result.newRating - p1Rating,
                kFactor: 0,
                baseKFactor: 0,
                expected: p1Expected,
                newRd: p1Result.newRd,
                newVolatility: p1Result.newVolatility
            },
            player2: {
                oldRating: p2Rating,
                newRating: p2Result.newRating,
                change: p2Result.newRating - p2Rating,
                kFactor: 0,
                baseKFactor: 0,
                expected: p2Expected,
                newRd: p2Result.newRd,
                newVolatility: p2Result.newVolatility
            },
            poolSize: poolSize || null,
            poolAdjusted: false,
            isDraw: true
        };
    }

    /**
     * Predict match outcome
     * Calculates win probabilities based on ratings
     *
     * @param {Object} player1 - First player
     * @param {Object} player2 - Second player
     * @param {string} position - Position to compare
     * @returns {Object} Match prediction details
     */
    predictMatch(player1, player2, position) {
        const p1Rating = player1.ratings?.[position] || this.DEFAULT_RATING;
        const p2Rating = player2.ratings?.[position] || this.DEFAULT_RATING;

        const p1WinProb = this.calculateExpectedScore(p1Rating, p2Rating);
        const p2WinProb = this.calculateExpectedScore(p2Rating, p1Rating);

        const ratingDiff = Math.abs(p1Rating - p2Rating);

        return {
            player1: {
                name: player1.name,
                rating: p1Rating,
                position,
                winProbability: p1WinProb,
                winPercentage: Math.round(p1WinProb * 100)
            },
            player2: {
                name: player2.name,
                rating: p2Rating,
                position,
                winProbability: p2WinProb,
                winPercentage: Math.round(p2WinProb * 100)
            },
            ratingDifference: ratingDiff,
            isBalanced: ratingDiff < this.BALANCE_THRESHOLDS.MATCHUP_BALANCED
        };
    }

    /**
     * Calculate team strength based on player ELO ratings
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

    /**
     * Evaluate balance between teams based on ELO ratings
     * @param {Array} teams - Array of teams to evaluate
     * @returns {Object} Balance evaluation
     */
    evaluateBalance(teams) {
        if (!teams || teams.length < 2) {
            return {
                isBalanced: true,
                maxDifference: 0,
                teams: []
            };
        }

        const teamStats = teams.map(team => this.calculateTeamStrength(team));
        const ratings = teamStats.map(stats => stats.totalRating);

        const maxRating = Math.max(...ratings);
        const minRating = Math.min(...ratings);
        const maxDifference = maxRating - minRating;

        // Use difference for balance check (from config)
        const isBalanced = maxDifference < this.BALANCE_THRESHOLDS.TEAM_BALANCED;

        return {
            isBalanced,
            maxDifference: Math.round(maxDifference),
            teams: teamStats.map((stats, index) => ({
                index,
                ...stats,
                strengthRank: ratings.filter(r => r > stats.totalRating).length + 1
            }))
        };
    }

    /**
     * Get player's best position
     */
    getBestPosition(player) {
        if (!player.ratings || !player.positions) {
            return null;
        }

        let bestPosition = null;
        let bestRating = -Infinity;

        player.positions.forEach(pos => {
            const rating = player.ratings[pos] || this.DEFAULT_RATING;
            if (rating > bestRating) {
                bestRating = rating;
                bestPosition = pos;
            }
        });

        return {
            position: bestPosition,
            rating: bestRating,
            comparisons: player.comparisons?.[bestPosition] || 0
        };
    }

    /**
     * Compare player's ratings across positions
     */
    comparePositions(player) {
        if (!player.ratings || !player.positions) {
            return [];
        }

        return player.positions.map(pos => ({
            position: pos,
            rating: player.ratings[pos] || this.DEFAULT_RATING,
            comparisons: player.comparisons?.[pos] || 0,
            comparedWith: (player.comparedWith?.[pos] || []).length
        })).sort((a, b) => b.rating - a.rating);
    }

    /**
     * Calculate percentile rank for a player within their position pool
     *
     * @param {Object} player - The player to calculate percentile for
     * @param {string} position - The position to calculate for
     * @param {Array} allPlayersInPosition - All players who can play this position
     * @returns {Object} Percentile information
     */
    calculatePercentile(player, position, allPlayersInPosition) {
        if (!allPlayersInPosition || allPlayersInPosition.length === 0) {
            return { percentile: 0, rank: 0, total: 0 };
        }

        // Sort players by rating (descending)
        const sortedPlayers = [...allPlayersInPosition]
            .filter(p => p.ratings && p.ratings[position] !== undefined)
            .sort((a, b) => (b.ratings[position] || this.DEFAULT_RATING) - (a.ratings[position] || this.DEFAULT_RATING));

        // Find player's rank (1-based)
        const rank = sortedPlayers.findIndex(p => p.id === player.id) + 1;

        if (rank === 0) {
            return { percentile: 0, rank: 0, total: sortedPlayers.length };
        }

        // Calculate percentile (higher is better)
        // Top player = 100th percentile, bottom = 0th percentile
        const percentile = sortedPlayers.length === 1
            ? 100
            : Math.round(((sortedPlayers.length - rank) / (sortedPlayers.length - 1)) * 100);

        return {
            percentile,
            rank,
            total: sortedPlayers.length
        };
    }

    /**
     * Calculate confidence score for a player's rating at a position
     * Based on how many comparisons they've completed vs. total possible
     *
     * @param {Object} player - The player
     * @param {string} position - The position
     * @param {number} totalPlayersInPosition - Total players who can play this position
     * @returns {Object} Confidence information
     */
    calculateConfidence(player, position, totalPlayersInPosition) {
        const comparisons = player.comparisons?.[position] || 0;

        // Maximum possible comparisons for this player at this position
        const maxPossible = totalPlayersInPosition - 1;

        if (maxPossible === 0) {
            return {
                confidence: 0,
                comparisons,
                maxPossible: 0,
                level: 'none'
            };
        }

        // Calculate confidence as percentage of completed comparisons
        const confidence = Math.min(100, Math.round((comparisons / maxPossible) * 100));

        // Determine confidence level using centralized thresholds
        let level;
        const levels = this.CONFIDENCE_LEVELS;
        if (confidence < levels.LOW) level = 'very-low';
        else if (confidence < levels.MEDIUM) level = 'low';
        else if (confidence < levels.HIGH) level = 'medium';
        else if (confidence < levels.VERY_HIGH) level = 'high';
        else level = 'very-high';

        return {
            confidence,
            comparisons,
            maxPossible,
            level
        };
    }

    /**
     * Get enhanced player statistics for a position
     * Includes percentile, confidence, and pool-adjusted metrics
     *
     * @param {Object} player - The player
     * @param {string} position - The position
     * @param {Array} allPlayersInPosition - All players in this position
     * @returns {Object} Enhanced statistics
     */
    getEnhancedPlayerStats(player, position, allPlayersInPosition) {
        const rating = player.ratings?.[position] || this.DEFAULT_RATING;
        const comparisons = player.comparisons?.[position] || 0;
        const rd = player.rd?.[position] ?? this.GLICKO2.INITIAL_RD;
        const volatility = player.volatility?.[position] ?? this.GLICKO2.INITIAL_VOLATILITY;
        const poolSize = allPlayersInPosition.length;

        // Calculate base K-factor
        const baseK = this.calculateKFactor(comparisons, rating);

        // Calculate effective K-factor with RD-based scaling + pool adjustment
        const adjustedK = this.calculateEffectiveKFactor(comparisons, rating, poolSize, rd);

        // Calculate percentile
        const percentileInfo = this.calculatePercentile(player, position, allPlayersInPosition);

        // Calculate confidence
        const confidenceInfo = this.calculateConfidence(player, position, poolSize);

        // Glicko-2 RD confidence
        const rdConfidence = this.getRdConfidenceLevel(rd);
        const ratingInterval = this.getRatingInterval(rating, rd);

        return {
            position,
            rating,
            comparisons,
            poolSize,
            rd,
            volatility,
            rdConfidence,
            ratingInterval,
            baseKFactor: baseK,
            adjustedKFactor: adjustedK,
            percentile: percentileInfo.percentile,
            rank: percentileInfo.rank,
            confidence: confidenceInfo.confidence,
            confidenceLevel: confidenceInfo.level,
            maxPossibleComparisons: confidenceInfo.maxPossible
        };
    }
}

export default EloService;
