import Component from '../base/Component.js';
import { getIcon } from '../base/Icons.js';

/**
 * Export format picker component that displays tiles for different export formats
 * Similar to ImportDataSourcePicker interface
 */
export default class ExportFormatPicker extends Component {
    constructor(onFormatSelect) {
        super();
        this.onFormatSelect = onFormatSelect;
        this.selectedFormat = null;
    }

    /**
     * Get available export formats
     */
    getExportFormats() {
        return [
            {
                id: 'text',
                title: 'Plain Text',
                description: 'Simple text format, easy to copy and share',
                icon: 'file-text',
                iconColor: 'var(--color-info-text)'
            },
            {
                id: 'csv',
                title: 'CSV File',
                description: 'Comma-separated values for spreadsheets',
                icon: 'table',
                iconColor: 'var(--color-brand-primary)'
            },
            {
                id: 'json',
                title: 'JSON File',
                description: 'Structured data format for developers',
                icon: 'code',
                iconColor: 'var(--color-brand-secondary)'
            }
        ];
    }

    /**
     * Handle format selection
     */
    handleFormatClick(formatId) {
        this.selectedFormat = formatId;
        if (this.onFormatSelect) {
            this.onFormatSelect(formatId);
        }
    }

    /**
     * Get selected format
     */
    getSelectedFormat() {
        return this.selectedFormat;
    }

    /**
     * Render a single export format tile
     */
    renderFormatTile(format) {
        return `
            <button
                id="exportFormat-${format.id}Btn"
                class="data-source-tile export-format-tile"
                data-format="${format.id}"
            >
                <div class="tile-icon">
                    ${getIcon(format.icon, { size: 24, color: format.iconColor })}
                </div>
                <div class="tile-content">
                    <h3 class="tile-title">${format.title}</h3>
                    <p class="tile-description">${format.description}</p>
                </div>
                <div class="tile-arrow">
                    ${getIcon('arrow-right', { size: 20 })}
                </div>
            </button>
        `;
    }

    render() {
        const formats = this.getExportFormats();

        return `
            <div class="export-format-picker">
                <div class="picker-header">
                    <h2>Export Teams</h2>
                    <p>Choose your preferred export format</p>
                </div>
                <div class="data-sources-grid">
                    ${formats.map(format => this.renderFormatTile(format)).join('')}
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        const tiles = this.element.querySelectorAll('.export-format-tile');
        tiles.forEach(tile => {
            tile.addEventListener('click', () => {
                const formatId = tile.dataset.format;
                this.handleFormatClick(formatId);
            });
        });
    }

    mount(container) {
        super.mount(container);
        this.attachEventListeners();
    }
}
