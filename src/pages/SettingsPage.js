/**
 * SettingsPage - Player management
 */
import BasePage from './BasePage.js';
import stateManager from '../core/StateManager.js';
import storage from '../core/StorageAdapter.js';
import toast from '../components/base/Toast.js';
import Modal from '../components/base/Modal.js';
import { getIcon } from '../components/base/Icons.js';
import { activities } from '../config/activities/index.js';
import Sidebar from '../components/Sidebar.js';
import uiConfig from '../config/ui.js';
import { STORAGE_KEYS } from '../utils/constants.js';

// Components
import ActivitySelector from '../components/settings/ActivitySelector.js';
import AddPlayerForm from '../components/settings/AddPlayerForm.js';
import PositionStats from '../components/settings/PositionStats.js';
import PlayerList from '../components/settings/PlayerList.js';
import ImportWizard from '../components/import/ImportWizard.js';

const { ELEMENT_IDS, DATA_ATTRIBUTES, ANIMATION } = uiConfig;

class SettingsPage extends BasePage {
    constructor(container, props = {}) {
        super(container, props);
        this.setTitle('Settings');

        // Get services from props
        this.activityConfig = props.activityConfig;
        this.activityKey = props.activityKey; // Key like 'volleyball', 'basketball', etc.
        this.playerService = props.services?.resolve('playerService');
        this.sessionService = props.services?.resolve('sessionService');
        this.eventBus = props.services?.resolve('eventBus');

        this.sidebar = null;
        this.activitySelector = null;
        this.addPlayerForm = null;
        this.positionStats = null;
        this.playerList = null;
        this.importModal = null;
    }

    onCreate() {
        // Subscribe to state changes
        this.on('player:added', () => this.update());
        this.on('player:removed', () => this.update());
        this.on('player:updated', () => this.update());
        this.on('player:reset', () => this.update());
        this.on('players:reset-all-positions', () => this.update());
        this.on('state:changed', () => this.update());
        this.on('state:reset', () => this.update());
        this.on('session:activated', () => this.update());
        // Handle scroll to activity selector request
        this.on('scroll-to-activity-selector', () => this.handleGuideAction('select-activity'));
    }

    onMount() {
        this.mountSidebar();
        this.mountComponents();
        this.attachEventListeners();
    }

    onUpdate() {
        // Re-mount sidebar if container was re-rendered
        this.mountSidebar();
        this.mountComponents();
        this.attachEventListeners();
    }

    onDestroy() {
        if (this.sidebar) {
            this.sidebar.destroy();
            this.sidebar = null;
        }
        if (this.importModal) {
            this.importModal.destroy();
            this.importModal = null;
        }
        this.destroyComponents();
    }

    mountSidebar() {
        const sidebarContainer = document.getElementById(ELEMENT_IDS.SIDEBAR_CONTAINER);
        if (!sidebarContainer) return;

        // Check if sidebar already exists and is properly mounted
        if (this.sidebar && sidebarContainer.children.length > 0) {
            // Sidebar is already mounted, just update it
            this.sidebar.update();
            return;
        }

        // Destroy old sidebar if it exists but is not mounted
        if (this.sidebar) {
            this.sidebar.destroy();
        }

        // Use the activityKey passed as prop (can be null if no activity selected)
        const activityKey = this.activityKey;
        const activityConfig = activityKey ? this.props.activityConfig : null;

        // Always create sidebar - it will show all sessions from all activities
        this.sidebar = new Sidebar(sidebarContainer, {
            sessionService: this.sessionService,
            eventBus: this.eventBus,
            activityKey: activityKey, // Can be null
            activityName: activityConfig?.name || null
        });

        this.sidebar.mount();
        this.addComponent(this.sidebar);
        this.setupMobileSidebarToggle();
    }

    mountComponents() {
        this.destroyComponents();

        // 1. Activity Selector
        const activitySelectorContainer = this.$('.activity-selector-container');
        if (activitySelectorContainer) {
            this.activitySelector = new ActivitySelector(activitySelectorContainer, {
                sessionService: this.sessionService,
                onActivityChange: (action) => this.handleGuideAction(action)
            });
            this.activitySelector.mount();
            this.addComponent(this.activitySelector);
        }

        // 2. Add Player Form
        const addPlayerFormContainer = this.$('.add-player-form-container');
        if (addPlayerFormContainer) {
            this.addPlayerForm = new AddPlayerForm(addPlayerFormContainer, {
                playerService: this.playerService,
                onImportClick: () => this.showImportModal(),
                onResetAllClick: () => this.showResetAllModal(),
                onClearAllClick: () => this.showClearAllModal()
            });
            this.addPlayerForm.mount();
            this.addComponent(this.addPlayerForm);
        }

        // 3. Position Stats
        const positionStatsContainer = this.$('.position-stats-container');
        if (positionStatsContainer && this.playerService) {
            const stats = this.playerService.getPositionStats();
            this.positionStats = new PositionStats(positionStatsContainer, {
                stats
            });
            this.positionStats.mount();
            this.addComponent(this.positionStats);
        }

        // 4. Player List
        const playerListContainer = this.$('.player-list-container');
        if (playerListContainer && this.playerService && this.activityConfig) {
            const players = this.playerService.getAll();
            this.playerList = new PlayerList(playerListContainer, {
                players,
                positionOrder: this.activityConfig.positionOrder,
                positionNames: this.activityConfig.positions,
                onPlayerAction: (action, playerId) => this.handlePlayerAction(action, playerId)
            });
            this.playerList.mount();
            this.addComponent(this.playerList);
        }
    }

    destroyComponents() {
        if (this.activitySelector) {
            this.activitySelector.destroy();
            this.activitySelector = null;
        }
        if (this.addPlayerForm) {
            this.addPlayerForm.destroy();
            this.addPlayerForm = null;
        }
        if (this.positionStats) {
            this.positionStats.destroy();
            this.positionStats = null;
        }
        if (this.playerList) {
            this.playerList.destroy();
            this.playerList = null;
        }
    }

    render() {
        const players = this.playerService.getAll();
        const currentActivity = storage.get(STORAGE_KEYS.SELECTED_ACTIVITY, null);

        return this.renderPageWithSidebar(`
            <header class="page-header">
                <h2>Player Management</h2>
                <p class="page-subtitle">Select your activity, add players, and manage your roster</p>
            </header>

            ${players.length === 0 ? `
                <div class="page-intro">
                    ${this.renderWelcomeGuide()}
                </div>
            ` : ''}

            <div class="page-controls">
                <div class="activity-selector-container"></div>
                <div class="add-player-form-container"></div>
            </div>

            ${currentActivity ? `
                <div class="page-content">
                    <div class="position-stats-container"></div>
                    <div class="player-list-container"></div>
                </div>
            ` : ''}
        `);
    }

    renderWelcomeGuide() {
        return `
            <div class="welcome-guide" role="complementary" aria-label="Getting started guide">
                <h3 class="mb-3 font-semibold">👋 Welcome to TeamBalance!</h3>
                <p class="mb-4 text-secondary">
                    Create perfectly balanced teams. Get started in 4 simple steps:
                </p>
                <ol class="space-y-2">
                    <li>
                        <a href="#" class="guide-link" ${DATA_ATTRIBUTES.ACTION}="select-activity">
                            <strong>Select your sport or activity</strong>
                        </a> from the dropdown below to begin
                    </li>
                    <li><strong>Add your players</strong> and assign their positions</li>
                    <li><strong>Compare players head-to-head</strong> to build accurate skill ratings</li>
                    <li><strong>Generate balanced teams automatically</strong> with one click</li>
                </ol>
            </div>
        `;
    }

    attachEventListeners() {
        // Welcome guide links
        this.$$('.guide-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const action = link.getAttribute(DATA_ATTRIBUTES.ACTION);
                if (action) {
                    e.preventDefault();
                    this.handleGuideAction(action);
                }
            });
        });
    }

    handleGuideAction(action) {
        switch (action) {
            case 'select-activity':
                // Scroll to activity selector
                const activitySelect = this.$(`#${ELEMENT_IDS.ACTIVITY_SELECT}`);
                if (activitySelect) {
                    activitySelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Focus the select to draw attention
                    setTimeout(() => activitySelect.focus(), ANIMATION.STANDARD);
                }
                break;
        }
    }

    handlePlayerAction(action, playerId) {
        try {
            switch (action) {
                case 'edit':
                    this.showEditPositionsModal(playerId);
                    break;

                case 'reset':
                    this.showResetPlayerModal(playerId);
                    break;

                case 'remove':
                    const player = this.playerService.getById(playerId);
                    if (confirm(`Remove ${player.name}?`)) {
                        this.playerService.remove(playerId);
                    }
                    break;
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // ===== MODAL: Edit Positions =====
    showEditPositionsModal(playerId) {
        const player = this.playerService.getById(playerId);
        if (!player) {
            toast.error('Player not found');
            return;
        }

        const modal = new Modal({
            title: `Edit Positions - ${player.name}`,
            content: this.renderEditPositionsContent(player),
            showCancel: true,
            showConfirm: true,
            confirmText: 'Save',
            cancelText: 'Cancel',
            onConfirm: () => {
                const selected = this.getSelectedModalPositions('editPositions');
                if (selected.length === 0) {
                    toast.error('Please select at least one position');
                    return false;
                }
                try {
                    this.playerService.updatePositions(playerId, selected);
                    toast.success(`Positions updated for ${player.name}`);
                    return true;
                } catch (error) {
                    toast.error(error.message);
                    return false;
                }
            }
        });

        this.addComponent(modal);
        modal.mount();
        modal.open();
    }

    renderEditPositionsContent(player) {
        return `
            <div class="modal-content-inner">
                <div class="form-group">
                    <label>Positions (select all applicable):</label>
                    <div class="positions-grid">
                        ${Object.entries(this.playerService.positions).map(([key, name]) => `
                            <label class="position-checkbox">
                                <input
                                    type="checkbox"
                                    name="editPositions"
                                    value="${key}"
                                    class="position-input"
                                    ${player.positions.includes(key) ? 'checked' : ''}
                                >
                                <span class="position-label">${name} (${key})</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // ===== MODAL: Reset Player =====
    showResetPlayerModal(playerId) {
        const player = this.playerService.getById(playerId);
        if (!player) {
            toast.error('Player not found');
            return;
        }

        const modal = new Modal({
            title: `Reset Player - ${player.name}`,
            content: this.renderResetPlayerContent(player),
            showCancel: true,
            showConfirm: true,
            confirmText: 'Reset',
            cancelText: 'Cancel',
            onConfirm: () => {
                const selected = this.getSelectedModalPositions('resetPositions');
                if (selected.length === 0) {
                    toast.error('Please select at least one position');
                    return false;
                }
                try {
                    this.playerService.reset(playerId, selected);
                    // Toast is handled by event bus
                    return true;
                } catch (error) {
                    toast.error(error.message);
                    return false;
                }
            }
        });

        this.addComponent(modal);
        modal.mount();
        modal.open();
    }

    renderResetPlayerContent(player) {
        return `
            <div class="modal-content-inner">
                <div class="form-group">
                    <label>Select positions to reset:</label>
                    <div class="positions-grid">
                        ${player.positions.map(pos => {
            const name = this.playerService.positions[pos];
            const rating = Math.round(player.ratings[pos]);
            const comparisons = player.comparisons[pos];
            return `
                                <label class="position-checkbox">
                                    <input
                                        type="checkbox"
                                        name="resetPositions"
                                        value="${pos}"
                                        class="position-input"
                                        checked
                                    >
                                    <span class="position-label">${name} (${rating} ELO, ${comparisons} comps)</span>
                                </label>
                            `;
        }).join('')}
                    </div>
                    <div class="warning-box mt-3">
                        <div class="warning-title">Warning</div>
                        <div class="warning-text">
                            This will reset the player's rating to 1500 and clear comparison history for the selected positions.
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // ===== MODAL: Reset All =====
    showResetAllModal() {
        const modal = new Modal({
            title: 'Reset All Player Ratings',
            content: this.renderResetAllContent(),
            showCancel: true,
            showConfirm: true,
            confirmText: 'Reset All',
            cancelText: 'Cancel',
            onConfirm: () => {
                const selected = this.getSelectedModalPositions('resetAllPositions');
                if (selected.length === 0) {
                    toast.error('Please select at least one position');
                    return false;
                }
                try {
                    this.playerService.resetAllPositions(selected);
                    // Toast is handled by event bus
                    return true;
                } catch (error) {
                    toast.error(error.message);
                    return false;
                }
            }
        });

        this.addComponent(modal);
        modal.mount();
        modal.open();
    }

    renderResetAllContent() {
        return `
            <div class="modal-content-inner">
                <div class="form-group">
                    <label>Select positions to reset for ALL players:</label>
                    <div class="positions-grid">
                        ${Object.entries(this.playerService.positions).map(([key, name]) => `
                            <label class="position-checkbox">
                                <input
                                    type="checkbox"
                                    name="resetAllPositions"
                                    value="${key}"
                                    class="position-input"
                                    checked
                                >
                                <span class="position-label">${name} (${key})</span>
                            </label>
                        `).join('')}
                    </div>
                    <div class="warning-box warning-box-danger mt-3">
                        <div class="warning-title">Warning</div>
                        <div class="warning-text">
                            This will reset ALL players to 1500 ELO and clear ALL comparison history for the selected positions. This action cannot be undone!
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // ===== MODAL: Clear All =====
    showClearAllModal() {
        const modal = new Modal({
            title: 'Remove All Players',
            content: this.renderClearAllContent(),
            showCancel: true,
            showConfirm: true,
            confirmText: 'Remove All',
            cancelText: 'Cancel',
            onConfirm: () => {
                const selected = this.getSelectedModalPositions('clearAllPositions');
                if (selected.length === 0) {
                    toast.error('Please select at least one position');
                    return false;
                }
                try {
                    const removedPlayers = this.playerService.clearAllByPositions(selected);
                    toast.success(`Removed ${removedPlayers.length} player(s)`);
                    return true;
                } catch (error) {
                    toast.error(error.message);
                    return false;
                }
            }
        });

        this.addComponent(modal);
        modal.mount();
        modal.open();
    }

    renderClearAllContent() {
        return `
            <div class="modal-content-inner">
                <div class="form-group">
                    <label>Select positions to remove ALL players from:</label>
                    <div class="positions-grid">
                        ${Object.entries(this.playerService.positions).map(([key, name]) => `
                            <label class="position-checkbox">
                                <input
                                    type="checkbox"
                                    name="clearAllPositions"
                                    value="${key}"
                                    class="position-input"
                                    checked
                                >
                                <span class="position-label">${name} (${key})</span>
                            </label>
                        `).join('')}
                    </div>
                    <div class="warning-box warning-box-danger mt-3">
                        <div class="warning-title">Danger Zone</div>
                        <div class="warning-text">
                            This will remove ALL players who play the selected positions. This will delete all their data, ratings, and history. This action cannot be undone!
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // ===== MODAL: Import =====
    showImportModal() {
        if (this.importModal) {
            this.importModal.destroy();
        }

        // Create the import wizard with current positions
        const positions = this.playerService.positions;
        const positionKeys = Object.keys(positions);

        this.importWizard = new ImportWizard(positionKeys);

        // Set up data change callback
        this.importWizard.setDataChangeCallback((data, delimiter) => {
            this.previewImportData(data, delimiter);
        });

        this.importModal = new Modal({
            title: 'Import Players',
            content: '<div id="importWizardContainer"></div>',
            showCancel: true,
            showConfirm: true,
            confirmText: 'Import',
            cancelText: 'Cancel',
            size: 'large',
            onConfirm: () => this.handleImportConfirm(),
            onClose: () => {
                if (this.importWizard) {
                    this.importWizard.unmount();
                    this.importWizard = null;
                }
                if (this.importModal) {
                    this.importModal.destroy();
                }
                this.importModal = null;
            }
        });

        this.importModal.mount();
        this.importModal.open();

        // Mount the wizard after modal is rendered
        setTimeout(() => {
            const wizardContainer = document.getElementById('importWizardContainer');
            if (wizardContainer) {
                this.importWizard.mount(wizardContainer);
            }
        }, ANIMATION.SHORT);
    }


    previewImportData(data, delimiter = ',') {
        if (!this.importWizard) return;

        try {
            const players = this.parseImportData(data, delimiter);

            if (players.length === 0) {
                this.importWizard.updatePreview('');
                return;
            }

            const previewHTML = `
                <div class="preview-success">
                    <strong>Found ${players.length} player(s)</strong>
                    <div class="preview-list">
                        ${players.map(p => `
                            <div class="preview-item">• ${this.escape(p.name)} - ${p.positions.join(', ')}</div>
                        `).join('')}
                    </div>
                </div>
            `;

            this.importWizard.updatePreview(previewHTML);
        } catch (error) {
            const errorHTML = `
                <div class="preview-error">
                    <strong>Error:</strong> ${this.escape(error.message)}
                </div>
            `;
            this.importWizard.updatePreview(errorHTML);
        }
    }

    parseImportData(data, delimiter = ',') {
        if (!data || !data.trim()) return [];
        data = data.trim();

        // Try JSON
        if (data.startsWith('[') || data.startsWith('{')) {
            try {
                let parsed = JSON.parse(data);
                if (!Array.isArray(parsed)) parsed = [parsed];
                return parsed.map(item => ({
                    name: item.name,
                    positions: Array.isArray(item.positions) ? item.positions : [item.positions]
                }));
            } catch (e) {
                throw new Error('Invalid JSON format');
            }
        }

        // Try CSV - using the provided delimiter
        const lines = data.split('\n').map(l => l.trim()).filter(l => l);
        if (lines.length < 2) throw new Error('CSV must have header and data rows');

        const dataLines = lines.slice(1);
        const players = [];

        // Escape special regex characters in delimiter
        const delimiterEscaped = delimiter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        for (const line of dataLines) {
            // Split by delimiter, handling quotes
            const parts = this.parseCSVLineSimple(line, delimiter);

            if (parts.length < 2) {
                throw new Error(`Invalid CSV line: ${line}`);
            }

            players.push({
                name: parts[0].trim(),
                positions: parts[1].split(',').map(p => p.trim()).filter(p => p)
            });
        }

        return players;
    }

    /**
     * Simple CSV line parser that handles basic quotes
     */
    parseCSVLineSimple(line, delimiter) {
        const parts = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === delimiter && !inQuotes) {
                parts.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }

        if (current) {
            parts.push(current.trim());
        }

        return parts.map(p => p.replace(/^"|"$/g, ''));
    }

    async handleImportConfirm() {
        if (!this.importWizard) {
            toast.error('Import wizard not initialized');
            return false;
        }

        try {
            // Cache the delimiter before any async operations
            const delimiter = this.importWizard.getDelimiter();
            const data = await this.importWizard.getData();

            if (!data || !data.trim()) {
                toast.error('Please provide data to import');
                return false;
            }

            // Use cached delimiter value
            const players = this.parseImportData(data, delimiter);
            if (players.length === 0) {
                toast.error('No players found');
                return false;
            }

            let imported = 0, skipped = 0;
            players.forEach(playerData => {
                try {
                    this.playerService.add(playerData.name, playerData.positions);
                    imported++;
                } catch (error) {
                    skipped++;
                    // Player skipped due to error
                }
            });

            toast.success(`Imported ${imported} player(s)${skipped > 0 ? `, skipped ${skipped}` : ''}`);
            return true;
        } catch (error) {
            toast.error('Import failed: ' + error.message);
            return false;
        }
    }

    getSelectedModalPositions(inputName) {
        const checkboxes = document.querySelectorAll(`input[name="${inputName}"]:checked`);
        return Array.from(checkboxes).map(cb => cb.value);
    }
}

export default SettingsPage;
