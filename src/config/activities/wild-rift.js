// src/config/activities/wild-rift.js
// Wild Rift activity configuration

/**
 * Wild Rift configuration for team optimizer
 * Defines positions, weights, and default team composition
 */
export default {
    name: 'Wild Rift',

    // Position abbreviations and full names
    positions: {
        'B': 'Baron Lane',
        'J': 'Jungle',
        'M': 'Mid Lane',
        'D': 'Dragon Lane',
        'S': 'Support'
    },

    // Position weights for team balancing
    positionWeights: {
        'B': 1.0,
        'J': 1.0,
        'M': 1.0,
        'D': 1.0,
        'S': 1.0
    },

    // Order in which positions should be displayed
    positionOrder: ['B', 'J', 'M', 'D', 'S'],

    // Default team composition (5-player team)
    defaultComposition: {
        'B': 1,   // 1 Baron Laner
        'J': 1,     // 1 Jungler
        'M': 1,     // 1 Mid Laner
        'D': 1,  // 1 Dragon Laner
        'S': 1      // 1 Support
    }
    // Total team size: 5 players
};
