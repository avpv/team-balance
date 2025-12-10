// src/config/activities/team-1.js
// Universal team configuration for 1-player teams

/**
 * Team 1 - Universal configuration for 1-player teams
 * Simple configuration for generic team balancing with 1 player per team
 * Ideal for individual competitions or single-player activities
 */
export default {
    name: 'Team 1',

    // Activity metadata
    activityType: 'general',
    description: 'Universal team balancing for 1-player teams',

    // Position abbreviations and full names
    positions: {
        'PLAYER 1': 'Player 1'
    },

    // Position weights for team balancing
    // Equal weight for all players
    positionWeights: {
        'PLAYER 1': 1.0  // Neutral weight - all players equal
    },

    // Order in which positions should be displayed
    positionOrder: ['PLAYER 1'],

    // Default team composition
    defaultComposition: {
        'PLAYER 1': 1  // 1 player in Position 1
    }
    // Total team size: 1 player
};
