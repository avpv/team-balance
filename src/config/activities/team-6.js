// src/config/activities/team-6.js
// Universal team configuration for 6-player teams

/**
 * Team 6 - Universal configuration for 6-player teams
 * Simple configuration for generic team balancing with 6 players per team
 * Ideal for sextets, 6-person teams, or any 6-player team activities
 */
export default {
    name: 'Team 6',

    // Grade abbreviations and full names
    positions: {
        'G1': 'Grade 1',
        'G2': 'Grade 2',
        'G3': 'Grade 3',
        'G4': 'Grade 4',
        'G5': 'Grade 5',
        'G6': 'Grade 6'
    },

    // Grade weights for team balancing
    // Equal weight for all grades
    positionWeights: {
        'G1': 1.0,  // Neutral weight - all grades equal
        'G2': 1.0,  // Neutral weight - all grades equal
        'G3': 1.0,  // Neutral weight - all grades equal
        'G4': 1.0,  // Neutral weight - all grades equal
        'G5': 1.0,  // Neutral weight - all grades equal
        'G6': 1.0   // Neutral weight - all grades equal
    },

    // Order in which grades should be displayed
    positionOrder: ['G1', 'G2', 'G3', 'G4', 'G5', 'G6'],

    // Default team composition
    defaultComposition: {
        'G1': 1,  // 1 player in Grade 1
        'G2': 1,  // 1 player in Grade 2
        'G3': 1,  // 1 player in Grade 3
        'G4': 1,  // 1 player in Grade 4
        'G5': 1,  // 1 player in Grade 5
        'G6': 1   // 1 player in Grade 6
    }
    // Total team size: 6 players
};
