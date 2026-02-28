// src/services/EloService.js

import ratingConfig from '../config/rating.js';

/**
 * EloService - ELO rating calculations
 * Pure business logic with no state management
 *
 * This service handles all ELO rating calculations using centralized configuration
 * from rating.js, ensuring consistency across the application.
 */
class EloService {
    constructor(activityConfig) {
        // Store activity config
        this.config = activityConfig;

        // Import rating constants from centralized config
        this.DEFAULT_RATING = ratingConfig.RATING_CONSTANTS.DEFAULT;
        this.BASE_K_FACTOR = ratingConfig.K_FACTORS.BASE;
        this.RATING_DIVISOR = ratingConfig.RATING_CONSTANTS.RATING_DIVISOR;
        this.PROBABILITY_BASE = ratingConfig.RATING_CONSTANTS.PROBABILITY_BASE;

        // K-factor thresholds
        this.K_FACTORS = ratingConfig.K_FACTORS;

        // Pool adjustment settings
        this.POOL_ADJUSTMENT = ratingConfig.POOL_ADJUSTMENT;

        // Uncertainty boost settings (Glicko-inspired)
        this.UNCERTAINTY_BOOST = ratingConfig.UNCERTAINTY_BOOST;

        // Glicko-2 settings
        this.GLICKO2 = ratingConfig.GLICKO2;

        // Balance thresholds
        this.BALANCE_THRESHOLDS = ratingConfig.BALANCE_THRESHOLDS;

        // Confidence levels
        this.CONFIDENCE_LEVELS = ratingConfig.CONFIDENCE_LEVELS;

        // Reliability threshold for expected score damping
        this.RELIABILITY_THRESHOLD = ratingConfig.RATING_CONSTANTS.RELIABILITY_THRESHOLD;
    }

    /**
     * Calculate expected match outcome
     * Uses standard ELO probability formula
     *
     * @param {number} playerRating - Player's current rating
     * @param {number} opponentRating - Opponent's current rating
     * @returns {number} Expected score (0-1, where 1 = 100% win probability)
     */
    calculateExpectedScore(playerRating, opponentRating) {
        const ratingDifference = opponentRating - playerRating;
        return 1 / (1 + Math.pow(this.PROBABILITY_BASE, ratingDifference / this.RATING_DIVISOR));
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
     * Get reliability-damped rating for expected score calculation.
     * Blends the current rating toward DEFAULT based on comparison count.
     * This reduces order-dependence in sequential ELO processing:
     * players with few comparisons have unreliable ratings that shouldn't
     * heavily influence expected scores.
     *
     * @param {number} rating - Player's current rating
     * @param {number} comparisons - Number of comparisons completed
     * @returns {number} Damped rating for expected score calculation
     */
    getDampedRating(rating, comparisons) {
        const confidence = Math.min(1, comparisons / this.RELIABILITY_THRESHOLD);
        return this.DEFAULT_RATING + (rating - this.DEFAULT_RATING) * confidence;
    }

    /**
     * Dynamic K-factor based on experience and skill level
     * Higher K-factor for new players (more volatile)
     * Lower K-factor for experienced/high-rated players (more stable)
     *
     * @param {number} comparisons - Number of comparisons completed
     * @param {number} rating - Current rating
     * @returns {number} Calculated K-factor
     */
    calculateKFactor(comparisons, rating) {
        const thresholds = this.K_FACTORS.THRESHOLDS;

        // Novice players: high volatility
        if (comparisons < thresholds.NOVICE_COMPARISONS) {
            return this.K_FACTORS.NOVICE;
        }

        // Master players: low volatility
        if (rating > thresholds.MASTER_RATING && comparisons > thresholds.MASTER_COMPARISONS) {
            return this.K_FACTORS.MASTER;
        }

        // Expert players: reduced volatility
        if (rating > thresholds.EXPERT_RATING && comparisons > thresholds.EXPERT_COMPARISONS) {
            return this.K_FACTORS.EXPERT;
        }

        // Default: standard volatility
        return this.BASE_K_FACTOR;
    }

    /**
     * Pool-size adjusted K-factor for fair ELO distribution
     * Smaller pools get higher K-factors to compensate for fewer battles
     *
     * @param {number} baseK - Base K-factor from calculateKFactor
     * @param {number} poolSize - Number of players in the position pool
     * @param {number} referenceSize - Reference pool size (from config)
     * @returns {number} Adjusted K-factor
     */
    calculatePoolAdjustedKFactor(baseK, poolSize, referenceSize = null) {
        // Use config reference size if not provided
        const refSize = referenceSize || this.POOL_ADJUSTMENT.REFERENCE_SIZE;

        // Validate inputs
        if (poolSize <= 0) return baseK;
        if (poolSize === 1) return baseK; // Single player, no adjustment needed

        // Calculate adjustment factor: sqrt(referenceSize / poolSize)
        // This gives more volatility to smaller pools
        const adjustmentFactor = Math.sqrt(refSize / poolSize);

        // Apply adjustment with reasonable bounds from config
        const boundedFactor = Math.max(
            this.POOL_ADJUSTMENT.MIN_FACTOR,
            Math.min(this.POOL_ADJUSTMENT.MAX_FACTOR, adjustmentFactor)
        );

        return Math.round(baseK * boundedFactor);
    }

    /**
     * Calculate uncertainty-based K-factor multiplier (Glicko-inspired)
     * Players with fewer comparisons get a higher K-factor, allowing
     * ratings to spread faster when data is scarce.
     *
     * Formula: multiplier = 1 + (INITIAL - 1) * exp(-DECAY_RATE * comparisons)
     *
     * @param {number} comparisons - Number of comparisons completed
     * @returns {number} Multiplier (>= 1.0)
     */
    calculateUncertaintyMultiplier(comparisons) {
        const boost = this.UNCERTAINTY_BOOST;

        const multiplier = 1 + (boost.INITIAL_MULTIPLIER - 1) *
            Math.exp(-boost.DECAY_RATE * comparisons);

        return Math.min(boost.MAX_MULTIPLIER, multiplier);
    }

    /**
     * Calculate the effective K-factor combining all adjustments:
     * base K-factor (experience) × uncertainty multiplier × pool adjustment
     *
     * @param {number} comparisons - Number of comparisons completed
     * @param {number} rating - Current rating
     * @param {number|null} poolSize - Number of players in position pool
     * @returns {number} Fully adjusted K-factor
     */
    calculateEffectiveKFactor(comparisons, rating, poolSize = null) {
        let k = this.calculateKFactor(comparisons, rating);

        // Apply uncertainty boost for few comparisons
        const uncertaintyMultiplier = this.calculateUncertaintyMultiplier(comparisons);
        k = k * uncertaintyMultiplier;

        // Apply pool-size adjustment
        if (poolSize && poolSize > 1) {
            k = this.calculatePoolAdjustedKFactor(k, poolSize);
        }

        return Math.round(k);
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
     * Calculate updated Glicko-2 RD and volatility after a single comparison.
     *
     * @param {number} rating - Player's current ELO rating
     * @param {number} rd - Player's current RD
     * @param {number} volatility - Player's current volatility (σ)
     * @param {number} opponentRating - Opponent's ELO rating
     * @param {number} opponentRd - Opponent's RD
     * @param {number} score - Actual score (1=win, 0.5=draw, 0=loss)
     * @returns {Object} { newRd, newVolatility }
     */
    calculateGlicko2Update(rating, rd, volatility, opponentRating, opponentRd, score) {
        const g2 = this.GLICKO2;

        // Step 1: Convert to Glicko-2 scale
        const mu = this.toGlicko2Scale(rating);
        const phi = this.rdToGlicko2Scale(rd);
        const muJ = this.toGlicko2Scale(opponentRating);
        const phiJ = this.rdToGlicko2Scale(opponentRd);

        // Step 2: Compute variance (v) and delta
        const gPhiJ = this.g(phiJ);
        const eMuJ = this.E(mu, muJ, phiJ);

        const v = 1 / (gPhiJ * gPhiJ * eMuJ * (1 - eMuJ));
        const delta = v * gPhiJ * (score - eMuJ);

        // Step 3: Calculate new volatility
        let newSigma = this.calculateNewVolatility(volatility, phi, v, delta);
        newSigma = Math.max(g2.MIN_VOLATILITY, Math.min(g2.MAX_VOLATILITY, newSigma));

        // Step 4: Update RD (pre-rating period)
        const phiStar = Math.sqrt(phi * phi + newSigma * newSigma);

        // Step 5: Calculate new φ'
        const newPhi = 1 / Math.sqrt(1 / (phiStar * phiStar) + 1 / v);

        // Convert back to RD scale
        let newRd = this.rdFromGlicko2Scale(newPhi);
        newRd = Math.max(g2.MIN_RD, Math.min(g2.MAX_RD, newRd));

        return {
            newRd: Math.round(newRd * 10) / 10,
            newVolatility: Math.round(newSigma * 10000) / 10000
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
     * Calculate rating changes for a position
     *
     * @param {Object} winner - Winner player object
     * @param {Object} loser - Loser player object
     * @param {string} position - Position being compared
     * @param {number} poolSize - Optional: Number of players in position pool (for fair K-factor adjustment)
     * @returns {Object} Rating change details
     */
    calculateRatingChange(winner, loser, position, poolSize = null) {
        // Validate that winner and loser are different players
        if (winner.id === loser.id) {
            throw new Error('Cannot calculate rating change for same player');
        }

        const winnerRating = winner.ratings?.[position] || this.DEFAULT_RATING;
        const loserRating = loser.ratings?.[position] || this.DEFAULT_RATING;
        const winnerComparisons = winner.comparisons?.[position] || 0;
        const loserComparisons = loser.comparisons?.[position] || 0;

        // Validate rating values
        if (winnerRating < 0 || loserRating < 0) {
            throw new Error('Invalid rating value: ratings cannot be negative');
        }
        if (!isFinite(winnerRating) || !isFinite(loserRating)) {
            throw new Error('Invalid rating value: ratings must be finite numbers');
        }

        // Use round-based comparison counts for expected score and K-factor calculations.
        // Within a single round (where each player compares with every other player once),
        // a player's effective state stays constant regardless of comparison order.
        // This ensures players with identical results get identical ratings.
        const winnerRoundComparisons = this.getRoundBaseComparisons(winnerComparisons, poolSize);
        const loserRoundComparisons = this.getRoundBaseComparisons(loserComparisons, poolSize);

        // Use damped ratings for expected score calculation to reduce order-dependence.
        // Players with few comparisons have unreliable ratings; damping blends them
        // toward the default, ensuring that sequential comparison order doesn't
        // unfairly penalize players who happen to be compared earlier.
        const dampedWinnerRating = this.getDampedRating(winnerRating, winnerRoundComparisons);
        const dampedLoserRating = this.getDampedRating(loserRating, loserRoundComparisons);

        const winnerExpected = this.calculateExpectedScore(dampedWinnerRating, dampedLoserRating);
        const loserExpected = this.calculateExpectedScore(dampedLoserRating, dampedWinnerRating);

        // Calculate base K-factors (experience level only)
        const winnerBaseK = this.calculateKFactor(winnerRoundComparisons, winnerRating);
        const loserBaseK = this.calculateKFactor(loserRoundComparisons, loserRating);

        // Calculate effective K-factors with all adjustments
        // (uncertainty boost + pool-size adjustment)
        const winnerK = this.calculateEffectiveKFactor(winnerRoundComparisons, winnerRating, poolSize);
        const loserK = this.calculateEffectiveKFactor(loserRoundComparisons, loserRating, poolSize);

        // Use symmetric K-factor (average) for both players to ensure:
        // 1. ELO conservation (total rating pool stays constant)
        // 2. Fair, order-independent results (players with identical records get identical ratings)
        const symmetricK = Math.round((winnerK + loserK) / 2);

        const winnerChange = symmetricK * (1 - winnerExpected);
        const loserChange = symmetricK * (0 - loserExpected);

        // Calculate Glicko-2 RD and volatility updates
        const winnerRd = winner.rd?.[position] ?? this.GLICKO2.INITIAL_RD;
        const loserRd = loser.rd?.[position] ?? this.GLICKO2.INITIAL_RD;
        const winnerVol = winner.volatility?.[position] ?? this.GLICKO2.INITIAL_VOLATILITY;
        const loserVol = loser.volatility?.[position] ?? this.GLICKO2.INITIAL_VOLATILITY;

        const winnerGlicko = this.calculateGlicko2Update(
            winnerRating, winnerRd, winnerVol,
            loserRating, loserRd, 1
        );
        const loserGlicko = this.calculateGlicko2Update(
            loserRating, loserRd, loserVol,
            winnerRating, winnerRd, 0
        );

        return {
            winner: {
                oldRating: winnerRating,
                newRating: winnerRating + winnerChange,
                change: winnerChange,
                kFactor: symmetricK,
                baseKFactor: winnerBaseK,
                expected: winnerExpected,
                newRd: winnerGlicko.newRd,
                newVolatility: winnerGlicko.newVolatility
            },
            loser: {
                oldRating: loserRating,
                newRating: loserRating + loserChange,
                change: loserChange,
                kFactor: symmetricK,
                baseKFactor: loserBaseK,
                expected: loserExpected,
                newRd: loserGlicko.newRd,
                newVolatility: loserGlicko.newVolatility
            },
            poolSize: poolSize || null,
            poolAdjusted: poolSize && poolSize > 1
        };
    }

    /**
     * Calculate rating changes for a Win-Win
     * In a Win-Win, both players receive a score of 0.5
     *
     * @param {Object} player1 - First player object
     * @param {Object} player2 - Second player object
     * @param {string} position - Position being compared
     * @param {number} poolSize - Optional: Number of players in position pool (for fair K-factor adjustment)
     * @returns {Object} Rating change details
     */
    calculateDrawRatingChange(player1, player2, position, poolSize = null) {
        // Validate that players are different
        if (player1.id === player2.id) {
            throw new Error('Cannot calculate rating change for same player');
        }

        const player1Rating = player1.ratings?.[position] || this.DEFAULT_RATING;
        const player2Rating = player2.ratings?.[position] || this.DEFAULT_RATING;
        const player1Comparisons = player1.comparisons?.[position] || 0;
        const player2Comparisons = player2.comparisons?.[position] || 0;

        // Validate rating values
        if (player1Rating < 0 || player2Rating < 0) {
            throw new Error('Invalid rating value: ratings cannot be negative');
        }
        if (!isFinite(player1Rating) || !isFinite(player2Rating)) {
            throw new Error('Invalid rating value: ratings must be finite numbers');
        }

        // Use round-based comparison counts for expected score and K-factor calculations.
        // Within a single round, a player's effective state stays constant regardless
        // of comparison order, ensuring players with identical results get identical ratings.
        const player1RoundComparisons = this.getRoundBaseComparisons(player1Comparisons, poolSize);
        const player2RoundComparisons = this.getRoundBaseComparisons(player2Comparisons, poolSize);

        // Use damped ratings for expected score calculation to reduce order-dependence
        const dampedPlayer1Rating = this.getDampedRating(player1Rating, player1RoundComparisons);
        const dampedPlayer2Rating = this.getDampedRating(player2Rating, player2RoundComparisons);

        const player1Expected = this.calculateExpectedScore(dampedPlayer1Rating, dampedPlayer2Rating);
        const player2Expected = this.calculateExpectedScore(dampedPlayer2Rating, dampedPlayer1Rating);

        // Calculate base K-factors (experience level only)
        const player1BaseK = this.calculateKFactor(player1RoundComparisons, player1Rating);
        const player2BaseK = this.calculateKFactor(player2RoundComparisons, player2Rating);

        // Calculate effective K-factors with all adjustments
        // (uncertainty boost + pool-size adjustment)
        const player1K = this.calculateEffectiveKFactor(player1RoundComparisons, player1Rating, poolSize);
        const player2K = this.calculateEffectiveKFactor(player2RoundComparisons, player2Rating, poolSize);

        // Use symmetric K-factor (average) for both players to ensure:
        // 1. ELO conservation (total rating pool stays constant)
        // 2. Fair, order-independent results (players with identical records get identical ratings)
        const symmetricK = Math.round((player1K + player2K) / 2);

        // In a Win-Win, both players score 0.5
        const player1Change = symmetricK * (0.5 - player1Expected);
        const player2Change = symmetricK * (0.5 - player2Expected);

        // Calculate Glicko-2 RD and volatility updates
        const p1Rd = player1.rd?.[position] ?? this.GLICKO2.INITIAL_RD;
        const p2Rd = player2.rd?.[position] ?? this.GLICKO2.INITIAL_RD;
        const p1Vol = player1.volatility?.[position] ?? this.GLICKO2.INITIAL_VOLATILITY;
        const p2Vol = player2.volatility?.[position] ?? this.GLICKO2.INITIAL_VOLATILITY;

        const p1Glicko = this.calculateGlicko2Update(
            player1Rating, p1Rd, p1Vol,
            player2Rating, p2Rd, 0.5
        );
        const p2Glicko = this.calculateGlicko2Update(
            player2Rating, p2Rd, p2Vol,
            player1Rating, p1Rd, 0.5
        );

        return {
            player1: {
                oldRating: player1Rating,
                newRating: player1Rating + player1Change,
                change: player1Change,
                kFactor: symmetricK,
                baseKFactor: player1BaseK,
                expected: player1Expected,
                newRd: p1Glicko.newRd,
                newVolatility: p1Glicko.newVolatility
            },
            player2: {
                oldRating: player2Rating,
                newRating: player2Rating + player2Change,
                change: player2Change,
                kFactor: symmetricK,
                baseKFactor: player2BaseK,
                expected: player2Expected,
                newRd: p2Glicko.newRd,
                newVolatility: p2Glicko.newVolatility
            },
            poolSize: poolSize || null,
            poolAdjusted: poolSize && poolSize > 1,
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
        let bestRating = 0;

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

        // Calculate effective K-factor (with uncertainty boost + pool adjustment)
        const adjustedK = this.calculateEffectiveKFactor(comparisons, rating, poolSize);

        // Calculate uncertainty multiplier for display
        const uncertaintyMultiplier = this.calculateUncertaintyMultiplier(comparisons);

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
            uncertaintyMultiplier: Math.round(uncertaintyMultiplier * 100) / 100,
            percentile: percentileInfo.percentile,
            rank: percentileInfo.rank,
            confidence: confidenceInfo.confidence,
            confidenceLevel: confidenceInfo.level,
            maxPossibleComparisons: confidenceInfo.maxPossible
        };
    }
}

export default EloService;
