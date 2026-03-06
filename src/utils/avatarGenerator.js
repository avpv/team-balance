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
 * @version 7.0.0 - Improved distinctiveness via FNV-1a hash, Mulberry32 PRNG, continuous color hues, wider parameter ranges
 */

/**
 * Mulberry32 - high-quality 32-bit PRNG seeded from a number.
 * Returns a function that produces successive pseudo-random 0-1 floats.
 * @param {number} seed
 * @returns {function(): number}
 */
function mulberry32(seed) {
    return function () {
        seed |= 0;
        seed = (seed + 0x6D2B79F5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/**
 * Convert a player name into a well-distributed 32-bit seed.
 * Uses FNV-1a which has excellent avalanche properties – a single
 * character change flips roughly half the output bits.
 * @param {string} str - Input string (player name)
 * @returns {number} - Hash seed
 */
function hashString(str) {
    let h = 0x811c9dc5; // FNV offset basis
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 0x01000193); // FNV prime
    }
    return h >>> 0; // ensure unsigned
}

/**
 * Get a value from hash within a range using a seeded PRNG.
 * Each (hash, index) pair produces an independent, well-distributed value.
 * @param {function(): number} rng - PRNG function (mulberry32 instance)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Value in range
 */
function getHashValue(rng, min, max) {
    return min + rng() * (max - min);
}

/**
 * Get avatar color scheme using PRNG (Academic/Scientific style).
 * Hue is quantised to 15° steps (24 perceptually distinct buckets).
 * @param {function(): number} rng - PRNG function (mulberry32 instance)
 * @returns {object} - Color scheme with background, face, and features
 */
function getColorScheme(rng) {
    // 24 perceptually distinct hue buckets (every 15°)
    const hue = Math.floor(rng() * 24) * 15;
    const satBg = 40 + rng() * 25;   // 40-65
    const satFace = 30 + rng() * 20;  // 30-50
    const satFeat = 45 + rng() * 25;  // 45-70
    return {
        bg: `hsl(${hue}, ${satBg.toFixed(0)}%, 91%)`,
        face: `hsl(${hue}, ${satFace.toFixed(0)}%, 77%)`,
        features: `hsl(${hue}, ${satFeat.toFixed(0)}%, 29%)`
    };
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
    // Create a dedicated PRNG stream from the hash – every call to rng()
    // yields an independent, well-distributed value in [0, 1).
    const rng = mulberry32(hash);
    const colors = getColorScheme(rng);

    // === 19 STATISTICAL PARAMETERS (Chernoff Face Variables) ===
    // All parameters are generated independently (fixed rng consumption order).
    // Geometric constraints are applied later in the DIMENSIONS section so
    // that the PRNG stream stays uncorrelated across all 19 variables.

    const headSize      = getHashValue(rng, 0.62, 0.88);   // V1: head radius
    const faceAspect    = getHashValue(rng, 0.75, 1.25);   // V2: width/height ratio
    const chinShape     = getHashValue(rng, 0.0, 1.0);     // V19: round→pointed
    const eyeSize       = getHashValue(rng, 0.05, 0.15);   // V3: eye horiz radius
    const eyeSeparation = getHashValue(rng, 0.18, 0.40);   // V4: distance between eyes
    const eyeHeightLeft = getHashValue(rng, 0.50, 1.1);    // V12: left eye vert ratio
    const eyeHeightRight = getHashValue(rng, 0.50, 1.1);   // V13: right eye vert ratio
    const pupilSize     = getHashValue(rng, 0.25, 0.65);   // V5: pupil/eye ratio
    const pupilOffsetX  = getHashValue(rng, -0.30, 0.30);  // V14: horizontal gaze
    const pupilOffsetY  = getHashValue(rng, -0.20, 0.20);  // V15: vertical gaze
    const eyebrowAngle  = getHashValue(rng, -0.20, 0.20);  // V6: brow tilt
    const eyebrowCurve  = getHashValue(rng, 0.10, 0.55);   // V16: brow arc depth
    const noseLength    = getHashValue(rng, 0.4, 1.6);     // V7: nose height
    const noseWidth     = getHashValue(rng, 0.025, 0.09);  // V11: nose base width
    const nostrilSize   = getHashValue(rng, 0.008, 0.028); // V17: nostril radius
    // V8: Mouth curvature – always consume the rng slot for stream stability
    const mouthCurveHash = getHashValue(rng, -0.10, 0.14);
    const mouthCurve = elo !== null ? eloToSmile(elo) : mouthCurveHash;
    const mouthWidth    = getHashValue(rng, 0.22, 0.52);   // V9: mouth width
    const lipThickness  = getHashValue(rng, 0.007, 0.028); // V18: lip fullness
    const earSize       = getHashValue(rng, 0.06, 0.16);   // V10: ear radius

    // === CALCULATE POSITIONS AND DIMENSIONS ===
    // Geometric safety clamps applied here (not above) to keep PRNG independent.

    // Face dimensions – clamp so face + ears fit inside the viewBox
    const faceRadius = center * headSize;
    const faceRadiusX = Math.min(faceRadius * faceAspect, center * 0.92);
    const faceRadiusY = faceRadius;

    // Eye positions and dimensions
    const eyeY = center * 0.85;
    const eyeLeft = center - (center * eyeSeparation);
    const eyeRight = center + (center * eyeSeparation);
    const eyeRx = size * eyeSize; // Horizontal radius
    const eyeRyLeft = eyeRx * eyeHeightLeft; // Vertical radius for left eye
    const eyeRyRight = eyeRx * eyeHeightRight; // Vertical radius for right eye
    // Clamp pupil radius so it fits inside both eyes vertically
    const pupilR = Math.min(eyeRx * pupilSize, Math.min(eyeRyLeft, eyeRyRight) * 0.85);

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
    // Clamp ear radius so ears don't overflow the viewBox
    const maxEarR = (center - faceRadiusX) / 0.6;  // earLeft - earR*0.6 ≥ 0
    const earR = Math.min(size * earSize, maxEarR * 0.9);

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

    // Calculate pupil positions with gaze offset.
    // Clamp so the pupil circle stays inside the eye ellipse.
    const maxOfsX = Math.max(0, 1 - pupilSize) * 0.85;
    const maxOfsY = Math.max(0, 1 - pupilSize) * 0.85;
    const clampedOfsX = Math.max(-maxOfsX, Math.min(maxOfsX, pupilOffsetX));
    const clampedOfsY = Math.max(-maxOfsY, Math.min(maxOfsY, pupilOffsetY));
    const pupilLeftX = eyeLeft + (eyeRx * clampedOfsX);
    const pupilLeftY = eyeY + (eyeRyLeft * clampedOfsY);
    const pupilRightX = eyeRight + (eyeRx * clampedOfsX);
    const pupilRightY = eyeY + (eyeRyRight * clampedOfsY);

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
