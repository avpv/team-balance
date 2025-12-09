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
    teamSize: 3,
    description: 'Universal team balancing for 3-player teams',

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
    // Total team size: 3 players
};
