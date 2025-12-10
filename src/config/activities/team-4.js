// src/config/activities/team-4.js
// Universal team configuration for 4-player teams

/**
 * Team 4 - Universal configuration for 4-player teams
 * Simple configuration for generic team balancing with 4 players per team
 * Ideal for squads, 4-person teams, or any 4-player team activities
 */
export default {
    name: 'Team 4',

    // Activity metadata
    activityType: 'general',
    description: 'Universal team balancing for 4-player teams',

    // Position abbreviations and full names
    positions: {
        'PLAYER 1': 'Player 1',
        'PLAYER 2': 'Player 2',
        'PLAYER 3': 'Player 3',
        'PLAYER 4': 'Player 4'
    },

    // Position weights for team balancing
    // Equal weight for all players
    positionWeights: {
        'PLAYER 1': 1.0,  // Neutral weight - all players equal
        'PLAYER 2': 1.0,  // Neutral weight - all players equal
        'PLAYER 3': 1.0,  // Neutral weight - all players equal
        'PLAYER 4': 1.0   // Neutral weight - all players equal
    },

    // Order in which positions should be displayed
    positionOrder: ['PLAYER 1', 'PLAYER 2', 'PLAYER 3', 'PLAYER 4'],

    // Default team composition
    defaultComposition: {
        'PLAYER 1': 1,  // 1 player in Position 1
        'PLAYER 2': 1,  // 1 player in Position 2
        'PLAYER 3': 1,  // 1 player in Position 3
        'PLAYER 4': 1   // 1 player in Position 4
    }
    // Total team size: 4 players
};
