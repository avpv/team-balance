/**
 * Avatar Generator - Statistical Chernoff Face Avatars
 *
 * Generates clean, academic-style Chernoff face avatars for TeamBalance.
 * Chernoff faces are statistical facial glyphs where each facial feature
 * encodes one numeric variable, making data visual and memorable.
 *
 * 19 Parameters Encoded:
 * 1. Head size - Overall face radius
 * 2. Face width/roundness - Horizontal vs vertical proportions
 * 3. Eye size - Horizontal size of eye ellipses
 * 4. Eye separation - Distance between eyes
 * 5. Pupil size - Size of pupils within eyes
 * 6. Eyebrow angle - Angle/expression of eyebrows
 * 7. Nose length - Vertical length of nose triangle
 * 8. Mouth curvature - Smile/frown (can be ELO-based)
 * 9. Mouth width - Horizontal width of mouth
 * 10. Ear size - Size of ears
 * 11. Nose width - Width of nose base (triangle)
 * 12. Left eye height - Vertical radius of left eye
 * 13. Right eye height - Vertical radius of right eye
 * 14. Pupil X position - Horizontal gaze direction
 * 15. Pupil Y position - Vertical gaze direction
 * 16. Eyebrow curvature - Arc depth of eyebrows (cubic curves)
 * 17. Nostril size - Size of nostrils
 * 18. Lip thickness - Fullness of lips
 * 19. Chin shape - Pointedness of chin
 *
 * Features:
 * - Deterministic: Same name always produces the same face
 * - Data-driven: ELO rating can control smile (variable 8)
 * - Academic style: Clean geometric shapes, 1-3px lines, symmetric
 * - Statistical: Similar to R/Python Chernoff faces libraries
 *
 * @version 6.0.0 - Highly Expressive Chernoff Faces with 19 Parameters
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
 * Generate highly expressive Chernoff face with 19 encoded parameters
 * @param {number} hash - Hash value
 * @param {number} size - Avatar size
 * @param {number|null} elo - Optional ELO rating for smile (variable 8)
 * @returns {string} - SVG face
 */
function generateChernoffFace(hash, size, elo = null) {
    const center = size / 2;
    const colors = getColorScheme(hash);

    // === 19 STATISTICAL PARAMETERS (Chernoff Face Variables) ===
    // All parameters are continuous numeric values for proper statistical encoding

    // Variable 1: Head size (overall face radius)
    const headSize = getHashValue(hash, 1, 0.65, 0.85);

    // Variable 2: Face width/roundness (aspect ratio: 0.8=tall, 1.0=circle, 1.2=wide)
    const faceAspect = getHashValue(hash, 2, 0.8, 1.2);

    // Variable 19: Chin shape (pointedness: 0=round, 1=pointed/angular)
    const chinShape = getHashValue(hash, 19, 0.0, 1.0);

    // Variable 3: Eye size (horizontal radius of eye ellipses)
    const eyeSize = getHashValue(hash, 3, 0.06, 0.14);

    // Variable 4: Eye separation (distance between eyes)
    const eyeSeparation = getHashValue(hash, 4, 0.22, 0.40);

    // Variable 12: Left eye height (vertical radius as ratio of horizontal)
    const eyeHeightLeft = getHashValue(hash, 12, 0.6, 1.0);

    // Variable 13: Right eye height (vertical radius as ratio of horizontal)
    const eyeHeightRight = getHashValue(hash, 13, 0.6, 1.0);

    // Variable 5: Pupil size (size of pupils within eyes, 0.3-0.7 of eye size)
    const pupilSize = getHashValue(hash, 5, 0.3, 0.7);

    // Variable 14: Pupil X position (horizontal gaze direction: -0.3=left, 0=center, 0.3=right)
    const pupilOffsetX = getHashValue(hash, 14, -0.3, 0.3);

    // Variable 15: Pupil Y position (vertical gaze direction: -0.2=up, 0=center, 0.2=down)
    const pupilOffsetY = getHashValue(hash, 15, -0.2, 0.2);

    // Variable 6: Eyebrow angle (-0.15=sad, 0=neutral, 0.15=surprised)
    const eyebrowAngle = getHashValue(hash, 6, -0.15, 0.15);

    // Variable 16: Eyebrow curvature (arc depth: 0.1=slight, 0.5=strong)
    const eyebrowCurve = getHashValue(hash, 16, 0.15, 0.5);

    // Variable 7: Nose length (0.5-1.5 times eye radius)
    const noseLength = getHashValue(hash, 7, 0.5, 1.5);

    // Variable 11: Nose width (width of nose base)
    const noseWidth = getHashValue(hash, 11, 0.03, 0.08);

    // Variable 17: Nostril size (size of nostrils)
    const nostrilSize = getHashValue(hash, 17, 0.01, 0.025);

    // Variable 8: Mouth curvature (smile/frown, can be ELO-based)
    const mouthCurve = elo !== null ? eloToSmile(elo) : getHashValue(hash, 8, -0.08, 0.12);

    // Variable 9: Mouth width (horizontal width)
    const mouthWidth = getHashValue(hash, 9, 0.25, 0.50);

    // Variable 18: Lip thickness (fullness of lips)
    const lipThickness = getHashValue(hash, 18, 0.008, 0.025);

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
    const eyeRx = size * eyeSize; // Horizontal radius
    const eyeRyLeft = eyeRx * eyeHeightLeft; // Vertical radius for left eye
    const eyeRyRight = eyeRx * eyeHeightRight; // Vertical radius for right eye
    const pupilR = eyeRx * pupilSize;

    // Eyebrow positions
    const browY = eyeY - eyeRx * 2.2;
    const browLeft = eyeLeft;
    const browRight = eyeRight;
    const browLength = eyeRx * 2.2;
    const browAngleOffset = size * eyebrowAngle;

    // Nose position and dimensions
    const noseY = center * 1.05;
    const noseLen = eyeRx * noseLength;
    const noseW = size * noseWidth;

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

    // Face (path with variable chin shape)
    // Create face shape that interpolates between round and pointed chin
    const chinPointY = center + faceRadiusY * (1 - chinShape * 0.15); // How far down the point goes
    const chinPointX = center; // Center of chin
    const chinWidth = faceRadiusX * (1 - chinShape * 0.3); // Narrower at chin if pointed

    // Use elliptical arc for round parts, then curve to chin point
    const faceHTML = `
        <path d="M ${center} ${center - faceRadiusY}
                 A ${faceRadiusX} ${faceRadiusY * 0.8} 0 0 1 ${center + faceRadiusX} ${center}
                 Q ${center + chinWidth} ${center + faceRadiusY * 0.9} ${chinPointX} ${chinPointY}
                 Q ${center - chinWidth} ${center + faceRadiusY * 0.9} ${center - faceRadiusX} ${center}
                 A ${faceRadiusX} ${faceRadiusY * 0.8} 0 0 1 ${center} ${center - faceRadiusY}
                 Z"
              fill="${colors.face}" stroke="none"/>
    `;

    // Ears (simple ellipses on sides of face)
    const earsHTML = `
        <ellipse cx="${earLeft}" cy="${earY}" rx="${earR * 0.6}" ry="${earR}" fill="${colors.face}" stroke="${colors.features}" stroke-width="1.5"/>
        <ellipse cx="${earRight}" cy="${earY}" rx="${earR * 0.6}" ry="${earR}" fill="${colors.face}" stroke="${colors.features}" stroke-width="1.5"/>
    `;

    // Calculate pupil positions with gaze offset
    const pupilLeftX = eyeLeft + (eyeRx * pupilOffsetX);
    const pupilLeftY = eyeY + (eyeRyLeft * pupilOffsetY);
    const pupilRightX = eyeRight + (eyeRx * pupilOffsetX);
    const pupilRightY = eyeY + (eyeRyRight * pupilOffsetY);

    // Eyes (ellipses with pupils)
    const eyesHTML = `
        <!-- Left eye -->
        <ellipse cx="${eyeLeft}" cy="${eyeY}" rx="${eyeRx}" ry="${eyeRyLeft}" fill="white" stroke="${colors.features}" stroke-width="1.5"/>
        <circle cx="${pupilLeftX}" cy="${pupilLeftY}" r="${pupilR}" fill="${colors.features}"/>
        <!-- Right eye -->
        <ellipse cx="${eyeRight}" cy="${eyeY}" rx="${eyeRx}" ry="${eyeRyRight}" fill="white" stroke="${colors.features}" stroke-width="1.5"/>
        <circle cx="${pupilRightX}" cy="${pupilRightY}" r="${pupilR}" fill="${colors.features}"/>
    `;

    // Eyebrows (curved paths with cubic bezier for more complex shapes)
    const browCurveDepth = browLength * eyebrowCurve;
    const browsHTML = `
        <!-- Left eyebrow -->
        <path d="M ${browLeft - browLength / 2} ${browY + browAngleOffset} C ${browLeft - browLength / 4} ${browY - browCurveDepth} ${browLeft + browLength / 4} ${browY - browCurveDepth} ${browLeft + browLength / 2} ${browY - browAngleOffset}"
              fill="none" stroke="${colors.features}" stroke-width="3" stroke-linecap="round"/>
        <!-- Right eyebrow -->
        <path d="M ${browRight - browLength / 2} ${browY - browAngleOffset} C ${browRight - browLength / 4} ${browY - browCurveDepth} ${browRight + browLength / 4} ${browY - browCurveDepth} ${browRight + browLength / 2} ${browY + browAngleOffset}"
              fill="none" stroke="${colors.features}" stroke-width="3" stroke-linecap="round"/>
    `;

    // Nose (filled triangle with nostrils)
    const noseTopY = noseY - noseLen / 2;
    const noseBottomY = noseY + noseLen / 2;
    const nostrilR = size * nostrilSize;
    const nostrilY = noseBottomY - nostrilR * 0.5;
    const nostrilOffset = noseW * 0.35;
    const noseHTML = `
        <path d="M ${center} ${noseTopY} L ${center - noseW / 2} ${noseBottomY} L ${center + noseW / 2} ${noseBottomY} Z"
              fill="${colors.face}" stroke="${colors.features}" stroke-width="1.5"/>
        <!-- Nostrils -->
        <ellipse cx="${center - nostrilOffset}" cy="${nostrilY}" rx="${nostrilR}" ry="${nostrilR * 0.7}" fill="${colors.features}"/>
        <ellipse cx="${center + nostrilOffset}" cy="${nostrilY}" rx="${nostrilR}" ry="${nostrilR * 0.7}" fill="${colors.features}"/>
    `;

    // Mouth (with upper and lower lips)
    const lipH = size * lipThickness;
    const upperLipY = mouthY - lipH / 2;
    const lowerLipY = mouthY + lipH / 2;
    const lipCurveControl = mouthY + mouthCurveY;
    const mouthHTML = `
        <!-- Upper lip (M-shaped cupid's bow) -->
        <path d="M ${center - mouthW / 2} ${upperLipY} Q ${center - mouthW / 4} ${upperLipY - lipH * 0.3} ${center} ${upperLipY - lipH * 0.2} Q ${center + mouthW / 4} ${upperLipY - lipH * 0.3} ${center + mouthW / 2} ${upperLipY}"
              stroke="${colors.features}" stroke-width="2" fill="none" stroke-linecap="round"/>
        <!-- Lower lip (curved) -->
        <path d="M ${center - mouthW / 2} ${lowerLipY} Q ${center} ${lipCurveControl + lipH} ${center + mouthW / 2} ${lowerLipY}"
              stroke="${colors.features}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <!-- Mouth line -->
        <path d="M ${center - mouthW / 2} ${mouthY} Q ${center} ${lipCurveControl} ${center + mouthW / 2} ${mouthY}"
              stroke="${colors.features}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
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
