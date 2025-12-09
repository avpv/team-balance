// src/config/activities/team-5.js
// Universal team configuration for 5-player teams

/**
 * Team 5 - Universal configuration for 5-player teams
 * Simple configuration for generic team balancing with 5 players per team
 * Ideal for quintets, 5-person teams, or any 5-player team activities
 */
export default {
    name: 'Team 5',

    // Activity metadata
    activityType: 'general',
    teamSize: 5,
    description: 'Universal team balancing for 5-player teams',

    // Position abbreviations and full names
    positions: {
        'PLAYER': 'Player'
    },

    // Position weights for team balancing
    // Equal weight for all players
    positionWeights: {
        'PLAYER': 1.0  // Neutral weight - all players equal
    },

    // Order in which positions should be displayed
    positionOrder: ['PLAYER'],

    // Default team composition
    defaultComposition: {
        'PLAYER': 1  // 1 player per position
    }
    // Total team size: 5 players
};
