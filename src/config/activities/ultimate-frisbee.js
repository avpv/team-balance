// src/config/activities/ultimate-frisbee.js
// Ultimate Frisbee activity configuration

/**
 * Ultimate Frisbee configuration for team optimizer
 * Defines positions, weights, and default team composition (7-player)
 */
export default {
    name: 'Ultimate Frisbee',

    // Position abbreviations and full names
    positions: {
        'H': 'Handler',
        'C': 'Cutter',
        'D': 'Deep',
        'M': 'Mid'
    },

    // Position weights for team balancing
    // Higher weight = more important position
    positionWeights: {
        'H': 1.0,  // Handler - primary thrower
        'C': 1.0,    // Cutter
        'D': 1.0,  // Deep
        'M': 1.0    // Mid
    },

    // Order in which positions should be displayed
    positionOrder: ['H', 'C', 'M', 'D'],

    // Default team composition (7-player ultimate)
    defaultComposition: {
        'H': 2,  // 2 Handlers
        'C': 2,   // 2 Cutters
        'M': 2,   // 2 Mids
        'D': 1   // 1 Deep
    }
    // Total team size: 7 players
};
