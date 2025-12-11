import Component from '../base/Component.js';
import './ImportMethod.css';

/**
 * API import component - allows users to fetch player data from a URL
 */
export default class ApiImport extends Component {
    constructor(onDataChange, onBack, positions = []) {
        super();
        this.onDataChange = onDataChange;
        this.onBack = onBack;
        this.positions = positions;
        this.isLoading = false;
    }

    /**
     * Generate example URL
     */
    getExampleURL() {
        return 'https://example.com/api/players.json';
    }

    /**
     * Generate example JSON response
     */
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
                        <h2>🌐 Fetch from URL</h2>
                        <p>Enter a URL to fetch player data in JSON format</p>
                    </div>
                </div>

                <div class="import-method-content">
                    <div class="input-section">
                        <label for="apiUrlInput">
                            <strong>URL</strong>
                            <span class="hint">Enter the URL of your JSON data</span>
                        </label>
                        <div class="url-input-group">
                            <input
                                type="url"
                                id="apiUrlInput"
                                class="url-input"
                                placeholder="https://example.com/api/players.json"
                            />
                            <button
                                class="fetch-button"
                                data-action="fetch"
                                ${this.isLoading ? 'disabled' : ''}
                            >
                                ${this.isLoading ? 'Fetching...' : 'Fetch Data'}
                            </button>
                        </div>
                    </div>

                    <div class="examples-section">
                        <h3>Expected JSON Format</h3>

                        <div class="example-block">
                            <div class="example-header">
                                <strong>Response Example</strong>
                                <button class="copy-button" data-copy="json">Copy</button>
                            </div>
                            <pre class="code-block">${this.getExampleJSON()}</pre>
                        </div>

                        <div class="info-box">
                            <h4>ℹ️ Notes</h4>
                            <ul>
                                <li>The URL must return JSON data</li>
                                <li>Response should be an array of player objects</li>
                                <li>Each object must have "name" and "positions" fields</li>
                                <li>CORS must be enabled on the server</li>
                            </ul>
                        </div>
                    </div>

                    <div id="apiImportPreview" class="preview-container"></div>
                </div>
            </div>
        `;
    }

    /**
     * Fetch data from URL
     */
    async fetchData() {
        const urlInput = this.element.querySelector('#apiUrlInput');
        const url = urlInput.value.trim();

        if (!url) {
            this.updatePreview(`
                <div class="preview-error">
                    <strong>Please enter a URL</strong>
                </div>
            `);
            return;
        }

        // Validate URL format
        try {
            new URL(url);
        } catch (error) {
            this.updatePreview(`
                <div class="preview-error">
                    <strong>Invalid URL</strong>
                    <p>Please enter a valid URL (e.g., https://example.com/data.json)</p>
                </div>
            `);
            return;
        }

        this.isLoading = true;
        this.updateFetchButton();

        this.updatePreview(`
            <div class="preview-loading">
                <div class="spinner"></div>
                <p>Fetching data from ${url}...</p>
            </div>
        `);

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Response is not JSON. Content-Type: ' + (contentType || 'unknown'));
            }

            const data = await response.json();
            const jsonString = JSON.stringify(data, null, 2);

            if (this.onDataChange) {
                this.onDataChange(jsonString);
            }

            this.updatePreview(`
                <div class="preview-success">
                    <strong>✓ Data fetched successfully!</strong>
                    <p>Fetched ${Array.isArray(data) ? data.length : 1} item(s) from the URL.</p>
                </div>
            `);

        } catch (error) {
            console.error('Error fetching data:', error);

            let errorMessage = error.message;
            if (error.message.includes('Failed to fetch')) {
                errorMessage = 'Network error. Please check:\n• The URL is correct\n• CORS is enabled on the server\n• You have internet connection';
            }

            this.updatePreview(`
                <div class="preview-error">
                    <strong>Failed to fetch data</strong>
                    <p style="white-space: pre-line;">${errorMessage}</p>
                </div>
            `);
        } finally {
            this.isLoading = false;
            this.updateFetchButton();
        }
    }

    /**
     * Update fetch button state
     */
    updateFetchButton() {
        const fetchButton = this.element.querySelector('[data-action="fetch"]');
        if (fetchButton) {
            fetchButton.disabled = this.isLoading;
            fetchButton.textContent = this.isLoading ? 'Fetching...' : 'Fetch Data';
        }
    }

    /**
     * Handle copy button click
     */
    handleCopy() {
        const text = this.getExampleJSON();

        navigator.clipboard.writeText(text).then(() => {
            const button = this.element.querySelector('.copy-button');
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

        // Fetch button
        const fetchButton = this.element.querySelector('[data-action="fetch"]');
        if (fetchButton) {
            fetchButton.addEventListener('click', () => this.fetchData());
        }

        // URL input - fetch on Enter key
        const urlInput = this.element.querySelector('#apiUrlInput');
        if (urlInput) {
            urlInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !this.isLoading) {
                    this.fetchData();
                }
            });
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
        const previewContainer = this.element.querySelector('#apiImportPreview');
        if (previewContainer) {
            previewContainer.innerHTML = previewHTML;
        }
    }

    /**
     * Get current data (returns empty for API import as data is fetched on demand)
     */
    getData() {
        return '';
    }

    mount(container) {
        super.mount(container);
        this.attachEventListeners();
    }
}
