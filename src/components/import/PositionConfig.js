/**
 * Normalized position configuration for import components.
 *
 * @param {Object} [raw] - Raw position config
 * @param {Object} [raw.names] - Map of position key to full name, e.g. { S: 'Setter' }
 * @param {string[]} [raw.order] - Display order of position keys
 */
export function createPositionConfig(raw = {}) {
    const names = raw.names || {};
    const order = raw.order || [];
    const keys = order.length > 0
        ? order.filter(key => key in names)
        : Object.keys(names);

    return { names, order, keys };
}
