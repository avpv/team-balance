// src/config/activities/cricket.js
// Cricket activity configuration

/**
 * Cricket configuration for team optimizer
 * Defines positions, weights, and default team composition (11-player)
 */
export default {
    name: 'Cricket',

    // Position abbreviations and full names
    positions: {
        'WK': 'Wicket-keeper',
        'B': 'Batsman',
        'AR': 'All-rounder',
        'FB': 'Fast Bowler',
        'SB': 'Spin Bowler'
    },

    // Position weights for team balancing
    // Higher weight = more important position
    positionWeights: {
        'WK': 1.0,    // Wicket-keeper
        'AR': 1.0,   // All-rounder - most versatile
        'FB': 1.0,  // Fast Bowler
        'SB': 1.0, // Spin Bowler
        'B': 1.0    // Batsman
    },

    // Order in which positions should be displayed
    positionOrder: ['WK', 'B', 'AR', 'FB', 'SB'],

    // Default team composition (11-player cricket)
    defaultComposition: {
        'WK': 1,    // 1 Wicket-keeper
        'B': 4,   // 4 Batsmen
        'AR': 2,    // 2 All-rounders
        'FB': 2,  // 2 Fast Bowlers
        'SB': 2   // 2 Spin Bowlers
    }
    // Total team size: 11 players
};
