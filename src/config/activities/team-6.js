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
    teamSize: 6,
    description: 'Universal team balancing for 6-player teams',

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
    // Total team size: 6 players
};
