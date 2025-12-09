// src/config/activities/team-2.js
// Universal team configuration for 2-player teams

/**
 * Team 2 - Universal configuration for 2-player teams
 * Simple configuration for generic team balancing with 2 players per team
 * Ideal for doubles games, pairs, or any 2-person team activities
 */
export default {
    name: 'Team 2',

    // Activity metadata
    activityType: 'general',
    teamSize: 2,
    description: 'Universal team balancing for 2-player teams',

    // Position abbreviations and full names
    positions: {
        'PLAYER 1': 'Player 1',
        'PLAYER 2': 'Player 2'
    },

    // Position weights for team balancing
    // Equal weight for all players
    positionWeights: {
        'PLAYER 1': 1.0,  // Neutral weight - all players equal
        'PLAYER 2': 1.0   // Neutral weight - all players equal
    },

    // Order in which positions should be displayed
    positionOrder: ['PLAYER 1', 'PLAYER 2'],

    // Default team composition
    defaultComposition: {
        'PLAYER 1': 1,  // 1 player in Position 1
        'PLAYER 2': 1   // 1 player in Position 2
    }
    // Total team size: 2 players
};
