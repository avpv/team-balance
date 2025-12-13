// src/config/activities/index.js
// Activity configurations for TeamBuilding

// Static imports for all activities to avoid dynamic import failures on GitHub Pages
import volleyball from './volleyball.js';
import basketball from './basketball.js';
import soccer from './soccer.js';
import workProject from './work-project.js';
import americanFootball from './american-football.js';
import baseball from './baseball.js';
import iceHockey from './ice-hockey.js';
import handball from './handball.js';
import rugby from './rugby.js';
import waterPolo from './water-polo.js';
import cricket from './cricket.js';
import futsal from './futsal.js';
import beachVolleyball from './beach-volleyball.js';
import ultimateFrisbee from './ultimate-frisbee.js';
import fieldHockey from './field-hockey.js';
import lacrosse from './lacrosse.js';
import softball from './softball.js';
import netball from './netball.js';
import leagueOfLegends from './league-of-legends.js';
import dota2 from './dota2.js';
import honorOfKings from './honor-of-kings.js';
import mobileLegends from './mobile-legends.js';
import wildRift from './wild-rift.js';
import smite from './smite.js';
import valorant from './valorant.js';
import counterStrike2 from './counter-strike-2.js';
import rainbowSixSiege from './rainbow-six-siege.js';
import overwatch2 from './overwatch-2.js';
import pubgMobile from './pubg-mobile.js';
import pubgBattlegrounds from './pubg-battlegrounds.js';
import fortnite from './fortnite.js';
import apexLegends from './apex-legends.js';
import rocketLeague from './rocket-league.js';
import team1 from './team-1.js';
import team2 from './team-2.js';
import team3 from './team-3.js';
import team4 from './team-4.js';
import team5 from './team-5.js';
import team6 from './team-6.js';
import team7 from './team-7.js';
import team8 from './team-8.js';

/**
 * Activity file mappings (kept for reference and backwards compatibility)
 *
 * To add a new activity:
 * 1. Create a config file in src/config/activities/ (e.g., tennis.js)
 * 2. Add a static import above
 * 3. Add to the ACTIVITY_CONFIGS object below
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
 * All activity configurations (statically imported)
 * @type {Object.<string, Object>}
 */
const ACTIVITY_CONFIGS = {
    // Original activities
    volleyball,
    basketball,
    soccer,
    workProject,

    // Team sports
    americanFootball,
    baseball,
    iceHockey,
    handball,
    rugby,
    waterPolo,
    cricket,
    futsal,
    beachVolleyball,
    ultimateFrisbee,
    fieldHockey,
    lacrosse,
    softball,
    netball,

    // Esports - MOBAs (5v5)
    leagueOfLegends,
    dota2,
    honorOfKings,
    mobileLegends,
    wildRift,
    smite,

    // Esports - FPS/Tactical Shooters (5v5)
    valorant,
    counterStrike2,
    rainbowSixSiege,
    overwatch2,

    // Esports - Battle Royale
    pubgMobile,
    pubgBattlegrounds,
    fortnite,
    apexLegends,

    // Esports - Other
    rocketLeague,

    // Universal
    team1,
    team2,
    team3,
    team4,
    team5,
    team6,
    team7,
    team8
};

/**
 * Load an activity configuration
 * @param {string} activityName - Name of the activity (e.g., 'volleyball')
 * @returns {Promise<Object>} Activity configuration
 */
async function loadActivity(activityName) {
    const config = ACTIVITY_CONFIGS[activityName];
    if (!config) {
        throw new Error(
            `Activity '${activityName}' not found. Available: ${Object.keys(ACTIVITY_CONFIGS).join(', ')}`
        );
    }
    return config;
}

/**
 * Load all activities at once
 * @returns {Promise<Object>} Object with all activity configurations
 */
async function loadAllActivities() {
    return { ...ACTIVITY_CONFIGS };
}

/**
 * Get activity config by name (synchronous version)
 * @param {string} activityName - Name of the activity
 * @returns {Object} Activity configuration
 */
export function getActivityConfig(activityName) {
    const config = ACTIVITY_CONFIGS[activityName];
    if (!config) {
        throw new Error(
            `Activity '${activityName}' not found. Available: ${Object.keys(ACTIVITY_CONFIGS).join(', ')}`
        );
    }
    return config;
}

/**
 * Available activity configurations
 * This is now a reference to ACTIVITY_CONFIGS
 */
export const activities = ACTIVITY_CONFIGS;

/**
 * Initialize activities - now synchronous since all activities are statically imported
 *
 * @param {string|null} selectedActivity - Currently selected activity key from storage (unused, kept for API compatibility)
 * @returns {Promise<Object>} Loaded activities object
 */
export async function initializeActivities(selectedActivity = null) {
    // All activities are already loaded via static imports
    return activities;
}

// Named exports for async loading (maintained for backwards compatibility)
export { loadActivity, loadAllActivities, ACTIVITY_FILES };

export default {
    activities,
    getActivityConfig,
    loadActivity,
    loadAllActivities,
    initializeActivities
};
