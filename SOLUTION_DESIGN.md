# Идеальное решение: Полный редизайн

## Философия

Не латать дыры, а решить **корневые причины**. Корневых причин три:
1. **Рейтинг**: два несовместимых алгоритма склеены скотчем
2. **Оптимизатор**: алгоритмы оптимизируют не ту функцию
3. **Свапы**: операторы мутации неэффективны

Всё остальное — следствия.

---

## БЛОК 1: РЕЙТИНГОВАЯ СИСТЕМА (team-balance)

### Проблема

ELO-формула обновляет рейтинг. Glicko-2 формула обновляет RD и volatility. Но Glicko-2 внутри пересчитывает своё собственное delta, которое расходится с фактическим изменением рейтинга. RD-based K-multiplier дублирует то, что Glicko-2 уже делает через формулу newPhi. Base 10 и base e дают разные expected scores.

### Идеальное решение: Полный Glicko-2

**Почему:** Glicko-2 — строго более мощная система. Она уже реализована на 80%. Нужно лишь дать ей управлять и рейтингом, а не только RD.

#### Шаг 1: Единая формула обновления рейтинга

Заменить в `calculateRatingChange`:

```js
// БЫЛО (два мира):
const winnerChange = symmetricK * (1 - winnerExpected);     // ELO формула
const winnerGlicko = this.calculateGlicko2Update(...);       // Glicko-2 формула

// СТАЛО (один мир):
const result = this.calculateFullGlicko2Update(
    winnerRating, winnerRd, winnerVol,
    loserRating, loserRd, loserVol,
    score  // 1.0 для победы, 0.0 для поражения, 0.5 для ничьей
);
// result = { newRating, newRd, newVolatility }
```

Новый метод `calculateFullGlicko2Update`:

```js
calculateFullGlicko2Update(rating, rd, vol, oppRating, oppRd, oppVol, score) {
    // Step 1: Convert to Glicko-2 scale
    const mu = this.toGlicko2Scale(rating);
    const phi = this.rdToGlicko2Scale(rd);
    const muJ = this.toGlicko2Scale(oppRating);
    const phiJ = this.rdToGlicko2Scale(oppRd);

    // Step 2: Compute v and delta (одна формула для всего)
    const gPhiJ = this.g(phiJ);
    const eMuJ = this.E(mu, muJ, phiJ);
    const v = 1 / (gPhiJ * gPhiJ * eMuJ * (1 - eMuJ));
    const delta = v * gPhiJ * (score - eMuJ);

    // Step 3: New volatility
    let newSigma = this.calculateNewVolatility(vol, phi, v, delta);
    newSigma = clamp(newSigma, MIN_VOL, MAX_VOL);

    // Step 4: New RD
    const phiStar = Math.sqrt(phi * phi + newSigma * newSigma);
    const newPhi = 1 / Math.sqrt(1 / (phiStar * phiStar) + 1 / v);

    // Step 5: New rating (Glicko-2 формула, НЕ ELO)
    const newMu = mu + newPhi * newPhi * gPhiJ * (score - eMuJ);

    // Step 6: Convert back
    return {
        newRating: Math.round(this.fromGlicko2Scale(newMu)),
        newRd: clamp(round1(this.rdFromGlicko2Scale(newPhi)), MIN_RD, MAX_RD),
        newVolatility: round4(newSigma)
    };
}
```

**Что это даёт:**
- Rating, RD и volatility обновляются **одной формулой**
- Нет рассогласования (P1 решена)
- Нет двойной компенсации (P2 решена) — K-factor вообще не нужен, Glicko-2 сам управляет величиной обновления через newPhi
- Единая base e (P3 решена)
- Pool adjustment не нужен (P4 решена) — RD уже адаптируется к количеству сравнений
- Cap на K не нужен (P5 решена) — Glicko-2 inherently bounded

#### Шаг 2: Упрощение `calculateExpectedScore`

Оставить только одну функцию:

```js
// Единственная формула expected score (Glicko-2 E())
calculateExpectedScore(playerRating, opponentRating, opponentRd) {
    const mu = this.toGlicko2Scale(playerRating);
    const muJ = this.toGlicko2Scale(opponentRating);
    const phiJ = this.rdToGlicko2Scale(opponentRd);
    return this.E(mu, muJ, phiJ);
}
```

Убрать: `calculateExpectedScoreWithRD`, `calculateKFactor`, `calculatePoolAdjustedKFactor`, `calculateEffectiveKFactor`.

#### Шаг 3: Сохранить damping и round-base

Damping (`getDampedRating`) и round-base (`getRoundBaseComparisons`) — ортогональные к Glicko-2 и решают реальную проблему order-dependence. Оставить как есть.

Damping применяется ДО expected score:
```js
const dampedRating = this.getDampedRating(rating, roundBaseComparisons);
const result = this.calculateFullGlicko2Update(
    dampedRating, rd, vol, oppDampedRating, oppRd, oppVol, score
);
// НО newRating применяется к РЕАЛЬНОМУ рейтингу, не к damped:
player.ratings[pos] = rating + (result.newRating - dampedRating);
```

Нет — это создаст новое рассогласование. Лучше:

```js
// Damping встроен в expected score, но рейтинг обновляется полностью:
const result = this.calculateFullGlicko2Update(
    rating, rd, vol, oppRating, oppRd, oppVol, score
);
// Damping теперь не нужен — Glicko-2 RD УЖЕ кодирует неопределённость.
// Новый игрок с RD=350 автоматически получает меньший вес в expected score
// через g(φ) функцию. Это и есть damping, но математически корректный.
```

**Вывод:** Damping можно убрать — Glicko-2 g(φ) делает то же самое, но правильно. Игрок с высоким RD (мало сравнений) уже получает `g(φ) → 0`, что толкает expected score к 0.5.

#### Шаг 4: processRanking — batch mode

`processRanking` уже корректно реализует batch Glicko-2. Нужно лишь убрать `effectiveK` и `halfK`, заменив на чистый Glicko-2 batch update:

```js
// Для каждого игрока: newMu = mu + φ'² * Σ(g(φj) * (sj - E))
// Где sj = 1 для побед, 0 для поражений, 0.5 для ничьих
// E = E(mu, muJ=mu, phiJ=phi) = 0.5 (т.к. все стартуют с одинаковым рейтингом)
// g(phiJ) одинаковый для всех (все стартуют с одинаковым RD)
```

Текущая формула `snapshotRating + (wins - losses) * halfK` — это приближение. Идеальная:
```js
const newMu = mu + newPhi * newPhi * gPhiJ * (wins * 1.0 + draws * 0.5 - totalComparisons * 0.5);
const newRating = this.fromGlicko2Scale(newMu);
```

#### Шаг 5: getBestPosition — minor fix

```js
let bestRating = -Infinity;  // вместо 0
```

#### Шаг 6: winsAgainst → ID-based

```js
// В buildUpdatedWinsAgainst:
winsAgainst: { [position]: [...currentWins, loserId] }  // ID, не имя

// В TransitivityService._buildWinGraph:
// Убрать nameToId конвертацию, работать напрямую с ID
const beaten = player.winsAgainst?.[position] || [];
for (const loserId of beaten) {
    winnerWins.add(loserId);  // уже ID
}
```

**Миграция:** При первом запуске конвертировать существующие имена в ID.

#### Итого по рейтингу

| Удаляем | Причина |
|---------|---------|
| `calculateKFactor` | Glicko-2 управляет размером обновления через φ' |
| `calculatePoolAdjustedKFactor` | RD уже адаптируется к количеству данных |
| `calculateEffectiveKFactor` | Составная из двух удалённых |
| `calculateExpectedScoreWithRD` | Дубликат E() с другой базой |
| rdMultiplier | Дублирует Glicko-2 newPhi |

| Оставляем | Причина |
|-----------|---------|
| `getRoundBaseComparisons` | Ортогонален, решает реальную проблему |
| `calculateNewVolatility` | Корректная Illinois method |
| `g()`, `E()` | Ядро Glicko-2 |
| Damping | **Убираем** — g(φ) делает это правильнее |
| Pool adjustment | **Убираем** — RD адаптируется сам |

**Результат:** EloService уменьшается с ~900 строк до ~500. Математическая согласованность 100%.

---

## БЛОК 2: ОПТИМИЗАТОР (team-optimizer)

### Проблема

Алгоритмы оптимизируют `stdDev * 0.5 + maxDiff` (2 компонента), а пользователю показывается оценка с 7 компонентами. 3 из 7 алгоритмов не подключены. SA тратит 98% итераций впустую.

### Идеальное решение

#### Шаг 1: Единая slot-based evaluation function

Создать `evaluateSlotSolutionFull` в `slotEvaluationUtils.js`:

```js
export function evaluateSlotSolutionFull(teams, playerPool, positionWeights, composition, params = {}) {
    const {
        varianceWeight = 0.5,
        positionConsistencyWeight = 0.4,  // MERGED: positionImbalance + consistency
        fairnessWeight = 0.3,
        roleBalanceWeight = 0.15,
        depthWeight = 0.05,
        topPlayerPercent = 0.2
    } = params;

    // 1. Base balance (как сейчас) — ~60 ops
    const balance = calculateSlotTeamBalance(teams, playerPool, positionWeights);
    let score = balance.difference + balance.standardDeviation * varianceWeight;

    // 2. Position consistency — ~140 ops
    // Для каждой позиции: variance средних рейтингов между командами
    if (positionConsistencyWeight > 0 && composition) {
        score += calculateSlotPositionConsistency(teams, playerPool, composition, positionWeights)
                 * positionConsistencyWeight;
    }

    // 3. Fairness — ~200 ops
    // Дисперсия количества топ-игроков между командами
    if (fairnessWeight > 0) {
        score += calculateSlotFairness(teams, playerPool, positionWeights, topPlayerPercent)
                 * fairnessWeight;
    }

    // 4. Role balance — ~30 ops
    // Дисперсия importance-weighted strength (weight²)
    if (roleBalanceWeight > 0) {
        score += calculateSlotRoleBalance(teams, playerPool, positionWeights)
                 * roleBalanceWeight;
    }

    // 5. Depth — ~200 ops (только для позиций с 2+ игроками)
    if (depthWeight > 0 && composition) {
        score -= calculateSlotDepth(teams, playerPool, composition, positionWeights)
                 * depthWeight;
    }

    return score;
}
```

**Каждая метрика реализована для slot-based структур** (без resolveTeams):

```js
function calculateSlotPositionConsistency(teams, playerPool, composition, positionWeights) {
    let totalWeightedVariance = 0;
    let totalWeight = 0;

    for (const [position, count] of Object.entries(composition)) {
        if (!count) continue;
        const weight = positionWeights[position] || 1.0;

        // Средний рейтинг на этой позиции в каждой команде
        const teamAvgs = teams.map(team => {
            const slots = team.filter(s => s.position === position);
            if (slots.length === 0) return 0;
            const sum = slots.reduce((s, slot) =>
                s + playerPool.getPlayerRating(slot.playerId, position), 0);
            return sum / slots.length;
        });

        // Variance средних
        const avg = teamAvgs.reduce((a, b) => a + b, 0) / teams.length;
        const variance = teamAvgs.reduce((s, v) => s + (v - avg) ** 2, 0) / teams.length;
        totalWeightedVariance += variance * weight;
        totalWeight += weight;
    }

    return totalWeight > 0 ? Math.sqrt(totalWeightedVariance / totalWeight) : 0;
}

function calculateSlotFairness(teams, playerPool, positionWeights, topPercent) {
    // Собрать все weighted ratings
    const allRatings = [];
    teams.forEach(team => team.forEach(slot => {
        const rating = playerPool.getPlayerRating(slot.playerId, slot.position);
        const weight = positionWeights[slot.position] || 1.0;
        allRatings.push({ teamIdx: teams.indexOf(team), weightedRating: rating * weight });
    }));

    if (allRatings.length === 0) return 0;

    // Порог топ-игроков
    allRatings.sort((a, b) => b.weightedRating - a.weightedRating);
    const topCount = Math.max(1, Math.ceil(allRatings.length * topPercent));
    const threshold = allRatings[topCount - 1].weightedRating;

    // Подсчёт топ-игроков в каждой команде
    const topPerTeam = new Array(teams.length).fill(0);
    allRatings.slice(0, topCount).forEach(r => topPerTeam[r.teamIdx]++);

    // Дисперсия от идеального распределения
    const ideal = topCount / teams.length;
    const variance = topPerTeam.reduce((s, c) => s + (c - ideal) ** 2, 0) / teams.length;
    return Math.sqrt(variance) * 100;
}

function calculateSlotRoleBalance(teams, playerPool, positionWeights) {
    const teamScores = teams.map(team => {
        const roleScore = team.reduce((sum, slot) => {
            const rating = playerPool.getPlayerRating(slot.playerId, slot.position);
            const weight = positionWeights[slot.position] || 1.0;
            return sum + rating * weight * weight;
        }, 0);
        return roleScore / (team.length || 1);
    });

    const avg = teamScores.reduce((a, b) => a + b, 0) / teams.length;
    const variance = teamScores.reduce((s, v) => s + (v - avg) ** 2, 0) / teams.length;
    return Math.sqrt(variance);
}

function calculateSlotDepth(teams, playerPool, composition, positionWeights) {
    const teamDepths = teams.map(team => {
        let depthSum = 0;
        let posCount = 0;

        for (const [position, count] of Object.entries(composition)) {
            if (!count || count <= 1) continue;

            const slots = team.filter(s => s.position === position);
            if (slots.length <= 1) continue;

            const ratings = slots.map(s =>
                playerPool.getPlayerRating(s.playerId, position)
            ).sort((a, b) => b - a);

            // Среднее всех кроме лучшего
            const depthRatings = ratings.slice(1);
            const avgDepth = depthRatings.reduce((a, b) => a + b, 0) / depthRatings.length;
            const weight = positionWeights[position] || 1.0;
            depthSum += avgDepth * weight;
            posCount++;
        }

        return posCount > 0 ? depthSum / posCount : 0;
    });

    const avg = teamDepths.reduce((a, b) => a + b, 0) / teams.length;
    // НЕ вычитаем variance*10 — просто возвращаем средний depth
    // Variance depth учтена через positionConsistency
    return avg;
}
```

**Стоимость:** ~630 ops вместо ~60. При 120k итераций SA = ~75M ops ≈ 0.5s в JS. Приемлемо.

#### Шаг 2: Передать composition в evaluation

Проблема: `evaluateSlotSolution` не получает `composition`. Нужно передать через `problemContext`:

```js
// В каждом алгоритме:
const score = evaluateSlotSolutionFull(
    teams, playerPool, positionWeights, composition, evaluationParams
);
```

Лучший подход — **создать evaluation context один раз** и передавать его:

```js
// В SlotTeamOptimizerService.optimize():
const evalContext = {
    playerPool,
    positionWeights,
    composition,
    params: this.config.adaptiveParameters
};

// В problemContext:
problemContext.evalContext = evalContext;

// В алгоритмах — одна строка:
const score = evaluate(teams, evalContext);
```

#### Шаг 3: Исправить SA cooling rate

```js
simulatedAnnealing: {
    initialTemperature: 100,     // было 1500, уменьшаем
    coolingRate: 0.99997,        // T(120000) ≈ 2.7
    iterations: 120000,
    reheatEnabled: true,
    reheatTemperature: 50,       // было 700
    reheatIterations: 30000      // было 25000
}
```

Альтернатива: **adaptive cooling** — охлаждаем быстрее когда нет улучшений:

```js
// После каждой итерации:
if (foundImprovement) {
    temp *= 0.99999;  // медленное охлаждение при прогрессе
} else {
    temp *= 0.9999;   // быстрое при стагнации
}
```

#### Шаг 4: Новые swap-операции

Убрать `performPositionSlotSwap` (no-op) и `performCrossTeamSlotSwap` (дубликат).

Заменить на 4 эффективных оператора:

```js
export function performUniversalSlotSwap(teams, positions, playerPool, adaptiveParams) {
    const rand = Math.random();

    if (rand < 0.40) {
        // 40%: Adaptive (сильная ↔ слабая команда)
        performAdaptiveSlotSwap(teams, positions, playerPool, adaptiveParams);
    } else if (rand < 0.70) {
        // 30%: Random cross-team (exploration)
        performSlotSwap(teams, positions, playerPool);
    } else if (rand < 0.90) {
        // 20%: Position-targeted (балансировка конкретной позиции)
        performPositionTargetedSwap(teams, positions, playerPool, adaptiveParams);
    } else {
        // 10%: Chain swap (3 команды, циклический обмен)
        performChainSlotSwap(teams, positions, playerPool);
    }
}
```

Новые операторы:

```js
// Свап для выравнивания конкретной позиции (самой разбалансированной)
function performPositionTargetedSwap(teams, positions, playerPool, adaptiveParams) {
    const positionWeights = adaptiveParams.positionWeights || {};

    // Найти позицию с максимальной дисперсией между командами
    let worstPosition = null;
    let worstVariance = 0;

    for (const pos of positions) {
        const teamAvgs = teams.map(team => {
            const slots = team.filter(s => s.position === pos);
            if (slots.length === 0) return 0;
            return slots.reduce((sum, s) =>
                sum + playerPool.getPlayerRating(s.playerId, pos), 0) / slots.length;
        });

        const avg = teamAvgs.reduce((a, b) => a + b, 0) / teams.length;
        const variance = teamAvgs.reduce((s, v) => s + (v - avg) ** 2, 0) / teams.length;
        const weight = positionWeights[pos] || 1.0;

        if (variance * weight > worstVariance) {
            worstVariance = variance * weight;
            worstPosition = pos;
        }
    }

    if (!worstPosition) return;

    // Свап лучшего игрока сильнейшей команды ↔ худшего слабейшей НА ЭТОЙ ПОЗИЦИИ
    // (аналог adaptive, но прицельный по позиции)
    const teamStrengths = teams.map((team, idx) => {
        const slots = team.filter(s => s.position === worstPosition);
        const strength = slots.reduce((sum, s) =>
            sum + playerPool.getPlayerRating(s.playerId, worstPosition), 0);
        return { idx, strength, slots };
    }).sort((a, b) => b.strength - a.strength);

    const strong = teamStrengths[0];
    const weak = teamStrengths[teamStrengths.length - 1];

    if (strong.slots.length === 0 || weak.slots.length === 0) return;

    // Лучший из сильной
    const bestSlotIdx = strong.slots.reduce((best, s) => {
        const idx = teams[strong.idx].indexOf(s);
        const rating = playerPool.getPlayerRating(s.playerId, worstPosition);
        return rating > best.rating ? { idx, rating } : best;
    }, { idx: -1, rating: -Infinity }).idx;

    // Худший из слабой
    const worstSlotIdx = weak.slots.reduce((worst, s) => {
        const idx = teams[weak.idx].indexOf(s);
        const rating = playerPool.getPlayerRating(s.playerId, worstPosition);
        return rating < worst.rating ? { idx, rating } : worst;
    }, { idx: -1, rating: Infinity }).idx;

    if (bestSlotIdx !== -1 && worstSlotIdx !== -1) {
        swapSlots(teams, strong.idx, bestSlotIdx, weak.idx, worstSlotIdx);
    }
}

// Циклический свап между 3 командами
function performChainSlotSwap(teams, positions, playerPool) {
    if (teams.length < 3) return performSlotSwap(teams, positions, playerPool);

    // Выбрать 3 случайные команды
    const indices = [];
    while (indices.length < 3) {
        const idx = Math.floor(Math.random() * teams.length);
        if (!indices.includes(idx)) indices.push(idx);
    }

    const pos = positions[Math.floor(Math.random() * positions.length)];

    // Найти по одному игроку на этой позиции в каждой команде
    const slots = indices.map(idx => {
        const posSlots = teams[idx]
            .map((s, i) => ({ ...s, slotIdx: i }))
            .filter(s => s.position === pos);
        if (posSlots.length === 0) return null;
        return { teamIdx: idx, slotIdx: posSlots[Math.floor(Math.random() * posSlots.length)].slotIdx };
    });

    if (slots.some(s => s === null)) return;

    // Циклический обмен: A→B, B→C, C→A
    const temp = teams[slots[0].teamIdx][slots[0].slotIdx];
    teams[slots[0].teamIdx][slots[0].slotIdx] = teams[slots[2].teamIdx][slots[2].slotIdx];
    teams[slots[2].teamIdx][slots[2].slotIdx] = teams[slots[1].teamIdx][slots[1].slotIdx];
    teams[slots[1].teamIdx][slots[1].slotIdx] = temp;
}
```

#### Шаг 5: Улучшить adaptive swap — полный variance

```js
function performAdaptiveSlotSwap(teams, positions, playerPool, adaptiveParams) {
    if (teams.length < 2) return;
    const positionWeights = adaptiveParams.positionWeights || {};

    // Рассчитать силы ВСЕХ команд
    const teamStrengths = teams.map((team, idx) => ({
        idx,
        strength: team.reduce((sum, slot) => {
            const rating = playerPool.getPlayerRating(slot.playerId, slot.position);
            const weight = positionWeights[slot.position] || 1.0;
            return sum + rating * weight;
        }, 0)
    }));

    // Текущий variance (полный, не max-min)
    const avg = teamStrengths.reduce((s, t) => s + t.strength, 0) / teams.length;
    const currentVariance = teamStrengths.reduce((s, t) =>
        s + (t.strength - avg) ** 2, 0) / teams.length;

    teamStrengths.sort((a, b) => b.strength - a.strength);
    const strongIdx = teamStrengths[0].idx;
    const weakIdx = teamStrengths[teamStrengths.length - 1].idx;

    const pos = positions[Math.floor(Math.random() * positions.length)];
    const strongSlots = findSlotsByPosition(teams[strongIdx], pos);
    const weakSlots = findSlotsByPosition(teams[weakIdx], pos);

    if (strongSlots.length === 0 || weakSlots.length === 0) {
        return performSlotSwap(teams, positions, playerPool);
    }

    // Найти лучший/худший
    const bestIdx = strongSlots.reduce((best, i) => {
        const r = playerPool.getPlayerRating(teams[strongIdx][i].playerId, pos);
        return r > best.r ? { i, r } : best;
    }, { i: -1, r: -Infinity }).i;

    const worstIdx = weakSlots.reduce((worst, i) => {
        const r = playerPool.getPlayerRating(teams[weakIdx][i].playerId, pos);
        return r < worst.r ? { i, r } : worst;
    }, { i: -1, r: Infinity }).i;

    if (bestIdx === -1 || worstIdx === -1) return;

    // Проверить: улучшает ли свап ПОЛНЫЙ variance?
    const weight = positionWeights[pos] || 1.0;
    const bestR = playerPool.getPlayerRating(teams[strongIdx][bestIdx].playerId, pos) * weight;
    const worstR = playerPool.getPlayerRating(teams[weakIdx][worstIdx].playerId, pos) * weight;
    const delta = bestR - worstR;

    if (delta <= 0) return performSlotSwap(teams, positions, playerPool);

    // Пересчитать variance после свапа
    const newStrengths = teamStrengths.map(t => {
        if (t.idx === strongIdx) return { ...t, strength: t.strength - delta };
        if (t.idx === weakIdx) return { ...t, strength: t.strength + delta };
        return t;
    });
    const newAvg = newStrengths.reduce((s, t) => s + t.strength, 0) / teams.length;
    const newVariance = newStrengths.reduce((s, t) =>
        s + (t.strength - newAvg) ** 2, 0) / teams.length;

    if (newVariance < currentVariance) {
        swapSlots(teams, strongIdx, bestIdx, weakIdx, worstIdx);
    } else {
        performSlotSwap(teams, positions, playerPool);
    }
}
```

#### Шаг 6: Подключить ACO и Hybrid к pipeline

В `SlotTeamOptimizerService.runOptimizationAlgorithms`:

```js
// ACO — конструктивный подход (не мутация), даёт diversity
if (this.config.useAntColony) {
    const optimizer = new SlotAntColonyOptimizer({
        iterations: 50,
        antCount: 15,
        evaporationRate: 0.3,
        pheromoneDeposit: 10,
        elitistWeight: 2.0,
        alpha: 1.0,
        beta: 2.0
    });
    algorithmPromises.push(
        optimizer.solve({ ...problemContext, evalContext }).then(result => {
            stats.antColony = optimizer.getStatistics();
            return result;
        })
    );
    algorithmNames.push('Ant Colony');
}
```

**НЕ подключать CP** — backtracking без pruning слишком медленный и не оптимизирует баланс, а только находит feasible solution.

**НЕ подключать Hybrid** — он дублирует GA+Tabu+LocalSearch, которые уже запущены отдельно.

#### Шаг 7: Исправить ACO heuristic

```js
// БЫЛО: предпочитает сильных игроков
const heuristic = rating / 1500;

// СТАЛО: предпочитает игроков, УРАВНИВАЮЩИХ команду
const currentTeamStrength = teams[teamIndex].reduce((sum, s) =>
    sum + playerPool.getPlayerRating(s.playerId, s.position) *
    (positionWeights[s.position] || 1.0), 0);
const targetStrength = totalPlayerStrength / teamCount;  // предрасчитать один раз
const afterStrength = currentTeamStrength + rating * (positionWeights[position] || 1.0);
const heuristic = 1 / (1 + Math.abs(afterStrength - targetStrength) / 100);
```

#### Шаг 8: Удалить мёртвый код

- `advancedSwapOperations.js` — 533 строки, не импортируется ни одним алгоритмом
- `EvaluationService` — заменяется на `evaluateSlotSolutionFull`; оставить только как фасад для внешних потребителей, делегирующий в slot evaluation

---

## БЛОК 3: МЕЛКИЕ ИСПРАВЛЕНИЯ

#### TransitivityService — O(n³) → incremental

Вместо пересчёта всех триплетов, поддерживать инкрементальный граф:
- При добавлении ребра A→B, проверить только: ∃ C: B→C→A? (O(outdegree(B)))
- Это O(d) вместо O(n³), где d — средний outdegree

#### GA Crossover — position-level вместо team-level

```js
slotCrossover(parent1, parent2, composition, playerPool) {
    const child = Array.from({ length: parent1.length }, () => []);
    const usedIds = new Set();

    // Для каждой позиции: взять от одного из родителей
    for (const [position, count] of Object.entries(composition)) {
        const source = Math.random() < 0.5 ? parent1 : parent2;

        // Собрать игроков на этой позиции из source
        for (let teamIdx = 0; teamIdx < source.length; teamIdx++) {
            const slots = source[teamIdx].filter(s => s.position === position);
            for (const slot of slots) {
                if (!usedIds.has(slot.playerId) &&
                    child[teamIdx].filter(s => s.position === position).length < count) {
                    child[teamIdx].push({ playerId: slot.playerId, position });
                    usedIds.add(slot.playerId);
                }
            }
        }
    }

    // Заполнить пропуски (если конфликты из-за мульти-позиционных игроков)
    fillMissingSlots(child, composition, playerPool, usedIds);

    return child;
}
```

Это даёт **валидную composition по конструкции** (не нужен validate + fallback).

#### Tabu Search — менее агрессивная diversification

```js
const swapCount = Math.max(2, Math.floor(current[0].length / 4));  // было /2
```

#### Hybrid Tabu — fix aspiration

```js
// БЫЛО (всегда true для non-tabu):
if (bestNeighbor.score < bestScore || !tabuList.has(bestNeighbor.hash))

// СТАЛО (правильная логика):
// Фильтруем non-tabu соседей, но принимаем tabu через aspiration
// (уже отфильтрованы в строке 246, так что просто принимаем лучшего)
if (neighbors.length > 0) {
    currentSolution = neighbors[0].solution;
    currentScore = neighbors[0].score;
    // ...
}
```

#### `adaptParameters` — immutable

```js
adaptParameters(teamCount, playerCount) {
    const problemSize = teamCount * this.teamSize;
    if (problemSize > 100) {
        return {
            ...this.algorithmConfigs,
            tabuSearch: { ...this.algorithmConfigs.tabuSearch, iterations: Math.round(this.algorithmConfigs.tabuSearch.iterations * 1.5) },
            simulatedAnnealing: { ...this.algorithmConfigs.simulatedAnnealing, iterations: Math.round(this.algorithmConfigs.simulatedAnnealing.iterations * 1.3) }
        };
    }
    return this.algorithmConfigs;
}
```

---

## ПОРЯДОК РЕАЛИЗАЦИИ

### Фаза 1: Фундамент (устраняет 4 критические + 3 серьёзные)
1. `EloService` → Full Glicko-2 (P1, P2, P3, P4, P5)
2. `evaluateSlotSolutionFull` (P9)
3. Передача composition в алгоритмы

### Фаза 2: Эффективность (устраняет 5 серьёзных)
4. SA cooling rate (P11)
5. Swap operations rewrite (P14, P15, P16)
6. GA crossover → position-level (P12)

### Фаза 3: Расширение
7. Подключить ACO с новым heuristic (P13, P19)
8. Fix Hybrid tabu (P17)
9. Удалить мёртвый код (P21)

### Фаза 4: Полировка
10. TransitivityService → incremental (P6)
11. winsAgainst → ID-based (P8)
12. Minor fixes (P7, P10, P20, P22, P23)

---

## ОЖИДАЕМЫЙ ЭФФЕКТ

| Метрика | До | После |
|---------|-----|-------|
| Математическая согласованность рейтинга | ~60% (2 формулы) | 100% (одна формула) |
| Компоненты в objective function | 2 из 7 | 6 из 6 (merged) |
| Эффективные итерации SA | ~2% | ~100% |
| Полезные свапы | ~50% | ~100% |
| Активные алгоритмы | 3 из 7 | 4 из 7 (GA, Tabu, SA, ACO) |
| Строк кода | ~3500 | ~2800 (удалён мёртвый код) |
| K-factor для нового игрока | до 240 | N/A (Glicko-2 bounded) |
