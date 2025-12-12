// src/config/activities/pubg-mobile.js
// PUBG Mobile activity configuration

/**
 * PUBG Mobile configuration for team optimizer
 * Defines positions, weights, and default team composition
 */
export default {
    name: 'PUBG Mobile',

    // Position abbreviations and full names
    positions: {
        'IGL': 'In-Game Leader',
        'F': 'Fragger',
        'SC': 'Scout',
        'S': 'Support'
    },

    // Position weights for team balancing
    positionWeights: {
        'IGL': 1.0,
        'F': 1.0,
        'SC': 1.0,
        'S': 1.0
    },

    // Order in which positions should be displayed
    positionOrder: ['IGL', 'F', 'SC', 'S'],

    // Default team composition (4-player team)
    defaultComposition: {
        'IGL': 1,   // 1 IGL
        'F': 1,  // 1 Fragger
        'SC': 1, // 1 Scout
        'S': 1    // 1 Support
    }
    // Total team size: 4 players
};
