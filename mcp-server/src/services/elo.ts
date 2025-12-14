/**
 * ELO Service - Rating calculations
 * Ported from src/services/EloService.js
 */

import { RATING_CONSTANTS, K_FACTORS, POOL_ADJUSTMENT, BALANCE_THRESHOLDS } from '../config/rating.js';
import type { Player, RatingChangeResult } from '../types.js';

export class EloService {
  private DEFAULT_RATING = RATING_CONSTANTS.DEFAULT;
  private RATING_DIVISOR = RATING_CONSTANTS.RATING_DIVISOR;
  private PROBABILITY_BASE = RATING_CONSTANTS.PROBABILITY_BASE;

  /**
   * Calculate expected match outcome (standard ELO probability)
   */
  calculateExpectedScore(playerRating: number, opponentRating: number): number {
    const ratingDifference = opponentRating - playerRating;
    return 1 / (1 + Math.pow(this.PROBABILITY_BASE, ratingDifference / this.RATING_DIVISOR));
  }

  /**
   * Dynamic K-factor based on experience and skill level
   */
  calculateKFactor(comparisons: number, rating: number): number {
    const thresholds = K_FACTORS.THRESHOLDS;

    if (comparisons < thresholds.NOVICE_COMPARISONS) {
      return K_FACTORS.NOVICE;
    }

    if (rating > thresholds.MASTER_RATING && comparisons > thresholds.MASTER_COMPARISONS) {
      return K_FACTORS.MASTER;
    }

    if (rating > thresholds.EXPERT_RATING && comparisons > thresholds.EXPERT_COMPARISONS) {
      return K_FACTORS.EXPERT;
    }

    return K_FACTORS.BASE;
  }

  /**
   * Pool-size adjusted K-factor for fair ELO distribution
   */
  calculatePoolAdjustedKFactor(baseK: number, poolSize: number): number {
    if (poolSize <= 1) return baseK;

    const adjustmentFactor = Math.sqrt(POOL_ADJUSTMENT.REFERENCE_SIZE / poolSize);
    const boundedFactor = Math.max(
      POOL_ADJUSTMENT.MIN_FACTOR,
      Math.min(POOL_ADJUSTMENT.MAX_FACTOR, adjustmentFactor)
    );

    return Math.round(baseK * boundedFactor);
  }

  /**
   * Calculate rating changes after a comparison
   */
  calculateRatingChange(
    winner: Player,
    loser: Player,
    position: string,
    poolSize?: number
  ): RatingChangeResult {
    const winnerRating = winner.ratings?.[position] || this.DEFAULT_RATING;
    const loserRating = loser.ratings?.[position] || this.DEFAULT_RATING;
    const winnerComparisons = winner.comparisons?.[position] || 0;
    const loserComparisons = loser.comparisons?.[position] || 0;

    const winnerExpected = this.calculateExpectedScore(winnerRating, loserRating);
    const loserExpected = this.calculateExpectedScore(loserRating, winnerRating);

    const winnerBaseK = this.calculateKFactor(winnerComparisons, winnerRating);
    const loserBaseK = this.calculateKFactor(loserComparisons, loserRating);

    let winnerK = winnerBaseK;
    let loserK = loserBaseK;

    if (poolSize && poolSize > 1) {
      winnerK = this.calculatePoolAdjustedKFactor(winnerBaseK, poolSize);
      loserK = this.calculatePoolAdjustedKFactor(loserBaseK, poolSize);
    }

    const winnerChange = winnerK * (1 - winnerExpected);
    const loserChange = loserK * (0 - loserExpected);

    return {
      winner: {
        oldRating: winnerRating,
        newRating: winnerRating + winnerChange,
        change: winnerChange,
        kFactor: winnerK,
        expected: winnerExpected
      },
      loser: {
        oldRating: loserRating,
        newRating: loserRating + loserChange,
        change: loserChange,
        kFactor: loserK,
        expected: loserExpected
      }
    };
  }

  /**
   * Calculate rating changes for a draw
   */
  calculateDrawRatingChange(
    player1: Player,
    player2: Player,
    position: string,
    poolSize?: number
  ): { player1: RatingChangeResult['winner']; player2: RatingChangeResult['winner'] } {
    const p1Rating = player1.ratings?.[position] || this.DEFAULT_RATING;
    const p2Rating = player2.ratings?.[position] || this.DEFAULT_RATING;
    const p1Comparisons = player1.comparisons?.[position] || 0;
    const p2Comparisons = player2.comparisons?.[position] || 0;

    const p1Expected = this.calculateExpectedScore(p1Rating, p2Rating);
    const p2Expected = this.calculateExpectedScore(p2Rating, p1Rating);

    const p1BaseK = this.calculateKFactor(p1Comparisons, p1Rating);
    const p2BaseK = this.calculateKFactor(p2Comparisons, p2Rating);

    let p1K = p1BaseK;
    let p2K = p2BaseK;

    if (poolSize && poolSize > 1) {
      p1K = this.calculatePoolAdjustedKFactor(p1BaseK, poolSize);
      p2K = this.calculatePoolAdjustedKFactor(p2BaseK, poolSize);
    }

    const p1Change = p1K * (0.5 - p1Expected);
    const p2Change = p2K * (0.5 - p2Expected);

    return {
      player1: {
        oldRating: p1Rating,
        newRating: p1Rating + p1Change,
        change: p1Change,
        kFactor: p1K,
        expected: p1Expected
      },
      player2: {
        oldRating: p2Rating,
        newRating: p2Rating + p2Change,
        change: p2Change,
        kFactor: p2K,
        expected: p2Expected
      }
    };
  }

  /**
   * Calculate team strength
   */
  calculateTeamStrength(players: (Player & { assignedPosition?: string })[]): {
    totalRating: number;
    averageRating: number;
    playerCount: number;
  } {
    if (!players || players.length === 0) {
      return { totalRating: 0, averageRating: 0, playerCount: 0 };
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
   * Evaluate balance between teams
   */
  evaluateBalance(teams: (Player & { assignedPosition?: string })[][]): {
    isBalanced: boolean;
    maxDifference: number;
    teams: { index: number; totalRating: number; averageRating: number }[];
  } {
    if (!teams || teams.length < 2) {
      return { isBalanced: true, maxDifference: 0, teams: [] };
    }

    const teamStats = teams.map(team => this.calculateTeamStrength(team));
    const ratings = teamStats.map(stats => stats.totalRating);

    const maxRating = Math.max(...ratings);
    const minRating = Math.min(...ratings);
    const maxDifference = maxRating - minRating;

    return {
      isBalanced: maxDifference < BALANCE_THRESHOLDS.TEAM_BALANCED,
      maxDifference: Math.round(maxDifference),
      teams: teamStats.map((stats, index) => ({ index, ...stats }))
    };
  }

  /**
   * Get player's best position
   */
  getBestPosition(player: Player): { position: string; rating: number } | null {
    if (!player.ratings || !player.positions || player.positions.length === 0) {
      return null;
    }

    let bestPosition = player.positions[0];
    let bestRating = player.ratings[bestPosition] || this.DEFAULT_RATING;

    player.positions.forEach(pos => {
      const rating = player.ratings[pos] || this.DEFAULT_RATING;
      if (rating > bestRating) {
        bestRating = rating;
        bestPosition = pos;
      }
    });

    return { position: bestPosition, rating: bestRating };
  }
}

export const eloService = new EloService();
export default eloService;
