// src/config/activities/team-1.js
// Universal team configuration for 1-player teams

/**
 * Team 1 - Universal configuration for 1-player teams
 * Simple configuration for generic team balancing with 1 player per team
 * Ideal for individual competitions or single-player activities
 */
export default {
    name: 'Team 1',

    // Grade abbreviations and full names
    positions: {
        'G1': 'Grade 1'
    },

    // Grade weights for team balancing
    // Equal weight for all grades
    positionWeights: {
        'G1': 1.0  // Neutral weight - all grades equal
    },

    // Order in which grades should be displayed
    positionOrder: ['G1'],

    // Default team composition
    defaultComposition: {
        'G1': 1  // 1 player in Grade 1
    }
    // Total team size: 1 player
};
