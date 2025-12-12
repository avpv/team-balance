// src/config/activities/honor-of-kings.js
// Honor of Kings activity configuration

/**
 * Honor of Kings configuration for team optimizer
 * Defines positions, weights, and default team composition
 */
export default {
    name: 'Honor of Kings',

    // Position abbreviations and full names
    positions: {
        'SO': 'Solo Lane',
        'J': 'Jungle',
        'M': 'Mid Lane',
        'F': 'Farm Lane',
        'R': 'Roam/Support'
    },

    // Position weights for team balancing
    positionWeights: {
        'SO': 1.0,
        'J': 1.0,
        'M': 1.0,
        'F': 1.0,
        'R': 1.0
    },

    // Order in which positions should be displayed
    positionOrder: ['SO', 'J', 'M', 'F', 'R'],

    // Default team composition (5-player team)
    defaultComposition: {
        'SO': 1,  // 1 Solo Laner
        'J': 1,   // 1 Jungler
        'M': 1,   // 1 Mid Laner
        'F': 1,  // 1 Farm Lane
        'R': 1   // 1 Roam/Support
    }
    // Total team size: 5 players
};
