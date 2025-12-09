// src/config/activities/team-2.js
// Universal team configuration with 2 positions

/**
 * Team 2 - Universal configuration for 2-position teams
 * Simple dual-position configuration for generic team balancing
 * Ideal for doubles games, pairs, or any 2-person team activities
 */
export default {
    name: 'Team 2',

    // Activity metadata
    activityType: 'general',
    teamSize: 2,
    description: 'Universal team balancing with 2 positions',

    // Position abbreviations and full names
    positions: {
        'P1': 'Position 1',
        'P2': 'Position 2'
    },

    // Position weights for team balancing
    // Equal weight for all positions
    positionWeights: {
        'P1': 1.0,  // Neutral weight
        'P2': 1.0   // Neutral weight
    },

    // Order in which positions should be displayed
    positionOrder: ['P1', 'P2'],

    // Default team composition
    defaultComposition: {
        'P1': 1,  // 1 player in Position 1
        'P2': 1   // 1 player in Position 2
    }
    // Total team size: 2 players
};
