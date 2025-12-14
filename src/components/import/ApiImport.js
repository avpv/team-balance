import Component from '../base/Component.js';
import { getIcon } from '../base/Icons.js';

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
        this.authType = 'none'; // none, bearer, apikey, basic, custom
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

    /**
     * Render authentication fields based on selected type
     */
    renderAuthFields() {
        switch (this.authType) {
            case 'bearer':
                return `
                    <div class="auth-fields">
                        <label for="bearerToken">
                            <strong>Bearer Token</strong>
                            <span class="hint">Enter your OAuth/Bearer token</span>
                        </label>
                        <input
                            type="password"
                            id="bearerToken"
                            class="auth-input"
                            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        />
                    </div>
                `;

            case 'apikey':
                return `
                    <div class="auth-fields">
                        <label for="apiKeyName">
                            <strong>Key Name</strong>
                            <span class="hint">Header name or query parameter</span>
                        </label>
                        <input
                            type="text"
                            id="apiKeyName"
                            class="auth-input"
                            placeholder="X-API-Key"
                        />

                        <label for="apiKeyValue" style="margin-top: 12px;">
                            <strong>Key Value</strong>
                            <span class="hint">Your API key</span>
                        </label>
                        <input
                            type="password"
                            id="apiKeyValue"
                            class="auth-input"
                            placeholder="your-api-key-here"
                        />

                        <label style="margin-top: 12px; display: flex; align-items: center; gap: 8px;">
                            <input
                                type="checkbox"
                                id="apiKeyInQuery"
                                style="width: auto;"
                            />
                            <span>Add as query parameter instead of header</span>
                        </label>
                    </div>
                `;

            case 'basic':
                return `
                    <div class="auth-fields">
                        <label for="basicUsername">
                            <strong>Username</strong>
                        </label>
                        <input
                            type="text"
                            id="basicUsername"
                            class="auth-input"
                            placeholder="username"
                            autocomplete="username"
                        />

                        <label for="basicPassword" style="margin-top: 12px;">
                            <strong>Password</strong>
                        </label>
                        <input
                            type="password"
                            id="basicPassword"
                            class="auth-input"
                            placeholder="password"
                            autocomplete="current-password"
                        />
                    </div>
                `;

            case 'custom':
                return `
                    <div class="auth-fields">
                        <label for="customHeaders">
                            <strong>Custom Headers</strong>
                            <span class="hint">One per line in format: Header-Name: value</span>
                        </label>
                        <textarea
                            id="customHeaders"
                            class="auth-input"
                            rows="4"
                            placeholder="Authorization: Bearer token123&#10;X-Custom-Header: value&#10;X-API-Key: key123"
                        ></textarea>
                        <div class="hint" style="margin-top: 4px; font-size: 12px;">
                            Example:<br/>
                            Authorization: Bearer abc123<br/>
                            X-API-Key: your-key
                        </div>
                    </div>
                `;

            default:
                return '';
        }
    }

    render() {
        return `
            <div class="import-method-container">
                <div class="import-method-header">
                    <button id="apiImportBackBtn" class="btn btn-secondary back-button" data-action="back">
                        ${getIcon('arrow-left', { size: 16 })}
                        Back
                    </button>
                    <div class="header-content">
                        <h2>Fetch from URL</h2>
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
                                id="fetchDataBtn"
                                class="btn btn-primary fetch-button"
                                data-action="fetch"
                                ${this.isLoading ? 'disabled' : ''}
                            >
                                ${this.isLoading ? 'Fetching...' : 'Fetch Data'}
                            </button>
                        </div>
                    </div>

                    <div class="auth-section">
                        <label for="authTypeSelect">
                            <strong>Authentication</strong>
                            <span class="hint">Select authentication method if required</span>
                        </label>
                        <select id="authTypeSelect" class="auth-type-select">
                            <option value="none" ${this.authType === 'none' ? 'selected' : ''}>None (Public URL)</option>
                            <option value="bearer" ${this.authType === 'bearer' ? 'selected' : ''}>Bearer Token</option>
                            <option value="apikey" ${this.authType === 'apikey' ? 'selected' : ''}>API Key</option>
                            <option value="basic" ${this.authType === 'basic' ? 'selected' : ''}>Basic Auth</option>
                            <option value="custom" ${this.authType === 'custom' ? 'selected' : ''}>Custom Headers</option>
                        </select>
                        ${this.renderAuthFields()}
                    </div>

                    <div class="examples-section">
                        <h3>Expected JSON Format</h3>

                        <div class="example-block">
                            <div class="example-header">
                                <strong>Response Example</strong>
                                <button id="copyApiExampleBtn" class="btn btn-sm copy-button" data-copy="json">
                                    ${getIcon('copy', { size: 14 })}
                                    Copy
                                </button>
                            </div>
                            <pre class="code-block">${this.getExampleJSON()}</pre>
                        </div>

                        <div class="info-box">
                            <h4>${getIcon('info', { size: 18 })} Notes</h4>
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
     * Build authentication headers based on selected type
     */
    buildAuthHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };

        switch (this.authType) {
            case 'bearer': {
                const token = this.element.querySelector('#bearerToken')?.value.trim();
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
                break;
            }

            case 'apikey': {
                const keyName = this.element.querySelector('#apiKeyName')?.value.trim();
                const keyValue = this.element.querySelector('#apiKeyValue')?.value.trim();
                if (keyName && keyValue) {
                    headers[keyName] = keyValue;
                }
                break;
            }

            case 'basic': {
                const username = this.element.querySelector('#basicUsername')?.value.trim();
                const password = this.element.querySelector('#basicPassword')?.value.trim();
                if (username && password) {
                    const credentials = btoa(`${username}:${password}`);
                    headers['Authorization'] = `Basic ${credentials}`;
                }
                break;
            }

            case 'custom': {
                const customHeadersText = this.element.querySelector('#customHeaders')?.value.trim();
                if (customHeadersText) {
                    const lines = customHeadersText.split('\n');
                    lines.forEach(line => {
                        const colonIndex = line.indexOf(':');
                        if (colonIndex > 0) {
                            const headerName = line.substring(0, colonIndex).trim();
                            const headerValue = line.substring(colonIndex + 1).trim();
                            if (headerName && headerValue) {
                                headers[headerName] = headerValue;
                            }
                        }
                    });
                }
                break;
            }
        }

        return headers;
    }

    /**
     * Build URL with query parameters for API key if needed
     */
    buildUrlWithParams(baseUrl) {
        if (this.authType === 'apikey') {
            const isQueryParam = this.element.querySelector('#apiKeyInQuery')?.checked;
            if (isQueryParam) {
                const keyName = this.element.querySelector('#apiKeyName')?.value.trim();
                const keyValue = this.element.querySelector('#apiKeyValue')?.value.trim();
                if (keyName && keyValue) {
                    const url = new URL(baseUrl);
                    url.searchParams.set(keyName, keyValue);
                    return url.toString();
                }
            }
        }
        return baseUrl;
    }

    /**
     * Handle auth type change
     */
    handleAuthTypeChange() {
        const select = this.element.querySelector('#authTypeSelect');
        this.authType = select.value;

        // Re-render the auth fields section
        const authSection = this.element.querySelector('.auth-section');
        if (authSection) {
            // Find and update only the auth fields part
            const existingFields = authSection.querySelector('.auth-fields');
            const newFieldsHTML = this.renderAuthFields();

            if (existingFields) {
                existingFields.remove();
            }

            if (newFieldsHTML) {
                authSection.insertAdjacentHTML('beforeend', newFieldsHTML);
            }
        }
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

        // Build URL with query params if needed (for API key in query)
        const finalUrl = this.buildUrlWithParams(url);

        // Build headers with authentication
        const headers = this.buildAuthHeaders();

        this.updatePreview(`
            <div class="preview-loading">
                <div class="spinner"></div>
                <p>Fetching data from ${url}...</p>
            </div>
        `);

        try {
            const response = await fetch(finalUrl, {
                method: 'GET',
                headers: headers
            });

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

        // Auth type selector
        const authTypeSelect = this.element.querySelector('#authTypeSelect');
        if (authTypeSelect) {
            authTypeSelect.addEventListener('change', () => this.handleAuthTypeChange());
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
