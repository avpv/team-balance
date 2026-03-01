// src/services/ComparisonService.js (Refactored)

/**
 * ComparisonService - Player comparison logic
 *
 * Responsibilities (REFACTORED):
 * - Find optimal pairs for comparison
 * - Process comparison results
 * - Track comparison progress
 * - Coordinate rating updates
 *
 * What changed:
 * - Removed direct StateManager access (now uses PlayerRepository)
 * - Split long methods into smaller focused methods
 * - Removed data manipulation (now uses PlayerRepository)
 * - Added validation through ValidationService
 * - Extracted rating update logic
 *
 * Benefits:
 * - Single Responsibility Principle
 * - Easier to test
 * - Cleaner code
 * - Better separation of concerns
 */

class ComparisonService {
    /**
     * @param {Object} activityConfig - Activity configuration
     * @param {PlayerRepository} playerRepository - Player data repository
     * @param {ValidationService} validationService - Validation service
     * @param {EloService} eloService - ELO rating service
     * @param {EventBus} eventBus - Event bus
     */
    constructor(activityConfig, playerRepository, validationService, eloService, eventBus) {
        this.config = activityConfig;
        this.playerRepository = playerRepository;
        this.validationService = validationService;
        this.eloService = eloService;
        this.eventBus = eventBus;
    }

    /**
     * Find next pair for comparison at position
     * Deterministic - returns same pair for same state
     *
     * @param {string} position - Position to compare
     * @returns {Array|null} Pair of players or null if no valid pair
     */
    findNextPair(position) {
        const players = this.playerRepository.getByPosition(position);

        if (players.length < 2) {
            return null;
        }

        // Find players with minimum comparisons
        const minComparisons = Math.min(
            ...players.map(p => p.comparisons[position] || 0)
        );

        let pool = players.filter(
            p => (p.comparisons[position] || 0) === minComparisons
        );

        // Sort deterministically by ID
        pool.sort((a, b) => a.id - b.id);

        let pair = this.findValidPair(pool, position);

        if (!pair) {
            // Try all players sorted by comparisons
            const allPlayers = [...players].sort((a, b) => {
                const compDiff = (a.comparisons[position] || 0) - (b.comparisons[position] || 0);
                return compDiff !== 0 ? compDiff : a.id - b.id;
            });

            pair = this.findValidPair(allPlayers, position);
        }

        return pair;
    }

    /**
     * Find valid pair (not yet compared)
     * @private
     */
    findValidPair(players, position) {
        for (let i = 0; i < players.length; i++) {
            for (let j = i + 1; j < players.length; j++) {
                const p1 = players[i];
                const p2 = players[j];

                if (this.canCompare(p1, p2, position)) {
                    return [p1, p2];
                }
            }
        }

        return null;
    }

    /**
     * Check if two players can be compared at position
     * @private
     */
    canCompare(player1, player2, position) {
        const p1Compared = player1.comparedWith[position] || [];
        const p2Compared = player2.comparedWith[position] || [];

        return !p1Compared.includes(player2.name) &&
               !p2Compared.includes(player1.name);
    }

    /**
     * Check if position is ready for comparisons
     *
     * @param {string} position - Position to check
     * @returns {Object} Status information
     */
    checkStatus(position) {
        const players = this.playerRepository.getByPosition(position);

        if (players.length < 2) {
            return {
                canCompare: false,
                reason: `Need at least 2 players for comparison. Currently ${players.length} player${players.length === 1 ? '' : 's'} at this position.`,
                playerCount: players.length,
                insufficientPlayers: true
            };
        }

        const pair = this.findNextPair(position);

        if (!pair) {
            return {
                canCompare: false,
                reason: 'All comparisons have been completed for this position.',
                playerCount: players.length,
                allPairsCompared: true
            };
        }

        return {
            canCompare: true,
            playerCount: players.length,
            nextPair: pair
        };
    }

    /**
     * Process a comparison
     *
     * @param {string} winnerId - Winner player ID
     * @param {string} loserId - Loser player ID
     * @param {string} position - Position being compared
     * @returns {Object} Comparison result
     * @throws {Error} If validation fails
     */
    processComparison(winnerId, loserId, position) {
        // Validate input
        this.validateComparisonInput(winnerId, loserId, position);

        // Get players
        const winner = this.playerRepository.getById(winnerId);
        const loser = this.playerRepository.getById(loserId);

        // Validate players exist and have required data
        this.validatePlayers(winner, loser, position);

        // Check if already compared
        this.checkAlreadyCompared(winner, loser, position);

        // Calculate rating changes
        const poolSize = this.playerRepository.countByPosition(position);
        const changes = this.eloService.calculateRatingChange(
            winner,
            loser,
            position,
            poolSize
        );

        // Update player data
        this.updatePlayersAfterComparison(
            winnerId,
            loserId,
            position,
            changes,
            winner.name,
            loser.name
        );

        // Get updated players
        const updatedWinner = this.playerRepository.getById(winnerId);
        const updatedLoser = this.playerRepository.getById(loserId);

        // Build result
        const result = {
            winner: updatedWinner,
            loser: updatedLoser,
            position,
            changes
        };

        // Emit event
        this.eventBus.emit('comparison:completed', result);

        return result;
    }

    /**
     * Process a Win-Win comparison
     * Both players receive equal points (0.5 each)
     *
     * @param {string} player1Id - First player ID
     * @param {string} player2Id - Second player ID
     * @param {string} position - Position being compared
     * @returns {Object} Comparison result
     * @throws {Error} If validation fails
     */
    processDraw(player1Id, player2Id, position) {
        // Validate input
        this.validateComparisonInput(player1Id, player2Id, position);

        // Get players
        const player1 = this.playerRepository.getById(player1Id);
        const player2 = this.playerRepository.getById(player2Id);

        // Validate players exist and have required data
        this.validatePlayers(player1, player2, position);

        // Check if already compared
        this.checkAlreadyCompared(player1, player2, position);

        // Calculate rating changes for Win-Win
        const poolSize = this.playerRepository.countByPosition(position);
        const changes = this.eloService.calculateDrawRatingChange(
            player1,
            player2,
            position,
            poolSize
        );

        // Update player data
        this.updatePlayersAfterDraw(
            player1Id,
            player2Id,
            position,
            changes,
            player1.name,
            player2.name
        );

        // Get updated players
        const updatedPlayer1 = this.playerRepository.getById(player1Id);
        const updatedPlayer2 = this.playerRepository.getById(player2Id);

        // Build result
        const result = {
            player1: updatedPlayer1,
            player2: updatedPlayer2,
            position,
            changes,
            isDraw: true
        };

        // Emit event
        this.eventBus.emit('comparison:completed', result);

        return result;
    }

    /**
     * Validate comparison input
     * @private
     */
    validateComparisonInput(winnerId, loserId, position) {
        const validation = this.validationService.validateComparison(
            winnerId,
            loserId,
            position
        );

        if (!validation.isValid) {
            throw new Error(validation.errors.join(', '));
        }
    }

    /**
     * Validate that players exist and have required ratings
     * @private
     */
    validatePlayers(winner, loser, position) {
        if (!winner || !loser) {
            throw new Error('Players not found');
        }

        if (!winner.ratings[position] || !loser.ratings[position]) {
            throw new Error(`Players don't have ratings for ${position}`);
        }
    }

    /**
     * Check if players have already been compared
     * @private
     */
    checkAlreadyCompared(winner, loser, position) {
        const winnerCompared = winner.comparedWith[position] || [];

        if (winnerCompared.includes(loser.name)) {
            throw new Error('These players have already been compared at this position');
        }
    }

    /**
     * Update players after comparison
     * @private
     */
    updatePlayersAfterComparison(winnerId, loserId, position, changes, winnerName, loserName) {
        // Update both players in a single batch operation
        this.playerRepository.updateMany([
            {
                id: winnerId,
                updates: {
                    ratings: this.buildUpdatedRatings(winnerId, position, changes.winner.newRating),
                    comparisons: this.buildUpdatedComparisons(winnerId, position),
                    comparedWith: this.buildUpdatedComparedWith(winnerId, position, loserName),
                    winsAgainst: this.buildUpdatedWinsAgainst(winnerId, position, loserName),
                    rd: this.buildUpdatedRd(winnerId, position, changes.winner.newRd),
                    volatility: this.buildUpdatedVolatility(winnerId, position, changes.winner.newVolatility)
                }
            },
            {
                id: loserId,
                updates: {
                    ratings: this.buildUpdatedRatings(loserId, position, changes.loser.newRating),
                    comparisons: this.buildUpdatedComparisons(loserId, position),
                    comparedWith: this.buildUpdatedComparedWith(loserId, position, winnerName),
                    rd: this.buildUpdatedRd(loserId, position, changes.loser.newRd),
                    volatility: this.buildUpdatedVolatility(loserId, position, changes.loser.newVolatility)
                }
            }
        ]);

        // Increment session comparison counter
        this.playerRepository.incrementSessionComparison();
    }

    /**
     * Update players after Win-Win
     * @private
     */
    updatePlayersAfterDraw(player1Id, player2Id, position, changes, player1Name, player2Name) {
        // Update both players in a single batch operation
        this.playerRepository.updateMany([
            {
                id: player1Id,
                updates: {
                    ratings: this.buildUpdatedRatings(player1Id, position, changes.player1.newRating),
                    comparisons: this.buildUpdatedComparisons(player1Id, position),
                    comparedWith: this.buildUpdatedComparedWith(player1Id, position, player2Name),
                    rd: this.buildUpdatedRd(player1Id, position, changes.player1.newRd),
                    volatility: this.buildUpdatedVolatility(player1Id, position, changes.player1.newVolatility)
                }
            },
            {
                id: player2Id,
                updates: {
                    ratings: this.buildUpdatedRatings(player2Id, position, changes.player2.newRating),
                    comparisons: this.buildUpdatedComparisons(player2Id, position),
                    comparedWith: this.buildUpdatedComparedWith(player2Id, position, player1Name),
                    rd: this.buildUpdatedRd(player2Id, position, changes.player2.newRd),
                    volatility: this.buildUpdatedVolatility(player2Id, position, changes.player2.newVolatility)
                }
            }
        ]);

        // Increment session comparison counter
        this.playerRepository.incrementSessionComparison();
    }

    /**
     * Build updated ratings object
     * @private
     */
    buildUpdatedRatings(playerId, position, newRating) {
        const player = this.playerRepository.getById(playerId);
        return {
            ...player.ratings,
            [position]: newRating
        };
    }

    /**
     * Build updated comparisons object
     * @private
     */
    buildUpdatedComparisons(playerId, position) {
        const player = this.playerRepository.getById(playerId);
        return {
            ...player.comparisons,
            [position]: (player.comparisons[position] || 0) + 1
        };
    }

    /**
     * Build updated rd (Rating Deviation) object
     * @private
     */
    buildUpdatedRd(playerId, position, newRd) {
        const player = this.playerRepository.getById(playerId);
        return {
            ...(player.rd || {}),
            [position]: newRd
        };
    }

    /**
     * Build updated volatility object
     * @private
     */
    buildUpdatedVolatility(playerId, position, newVolatility) {
        const player = this.playerRepository.getById(playerId);
        return {
            ...(player.volatility || {}),
            [position]: newVolatility
        };
    }

    /**
     * Build updated winsAgainst object (tracks who this player has beaten)
     * @private
     */
    buildUpdatedWinsAgainst(playerId, position, loserName) {
        const player = this.playerRepository.getById(playerId);
        const currentWins = player.winsAgainst?.[position] || [];

        return {
            ...(player.winsAgainst || {}),
            [position]: [...new Set([...currentWins, loserName])]
        };
    }

    /**
     * Build updated comparedWith object
     * @private
     */
    buildUpdatedComparedWith(playerId, position, opponentName) {
        const player = this.playerRepository.getById(playerId);
        const currentCompared = player.comparedWith[position] || [];

        // Add opponent and remove duplicates
        return {
            ...player.comparedWith,
            [position]: [...new Set([...currentCompared, opponentName])]
        };
    }

    /**
     * Get comparison progress for position
     *
     * @param {string} position - Position to check
     * @returns {Object} Progress information
     */
    getProgress(position) {
        const players = this.playerRepository.getByPosition(position);

        if (players.length < 2) {
            return {
                completed: 0,
                total: 0,
                percentage: 0,
                remaining: 0
            };
        }

        const totalPairs = (players.length * (players.length - 1)) / 2;
        const comparedPairs = this.countComparedPairs(players, position);

        const remaining = totalPairs - comparedPairs;
        const percentage = Math.round((comparedPairs / totalPairs) * 100);

        return {
            completed: comparedPairs,
            total: totalPairs,
            percentage,
            remaining
        };
    }

    /**
     * Count how many pairs have been compared
     * @private
     */
    countComparedPairs(players, position) {
        const comparedPairs = new Set();

        players.forEach(player => {
            const compared = player.comparedWith[position] || [];
            compared.forEach(opponentName => {
                const pair = [player.name, opponentName].sort().join('|');
                comparedPairs.add(pair);
            });
        });

        return comparedPairs.size;
    }

    /**
     * Get all position progress
     *
     * @returns {Object} Progress by position
     */
    getAllProgress() {
        const positions = this.config.positionOrder;
        const progress = {};

        positions.forEach(pos => {
            progress[pos] = this.getProgress(pos);
        });

        return progress;
    }

    /**
     * Reset comparisons for a single position
     *
     * @param {string} position - Position to reset
     */
    resetPosition(position) {
        // Get all players at this position
        const players = this.playerRepository.getByPosition(position);

        if (players.length === 0) {
            return;
        }

        // Reset each player's data for this position (including Glicko-2 fields)
        const updates = players.map(player => ({
            id: player.id,
            updates: {
                ratings: {
                    ...player.ratings,
                    [position]: 1500
                },
                comparisons: {
                    ...player.comparisons,
                    [position]: 0
                },
                comparedWith: {
                    ...player.comparedWith,
                    [position]: []
                },
                rd: {
                    ...(player.rd || {}),
                    [position]: 350
                },
                volatility: {
                    ...(player.volatility || {}),
                    [position]: 0.06
                },
                winsAgainst: {
                    ...(player.winsAgainst || {}),
                    [position]: []
                }
            }
        }));

        // Update all players
        this.playerRepository.updateMany(updates);

        // Emit event
        this.eventBus.emit('comparison:reset-position', {
            position,
            playersAffected: players.length
        });
    }

    /**
     * Reset all comparisons for positions
     *
     * @param {Array<string>} positions - Positions to reset
     */
    resetAll(positions) {
        // Use repository method to reset all positions
        this.playerRepository.resetAllPositions(positions);

        // Emit event
        this.eventBus.emit('comparison:reset-all', {
            positions,
            playersAffected: this.playerRepository.count()
        });
    }

    /**
     * Process a full ranking for a position.
     * Resets the position first, then processes all implied pairwise comparisons.
     *
     * Supports ties: players in the same tier are treated as draws,
     * players in higher tiers beat all players in lower tiers.
     *
     * @param {Array<Array<string>>} tiers - Array of tiers, each tier is an array of player IDs.
     *   Players within a tier are equal; tiers are ordered best-first.
     *   Example: [[idA, idB], [idC], [idD, idE]] means A=B > C > D=E
     * @param {string} position - Position being ranked
     * @returns {Object} Summary of processed comparisons
     */
    processRanking(tiers, position) {
        // Validate tiers
        const allIds = tiers.flat();
        if (allIds.length < 2) {
            throw new Error('Need at least 2 players for ranking');
        }

        // Validate all players exist and play this position
        for (const id of allIds) {
            const player = this.playerRepository.getById(id);
            if (!player) {
                throw new Error(`Player not found: ${id}`);
            }
            if (!player.positions.includes(position)) {
                throw new Error(`Player ${player.name} does not play ${position}`);
            }
        }

        // Reset position to start fresh
        this.resetPosition(position);

        let winsProcessed = 0;
        let drawsProcessed = 0;

        // Process within-tier draws
        for (const tier of tiers) {
            for (let i = 0; i < tier.length; i++) {
                for (let j = i + 1; j < tier.length; j++) {
                    this.processDraw(tier[i], tier[j], position);
                    drawsProcessed++;
                }
            }
        }

        // Process cross-tier wins (higher tier beats lower tier)
        for (let t1 = 0; t1 < tiers.length; t1++) {
            for (let t2 = t1 + 1; t2 < tiers.length; t2++) {
                for (const winnerId of tiers[t1]) {
                    for (const loserId of tiers[t2]) {
                        this.processComparison(winnerId, loserId, position);
                        winsProcessed++;
                    }
                }
            }
        }

        const result = {
            position,
            totalComparisons: winsProcessed + drawsProcessed,
            winsProcessed,
            drawsProcessed,
            tiersCount: tiers.length,
            playersCount: allIds.length
        };

        this.eventBus.emit('ranking:applied', result);

        return result;
    }
}

export default ComparisonService;
