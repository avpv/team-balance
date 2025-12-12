// src/config/activities/valorant.js
// Valorant activity configuration

/**
 * Valorant configuration for team optimizer
 * Defines positions, weights, and default team composition
 */
export default {
    name: 'Valorant',

    // Position abbreviations and full names
    positions: {
        'D': 'Duelist',
        'I': 'Initiator',
        'C': 'Controller',
        'S': 'Sentinel',
        'F': 'Flex/IGL'
    },

    // Position weights for team balancing
    positionWeights: {
        'D': 1.0,
        'I': 1.0,
        'C': 1.0,
        'S': 1.0,
        'F': 1.0
    },

    // Order in which positions should be displayed
    positionOrder: ['D', 'I', 'C', 'S', 'F'],

    // Default team composition (5-player team)
    defaultComposition: {
        'D': 1,  // 1 Duelist
        'I': 1,  // 1 Initiator
        'C': 1,  // 1 Controller
        'S': 1,  // 1 Sentinel
        'F': 1   // 1 Flex/IGL
    }
    // Total team size: 5 players
};
