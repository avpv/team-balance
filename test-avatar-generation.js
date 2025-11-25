// Simple test to verify avatar generation works
import { generateAvatar } from './src/utils/avatarGenerator.js';

console.log('🧪 Testing Avatar Generation...\n');

// Test 1: Basic generation
console.log('Test 1: Basic avatar generation');
const avatar1 = generateAvatar('TestUser', 96);
if (avatar1 && avatar1.includes('<svg') && avatar1.includes('</svg>')) {
    console.log('✅ Basic generation works');
} else {
    console.log('❌ Basic generation failed');
    process.exit(1);
}

// Test 2: With ELO rating
console.log('\nTest 2: Avatar with ELO rating');
const avatar2 = generateAvatar('TestUser', 96, 1500);
if (avatar2 && avatar2.includes('<svg') && avatar2.includes('</svg>')) {
    console.log('✅ Generation with ELO works');
} else {
    console.log('❌ Generation with ELO failed');
    process.exit(1);
}

// Test 3: Check for new elements
console.log('\nTest 3: Checking for new expressive elements');
const checks = [
    { name: 'Triangular nose (path)', pattern: /<path[^>]*d="M[^"]*Z"[^>]*fill=/ },
    { name: 'Curved eyebrows (path Q)', pattern: /<path[^>]*Q/ },
    { name: 'Elliptical eyes', pattern: /<ellipse[^>]*fill="white"/ },
];

let allPassed = true;
checks.forEach(check => {
    if (check.pattern.test(avatar1)) {
        console.log(`✅ ${check.name} found`);
    } else {
        console.log(`❌ ${check.name} NOT found`);
        allPassed = false;
    }
});

// Test 4: Different names produce different faces
console.log('\nTest 4: Uniqueness test');
const names = ['Alice', 'Bob', 'Charlie'];
const avatars = names.map(name => generateAvatar(name, 96));
const unique = new Set(avatars);
if (unique.size === names.length) {
    console.log(`✅ Different names produce different faces (${unique.size}/${names.length})`);
} else {
    console.log(`❌ Not all faces are unique (${unique.size}/${names.length})`);
    allPassed = false;
}

// Test 5: Same name produces same face
console.log('\nTest 5: Determinism test');
const face1 = generateAvatar('John', 96, 1500);
const face2 = generateAvatar('John', 96, 1500);
if (face1 === face2) {
    console.log('✅ Same name produces same face (deterministic)');
} else {
    console.log('❌ Same name produces different faces');
    allPassed = false;
}

// Final summary
console.log('\n' + '='.repeat(50));
if (allPassed) {
    console.log('✅ ALL TESTS PASSED!');
    console.log('🎨 Expressive Chernoff faces are working correctly');
} else {
    console.log('❌ SOME TESTS FAILED');
    process.exit(1);
}
