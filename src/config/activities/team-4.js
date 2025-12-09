// src/config/activities/team-4.js
// Universal team configuration with 4 positions

/**
 * Team 4 - Universal configuration for 4-position teams
 * Simple quad-position configuration for generic team balancing
 * Ideal for squads, 4-person teams, or any 4-player team activities
 */
export default {
    name: 'Team 4',

    // Activity metadata
    activityType: 'general',
    teamSize: 4,
    description: 'Universal team balancing with 4 positions',

    // Position abbreviations and full names
    positions: {
        'P1': 'Position 1',
        'P2': 'Position 2',
        'P3': 'Position 3',
        'P4': 'Position 4'
    },

    // Position weights for team balancing
    // Equal weight for all positions
    positionWeights: {
        'P1': 1.0,  // Neutral weight
        'P2': 1.0,  // Neutral weight
        'P3': 1.0,  // Neutral weight
        'P4': 1.0   // Neutral weight
    },

    // Order in which positions should be displayed
    positionOrder: ['P1', 'P2', 'P3', 'P4'],

    // Default team composition
    defaultComposition: {
        'P1': 1,  // 1 player in Position 1
        'P2': 1,  // 1 player in Position 2
        'P3': 1,  // 1 player in Position 3
        'P4': 1   // 1 player in Position 4
    }
    // Total team size: 4 players
};
