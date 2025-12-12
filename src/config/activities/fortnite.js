// src/config/activities/fortnite.js
// Fortnite (Competitive) activity configuration

/**
 * Fortnite configuration for team optimizer
 * Defines positions, weights, and default team composition (Squad format)
 */
export default {
    name: 'Fortnite (Competitive)',

    // Position abbreviations and full names
    positions: {
        'F': 'Frag',
        'SP': 'Support',
        'IGL': 'IGL',
        'A': 'Anchor'
    },

    // Position weights for team balancing
    positionWeights: {
        'F': 1.0,
        'SP': 1.0,
        'IGL': 1.0,
        'A': 1.0
    },

    // Order in which positions should be displayed
    positionOrder: ['F', 'SP', 'IGL', 'A'],

    // Default team composition (4-player squad)
    defaultComposition: {
        'F': 1,     // 1 Frag
        'SP': 1,  // 1 Support
        'IGL': 1,      // 1 IGL
        'A': 1    // 1 Anchor
    }
    // Total team size: 4 players (squad format)
};
