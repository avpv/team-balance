/**
 * AgentAPI - Browser API for AI Agents
 *
 * Provides a simple interface for AI agents (Perplexity, Comet, etc.)
 * to interact with TeamBalance directly in the browser.
 *
 * Usage:
 *   await TeamBalanceAPI.addPlayer("John", ["OH", "MB"])
 *   await TeamBalanceAPI.compare("John", "Mary", "John", "OH")
 *   const teams = await TeamBalanceAPI.generateTeams(2)
 *
 * @module AgentAPI
 * @version 1.0.0
 */

import { activities } from '../config/activities/index.js';
import storage from '../core/StorageAdapter.js';
import { STORAGE_KEYS } from '../utils/constants.js';

class AgentAPI {
    constructor() {
        this.version = '1.0.0';
    }

    /**
     * Get the app instance
     * @private
     */
    _getApp() {
        if (!window.app) {
            throw new Error('TeamBalance app not initialized');
        }
        return window.app;
    }

    /**
     * Get a service by name
     * @private
     */
    _getService(name) {
        const app = this._getApp();
        if (!app.services) {
            throw new Error('Services not initialized. Please select an activity first.');
        }
        return app.services.resolve(name);
    }

    /**
     * Ensure activity is selected
     * @private
     */
    _ensureActivity() {
        const activity = storage.get(STORAGE_KEYS.SELECTED_ACTIVITY, null);
        if (!activity) {
            throw new Error('No activity selected. Use selectActivity() first.');
        }
        return activity;
    }

    // =========================================================================
    // Activities
    // =========================================================================

    /**
     * List all available activities
     * @returns {Array<{id: string, name: string, positions: string[]}>}
     */
    listActivities() {
        return Object.entries(activities).map(([id, config]) => ({
            id,
            name: config.name,
            positions: config.positionOrder,
            positionNames: config.positions
        }));
    }

    /**
     * Get current activity
     * @returns {{id: string, name: string, positions: object}|null}
     */
    getCurrentActivity() {
        const activityId = storage.get(STORAGE_KEYS.SELECTED_ACTIVITY, null);
        if (!activityId) return null;

        const config = activities[activityId];
        return config ? {
            id: activityId,
            name: config.name,
            positions: config.positions,
            positionOrder: config.positionOrder,
            defaultComposition: config.defaultComposition
        } : null;
    }

    /**
     * List positions for current activity
     * IMPORTANT: Use this to select a position before comparing players
     * @returns {Array<{code: string, name: string, playerCount: number}>}
     */
    listPositions() {
        this._ensureActivity();
        const activity = this.getCurrentActivity();
        const playerRepo = this._getService('playerRepository');
        const players = playerRepo.getAllPlayers();

        return activity.positionOrder.map(code => ({
            code,
            name: activity.positions[code],
            playerCount: players.filter(p => p.positions.includes(code)).length
        }));
    }

    /**
     * Select an activity (sport/esport)
     * @param {string} activityId - Activity ID (e.g., "volleyball", "basketball")
     * @returns {{success: boolean, activity: object}}
     */
    async selectActivity(activityId) {
        if (!activities[activityId]) {
            const available = Object.keys(activities).join(', ');
            throw new Error(`Activity "${activityId}" not found. Available: ${available}`);
        }

        storage.set(STORAGE_KEYS.SELECTED_ACTIVITY, activityId);

        // Reload the page to reinitialize with new activity
        // This is needed because services are initialized with activity config
        window.location.reload();

        return {
            success: true,
            message: 'Activity selected. Page will reload.',
            activity: this.getCurrentActivity()
        };
    }

    // =========================================================================
    // Players
    // =========================================================================

    /**
     * Add a player
     * @param {string} name - Player name
     * @param {string[]} positions - Array of position codes (e.g., ["OH", "MB"])
     * @returns {object} Added player
     */
    async addPlayer(name, positions) {
        this._ensureActivity();
        const playerService = this._getService('playerService');

        const player = playerService.addPlayer(name, positions);
        return {
            success: true,
            player: {
                id: player.id,
                name: player.name,
                positions: player.positions,
                ratings: player.ratings
            }
        };
    }

    /**
     * Add multiple players at once
     * @param {Array<{name: string, positions: string[]}>} players
     * @returns {{added: number, failed: number, results: array}}
     */
    async addPlayers(players) {
        const results = [];
        let added = 0;
        let failed = 0;

        for (const p of players) {
            try {
                const result = await this.addPlayer(p.name, p.positions);
                results.push({ name: p.name, success: true, player: result.player });
                added++;
            } catch (error) {
                results.push({ name: p.name, success: false, error: error.message });
                failed++;
            }
        }

        return { added, failed, results };
    }

    /**
     * List all players in current session
     * @returns {Array<object>}
     */
    listPlayers() {
        this._ensureActivity();
        const playerRepo = this._getService('playerRepository');

        const players = playerRepo.getAllPlayers();
        return players.map(p => ({
            id: p.id,
            name: p.name,
            positions: p.positions,
            ratings: p.ratings,
            comparisons: p.comparisons
        }));
    }

    /**
     * Get a player by name
     * @param {string} name - Player name
     * @returns {object|null}
     */
    getPlayer(name) {
        const players = this.listPlayers();
        return players.find(p => p.name.toLowerCase() === name.toLowerCase()) || null;
    }

    /**
     * Remove a player
     * @param {string} name - Player name
     * @returns {{success: boolean}}
     */
    async removePlayer(name) {
        this._ensureActivity();
        const playerService = this._getService('playerService');
        const playerRepo = this._getService('playerRepository');

        const player = playerRepo.getPlayerByName(name);
        if (!player) {
            throw new Error(`Player "${name}" not found`);
        }

        playerService.removePlayer(player.id);
        return { success: true, message: `Player "${name}" removed` };
    }

    // =========================================================================
    // Comparisons
    // =========================================================================

    /**
     * Get next recommended comparison pair for a position
     *
     * WORKFLOW:
     * 1. listPositions() - see available positions
     * 2. getNextComparison('OH') - get pair for specific position
     * 3. compare('Player1', 'Player2', 'Winner', 'OH') - record result
     *
     * @param {string} position - Position code (REQUIRED). Use listPositions() to see available.
     * @returns {{player1: object, player2: object, position: string}|{hasMore: false}}
     */
    getNextComparison(position) {
        this._ensureActivity();

        if (!position) {
            const positions = this.listPositions();
            return {
                error: 'Position is required. Use listPositions() first.',
                availablePositions: positions.map(p => `${p.code} (${p.name}) - ${p.playerCount} players`)
            };
        }

        const comparisonService = this._getService('comparisonService');
        const next = comparisonService.getNextComparison(position);

        if (!next) {
            return {
                hasMore: false,
                position,
                message: `No more comparisons needed for ${this._getPositionName(position)} or not enough players`
            };
        }

        return {
            hasMore: true,
            player1: { id: next.player1.id, name: next.player1.name },
            player2: { id: next.player2.id, name: next.player2.name },
            position: next.position,
            positionName: this._getPositionName(next.position),
            reason: next.reason || 'Standard comparison'
        };
    }

    /**
     * Record a comparison result
     *
     * @param {string} position - Position code (REQUIRED first!)
     * @param {string} player1Name - First player name
     * @param {string} player2Name - Second player name
     * @param {string|null} winnerName - Winner name (null for draw)
     * @returns {{success: boolean, ratingChanges: object}}
     *
     * @example
     * // First get positions
     * TeamBalanceAPI.listPositions()
     * // Then compare for specific position
     * await TeamBalanceAPI.compare('OH', 'John', 'Mary', 'John')
     */
    async compare(position, player1Name, player2Name, winnerName) {
        this._ensureActivity();

        if (!position) {
            throw new Error('Position is required. Use listPositions() to see available positions.');
        }

        const activity = this.getCurrentActivity();
        if (!activity.positionOrder.includes(position)) {
            throw new Error(`Invalid position "${position}". Available: ${activity.positionOrder.join(', ')}`);
        }

        const comparisonService = this._getService('comparisonService');
        const playerRepo = this._getService('playerRepository');

        const player1 = playerRepo.getPlayerByName(player1Name);
        const player2 = playerRepo.getPlayerByName(player2Name);

        if (!player1) throw new Error(`Player "${player1Name}" not found`);
        if (!player2) throw new Error(`Player "${player2Name}" not found`);

        let winnerId = null;
        if (winnerName) {
            if (winnerName.toLowerCase() === player1Name.toLowerCase()) {
                winnerId = player1.id;
            } else if (winnerName.toLowerCase() === player2Name.toLowerCase()) {
                winnerId = player2.id;
            } else {
                throw new Error(`Winner "${winnerName}" must be one of the compared players`);
            }
        }

        const result = comparisonService.recordComparison(
            player1.id,
            player2.id,
            winnerId,
            position
        );

        // Get updated players
        const updatedP1 = playerRepo.getPlayerById(player1.id);
        const updatedP2 = playerRepo.getPlayerById(player2.id);

        return {
            success: true,
            result: winnerName ? `${winnerName} won` : 'Draw',
            position,
            ratingChanges: {
                [player1Name]: {
                    oldRating: Math.round(result.player1.oldRating),
                    newRating: Math.round(updatedP1.ratings[position]),
                    change: Math.round(result.player1.change)
                },
                [player2Name]: {
                    oldRating: Math.round(result.player2.oldRating),
                    newRating: Math.round(updatedP2.ratings[position]),
                    change: Math.round(result.player2.change)
                }
            }
        };
    }

    /**
     * Record a win-win (draw) comparison
     * @param {string} position - Position code (REQUIRED first!)
     * @param {string} player1Name
     * @param {string} player2Name
     */
    async draw(position, player1Name, player2Name) {
        return this.compare(position, player1Name, player2Name, null);
    }

    /**
     * Get comparison statistics
     * @returns {object}
     */
    getComparisonStats() {
        this._ensureActivity();
        const comparisonService = this._getService('comparisonService');
        return comparisonService.getComparisonStats();
    }

    // =========================================================================
    // Rankings
    // =========================================================================

    /**
     * Get player rankings
     * @param {string} [position] - Optional specific position
     * @returns {Array<{position: string, rankings: array}>}
     */
    getRankings(position = null) {
        this._ensureActivity();
        const playerRepo = this._getService('playerRepository');
        const players = playerRepo.getAllPlayers();
        const activity = this.getCurrentActivity();

        const positions = position ? [position] : activity.positionOrder;

        return positions.map(pos => {
            const playersForPosition = players
                .filter(p => p.positions.includes(pos))
                .map(p => ({
                    name: p.name,
                    rating: Math.round(p.ratings?.[pos] || 1500),
                    comparisons: p.comparisons?.[pos] || 0
                }))
                .sort((a, b) => b.rating - a.rating)
                .map((p, index) => ({ ...p, rank: index + 1 }));

            return {
                position: pos,
                positionName: this._getPositionName(pos),
                rankings: playersForPosition
            };
        });
    }

    // =========================================================================
    // Teams
    // =========================================================================

    /**
     * Generate balanced teams
     * @param {number} teamCount - Number of teams
     * @param {object} [composition] - Position composition (e.g., {S: 1, OH: 2, MB: 2})
     * @returns {{teams: array, quality: object, unassigned: array}}
     */
    async generateTeams(teamCount, composition = null) {
        this._ensureActivity();
        const teamOptimizer = this._getService('teamOptimizerService');
        const playerRepo = this._getService('playerRepository');
        const activity = this.getCurrentActivity();

        const players = playerRepo.getAllPlayers();
        const teamComposition = composition || activity.defaultComposition;

        const result = await teamOptimizer.optimize(teamComposition, teamCount, players);

        return {
            teamCount,
            composition: teamComposition,
            quality: {
                balance: Math.round((result.quality?.balance || 0) * 100) + '%',
                maxDifference: result.quality?.maxDifference || 0,
                isBalanced: result.quality?.isBalanced || false
            },
            teams: result.teams.map((team, index) => ({
                teamNumber: index + 1,
                totalRating: Math.round(team.totalRating || 0),
                averageRating: Math.round(team.averageRating || 0),
                players: team.players.map(p => ({
                    name: p.name,
                    position: p.assignedPosition,
                    positionName: this._getPositionName(p.assignedPosition),
                    rating: Math.round(p.ratings?.[p.assignedPosition] || 1500)
                }))
            })),
            unassigned: (result.unassigned || []).map(p => ({
                name: p.name,
                positions: p.positions
            }))
        };
    }

    // =========================================================================
    // Export/Import
    // =========================================================================

    /**
     * Export current session data as JSON
     * @returns {object}
     */
    exportData() {
        this._ensureActivity();
        const sessionService = this._getService('sessionService');
        const activity = this.getCurrentActivity();

        return {
            activity: activity,
            players: this.listPlayers(),
            stats: this.getComparisonStats(),
            exportedAt: new Date().toISOString()
        };
    }

    // =========================================================================
    // Utility
    // =========================================================================

    /**
     * Get position full name
     * @private
     */
    _getPositionName(positionCode) {
        const activity = this.getCurrentActivity();
        return activity?.positions?.[positionCode] || positionCode;
    }

    /**
     * Get API help
     * @returns {object}
     */
    help() {
        return {
            version: this.version,
            description: 'TeamBalance API for AI Agents',
            workflow: [
                '1. selectActivity(activityId) - Choose sport/esport',
                '2. addPlayer(name, positions[]) - Add players',
                '3. listPositions() - See available positions',
                '4. getNextComparison(position) - Get pair for position',
                '5. compare(position, player1, player2, winner) - Record result',
                '6. generateTeams(count) - Create balanced teams'
            ],
            methods: {
                // Activities & Positions
                listActivities: 'List all available activities',
                getCurrentActivity: 'Get current selected activity',
                selectActivity: 'selectActivity(activityId) - Select an activity',
                listPositions: 'listPositions() - List positions for current activity (USE FIRST!)',

                // Players
                addPlayer: 'addPlayer(name, positions[]) - Add a player',
                addPlayers: 'addPlayers([{name, positions}]) - Add multiple players',
                listPlayers: 'List all players in current session',
                getPlayer: 'getPlayer(name) - Get player by name',
                removePlayer: 'removePlayer(name) - Remove a player',

                // Comparisons (position FIRST!)
                getNextComparison: 'getNextComparison(position) - Get next pair for position',
                compare: 'compare(position, player1, player2, winner) - Record comparison',
                draw: 'draw(position, player1, player2) - Record a draw',
                getComparisonStats: 'Get comparison statistics',

                // Rankings & Teams
                getRankings: 'getRankings(position?) - Get player rankings',
                generateTeams: 'generateTeams(count, composition?) - Generate balanced teams',

                // Data
                exportData: 'Export session data as JSON'
            },
            example: `
// Quick start:
await TeamBalanceAPI.selectActivity('volleyball')
await TeamBalanceAPI.addPlayer('John', ['OH', 'MB'])
await TeamBalanceAPI.addPlayer('Mary', ['S', 'OH'])

// IMPORTANT: First get positions, then compare by position
TeamBalanceAPI.listPositions()  // → [{code: 'OH', name: 'Outside Hitter', ...}]
const next = TeamBalanceAPI.getNextComparison('OH')  // position required!
await TeamBalanceAPI.compare('OH', next.player1.name, next.player2.name, 'John')

const teams = await TeamBalanceAPI.generateTeams(2)
            `.trim()
        };
    }
}

// Create singleton instance
const agentAPI = new AgentAPI();

// Export for module usage
export default agentAPI;

// Also expose to window for browser console access
if (typeof window !== 'undefined') {
    window.TeamBalanceAPI = agentAPI;
}
