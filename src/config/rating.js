/**
 * Rating System Configuration
 * Single source of truth for all Glicko-2 rating constants.
 */

export const RATING_CONSTANTS = {
    /** Default starting rating for new players */
    DEFAULT: 1500,

    /** Minimum possible rating value */
    MIN: 0,

    /** Maximum possible rating value */
    MAX: 3000
};

/**
 * Glicko-2 Rating Deviation (RD) Configuration
 *
 * RD represents how confident we are in a player's rating:
 *   - Low RD (~50) = very confident, rating is accurate
 *   - High RD (~350) = uncertain, rating may be inaccurate
 */
export const GLICKO2 = {
    /**
     * Initial RD for new players.
     * Tuned for single-session use: players have 3-10 comparisons total.
     * RD=250 (vs standard 350) gives g(φ)≈0.78 at start → less order-dependence.
     */
    INITIAL_RD: 250,

    /** Minimum RD (maximum confidence) */
    MIN_RD: 30,

    /** Maximum RD */
    MAX_RD: 250,

    /** Initial volatility (σ) for new players */
    INITIAL_VOLATILITY: 0.06,

    /** Minimum volatility */
    MIN_VOLATILITY: 0.01,

    /** Maximum volatility */
    MAX_VOLATILITY: 0.15,

    /**
     * System constant (τ) - constrains volatility change rate.
     * Standard Glicko-2 recommends 0.3-1.2.
     * Higher = ratings adapt faster, appropriate for single-session.
     */
    TAU: 0.9,

    /** Convergence tolerance for volatility iteration */
    CONVERGENCE_TOLERANCE: 0.000001,

    /** Maximum iterations for volatility calculation */
    MAX_ITERATIONS: 100,

    /** Glicko-2 scaling factor: 173.7178 = 400/ln(10) */
    SCALE: 173.7178,

    /**
     * Adaptive RD: scale initial RD with pool size.
     * Small pools (3-4) → lower RD; large pools (10+) → higher RD.
     * Formula: INITIAL_RD * sqrt(poolSize / REFERENCE_POOL), clamped.
     */
    ADAPTIVE_RD: {
        REFERENCE_POOL: 6,
        MIN: 200,
        MAX: 320
    },

    /** RD confidence thresholds for UI display */
    CONFIDENCE: {
        HIGH: 110,
        MEDIUM: 170,
        LOW: 230
    }
};

export default {
    RATING_CONSTANTS,
    GLICKO2
};
