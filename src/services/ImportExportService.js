// src/services/ImportExportService.js

/**
 * ImportExportService - Centralized import/export logic
 *
 * Responsibilities:
 * - Parse import data (CSV, JSON, text)
 * - Generate export data (text, CSV, JSON) for both players and teams
 * - Validate positions against current activity
 * - Cache parsed results to avoid double-parsing
 * - Provide round-trip compatible formats
 */

import { parseCSVLine, escapeCSVValue } from '../utils/csv.js';
import { t } from '../core/I18nManager.js';

class ImportExportService {
    /**
     * @param {Object} activityConfig - Activity configuration
     * @param {PlayerService} playerService - Player service
     */
    constructor(activityConfig, playerService) {
        this.activityConfig = activityConfig;
        this.playerService = playerService;
        this.positions = activityConfig?.positions || {};

        // Cache for parsed import data
        this._cachedParseResult = null;
        this._cachedParseInput = null;
        this._cachedParseDelimiter = null;
    }

    // ===== IMPORT: Parsing =====

    /**
     * Parse import data from string (CSV, JSON, or names-only)
     * Results are cached to avoid double-parsing between preview and confirm.
     *
     * @param {string} data - Raw input data
     * @param {string} delimiter - CSV delimiter
     * @returns {Array<{name: string, positions: string[], warnings: string[]}>}
     */
    parseImportData(data, delimiter = ',') {
        if (!data || !data.trim()) return [];

        // Return cached result if input hasn't changed
        if (this._cachedParseInput === data && this._cachedParseDelimiter === delimiter && this._cachedParseResult) {
            return this._cachedParseResult;
        }

        const trimmed = data.trim();
        let result;

        // Try JSON first
        if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
            result = this._parseJsonImport(trimmed);
        } else {
            result = this._parseCsvImport(trimmed, delimiter);
        }

        // Validate positions and add warnings
        result = this._validateImportPositions(result);

        // Cache
        this._cachedParseInput = data;
        this._cachedParseDelimiter = delimiter;
        this._cachedParseResult = result;

        return result;
    }

    /**
     * Clear the parse cache (call when wizard step changes or modal closes)
     */
    clearParseCache() {
        this._cachedParseResult = null;
        this._cachedParseInput = null;
        this._cachedParseDelimiter = null;
    }

    /**
     * Parse JSON import data.
     * Supports both player format [{name, positions}] and
     * teams export format {teams: [{players: [{name, positionCode}]}]}
     * @private
     */
    _parseJsonImport(data) {
        try {
            let parsed = JSON.parse(data);

            // Handle teams export format: {teams: [{players: [...]}]}
            if (parsed && !Array.isArray(parsed) && Array.isArray(parsed.teams)) {
                const players = [];
                for (const team of parsed.teams) {
                    if (!Array.isArray(team.players)) continue;
                    for (const p of team.players) {
                        players.push({
                            name: p.name,
                            positions: p.positionCode ? [p.positionCode]
                                : p.positions ? (Array.isArray(p.positions) ? p.positions : [p.positions])
                                : [],
                            warnings: []
                        });
                    }
                }
                return players;
            }

            if (!Array.isArray(parsed)) parsed = [parsed];
            return parsed.map(item => ({
                name: item.name,
                positions: Array.isArray(item.positions) ? item.positions : [item.positions],
                warnings: []
            }));
        } catch (e) {
            throw new Error(t('errors.invalidJson'));
        }
    }

    /**
     * Parse CSV import data using the proper csv.js utility
     * @private
     */
    _parseCsvImport(data, delimiter) {
        const lines = data.split('\n').map(l => l.trim()).filter(l => l);
        if (lines.length < 1) throw new Error(t('errors.noDataToImport'));

        // Check if first line is a header
        const firstLine = lines[0].toLowerCase();
        const hasHeader = firstLine.includes('name') || firstLine.includes('position');

        const dataLines = hasHeader ? lines.slice(1) : lines;
        const players = [];
        const allPositionKeys = Object.keys(this.positions);

        for (const line of dataLines) {
            // Use the proper CSV parser from csv.js (handles escaped quotes, etc.)
            const parts = parseCSVLine(line, delimiter);

            if (parts.length < 1 || !parts[0].trim()) {
                continue;
            }

            let positions;
            if (parts.length < 2 || !parts[1] || !parts[1].trim()) {
                // No positions provided - assign all available
                positions = allPositionKeys;
            } else {
                positions = parts[1].split(',').map(p => p.trim()).filter(p => p);
            }

            players.push({
                name: parts[0].trim(),
                positions: positions,
                warnings: []
            });
        }

        return players;
    }

    /**
     * Validate imported positions against the current activity.
     * Invalid positions are removed with a warning; if none remain, all are assigned.
     * Warnings are per-player but deduplicated in getUniqueWarnings().
     * @private
     */
    _validateImportPositions(players) {
        const validPositionKeys = Object.keys(this.positions);

        return players.map(player => {
            const warnings = [...(player.warnings || [])];
            const originalPositions = player.positions;
            const validPositions = originalPositions.filter(p => validPositionKeys.includes(p));

            if (validPositions.length < originalPositions.length) {
                const invalid = originalPositions.filter(p => !validPositionKeys.includes(p));
                warnings.push(t('import.invalidPositions', {
                    positions: invalid.join(', '),
                    valid: validPositionKeys.join(', ')
                }));
            }

            // If no valid positions remain, assign all
            const finalPositions = validPositions.length > 0 ? validPositions : validPositionKeys;

            return {
                name: player.name,
                positions: finalPositions,
                warnings
            };
        });
    }

    /**
     * Get unique warnings from parsed players (deduplicated)
     * @param {Array} players - Parsed player array with warnings
     * @returns {string[]} Unique warning messages
     */
    getUniqueWarnings(players) {
        const seen = new Set();
        const unique = [];
        for (const p of players) {
            for (const w of (p.warnings || [])) {
                if (!seen.has(w)) {
                    seen.add(w);
                    unique.push(w);
                }
            }
        }
        return unique;
    }

    // ===== EXPORT: Players =====

    /**
     * Export players as CSV (round-trip compatible with import)
     * @param {Array} players - Player objects from playerService
     * @returns {string} CSV string
     */
    exportPlayersCsv(players) {
        const lines = ['name,positions'];
        for (const player of players) {
            const name = escapeCSVValue(player.name);
            const positions = player.positions.join(',');
            lines.push(`${name},"${positions}"`);
        }
        return lines.join('\n');
    }

    /**
     * Export players as JSON (round-trip compatible with import)
     * @param {Array} players - Player objects from playerService
     * @returns {string} JSON string
     */
    exportPlayersJson(players) {
        const data = players.map(p => ({
            name: p.name,
            positions: p.positions
        }));
        return JSON.stringify(data, null, 2);
    }

    // ===== EXPORT: Teams =====

    /**
     * Generate plain text export for teams
     * @param {Array} teams - Team arrays
     * @param {Object} options - { showElo, showPositions, calculateTeamRating }
     * @returns {string}
     */
    generateTextExport(teams, options = {}) {
        const { showElo = true, showPositions = true, calculateTeamRating } = options;
        const lines = [];

        teams.forEach((team, teamIndex) => {
            const teamRating = calculateTeamRating ? calculateTeamRating(team) : 0;
            lines.push(`TEAM ${teamIndex + 1}${showElo ? ` (${teamRating} ELO)` : ''}`);
            lines.push('-'.repeat(30));

            team.forEach(player => {
                const position = player.assignedPosition;
                const posName = this.positions[position];
                const rating = Math.round(player.positionRating);

                let playerLine = `  \u2022 ${player.name}`;
                if (showPositions) playerLine += ` - ${posName}`;
                if (showElo) playerLine += ` (${rating})`;
                lines.push(playerLine);
            });

            lines.push('');
        });

        return lines.join('\n');
    }

    /**
     * Generate CSV export for teams
     * Uses escapeCSVValue for all fields to prevent CSV injection
     * @param {Array} teams - Team arrays
     * @param {Object} options - { showElo, showPositions }
     * @returns {string}
     */
    generateCsvExport(teams, options = {}) {
        const { showElo = true, showPositions = true } = options;
        const lines = [];
        const header = ['Team', 'Player'];
        if (showPositions) header.push('Position');
        if (showElo) header.push('ELO Rating');

        lines.push(header.join(','));

        teams.forEach((team, teamIndex) => {
            team.forEach(player => {
                const position = player.assignedPosition;
                const posName = this.positions[position];
                const rating = Math.round(player.positionRating);

                const row = [
                    `Team ${teamIndex + 1}`,
                    escapeCSVValue(player.name)
                ];

                if (showPositions) row.push(escapeCSVValue(posName));
                if (showElo) row.push(rating);

                lines.push(row.join(','));
            });
        });

        return lines.join('\n');
    }

    /**
     * Generate JSON export for teams with metadata.
     * Includes positionCode for round-trip compatibility with import.
     * @param {Array} teams - Team arrays
     * @param {Object} options - { showElo, showPositions, calculateTeamRating, activityKey, positionWeights }
     * @returns {string}
     */
    generateJsonExport(teams, options = {}) {
        const {
            showElo = true,
            showPositions = true,
            calculateTeamRating,
            activityKey,
            positionWeights
        } = options;

        const exportData = {
            metadata: {
                exportedAt: new Date().toISOString(),
                activity: activityKey || undefined,
                teamCount: teams.length,
                positionWeights: positionWeights || undefined
            },
            teams: teams.map((team, teamIndex) => ({
                name: `Team ${teamIndex + 1}`,
                totalRating: showElo && calculateTeamRating ? calculateTeamRating(team) : undefined,
                players: team.map(player => {
                    const position = player.assignedPosition;
                    const posName = this.positions[position];
                    const rating = Math.round(player.positionRating);

                    const playerData = { name: player.name };
                    if (showPositions) {
                        playerData.position = posName;
                        playerData.positionCode = position;
                    }
                    if (showElo) playerData.rating = rating;

                    return playerData;
                })
            }))
        };

        return JSON.stringify(exportData, null, 2);
    }
}

export default ImportExportService;
