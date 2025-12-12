// src/config/activities/counter-strike-2.js
// Counter-Strike 2 activity configuration

/**
 * Counter-Strike 2 configuration for team optimizer
 * Defines positions, weights, and default team composition
 */
export default {
    name: 'Counter-Strike 2',

    // Position abbreviations and full names
    positions: {
        'E': 'Entry Fragger',
        'L': 'Lurker',
        'AWP': 'AWPer',
        'IGL': 'In-Game Leader',
        'S': 'Support'
    },

    // Position weights for team balancing
    positionWeights: {
        'E': 1.0,
        'L': 1.0,
        'AWP': 1.0,
        'IGL': 1.0,
        'S': 1.0
    },

    // Order in which positions should be displayed
    positionOrder: ['E', 'L', 'AWP', 'IGL', 'S'],

    // Default team composition (5-player team)
    defaultComposition: {
        'E': 1,  // 1 Entry Fragger
        'L': 1,   // 1 Lurker
        'AWP': 1,    // 1 AWPer
        'IGL': 1,    // 1 IGL
        'S': 1     // 1 Support
    }
    // Total team size: 5 players
};
