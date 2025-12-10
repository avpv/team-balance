// src/config/activities/team-6.js
// Universal team configuration for 6-player teams

/**
 * Team 6 - Universal configuration for 6-player teams
 * Simple configuration for generic team balancing with 6 players per team
 * Ideal for sextets, 6-person teams, or any 6-player team activities
 */
export default {
    name: 'Team 6',

    // Activity metadata
    activityType: 'general',
    description: 'Universal team balancing for 6-player teams',

    // Position abbreviations and full names
    positions: {
        'PLAYER 1': 'Player 1',
        'PLAYER 2': 'Player 2',
        'PLAYER 3': 'Player 3',
        'PLAYER 4': 'Player 4',
        'PLAYER 5': 'Player 5',
        'PLAYER 6': 'Player 6'
    },

    // Position weights for team balancing
    // Equal weight for all players
    positionWeights: {
        'PLAYER 1': 1.0,  // Neutral weight - all players equal
        'PLAYER 2': 1.0,  // Neutral weight - all players equal
        'PLAYER 3': 1.0,  // Neutral weight - all players equal
        'PLAYER 4': 1.0,  // Neutral weight - all players equal
        'PLAYER 5': 1.0,  // Neutral weight - all players equal
        'PLAYER 6': 1.0   // Neutral weight - all players equal
    },

    // Order in which positions should be displayed
    positionOrder: ['PLAYER 1', 'PLAYER 2', 'PLAYER 3', 'PLAYER 4', 'PLAYER 5', 'PLAYER 6'],

    // Default team composition
    defaultComposition: {
        'PLAYER 1': 1,  // 1 player in Position 1
        'PLAYER 2': 1,  // 1 player in Position 2
        'PLAYER 3': 1,  // 1 player in Position 3
        'PLAYER 4': 1,  // 1 player in Position 4
        'PLAYER 5': 1,  // 1 player in Position 5
        'PLAYER 6': 1   // 1 player in Position 6
    }
    // Total team size: 6 players
};
