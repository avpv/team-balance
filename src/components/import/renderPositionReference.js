import { t } from '../../core/I18nManager.js';

/**
 * Render position reference block for import components.
 * Shows available positions with abbreviations and full names.
 *
 * @param {Object} positionConfig - Normalized position config from createPositionConfig()
 * @param {Object} positionConfig.names - Map of position key to full name
 * @param {string[]} positionConfig.keys - Ordered position keys
 * @returns {string} HTML string
 */
export function renderPositionReference({ names = {}, keys = [] } = {}) {
    if (keys.length === 0) return '';

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
