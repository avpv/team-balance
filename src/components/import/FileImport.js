import Component from '../base/Component.js';
import { getIcon } from '../base/Icons.js';

/**
 * File import component - handles CSV and JSON file uploads
 */
export default class FileImport extends Component {
    constructor(fileType, onDataChange, onBack, positions = []) {
        super();
        this.fileType = fileType; // 'csv' or 'json'
        this.onDataChange = onDataChange;
        this.onBack = onBack;
        this.positions = positions;
        this.selectedFile = null;
        this.delimiter = ','; // Default delimiter for CSV
    }

    /**
     * Get configuration based on file type
     */
    getConfig() {
        if (this.fileType === 'csv') {
            return {
                title: 'Upload CSV File',
                icon: 'table',
                iconSize: 32,
                accept: '.csv',
                example: this.getExampleCSV(this.delimiter)
            };
        } else {
            return {
                title: 'Upload JSON File',
                icon: 'code',
                iconSize: 32,
                accept: '.json',
                example: this.getExampleJSON()
            };
        }
    }

    /**
     * Generate example data
     */
    getExampleCSV(delimiter = ',') {
        const pos = this.positions.length > 0 ? this.positions : ['Position1', 'Position2'];
        const actualDelim = delimiter;

        if (delimiter === ',') {
            return `name${actualDelim}positions
"John Smith","${pos[0]},${pos[1] || pos[0]}"
"Alice Johnson","${pos[0]}"`;
        } else {
            // For tab and semicolon, no need to quote if no special chars
            return `name${actualDelim}positions
John Smith${actualDelim}${pos[0]},${pos[1] || pos[0]}
Alice Johnson${actualDelim}${pos[0]}`;
        }
    }

    getExampleJSON() {
        const pos = this.positions.length > 0 ? this.positions : ['Position1', 'Position2'];
        return `[
  {"name": "John Smith", "positions": ["${pos[0]}", "${pos[1] || pos[0]}"]},
  {"name": "Alice Johnson", "positions": ["${pos[0]}"]}
]`;
    }

    render() {
        const config = this.getConfig();

        return `
            <div class="import-method-container">
                <div class="import-method-header">
                    <button id="fileImportBackBtn" class="btn btn-secondary back-button" data-action="back">
                        ${getIcon('arrow-left', { size: 16 })}
                        Back
                    </button>
                    <div class="header-content">
                        <h2>${config.title}</h2>
                    </div>
                </div>

                <div class="import-method-content">
                    ${this.fileType === 'csv' ? `
                    <div class="delimiter-selector">
                        <label for="fileDelimiterSelect">
                            <strong>Field Delimiter</strong>
                            <span class="hint">Choose how fields are separated</span>
                        </label>
                        <select id="fileDelimiterSelect" class="form-select">
                            <option value="," ${this.delimiter === ',' ? 'selected' : ''}>Comma (,)</option>
                            <option value="\\t" ${this.delimiter === '\t' ? 'selected' : ''}>Tab (\\t)</option>
                            <option value=";" ${this.delimiter === ';' ? 'selected' : ''}>Semicolon (;)</option>
                        </select>
                    </div>
                    ` : ''}

                    <div class="file-upload-section">
                        <div class="upload-area ${this.selectedFile ? 'has-file' : ''}" data-action="click-upload">
                            <input
                                type="file"
                                id="fileImportInput"
                                accept="${config.accept}"
                                style="display: none;"
                            />
                            <div class="upload-icon">
                                ${getIcon(config.icon, { size: config.iconSize })}
                            </div>
                            <div class="upload-text">
                                ${this.selectedFile
                                    ? `<strong>${this.selectedFile.name}</strong><br><span class="file-size">${this.formatFileSize(this.selectedFile.size)}</span>`
                                    : `<strong>Click to select a ${this.fileType.toUpperCase()} file</strong><br><span>or drag and drop here</span>`
                                }
                            </div>
                            ${this.selectedFile
                                ? `<button id="changeFileBtn" class="btn btn-secondary change-file-button" data-action="change-file">Change File</button>`
                                : `<button id="browseFilesBtn" class="btn btn-primary browse-button">Browse Files</button>`
                            }
                        </div>
                    </div>

                    <div class="examples-section">
                        <h3>Expected Format</h3>
                        <div class="example-block">
                            <div class="example-header">
                                <strong>${this.fileType.toUpperCase()} Example</strong>
                                <button id="copyFileExampleBtn" class="btn btn-sm copy-button" data-copy="example">
                                    ${getIcon('copy', { size: 14 })}
                                    Copy
                                </button>
                            </div>
                            <pre class="code-block">${config.example}</pre>
                        </div>
                        <p class="format-note">
                            ${this.fileType === 'csv'
                                ? 'CSV files should have a header row with "name" and "positions" columns.'
                                : 'JSON files should contain an array of objects with "name" and "positions" fields.'
                            }
                        </p>
                    </div>

                    <div id="fileImportPreview" class="preview-container"></div>
                </div>
            </div>
        `;
    }

    /**
     * Format file size for display
     */
    formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    /**
     * Handle delimiter change
     */
    handleDelimiterChange() {
        const select = this.element.querySelector('#fileDelimiterSelect');
        if (select) {
            // Handle escaped tab character
            this.delimiter = select.value === '\\t' ? '\t' : select.value;

            // Update example
            const exampleBlock = this.element.querySelector('.code-block');
            if (exampleBlock) {
                exampleBlock.textContent = this.getExampleCSV(this.delimiter);
            }

            // Re-trigger data change if file is already selected
            if (this.selectedFile && this.onDataChange) {
                this.selectedFile.text().then(text => {
                    this.onDataChange(text, this.delimiter);
                });
            }
        }
    }

    /**
     * Handle file selection
     */
    async handleFileSelect(file) {
        if (!file) return;

        this.selectedFile = file;

        try {
            const text = await file.text();

            if (this.onDataChange) {
                // Pass delimiter for CSV files
                if (this.fileType === 'csv') {
                    this.onDataChange(text, this.delimiter);
                } else {
                    this.onDataChange(text);
                }
            }

            // Re-render to show selected file
            const container = this.element.parentElement;
            this.unmount();
            this.mount(container);

        } catch (error) {
            this.updatePreview(`
                <div class="preview-error">
                    <strong>Error reading file</strong>
                    <p>${error.message}</p>
                </div>
            `);
        }
    }

    /**
     * Handle drag and drop
     */
    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();

        const uploadArea = this.element.querySelector('.upload-area');
        uploadArea.classList.remove('drag-over');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.handleFileSelect(files[0]);
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();

        const uploadArea = this.element.querySelector('.upload-area');
        uploadArea.classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();

        const uploadArea = this.element.querySelector('.upload-area');
        uploadArea.classList.remove('drag-over');
    }

    /**
     * Handle copy button click
     */
    handleCopy() {
        const config = this.getConfig();

        navigator.clipboard.writeText(config.example).then(() => {
            const button = this.element.querySelector('.copy-button');
            const originalHTML = button.innerHTML;
            button.innerHTML = '✓ Copied!';
            button.classList.add('copied');

            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            // Failed to copy
        });
    }

    attachEventListeners() {
        // Back button
        const backButton = this.element.querySelector('[data-action="back"]');
        if (backButton) {
            backButton.addEventListener('click', () => {
                if (this.onBack) this.onBack();
            });
        }

        // Delimiter selector (CSV only)
        const delimiterSelect = this.element.querySelector('#fileDelimiterSelect');
        if (delimiterSelect) {
            delimiterSelect.addEventListener('change', () => this.handleDelimiterChange());
        }

        // File input
        const fileInput = this.element.querySelector('#fileImportInput');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.handleFileSelect(e.target.files[0]);
                }
            });
        }

        // Upload area click
        const uploadArea = this.element.querySelector('.upload-area');
        if (uploadArea) {
            uploadArea.addEventListener('click', (e) => {
                // Don't trigger if clicking the change button
                if (e.target.dataset.action === 'change-file') {
                    e.stopPropagation();
                    fileInput.click();
                    return;
                }
                fileInput.click();
            });

            // Drag and drop
            uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
            uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
            uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        }

        // Copy button
        const copyButton = this.element.querySelector('.copy-button');
        if (copyButton) {
            copyButton.addEventListener('click', () => this.handleCopy());
        }
    }

    /**
     * Update preview
     */
    updatePreview(previewHTML) {
        const previewContainer = this.element.querySelector('#fileImportPreview');
        if (previewContainer) {
            previewContainer.innerHTML = previewHTML;
        }
    }

    /**
     * Get current data
     */
    async getData() {
        if (this.selectedFile) {
            try {
                return await this.selectedFile.text();
            } catch (error) {
                return '';
            }
        }
        return '';
    }

    /**
     * Get current delimiter
     */
    getDelimiter() {
        return this.delimiter;
    }

    mount(container) {
        super.mount(container);
        this.attachEventListeners();
    }
}
