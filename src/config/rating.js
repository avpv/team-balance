/**
 * Rating System Configuration
 * Centralized configuration for ELO rating calculations and thresholds
 *
 * This file provides a single source of truth for all rating-related constants
 * across the application, ensuring consistency and ease of modification.
 */

/**
 * Core Rating Constants
 * Default values for player ratings and boundaries
 */
export const RATING_CONSTANTS = {
    /** Default starting rating for new players */
    DEFAULT: 1500,

    /** Minimum possible rating value */
    MIN: 0,

    /** Maximum possible rating value */
    MAX: 3000,

    /** Rating difference formula divisor (standard ELO) */
    RATING_DIVISOR: 400,

    /** Base for probability calculation (standard ELO) */
    PROBABILITY_BASE: 10,

    /**
     * Reliability threshold for expected score damping.
     * When a player has fewer comparisons than this threshold,
     * their rating is blended toward DEFAULT for expected score calculation.
     * This reduces order-dependence in sequential ELO processing.
     *
     * With threshold 5:
     *   0 comparisons → uses DEFAULT rating (fully damped)
     *   2 comparisons → uses 40% of rating deviation from DEFAULT
     *   5+ comparisons → uses full current rating (no damping)
     */
    RELIABILITY_THRESHOLD: 5
};

/**
 * K-Factor Configuration
 * Controls rating volatility based on experience and skill level
 */
export const K_FACTORS = {
    /** Base K-factor for experienced players */
    BASE: 36,

    /** High K-factor for new players (< 20 comparisons) */
    NOVICE: 48,

    /** Low K-factor for masters (> 2000 rating, > 50 comparisons) */
    MASTER: 20,

    /** Low K-factor for experts (> 1800 rating, > 30 comparisons) */
    EXPERT: 25,

    /** Experience thresholds */
    THRESHOLDS: {
        /** Comparisons threshold for novice/experienced split */
        NOVICE_COMPARISONS: 20,

        /** Comparisons threshold for expert level */
        EXPERT_COMPARISONS: 30,

        /** Comparisons threshold for master level */
        MASTER_COMPARISONS: 50,

        /** Rating threshold for expert level */
        EXPERT_RATING: 1800,

        /** Rating threshold for master level */
        MASTER_RATING: 2000
    }
};

/**
 * Glicko-2 Rating Deviation (RD) Configuration
 * Tracks individual uncertainty for each player's rating.
 *
 * RD represents how confident we are in a player's rating:
 *   - Low RD (~50) = very confident, rating is accurate
 *   - High RD (~350) = uncertain, rating may be inaccurate
 *
 * RD increases over time without comparisons (rating becomes stale).
 * RD decreases as more comparisons are made.
 */
export const GLICKO2 = {
    /**
     * Initial RD for new players.
     * Tuned for single-session use: players have 3-10 comparisons total,
     * not hundreds. RD=250 (vs standard 350) gives:
     * - g(φ)≈0.78 at start (vs 0.67) → less order-dependence in step-by-step
     * - After 5 comparisons RD drops to ~130 → "medium" confidence
     * - Batch spread for 6 players: ~550 pts (enough for team balancing)
     */
    INITIAL_RD: 250,

    /** Minimum RD (maximum confidence, never drops below this) */
    MIN_RD: 30,

    /** Maximum RD (matches INITIAL_RD for single-session context) */
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
     * Higher value = ratings adapt faster, appropriate for single-session
     * where every comparison carries significant information.
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
     * Small pools (3-4) → lower RD (converge fast with few comparisons).
     * Large pools (10+) → higher RD (more comparisons available for spread).
     * Formula: INITIAL_RD * sqrt(poolSize / REFERENCE_POOL), clamped to [MIN, MAX].
     */
    ADAPTIVE_RD: {
        REFERENCE_POOL: 6,
        MIN: 200,
        MAX: 320
    },

    /**
     * RD confidence thresholds for UI display.
     * Tuned for single-session: after a full round of comparisons (n-1),
     * RD should reach "medium" or "high" confidence.
     * With INITIAL_RD=250: after 3 comparisons RD≈160, after 5 RD≈130, after 8 RD≈100.
     */
    CONFIDENCE: {
        /** Very confident in rating (RD≤110, ~8+ comparisons) */
        HIGH: 110,
        /** Moderately confident (RD≤170, ~3+ comparisons) */
        MEDIUM: 170,
        /** Low confidence (RD≤230, ~1 comparison) */
        LOW: 230
    }
};

/**
 * Pool Adjustment Configuration
 * Adjusts K-factors based on position pool size for fairness
 */
export const POOL_ADJUSTMENT = {
    /** Reference pool size for baseline adjustments */
    REFERENCE_SIZE: 15,

    /** Minimum adjustment factor (prevents over-dampening) */
    MIN_FACTOR: 0.5,

    /** Maximum adjustment factor (prevents over-inflation) */
    MAX_FACTOR: 2.0,

    /** Enable/disable pool size adjustments */
    ENABLED: true
};

/**
 * Balance Thresholds
 * Defines what constitutes balanced teams or matchups
 */
export const BALANCE_THRESHOLDS = {
    /** Rating difference for "balanced" 1v1 matchup */
    MATCHUP_BALANCED: 200,

    /** Maximum weighted rating difference for balanced teams */
    TEAM_BALANCED: 350
};

/**
 * Confidence Level Configuration
 * Determines confidence in rating accuracy based on comparison count
 */
export const CONFIDENCE_LEVELS = {
    /** Minimum comparisons percentage for each confidence level */
    VERY_LOW: 0,   // < 20% of possible comparisons
    LOW: 20,       // 20-39% of possible comparisons
    MEDIUM: 40,    // 40-59% of possible comparisons
    HIGH: 60,      // 60-79% of possible comparisons
    VERY_HIGH: 80  // >= 80% of possible comparisons
};

/**
 * Percentile Calculation Settings
 * Configuration for ranking players within position pools
 */
export const PERCENTILE_CONFIG = {
    /** Top percentile value (best player) */
    TOP: 100,

    /** Bottom percentile value (lowest player) */
    BOTTOM: 0,

    /** Enable percentile caching for performance */
    CACHE_ENABLED: false
};

/**
 * Export default configuration object
 * Provides all rating configuration in one place
 */
export default {
    RATING_CONSTANTS,
    K_FACTORS,
    GLICKO2,
    POOL_ADJUSTMENT,
    BALANCE_THRESHOLDS,
    CONFIDENCE_LEVELS,
    PERCENTILE_CONFIG
};
