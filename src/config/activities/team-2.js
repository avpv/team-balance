// src/config/activities/team-2.js
// Universal team configuration for 2-player teams

/**
 * Team 2 - Universal configuration for 2-player teams
 * Simple configuration for generic team balancing with 2 players per team
 * Ideal for doubles games, pairs, or any 2-person team activities
 */
export default {
    name: 'Team 2',

    // Position abbreviations and full names
    positions: {
        'P1': 'Player 1',
        'P2': 'Player 2'
    },

    // Position weights for team balancing
    // Equal weight for all players
    positionWeights: {
        'P1': 1.0,  // Neutral weight - all players equal
        'P2': 1.0   // Neutral weight - all players equal
    },

    // Order in which positions should be displayed
    positionOrder: ['P1', 'P2'],

    // Default team composition
    defaultComposition: {
        'P1': 1,  // 1 player in Position 1
        'P2': 1   // 1 player in Position 2
    }
    // Total team size: 2 players
};
