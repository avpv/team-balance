import Component from '../base/Component.js';
import { getIcon } from '../base/Icons.js';
import { t } from '../../core/I18nManager.js';

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
                title: t('import.textInput'),
                description: t('import.textInputDesc'),
                icon: 'file-text',
                iconColor: 'var(--color-info-text)'
            },
            {
                id: 'csv',
                title: t('import.fileUpload') + ' (CSV)',
                description: t('import.fileUploadDesc'),
                icon: 'table',
                iconColor: 'var(--color-brand-primary)'
            },
            {
                id: 'json',
                title: t('import.fileUpload') + ' (JSON)',
                description: t('import.fileUploadDesc'),
                icon: 'code',
                iconColor: 'var(--color-brand-secondary)'
            },
            {
                id: 'api',
                title: t('import.apiImport'),
                description: t('import.apiImportDesc'),
                icon: 'globe',
                iconColor: 'var(--color-brand-primary)'
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
                id="importSource-${source.id}Btn"
                class="data-source-tile"
                data-source="${source.id}"
            >
                <div class="tile-icon">
                    ${getIcon(source.icon, { size: 24, color: source.iconColor })}
                </div>
                <div class="tile-content">
                    <h3 class="tile-title">${source.title}</h3>
                    <p class="tile-description">${source.description}</p>
                </div>
                <div class="tile-arrow">
                    ${getIcon('arrow-right', { size: 20 })}
                </div>
            </button>
        `;
    }

    render() {
        const sources = this.getDataSources();

        return `
            <div class="import-data-source-picker">
                <div class="picker-header">
                    <h2>${t('settings.addPlayers.importPlayers')}</h2>
                    <p>${t('import.selectSource')}</p>
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
