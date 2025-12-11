import Component from '../base/Component.js';

/**
 * Text/Paste import component - allows users to paste or type player data
 */
export default class TextImport extends Component {
    constructor(onDataChange, onBack, positions = []) {
        super();
        this.onDataChange = onDataChange;
        this.onBack = onBack;
        this.positions = positions;
    }

    /**
     * Generate example data based on available positions
     */
    getExampleCSV() {
        const pos = this.positions.length > 0 ? this.positions : ['Position1', 'Position2'];
        return `name,positions
"John Smith","${pos[0]},${pos[1] || pos[0]}"
"Alice Johnson","${pos[0]}"`;
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
                    <button class="back-button" data-action="back">
                        ← Back
                    </button>
                    <div class="header-content">
                        <h2>📝 Paste or Type Player Data</h2>
                        <p>Enter player data in CSV or JSON format</p>
                    </div>
                </div>

                <div class="import-method-content">
                    <div class="input-section">
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
                                <strong>CSV Format</strong>
                                <button class="copy-button" data-copy="csv">Copy</button>
                            </div>
                            <pre class="code-block">${this.getExampleCSV()}</pre>
                        </div>

                        <div class="example-block">
                            <div class="example-header">
                                <strong>JSON Format</strong>
                                <button class="copy-button" data-copy="json">Copy</button>
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
            this.onDataChange(data);
        }
    }

    /**
     * Handle copy button click
     */
    handleCopy(format) {
        const text = format === 'csv' ? this.getExampleCSV() : this.getExampleJSON();

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
            console.error('Failed to copy:', err);
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
