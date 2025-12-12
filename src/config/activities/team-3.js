// src/config/activities/team-3.js
// Universal team configuration for 3-player teams

/**
 * Team 3 - Universal configuration for 3-player teams
 * Simple configuration for generic team balancing with 3 players per team
 * Ideal for trios, 3-person teams, or any 3-player team activities
 */
export default {
    name: 'Team 3',

    // Grade abbreviations and full names
    positions: {
        'G1': 'Grade 1',
        'G2': 'Grade 2',
        'G3': 'Grade 3'
    },

    // Grade weights for team balancing
    // Equal weight for all grades
    positionWeights: {
        'G1': 1.0,  // Neutral weight - all grades equal
        'G2': 1.0,  // Neutral weight - all grades equal
        'G3': 1.0   // Neutral weight - all grades equal
    },

    // Order in which grades should be displayed
    positionOrder: ['G1', 'G2', 'G3'],

    // Default team composition
    defaultComposition: {
        'G1': 1,  // 1 player in Grade 1
        'G2': 1,  // 1 player in Grade 2
        'G3': 1   // 1 player in Grade 3
    }
    // Total team size: 3 players
};
