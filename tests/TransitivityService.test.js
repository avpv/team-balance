// tests/TransitivityService.test.js
//
// Tests for TransitivityService - contradiction (cycle) detection
// Run: node tests/TransitivityService.test.js

// ── Minimal mock of PlayerRepository ────────────────────────────────
class MockPlayerRepository {
    constructor(players) {
        this._players = players;
    }
    getByPosition(position) {
        return this._players.filter(p => p.positions.includes(position));
    }
}

// ── Import TransitivityService (ESM → inline copy for Node test) ────
// Since the project uses ES modules without a bundler, we inline the class
// to keep the test runnable with plain `node`.

class TransitivityService {
    constructor(playerRepository) {
        this.playerRepository = playerRepository;
    }

    detectViolations(position) {
        const players = this.playerRepository.getByPosition(position);
        if (players.length < 3) return [];

        const wins = this._buildWinGraph(players, position);
        const playerMap = new Map(players.map(p => [p.id, p]));

        const violations = [];
        const seen = new Set();
        const playerIds = players.map(p => p.id);

        for (let i = 0; i < playerIds.length; i++) {
            for (let j = i + 1; j < playerIds.length; j++) {
                for (let k = j + 1; k < playerIds.length; k++) {
                    const a = playerIds[i];
                    const b = playerIds[j];
                    const c = playerIds[k];

                    const cycle = this._findCycleInTriplet(a, b, c, wins);
                    if (cycle) {
                        const key = cycle.map(id => id).sort().join('|');
                        if (!seen.has(key)) {
                            seen.add(key);
                            violations.push({
                                players: cycle.map(id => ({
                                    id,
                                    name: playerMap.get(id)?.name || id
                                })),
                                cycle: cycle.map(id => playerMap.get(id)?.name || id).join(' > ') +
                                    ' > ' + (playerMap.get(cycle[0])?.name || cycle[0])
                            });
                        }
                    }
                }
            }
        }

        return violations;
    }

    wouldCreateViolation(winnerId, loserId, position) {
        const players = this.playerRepository.getByPosition(position);
        if (players.length < 3) return null;

        const wins = this._buildWinGraph(players, position);
        const playerMap = new Map(players.map(p => [p.id, p]));

        if (!wins.has(winnerId)) wins.set(winnerId, new Set());
        wins.get(winnerId).add(loserId);

        const cycle = this._findCycleThroughEdge(winnerId, loserId, wins);

        if (cycle) {
            return {
                players: cycle.map(id => ({
                    id,
                    name: playerMap.get(id)?.name || id
                })),
                cycle: cycle.map(id => playerMap.get(id)?.name || id).join(' > ') +
                    ' > ' + (playerMap.get(cycle[0])?.name || cycle[0])
            };
        }

        return null;
    }

    getViolationCounts(positions) {
        const counts = {};
        for (const pos of positions) {
            counts[pos] = this.detectViolations(pos).length;
        }
        return counts;
    }

    _buildWinGraph(players, position) {
        const wins = new Map();
        const nameToId = new Map(players.map(p => [p.name, p.id]));

        for (const player of players) {
            const beaten = player.winsAgainst?.[position] || [];
            if (beaten.length === 0) continue;

            const winnerWins = wins.get(player.id) || new Set();

            for (const loserName of beaten) {
                const loserId = nameToId.get(loserName);
                if (loserId) {
                    winnerWins.add(loserId);
                }
            }

            if (winnerWins.size > 0) {
                wins.set(player.id, winnerWins);
            }
        }

        return wins;
    }

    _findCycleInTriplet(a, b, c, wins) {
        const aWins = wins.get(a) || new Set();
        const bWins = wins.get(b) || new Set();
        const cWins = wins.get(c) || new Set();

        if (aWins.has(b) && bWins.has(c) && cWins.has(a)) {
            return [a, b, c];
        }
        if (aWins.has(c) && cWins.has(b) && bWins.has(a)) {
            return [a, c, b];
        }

        return null;
    }

    _findCycleThroughEdge(winnerId, loserId, wins) {
        const loserWins = wins.get(loserId) || new Set();

        for (const xId of loserWins) {
            if (xId === winnerId || xId === loserId) continue;
            const xWins = wins.get(xId) || new Set();
            if (xWins.has(winnerId)) {
                return [winnerId, loserId, xId];
            }
        }

        return null;
    }
}

// ── Test helpers ────────────────────────────────────────────────────
let passed = 0;
let failed = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`  ✓ ${message}`);
        passed++;
    } else {
        console.error(`  ✗ ${message}`);
        failed++;
    }
}

function makePlayer(id, name, position, winsAgainst = []) {
    return {
        id,
        name,
        positions: [position],
        ratings: { [position]: 1500 },
        comparisons: { [position]: 0 },
        comparedWith: { [position]: [] },
        winsAgainst: { [position]: winsAgainst },
        rd: { [position]: 350 },
        volatility: { [position]: 0.06 }
    };
}

// ── Tests ───────────────────────────────────────────────────────────

console.log('\n=== TransitivityService — Contradiction Detection Tests ===\n');

// ─── Test 1: The exact scenario from the task ───────────────────────
console.log('Test 1: Cycle A→B→C→A (rock-paper-scissors)');
{
    const players = [
        makePlayer('1', 'A', 'S', ['B']),   // A beats B
        makePlayer('2', 'B', 'S', ['C']),   // B beats C
        makePlayer('3', 'C', 'S', ['A']),   // C beats A  ← cycle!
    ];
    const repo = new MockPlayerRepository(players);
    const svc = new TransitivityService(repo);

    const violations = svc.detectViolations('S');

    assert(violations.length === 1, `Found exactly 1 violation (got ${violations.length})`);
    assert(
        violations[0].cycle.includes('A') &&
        violations[0].cycle.includes('B') &&
        violations[0].cycle.includes('C'),
        `Cycle mentions all three players: "${violations[0]?.cycle}"`
    );
    console.log(`  → Detected cycle: ${violations[0]?.cycle}`);
}

// ─── Test 2: No cycle — linear chain A→B→C ──────────────────────────
console.log('\nTest 2: No cycle — linear chain A→B, B→C (no contradiction)');
{
    const players = [
        makePlayer('1', 'A', 'S', ['B']),   // A beats B
        makePlayer('2', 'B', 'S', ['C']),   // B beats C
        makePlayer('3', 'C', 'S', []),       // C beats nobody
    ];
    const repo = new MockPlayerRepository(players);
    const svc = new TransitivityService(repo);

    const violations = svc.detectViolations('S');

    assert(violations.length === 0, `No violations found (got ${violations.length})`);
}

// ─── Test 3: wouldCreateViolation — predict before recording ────────
console.log('\nTest 3: wouldCreateViolation — predicts cycle BEFORE recording');
{
    // A beats B, B beats C — no cycle yet
    const players = [
        makePlayer('1', 'A', 'S', ['B']),
        makePlayer('2', 'B', 'S', ['C']),
        makePlayer('3', 'C', 'S', []),
    ];
    const repo = new MockPlayerRepository(players);
    const svc = new TransitivityService(repo);

    // What if C beats A? Should predict a violation!
    const violation = svc.wouldCreateViolation('3', '1', 'S');
    assert(violation !== null, `Predicted violation when C would beat A`);
    console.log(`  → Predicted cycle: ${violation?.cycle}`);

    // What if A beats C? Should NOT create a violation
    const noViolation = svc.wouldCreateViolation('1', '3', 'S');
    assert(noViolation === null, `No violation predicted when A would beat C`);
}

// ─── Test 4: Less than 3 players — edge case ───────────────────────
console.log('\nTest 4: Edge case — fewer than 3 players');
{
    const players = [
        makePlayer('1', 'A', 'S', ['B']),
        makePlayer('2', 'B', 'S', []),
    ];
    const repo = new MockPlayerRepository(players);
    const svc = new TransitivityService(repo);

    const violations = svc.detectViolations('S');
    assert(violations.length === 0, `No violations with only 2 players`);

    const wouldCreate = svc.wouldCreateViolation('2', '1', 'S');
    assert(wouldCreate === null, `wouldCreateViolation returns null with 2 players`);
}

// ─── Test 5: Reverse cycle A→C→B→A ─────────────────────────────────
console.log('\nTest 5: Reverse cycle A→C→B→A');
{
    const players = [
        makePlayer('1', 'A', 'S', ['C']),   // A beats C
        makePlayer('2', 'B', 'S', ['A']),   // B beats A
        makePlayer('3', 'C', 'S', ['B']),   // C beats B  ← cycle A→C→B→A
    ];
    const repo = new MockPlayerRepository(players);
    const svc = new TransitivityService(repo);

    const violations = svc.detectViolations('S');
    assert(violations.length === 1, `Found 1 violation in reverse cycle (got ${violations.length})`);
    console.log(`  → Detected cycle: ${violations[0]?.cycle}`);
}

// ─── Test 6: Multiple independent cycles with 4+ players ───────────
console.log('\nTest 6: Two independent cycles among 6 players');
{
    const players = [
        // Cycle 1: A→B→C→A
        makePlayer('1', 'A', 'S', ['B']),
        makePlayer('2', 'B', 'S', ['C']),
        makePlayer('3', 'C', 'S', ['A']),
        // Cycle 2: D→E→F→D
        makePlayer('4', 'D', 'S', ['E']),
        makePlayer('5', 'E', 'S', ['F']),
        makePlayer('6', 'F', 'S', ['D']),
    ];
    const repo = new MockPlayerRepository(players);
    const svc = new TransitivityService(repo);

    const violations = svc.detectViolations('S');
    assert(violations.length === 2, `Found 2 violations (got ${violations.length})`);
    violations.forEach((v, i) => console.log(`  → Cycle ${i + 1}: ${v.cycle}`));
}

// ─── Test 7: getViolationCounts ─────────────────────────────────────
console.log('\nTest 7: getViolationCounts across positions');
{
    const players = [
        // Cycle at position S
        makePlayer('1', 'A', 'S', ['B']),
        makePlayer('2', 'B', 'S', ['C']),
        makePlayer('3', 'C', 'S', ['A']),
    ];
    const repo = new MockPlayerRepository(players);
    const svc = new TransitivityService(repo);

    const counts = svc.getViolationCounts(['S', 'OH']);
    assert(counts['S'] === 1, `Position S has 1 violation`);
    assert(counts['OH'] === 0, `Position OH has 0 violations (no players)`);
}

// ─── Test 8: No winsAgainst data — no false positives ───────────────
console.log('\nTest 8: Players with no winsAgainst data — no false positives');
{
    const players = [
        makePlayer('1', 'A', 'S', []),
        makePlayer('2', 'B', 'S', []),
        makePlayer('3', 'C', 'S', []),
    ];
    const repo = new MockPlayerRepository(players);
    const svc = new TransitivityService(repo);

    const violations = svc.detectViolations('S');
    assert(violations.length === 0, `No false positives when no results recorded`);
}

// ─── Summary ────────────────────────────────────────────────────────
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed out of ${passed + failed} assertions`);
console.log('='.repeat(50));

if (failed > 0) {
    process.exit(1);
}
