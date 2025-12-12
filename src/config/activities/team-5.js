// src/config/activities/team-5.js
// Universal team configuration for 5-player teams

/**
 * Team 5 - Universal configuration for 5-player teams
 * Simple configuration for generic team balancing with 5 players per team
 * Ideal for quintets, 5-person teams, or any 5-player team activities
 */
export default {
    name: 'Team 5',

    // Position abbreviations and full names
    positions: {
        'P1': 'Player 1',
        'P2': 'Player 2',
        'P3': 'Player 3',
        'P4': 'Player 4',
        'P5': 'Player 5'
    },

    // Position weights for team balancing
    // Equal weight for all players
    positionWeights: {
        'P1': 1.0,  // Neutral weight - all players equal
        'P2': 1.0,  // Neutral weight - all players equal
        'P3': 1.0,  // Neutral weight - all players equal
        'P4': 1.0,  // Neutral weight - all players equal
        'P5': 1.0   // Neutral weight - all players equal
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
