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
    teamSize: 4,
    description: 'Universal team balancing for 4-player teams',

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
    // Total team size: 4 players
};
