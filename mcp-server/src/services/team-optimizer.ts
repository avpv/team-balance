/**
 * Team Optimizer Service
 * Simplified implementation for MCP server
 * Uses greedy algorithm + local search for team balancing
 */

import type { Player, Team, TeamsResult, ActivityConfig } from '../types.js';
import { RATING_CONSTANTS, BALANCE_THRESHOLDS } from '../config/rating.js';

interface PlayerWithAssignment extends Player {
  assignedPosition: string;
}

interface Slot {
  teamIndex: number;
  position: string;
  player: PlayerWithAssignment | null;
}

export class TeamOptimizer {
  private config: ActivityConfig;
  private DEFAULT_RATING = RATING_CONSTANTS.DEFAULT;

  constructor(config: ActivityConfig) {
    this.config = config;
  }

  /**
   * Get player rating for a position
   */
  private getPlayerRating(player: Player, position: string): number {
    return player.ratings?.[position] || this.DEFAULT_RATING;
  }

  /**
   * Calculate team total rating
   */
  private calculateTeamRating(team: PlayerWithAssignment[]): number {
    return team.reduce((sum, player) => {
      const rating = this.getPlayerRating(player, player.assignedPosition);
      const weight = this.config.positionWeights[player.assignedPosition] || 1.0;
      return sum + rating * weight;
    }, 0);
  }

  /**
   * Calculate balance score (lower is better)
   */
  private calculateBalanceScore(teams: PlayerWithAssignment[][]): number {
    if (teams.length < 2) return 0;

    const ratings = teams.map(team => this.calculateTeamRating(team));
    const max = Math.max(...ratings);
    const min = Math.min(...ratings);
    return max - min;
  }

  /**
   * Check if player can play position
   */
  private canPlayPosition(player: Player, position: string): boolean {
    return player.positions.includes(position);
  }

  /**
   * Generate initial solution using greedy algorithm
   */
  private generateGreedySolution(
    composition: Record<string, number>,
    teamCount: number,
    players: Player[]
  ): { teams: PlayerWithAssignment[][]; unassigned: Player[] } {
    // Create slots for each team and position
    const slots: Slot[] = [];
    for (let t = 0; t < teamCount; t++) {
      for (const [position, count] of Object.entries(composition)) {
        for (let i = 0; i < count; i++) {
          slots.push({ teamIndex: t, position, player: null });
        }
      }
    }

    // Sort players by their best rating (descending)
    const availablePlayers = [...players].sort((a, b) => {
      const aMax = Math.max(...a.positions.map(p => this.getPlayerRating(a, p)));
      const bMax = Math.max(...b.positions.map(p => this.getPlayerRating(b, p)));
      return bMax - aMax;
    });

    const assignedPlayerIds = new Set<string>();

    // Assign players to slots using round-robin by team
    for (const position of this.config.positionOrder) {
      // Get all slots for this position, ordered by team
      const positionSlots = slots.filter(s => s.position === position && !s.player);

      // Get eligible players sorted by rating for this position
      const eligiblePlayers = availablePlayers
        .filter(p => !assignedPlayerIds.has(p.id) && this.canPlayPosition(p, position))
        .sort((a, b) => this.getPlayerRating(b, position) - this.getPlayerRating(a, position));

      // Assign in round-robin fashion to balance teams
      for (let i = 0; i < positionSlots.length && i < eligiblePlayers.length; i++) {
        const slot = positionSlots[i];
        const player = eligiblePlayers[i];

        slot.player = {
          ...player,
          assignedPosition: position
        };
        assignedPlayerIds.add(player.id);
      }
    }

    // Build teams from slots
    const teams: PlayerWithAssignment[][] = Array.from({ length: teamCount }, () => []);
    for (const slot of slots) {
      if (slot.player) {
        teams[slot.teamIndex].push(slot.player);
      }
    }

    // Find unassigned players
    const unassigned = players.filter(p => !assignedPlayerIds.has(p.id));

    return { teams, unassigned };
  }

  /**
   * Local search improvement
   */
  private localSearchImprovement(
    teams: PlayerWithAssignment[][],
    maxIterations: number = 100
  ): PlayerWithAssignment[][] {
    let bestTeams = teams.map(team => [...team]);
    let bestScore = this.calculateBalanceScore(bestTeams);

    for (let iter = 0; iter < maxIterations; iter++) {
      let improved = false;

      // Try swapping players between teams
      for (let t1 = 0; t1 < teams.length; t1++) {
        for (let t2 = t1 + 1; t2 < teams.length; t2++) {
          for (let p1 = 0; p1 < bestTeams[t1].length; p1++) {
            for (let p2 = 0; p2 < bestTeams[t2].length; p2++) {
              const player1 = bestTeams[t1][p1];
              const player2 = bestTeams[t2][p2];

              // Check if swap is valid (same position or both can play each other's position)
              if (player1.assignedPosition === player2.assignedPosition ||
                  (this.canPlayPosition(player1, player2.assignedPosition) &&
                   this.canPlayPosition(player2, player1.assignedPosition))) {

                // Try swap
                const newTeams = bestTeams.map(team => [...team]);

                if (player1.assignedPosition === player2.assignedPosition) {
                  // Simple swap
                  newTeams[t1][p1] = player2;
                  newTeams[t2][p2] = player1;
                } else {
                  // Swap with position change
                  newTeams[t1][p1] = { ...player2, assignedPosition: player1.assignedPosition };
                  newTeams[t2][p2] = { ...player1, assignedPosition: player2.assignedPosition };
                }

                const newScore = this.calculateBalanceScore(newTeams);
                if (newScore < bestScore) {
                  bestTeams = newTeams;
                  bestScore = newScore;
                  improved = true;
                }
              }
            }
          }
        }
      }

      if (!improved) break;
    }

    return bestTeams;
  }

  /**
   * Main optimization method
   */
  optimize(
    composition: Record<string, number>,
    teamCount: number,
    players: Player[]
  ): TeamsResult {
    // Validate input
    const totalSlotsNeeded = Object.values(composition).reduce((a, b) => a + b, 0) * teamCount;
    if (players.length < totalSlotsNeeded) {
      // We'll proceed with what we have
    }

    // Generate initial solution
    const { teams: initialTeams, unassigned } = this.generateGreedySolution(
      composition,
      teamCount,
      players
    );

    // Improve with local search
    const optimizedTeams = this.localSearchImprovement(initialTeams);

    // Calculate final statistics
    const teamResults: Team[] = optimizedTeams.map(team => {
      const totalRating = this.calculateTeamRating(team);
      return {
        players: team,
        totalRating: Math.round(totalRating),
        averageRating: team.length > 0 ? Math.round(totalRating / team.length) : 0
      };
    });

    const ratings = teamResults.map(t => t.totalRating);
    const maxDiff = Math.max(...ratings) - Math.min(...ratings);

    return {
      teams: teamResults,
      quality: {
        balance: maxDiff === 0 ? 1 : Math.max(0, 1 - maxDiff / 1000),
        maxDifference: maxDiff,
        isBalanced: maxDiff < BALANCE_THRESHOLDS.TEAM_BALANCED
      },
      unassigned
    };
  }
}

export default TeamOptimizer;
