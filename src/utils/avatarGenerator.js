/**
 * Avatar Generator - Statistical Chernoff Face Avatars
 *
 * Generates clean, academic-style Chernoff face avatars for TeamBalance.
 * Chernoff faces are statistical facial glyphs where each facial feature
 * encodes one numeric variable, making data visual and memorable.
 *
 * 10 Parameters Encoded:
 * 1. Head size - Overall face radius
 * 2. Face width/roundness - Horizontal vs vertical proportions
 * 3. Eye size - Size of eye circles
 * 4. Eye separation - Distance between eyes
 * 5. Pupil size - Size of pupils within eyes
 * 6. Eyebrow angle - Angle/expression of eyebrows
 * 7. Nose length - Vertical length of nose
 * 8. Mouth curvature - Smile/frown (can be ELO-based)
 * 9. Mouth width - Horizontal width of mouth
 * 10. Ear size - Size of ears
 *
 * Features:
 * - Deterministic: Same name always produces the same face
 * - Data-driven: ELO rating can control smile (variable 8)
 * - Academic style: Clean geometric shapes, 1-3px lines, symmetric
 * - Statistical: Similar to R/Python Chernoff faces libraries
 *
 * @version 4.0.0 - Full Statistical Chernoff Faces
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
 * Get avatar color scheme from hash (Academic/Scientific style)
 * @param {number} hash - Hash value
 * @returns {object} - Color scheme with background, face, and features
 */
function getColorScheme(hash) {
    const schemes = [
        { bg: 'hsl(210, 50%, 92%)', face: 'hsl(210, 40%, 80%)', features: 'hsl(210, 60%, 30%)' }, // Blue
        { bg: 'hsl(160, 45%, 90%)', face: 'hsl(160, 35%, 75%)', features: 'hsl(160, 55%, 28%)' }, // Teal
        { bg: 'hsl(280, 40%, 92%)', face: 'hsl(280, 30%, 80%)', features: 'hsl(280, 50%, 32%)' }, // Purple
        { bg: 'hsl(340, 50%, 92%)', face: 'hsl(340, 40%, 80%)', features: 'hsl(340, 60%, 32%)' }, // Pink
        { bg: 'hsl(30, 55%, 90%)', face: 'hsl(30, 45%, 75%)', features: 'hsl(30, 65%, 28%)' },    // Orange
        { bg: 'hsl(120, 40%, 90%)', face: 'hsl(120, 30%, 75%)', features: 'hsl(120, 50%, 28%)' }, // Green
        { bg: 'hsl(190, 50%, 90%)', face: 'hsl(190, 40%, 78%)', features: 'hsl(190, 60%, 30%)' }, // Cyan
        { bg: 'hsl(50, 60%, 90%)', face: 'hsl(50, 50%, 73%)', features: 'hsl(50, 70%, 25%)' },    // Yellow
        { bg: 'hsl(15, 55%, 90%)', face: 'hsl(15, 45%, 75%)', features: 'hsl(15, 65%, 28%)' },    // Red-Orange
        { bg: 'hsl(260, 45%, 90%)', face: 'hsl(260, 35%, 78%)', features: 'hsl(260, 55%, 30%)' }, // Indigo
        { bg: 'hsl(90, 40%, 90%)', face: 'hsl(90, 30%, 75%)', features: 'hsl(90, 50%, 28%)' },    // Lime
        { bg: 'hsl(320, 50%, 90%)', face: 'hsl(320, 40%, 78%)', features: 'hsl(320, 60%, 30%)' }, // Magenta
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
 * Generate statistical Chernoff face with 10 encoded parameters
 * @param {number} hash - Hash value
 * @param {number} size - Avatar size
 * @param {number|null} elo - Optional ELO rating for smile (variable 8)
 * @returns {string} - SVG face
 */
function generateChernoffFace(hash, size, elo = null) {
    const center = size / 2;
    const colors = getColorScheme(hash);

    // === 10 STATISTICAL PARAMETERS (Chernoff Face Variables) ===
    // All parameters are continuous numeric values for proper statistical encoding

    // Variable 1: Head size (overall face radius)
    const headSize = getHashValue(hash, 1, 0.65, 0.85);

    // Variable 2: Face width/roundness (aspect ratio: 0.8=tall, 1.0=circle, 1.2=wide)
    const faceAspect = getHashValue(hash, 2, 0.8, 1.2);

    // Variable 3: Eye size (radius of eye circles)
    const eyeSize = getHashValue(hash, 3, 0.06, 0.14);

    // Variable 4: Eye separation (distance between eyes)
    const eyeSeparation = getHashValue(hash, 4, 0.22, 0.40);

    // Variable 5: Pupil size (size of pupils within eyes, 0.3-0.7 of eye size)
    const pupilSize = getHashValue(hash, 5, 0.3, 0.7);

    // Variable 6: Eyebrow angle (-0.15=sad, 0=neutral, 0.15=surprised)
    const eyebrowAngle = getHashValue(hash, 6, -0.15, 0.15);

    // Variable 7: Nose length (0.5-1.5 times eye radius)
    const noseLength = getHashValue(hash, 7, 0.5, 1.5);

    // Variable 8: Mouth curvature (smile/frown, can be ELO-based)
    const mouthCurve = elo !== null ? eloToSmile(elo) : getHashValue(hash, 8, -0.08, 0.12);

    // Variable 9: Mouth width (horizontal width)
    const mouthWidth = getHashValue(hash, 9, 0.25, 0.50);

    // Variable 10: Ear size (size of ears)
    const earSize = getHashValue(hash, 10, 0.08, 0.15);

    // === CALCULATE POSITIONS AND DIMENSIONS ===

    // Face dimensions
    const faceRadius = center * headSize;
    const faceRadiusX = faceRadius * faceAspect;
    const faceRadiusY = faceRadius;

    // Eye positions and dimensions
    const eyeY = center * 0.85;
    const eyeLeft = center - (center * eyeSeparation);
    const eyeRight = center + (center * eyeSeparation);
    const eyeR = size * eyeSize;
    const pupilR = eyeR * pupilSize;

    // Eyebrow positions
    const browY = eyeY - eyeR * 2.2;
    const browLeft = eyeLeft;
    const browRight = eyeRight;
    const browLength = eyeR * 2.2;
    const browAngleOffset = size * eyebrowAngle;

    // Nose position and length
    const noseY = center * 1.05;
    const noseLen = eyeR * noseLength;

    // Mouth position and dimensions
    const mouthY = center * 1.28;
    const mouthW = size * mouthWidth;
    const mouthCurveY = size * mouthCurve;

    // Ear positions and dimensions
    const earLeft = center - faceRadiusX;
    const earRight = center + faceRadiusX;
    const earY = center * 0.95;
    const earR = size * earSize;

    // === GENERATE SVG ELEMENTS ===

    // Face (ellipse with aspect ratio)
    const faceHTML = `<ellipse cx="${center}" cy="${center}" rx="${faceRadiusX}" ry="${faceRadiusY}" fill="${colors.face}" stroke="none"/>`;

    // Ears (simple ellipses on sides of face)
    const earsHTML = `
        <ellipse cx="${earLeft}" cy="${earY}" rx="${earR * 0.6}" ry="${earR}" fill="${colors.face}" stroke="${colors.features}" stroke-width="1.5"/>
        <ellipse cx="${earRight}" cy="${earY}" rx="${earR * 0.6}" ry="${earR}" fill="${colors.face}" stroke="${colors.features}" stroke-width="1.5"/>
    `;

    // Eyes (circles with pupils)
    const eyesHTML = `
        <!-- Left eye -->
        <circle cx="${eyeLeft}" cy="${eyeY}" r="${eyeR}" fill="${colors.bg}" stroke="${colors.features}" stroke-width="2"/>
        <circle cx="${eyeLeft}" cy="${eyeY}" r="${pupilR}" fill="${colors.features}"/>
        <!-- Right eye -->
        <circle cx="${eyeRight}" cy="${eyeY}" r="${eyeR}" fill="${colors.bg}" stroke="${colors.features}" stroke-width="2"/>
        <circle cx="${eyeRight}" cy="${eyeY}" r="${pupilR}" fill="${colors.features}"/>
    `;

    // Eyebrows (angled lines)
    const browsHTML = `
        <!-- Left eyebrow -->
        <line x1="${browLeft - browLength / 2}" y1="${browY + browAngleOffset}"
              x2="${browLeft + browLength / 2}" y2="${browY - browAngleOffset}"
              stroke="${colors.features}" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Right eyebrow -->
        <line x1="${browRight - browLength / 2}" y1="${browY - browAngleOffset}"
              x2="${browRight + browLength / 2}" y2="${browY + browAngleOffset}"
              stroke="${colors.features}" stroke-width="2.5" stroke-linecap="round"/>
    `;

    // Nose (simple vertical line)
    const noseHTML = `
        <line x1="${center}" y1="${noseY - noseLen / 2}" x2="${center}" y2="${noseY + noseLen / 2}"
              stroke="${colors.features}" stroke-width="2" stroke-linecap="round"/>
    `;

    // Mouth (curved line for smile/frown)
    const mouthHTML = `
        <path d="M ${center - mouthW / 2} ${mouthY} Q ${center} ${mouthY + mouthCurveY} ${center + mouthW / 2} ${mouthY}"
              stroke="${colors.features}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    `;

    return `
        <!-- Background -->
        <rect width="${size}" height="${size}" fill="${colors.bg}" rx="${size * 0.042}"/>

        <!-- Ears (Variable 10) -->
        ${earsHTML}

        <!-- Face (Variables 1 & 2: head size and face aspect ratio) -->
        ${faceHTML}

        <!-- Eyebrows (Variable 6: eyebrow angle) -->
        ${browsHTML}

        <!-- Eyes (Variables 3, 4, 5: eye size, separation, pupil size) -->
        ${eyesHTML}

        <!-- Nose (Variable 7: nose length) -->
        ${noseHTML}

        <!-- Mouth (Variables 8 & 9: mouth curvature and width) -->
        ${mouthHTML}
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
