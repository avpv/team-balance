/**
 * Comparison Service
 * Handles comparison logic and next comparison suggestions
 */

import type { Player, NextComparison, Session } from '../types.js';
import { storage } from './storage.js';
import { eloService } from './elo.js';

export class ComparisonService {
  /**
   * Find the next best comparison for a session
   * Prioritizes pairs that haven't been compared yet
   */
  getNextComparison(sessionId: string, position?: string): NextComparison | null {
    const session = storage.getSession(sessionId);
    if (!session || session.players.length < 2) return null;

    // Get all possible positions if not specified
    const positions = position
      ? [position]
      : [...new Set(session.players.flatMap(p => p.positions))];

    let bestPair: NextComparison | null = null;
    let bestPriority = -1;

    for (const pos of positions) {
      // Get players who can play this position
      const eligiblePlayers = session.players.filter(p => p.positions.includes(pos));
      if (eligiblePlayers.length < 2) continue;

      // Find pairs that haven't been compared
      for (let i = 0; i < eligiblePlayers.length; i++) {
        for (let j = i + 1; j < eligiblePlayers.length; j++) {
          const p1 = eligiblePlayers[i];
          const p2 = eligiblePlayers[j];

          // Check if already compared for this position
          const alreadyCompared =
            (p1.comparedWith?.[pos]?.includes(p2.id)) ||
            (p2.comparedWith?.[pos]?.includes(p1.id));

          // Calculate priority (higher = more important to compare)
          let priority = 0;
          let reason = '';

          if (!alreadyCompared) {
            priority += 100; // Never compared = highest priority
            reason = 'Never compared';
          }

          // Bonus for players with fewer comparisons (need more data)
          const p1Comparisons = p1.comparisons?.[pos] || 0;
          const p2Comparisons = p2.comparisons?.[pos] || 0;
          const minComparisons = Math.min(p1Comparisons, p2Comparisons);

          if (minComparisons < 5) {
            priority += (5 - minComparisons) * 10;
            if (!reason) reason = 'Low comparison count';
          }

          // Bonus for close ratings (uncertain outcome)
          const p1Rating = p1.ratings?.[pos] || 1500;
          const p2Rating = p2.ratings?.[pos] || 1500;
          const ratingDiff = Math.abs(p1Rating - p2Rating);

          if (ratingDiff < 100) {
            priority += 20;
            if (!reason) reason = 'Close ratings';
          }

          if (priority > bestPriority) {
            bestPriority = priority;
            bestPair = {
              player1: p1,
              player2: p2,
              position: pos,
              priority,
              reason: reason || 'Standard comparison'
            };
          }
        }
      }
    }

    return bestPair;
  }

  /**
   * Record a comparison result
   */
  recordComparison(
    sessionId: string,
    player1Id: string,
    player2Id: string,
    winnerId: string | null, // null = draw
    position: string
  ): { success: boolean; ratingChanges: any; error?: string } {
    const session = storage.getSession(sessionId);
    if (!session) {
      return { success: false, ratingChanges: null, error: 'Session not found' };
    }

    const player1 = session.players.find(p => p.id === player1Id);
    const player2 = session.players.find(p => p.id === player2Id);

    if (!player1 || !player2) {
      return { success: false, ratingChanges: null, error: 'Player not found' };
    }

    if (!player1.positions.includes(position) || !player2.positions.includes(position)) {
      return { success: false, ratingChanges: null, error: 'Invalid position for player' };
    }

    // Calculate pool size for K-factor adjustment
    const poolSize = session.players.filter(p => p.positions.includes(position)).length;

    // Calculate rating changes
    let ratingChanges: any;

    if (winnerId === null) {
      // Draw
      ratingChanges = eloService.calculateDrawRatingChange(player1, player2, position, poolSize);
    } else {
      const winner = winnerId === player1Id ? player1 : player2;
      const loser = winnerId === player1Id ? player2 : player1;
      const result = eloService.calculateRatingChange(winner, loser, position, poolSize);

      ratingChanges = {
        player1: winnerId === player1Id ? result.winner : result.loser,
        player2: winnerId === player2Id ? result.winner : result.loser
      };
    }

    // Update player ratings
    storage.updatePlayer(sessionId, player1Id, {
      ratings: {
        ...player1.ratings,
        [position]: ratingChanges.player1.newRating
      },
      comparisons: {
        ...player1.comparisons,
        [position]: (player1.comparisons?.[position] || 0) + 1
      },
      comparedWith: {
        ...player1.comparedWith,
        [position]: [...(player1.comparedWith?.[position] || []), player2Id]
      }
    });

    storage.updatePlayer(sessionId, player2Id, {
      ratings: {
        ...player2.ratings,
        [position]: ratingChanges.player2.newRating
      },
      comparisons: {
        ...player2.comparisons,
        [position]: (player2.comparisons?.[position] || 0) + 1
      },
      comparedWith: {
        ...player2.comparedWith,
        [position]: [...(player2.comparedWith?.[position] || []), player1Id]
      }
    });

    // Record comparison
    storage.addComparison(sessionId, {
      player1Id,
      player2Id,
      position,
      winnerId,
      ratingChanges: {
        player1: {
          oldRating: ratingChanges.player1.oldRating,
          newRating: ratingChanges.player1.newRating,
          change: ratingChanges.player1.change
        },
        player2: {
          oldRating: ratingChanges.player2.oldRating,
          newRating: ratingChanges.player2.newRating,
          change: ratingChanges.player2.change
        }
      }
    });

    return { success: true, ratingChanges };
  }

  /**
   * Get rankings for a session
   */
  getRankings(
    sessionId: string,
    position?: string
  ): { position: string; rankings: any[] }[] {
    const session = storage.getSession(sessionId);
    if (!session) return [];

    const positions = position
      ? [position]
      : [...new Set(session.players.flatMap(p => p.positions))];

    return positions.map(pos => {
      const playersForPosition = session.players
        .filter(p => p.positions.includes(pos))
        .map(p => ({
          id: p.id,
          name: p.name,
          rating: p.ratings?.[pos] || 1500,
          comparisons: p.comparisons?.[pos] || 0
        }))
        .sort((a, b) => b.rating - a.rating)
        .map((p, index) => ({ ...p, rank: index + 1 }));

      return {
        position: pos,
        rankings: playersForPosition
      };
    });
  }

  /**
   * Get comparison statistics for a session
   */
  getComparisonStats(sessionId: string): {
    totalComparisons: number;
    completedPairs: number;
    totalPossiblePairs: number;
    completionPercentage: number;
    byPosition: Record<string, { completed: number; total: number }>;
  } {
    const session = storage.getSession(sessionId);
    if (!session) {
      return {
        totalComparisons: 0,
        completedPairs: 0,
        totalPossiblePairs: 0,
        completionPercentage: 0,
        byPosition: {}
      };
    }

    const positions = [...new Set(session.players.flatMap(p => p.positions))];
    const byPosition: Record<string, { completed: number; total: number }> = {};

    let totalCompleted = 0;
    let totalPossible = 0;

    for (const pos of positions) {
      const playersForPosition = session.players.filter(p => p.positions.includes(pos));
      const n = playersForPosition.length;
      const possiblePairs = (n * (n - 1)) / 2;

      // Count completed pairs
      const completedPairs = new Set<string>();
      for (const player of playersForPosition) {
        const comparedWith = player.comparedWith?.[pos] || [];
        for (const otherId of comparedWith) {
          const pairKey = [player.id, otherId].sort().join(':');
          completedPairs.add(pairKey);
        }
      }

      byPosition[pos] = {
        completed: completedPairs.size,
        total: possiblePairs
      };

      totalCompleted += completedPairs.size;
      totalPossible += possiblePairs;
    }

    return {
      totalComparisons: session.comparisons.length,
      completedPairs: totalCompleted,
      totalPossiblePairs: totalPossible,
      completionPercentage: totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0,
      byPosition
    };
  }
}

export const comparisonService = new ComparisonService();
export default comparisonService;
