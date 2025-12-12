// src/config/activities/overwatch-2.js
// Overwatch 2 activity configuration

/**
 * Overwatch 2 configuration for team optimizer
 * Defines positions, weights, and default team composition (5v5 format)
 */
export default {
    name: 'Overwatch 2',

    // Position abbreviations and full names
    positions: {
        'T': 'Tank',
        'DPS': 'DPS',
        'S': 'Support'
    },

    // Position weights for team balancing
    positionWeights: {
        'T': 1.0,
        'DPS': 1.0,
        'S': 1.0
    },

    // Order in which positions should be displayed
    positionOrder: ['T', 'DPS', 'S'],

    // Default team composition (5-player team: 1-2-2)
    defaultComposition: {
        'T': 1,  // 1 Tank
        'DPS': 2,   // 2 DPS
        'S': 2    // 2 Supports
    }
    // Total team size: 5 players (1 Tank, 2 DPS, 2 Supports)
};
