// src/config/activities/team-3.js
// Universal team configuration for 3-player teams

/**
 * Team 3 - Universal configuration for 3-player teams
 * Simple configuration for generic team balancing with 3 players per team
 * Ideal for trios, 3-person teams, or any 3-player team activities
 */
export default {
    name: 'Team 3',

    // Position abbreviations and full names
    positions: {
        'P1': 'Player 1',
        'P2': 'Player 2',
        'P3': 'Player 3'
    },

    // Position weights for team balancing
    // Equal weight for all players
    positionWeights: {
        'P1': 1.0,  // Neutral weight - all players equal
        'P2': 1.0,  // Neutral weight - all players equal
        'P3': 1.0   // Neutral weight - all players equal
    },

    // Order in which positions should be displayed
    positionOrder: ['P1', 'P2', 'P3'],

    // Default team composition
    defaultComposition: {
        'P1': 1,  // 1 player in Position 1
        'P2': 1,  // 1 player in Position 2
        'P3': 1   // 1 player in Position 3
    }
    // Total team size: 3 players
};
