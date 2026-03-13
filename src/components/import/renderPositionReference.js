import { t } from '../../core/I18nManager.js';

/**
 * Render position reference block for import components.
 * Shows available positions with abbreviations and full names.
 *
 * @param {Object} positionNames - Map of position key to full name, e.g. { S: 'Setter', OH: 'Outside Hitter' }
 * @param {string[]} [positionOrder] - Optional array of position keys defining display order
 * @returns {string} HTML string
 */
export function renderPositionReference(positionNames = {}, positionOrder = []) {
    const keys = positionOrder.length > 0
        ? positionOrder.filter(key => key in positionNames)
        : Object.keys(positionNames);

    if (keys.length === 0) return '';

    return `
        <div class="position-reference">
            <h3>${t('import.availablePositions')}</h3>
            <div class="position-reference-list">
                ${keys.map(key => `
                    <span class="position-reference-item">
                        <code>${key}</code> — ${positionNames[key]}
                    </span>
                `).join('')}
            </div>
        </div>
    `;
}
