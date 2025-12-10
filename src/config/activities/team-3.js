// src/config/activities/team-3.js
// Universal team configuration for 3-player teams

/**
 * Team 3 - Universal configuration for 3-player teams
 * Simple configuration for generic team balancing with 3 players per team
 * Ideal for trios, 3-person teams, or any 3-player team activities
 */
export default {
    name: 'Team 3',

    // Activity metadata
    activityType: 'general',
    description: 'Universal team balancing for 3-player teams',

    // Position abbreviations and full names
    positions: {
        'PLAYER 1': 'Player 1',
        'PLAYER 2': 'Player 2',
        'PLAYER 3': 'Player 3'
    },

    // Position weights for team balancing
    // Equal weight for all players
    positionWeights: {
        'PLAYER 1': 1.0,  // Neutral weight - all players equal
        'PLAYER 2': 1.0,  // Neutral weight - all players equal
        'PLAYER 3': 1.0   // Neutral weight - all players equal
    },

    // Order in which positions should be displayed
    positionOrder: ['PLAYER 1', 'PLAYER 2', 'PLAYER 3'],

    // Default team composition
    defaultComposition: {
        'PLAYER 1': 1,  // 1 player in Position 1
        'PLAYER 2': 1,  // 1 player in Position 2
        'PLAYER 3': 1   // 1 player in Position 3
    }
    // Total team size: 3 players
};
