import Component from '../base/Component.js';
import './ImportDataSourcePicker.css';

/**
 * Data source picker component that displays tiles for different import methods
 * Similar to Excel's "Get Data" interface
 */
export default class ImportDataSourcePicker extends Component {
    constructor(onSourceSelect) {
        super();
        this.onSourceSelect = onSourceSelect;
    }

    /**
     * Get available data sources
     */
    getDataSources() {
        return [
            {
                id: 'text',
                title: 'Text / Paste',
                description: 'Paste or type player data directly',
                icon: '📝',
                color: '#4CAF50'
            },
            {
                id: 'csv',
                title: 'CSV File',
                description: 'Upload a CSV file with player data',
                icon: '📊',
                color: '#2196F3'
            },
            {
                id: 'json',
                title: 'JSON File',
                description: 'Upload a JSON file with player data',
                icon: '{ }',
                color: '#FF9800'
            },
            {
                id: 'api',
                title: 'From URL',
                description: 'Fetch player data from a URL (JSON)',
                icon: '🌐',
                color: '#9C27B0'
            }
        ];
    }

    /**
     * Handle source selection
     */
    handleSourceClick(sourceId) {
        if (this.onSourceSelect) {
            this.onSourceSelect(sourceId);
        }
    }

    /**
     * Render a single data source tile
     */
    renderSourceTile(source) {
        return `
            <button
                class="data-source-tile"
                data-source="${source.id}"
                style="--tile-color: ${source.color}"
            >
                <div class="tile-icon">${source.icon}</div>
                <div class="tile-content">
                    <h3 class="tile-title">${source.title}</h3>
                    <p class="tile-description">${source.description}</p>
                </div>
                <div class="tile-arrow">→</div>
            </button>
        `;
    }

    render() {
        const sources = this.getDataSources();

        return `
            <div class="import-data-source-picker">
                <div class="picker-header">
                    <h2>Get Player Data</h2>
                    <p>Choose how you want to import players</p>
                </div>
                <div class="data-sources-grid">
                    ${sources.map(source => this.renderSourceTile(source)).join('')}
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        const tiles = this.element.querySelectorAll('.data-source-tile');
        tiles.forEach(tile => {
            tile.addEventListener('click', () => {
                const sourceId = tile.dataset.source;
                this.handleSourceClick(sourceId);
            });
        });
    }

    mount(container) {
        super.mount(container);
        this.attachEventListeners();
    }
}
