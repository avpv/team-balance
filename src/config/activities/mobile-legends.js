// src/config/activities/mobile-legends.js
// Mobile Legends: Bang Bang activity configuration

/**
 * Mobile Legends: Bang Bang configuration for team optimizer
 * Defines positions, weights, and default team composition
 */
export default {
    name: 'Mobile Legends: Bang Bang',

    // Position abbreviations and full names
    positions: {
        'G': 'Gold Lane',
        'E': 'EXP Lane',
        'M': 'Mid Lane',
        'J': 'Jungle',
        'R': 'Roam'
    },

    // Position weights for team balancing
    positionWeights: {
        'G': 1.0,
        'E': 1.0,
        'M': 1.0,
        'J': 1.0,
        'R': 1.0
    },

    // Order in which positions should be displayed
    positionOrder: ['G', 'E', 'M', 'J', 'R'],

    // Default team composition (5-player team)
    defaultComposition: {
        'G': 1,  // 1 Gold Laner
        'E': 1,   // 1 EXP Laner
        'M': 1,   // 1 Mid Laner
        'J': 1,   // 1 Jungler
        'R': 1   // 1 Roamer
    }
    // Total team size: 5 players
};
