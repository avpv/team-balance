// src/services/TransitivityService.js

/**
 * TransitivityService - Detects contradictions in player comparisons
 *
 * A transitivity violation occurs when:
 *   A beats B, B beats C, but C beats A
 *
 * This creates a cycle that makes accurate ranking impossible.
 * Detecting these cycles helps users identify inconsistent evaluations
 * and re-compare the problematic players for more accurate ratings.
 */
class TransitivityService {
    /**
     * @param {PlayerRepository} playerRepository - Player data repository
     */
    constructor(playerRepository) {
        this.playerRepository = playerRepository;
    }

    /**
     * Detect all transitivity violations (cycles of length 3) at a given position.
     *
     * Algorithm: Build a directed graph of comparison results (winner → loser),
     * then find all 3-node cycles (A→B→C→A).
     *
     * @param {string} position - Position to check
     * @returns {Array<Object>} Array of violations, each with { players: [A, B, C], cycle: string }
     */
    detectViolations(position) {
        const players = this.playerRepository.getByPosition(position);
        if (players.length < 3) return [];

        // Build directed graph: wins[winnerId] = Set of loserIds
        const wins = this._buildWinGraph(players, position);
        const playerMap = new Map(players.map(p => [p.id, p]));

        const violations = [];
        const seen = new Set();
        const playerIds = players.map(p => p.id);

        // Check all triplets for cycles
        for (let i = 0; i < playerIds.length; i++) {
            for (let j = i + 1; j < playerIds.length; j++) {
                for (let k = j + 1; k < playerIds.length; k++) {
                    const a = playerIds[i];
                    const b = playerIds[j];
                    const c = playerIds[k];

                    const cycle = this._findCycleInTriplet(a, b, c, wins);
                    if (cycle) {
                        const key = cycle.map(id => id).sort().join('|');
                        if (!seen.has(key)) {
                            seen.add(key);
                            violations.push({
                                players: cycle.map(id => ({
                                    id,
                                    name: playerMap.get(id)?.name || id
                                })),
                                cycle: cycle.map(id => playerMap.get(id)?.name || id).join(' > ') +
                                    ' > ' + (playerMap.get(cycle[0])?.name || cycle[0])
                            });
                        }
                    }
                }
            }
        }

        return violations;
    }

    /**
     * Check if a specific comparison would create a new transitivity violation.
     * Call this BEFORE recording a comparison to warn the user.
     *
     * @param {string} winnerId - Proposed winner
     * @param {string} loserId - Proposed loser
     * @param {string} position - Position being compared
     * @returns {Object|null} Violation info if one would be created, null otherwise
     */
    wouldCreateViolation(winnerId, loserId, position) {
        const players = this.playerRepository.getByPosition(position);
        if (players.length < 3) return null;

        const wins = this._buildWinGraph(players, position);
        const playerMap = new Map(players.map(p => [p.id, p]));

        // Temporarily add the proposed result
        if (!wins.has(winnerId)) wins.set(winnerId, new Set());
        wins.get(winnerId).add(loserId);

        // Check if this creates a cycle through the two involved players
        // Look for: winnerId → loserId → ... → winnerId (cycle through the new edge)
        const cycle = this._findCycleThroughEdge(winnerId, loserId, wins, players);

        if (cycle) {
            return {
                players: cycle.map(id => ({
                    id,
                    name: playerMap.get(id)?.name || id
                })),
                cycle: cycle.map(id => playerMap.get(id)?.name || id).join(' > ') +
                    ' > ' + (playerMap.get(cycle[0])?.name || cycle[0])
            };
        }

        return null;
    }

    /**
     * Get the count of violations at each position.
     *
     * @param {Array<string>} positions - Position codes to check
     * @returns {Object} Map of position → violation count
     */
    getViolationCounts(positions) {
        const counts = {};
        for (const pos of positions) {
            counts[pos] = this.detectViolations(pos).length;
        }
        return counts;
    }

    /**
     * Build a directed graph of wins from comparison history.
     * Uses comparedWith to know which pairs were compared,
     * and rating changes to infer who won (higher rating = more wins).
     *
     * Since we don't store win/loss per pair explicitly, we reconstruct
     * the graph from the comparedWith lists. For each pair (A, B) that
     * has been compared at this position, the one with higher rating
     * is considered the winner. For draws, no edge is added.
     *
     * @private
     * @param {Array} players - All players at this position
     * @param {string} position - Position code
     * @returns {Map} wins map: winnerId → Set(loserIds)
     */
    _buildWinGraph(players, position) {
        const wins = new Map();
        const playerByName = new Map(players.map(p => [p.name, p]));

        for (const player of players) {
            const compared = player.comparedWith?.[position] || [];
            for (const opponentName of compared) {
                const opponent = playerByName.get(opponentName);
                if (!opponent) continue;

                // Avoid processing the same pair twice
                if (player.id > opponent.id) continue;

                const playerRating = player.ratings?.[position] || 1500;
                const opponentRating = opponent.ratings?.[position] || 1500;

                // The player with higher rating after comparison is considered the winner.
                // For equal ratings (draw result), no directional edge.
                if (playerRating > opponentRating) {
                    if (!wins.has(player.id)) wins.set(player.id, new Set());
                    wins.get(player.id).add(opponent.id);
                } else if (opponentRating > playerRating) {
                    if (!wins.has(opponent.id)) wins.set(opponent.id, new Set());
                    wins.get(opponent.id).add(player.id);
                }
            }
        }

        return wins;
    }

    /**
     * Find a 3-node cycle among three players in the win graph.
     * @private
     */
    _findCycleInTriplet(a, b, c, wins) {
        const aWins = wins.get(a) || new Set();
        const bWins = wins.get(b) || new Set();
        const cWins = wins.get(c) || new Set();

        // Check A→B→C→A
        if (aWins.has(b) && bWins.has(c) && cWins.has(a)) {
            return [a, b, c];
        }
        // Check A→C→B→A
        if (aWins.has(c) && cWins.has(b) && bWins.has(a)) {
            return [a, c, b];
        }

        return null;
    }

    /**
     * Find a cycle that goes through a specific new edge (winner → loser).
     * We only need to check for 3-cycles since those are the most meaningful.
     * @private
     */
    _findCycleThroughEdge(winnerId, loserId, wins, players) {
        const loserWins = wins.get(loserId) || new Set();

        // Check: winnerId → loserId → X → winnerId
        for (const xId of loserWins) {
            if (xId === winnerId || xId === loserId) continue;
            const xWins = wins.get(xId) || new Set();
            if (xWins.has(winnerId)) {
                return [winnerId, loserId, xId];
            }
        }

        return null;
    }
}

export default TransitivityService;
