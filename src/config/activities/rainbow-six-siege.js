// src/config/activities/rainbow-six-siege.js
// Tom Clancy's Rainbow Six Siege activity configuration

/**
 * Rainbow Six Siege configuration for team optimizer
 * Defines positions, weights, and default team composition
 */
export default {
    name: "Tom Clancy's Rainbow Six Siege",

    // Position abbreviations and full names
    positions: {
        'E': 'Entry Fragger',
        'B': 'Hard Breacher',
        'S': 'Support',
        'FL': 'Flex',
        'A': 'Roamer/Anchor'
    },

    // Position weights for team balancing
    positionWeights: {
        'E': 1.0,
        'B': 1.0,
        'S': 1.0,
        'FL': 1.0,
        'A': 1.0
    },

    // Order in which positions should be displayed
    positionOrder: ['E', 'B', 'S', 'FL', 'A'],

    // Default team composition (5-player team)
    defaultComposition: {
        'E': 1,   // 1 Entry Fragger
        'B': 1,  // 1 Hard Breacher
        'S': 1,     // 1 Support
        'FL': 1,    // 1 Flex
        'A': 1   // 1 Roamer/Anchor
    }
    // Total team size: 5 players
};
