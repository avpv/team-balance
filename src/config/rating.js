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
    /** Initial RD for new players (maximum uncertainty) */
    INITIAL_RD: 350,

    /** Minimum RD (maximum confidence, never drops below this) */
    MIN_RD: 30,

    /** Maximum RD (full uncertainty) */
    MAX_RD: 350,

    /** Initial volatility (σ) for new players */
    INITIAL_VOLATILITY: 0.06,

    /** Minimum volatility */
    MIN_VOLATILITY: 0.01,

    /** Maximum volatility */
    MAX_VOLATILITY: 0.12,

    /** System constant (τ) - constrains volatility change rate.
     *  Lower value = more conservative volatility changes.
     *  Glicko-2 recommends 0.3-1.2 depending on domain. */
    TAU: 0.5,

    /** Convergence tolerance for volatility iteration */
    CONVERGENCE_TOLERANCE: 0.000001,

    /** Maximum iterations for volatility calculation */
    MAX_ITERATIONS: 100,

    /** Glicko-2 scaling factor: 173.7178 = 400/ln(10) */
    SCALE: 173.7178,

    /** RD confidence thresholds for UI display */
    CONFIDENCE: {
        /** Very confident in rating */
        HIGH: 75,
        /** Moderately confident */
        MEDIUM: 150,
        /** Low confidence */
        LOW: 250
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
