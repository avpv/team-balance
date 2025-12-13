// src/config/activities/index.js
// Activity configurations for TeamBuilding

/**
 * Activity file mappings
 *
 * To add a new activity:
 * 1. Create a config file in src/config/activities/ (e.g., tennis.js)
 * 2. Add the mapping below: 'tennis': 'tennis.js'
 *
 * That's it! No need to add imports or update the activities object.
 */
const ACTIVITY_FILES = {
    // Original activities
    volleyball: 'volleyball.js',
    basketball: 'basketball.js',
    soccer: 'soccer.js',
    workProject: 'work-project.js',

    // Team sports
    americanFootball: 'american-football.js',
    baseball: 'baseball.js',
    iceHockey: 'ice-hockey.js',
    handball: 'handball.js',
    rugby: 'rugby.js',
    waterPolo: 'water-polo.js',
    cricket: 'cricket.js',
    futsal: 'futsal.js',
    beachVolleyball: 'beach-volleyball.js',
    ultimateFrisbee: 'ultimate-frisbee.js',
    fieldHockey: 'field-hockey.js',
    lacrosse: 'lacrosse.js',
    softball: 'softball.js',
    netball: 'netball.js',

    // Esports - MOBAs (5v5)
    leagueOfLegends: 'league-of-legends.js',
    dota2: 'dota2.js',
    honorOfKings: 'honor-of-kings.js',
    mobileLegends: 'mobile-legends.js',
    wildRift: 'wild-rift.js',
    smite: 'smite.js',

    // Esports - FPS/Tactical Shooters (5v5)
    valorant: 'valorant.js',
    counterStrike2: 'counter-strike-2.js',
    rainbowSixSiege: 'rainbow-six-siege.js',
    overwatch2: 'overwatch-2.js',

    // Esports - Battle Royale
    pubgMobile: 'pubg-mobile.js',
    pubgBattlegrounds: 'pubg-battlegrounds.js',
    fortnite: 'fortnite.js',
    apexLegends: 'apex-legends.js',

    // Esports - Other
    rocketLeague: 'rocket-league.js',

    // Universal
    team1: 'team-1.js',
    team2: 'team-2.js',
    team3: 'team-3.js',
    team4: 'team-4.js',
    team5: 'team-5.js',
    team6: 'team-6.js',
    team7: 'team-7.js',
    team8: 'team-8.js'
};

/**
 * Cache for loaded activity modules
 * @type {Object.<string, Object>}
 */
const activityCache = {};

/**
 * Load an activity configuration dynamically
 * @param {string} activityName - Name of the activity (e.g., 'volleyball')
 * @returns {Promise<Object>} Activity configuration
 */
async function loadActivity(activityName) {
    // Return from cache if already loaded
    if (activityCache[activityName]) {
        return activityCache[activityName];
    }

    const fileName = ACTIVITY_FILES[activityName];
    if (!fileName) {
        throw new Error(
            `Activity '${activityName}' not found. Available: ${Object.keys(ACTIVITY_FILES).join(', ')}`
        );
    }

    try {
        const module = await import(`./${fileName}`);
        const config = module.default;
        activityCache[activityName] = config;
        return config;
    } catch (error) {
        throw new Error(`Failed to load activity '${activityName}': ${error.message}`);
    }
}

/**
 * Load all activities at once
 * @returns {Promise<Object>} Object with all activity configurations
 */
async function loadAllActivities() {
    const activityNames = Object.keys(ACTIVITY_FILES);
    const configs = await Promise.all(
        activityNames.map(name => loadActivity(name))
    );

    const activities = {};
    activityNames.forEach((name, index) => {
        activities[name] = configs[index];
    });

    return activities;
}

/**
 * Get activity config by name (synchronous version)
 * Throws if activity is not loaded yet
 * @param {string} activityName - Name of the activity
 * @returns {Object} Activity configuration
 */
export function getActivityConfig(activityName) {
    const config = activityCache[activityName];
    if (!config) {
        throw new Error(
            `Activity '${activityName}' not loaded. Call loadActivity('${activityName}') first or use activities.${activityName} after initialization.`
        );
    }
    return config;
}

/**
 * Available activity configurations (loaded synchronously)
 * This will be populated during app initialization
 * Note: This is an object that gets populated, not reassigned
 */
export const activities = {};

/**
 * Initialize activities with optimized loading
 *
 * Performance optimization:
 * - Only loads the selected activity immediately (critical path)
 * - Loads remaining activities in background after page is interactive
 * - Uses requestIdleCallback for non-critical loading
 *
 * @param {string|null} selectedActivity - Currently selected activity key from storage
 * @returns {Promise<Object>} Loaded activities object
 */
export async function initializeActivities(selectedActivity = null) {
    // Step 1: Load selected activity immediately (critical for app to work)
    if (selectedActivity && ACTIVITY_FILES[selectedActivity]) {
        try {
            const config = await loadActivity(selectedActivity);
            activities[selectedActivity] = config;
        } catch (error) {
            // Selected activity failed to load, continue with others
        }
    }

    // Step 2: Load remaining activities in background for selector
    // Use requestIdleCallback if available, otherwise setTimeout
    const loadRemaining = async () => {
        const remainingActivities = Object.keys(ACTIVITY_FILES).filter(
            name => name !== selectedActivity
        );

        // Load in batches to avoid blocking
        const batchSize = 5;
        for (let i = 0; i < remainingActivities.length; i += batchSize) {
            const batch = remainingActivities.slice(i, i + batchSize);
            await Promise.all(
                batch.map(async name => {
                    try {
                        const config = await loadActivity(name);
                        activities[name] = config;
                    } catch (error) {
                        // Silent fail for background loading
                    }
                })
            );
        }
    };

    // Schedule background loading
    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => loadRemaining(), { timeout: 3000 });
    } else {
        setTimeout(loadRemaining, 100);
    }

    return activities;
}

// Named exports for async loading
export { loadActivity, loadAllActivities, ACTIVITY_FILES };

export default {
    activities,
    getActivityConfig,
    loadActivity,
    loadAllActivities,
    initializeActivities
};
