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

        // Save old ratings for change reporting
        const winnerOldRating = winner.ratings?.[position] || this.eloService.DEFAULT_RATING;
        const loserOldRating = loser.ratings?.[position] || this.eloService.DEFAULT_RATING;
        const poolSize = this.playerRepository.countByPosition(position);

        // Record comparison metadata only (comparedWith, winsAgainst, comparisons)
        this.updatePlayersAfterComparison(
            winnerId, loserId, position, winner.name, loser.name
        );

        // Batch recalculate ALL ratings from scratch → order-independent
        this._batchRecalculateRatings(position);

        // Get updated players (with batch-calculated ratings)
        const updatedWinner = this.playerRepository.getById(winnerId);
        const updatedLoser = this.playerRepository.getById(loserId);

        // Build changes from actual batch results
        const winnerExpected = this.eloService.calculateExpectedScore(
            winnerOldRating, loserOldRating
        );
        const loserExpected = this.eloService.calculateExpectedScore(
            loserOldRating, winnerOldRating
        );

        const changes = {
            winner: {
                oldRating: winnerOldRating,
                newRating: updatedWinner.ratings[position],
                change: updatedWinner.ratings[position] - winnerOldRating,
                kFactor: 0, baseKFactor: 0,
                expected: winnerExpected,
                newRd: updatedWinner.rd?.[position],
                newVolatility: updatedWinner.volatility?.[position]
            },
            loser: {
                oldRating: loserOldRating,
                newRating: updatedLoser.ratings[position],
                change: updatedLoser.ratings[position] - loserOldRating,
                kFactor: 0, baseKFactor: 0,
                expected: loserExpected,
                newRd: updatedLoser.rd?.[position],
                newVolatility: updatedLoser.volatility?.[position]
            },
            poolSize: poolSize || null,
            poolAdjusted: false
        };

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

        // Save old ratings for change reporting
        const p1OldRating = player1.ratings?.[position] || this.eloService.DEFAULT_RATING;
        const p2OldRating = player2.ratings?.[position] || this.eloService.DEFAULT_RATING;
        const poolSize = this.playerRepository.countByPosition(position);

        // Record comparison metadata only (no winsAgainst for draws)
        this.updatePlayersAfterDraw(
            player1Id, player2Id, position, player1.name, player2.name
        );

        // Batch recalculate ALL ratings from scratch → order-independent
        this._batchRecalculateRatings(position);

        // Get updated players (with batch-calculated ratings)
        const updatedPlayer1 = this.playerRepository.getById(player1Id);
        const updatedPlayer2 = this.playerRepository.getById(player2Id);

        // Build changes from actual batch results
        const p1Expected = this.eloService.calculateExpectedScore(p1OldRating, p2OldRating);
        const p2Expected = this.eloService.calculateExpectedScore(p2OldRating, p1OldRating);

        const changes = {
            player1: {
                oldRating: p1OldRating,
                newRating: updatedPlayer1.ratings[position],
                change: updatedPlayer1.ratings[position] - p1OldRating,
                kFactor: 0, baseKFactor: 0,
                expected: p1Expected,
                newRd: updatedPlayer1.rd?.[position],
                newVolatility: updatedPlayer1.volatility?.[position]
            },
            player2: {
                oldRating: p2OldRating,
                newRating: updatedPlayer2.ratings[position],
                change: updatedPlayer2.ratings[position] - p2OldRating,
                kFactor: 0, baseKFactor: 0,
                expected: p2Expected,
                newRd: updatedPlayer2.rd?.[position],
                newVolatility: updatedPlayer2.volatility?.[position]
            },
            poolSize: poolSize || null,
            poolAdjusted: false,
            isDraw: true
        };

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
     * Record comparison metadata (no rating update — batch recalc handles that)
     * @private
     */
    updatePlayersAfterComparison(winnerId, loserId, position, winnerName, loserName) {
        this.playerRepository.updateMany([
            {
                id: winnerId,
                updates: {
                    comparisons: this.buildUpdatedComparisons(winnerId, position),
                    comparedWith: this.buildUpdatedComparedWith(winnerId, position, loserName),
                    winsAgainst: this.buildUpdatedWinsAgainst(winnerId, position, loserName)
                }
            },
            {
                id: loserId,
                updates: {
                    comparisons: this.buildUpdatedComparisons(loserId, position),
                    comparedWith: this.buildUpdatedComparedWith(loserId, position, winnerName)
                }
            }
        ]);

        this.playerRepository.incrementSessionComparison();
    }

    /**
     * Record draw metadata (no rating update — batch recalc handles that)
     * @private
     */
    updatePlayersAfterDraw(player1Id, player2Id, position, player1Name, player2Name) {
        this.playerRepository.updateMany([
            {
                id: player1Id,
                updates: {
                    comparisons: this.buildUpdatedComparisons(player1Id, position),
                    comparedWith: this.buildUpdatedComparedWith(player1Id, position, player2Name)
                }
            },
            {
                id: player2Id,
                updates: {
                    comparisons: this.buildUpdatedComparisons(player2Id, position),
                    comparedWith: this.buildUpdatedComparedWith(player2Id, position, player1Name)
                }
            }
        ]);

        this.playerRepository.incrementSessionComparison();
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
     * Batch recalculate all ratings for a position from scratch.
     * Delegates to EloService.calculateBatchGlicko2Update() for the math.
     * Called after each step-by-step comparison to ensure order-independence:
     * regardless of comparison order, the resulting ratings are identical.
     *
     * @private
     * @param {string} position - Position to recalculate
     */
    _batchRecalculateRatings(position) {
        const players = this.playerRepository.getByPosition(position);
        if (players.length < 2) return;

        const poolSize = players.length;

        // Build name→player map for win/loss reconstruction
        const nameToPlayer = new Map();
        for (const p of players) nameToPlayer.set(p.name, p);

        // Pre-compute winsAgainst sets once (avoids re-creating per opponent lookup)
        const winsAgainstSets = new Map();
        for (const p of players) {
            winsAgainstSets.set(p.name, new Set(p.winsAgainst?.[position] || []));
        }

        const updates = [];
        for (const player of players) {
            const compared = player.comparedWith[position] || [];
            if (compared.length === 0) continue;

            const myWins = winsAgainstSets.get(player.name);

            // Reconstruct wins/losses/draws from metadata
            let wins = 0, losses = 0, draws = 0;
            for (const oppName of compared) {
                if (myWins.has(oppName)) {
                    wins++;
                } else {
                    const oppWins = winsAgainstSets.get(oppName);
                    // Guard against deleted/missing opponents: if opponent not in pool,
                    // skip this comparison rather than counting it as a phantom draw.
                    if (!oppWins) continue;
                    if (oppWins.has(player.name)) {
                        losses++;
                    } else {
                        draws++;
                    }
                }
            }

            const result = this.eloService.calculateBatchGlicko2Update(wins, losses, draws, poolSize);
            if (!result) continue;

            updates.push({
                id: player.id,
                updates: {
                    ratings: { ...player.ratings, [position]: result.newRating },
                    rd: { ...(player.rd || {}), [position]: result.newRd },
                    volatility: { ...(player.volatility || {}), [position]: result.newVolatility }
                }
            });
        }

        if (updates.length > 0) {
            this.playerRepository.updateMany(updates);
        }
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
        const defaultRating = this.eloService.DEFAULT_RATING;
        const initialRd = this.eloService.getInitialRD(players.length);
        const initialVol = this.eloService.GLICKO2.INITIAL_VOLATILITY;

        const updates = players.map(player => ({
            id: player.id,
            updates: {
                ratings: {
                    ...player.ratings,
                    [position]: defaultRating
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
                    [position]: initialRd
                },
                volatility: {
                    ...(player.volatility || {}),
                    [position]: initialVol
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
     * Process a full ranking for a position using snapshot-based batch calculation.
     * Resets the position first, then computes all rating changes from the uniform
     * post-reset state, ensuring the result is completely order-independent.
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
    previewRanking(tiers, position) {
        const allIds = tiers.flat();
        if (allIds.length < 2) return {};

        const poolSize = allIds.length;
        const winsLosses = new Map();
        for (const id of allIds) {
            winsLosses.set(id, { wins: 0, losses: 0, draws: 0 });
        }

        // Within-tier draws
        for (const tier of tiers) {
            for (let i = 0; i < tier.length; i++) {
                for (let j = i + 1; j < tier.length; j++) {
                    winsLosses.get(tier[i]).draws++;
                    winsLosses.get(tier[j]).draws++;
                }
            }
        }

        // Cross-tier wins
        for (let t1 = 0; t1 < tiers.length; t1++) {
            for (let t2 = t1 + 1; t2 < tiers.length; t2++) {
                for (const winnerId of tiers[t1]) {
                    for (const loserId of tiers[t2]) {
                        winsLosses.get(winnerId).wins++;
                        winsLosses.get(loserId).losses++;
                    }
                }
            }
        }

        const ratings = {};
        for (const [id, res] of winsLosses) {
            const result = this.eloService.calculateBatchGlicko2Update(
                res.wins, res.losses, res.draws, poolSize
            );
            ratings[id] = result ? result.newRating : this.eloService.DEFAULT_RATING;
        }
        return ratings;
    }

    processRanking(tiers, position) {
        const allIds = tiers.flat();

        // Validate: at least 2 players
        if (allIds.length < 2) {
            throw new Error('Need at least 2 players for ranking');
        }

        // Validate: no duplicate IDs
        if (new Set(allIds).size !== allIds.length) {
            throw new Error('Duplicate player IDs in ranking');
        }

        // Validate all players exist and play this position, build name lookup
        const playerNameById = new Map();
        for (const id of allIds) {
            const player = this.playerRepository.getById(id);
            if (!player) {
                throw new Error(`Player not found: ${id}`);
            }
            if (!player.positions.includes(position)) {
                throw new Error(`Player ${player.name} does not play ${position}`);
            }
            playerNameById.set(id, player.name);
        }

        // Reset position to start fresh (all players → 1500, adaptive RD, vol=0.06, comparisons=0)
        this.resetPosition(position);

        // --- Snapshot-based batch Glicko-2 calculation ---
        // After reset all players have identical state, so expected scores = 0.5.
        // Rating changes are determined by EloService.calculateBatchGlicko2Update().
        // This makes the result completely order-independent.

        // Count wins, losses, draws for each player
        const playerResults = new Map();
        for (const id of allIds) {
            playerResults.set(id, { wins: 0, losses: 0, draws: 0, opponentIds: new Set(), wonAgainstIds: new Set() });
        }

        let winsProcessed = 0;
        let drawsProcessed = 0;

        // Within-tier draws
        for (const tier of tiers) {
            for (let i = 0; i < tier.length; i++) {
                for (let j = i + 1; j < tier.length; j++) {
                    const r1 = playerResults.get(tier[i]);
                    const r2 = playerResults.get(tier[j]);
                    r1.draws++;
                    r2.draws++;
                    r1.opponentIds.add(tier[j]);
                    r2.opponentIds.add(tier[i]);
                    drawsProcessed++;
                }
            }
        }

        // Cross-tier wins (higher tier beats lower tier)
        for (let t1 = 0; t1 < tiers.length; t1++) {
            for (let t2 = t1 + 1; t2 < tiers.length; t2++) {
                for (const winnerId of tiers[t1]) {
                    for (const loserId of tiers[t2]) {
                        const wr = playerResults.get(winnerId);
                        const lr = playerResults.get(loserId);
                        wr.wins++;
                        lr.losses++;
                        wr.opponentIds.add(loserId);
                        lr.opponentIds.add(winnerId);
                        wr.wonAgainstIds.add(loserId);
                        winsProcessed++;
                    }
                }
            }
        }

        // Re-read players after reset for correct current state (preserves other positions)
        const freshPlayers = new Map();
        for (const id of allIds) {
            freshPlayers.set(id, this.playerRepository.getById(id));
        }

        // Build batch updates using centralized Glicko-2 batch method
        const updates = [];
        for (const id of allIds) {
            const res = playerResults.get(id);
            const player = freshPlayers.get(id);
            const totalComparisons = res.wins + res.losses + res.draws;

            const glickoResult = this.eloService.calculateBatchGlicko2Update(
                res.wins, res.losses, res.draws, allIds.length
            );
            if (!glickoResult) continue;

            // Build comparedWith and winsAgainst lists
            const comparedWithNames = [...res.opponentIds].map(oid => playerNameById.get(oid));
            const winsAgainstNames = [...res.wonAgainstIds].map(oid => playerNameById.get(oid));

            updates.push({
                id,
                updates: {
                    ratings: { ...player.ratings, [position]: glickoResult.newRating },
                    comparisons: { ...player.comparisons, [position]: totalComparisons },
                    comparedWith: { ...player.comparedWith, [position]: comparedWithNames },
                    winsAgainst: { ...(player.winsAgainst || {}), [position]: winsAgainstNames },
                    rd: { ...(player.rd || {}), [position]: glickoResult.newRd },
                    volatility: { ...(player.volatility || {}), [position]: glickoResult.newVolatility }
                }
            });
        }

        // Apply all rating changes in a single batch
        this.playerRepository.updateMany(updates);

        // Increment session comparison counter in a single write
        const totalComparisons = winsProcessed + drawsProcessed;
        this.playerRepository.incrementSessionComparisonBy(totalComparisons);

        const result = {
            position,
            totalComparisons,
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
