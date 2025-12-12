// src/config/activities/team-2.js
// Universal team configuration for 2-player teams

/**
 * Team 2 - Universal configuration for 2-player teams
 * Simple configuration for generic team balancing with 2 players per team
 * Ideal for doubles games, pairs, or any 2-person team activities
 */
export default {
    name: 'Team 2',

    // Grade abbreviations and full names
    positions: {
        'G1': 'Grade 1',
        'G2': 'Grade 2'
    },

    // Grade weights for team balancing
    // Equal weight for all grades
    positionWeights: {
        'G1': 1.0,  // Neutral weight - all grades equal
        'G2': 1.0   // Neutral weight - all grades equal
    },

    // Order in which grades should be displayed
    positionOrder: ['G1', 'G2'],

    // Default team composition
    defaultComposition: {
        'G1': 1,  // 1 player in Grade 1
        'G2': 1   // 1 player in Grade 2
    }
    // Total team size: 2 players
};
