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
        'PLAYER 1': 'Player 1',
        'PLAYER 2': 'Player 2',
        'PLAYER 3': 'Player 3',
        'PLAYER 4': 'Player 4',
        'PLAYER 5': 'Player 5'
    },

    // Position weights for team balancing
    // Equal weight for all players
    positionWeights: {
        'PLAYER 1': 1.0,  // Neutral weight - all players equal
        'PLAYER 2': 1.0,  // Neutral weight - all players equal
        'PLAYER 3': 1.0,  // Neutral weight - all players equal
        'PLAYER 4': 1.0,  // Neutral weight - all players equal
        'PLAYER 5': 1.0   // Neutral weight - all players equal
    },

    // Order in which positions should be displayed
    positionOrder: ['PLAYER 1', 'PLAYER 2', 'PLAYER 3', 'PLAYER 4', 'PLAYER 5'],

    // Default team composition
    defaultComposition: {
        'PLAYER 1': 1,  // 1 player in Position 1
        'PLAYER 2': 1,  // 1 player in Position 2
        'PLAYER 3': 1,  // 1 player in Position 3
        'PLAYER 4': 1,  // 1 player in Position 4
        'PLAYER 5': 1   // 1 player in Position 5
    }
    // Total team size: 5 players
};
