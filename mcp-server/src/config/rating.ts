/**
 * Rating System Configuration
 * Ported from src/config/rating.js
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
  PROBABILITY_BASE: 10
};

export const K_FACTORS = {
  /** Base K-factor for experienced players */
  BASE: 30,
  /** High K-factor for new players (< 20 comparisons) */
  NOVICE: 40,
  /** Low K-factor for masters (> 2000 rating, > 50 comparisons) */
  MASTER: 15,
  /** Low K-factor for experts (> 1800 rating, > 30 comparisons) */
  EXPERT: 20,
  /** Experience thresholds */
  THRESHOLDS: {
    NOVICE_COMPARISONS: 20,
    EXPERT_COMPARISONS: 30,
    MASTER_COMPARISONS: 50,
    EXPERT_RATING: 1800,
    MASTER_RATING: 2000
  }
};

export const POOL_ADJUSTMENT = {
  /** Reference pool size for baseline adjustments */
  REFERENCE_SIZE: 15,
  /** Minimum adjustment factor */
  MIN_FACTOR: 0.5,
  /** Maximum adjustment factor */
  MAX_FACTOR: 2.0
};

export const BALANCE_THRESHOLDS = {
  /** Rating difference for "balanced" 1v1 matchup */
  MATCHUP_BALANCED: 200,
  /** Maximum weighted rating difference for balanced teams */
  TEAM_BALANCED: 350,
  /** Thresholds for balance quality indicators */
  QUALITY: {
    EXCELLENT: 100,
    GOOD: 200,
    FAIR: 300,
    POOR: 500
  }
};

export const CONFIDENCE_LEVELS = {
  VERY_LOW: 0,
  LOW: 20,
  MEDIUM: 40,
  HIGH: 60,
  VERY_HIGH: 80
};

export default {
  RATING_CONSTANTS,
  K_FACTORS,
  POOL_ADJUSTMENT,
  BALANCE_THRESHOLDS,
  CONFIDENCE_LEVELS
};
