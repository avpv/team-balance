import Component from '../base/Component.js';
import { getIcon } from '../base/Icons.js';
import { t } from '../../core/I18nManager.js';
import { renderPositionReference } from './renderPositionReference.js';
import {
    renderAuthFields,
    buildAuthHeaders,
    buildUrlWithParams,
    handleAuthTypeChange
} from '../base/AuthFields.js';

const AUTH_SELECT_ID = 'authTypeSelect';

/**
 * API import component - allows users to fetch player data from a URL
 */
export default class ApiImport extends Component {
    constructor({ onDataChange, onBack, positionConfig = {} }) {
        super();
        this.onDataChange = onDataChange;
        this.onBack = onBack;
        this.positionConfig = positionConfig;
        this.positions = positionConfig.keys;
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
    renderAuthFieldsHTML() {
        return renderAuthFields(this.authType, '');
    }

    render() {
        return `
            <div class="import-method-container">
                <div class="import-method-header">
                    <button id="apiImportBackBtn" class="btn btn-secondary back-button" data-action="back">
                        ${getIcon('arrow-left', { size: 16 })}
                        ${t('import.back')}
                    </button>
                    <div class="header-content">
                        <h2>${t('import.fetchFromUrl')}</h2>
                    </div>
                </div>

                <div class="import-method-content">
                    <div class="input-section">
                        <label for="apiUrlInput">
                            <strong>${t('import.url')}</strong>
                            <span class="hint">${t('import.urlHint')}</span>
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
                                ${this.isLoading ? t('import.fetching') : t('import.fetchData')}
                            </button>
                        </div>
                    </div>

                    <div class="auth-section">
                        <label for="authTypeSelect">
                            <strong>${t('import.authentication')}</strong>
                            <span class="hint">${t('import.authHint')}</span>
                        </label>
                        <select id="authTypeSelect" class="auth-type-select">
                            <option value="none" ${this.authType === 'none' ? 'selected' : ''}>${t('import.authNone')}</option>
                            <option value="bearer" ${this.authType === 'bearer' ? 'selected' : ''}>${t('import.authBearer')}</option>
                            <option value="apikey" ${this.authType === 'apikey' ? 'selected' : ''}>${t('import.authApiKey')}</option>
                            <option value="basic" ${this.authType === 'basic' ? 'selected' : ''}>${t('import.authBasic')}</option>
                            <option value="custom" ${this.authType === 'custom' ? 'selected' : ''}>${t('import.authCustomHeaders')}</option>
                        </select>
                        ${this.renderAuthFieldsHTML()}
                    </div>

                    ${renderPositionReference(this.positionConfig)}

                    <div class="examples-section">
                        <h3>${t('import.expectedJsonFormat')}</h3>

                        <div class="example-block">
                            <div class="example-header">
                                <strong>${t('import.responseExample')}</strong>
                                <button id="copyApiExampleBtn" class="btn btn-sm copy-button" data-copy="json">
                                    ${getIcon('copy', { size: 14 })}
                                    ${t('common.copy')}
                                </button>
                            </div>
                            <pre class="code-block">${this.getExampleJSON()}</pre>
                        </div>

                        <div class="info-box">
                            <h4>${getIcon('info', { size: 18 })} ${t('import.notes')}</h4>
                            <ul>
                                <li>${t('import.noteJsonRequired')}</li>
                                <li>${t('import.noteArrayRequired')}</li>
                                <li>${t('import.noteFieldsRequired')}</li>
                                <li>${t('import.noteCorsRequired')}</li>
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
    getAuthHeaders() {
        return buildAuthHeaders(this.authType, this.element, '');
    }

    /**
     * Build URL with query parameters for API key if needed
     */
    getUrlWithParams(baseUrl) {
        return buildUrlWithParams(baseUrl, this.authType, this.element, '');
    }

    /**
     * Handle auth type change
     */
    onAuthTypeChange() {
        this.authType = handleAuthTypeChange(this.element, AUTH_SELECT_ID, '');
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
                    <strong>${t('import.urlRequired')}</strong>
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
                    <strong>${t('import.invalidUrl')}</strong>
                    <p>${t('import.invalidUrlDetail')}</p>
                </div>
            `);
            return;
        }

        this.isLoading = true;
        this.updateFetchButton();

        // Build URL with query params if needed (for API key in query)
        const finalUrl = this.getUrlWithParams(url);

        // Build headers with authentication
        const headers = this.getAuthHeaders();

        this.updatePreview(`
            <div class="preview-loading">
                <div class="spinner"></div>
                <p>${t('import.fetchingFrom', { url: url })}</p>
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
                    <strong>✓ ${t('import.fetchSuccess')}</strong>
                    <p>${t('import.fetchedItems', { count: Array.isArray(data) ? data.length : 1 })}</p>
                </div>
            `);

        } catch (error) {
            let errorMessage = error.message;
            if (error.message.includes('Failed to fetch')) {
                errorMessage = 'Network error. Please check:\n• The URL is correct\n• CORS is enabled on the server\n• You have internet connection';
            }

            this.updatePreview(`
                <div class="preview-error">
                    <strong>${t('import.fetchFailed')}</strong>
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
            fetchButton.textContent = this.isLoading ? t('import.fetching') : t('import.fetchData');
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
            button.innerHTML = `${getIcon('check', { size: 14 })} ${t('import.copied')}`;
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
            authTypeSelect.addEventListener('change', () => this.onAuthTypeChange());
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
