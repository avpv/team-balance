// src/config/activities/team-6.js
// Universal team configuration for 6-player teams

/**
 * Team 6 - Universal configuration for 6-player teams
 * Simple configuration for generic team balancing with 6 players per team
 * Ideal for sextets, 6-person teams, or any 6-player team activities
 */
export default {
    name: 'Team 6',

    // Position abbreviations and full names
    positions: {
        'P1': 'Player 1',
        'P2': 'Player 2',
        'P3': 'Player 3',
        'P4': 'Player 4',
        'P5': 'Player 5',
        'P6': 'Player 6'
    },

    // Position weights for team balancing
    // Equal weight for all players
    positionWeights: {
        'P1': 1.0,  // Neutral weight - all players equal
        'P2': 1.0,  // Neutral weight - all players equal
        'P3': 1.0,  // Neutral weight - all players equal
        'P4': 1.0,  // Neutral weight - all players equal
        'P5': 1.0,  // Neutral weight - all players equal
        'P6': 1.0   // Neutral weight - all players equal
    },

    // Order in which positions should be displayed
    positionOrder: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'],

    // Default team composition
    defaultComposition: {
        'P1': 1,  // 1 player in Position 1
        'P2': 1,  // 1 player in Position 2
        'P3': 1,  // 1 player in Position 3
        'P4': 1,  // 1 player in Position 4
        'P5': 1,  // 1 player in Position 5
        'P6': 1   // 1 player in Position 6
    }
    // Total team size: 6 players
};
