/**
 * Type definitions for TeamBalance MCP Server
 */

/** Position ratings map (position code -> rating) */
export type PositionRatings = Record<string, number>;

/** Position comparisons count map */
export type PositionComparisons = Record<string, number>;

/** Compared players tracking */
export type ComparedWith = Record<string, string[]>;

/** Player object */
export interface Player {
  id: string;
  name: string;
  positions: string[];
  ratings: PositionRatings;
  comparisons: PositionComparisons;
  comparedWith: ComparedWith;
  createdAt: string;
  updatedAt: string;
}

/** Comparison record */
export interface Comparison {
  id: string;
  player1Id: string;
  player2Id: string;
  position: string;
  winnerId: string | null; // null = draw
  timestamp: string;
  ratingChanges: {
    player1: { oldRating: number; newRating: number; change: number };
    player2: { oldRating: number; newRating: number; change: number };
  };
}

/** Session object */
export interface Session {
  id: string;
  activity: string;
  name: string;
  players: Player[];
  comparisons: Comparison[];
  createdAt: string;
  updatedAt: string;
}

/** Activity configuration */
export interface ActivityConfig {
  name: string;
  positions: Record<string, string>;
  positionWeights: Record<string, number>;
  positionOrder: string[];
  defaultComposition: Record<string, number>;
}

/** Team result after optimization */
export interface Team {
  players: (Player & { assignedPosition: string })[];
  totalRating: number;
  averageRating: number;
}

/** Teams optimization result */
export interface TeamsResult {
  teams: Team[];
  quality: {
    balance: number;
    maxDifference: number;
    isBalanced: boolean;
  };
  unassigned: Player[];
}

/** Rating change result */
export interface RatingChangeResult {
  winner: {
    oldRating: number;
    newRating: number;
    change: number;
    kFactor: number;
    expected: number;
  };
  loser: {
    oldRating: number;
    newRating: number;
    change: number;
    kFactor: number;
    expected: number;
  };
}

/** Storage state */
export interface StorageState {
  sessions: Record<string, Session>;
  activeSessionId: string | null;
  version: string;
}

/** Next comparison suggestion */
export interface NextComparison {
  player1: Player;
  player2: Player;
  position: string;
  priority: number;
  reason: string;
}

/** Player ranking entry */
export interface PlayerRanking {
  player: Player;
  position: string;
  rating: number;
  comparisons: number;
  rank: number;
  percentile: number;
}
