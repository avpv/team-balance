import Component from '../base/Component.js';
import { getIcon } from '../base/Icons.js';
import { trackClick } from '../../config/analytics.js';
import { t } from '../../core/I18nManager.js';
import {
    renderAuthFields,
    buildAuthHeaders,
    buildUrlWithParams,
    handleAuthTypeChange
} from '../base/AuthFields.js';

const ID_PREFIX = 'apiExport';
const AUTH_SELECT_ID = 'apiExportAuthType';

/**
 * API export component - allows users to POST team data to an external URL
 */
export default class ApiExport extends Component {
    constructor({ content, onBack, onExportComplete }) {
        super();
        this.content = content;
        this.onBack = onBack;
        this.onExportComplete = onExportComplete;
        this.isLoading = false;
        this.authType = 'none';
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
                        <h2>${t('teams.export.api.title')}</h2>
                    </div>
                </div>

                <div class="export-method-content">
                    <div class="input-section">
                        <label for="apiExportUrlInput">
                            <strong>${t('teams.export.api.url')}</strong>
                            <span class="hint">${t('teams.export.api.urlHint')}</span>
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
                                ${this.isLoading ? t('teams.export.api.sending') : t('teams.export.api.sendData')}
                            </button>
                        </div>
                    </div>

                    <div class="auth-section">
                        <label for="${AUTH_SELECT_ID}">
                            <strong>${t('import.authentication')}</strong>
                            <span class="hint">${t('import.authHint')}</span>
                        </label>
                        <select id="${AUTH_SELECT_ID}" class="auth-type-select">
                            <option value="none" ${this.authType === 'none' ? 'selected' : ''}>${t('import.authNone')}</option>
                            <option value="bearer" ${this.authType === 'bearer' ? 'selected' : ''}>${t('import.authBearer')}</option>
                            <option value="apikey" ${this.authType === 'apikey' ? 'selected' : ''}>${t('import.authApiKey')}</option>
                            <option value="basic" ${this.authType === 'basic' ? 'selected' : ''}>${t('import.authBasic')}</option>
                            <option value="custom" ${this.authType === 'custom' ? 'selected' : ''}>${t('import.authCustomHeaders')}</option>
                        </select>
                        ${renderAuthFields(this.authType, ID_PREFIX)}
                    </div>

                    <div class="export-preview-section">
                        <div class="example-header">
                            <strong>${t('teams.export.api.dataPreview')}</strong>
                        </div>
                        <pre class="export-preview-content">${this.escapeHtml(this.content)}</pre>
                    </div>

                    <div class="info-box">
                        <h4>${getIcon('info', { size: 18 })} ${t('import.notes')}</h4>
                        <ul>
                            <li>${t('teams.export.api.notePostMethod')}</li>
                            <li>${t('teams.export.api.noteJsonBody')}</li>
                            <li>${t('teams.export.api.noteCorsRequired')}</li>
                        </ul>
                    </div>

                    <div id="apiExportResult" class="preview-container"></div>
                </div>
            </div>
        `;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

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

        const finalUrl = buildUrlWithParams(url, this.authType, this.element, ID_PREFIX);
        const headers = buildAuthHeaders(this.authType, this.element, ID_PREFIX);

        this.updateResult(`
            <div class="preview-loading">
                <div class="spinner"></div>
                <p>${t('teams.export.api.sendingTo', { url: url })}</p>
            </div>
        `);

        try {
            const response = await fetch(finalUrl, {
                method: 'POST',
                headers: headers,
                body: this.content
            });

            let responseBody = '';
            try {
                responseBody = await response.text();
            } catch (_) {
                // ignore body read errors
            }

            if (!response.ok) {
                const errorDetail = responseBody
                    ? `HTTP ${response.status}: ${response.statusText}\n${responseBody}`
                    : `HTTP ${response.status}: ${response.statusText}`;
                throw new Error(errorDetail);
            }

            trackClick('apiExportSendBtn', 'teams', 'export_api_send');

            const responseHtml = responseBody
                ? `<pre class="export-preview-content" style="margin-top: 8px; max-height: 150px;">${this.escapeHtml(responseBody)}</pre>`
                : '';

            this.updateResult(`
                <div class="preview-success">
                    <strong>\u2713 ${t('teams.export.api.sendSuccess')}</strong>
                    <p>${t('teams.export.api.sentTo', { url: url })}</p>
                </div>
                ${responseHtml}
            `);

            if (this.onExportComplete) {
                this.onExportComplete('api', 'send');
            }

        } catch (error) {
            let errorMessage = error.message;
            if (error.message.includes('Failed to fetch')) {
                errorMessage = t('teams.export.api.networkError');
            }

            this.updateResult(`
                <div class="preview-error">
                    <strong>${t('teams.export.api.sendFailed')}</strong>
                    <p style="white-space: pre-line;">${this.escapeHtml(errorMessage)}</p>
                </div>
            `);
        } finally {
            this.isLoading = false;
            this.updateSendButton();
        }
    }

    updateSendButton() {
        const sendButton = this.element.querySelector('[data-action="send"]');
        if (sendButton) {
            sendButton.disabled = this.isLoading;
            sendButton.textContent = this.isLoading ? t('teams.export.api.sending') : t('teams.export.api.sendData');
        }
    }

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

        const authTypeSelect = this.element.querySelector(`#${AUTH_SELECT_ID}`);
        if (authTypeSelect) {
            authTypeSelect.addEventListener('change', () => {
                this.authType = handleAuthTypeChange(this.element, AUTH_SELECT_ID, ID_PREFIX);
            });
        }
    }

    mount(container) {
        super.mount(container);
        this.attachEventListeners();
    }
}
