// src/config/activities/dota2.js
// Dota 2 activity configuration

/**
 * Dota 2 configuration for team optimizer
 * Defines positions, weights, and default team composition
 */
export default {
    name: 'Dota 2',

    // Position abbreviations and full names
    positions: {
        'C': 'Carry',
        'M': 'Mid',
        'O': 'Offlane',
        'SS': 'Soft Support',
        'HS': 'Hard Support'
    },

    // Position weights for team balancing
    positionWeights: {
        'C': 1.0,
        'M': 1.0,
        'O': 1.0,
        'SS': 1.0,
        'HS': 1.0
    },

    // Order in which positions should be displayed
    positionOrder: ['C', 'M', 'O', 'SS', 'HS'],

    // Default team composition (5-player team)
    defaultComposition: {
        'C': 1,  // 1 Carry
        'M': 1,    // 1 Mid
        'O': 1,    // 1 Offlane
        'SS': 1,   // 1 Soft Support
        'HS': 1    // 1 Hard Support
    }
    // Total team size: 5 players
};
