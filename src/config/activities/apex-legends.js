// src/config/activities/apex-legends.js
// Apex Legends activity configuration

/**
 * Apex Legends configuration for team optimizer
 * Defines positions, weights, and default team composition
 */
export default {
    name: 'Apex Legends',

    // Position abbreviations and full names
    positions: {
        'IGL': 'IGL/Recon',
        'F': 'Fragger/Assault',
        'S': 'Support/Controller'
    },

    // Position weights for team balancing
    positionWeights: {
        'IGL': 1.0,
        'F': 1.0,
        'S': 1.0
    },

    // Order in which positions should be displayed
    positionOrder: ['IGL', 'F', 'S'],

    // Default team composition (3-player team)
    defaultComposition: {
        'IGL': 1,  // 1 IGL/Recon
        'F': 1, // 1 Fragger/Assault
        'S': 1   // 1 Support/Controller
    }
    // Total team size: 3 players
};
