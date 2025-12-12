// src/config/activities/pubg-battlegrounds.js
// PUBG: Battlegrounds activity configuration

/**
 * PUBG: Battlegrounds configuration for team optimizer
 * Defines positions, weights, and default team composition
 */
export default {
    name: 'PUBG: Battlegrounds',

    // Position abbreviations and full names
    positions: {
        'IGL': 'In-Game Leader',
        'SC': 'Scout',
        'S': 'Support',
        'F': 'Fragger'
    },

    // Position weights for team balancing
    positionWeights: {
        'IGL': 1.0,
        'SC': 1.0,
        'S': 1.0,
        'F': 1.0
    },

    // Order in which positions should be displayed
    positionOrder: ['IGL', 'SC', 'S', 'F'],

    // Default team composition (4-player team)
    defaultComposition: {
        'IGL': 1,   // 1 IGL
        'SC': 1, // 1 Scout
        'S': 1,   // 1 Support
        'F': 1   // 1 Fragger
    }
    // Total team size: 4 players
};
