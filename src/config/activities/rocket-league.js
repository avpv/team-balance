// src/config/activities/rocket-league.js
// Rocket League activity configuration

/**
 * Rocket League configuration for team optimizer
 * Defines positions, weights, and default team composition
 */
export default {
    name: 'Rocket League',

    // Position abbreviations and full names
    positions: {
        'S': 'Striker',
        'M': 'Midfielder',
        'D': 'Defender/Goalie'
    },

    // Position weights for team balancing
    positionWeights: {
        'S': 1.0,
        'M': 1.0,
        'D': 1.0
    },

    // Order in which positions should be displayed
    positionOrder: ['S', 'M', 'D'],

    // Default team composition (3-player team)
    defaultComposition: {
        'S': 1,  // 1 Striker
        'M': 1,  // 1 Midfielder
        'D': 1   // 1 Defender/Goalie
    }
    // Total team size: 3 players
};
