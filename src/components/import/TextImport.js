import Component from '../base/Component.js';
import { getIcon } from '../base/Icons.js';

/**
 * Text/Paste import component - allows users to paste or type player data
 */
export default class TextImport extends Component {
    constructor(onDataChange, onBack, positions = []) {
        super();
        this.onDataChange = onDataChange;
        this.onBack = onBack;
        this.positions = positions;
        this.delimiter = ','; // Default delimiter
    }

    /**
     * Generate example data based on available positions
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

    /**
     * Generate example for names-only format
     */
    getExampleNamesOnly() {
        return `name
John Smith
Alice Johnson
Bob Williams`;
    }

    getExampleJSON() {
        const pos = this.positions.length > 0 ? this.positions : ['Position1', 'Position2'];
        return `[
  {"name": "John Smith", "positions": ["${pos[0]}", "${pos[1] || pos[0]}"]},
  {"name": "Alice Johnson", "positions": ["${pos[0]}"]}
]`;
    }

    render() {
        return `
            <div class="import-method-container">
                <div class="import-method-header">
                    <button class="btn btn-secondary back-button" data-action="back">
                        ${getIcon('arrow-left', { size: 16 })}
                        Back
                    </button>
                    <div class="header-content">
                        <h2>Paste or Type Player Data</h2>
                    </div>
                </div>

                <div class="import-method-content">
                    <div class="input-section">
                        <div class="delimiter-selector">
                            <label for="delimiterSelect">
                                <strong>Field Delimiter</strong>
                                <span class="hint">Choose how fields are separated</span>
                            </label>
                            <select id="delimiterSelect" class="form-select">
                                <option value=",">Comma (,)</option>
                                <option value="\t">Tab (\\t)</option>
                                <option value=";">Semicolon (;)</option>
                            </select>
                        </div>
                        <label for="textImportInput">
                            <strong>Player Data</strong>
                            <span class="hint">Paste your data below</span>
                        </label>
                        <textarea
                            id="textImportInput"
                            class="import-textarea"
                            placeholder="Paste CSV or JSON data here..."
                            rows="10"
                        ></textarea>
                    </div>

                    <div class="examples-section">
                        <h3>Examples</h3>

                        <div class="example-block">
                            <div class="example-header">
                                <strong>CSV with Positions</strong>
                                <button class="btn btn-sm copy-button" data-copy="csv">
                                    ${getIcon('copy', { size: 14 })}
                                    Copy
                                </button>
                            </div>
                            <pre class="code-block" id="csvExample">${this.getExampleCSV(this.delimiter)}</pre>
                        </div>

                        <div class="example-block">
                            <div class="example-header">
                                <strong>Names Only</strong>
                                <button class="btn btn-sm copy-button" data-copy="names">
                                    ${getIcon('copy', { size: 14 })}
                                    Copy
                                </button>
                            </div>
                            <pre class="code-block">${this.getExampleNamesOnly()}</pre>
                            <p class="format-note">You can select a default position after pasting</p>
                        </div>

                        <div class="example-block">
                            <div class="example-header">
                                <strong>JSON Format</strong>
                                <button class="btn btn-sm copy-button" data-copy="json">
                                    ${getIcon('copy', { size: 14 })}
                                    Copy
                                </button>
                            </div>
                            <pre class="code-block">${this.getExampleJSON()}</pre>
                        </div>
                    </div>

                    <div id="textImportPreview" class="preview-container"></div>
                </div>
            </div>
        `;
    }

    /**
     * Handle input change
     */
    handleInputChange() {
        const textarea = this.element.querySelector('#textImportInput');
        const data = textarea.value.trim();

        if (this.onDataChange) {
            // Pass both data and delimiter
            this.onDataChange(data, this.delimiter);
        }
    }

    /**
     * Handle delimiter change
     */
    handleDelimiterChange() {
        const select = this.element.querySelector('#delimiterSelect');
        if (select) {
            // Handle escaped tab character
            this.delimiter = select.value === '\\t' ? '\t' : select.value;

            // Update example
            const exampleBlock = this.element.querySelector('#csvExample');
            if (exampleBlock) {
                exampleBlock.textContent = this.getExampleCSV(this.delimiter);
            }

            // Trigger data change to update preview
            this.handleInputChange();
        }
    }

    /**
     * Handle copy button click
     */
    handleCopy(format) {
        let text;
        switch (format) {
            case 'csv':
                text = this.getExampleCSV(this.delimiter);
                break;
            case 'names':
                text = this.getExampleNamesOnly();
                break;
            case 'json':
            default:
                text = this.getExampleJSON();
        }

        navigator.clipboard.writeText(text).then(() => {
            // Show success feedback
            const button = this.element.querySelector(`[data-copy="${format}"]`);
            const originalText = button.textContent;
            button.textContent = '✓ Copied!';
            button.classList.add('copied');

            setTimeout(() => {
                button.textContent = originalText;
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

        // Delimiter selector
        const delimiterSelect = this.element.querySelector('#delimiterSelect');
        if (delimiterSelect) {
            delimiterSelect.addEventListener('change', () => this.handleDelimiterChange());
        }

        // Textarea input
        const textarea = this.element.querySelector('#textImportInput');
        if (textarea) {
            textarea.addEventListener('input', () => this.handleInputChange());
        }

        // Copy buttons
        const copyButtons = this.element.querySelectorAll('.copy-button');
        copyButtons.forEach(button => {
            button.addEventListener('click', () => {
                const format = button.dataset.copy;
                this.handleCopy(format);
            });
        });
    }

    /**
     * Update preview
     */
    updatePreview(previewHTML) {
        const previewContainer = this.element.querySelector('#textImportPreview');
        if (previewContainer) {
            previewContainer.innerHTML = previewHTML;
        }
    }

    /**
     * Get current data
     */
    getData() {
        const textarea = this.element.querySelector('#textImportInput');
        return textarea ? textarea.value.trim() : '';
    }

    mount(container) {
        super.mount(container);
        this.attachEventListeners();
    }
}
