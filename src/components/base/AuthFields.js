import { t } from '../../core/I18nManager.js';

/**
 * Shared authentication fields logic used by both ApiImport and ApiExport.
 * Provides rendering, header building, and URL param logic for auth types:
 * none, bearer, apikey, basic, custom.
 */

/**
 * Render authentication input fields based on auth type
 * @param {string} authType - Current auth type
 * @param {string} idPrefix - Prefix for element IDs to avoid collisions
 * @returns {string} HTML string
 */
export function renderAuthFields(authType, idPrefix = '') {
    switch (authType) {
        case 'bearer':
            return `
                <div class="auth-fields">
                    <label for="${idPrefix}bearerToken">
                        <strong>${t('import.authBearer')}</strong>
                        <span class="hint">${t('teams.export.api.bearerHint')}</span>
                    </label>
                    <input
                        type="password"
                        id="${idPrefix}bearerToken"
                        class="auth-input"
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    />
                </div>
            `;

        case 'apikey':
            return `
                <div class="auth-fields">
                    <label for="${idPrefix}apiKeyName">
                        <strong>${t('import.authApiKey')}</strong>
                        <span class="hint">${t('teams.export.api.apiKeyNameHint')}</span>
                    </label>
                    <input
                        type="text"
                        id="${idPrefix}apiKeyName"
                        class="auth-input"
                        placeholder="X-API-Key"
                    />

                    <label for="${idPrefix}apiKeyValue" style="margin-top: 12px;">
                        <strong>${t('teams.export.api.apiKeyValue')}</strong>
                        <span class="hint">${t('teams.export.api.apiKeyValueHint')}</span>
                    </label>
                    <input
                        type="password"
                        id="${idPrefix}apiKeyValue"
                        class="auth-input"
                        placeholder="your-api-key-here"
                    />

                    <label style="margin-top: 12px; display: flex; align-items: center; gap: 8px;">
                        <input
                            type="checkbox"
                            id="${idPrefix}apiKeyInQuery"
                            style="width: auto;"
                        />
                        <span>${t('teams.export.api.apiKeyAsQuery')}</span>
                    </label>
                </div>
            `;

        case 'basic':
            return `
                <div class="auth-fields">
                    <label for="${idPrefix}basicUsername">
                        <strong>${t('teams.export.api.username')}</strong>
                    </label>
                    <input
                        type="text"
                        id="${idPrefix}basicUsername"
                        class="auth-input"
                        placeholder="username"
                        autocomplete="username"
                    />

                    <label for="${idPrefix}basicPassword" style="margin-top: 12px;">
                        <strong>${t('teams.export.api.password')}</strong>
                    </label>
                    <input
                        type="password"
                        id="${idPrefix}basicPassword"
                        class="auth-input"
                        placeholder="password"
                        autocomplete="current-password"
                    />
                </div>
            `;

        case 'custom':
            return `
                <div class="auth-fields">
                    <label for="${idPrefix}customHeaders">
                        <strong>${t('import.authCustomHeaders')}</strong>
                        <span class="hint">${t('teams.export.api.customHeadersHint')}</span>
                    </label>
                    <textarea
                        id="${idPrefix}customHeaders"
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

/**
 * Render the auth type selector dropdown
 * @param {string} authType - Current auth type
 * @param {string} selectId - ID for the select element
 * @returns {string} HTML string
 */
export function renderAuthSelector(authType, selectId = 'authTypeSelect') {
    return `
        <div class="auth-section">
            <label for="${selectId}">
                <strong>${t('import.authentication')}</strong>
                <span class="hint">${t('import.authHint')}</span>
            </label>
            <select id="${selectId}" class="auth-type-select">
                <option value="none" ${authType === 'none' ? 'selected' : ''}>${t('import.authNone')}</option>
                <option value="bearer" ${authType === 'bearer' ? 'selected' : ''}>${t('import.authBearer')}</option>
                <option value="apikey" ${authType === 'apikey' ? 'selected' : ''}>${t('import.authApiKey')}</option>
                <option value="basic" ${authType === 'basic' ? 'selected' : ''}>${t('import.authBasic')}</option>
                <option value="custom" ${authType === 'custom' ? 'selected' : ''}>${t('import.authCustomHeaders')}</option>
            </select>
            ${renderAuthFields(authType, selectId.replace('authTypeSelect', '').replace('AuthType', ''))}
        </div>
    `;
}

/**
 * Build authentication headers from DOM elements
 * @param {string} authType - Current auth type
 * @param {Element} container - Parent element to query selectors from
 * @param {string} idPrefix - Prefix for element IDs
 * @returns {Object} Headers object
 */
export function buildAuthHeaders(authType, container, idPrefix = '') {
    const headers = {
        'Content-Type': 'application/json'
    };

    switch (authType) {
        case 'bearer': {
            const token = container.querySelector(`#${idPrefix}bearerToken`)?.value.trim();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            break;
        }

        case 'apikey': {
            const keyName = container.querySelector(`#${idPrefix}apiKeyName`)?.value.trim();
            const keyValue = container.querySelector(`#${idPrefix}apiKeyValue`)?.value.trim();
            if (keyName && keyValue) {
                headers[keyName] = keyValue;
            }
            break;
        }

        case 'basic': {
            const username = container.querySelector(`#${idPrefix}basicUsername`)?.value.trim();
            const password = container.querySelector(`#${idPrefix}basicPassword`)?.value.trim();
            if (username && password) {
                const credentials = btoa(`${username}:${password}`);
                headers['Authorization'] = `Basic ${credentials}`;
            }
            break;
        }

        case 'custom': {
            const customHeadersText = container.querySelector(`#${idPrefix}customHeaders`)?.value.trim();
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
 * Build URL with query parameters for API key auth if needed
 * @param {string} baseUrl - The base URL
 * @param {string} authType - Current auth type
 * @param {Element} container - Parent element to query selectors from
 * @param {string} idPrefix - Prefix for element IDs
 * @returns {string} URL with params appended if applicable
 */
export function buildUrlWithParams(baseUrl, authType, container, idPrefix = '') {
    if (authType === 'apikey') {
        const isQueryParam = container.querySelector(`#${idPrefix}apiKeyInQuery`)?.checked;
        if (isQueryParam) {
            const keyName = container.querySelector(`#${idPrefix}apiKeyName`)?.value.trim();
            const keyValue = container.querySelector(`#${idPrefix}apiKeyValue`)?.value.trim();
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
 * Handle auth type change — re-renders auth fields in the DOM
 * @param {Element} container - Parent element
 * @param {string} selectId - ID of the auth type select
 * @param {string} idPrefix - Prefix for element IDs
 * @returns {string} New auth type value
 */
export function handleAuthTypeChange(container, selectId, idPrefix = '') {
    const select = container.querySelector(`#${selectId}`);
    const authType = select.value;

    const authSection = container.querySelector('.auth-section');
    if (authSection) {
        const existingFields = authSection.querySelector('.auth-fields');
        const newFieldsHTML = renderAuthFields(authType, idPrefix);

        if (existingFields) {
            existingFields.remove();
        }

        if (newFieldsHTML) {
            authSection.insertAdjacentHTML('beforeend', newFieldsHTML);
        }
    }

    return authType;
}
