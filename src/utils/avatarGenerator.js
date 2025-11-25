/**
 * Avatar Generator - Chernoff Face SVG Avatar Creation
 *
 * Generates unique Chernoff face avatars based on player names.
 * Same name always produces the same face (deterministic).
 * Different facial features represent player characteristics.
 *
 * @version 2.0.0
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
 * Get skin tone color from hash
 * @param {number} hash - Hash value
 * @returns {string} - HSL color string
 */
function getSkinTone(hash) {
    const tones = [
        'hsl(30, 55%, 75%)',   // Light
        'hsl(25, 50%, 65%)',   // Medium-light
        'hsl(20, 45%, 55%)',   // Medium
        'hsl(15, 40%, 45%)',   // Medium-dark
        'hsl(25, 60%, 70%)',   // Peachy
        'hsl(22, 48%, 60%)',   // Tan
    ];
    return tones[hash % tones.length];
}

/**
 * Get hair color from hash
 * @param {number} hash - Hash value
 * @returns {string} - HSL color string
 */
function getHairColor(hash) {
    const colors = [
        'hsl(25, 30%, 20%)',   // Dark brown
        'hsl(30, 25%, 30%)',   // Brown
        'hsl(35, 35%, 40%)',   // Light brown
        'hsl(40, 50%, 50%)',   // Blonde
        'hsl(0, 0%, 15%)',     // Black
        'hsl(15, 60%, 35%)',   // Auburn
    ];
    return colors[(hash >> 3) % colors.length];
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
 * Generate Chernoff face SVG based on hash and optional ELO
 * @param {number} hash - Hash value
 * @param {number} size - Avatar size
 * @param {number|null} elo - Optional ELO rating for smile
 * @returns {string} - SVG face
 */
function generateChernoffFace(hash, size, elo = null) {
    const center = size / 2;

    // Extract facial features from hash (deterministic)
    const faceWidth = getHashValue(hash, 1, 0.75, 0.95);
    const faceHeight = getHashValue(hash, 2, 0.8, 1.0);
    const eyeSize = getHashValue(hash, 3, 0.08, 0.14);
    const eyeSpacing = getHashValue(hash, 4, 0.25, 0.35);
    const eyebrowAngle = getHashValue(hash, 5, -15, 15);
    const eyebrowThickness = getHashValue(hash, 6, 2, 4);
    const noseWidth = getHashValue(hash, 7, 0.06, 0.12);
    const noseHeight = getHashValue(hash, 8, 0.12, 0.2);
    const mouthWidth = getHashValue(hash, 9, 0.25, 0.4);
    // Mouth curve is now based on ELO rating if provided
    const mouthCurve = elo !== null ? eloToSmile(elo) : getHashValue(hash, 10, -0.08, 0.12);
    const earSize = getHashValue(hash, 11, 0.12, 0.18);

    const skinTone = getSkinTone(hash);
    const hairColor = getHairColor(hash);

    // Calculate positions
    const faceW = center * faceWidth;
    const faceH = center * faceHeight;
    const eyeY = center * 0.75;
    const eyeLeft = center - (center * eyeSpacing);
    const eyeRight = center + (center * eyeSpacing);
    const eyeR = size * eyeSize;

    const noseY = center * 1.05;
    const noseW = size * noseWidth;
    const noseH = size * noseHeight;

    const mouthY = center * 1.35;
    const mouthW = size * mouthWidth;
    const mouthCurveY = size * mouthCurve;

    const earW = size * earSize * 0.5;
    const earH = size * earSize;
    const earY = center * 0.9;

    return `
        <!-- Background -->
        <rect width="${size}" height="${size}" fill="hsl(200, 25%, 85%)"/>

        <!-- Hair (top) -->
        <ellipse cx="${center}" cy="${center * 0.65}" rx="${faceW * 1.1}" ry="${faceH * 0.5}" fill="${hairColor}"/>

        <!-- Ears -->
        <ellipse cx="${center - faceW * 1.05}" cy="${earY}" rx="${earW}" ry="${earH}" fill="${skinTone}" stroke="hsl(25, 30%, 40%)" stroke-width="1"/>
        <ellipse cx="${center + faceW * 1.05}" cy="${earY}" rx="${earW}" ry="${earH}" fill="${skinTone}" stroke="hsl(25, 30%, 40%)" stroke-width="1"/>

        <!-- Face -->
        <ellipse cx="${center}" cy="${center}" rx="${faceW}" ry="${faceH}" fill="${skinTone}" stroke="hsl(25, 30%, 40%)" stroke-width="1.5"/>

        <!-- Eyes -->
        <circle cx="${eyeLeft}" cy="${eyeY}" r="${eyeR}" fill="white" stroke="hsl(0, 0%, 20%)" stroke-width="1.5"/>
        <circle cx="${eyeRight}" cy="${eyeY}" r="${eyeR}" fill="white" stroke="hsl(0, 0%, 20%)" stroke-width="1.5"/>
        <circle cx="${eyeLeft}" cy="${eyeY}" r="${eyeR * 0.5}" fill="hsl(200, 40%, 30%)"/>
        <circle cx="${eyeRight}" cy="${eyeY}" r="${eyeR * 0.5}" fill="hsl(200, 40%, 30%)"/>
        <circle cx="${eyeLeft + eyeR * 0.2}" cy="${eyeY - eyeR * 0.2}" r="${eyeR * 0.25}" fill="white"/>
        <circle cx="${eyeRight + eyeR * 0.2}" cy="${eyeY - eyeR * 0.2}" r="${eyeR * 0.25}" fill="white"/>

        <!-- Eyebrows -->
        <line x1="${eyeLeft - eyeR * 1.2}" y1="${eyeY - eyeR * 1.3}" x2="${eyeLeft + eyeR * 1.2}" y2="${eyeY - eyeR * 1.3 + eyebrowAngle * 0.5}"
              stroke="hsl(25, 30%, 25%)" stroke-width="${eyebrowThickness}" stroke-linecap="round"/>
        <line x1="${eyeRight - eyeR * 1.2}" y1="${eyeY - eyeR * 1.3 - eyebrowAngle * 0.5}" x2="${eyeRight + eyeR * 1.2}" y2="${eyeY - eyeR * 1.3}"
              stroke="hsl(25, 30%, 25%)" stroke-width="${eyebrowThickness}" stroke-linecap="round"/>

        <!-- Nose -->
        <ellipse cx="${center}" cy="${noseY}" rx="${noseW}" ry="${noseH}" fill="hsl(25, 40%, 50%)" opacity="0.6"/>
        <circle cx="${center - noseW * 0.5}" cy="${noseY + noseH * 0.3}" r="${noseW * 0.4}" fill="hsl(25, 30%, 35%)" opacity="0.5"/>
        <circle cx="${center + noseW * 0.5}" cy="${noseY + noseH * 0.3}" r="${noseW * 0.4}" fill="hsl(25, 30%, 35%)" opacity="0.5"/>

        <!-- Mouth -->
        <path d="M ${center - mouthW / 2} ${mouthY} Q ${center} ${mouthY + mouthCurveY} ${center + mouthW / 2} ${mouthY}"
              stroke="hsl(0, 40%, 35%)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
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
