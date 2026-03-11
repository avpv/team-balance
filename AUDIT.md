# Критический аудит: Ранжирование игроков и Оптимизация баланса команд

## Обзор архитектуры

### team-balance (Ранжирование)
- **EloService** — гибрид ELO + Glicko-2 (рейтинг по ELO, RD/volatility по Glicko-2)
- **TransitivityService** — обнаружение циклов A>B>C>A в сравнениях
- **rating.js** — централизованная конфигурация всех констант

### team-optimizer (Баланс команд)
- **SlotTeamOptimizerService** — оркестратор: запускает 4+ алгоритма параллельно
- **7 алгоритмов**: GA, Tabu Search (×3), SA, ACO, CP, Hybrid, Local Search
- **PlayerPool** — единый источник данных игроков (slot-based: `{playerId, position}`)
- **EvaluationService** — полная оценка с advanced metrics (не используется при оптимизации!)

---

## ЧАСТЬ 1: РАНЖИРОВАНИЕ (team-balance)

### Что сделано хорошо

1. **Гибрид ELO + Glicko-2 RD** — грамотный подход. Чистый ELO для рейтинга, Glicko-2 для tracking uncertainty.

2. **Damping** (`getDampedRating`) — игроки с <5 сравнениями не получают полный вес рейтинга. Снижает order-dependence.

3. **Round-base comparisons** (`getRoundBaseComparisons`) — элегантное решение: внутри раунда все видят одинаковый базовый счёт сравнений.

4. **Symmetric K-factor** — `(winnerK + loserK) / 2` гарантирует zero-sum (сохранение рейтингового пула).

5. **Illinois method** для volatility — корректная реализация алгоритма из оригинальной Glicko-2 спецификации.

6. **TransitivityService** — чистая реализация обнаружения 3-циклов с `wouldCreateViolation` для превентивного предупреждения.

---

### КРИТИЧЕСКИЕ проблемы

#### P1: ELO rating и Glicko-2 RD обновляются по РАЗНЫМ формулам, но используются вместе

**Файл:** `EloService.js:476-490`

Рейтинг обновляется по модифицированной ELO формуле:
```js
winnerChange = symmetricK * (1 - winnerExpected);
```

Но RD и volatility обновляются по полной Glicko-2 формуле (`calculateGlicko2Update`), которая внутри пересчитывает своё собственное `delta` и `v` (строки 356-357):
```js
const v = 1 / (gPhiJ * gPhiJ * eMuJ * (1 - eMuJ));
const delta = v * gPhiJ * (score - eMuJ);
```

**Проблема:** Glicko-2 "думает", что рейтинг обновился по своей формуле (delta * 1/φ²), но фактически рейтинг обновился по другой (symmetricK * (score - E)). RD будет сходиться неправильно — вы получите слишком уверенные (низкие) RD при нестабильных рейтингах, и наоборот.

**Решение:** Либо полностью перейти на Glicko-2 для рейтинга (rating = mu * SCALE + DEFAULT), либо отвязать RD update от рейтинга и использовать его только как информационную метрику.

---

#### P2: Двойная компенсация неопределённости (RD-based K + Glicko-2 RD update)

**Файл:** `EloService.js:194-196`

```js
const normalizedRd = (rd - g2.MIN_RD) / (g2.MAX_RD - g2.MIN_RD);
const rdMultiplier = 1 + normalizedRd * 1.5;  // от 1.0x до 2.5x
k = k * rdMultiplier;
```

Высокий RD одновременно:
1. **Увеличивает K-factor** (через rdMultiplier) — рейтинг меняется сильнее
2. **Уменьшает RD** (через Glicko-2 newPhi, строка 367) — уверенность растёт

Это двойная компенсация. Glicko-2 **уже** учитывает неопределённость в формуле newPhi. Дополнительный rdMultiplier ломает баланс.

**Пример:** Новый игрок (RD=350):
- Base K = 48 (NOVICE)
- rdMultiplier = 1 + 1.0 × 1.5 = **2.5x**
- Pool adj (3 игрока): sqrt(15/3) = **2.24x** (capped at 2.0)
- Final K = 48 × 2.5 × 2.0 = **240**
- Изменение рейтинга за одну победу: ±120 при expected=0.5

**Решение:** Убрать rdMultiplier ИЛИ добавить cap на финальный K. Рекомендуемый cap: `Math.min(finalK, 100)`.

---

#### P3: base 10 vs base e в expected score — математическая несовместимость

**calculateExpectedScoreWithRD** (строка 75, используется для рейтинга):
```js
return 1 / (1 + Math.pow(10, scaledDiff));  // base 10
```

**E()** (строка 263, используется для Glicko-2 update):
```js
return 1 / (1 + Math.exp(-this.g(phiJ) * (mu - muJ)));  // base e
```

При одинаковых входных данных они дают РАЗНЫЕ expected scores. Например, при ratingDiff=400 (с g=1):
- base 10: `1/(1+10^1) ≈ 0.091`
- base e: `1/(1+e^(-400/173.7)) ≈ 0.091` (случайное совпадение при ровно 400)
- При ratingDiff=200: base 10 даёт 0.24, base e даёт 0.24 — но расхождения нарастают при крайних значениях.

**Решение:** Использовать одну формулу. Рекомендую перевести всё на Glicko-2 scale (base e), убрав `calculateExpectedScoreWithRD`.

---

### СЕРЬЁЗНЫЕ проблемы

#### P4: Pool adjustment sqrt() — ad hoc формула без теоретического обоснования

**Файл:** `EloService.js:164`

```js
const adjustmentFactor = Math.sqrt(refSize / poolSize);
```

При пуле из 3 игроков (ref=15): `sqrt(15/3) = 2.24x`, capped at 2.0.
При пуле из 50: `sqrt(15/50) = 0.55x`.

**Проблема:** Рейтинги в маленьком пуле будут в 2x более волатильны. После достаточного числа раундов они сойдутся, но с бо́льшим разбросом на пути. Кроме того, sqrt не имеет теоретического обоснования — линейная зависимость или 1/log(poolSize) были бы не хуже.

**Решение:** Рассмотреть замену на `Math.min(maxFactor, refSize / poolSize)` (линейная) или полное удаление pool adjustment (Glicko-2 RD уже адаптируется к количеству сравнений).

---

#### P5: Цепочка K-factor множителей без общего cap

Цепочка: `calculateKFactor(48) × rdMultiplier(2.5) × poolAdjusted(2.0) = 240`.

Нет верхнего предела для финального K, только для отдельных множителей. При default rating 1500 и expected 0.5 это даёт ±120 за одну победу/поражение — 8% рейтинга.

**Решение:** Добавить в `calculateEffectiveKFactor`:
```js
return Math.round(Math.min(k, MAX_EFFECTIVE_K));  // MAX_EFFECTIVE_K = 80-100
```

---

#### P6: TransitivityService — O(n³) для каждой позиции

`detectViolations` (строки 47-71): тройной вложенный цикл по всем игрокам.
- 30 игроков = C(30,3) = 4060 проверок
- 100 игроков = C(100,3) = 161700 проверок

Не критично для 10-30 игроков, но может стать узким местом при >50.

**Решение:** Для больших пулов использовать DFS/Tarjan для поиска SCC (O(V+E)).

---

#### P7: `getBestPosition` инициализирует `bestRating = 0`

**Файл:** `EloService.js:735`

```js
let bestRating = 0;
```

Дефолтный рейтинг 1500. Если у игрока нет рейтинга ни по одной позиции, `rating = player.ratings[pos] || this.DEFAULT_RATING = 1500`. Первая позиция всегда выиграет, т.к. 1500 > 0. Но если бы рейтинг был < 0 (невозможно с текущим MIN=0), была бы проблема.

**Решение:** Инициализировать `bestRating = -Infinity` для корректности.

---

#### P8: `winsAgainst` хранит имена, а не ID

`_buildWinGraph` (строка 146):
```js
for (const loserName of beaten) {
    const loserId = nameToId.get(loserName);
```

Если два игрока с одинаковым именем — одного из них не найдут в `nameToId`.

**Решение:** Хранить ID в `winsAgainst` или добавить проверку на уникальность имён.

---

## ЧАСТЬ 2: ОПТИМИЗАЦИЯ БАЛАНСА (team-optimizer)

### Что сделано хорошо

1. **Slot-based архитектура** — отличный рефакторинг. `{playerId, position}` вместо полных объектов. Дубликаты невозможны по структуре. Клонирование мгновенное, потребление памяти минимальное.

2. **Multi-algorithm approach** — запуск GA, Tabu (×3), SA параллельно и выбор лучшего. Разные алгоритмы находят разные локальные оптимумы.

3. **Deduplication** — на двух уровнях (после алгоритмов + после local search refinement).

4. **Aspiration criterion** в Tabu Search — корректная реализация. Переопределение табу при нахождении нового глобального лучшего.

5. **Specialist-first allocation** — во всех генераторах (Smart, Greedy, Balanced, SnakeDraft, Random) специалисты (1 позиция) размещаются первыми. Это предотвращает ситуацию, когда универсал занимает слот, а специалист остаётся без места.

6. **Scarcity-based position ordering** — все генераторы сортируют позиции по дефициту. Дефицитные позиции заполняются первыми.

7. **6 разных стратегий инициализации** — обеспечивают diversity для population-based алгоритмов.

---

### КРИТИЧЕСКИЕ проблемы

#### P9: Оптимизируется НЕ ТА целевая функция

**Самая серьёзная проблема всей системы.**

Во время оптимизации все 7 алгоритмов используют `evaluateSlotSolution` из `slotEvaluationUtils.js:112-129`:

```js
export function evaluateSlotSolution(teams, playerPool, positionWeights) {
    const balance = calculateSlotTeamBalance(teams, playerPool, positionWeights);
    const varianceScore = balance.standardDeviation * 0.5;
    const differenceScore = balance.difference;
    return varianceScore + differenceScore;
}
```

Это **только** stdDev×0.5 + maxDifference. Два компонента.

Но `EvaluationService.evaluateSolution` (используется для финальных метриков и отображения) считает **7 компонентов**:
1. balance (max - min)
2. variance
3. positionImbalance
4. fairness (распределение топ-игроков)
5. consistency (по-позиционный баланс)
6. depth (глубина скамейки)
7. roleBalance (взвешенное ролевое распределение)

**Результат:** Алгоритмы оптимизируют 2 из 7 компонентов. Можно получить решение с идеальным balance и variance, но ужасным fairness (все 3 лучших игрока в одной команде) или consistency (все хорошие сеттеры в одной команде).

**Решение:** Создать `evaluateSlotSolutionFull()` — slot-based версию полной оценки. Нужно реализовать fairness, consistency, depth и roleBalance для slot-структур, используя PlayerPool.

---

#### P10: `adaptParameters` мутирует конфигурацию необратимо

**Файл:** `SlotTeamOptimizerService.js:355-359`

```js
if (problemSize > 100) {
    this.algorithmConfigs.tabuSearch.iterations *= 1.5;
    this.algorithmConfigs.simulatedAnnealing.iterations *= 1.3;
}
```

При повторных вызовах итерации растут экспоненциально: 12000 → 18000 → 27000 → ...

Метод **не вызывается** из `optimize()`, но может быть вызван извне. Это потенциальная бомба.

**Решение:** Создавать копию конфига: `const adjustedConfig = { ...this.algorithmConfigs.tabuSearch, iterations: ... }`.

---

### СЕРЬЁЗНЫЕ проблемы

#### P11: SA — температура ~0 после 2000 из 120000 итераций

**Файл:** `SlotSimulatedAnnealingOptimizer.js:111`

```
initialTemperature = 1500, coolingRate = 0.9965
```

Температура после N итераций: `T(N) = 1500 × 0.9965^N`

| Итерация | Температура |
|----------|-------------|
| 1000     | 46.9        |
| 2000     | 1.47        |
| 3000     | 0.046       |
| 5000     | 0.000046    |
| 25000    | ~0          |

При T < 0.1, acceptance probability для delta=1: `exp(-1/0.1) = 0.00005`. SA фактически работает как **чистый greedy hill climbing** с итерации ~2000.

Reheat происходит после 25000 итераций стагнации (до T=700), но к тому моменту уже потрачено 23000 итераций чистого greedy.

**98% вычислительного бюджета SA потрачено впустую.**

**Решение:** Пересчитать cooling rate для 120000 итераций:
```js
// Чтобы T(120000) ≈ 1:
coolingRate = Math.pow(1/1500, 1/120000) ≈ 0.99994
```
Или уменьшить итерации до ~3000-5000.

---

#### P12: GA crossover создаёт невалидные решения → вырождение в random search

**Файл:** `SlotGeneticAlgorithmOptimizer.js:312-328`

"Last resort" блок в crossover:
```js
if (!placed) {
    smallestTeam.push({
        playerId: slot.playerId,
        position: slot.position  // позиция может быть уже заполнена
    });
}
```

Строка 93 проверяет и отклоняет невалидных детей:
```js
const compositionValid = validateAllSlotTeamsComposition(child, composition).isValid;
if (compositionValid && this.isDiverse(child, newPopulation)) {
    newPopulation.push(child);
} else {
    newPopulation.push(createRandomSlotSolution(...));  // замена на random
}
```

При большом проценте невалидных детей GA вырождается в `elitism + random search`. Эффективность crossover зависит от того, как часто slicePoint оставляет команды без "совпадающих" позиций.

**Решение:** Улучшить crossover: вместо team-level slicePoint использовать position-level crossover — для каждой позиции копировать от одного из родителей.

---

#### P13: ACO не подключён к основному pipeline

**Файл:** `SlotTeamOptimizerService.js:244-303`

В `runOptimizationAlgorithms` запускаются только 3 алгоритма:
1. Genetic Algorithm
2. Tabu Search (×3 multi-start)
3. Simulated Annealing

**ACO, CP и Hybrid НЕ ИСПОЛЬЗУЮТСЯ** в основном pipeline. Они экспортируются из `index.js`, но не вызываются `SlotTeamOptimizerService`. Это мёртвый код в контексте текущего workflow.

**Решение:** Либо подключить ACO/CP/Hybrid к pipeline, либо убрать из exports (если не нужны для внешних потребителей).

---

#### P14: Adaptive swap оценивает только max/min, не variance

**Файл:** `slotSwapOperations.js:109-116`

```js
const currentBalance = teamStrengths[0].strength - teamStrengths[teamStrengths.length - 1].strength;
// ...
const newBalance = Math.abs(strongTeamAfter - weakTeamAfter);
if (newBalance < currentBalance) {
    swapSlots(...);
}
```

Если 4 команды: [100, 95, 90, 50], свап между 100 и 50 может дать [80, 95, 90, 70].
- Старый balance: 100-50 = 50
- Новый balance: 95-70 = 25
- Свап принят ✓

Но variance могла ухудшиться, и **средние команды (95, 90) не учтены**. При 10+ командах это серьёзная проблема.

**Решение:** Оценивать полный variance всех команд:
```js
const oldVariance = calculateVariance(teamStrengths.map(t => t.strength));
const newStrengths = [...teamStrengths]; // пересчитать сильную/слабую
const newVariance = calculateVariance(newStrengths);
if (newVariance < oldVariance) { swapSlots(...); }
```

---

#### P15: `performPositionSlotSwap` — полный no-op для баланса

**Файл:** `slotSwapOperations.js:132-158`

Свапает двух игроков **внутри одной команды** на **одной позиции**. Позиция не меняется, сила команды не меняется, баланс не меняется. Это перестановка внутри команды, которая не влияет ни на одну метрику.

---

#### P16: `performUniversalSlotSwap` — 25-50% итераций потрачены впустую

**Файл:** `slotSwapOperations.js:204-216`

```js
if (rand < 0.25)      performSlotSwap           // полезный
else if (rand < 0.5)   performAdaptiveSlotSwap   // полезный
else if (rand < 0.75)  performCrossTeamSlotSwap  // дублирует performSlotSwap
else                    performPositionSlotSwap   // полный no-op (P15)
```

- `performCrossTeamSlotSwap` = то же что `performSlotSwap` (случайные команды, случайная позиция, свап)
- `performPositionSlotSwap` = no-op

25% итераций полностью бесполезны, ещё 25% — дубликат.

**Решение:** Заменить на:
```js
if (rand < 0.4)       performAdaptiveSlotSwap    // целенаправленный
else if (rand < 0.7)  performSlotSwap            // random exploration
else                   performMultiTeamSwap       // chain swap из 3 команд
```

---

#### P17: Hybrid Optimizer — aspiration criterion реализован неправильно

**Файл:** `SlotHybridOptimizer.js:262`

```js
if (bestNeighbor.score < bestScore || !tabuList.has(bestNeighbor.hash)) {
```

Это ВСЕГДА true если сосед не в tabu (вторая часть OR). Aspiration criterion должен быть:
```js
if (!tabuList.has(hash) || score < bestScore)  // принять tabu ТОЛЬКО если лучше лучшего
```

Текущий код фактически игнорирует tabu list для большинства соседей, т.к. условие `!tabuList.has(bestNeighbor.hash)` уже true — мы уже отфильтровали tabu в строке 246.

**Решение:** Убрать второй `!tabuList.has()` check или пересмотреть логику. В текущем виде tabu list в phase2 практически не работает.

---

#### P18: CP Optimizer — backtracking без domain pruning

**Файл:** `SlotConstraintProgrammingOptimizer.js:162-218`

Backtracking реализован без forward checking или arc consistency. Для каждой переменной перебирается весь домен, проверяя только `usedPlayerIds.has(playerId)`.

Без domain pruning (propagation) CP работает как brute-force перебор. Для типичной задачи (6 позиций × 2 команды × 1-2 игрока = ~15 переменных с доменами ~10-30) это может быть ОК, но для больших задач будет экспоненциальный взрыв.

**Решение:** Добавить forward checking: при назначении переменной удалять `playerId` из доменов оставшихся переменных. При backtrack — восстанавливать.

---

#### P19: ACO — heuristic rating/1500 не учитывает позицию и баланс

**Файл:** `SlotAntColonyOptimizer.js:224-228`

```js
const rating = playerPool.getPlayerRating(playerId, position);
const heuristic = rating / 1500;
const probability = Math.pow(pheromone, alpha) * Math.pow(heuristic, beta);
```

Heuristic просто `rating/1500` — это предпочитает сильных игроков в каждую команду. Но для **баланса** нужно предпочитать игроков, которые **уравнивают** команды, а не усиливают каждую.

**Решение:** Heuristic должен учитывать текущую силу команды:
```js
const teamStrength = currentTeamStrength(teams[teamIdx], playerPool, positionWeights);
const targetStrength = avgTeamStrength;
const heuristic = 1 / (1 + Math.abs(teamStrength + rating*weight - targetStrength));
```

---

### НЕЗНАЧИТЕЛЬНЫЕ проблемы

#### P20: Cache eviction — FIFO вместо LRU

**Файл:** `EvaluationService.js:143-150`

Удаляются первые 10% записей. При частом обращении к одним и тем же решениям (например, при local search), часто используемые решения могут быть вытеснены.

**Решение:** Использовать LRU (обновлять позицию при каждом hit) или увеличить maxCacheSize.

---

#### P21: `advancedSwapOperations.js` — полностью мёртвый код

Файл содержит 5 "умных" swap-операций (fairness, consistency, weakness-targeted, chain, balanced multi-swap), но они работают с resolved teams (полные объекты), а не со slot-based структурами.

Ни один из 7 алгоритмов не импортирует этот файл. `performIntelligentSwap` и `getIntelligentSwapProbability` нигде не вызываются.

**Решение:** Либо перенести логику в slot-based версии и подключить к алгоритмам, либо удалить файл.

---

#### P22: Tabu Search — diversification слишком агрессивная

**Файл:** `SlotTabuSearchOptimizer.js:139`

```js
const swapCount = Math.max(3, Math.floor(current[0].length / 2));
```

При teamSize=6, swapCount = 3. При teamSize=12, swapCount = 6. Каждая diversification применяет 3-6 случайных свапов к лучшему решению, что может полностью разрушить его. Плюс 50% tabu list очищается.

**Решение:** Использовать `Math.max(2, Math.floor(current[0].length / 4))` — менее агрессивная diversification.

---

#### P23: `depth` metric может быть отрицательной

**Файл:** `advancedMetrics.js:213`

```js
const depthScore = avgDepth - Math.sqrt(depthVariance) * 10;
```

Множитель 10 на sqrt(variance) может сделать depthScore отрицательным при высокой variance. Затем в `calculateCombinedAdvancedScore`:

```js
score -= metrics.depth.depthScore * depthWeight;
```

Вычитание отрицательного → сложение. Высокая variance в depth **уменьшает** combined score (делает его "лучше"), что противоречит намерению.

**Решение:** Разделить depth на два компонента:
```js
score += avgDepthBonus * depthWeight;
score += depthVariancePenalty * depthWeight;
```

---

## ЧАСТЬ 3: СВОДНАЯ ТАБЛИЦА

| # | Серьёзность | Компонент | Проблема | Влияние |
|---|-------------|-----------|----------|---------|
| P1 | **КРИТИЧЕСКАЯ** | EloService | ELO rating + Glicko-2 RD рассогласованы | RD сходится неправильно |
| P2 | **КРИТИЧЕСКАЯ** | EloService | Двойная компенсация неопределённости | K-factor до 240, скачки ±120 |
| P3 | **КРИТИЧЕСКАЯ** | EloService | base 10 vs base e в expected score | Математическая несовместимость |
| P9 | **КРИТИЧЕСКАЯ** | Optimizer | Оптимизируется 2 из 7 компонентов | Решения не оптимальны по advanced metrics |
| P4 | **СЕРЬЁЗНАЯ** | EloService | sqrt() pool adjustment без обоснования | Перекос рейтингов в малых пулах |
| P5 | **СЕРЬЁЗНАЯ** | EloService | Нет cap на финальный K-factor | Экстремальные скачки рейтинга |
| P11 | **СЕРЬЁЗНАЯ** | SA | Температура ~0 после 2000 из 120000 итераций | 98% итераций бесполезны |
| P12 | **СЕРЬЁЗНАЯ** | GA | Crossover создаёт невалидные решения | GA вырождается в random search |
| P13 | **СЕРЬЁЗНАЯ** | Pipeline | ACO, CP, Hybrid не подключены | 3 из 7 алгоритмов не используются |
| P14 | **СЕРЬЁЗНАЯ** | Swaps | Adaptive swap — только max/min | Не учитывает промежуточные команды |
| P15-16 | **СЕРЬЁЗНАЯ** | Swaps | 25-50% свапов бесполезны/дублируются | Потеря производительности |
| P17 | **СЕРЬЁЗНАЯ** | Hybrid | Aspiration criterion не работает | Tabu list в phase2 бесполезен |
| P18 | **СЕРЬЁЗНАЯ** | CP | Backtracking без domain pruning | Экспоненциальный взрыв |
| P19 | **СЕРЬЁЗНАЯ** | ACO | Heuristic не учитывает баланс | ACO строит сильные, не сбалансированные команды |
| P10 | **СЕРЬЁЗНАЯ** | Optimizer | `adaptParameters` мутирует config | Потенциальный баг при повторных вызовах |
| P6 | НЕЗНАЧИТ. | Transitivity | O(n³) для каждой позиции | Медленно при >50 игроках |
| P7 | НЕЗНАЧИТ. | EloService | `getBestPosition` — `bestRating = 0` | Некорректная инициализация |
| P8 | НЕЗНАЧИТ. | Transitivity | `winsAgainst` хранит имена, не ID | Баг при одинаковых именах |
| P20 | НЕЗНАЧИТ. | Cache | FIFO eviction вместо LRU | Субоптимальный cache hit rate |
| P21 | НЕЗНАЧИТ. | Swaps | advancedSwapOperations — мёртвый код | 533 строки неиспользуемого кода |
| P22 | НЕЗНАЧИТ. | Tabu | Слишком агрессивная diversification | Разрушает хорошие решения |
| P23 | НЕЗНАЧИТ. | Metrics | Depth metric может быть отрицательной | Инвертированная пенализация |

---

## ЧАСТЬ 4: ПРИОРИТЕТНЫЕ РЕКОМЕНДАЦИИ

### Tier 1 — Критические (ломают корректность)

1. **Унифицировать ELO/Glicko-2** (P1, P3): Либо полный Glicko-2, либо убрать Glicko-2 RD из K-factor
2. **Cap на K-factor** (P2, P5): `Math.min(finalK, 100)`
3. **Передать advanced metrics в оптимизацию** (P9): Создать `evaluateSlotSolutionFull()`

### Tier 2 — Серьёзные (снижают эффективность)

4. **Пересчитать SA cooling rate** (P11): `0.99994` вместо `0.9965`
5. **Исправить swap distribution** (P15-16): Убрать no-op, добавить chain swap
6. **Подключить ACO/CP/Hybrid** к pipeline (P13) или удалить
7. **Исправить adaptive swap** (P14): Полный variance вместо max-min
8. **Исправить ACO heuristic** (P19): Учитывать текущий баланс команды
9. **Добавить domain pruning в CP** (P18)
10. **Исправить Hybrid tabu logic** (P17)

### Tier 3 — Чистка

11. Удалить `advancedSwapOperations.js` (P21) или адаптировать для slot-based
12. Исправить `getBestPosition` (P7)
13. Перевести `winsAgainst` на ID (P8)
14. Сделать `adaptParameters` immutable (P10)
