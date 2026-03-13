import { t } from '../../core/I18nManager.js';

/**
 * Shared authentication fields logic used by both ApiImport and ApiExport.
 * Provides rendering, header building, and URL param logic for auth types:
 * none, bearer, apikey, basic, custom.
 *
 * @param idPrefix - When non-empty, a hyphen separator is added automatically
 *   (e.g. idPrefix='export' → id='export-bearerToken')
 */

function prefixId(prefix, name) {
    return prefix ? `${prefix}-${name}` : name;
}

/**
 * Render authentication input fields based on auth type
 */
export function renderAuthFields(authType, idPrefix = '') {
    switch (authType) {
        case 'bearer':
            return `
                <div class="auth-fields">
                    <label for="${prefixId(idPrefix, 'bearerToken')}">
                        <strong>${t('import.authBearer')}</strong>
                        <span class="hint">${t('common.auth.bearerHint')}</span>
                    </label>
                    <input
                        type="password"
                        id="${prefixId(idPrefix, 'bearerToken')}"
                        class="auth-input"
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    />
                </div>
            `;

        case 'apikey':
            return `
                <div class="auth-fields">
                    <label for="${prefixId(idPrefix, 'apiKeyName')}">
                        <strong>${t('import.authApiKey')}</strong>
                        <span class="hint">${t('common.auth.keyNameHint')}</span>
                    </label>
                    <input
                        type="text"
                        id="${prefixId(idPrefix, 'apiKeyName')}"
                        class="auth-input"
                        placeholder="X-API-Key"
                    />

                    <label for="${prefixId(idPrefix, 'apiKeyValue')}" style="margin-top: 12px;">
                        <strong>${t('common.auth.keyValue')}</strong>
                        <span class="hint">${t('common.auth.keyValueHint')}</span>
                    </label>
                    <input
                        type="password"
                        id="${prefixId(idPrefix, 'apiKeyValue')}"
                        class="auth-input"
                        placeholder="your-api-key-here"
                    />

                    <label style="margin-top: 12px; display: flex; align-items: center; gap: 8px;">
                        <input
                            type="checkbox"
                            id="${prefixId(idPrefix, 'apiKeyInQuery')}"
                            style="width: auto;"
                        />
                        <span>${t('common.auth.keyAsQuery')}</span>
                    </label>
                </div>
            `;

        case 'basic':
            return `
                <div class="auth-fields">
                    <label for="${prefixId(idPrefix, 'basicUsername')}">
                        <strong>${t('common.auth.username')}</strong>
                    </label>
                    <input
                        type="text"
                        id="${prefixId(idPrefix, 'basicUsername')}"
                        class="auth-input"
                        placeholder="username"
                        autocomplete="username"
                    />

                    <label for="${prefixId(idPrefix, 'basicPassword')}" style="margin-top: 12px;">
                        <strong>${t('common.auth.password')}</strong>
                    </label>
                    <input
                        type="password"
                        id="${prefixId(idPrefix, 'basicPassword')}"
                        class="auth-input"
                        placeholder="password"
                        autocomplete="current-password"
                    />
                </div>
            `;

        case 'custom':
            return `
                <div class="auth-fields">
                    <label for="${prefixId(idPrefix, 'customHeaders')}">
                        <strong>${t('import.authCustomHeaders')}</strong>
                        <span class="hint">${t('common.auth.customHeadersHint')}</span>
                    </label>
                    <textarea
                        id="${prefixId(idPrefix, 'customHeaders')}"
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
 * Build authentication headers from DOM elements
 */
export function buildAuthHeaders(authType, container, idPrefix = '') {
    const headers = {
        'Content-Type': 'application/json'
    };

    switch (authType) {
        case 'bearer': {
            const token = container.querySelector(`#${prefixId(idPrefix, 'bearerToken')}`)?.value.trim();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            break;
        }

        case 'apikey': {
            const keyName = container.querySelector(`#${prefixId(idPrefix, 'apiKeyName')}`)?.value.trim();
            const keyValue = container.querySelector(`#${prefixId(idPrefix, 'apiKeyValue')}`)?.value.trim();
            if (keyName && keyValue) {
                headers[keyName] = keyValue;
            }
            break;
        }

        case 'basic': {
            const username = container.querySelector(`#${prefixId(idPrefix, 'basicUsername')}`)?.value.trim();
            const password = container.querySelector(`#${prefixId(idPrefix, 'basicPassword')}`)?.value.trim();
            if (username && password) {
                const credentials = btoa(`${username}:${password}`);
                headers['Authorization'] = `Basic ${credentials}`;
            }
            break;
        }

        case 'custom': {
            const customHeadersText = container.querySelector(`#${prefixId(idPrefix, 'customHeaders')}`)?.value.trim();
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
 */
export function buildUrlWithParams(baseUrl, authType, container, idPrefix = '') {
    if (authType === 'apikey') {
        const isQueryParam = container.querySelector(`#${prefixId(idPrefix, 'apiKeyInQuery')}`)?.checked;
        if (isQueryParam) {
            const keyName = container.querySelector(`#${prefixId(idPrefix, 'apiKeyName')}`)?.value.trim();
            const keyValue = container.querySelector(`#${prefixId(idPrefix, 'apiKeyValue')}`)?.value.trim();
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
