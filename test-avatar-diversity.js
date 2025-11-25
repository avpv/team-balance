// Test to verify enhanced diversity of avatars
import { generateAvatar } from './src/utils/avatarGenerator.js';

console.log('🎨 Testing Avatar Diversity and New Features...\n');

// Test 1: Check for new features in generated SVG
console.log('Test 1: Checking for new expressive features');
const avatar = generateAvatar('TestUser', 200);

const newFeatures = [
    { name: 'Nostrils', pattern: /<ellipse[^>]*fill="[^"]*"[^>]*\/>/g, minCount: 4 }, // eyes + nostrils
    { name: 'Cubic Bezier eyebrows', pattern: /<path[^>]*C\s+\d+/g, minCount: 2 },
    { name: 'Multiple lip lines', pattern: /<!--[^>]*lip/gi, minCount: 3 },
    { name: 'Complex face shape (path)', pattern: /<path[^>]*d="M[^"]*A[^"]*Q/g, minCount: 1 },
];

let allPassed = true;
newFeatures.forEach(feature => {
    const matches = avatar.match(feature.pattern);
    const count = matches ? matches.length : 0;
    if (count >= feature.minCount) {
        console.log(`✅ ${feature.name}: found ${count} (expected ≥${feature.minCount})`);
    } else {
        console.log(`❌ ${feature.name}: found ${count} (expected ≥${feature.minCount})`);
        allPassed = false;
    }
});

// Test 2: Verify diversity across many faces
console.log('\nTest 2: Verifying diversity across 50 faces');
const names = Array.from({ length: 50 }, (_, i) => `User${i}`);
const avatars = names.map(name => generateAvatar(name, 96));
const uniqueCount = new Set(avatars).size;
const diversityRatio = uniqueCount / names.length;

if (diversityRatio === 1.0) {
    console.log(`✅ Perfect diversity: ${uniqueCount}/${names.length} unique faces (${(diversityRatio * 100).toFixed(1)}%)`);
} else {
    console.log(`❌ Low diversity: ${uniqueCount}/${names.length} unique faces (${(diversityRatio * 100).toFixed(1)}%)`);
    allPassed = false;
}

// Test 3: Check visual variation in specific features
console.log('\nTest 3: Checking variation in specific features');
const features = {
    'Pupil positions': /cx="\d+\.?\d*" cy="\d+\.?\d*" r="\d+\.?\d*" fill="[^"]*features/g,
    'Eyebrow curves': /C\s+[\d.]+\s+[\d.]+/g,
    'Chin shapes': /Q\s+[\d.]+\s+[\d.]+.*chinPoint/g,
};

const variations = {};
Object.entries(features).forEach(([featureName, pattern]) => {
    const allMatches = avatars.map(svg => {
        const matches = svg.match(pattern);
        return matches ? matches.join('|') : '';
    });
    const uniqueVariations = new Set(allMatches).size;
    variations[featureName] = uniqueVariations;

    // We expect at least 30% of faces to have unique variations for each feature
    const minExpected = Math.floor(names.length * 0.3);
    if (uniqueVariations >= minExpected) {
        console.log(`✅ ${featureName}: ${uniqueVariations} unique variations (≥${minExpected})`);
    } else {
        console.log(`⚠️  ${featureName}: ${uniqueVariations} unique variations (<${minExpected})`);
    }
});

// Test 4: ELO affects expression
console.log('\nTest 4: Testing ELO impact on expressions');
const testName = 'EloTest';
const lowElo = generateAvatar(testName, 96, 1000);
const midElo = generateAvatar(testName, 96, 1500);
const highElo = generateAvatar(testName, 96, 2000);

if (lowElo !== midElo && midElo !== highElo) {
    console.log('✅ ELO rating affects facial expression (mouth curvature)');
} else {
    console.log('❌ ELO rating does not affect facial expression');
    allPassed = false;
}

// Test 5: File size reasonable
console.log('\nTest 5: Checking SVG file size');
const avgSize = avatars.reduce((sum, svg) => sum + svg.length, 0) / avatars.length;
const sizeKB = (avgSize / 1024).toFixed(2);
if (avgSize < 5000) {
    console.log(`✅ Average SVG size: ${sizeKB} KB (reasonable)`);
} else {
    console.log(`⚠️  Average SVG size: ${sizeKB} KB (might be too large)`);
}

// Final summary
console.log('\n' + '='.repeat(60));
if (allPassed) {
    console.log('✅ ALL DIVERSITY TESTS PASSED!');
    console.log('🎨 Avatars show excellent diversity and expressiveness');
    console.log(`📊 Statistics:`);
    console.log(`   - Unique faces: ${uniqueCount}/${names.length}`);
    console.log(`   - Average size: ${sizeKB} KB`);
    console.log(`   - New features: All implemented`);
} else {
    console.log('❌ SOME DIVERSITY TESTS FAILED');
    process.exit(1);
}
