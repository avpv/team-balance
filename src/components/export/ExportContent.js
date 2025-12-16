import Component from '../base/Component.js';
import { getIcon } from '../base/Icons.js';
import { trackClick } from '../../config/analytics.js';
import { t } from '../../core/I18nManager.js';

/**
 * Export Content component - displays export preview with Download and Copy buttons
 * Similar to TextImport interface style
 */
export default class ExportContent extends Component {
    constructor(options = {}) {
        super();
        this.format = options.format;
        this.title = options.title || 'Export';
        this.content = options.content || '';
        this.filename = options.filename || 'export.txt';
        this.mimeType = options.mimeType || 'text/plain';
        this.onBack = options.onBack;
        this.onExportComplete = options.onExportComplete;
    }

    /**
     * Handle download
     */
    handleDownload() {
        trackClick('exportDownloadBtn', 'teams', `export_download_${this.format}`);
        const blob = new Blob([this.content], { type: this.mimeType });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = this.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // Show success feedback on button
        this.showButtonSuccess('download');

        if (this.onExportComplete) {
            this.onExportComplete(this.format, 'download');
        }
    }

    /**
     * Handle copy to clipboard
     */
    async handleCopy() {
        trackClick('exportCopyBtn', 'teams', `export_copy_${this.format}`);
        try {
            await navigator.clipboard.writeText(this.content);
            this.showButtonSuccess('copy');

            if (this.onExportComplete) {
                this.onExportComplete(this.format, 'copy');
            }
        } catch (err) {
            // Silent fail
        }
    }

    /**
     * Show success feedback on button
     */
    showButtonSuccess(buttonType) {
        const button = this.element.querySelector(`.${buttonType}-btn`);
        if (button) {
            const originalHTML = button.innerHTML;
            button.innerHTML = `${getIcon('check', { size: 14 })} ${t('teams.export.copiedSuccess')}`;
            button.classList.add('copied');

            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.classList.remove('copied');
            }, 2000);
        }
    }

    render() {
        return `
            <div class="export-method-container">
                <div class="export-method-header">
                    <button id="exportBackBtn" class="btn btn-secondary back-button" data-action="back">
                        ${getIcon('arrow-left', { size: 16 })}
                        ${t('import.back')}
                    </button>
                    <div class="header-content">
                        <h2>${t('teams.export.exportAs', { format: this.title })}</h2>
                    </div>
                </div>

                <div class="export-method-content">
                    <div class="export-preview-section">
                        <div class="example-header">
                            <strong>${t('teams.export.preview')}</strong>
                            <button id="exportCopyBtn" class="btn btn-sm copy-button copy-btn" type="button">
                                ${getIcon('copy', { size: 14 })}
                                ${t('common.copy')}
                            </button>
                        </div>
                        <pre class="export-preview-content">${this.escapeHtml(this.content)}</pre>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Escape HTML for safe display
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    attachEventListeners() {
        // Back button
        const backBtn = this.element.querySelector('[data-action="back"]');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                if (this.onBack) this.onBack();
            });
        }

        // Copy button
        const copyBtn = this.element.querySelector('.copy-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.handleCopy());
        }
    }

    mount(container) {
        super.mount(container);
        this.attachEventListeners();
    }
}
