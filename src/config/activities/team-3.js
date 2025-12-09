// src/config/activities/team-3.js
// Universal team configuration with 3 positions

/**
 * Team 3 - Universal configuration for 3-position teams
 * Simple triple-position configuration for generic team balancing
 * Ideal for trios, 3-person teams, or any 3-player team activities
 */
export default {
    name: 'Team 3',

    // Activity metadata
    activityType: 'general',
    teamSize: 3,
    description: 'Universal team balancing with 3 positions',

    // Position abbreviations and full names
    positions: {
        'P1': 'Position 1',
        'P2': 'Position 2',
        'P3': 'Position 3'
    },

    // Position weights for team balancing
    // Equal weight for all positions
    positionWeights: {
        'P1': 1.0,  // Neutral weight
        'P2': 1.0,  // Neutral weight
        'P3': 1.0   // Neutral weight
    },

    // Order in which positions should be displayed
    positionOrder: ['P1', 'P2', 'P3'],

    // Default team composition
    defaultComposition: {
        'P1': 1,  // 1 player in Position 1
        'P2': 1,  // 1 player in Position 2
        'P3': 1   // 1 player in Position 3
    }
    // Total team size: 3 players
};
