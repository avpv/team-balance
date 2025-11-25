/**
 * Avatar Generator - Minimalistic Chernoff Face Avatars (GitHub Style)
 *
 * Generates clean, minimalistic Chernoff face avatars for TeamBalance.
 * - Deterministic: Same name always produces the same face
 * - Data-driven: ELO rating controls smile (higher ELO = bigger smile)
 * - GitHub-inspired: Flat colors, simple geometry, clean design
 *
 * @version 3.0.0
 */

/**
 * Simple hash function to convert string to number
 * @param {string} str - Input string (player name)
 * @returns {number} - Hash value
 */
function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
}

/**
 * Get a value from hash within a range
 * @param {number} hash - Hash value
 * @param {number} index - Seed index
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Value in range
 */
function getHashValue(hash, index, min, max) {
    const value = (hash + index * 1327) % 1000;
    return min + (value / 1000) * (max - min);
}

/**
 * Get avatar color scheme from hash (GitHub-style minimalistic)
 * @param {number} hash - Hash value
 * @returns {object} - Color scheme with background and features
 */
function getColorScheme(hash) {
    const schemes = [
        { bg: 'hsl(210, 70%, 90%)', face: 'hsl(210, 60%, 75%)', features: 'hsl(210, 50%, 40%)' }, // Blue
        { bg: 'hsl(160, 65%, 88%)', face: 'hsl(160, 55%, 70%)', features: 'hsl(160, 45%, 35%)' }, // Teal
        { bg: 'hsl(280, 60%, 90%)', face: 'hsl(280, 50%, 75%)', features: 'hsl(280, 40%, 40%)' }, // Purple
        { bg: 'hsl(340, 70%, 90%)', face: 'hsl(340, 60%, 75%)', features: 'hsl(340, 50%, 40%)' }, // Pink
        { bg: 'hsl(30, 75%, 88%)', face: 'hsl(30, 65%, 70%)', features: 'hsl(30, 55%, 35%)' },    // Orange
        { bg: 'hsl(120, 60%, 88%)', face: 'hsl(120, 50%, 70%)', features: 'hsl(120, 40%, 35%)' }, // Green
        { bg: 'hsl(190, 70%, 88%)', face: 'hsl(190, 60%, 72%)', features: 'hsl(190, 50%, 38%)' }, // Cyan
        { bg: 'hsl(50, 80%, 88%)', face: 'hsl(50, 70%, 68%)', features: 'hsl(50, 60%, 32%)' },    // Yellow
        { bg: 'hsl(15, 75%, 88%)', face: 'hsl(15, 65%, 70%)', features: 'hsl(15, 55%, 35%)' },    // Red-Orange
        { bg: 'hsl(260, 65%, 88%)', face: 'hsl(260, 55%, 73%)', features: 'hsl(260, 45%, 38%)' }, // Indigo
        { bg: 'hsl(90, 60%, 88%)', face: 'hsl(90, 50%, 70%)', features: 'hsl(90, 40%, 35%)' },    // Lime
        { bg: 'hsl(320, 70%, 88%)', face: 'hsl(320, 60%, 73%)', features: 'hsl(320, 50%, 38%)' }, // Magenta
    ];
    return schemes[hash % schemes.length];
}

/**
 * Map ELO rating to mouth curvature (smile)
 * @param {number|null} elo - ELO rating (typically 800-2200)
 * @returns {number} - Mouth curvature (-0.08 to 0.12, higher = more smile)
 */
function eloToSmile(elo) {
    if (elo === null || elo === undefined) {
        return 0; // Neutral expression if no ELO provided
    }

    // Normalize ELO (1000-2000 range) to smile curve
    // 1000 ELO → -0.08 (slight frown)
    // 1500 ELO → 0.02 (neutral/slight smile)
    // 2000+ ELO → 0.12 (big smile)
    const minElo = 1000;
    const maxElo = 2000;
    const minSmile = -0.08;
    const maxSmile = 0.12;

    const normalizedElo = Math.max(minElo, Math.min(maxElo, elo));
    const smileValue = minSmile + ((normalizedElo - minElo) / (maxElo - minElo)) * (maxSmile - minSmile);

    return smileValue;
}

/**
 * Generate minimalistic Chernoff face (GitHub style)
 * @param {number} hash - Hash value
 * @param {number} size - Avatar size
 * @param {number|null} elo - Optional ELO rating for smile
 * @returns {string} - SVG face
 */
function generateChernoffFace(hash, size, elo = null) {
    const center = size / 2;
    const colors = getColorScheme(hash);

    // Extract minimal facial features from hash (deterministic) - ENHANCED DIVERSITY
    const eyeSize = getHashValue(hash, 1, 0.06, 0.14);        // Expanded from 0.08-0.11 to 0.06-0.14 (2.3x range)
    const eyeSpacing = getHashValue(hash, 2, 0.22, 0.40);     // Expanded from 0.28-0.35 to 0.22-0.40 (2.6x range)
    const eyeStyle = Math.floor(getHashValue(hash, 3, 0, 6)); // Expanded from 3 to 6 styles
    const mouthWidth = getHashValue(hash, 4, 0.25, 0.50);     // Expanded from 0.3-0.42 to 0.25-0.50 (2x range)
    const faceShape = Math.floor(getHashValue(hash, 6, 0, 3)); // 0=circle, 1=oval-tall, 2=oval-wide
    const browStyle = Math.floor(getHashValue(hash, 7, 0, 4)); // 4 different eyebrow styles
    const browAngle = getHashValue(hash, 8, -0.08, 0.08);     // Eyebrow angle variation
    const noseStyle = Math.floor(getHashValue(hash, 9, 0, 3)); // 3 different nose styles

    // Mouth curve is based on ELO rating if provided
    const mouthCurve = elo !== null ? eloToSmile(elo) : getHashValue(hash, 5, -0.08, 0.12);

    // Calculate positions - Enhanced with face shape variations
    const faceRadius = center * 0.8;
    let faceRadiusX = faceRadius;
    let faceRadiusY = faceRadius;

    // Adjust face shape
    if (faceShape === 1) {
        // Oval - tall
        faceRadiusY = faceRadius * 1.15;
        faceRadiusX = faceRadius * 0.9;
    } else if (faceShape === 2) {
        // Oval - wide
        faceRadiusX = faceRadius * 1.15;
        faceRadiusY = faceRadius * 0.9;
    }

    const eyeY = center * 0.85;
    const eyeLeft = center - (center * eyeSpacing);
    const eyeRight = center + (center * eyeSpacing);
    const eyeR = size * eyeSize;

    const browY = eyeY - eyeR * 2.2;
    const browLeft = eyeLeft;
    const browRight = eyeRight;
    const browLength = eyeR * 2;

    const noseY = center * 1.05;

    const mouthY = center * 1.25;
    const mouthW = size * mouthWidth;
    const mouthCurveY = size * mouthCurve;

    // Generate eyes based on style - ENHANCED with 6 styles
    let eyesHTML = '';
    if (eyeStyle === 0) {
        // Simple circles
        eyesHTML = `
            <circle cx="${eyeLeft}" cy="${eyeY}" r="${eyeR}" fill="${colors.features}"/>
            <circle cx="${eyeRight}" cy="${eyeY}" r="${eyeR}" fill="${colors.features}"/>
        `;
    } else if (eyeStyle === 1) {
        // Small dots
        eyesHTML = `
            <circle cx="${eyeLeft}" cy="${eyeY}" r="${eyeR * 0.7}" fill="${colors.features}"/>
            <circle cx="${eyeRight}" cy="${eyeY}" r="${eyeR * 0.7}" fill="${colors.features}"/>
        `;
    } else if (eyeStyle === 2) {
        // Simple lines
        const lineLen = eyeR * 1.8;
        eyesHTML = `
            <line x1="${eyeLeft - lineLen / 2}" y1="${eyeY}" x2="${eyeLeft + lineLen / 2}" y2="${eyeY}"
                  stroke="${colors.features}" stroke-width="3" stroke-linecap="round"/>
            <line x1="${eyeRight - lineLen / 2}" y1="${eyeY}" x2="${eyeRight + lineLen / 2}" y2="${eyeY}"
                  stroke="${colors.features}" stroke-width="3" stroke-linecap="round"/>
        `;
    } else if (eyeStyle === 3) {
        // Large circles with white center (pupils)
        eyesHTML = `
            <circle cx="${eyeLeft}" cy="${eyeY}" r="${eyeR * 1.1}" fill="${colors.features}"/>
            <circle cx="${eyeLeft}" cy="${eyeY}" r="${eyeR * 0.5}" fill="${colors.face}"/>
            <circle cx="${eyeRight}" cy="${eyeY}" r="${eyeR * 1.1}" fill="${colors.features}"/>
            <circle cx="${eyeRight}" cy="${eyeY}" r="${eyeR * 0.5}" fill="${colors.face}"/>
        `;
    } else if (eyeStyle === 4) {
        // Vertical ovals
        eyesHTML = `
            <ellipse cx="${eyeLeft}" cy="${eyeY}" rx="${eyeR * 0.7}" ry="${eyeR * 1.2}" fill="${colors.features}"/>
            <ellipse cx="${eyeRight}" cy="${eyeY}" rx="${eyeR * 0.7}" ry="${eyeR * 1.2}" fill="${colors.features}"/>
        `;
    } else {
        // Curved lines (happy eyes)
        const lineLen = eyeR * 1.8;
        const curveY = eyeR * 0.3;
        eyesHTML = `
            <path d="M ${eyeLeft - lineLen / 2} ${eyeY} Q ${eyeLeft} ${eyeY + curveY} ${eyeLeft + lineLen / 2} ${eyeY}"
                  stroke="${colors.features}" stroke-width="3" fill="none" stroke-linecap="round"/>
            <path d="M ${eyeRight - lineLen / 2} ${eyeY} Q ${eyeRight} ${eyeY + curveY} ${eyeRight + lineLen / 2} ${eyeY}"
                  stroke="${colors.features}" stroke-width="3" fill="none" stroke-linecap="round"/>
        `;
    }

    // Generate eyebrows based on style - NEW FEATURE
    let browsHTML = '';
    if (browStyle === 0) {
        // Straight horizontal lines
        browsHTML = `
            <line x1="${browLeft - browLength / 2}" y1="${browY}" x2="${browLeft + browLength / 2}" y2="${browY}"
                  stroke="${colors.features}" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="${browRight - browLength / 2}" y1="${browY}" x2="${browRight + browLength / 2}" y2="${browY}"
                  stroke="${colors.features}" stroke-width="2.5" stroke-linecap="round"/>
        `;
    } else if (browStyle === 1) {
        // Angled brows (expressive)
        const angleOffset = size * browAngle;
        browsHTML = `
            <line x1="${browLeft - browLength / 2}" y1="${browY + angleOffset}" x2="${browLeft + browLength / 2}" y2="${browY - angleOffset}"
                  stroke="${colors.features}" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="${browRight - browLength / 2}" y1="${browY - angleOffset}" x2="${browRight + browLength / 2}" y2="${browY + angleOffset}"
                  stroke="${colors.features}" stroke-width="2.5" stroke-linecap="round"/>
        `;
    } else if (browStyle === 2) {
        // Curved brows (friendly)
        const curveY = eyeR * 0.4;
        browsHTML = `
            <path d="M ${browLeft - browLength / 2} ${browY} Q ${browLeft} ${browY - curveY} ${browLeft + browLength / 2} ${browY}"
                  stroke="${colors.features}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <path d="M ${browRight - browLength / 2} ${browY} Q ${browRight} ${browY - curveY} ${browRight + browLength / 2} ${browY}"
                  stroke="${colors.features}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        `;
    } else {
        // Thick short brows
        const shortLen = browLength * 0.7;
        browsHTML = `
            <line x1="${browLeft - shortLen / 2}" y1="${browY}" x2="${browLeft + shortLen / 2}" y2="${browY}"
                  stroke="${colors.features}" stroke-width="3.5" stroke-linecap="round"/>
            <line x1="${browRight - shortLen / 2}" y1="${browY}" x2="${browRight + shortLen / 2}" y2="${browY}"
                  stroke="${colors.features}" stroke-width="3.5" stroke-linecap="round"/>
        `;
    }

    // Generate nose based on style - NEW FEATURE
    let noseHTML = '';
    if (noseStyle === 0) {
        // Simple dot
        noseHTML = `<circle cx="${center}" cy="${noseY}" r="${eyeR * 0.5}" fill="${colors.features}"/>`;
    } else if (noseStyle === 1) {
        // Small vertical line
        const noseLen = eyeR * 1.2;
        noseHTML = `<line x1="${center}" y1="${noseY - noseLen / 2}" x2="${center}" y2="${noseY + noseLen / 2}"
                          stroke="${colors.features}" stroke-width="2.5" stroke-linecap="round"/>`;
    } else {
        // Minimal L-shape
        const noseSize = eyeR * 0.8;
        noseHTML = `<path d="M ${center} ${noseY - noseSize} L ${center} ${noseY} L ${center + noseSize} ${noseY}"
                          stroke="${colors.features}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
    }

    // Generate face shape SVG
    let faceHTML = '';
    if (faceShape === 0) {
        // Circle
        faceHTML = `<circle cx="${center}" cy="${center}" r="${faceRadius}" fill="${colors.face}"/>`;
    } else {
        // Ellipse (oval)
        faceHTML = `<ellipse cx="${center}" cy="${center}" rx="${faceRadiusX}" ry="${faceRadiusY}" fill="${colors.face}"/>`;
    }

    return `
        <!-- Background -->
        <rect width="${size}" height="${size}" fill="${colors.bg}" rx="${size * 0.15}"/>

        <!-- Face (enhanced with shape variations) -->
        ${faceHTML}

        <!-- Eyebrows (NEW) -->
        ${browsHTML}

        <!-- Eyes -->
        ${eyesHTML}

        <!-- Nose (NEW) -->
        ${noseHTML}

        <!-- Mouth (ELO-based smile) -->
        <path d="M ${center - mouthW / 2} ${mouthY} Q ${center} ${mouthY + mouthCurveY} ${center + mouthW / 2} ${mouthY}"
              stroke="${colors.features}" stroke-width="3" fill="none" stroke-linecap="round"/>
    `;
}

/**
 * Generate SVG avatar based on name and optional ELO rating
 * @param {string} name - Player name
 * @param {number} size - Avatar size (default: 96)
 * @param {number|null} elo - Optional ELO rating (affects smile)
 * @returns {string} - SVG string
 */
export function generateAvatar(name, size = 96, elo = null) {
    if (!name || typeof name !== 'string') {
        // Fallback for invalid input - generate a generic Chernoff face
        const hash = 12345; // Default hash for fallback
        const face = generateChernoffFace(hash, size, elo);
        return `
            <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
                ${face}
            </svg>
        `.trim();
    }

    const hash = hashString(name.toLowerCase().trim());
    const face = generateChernoffFace(hash, size, elo);

    return `
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
            ${face}
        </svg>
    `.trim();
}

/**
 * Generate avatar with specific size presets
 */
export const AvatarSizes = {
    SMALL: 48,
    MEDIUM: 64,
    LARGE: 96,
    XLARGE: 128
};

export default {
    generateAvatar,
    AvatarSizes
};
