// src/config/activities/team-5.js
// Universal team configuration with 5 positions

/**
 * Team 5 - Universal configuration for 5-position teams
 * Simple 5-position configuration for generic team balancing
 * Ideal for quintets, 5-person teams, or any 5-player team activities
 */
export default {
    name: 'Team 5',

    // Activity metadata
    activityType: 'general',
    teamSize: 5,
    description: 'Universal team balancing with 5 positions',

    // Position abbreviations and full names
    positions: {
        'P1': 'Position 1',
        'P2': 'Position 2',
        'P3': 'Position 3',
        'P4': 'Position 4',
        'P5': 'Position 5'
    },

    // Position weights for team balancing
    // Equal weight for all positions
    positionWeights: {
        'P1': 1.0,  // Neutral weight
        'P2': 1.0,  // Neutral weight
        'P3': 1.0,  // Neutral weight
        'P4': 1.0,  // Neutral weight
        'P5': 1.0   // Neutral weight
    },

    // Order in which positions should be displayed
    positionOrder: ['P1', 'P2', 'P3', 'P4', 'P5'],

    // Default team composition
    defaultComposition: {
        'P1': 1,  // 1 player in Position 1
        'P2': 1,  // 1 player in Position 2
        'P3': 1,  // 1 player in Position 3
        'P4': 1,  // 1 player in Position 4
        'P5': 1   // 1 player in Position 5
    }
    // Total team size: 5 players
};
