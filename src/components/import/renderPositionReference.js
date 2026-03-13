import { t } from '../../core/I18nManager.js';

/**
 * Get ordered position keys from position config.
 * Uses order array if provided, otherwise falls back to Object.keys(names).
 *
 * @param {Object} positionConfig
 * @param {Object} positionConfig.names - Map of position key to full name
 * @param {string[]} [positionConfig.order] - Optional display order
 * @returns {string[]} Ordered position keys
 */
export function getPositionKeys({ names = {}, order = [] } = {}) {
    return order.length > 0
        ? order.filter(key => key in names)
        : Object.keys(names);
}

/**
 * Render position reference block for import components.
 * Shows available positions with abbreviations and full names.
 *
 * @param {Object} positionConfig
 * @param {Object} positionConfig.names - Map of position key to full name, e.g. { S: 'Setter', OH: 'Outside Hitter' }
 * @param {string[]} [positionConfig.order] - Optional array of position keys defining display order
 * @returns {string} HTML string
 */
export function renderPositionReference(positionConfig = {}) {
    const keys = getPositionKeys(positionConfig);

    if (keys.length === 0) return '';

    const { names } = positionConfig;
    return `
        <div class="position-reference">
            <h3>${t('import.availablePositions')}</h3>
            <div class="position-reference-list">
                ${keys.map(key => `
                    <span class="position-reference-item">
                        <code>${key}</code> — ${names[key]}
                    </span>
                `).join('')}
            </div>
        </div>
    `;
}
