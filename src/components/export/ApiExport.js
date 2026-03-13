import Component from '../base/Component.js';
import { getIcon } from '../base/Icons.js';
import { trackClick } from '../../config/analytics.js';
import { t } from '../../core/I18nManager.js';

/**
 * API export component - allows users to POST team data to an external URL
 * Mirrors ApiImport component interface for consistency
 */
export default class ApiExport extends Component {
    constructor({ content, onBack, onExportComplete }) {
        super();
        this.content = content;
        this.onBack = onBack;
        this.onExportComplete = onExportComplete;
        this.isLoading = false;
        this.authType = 'none'; // none, bearer, apikey, basic, custom
    }

    /**
     * Render authentication fields based on selected type
     */
    renderAuthFields() {
        switch (this.authType) {
            case 'bearer':
                return `
                    <div class="auth-fields">
                        <label for="apiBearerToken">
                            <strong>Bearer Token</strong>
                            <span class="hint">${t('export.api.bearerHint')}</span>
                        </label>
                        <input
                            type="password"
                            id="apiBearerToken"
                            class="auth-input"
                            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        />
                    </div>
                `;

            case 'apikey':
                return `
                    <div class="auth-fields">
                        <label for="apiExportKeyName">
                            <strong>${t('import.authApiKey')}</strong>
                            <span class="hint">${t('export.api.apiKeyNameHint')}</span>
                        </label>
                        <input
                            type="text"
                            id="apiExportKeyName"
                            class="auth-input"
                            placeholder="X-API-Key"
                        />

                        <label for="apiExportKeyValue" style="margin-top: 12px;">
                            <strong>${t('export.api.apiKeyValue')}</strong>
                            <span class="hint">${t('export.api.apiKeyValueHint')}</span>
                        </label>
                        <input
                            type="password"
                            id="apiExportKeyValue"
                            class="auth-input"
                            placeholder="your-api-key-here"
                        />

                        <label style="margin-top: 12px; display: flex; align-items: center; gap: 8px;">
                            <input
                                type="checkbox"
                                id="apiExportKeyInQuery"
                                style="width: auto;"
                            />
                            <span>${t('export.api.apiKeyAsQuery')}</span>
                        </label>
                    </div>
                `;

            case 'basic':
                return `
                    <div class="auth-fields">
                        <label for="apiExportUsername">
                            <strong>${t('export.api.username')}</strong>
                        </label>
                        <input
                            type="text"
                            id="apiExportUsername"
                            class="auth-input"
                            placeholder="username"
                            autocomplete="username"
                        />

                        <label for="apiExportPassword" style="margin-top: 12px;">
                            <strong>${t('export.api.password')}</strong>
                        </label>
                        <input
                            type="password"
                            id="apiExportPassword"
                            class="auth-input"
                            placeholder="password"
                            autocomplete="current-password"
                        />
                    </div>
                `;

            case 'custom':
                return `
                    <div class="auth-fields">
                        <label for="apiExportCustomHeaders">
                            <strong>${t('import.authCustomHeaders')}</strong>
                            <span class="hint">${t('export.api.customHeadersHint')}</span>
                        </label>
                        <textarea
                            id="apiExportCustomHeaders"
                            class="auth-input"
                            rows="4"
                            placeholder="Authorization: Bearer token123&#10;X-Custom-Header: value&#10;X-API-Key: key123"
                        ></textarea>
                    </div>
                `;

            default:
                return '';
        }
    }

    render() {
        return `
            <div class="export-method-container">
                <div class="export-method-header">
                    <button id="apiExportBackBtn" class="btn btn-secondary back-button" data-action="back">
                        ${getIcon('arrow-left', { size: 16 })}
                        ${t('import.back')}
                    </button>
                    <div class="header-content">
                        <h2>${t('export.api.title')}</h2>
                    </div>
                </div>

                <div class="export-method-content">
                    <div class="input-section">
                        <label for="apiExportUrlInput">
                            <strong>${t('export.api.url')}</strong>
                            <span class="hint">${t('export.api.urlHint')}</span>
                        </label>
                        <div class="url-input-group">
                            <input
                                type="url"
                                id="apiExportUrlInput"
                                class="url-input"
                                placeholder="https://example.com/api/teams"
                            />
                            <button
                                id="apiExportSendBtn"
                                class="btn btn-primary fetch-button"
                                data-action="send"
                                ${this.isLoading ? 'disabled' : ''}
                            >
                                ${this.isLoading ? t('export.api.sending') : t('export.api.sendData')}
                            </button>
                        </div>
                    </div>

                    <div class="auth-section">
                        <label for="apiExportAuthType">
                            <strong>${t('import.authentication')}</strong>
                            <span class="hint">${t('import.authHint')}</span>
                        </label>
                        <select id="apiExportAuthType" class="auth-type-select">
                            <option value="none" ${this.authType === 'none' ? 'selected' : ''}>${t('import.authNone')}</option>
                            <option value="bearer" ${this.authType === 'bearer' ? 'selected' : ''}>${t('import.authBearer')}</option>
                            <option value="apikey" ${this.authType === 'apikey' ? 'selected' : ''}>${t('import.authApiKey')}</option>
                            <option value="basic" ${this.authType === 'basic' ? 'selected' : ''}>${t('import.authBasic')}</option>
                            <option value="custom" ${this.authType === 'custom' ? 'selected' : ''}>${t('import.authCustomHeaders')}</option>
                        </select>
                        ${this.renderAuthFields()}
                    </div>

                    <div class="export-preview-section">
                        <div class="example-header">
                            <strong>${t('export.api.dataPreview')}</strong>
                        </div>
                        <pre class="export-preview-content">${this.escapeHtml(this.content)}</pre>
                    </div>

                    <div class="info-box">
                        <h4>${getIcon('info', { size: 18 })} ${t('import.notes')}</h4>
                        <ul>
                            <li>${t('export.api.notePostMethod')}</li>
                            <li>${t('export.api.noteJsonBody')}</li>
                            <li>${t('export.api.noteCorsRequired')}</li>
                        </ul>
                    </div>

                    <div id="apiExportResult" class="preview-container"></div>
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

    /**
     * Build authentication headers based on selected type
     */
    buildAuthHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };

        switch (this.authType) {
            case 'bearer': {
                const token = this.element.querySelector('#apiBearerToken')?.value.trim();
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
                break;
            }

            case 'apikey': {
                const keyName = this.element.querySelector('#apiExportKeyName')?.value.trim();
                const keyValue = this.element.querySelector('#apiExportKeyValue')?.value.trim();
                if (keyName && keyValue) {
                    headers[keyName] = keyValue;
                }
                break;
            }

            case 'basic': {
                const username = this.element.querySelector('#apiExportUsername')?.value.trim();
                const password = this.element.querySelector('#apiExportPassword')?.value.trim();
                if (username && password) {
                    const credentials = btoa(`${username}:${password}`);
                    headers['Authorization'] = `Basic ${credentials}`;
                }
                break;
            }

            case 'custom': {
                const customHeadersText = this.element.querySelector('#apiExportCustomHeaders')?.value.trim();
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
            const isQueryParam = this.element.querySelector('#apiExportKeyInQuery')?.checked;
            if (isQueryParam) {
                const keyName = this.element.querySelector('#apiExportKeyName')?.value.trim();
                const keyValue = this.element.querySelector('#apiExportKeyValue')?.value.trim();
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
        const select = this.element.querySelector('#apiExportAuthType');
        this.authType = select.value;

        const authSection = this.element.querySelector('.auth-section');
        if (authSection) {
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
     * Send data to URL via POST
     */
    async sendData() {
        const urlInput = this.element.querySelector('#apiExportUrlInput');
        const url = urlInput.value.trim();

        if (!url) {
            this.updateResult(`
                <div class="preview-error">
                    <strong>${t('import.urlRequired')}</strong>
                </div>
            `);
            return;
        }

        try {
            new URL(url);
        } catch (error) {
            this.updateResult(`
                <div class="preview-error">
                    <strong>${t('import.invalidUrl')}</strong>
                    <p>${t('import.invalidUrlDetail')}</p>
                </div>
            `);
            return;
        }

        this.isLoading = true;
        this.updateSendButton();

        const finalUrl = this.buildUrlWithParams(url);
        const headers = this.buildAuthHeaders();

        this.updateResult(`
            <div class="preview-loading">
                <div class="spinner"></div>
                <p>${t('export.api.sendingTo', { url: url })}</p>
            </div>
        `);

        try {
            const response = await fetch(finalUrl, {
                method: 'POST',
                headers: headers,
                body: this.content
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            trackClick('apiExportSendBtn', 'teams', 'export_api_send');

            this.updateResult(`
                <div class="preview-success">
                    <strong>\u2713 ${t('export.api.sendSuccess')}</strong>
                    <p>${t('export.api.sentTo', { url: url })}</p>
                </div>
            `);

            if (this.onExportComplete) {
                this.onExportComplete('api', 'send');
            }

        } catch (error) {
            let errorMessage = error.message;
            if (error.message.includes('Failed to fetch')) {
                errorMessage = t('export.api.networkError');
            }

            this.updateResult(`
                <div class="preview-error">
                    <strong>${t('export.api.sendFailed')}</strong>
                    <p style="white-space: pre-line;">${errorMessage}</p>
                </div>
            `);
        } finally {
            this.isLoading = false;
            this.updateSendButton();
        }
    }

    /**
     * Update send button state
     */
    updateSendButton() {
        const sendButton = this.element.querySelector('[data-action="send"]');
        if (sendButton) {
            sendButton.disabled = this.isLoading;
            sendButton.textContent = this.isLoading ? t('export.api.sending') : t('export.api.sendData');
        }
    }

    /**
     * Update result area
     */
    updateResult(html) {
        const container = this.element.querySelector('#apiExportResult');
        if (container) {
            container.innerHTML = html;
        }
    }

    attachEventListeners() {
        const backButton = this.element.querySelector('[data-action="back"]');
        if (backButton) {
            backButton.addEventListener('click', () => {
                if (this.onBack) this.onBack();
            });
        }

        const sendButton = this.element.querySelector('[data-action="send"]');
        if (sendButton) {
            sendButton.addEventListener('click', () => this.sendData());
        }

        const urlInput = this.element.querySelector('#apiExportUrlInput');
        if (urlInput) {
            urlInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !this.isLoading) {
                    this.sendData();
                }
            });
        }

        const authTypeSelect = this.element.querySelector('#apiExportAuthType');
        if (authTypeSelect) {
            authTypeSelect.addEventListener('change', () => this.handleAuthTypeChange());
        }
    }

    mount(container) {
        super.mount(container);
        this.attachEventListeners();
    }
}
