# Team Optimizer Methodology

## Introduction

The Team Optimizer creates balanced teams from a pool of players with position-specific Elo ratings. Multiple algorithms run in parallel, and the best result is selected.

---

## Optimization Goal

Minimize the difference between team strengths while ensuring:
- Even distribution of top players
- Position-level balance within teams
- Consistent depth across positions

---

## Algorithms

### 1. Genetic Algorithm

Evolutionary approach inspired by natural selection.

```
Population of solutions
        ↓
   [Selection] ← Choose best individuals
        ↓
   [Crossover] ← Combine two parents → child
        ↓
   [Mutation]  ← Random swaps for diversity
        ↓
   Next generation
        ↓
   Repeat until convergence
```

### 2. Tabu Search

Memory-based search that avoids revisiting recent solutions.

```
Current solution
        ↓
   Generate neighbors (swap players)
        ↓
   Filter out "tabu" (recently visited)
        ↓
   Select best non-tabu neighbor
        ↓
   Add to tabu list
        ↓
   Repeat
```

### 3. Simulated Annealing

Probabilistic search inspired by metal cooling process.

```
High temperature → accepts worse solutions (exploration)
        ↓
   Temperature decreases gradually
        ↓
Low temperature → only accepts improvements (exploitation)
        ↓
   Reheat if stuck
```

Acceptance probability: `P = exp(-Δ / T)` where Δ is score difference, T is temperature.

### 4. Local Search

Greedy hill-climbing for final refinement.

```
Current solution
        ↓
   Try all neighbor swaps
        ↓
   Accept if improves score
        ↓
   Stop when no improvement found
```

### 5. Ant Colony Optimizer

Inspired by ant foraging behavior with pheromone trails.

```
Ants construct solutions independently
        ↓
   Selection probability ∝ pheromone × rating
        ↓
   Good solutions deposit more pheromone
        ↓
   Pheromones evaporate over time
        ↓
   Colony converges to good solutions
```

### 6. Constraint Programming

Backtracking search with constraint propagation.

```
For each team slot:
        ↓
   Try assigning eligible player
        ↓
   Check constraints (no duplicates, correct positions)
        ↓
   If conflict → backtrack and try another
        ↓
   Continue until all slots filled
```

### 7. Hybrid Optimizer

Three-phase sequential approach.

```
Phase 1: Genetic Algorithm (global exploration)
        ↓
Phase 2: Tabu Search (focused exploitation)
        ↓
Phase 3: Local Search (final polish)
```

---

## Evaluation Function

### Team Strength

```
Team Strength = Σ (Player Rating × Position Weight)
```

### Combined Score (lower is better)

```
Score = (Max Team - Min Team) + √Variance × 0.5 + PositionImbalance × 0.3
```

---

## Advanced Metrics

### Fairness

Measures distribution of top 20% players across teams.

```
Ideal = Top Players / Team Count
Fairness Score = √(Variance from ideal) × 100
```

### Consistency

Measures position-level strength variance across teams.

```
For each position:
   Calculate average rating per team
   Compute variance
Consistency Score = √(Weighted average variance)
```

### Depth

Measures strength of backup players (excluding starters).

```
Depth Score = Average backup rating - √(Variance) × 10
```

### Role Balance

Ensures key positions are equally distributed.

```
Role Score = Σ (Rating × Weight²) / Team Size
```

---

## Process Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      INPUT                                  │
│  Players with Elo ratings + Position composition            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    VALIDATION                               │
│  Check: enough players for each position?                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              PARALLEL OPTIMIZATION                          │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │   GA    │ │  Tabu   │ │   SA    │ │   ...   │           │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘           │
│       └───────────┴───────────┴───────────┘                 │
│                       ↓                                     │
│              Select best result                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  LOCAL SEARCH                               │
│  Polish the winning solution                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      OUTPUT                                 │
│  Balanced teams + quality metrics                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Balance Quality Levels

| Level | Strength Difference | Description |
|-------|---------------------|-------------|
| Excellent | < 100 points | Nearly identical teams |
| Good | < 200 points | Minor differences |
| Fair | < 300 points | Noticeable but acceptable |
| Poor | > 500 points | Significant imbalance |

---

## Example

### Input

6 players, 2 positions, 3 teams:

| Player | Position A | Position B |
|--------|------------|------------|
| Alice  | 1800       | 1600       |
| Boris  | 1700       | 1650       |
| Carol  | 1600       | 1700       |
| David  | 1550       | 1750       |
| Elena  | 1500       | 1500       |
| Frank  | 1450       | 1550       |

### Before Optimization

| Team | A | B | Total |
|------|---|---|-------|
| 1 | Alice (1800) | Carol (1700) | 3500 |
| 2 | Boris (1700) | Elena (1500) | 3200 |
| 3 | Frank (1450) | David (1750) | 3200 |

**Balance:** 300 points (Fair)

### After Optimization

| Team | A | B | Total |
|------|---|---|-------|
| 1 | Alice (1800) | Elena (1500) | 3300 |
| 2 | Carol (1600) | David (1750) | 3350 |
| 3 | Boris (1700) | Frank (1550) | 3250 |

**Balance:** 100 points (Excellent)

