// src/config/activities/league-of-legends.js
// League of Legends activity configuration

/**
 * League of Legends configuration for team optimizer
 * Defines positions, weights, and default team composition
 */
export default {
    name: 'League of Legends',

    // Position abbreviations and full names
    positions: {
        'T': 'Top Lane',
        'J': 'Jungle',
        'M': 'Mid Lane',
        'ADC': 'ADC',
        'S': 'Support'
    },

    // Position weights for team balancing
    positionWeights: {
        'T': 1.0,
        'J': 1.0,
        'M': 1.0,
        'ADC': 1.0,
        'S': 1.0
    },

    // Order in which positions should be displayed
    positionOrder: ['T', 'J', 'M', 'ADC', 'S'],

    // Default team composition (5-player team)
    defaultComposition: {
        'T': 1,  // 1 Top Laner
        'J': 1,  // 1 Jungler
        'M': 1,  // 1 Mid Laner
        'ADC': 1,  // 1 ADC
        'S': 1   // 1 Support
    }
    // Total team size: 5 players
};
