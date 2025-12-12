// src/config/activities/team-4.js
// Universal team configuration for 4-player teams

/**
 * Team 4 - Universal configuration for 4-player teams
 * Simple configuration for generic team balancing with 4 players per team
 * Ideal for squads, 4-person teams, or any 4-player team activities
 */
export default {
    name: 'Team 4',

    // Position abbreviations and full names
    positions: {
        'P1': 'Player 1',
        'P2': 'Player 2',
        'P3': 'Player 3',
        'P4': 'Player 4'
    },

    // Position weights for team balancing
    // Equal weight for all players
    positionWeights: {
        'P1': 1.0,  // Neutral weight - all players equal
        'P2': 1.0,  // Neutral weight - all players equal
        'P3': 1.0,  // Neutral weight - all players equal
        'P4': 1.0   // Neutral weight - all players equal
    },

    // Order in which positions should be displayed
    positionOrder: ['P1', 'P2', 'P3', 'P4'],

    // Default team composition
    defaultComposition: {
        'P1': 1,  // 1 player in Position 1
        'P2': 1,  // 1 player in Position 2
        'P3': 1,  // 1 player in Position 3
        'P4': 1   // 1 player in Position 4
    }
    // Total team size: 4 players
};
