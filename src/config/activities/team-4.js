// src/config/activities/team-4.js
// Universal team configuration for 4-player teams

/**
 * Team 4 - Universal configuration for 4-player teams
 * Simple configuration for generic team balancing with 4 players per team
 * Ideal for squads, 4-person teams, or any 4-player team activities
 */
export default {
    name: 'Team 4',

    // Grade abbreviations and full names
    positions: {
        'G1': 'Grade 1',
        'G2': 'Grade 2',
        'G3': 'Grade 3',
        'G4': 'Grade 4'
    },

    // Grade weights for team balancing
    // Equal weight for all grades
    positionWeights: {
        'G1': 1.0,  // Neutral weight - all grades equal
        'G2': 1.0,  // Neutral weight - all grades equal
        'G3': 1.0,  // Neutral weight - all grades equal
        'G4': 1.0   // Neutral weight - all grades equal
    },

    // Order in which grades should be displayed
    positionOrder: ['G1', 'G2', 'G3', 'G4'],

    // Default team composition
    defaultComposition: {
        'G1': 1,  // 1 player in Grade 1
        'G2': 1,  // 1 player in Grade 2
        'G3': 1,  // 1 player in Grade 3
        'G4': 1   // 1 player in Grade 4
    }
    // Total team size: 4 players
};
