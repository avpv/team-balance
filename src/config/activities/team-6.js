// src/config/activities/team-6.js
// Universal team configuration with 6 positions

/**
 * Team 6 - Universal configuration for 6-position teams
 * Simple 6-position configuration for generic team balancing
 * Ideal for sextets, 6-person teams, or any 6-player team activities
 */
export default {
    name: 'Team 6',

    // Activity metadata
    activityType: 'general',
    teamSize: 6,
    description: 'Universal team balancing with 6 positions',

    // Position abbreviations and full names
    positions: {
        'P1': 'Position 1',
        'P2': 'Position 2',
        'P3': 'Position 3',
        'P4': 'Position 4',
        'P5': 'Position 5',
        'P6': 'Position 6'
    },

    // Position weights for team balancing
    // Equal weight for all positions
    positionWeights: {
        'P1': 1.0,  // Neutral weight
        'P2': 1.0,  // Neutral weight
        'P3': 1.0,  // Neutral weight
        'P4': 1.0,  // Neutral weight
        'P5': 1.0,  // Neutral weight
        'P6': 1.0   // Neutral weight
    },

    // Order in which positions should be displayed
    positionOrder: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'],

    // Default team composition
    defaultComposition: {
        'P1': 1,  // 1 player in Position 1
        'P2': 1,  // 1 player in Position 2
        'P3': 1,  // 1 player in Position 3
        'P4': 1,  // 1 player in Position 4
        'P5': 1,  // 1 player in Position 5
        'P6': 1   // 1 player in Position 6
    }
    // Total team size: 6 players
};
