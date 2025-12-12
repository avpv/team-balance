// src/config/activities/smite.js
// SMITE activity configuration

/**
 * SMITE configuration for team optimizer
 * Defines positions, weights, and default team composition
 */
export default {
    name: 'SMITE',

    // Position abbreviations and full names
    positions: {
        'SO': 'Solo Lane',
        'J': 'Jungle',
        'M': 'Mid Lane',
        'C': 'Carry',
        'S': 'Support'
    },

    // Position weights for team balancing
    positionWeights: {
        'SO': 1.0,
        'J': 1.0,
        'M': 1.0,
        'C': 1.0,
        'S': 1.0
    },

    // Order in which positions should be displayed
    positionOrder: ['SO', 'J', 'M', 'C', 'S'],

    // Default team composition (5-player team)
    defaultComposition: {
        'SO': 1,   // 1 Solo Laner
        'J': 1,    // 1 Jungler
        'M': 1,    // 1 Mid Laner
        'C': 1,  // 1 Carry
        'S': 1     // 1 Support
    }
    // Total team size: 5 players
};
