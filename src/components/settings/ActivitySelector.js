import BaseComponent from '../BaseComponent.js';
import storage from '../../core/StorageAdapter.js';
import stateManager from '../../core/StateManager.js';
import toast from '../base/Toast.js';
import { activities } from '../../config/activities/index.js';
import uiConfig from '../../config/ui.js';
import { STORAGE_KEYS } from '../../utils/constants.js';
import { getIcon } from '../base/Icons.js';
import { trackEvent } from '../../config/analytics.js';
import { t } from '../../core/I18nManager.js';

const { ELEMENT_IDS, ANIMATION, TOAST } = uiConfig;

class ActivitySelector extends BaseComponent {
    constructor(container, props = {}) {
        super(container);
        this.sessionService = props.sessionService;
        this.onActivityChange = props.onActivityChange; // Callback for when activity changes
    }

    render() {
        const currentActivity = storage.get(STORAGE_KEYS.SELECTED_ACTIVITY, null);
        const recentActivities = this.getRecentActivities();

        // Separate recent and other activities
        const allActivitiesEntries = Object.entries(activities);
        const recentActivitySet = new Set(recentActivities);

        const recentOptions = recentActivities
            .map(key => [key, activities[key]])
            .filter(([key, config]) => config); // Filter out any invalid activities

        const otherOptions = allActivitiesEntries
            .filter(([key]) => !recentActivitySet.has(key))
            .filter(([key, config]) => config) // Filter out any invalid/unloaded activities
            .sort((a, b) => a[1].name.localeCompare(b[1].name));

        return `
            <div class="activity-selector-section" role="region" aria-label="${t('settings.activity.label')}">
                <div class="player-form">
                    <div class="form-group">
                        <label for="${ELEMENT_IDS.ACTIVITY_SELECT}">${t('settings.activity.label')}</label>
                        <div class="activity-selector-row form-row">
                            <select
                                id="${ELEMENT_IDS.ACTIVITY_SELECT}"
                                class="activity-select"
                                aria-label="${t('settings.activity.label')}"
                                aria-describedby="activity-help-text">
                                <option value="" ${!currentActivity ? 'selected' : ''} disabled>${t('settings.activity.placeholder')}</option>
                                ${recentOptions.length > 0 ? `
                                    <optgroup label="${t('settings.activity.recentActivities')}">
                                        ${recentOptions.map(([key, config]) => `
                                            <option value="${key}" ${key === currentActivity ? 'selected' : ''}>
                                                ${config.name}
                                            </option>
                                        `).join('')}
                                    </optgroup>
                                ` : ''}
                                ${otherOptions.length > 0 ? `
                                    <optgroup label="${t('settings.activity.allActivities')}">
                                        ${otherOptions.map(([key, config]) => `
                                            <option value="${key}" ${key === currentActivity ? 'selected' : ''}>
                                                ${config.name}
                                            </option>
                                        `).join('')}
                                    </optgroup>
                                ` : ''}
                            </select>
                            <button
                                type="button"
                                class="btn btn--secondary"
                                id="createSessionBtn"
                                title="${t('settings.activity.newTeamTitle')}"
                                aria-label="${t('settings.activity.newTeam')}">
                                ${getIcon('plus', { size: 16, className: 'btn-icon' })}
                                ${t('settings.activity.newTeam')}
                            </button>
                        </div>
                        <p class="form-help-text" id="activity-help-text">
                            ${t('settings.activity.helpText')}
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    onMount() {
        const activitySelect = this.container.querySelector(`#${ELEMENT_IDS.ACTIVITY_SELECT}`);
        if (activitySelect) {
            activitySelect.addEventListener('change', (e) => {
                this.handleActivityChange(e.target.value);
            });
        }

        const createSessionBtn = this.container.querySelector('#createSessionBtn');
        if (createSessionBtn) {
            createSessionBtn.addEventListener('click', () => {
                this.handleCreateSession();
            });

            // If there's a pending activity, add highlight on mount
            const pendingActivity = storage.get(STORAGE_KEYS.PENDING_ACTIVITY, null);
            if (pendingActivity) {
                createSessionBtn.classList.add('highlight');
            }
        }
    }

    getRecentActivities() {
        // Get all sessions from state
        const allSessions = stateManager.get('sessions') || {};

        // Collect all sessions with their activity keys and sort by creation date
        const sessionsList = [];
        Object.entries(allSessions).forEach(([activityKey, sessions]) => {
            Object.values(sessions).forEach(session => {
                sessionsList.push({
                    activityKey,
                    createdAt: session.createdAt
                });
            });
        });

        // Sort by creation date (newest first)
        sessionsList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Get unique activity keys (up to 5)
        const uniqueActivities = [];
        const seen = new Set();

        for (const session of sessionsList) {
            if (!seen.has(session.activityKey)) {
                seen.add(session.activityKey);
                uniqueActivities.push(session.activityKey);

                if (uniqueActivities.length >= 5) {
                    break;
                }
            }
        }

        return uniqueActivities;
    }

    handleActivityChange(activityKey) {
        const currentActivity = storage.get(STORAGE_KEYS.SELECTED_ACTIVITY, null);
        const createSessionBtn = this.container.querySelector('#createSessionBtn');

        // If empty selection, just clear pending activity and remove highlight
        if (!activityKey) {
            storage.remove(STORAGE_KEYS.PENDING_ACTIVITY);
            if (createSessionBtn) {
                createSessionBtn.classList.remove('highlight');
            }
            return;
        }

        const selectedActivity = activities[activityKey];
        if (!selectedActivity) {
            toast.error(t('settings.activity.invalidActivity'));
            return;
        }

        // Track activity selection
        trackEvent('activity_selected', {
            event_category: 'settings',
            activity: activityKey,
            activity_name: selectedActivity.name
        });

        // Store pending activity selection
        storage.set(STORAGE_KEYS.PENDING_ACTIVITY, activityKey);

        // Add highlight to create session button
        if (createSessionBtn) {
            createSessionBtn.classList.add('highlight');
        }

        // Show info toast
        if (currentActivity !== activityKey) {
            toast.info(t('settings.activity.willBeApplied', { activity: selectedActivity.name }));
        }
    }

    handleCreateSession() {
        // Check if there's a pending activity change
        const pendingActivity = storage.get(STORAGE_KEYS.PENDING_ACTIVITY, null);
        const currentActivity = storage.get(STORAGE_KEYS.SELECTED_ACTIVITY, null);
        const createSessionBtn = this.container.querySelector('#createSessionBtn');

        // Determine which activity to use (prefer pending if it exists)
        const targetActivity = pendingActivity || currentActivity;

        if (!targetActivity) {
            toast.error(t('settings.activity.selectFirst'));
            // Notify parent to scroll to activity selector (though we are already here)
            if (this.onActivityChange) this.onActivityChange('select-activity');

            // Focus the select
            const select = this.container.querySelector(`#${ELEMENT_IDS.ACTIVITY_SELECT}`);
            if (select) select.focus();

            return;
        }

        try {
            // Remove highlight from button
            if (createSessionBtn) {
                createSessionBtn.classList.remove('highlight');
            }

            // If activity is changing, apply it and reload
            if (pendingActivity && targetActivity !== currentActivity) {
                storage.set(STORAGE_KEYS.SELECTED_ACTIVITY, targetActivity);
                storage.remove(STORAGE_KEYS.PENDING_ACTIVITY);

                const selectedActivity = activities[targetActivity];
                toast.success(t('settings.activity.switchingTo', { activity: selectedActivity.name }), TOAST.QUICK_DURATION);

                setTimeout(() => {
                    window.location.reload();
                }, ANIMATION.RELOAD_DELAY);
                return;
            }

            // Same activity, just create a new session
            const newSession = this.sessionService.createSession(currentActivity);
            storage.remove(STORAGE_KEYS.PENDING_ACTIVITY);

            // Track session creation
            trackEvent('session_created', {
                event_category: 'settings',
                activity: currentActivity
            });

            toast.success(t('settings.activity.newTeamCreated'));

            // Scroll to add player form after content loads
            this.scrollToPlayerFormWhenReady();
            // Page will auto-update via event bus
        } catch (error) {
            toast.error(error.message);
        }
    }

    /**
     * Waits for the add player form content to load, then scrolls to it.
     * Uses MutationObserver to detect when content is rendered.
     */
    scrollToPlayerFormWhenReady() {
        const maxWaitTime = 3000; // Maximum wait time in ms
        const startTime = Date.now();

        const tryScroll = () => {
            const container = document.querySelector('.add-player-form-container');

            // Check if container exists and has content (accordion is rendered)
            if (container && container.querySelector('.accordion')) {
                container.scrollIntoView({ behavior: 'smooth', block: 'start' });
                return;
            }

            // If still waiting and not timed out, try again
            if (Date.now() - startTime < maxWaitTime) {
                requestAnimationFrame(tryScroll);
            }
        };

        // Start checking after a small delay to allow event bus updates
        setTimeout(tryScroll, ANIMATION.SHORT);
    }
}

export default ActivitySelector;
