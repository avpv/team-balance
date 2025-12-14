import Component from '../base/Component.js';
import { getIcon } from '../base/Icons.js';

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
            button.innerHTML = `${getIcon('check', { size: 16 })} Done!`;
            button.classList.add('success');

            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.classList.remove('success');
            }, 2000);
        }
    }

    render() {
        return `
            <div class="export-method-container">
                <div class="export-method-header">
                    <button id="exportBackBtn" class="btn btn-secondary back-button" data-action="back">
                        ${getIcon('arrow-left', { size: 16 })}
                        Back
                    </button>
                    <div class="header-content">
                        <h2>Export as ${this.title}</h2>
                    </div>
                </div>

                <div class="export-method-content">
                    <div class="export-preview-section">
                        <label>
                            <strong>Preview</strong>
                            <span class="hint">Review your export data</span>
                        </label>
                        <pre class="export-preview-content">${this.escapeHtml(this.content)}</pre>
                    </div>

                    <div class="export-actions">
                        <button class="btn btn-primary download-btn" type="button">
                            ${getIcon('download', { size: 16 })}
                            Download
                        </button>
                        <button class="btn btn-secondary copy-btn" type="button">
                            ${getIcon('copy', { size: 16 })}
                            Copy to Clipboard
                        </button>
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

        // Download button
        const downloadBtn = this.element.querySelector('.download-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.handleDownload());
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
