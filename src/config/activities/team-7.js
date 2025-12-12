// src/config/activities/team-7.js
// Universal team configuration for 7-player teams

/**
 * Team 7 - Universal configuration for 7-player teams
 * Simple configuration for generic team balancing with 7 players per team
 * Ideal for septets, 7-person teams, or any 7-player team activities
 */
export default {
    name: 'Team 7',

    // Grade abbreviations and full names
    positions: {
        'G1': 'Grade 1',
        'G2': 'Grade 2',
        'G3': 'Grade 3',
        'G4': 'Grade 4',
        'G5': 'Grade 5',
        'G6': 'Grade 6',
        'G7': 'Grade 7'
    },

    // Grade weights for team balancing
    // Equal weight for all grades
    positionWeights: {
        'G1': 1.0,  // Neutral weight - all grades equal
        'G2': 1.0,  // Neutral weight - all grades equal
        'G3': 1.0,  // Neutral weight - all grades equal
        'G4': 1.0,  // Neutral weight - all grades equal
        'G5': 1.0,  // Neutral weight - all grades equal
        'G6': 1.0,  // Neutral weight - all grades equal
        'G7': 1.0   // Neutral weight - all grades equal
    },

    // Order in which grades should be displayed
    positionOrder: ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7'],

    // Default team composition
    defaultComposition: {
        'G1': 1,  // 1 player in Grade 1
        'G2': 1,  // 1 player in Grade 2
        'G3': 1,  // 1 player in Grade 3
        'G4': 1,  // 1 player in Grade 4
        'G5': 1,  // 1 player in Grade 5
        'G6': 1,  // 1 player in Grade 6
        'G7': 1   // 1 player in Grade 7
    }
    // Total team size: 7 players
};
