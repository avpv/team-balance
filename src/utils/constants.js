// src/utils/constants.js

/**
 * Application Constants
 *
 * IMPORTANT: Rating-related constants are in config/rating.js
 * IMPORTANT: Validation constants are in config/validation.js
 * IMPORTANT: UI constants (timing, animation, input constraints) are in config/ui.js
 * IMPORTANT: Activity-specific constants (positions, etc.) are in config/activities/
 */

export const APP_VERSION = '4.0.0';
export const APP_NAME = 'TeamBalance';

export const ROUTES = {
    HOME: '/',
    SETTINGS: '/',
    COMPARE: '/compare/',
    RANKINGS: '/rankings/',
    TEAMS: '/teams/'
};

export const STORAGE_KEYS = {
    STATE: 'app_state',
    SETTINGS: 'app_settings',
    SELECTED_ACTIVITY: 'selectedActivity',
    PENDING_ACTIVITY: 'pendingActivity'
};

// Session-only storage keys (cleared on tab close)
export const SESSION_KEYS = {
    SCROLL_TO_PLAYER_FORM: 'scrollToPlayerForm'
};

export const EVENTS = {
    // State events
    STATE_LOADED: 'state:loaded',
    STATE_SAVED: 'state:saved',
    STATE_CHANGED: 'state:changed',
    STATE_RESET: 'state:reset',
    STATE_MIGRATED: 'state:migrated',
    STATE_IMPORTED: 'state:imported',
    
    // Player events
    PLAYER_ADDED: 'player:added',
    PLAYER_REMOVED: 'player:removed',
    PLAYER_UPDATED: 'player:updated',
    PLAYER_RESET: 'player:reset',
    
    // Comparison events
    COMPARISON_COMPLETED: 'comparison:completed',
    COMPARISON_RESET_ALL: 'comparison:reset-all',
    
    // Route events
    ROUTE_CHANGED: 'route:changed',
    ROUTE_BEFORE_CHANGE: 'route:before-change',
    ROUTE_ERROR: 'route:error'
};

export default {
    APP_VERSION,
    APP_NAME,
    ROUTES,
    STORAGE_KEYS,
    SESSION_KEYS,
    EVENTS
};
