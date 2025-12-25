# Team Optimizer Methodology

## Introduction

The Team Optimizer uses a multi-algorithm approach to create balanced teams from a pool of players with position-specific Elo ratings. The optimizer employs metaheuristic algorithms running in parallel to find the best possible team composition while ensuring fairness across multiple dimensions.

---

## Optimization Goal

The optimizer aims to **minimize the difference** between team strengths while ensuring:
- Even distribution of top players
- Position-level balance within teams
- Consistent depth across positions

---

## Algorithms

The optimizer provides **seven algorithms** for team balancing:

### 1. Genetic Algorithm

Evolutionary approach inspired by natural selection.

| Parameter | Value | Description |
|-----------|-------|-------------|
| Population Size | 25 | Number of solutions per generation |
| Generations | 350 | Number of evolution cycles |
| Mutation Rate | 0.25 | Probability of random changes |
| Crossover Rate | 0.75 | Probability of combining parents |
| Elitism Count | 3 | Best solutions preserved unchanged |
| Tournament Size | 3 | Selection pool size |
| Max Stagnation | 25 | Generations without improvement before diversity injection |

**Key Operations:**
- **Selection**: Tournament selection chooses parents based on fitness
- **Crossover**: Combines two parent solutions to create offspring
- **Mutation**: Random player swaps to introduce diversity
- **Elitism**: Preserves best solutions to prevent regression

**Diversity Preservation:**
- Solutions must differ by at least 20% of players to be considered diverse
- When stagnating, mutation rate doubles and half the population is replaced with random solutions

---

### 2. Tabu Search

Memory-based search that avoids cycling back to recent solutions.

| Parameter | Value | Description |
|-----------|-------|-------------|
| Tabu Tenure | 120 | How long solutions stay forbidden |
| Iterations | 12,000 | Total search steps |
| Neighbor Count | 25 | Solutions explored per step |
| Diversification Frequency | 1,200 | Steps between forced exploration |

**Key Concepts:**
- **Tabu List**: Recently visited solutions are marked as "tabu" (forbidden)
- **Aspiration Criterion**: Overrides tabu status if solution beats global best
- **Diversification**: Periodic perturbation to escape local minima

**Multi-Start Strategy:**
The optimizer runs 3 parallel Tabu Search instances from different starting points, selecting the best result.

---

### 3. Simulated Annealing

Probabilistic search inspired by metallurgical annealing process.

| Parameter | Value | Description |
|-----------|-------|-------------|
| Initial Temperature | 1,500 | Starting "heat" level |
| Cooling Rate | 0.9965 | Temperature decay per step |
| Iterations | 120,000 | Total search steps |
| Reheat Temperature | 700 | Temperature after restart |
| Reheat Iterations | 25,000 | Steps without improvement before reheat |

**Core Mechanism:**

Acceptance probability for worse solutions:
```
P(accept) = exp(-delta / temperature)
```

Where `delta` is the score difference (worse - current).

**Temperature Phases:**
- **High temperature**: Explores widely, accepts many worse solutions
- **Low temperature**: Focuses on exploitation, rarely accepts worse solutions
- **Reheating**: Restarts exploration when stuck

---

### 4. Local Search

Final refinement phase applied to the best solution from parallel algorithms.

| Parameter | Value | Description |
|-----------|-------|-------------|
| Iterations | 4,000 | Refinement steps |
| Neighborhood Size | 12 | Swap variations explored |

**Purpose:**
Polishes the solution with small, targeted improvements after the main algorithms complete.

---

### 5. Ant Colony Optimizer

Inspired by foraging behavior of ants using pheromone trails.

| Parameter | Description |
|-----------|-------------|
| Ant Count | Number of ants constructing solutions per iteration |
| Iterations | Number of colony cycles |
| Evaporation Rate | Pheromone decay rate (prevents stagnation) |
| Alpha | Pheromone influence weight |
| Beta | Heuristic (rating) influence weight |
| Elitist Weight | Extra pheromone deposit for best solution |

**Core Mechanism:**

Ants construct solutions probabilistically:
```
P(select player) ∝ pheromone^α × heuristic^β
```

Where:
- **Pheromone**: Learned from previous good solutions
- **Heuristic**: Player rating normalized around 1.0

**Key Features:**
- Constructs solutions from scratch (no mutation)
- Pheromone evaporation prevents premature convergence
- Elitist strategy reinforces best solutions
- Naturally diverse (each ant explores differently)

---

### 6. Constraint Programming Optimizer

Uses backtracking with constraint propagation to construct valid solutions.

| Parameter | Description |
|-----------|-------------|
| Max Backtracks | Maximum backtracking steps before giving up |
| Attempts | Number of tries with different variable orderings |

**Constraints Enforced:**
1. **AllDifferent**: Each player assigned exactly once
2. **Composition**: Each team has correct position counts
3. **Eligibility**: Players only assigned to positions they can play

**Search Process:**
1. Build variables: one for each position slot in each team
2. Assign domains: eligible player IDs for each variable
3. Backtrack search: try assignments, propagate constraints
4. On conflict: backtrack and try alternative

**Variable Ordering:**
Multiple attempts with shuffled variable order to find different solutions.

---

### 7. Hybrid Optimizer

Combines three complementary optimization strategies in sequential phases.

**Phase 1: Genetic Algorithm (Global Exploration)**

| Parameter | Value | Description |
|-----------|-------|-------------|
| Population Size | 15 | Smaller for speed |
| Generations | 100 | Quick exploration |
| Mutation Rate | 0.3 | Higher for diversity |

**Phase 2: Tabu Search (Focused Exploitation)**

| Parameter | Value | Description |
|-----------|-------|-------------|
| Iterations | 3,000 | Intensive local search |
| Tabu Tenure | 50 | Shorter memory |
| Neighborhood Size | 15 | Solutions per step |

**Phase 3: Local Search (Final Polishing)**

| Parameter | Value | Description |
|-----------|-------|-------------|
| Iterations | 1,000 | Quick refinement |
| Neighborhood Size | 10 | Focused improvements |

**Synergy:**
- GA finds promising regions globally
- Tabu Search intensifies in those regions
- Local Search ensures local optimum

---

## Evaluation Function

### Team Strength Calculation

Team strength is calculated as the sum of weighted player ratings:

```
Team Strength = Σ (Player Rating × Position Weight)
```

Position weights define relative importance (e.g., setter might have weight 1.2, libero 0.8).

### Base Score Components

| Component | Weight | Description |
|-----------|--------|-------------|
| Balance | 1.0 | Difference between strongest and weakest teams |
| Variance | 0.5 | Standard deviation of team strengths |
| Position Imbalance | 0.3 | Per-position strength differences |

**Combined Score** (lower is better):
```
Score = Balance + sqrt(Variance) × 0.5 + PositionImbalance × 0.3
```

---

## Advanced Metrics

Beyond basic balance, the optimizer evaluates four advanced dimensions:

### 1. Fairness Metric

Measures how evenly **top players** are distributed across teams.

**Calculation:**
1. Identify top 20% of players by weighted rating
2. Count top players per team
3. Calculate variance from ideal distribution

```
Ideal Count = Top Player Count / Team Count
Fairness Score = sqrt(Variance) × 100
```

**Example:**
- 12 players total, 3 teams → 4 top players
- Ideal: 1.33 top players per team
- Team A: 2 top players, Team B: 1, Team C: 1
- Variance: ((2-1.33)² + (1-1.33)² + (1-1.33)²) / 3 = 0.22
- Fairness Score: 47 (lower is better)

---

### 2. Consistency Metric

Measures stability of **position-level strength** across teams.

**Calculation:**
For each position:
1. Calculate average rating at that position for each team
2. Compute variance across teams
3. Weight by position importance

```
Consistency Score = sqrt(Weighted Position Variance)
```

**Example:** Setter position
- Team A setter: 1650 rating
- Team B setter: 1580 rating
- Team C setter: 1620 rating
- Average: 1617
- Variance: 817
- Consistency Score: 29 (lower is better)

---

### 3. Depth Metric

Measures strength of **backup players** at each position.

**Calculation:**
For positions with multiple players:
1. Exclude the top player
2. Calculate average rating of remaining players (depth players)
3. Compare depth across teams

```
Depth Score = Average Depth - sqrt(Depth Variance) × 10
```

Higher depth score is better (teams have similarly strong bench players).

---

### 4. Role Balance Metric

Ensures teams have similar **weighted role importance**.

**Calculation:**
```
Role Score = Σ (Rating × Weight²) / Team Size
```

Position weights are squared to emphasize key positions. The variance of role scores across teams forms the metric.

---

## Optimization Process

### Step-by-Step Flow

1. **Validation**: Verify sufficient players for required positions
2. **Player Pool Creation**: Build centralized player registry
3. **Initial Solutions**: Generate diverse starting configurations
4. **Parallel Execution**: Run all algorithms simultaneously
5. **Best Selection**: Choose solution with lowest score
6. **Local Search Refinement**: Polish the winning solution
7. **Final Output**: Return optimized team assignments

### Swap Operations

Two types of player swaps drive optimization:

**Universal Swap** (Random):
- Randomly selects two players from different teams
- Exchanges their positions
- Ensures position compatibility

**Adaptive Swap** (Intelligent):
- Identifies teams with highest/lowest strength
- Targets imbalanced positions
- Prefers swaps that improve balance

The ratio shifts during optimization:
- Early: 70% random, 30% adaptive (exploration)
- Late: 30% random, 70% adaptive (exploitation)

---

## Balance Quality Levels

After optimization, balance is classified:

| Level | Strength Difference | Description |
|-------|---------------------|-------------|
| Excellent | < 100 points | Nearly identical teams |
| Good | < 200 points | Minor differences |
| Fair | < 300 points | Noticeable but acceptable |
| Poor | > 500 points | Significant imbalance |

---

## Example: 3-Team Optimization

### Initial State

6 players, 2 positions (A, B), 3 teams:

| Player | Position A Rating | Position B Rating |
|--------|-------------------|-------------------|
| Alice  | 1800              | 1600              |
| Boris  | 1700              | 1650              |
| Carol  | 1600              | 1700              |
| David  | 1550              | 1750              |
| Elena  | 1500              | 1500              |
| Frank  | 1450              | 1550              |

Composition: 1 player at A, 1 player at B per team.

### Random Initial Assignment

| Team | Position A | Position B | Total |
|------|------------|------------|-------|
| 1    | Alice (1800) | Carol (1700) | 3500 |
| 2    | Boris (1700) | Elena (1500) | 3200 |
| 3    | Frank (1450) | David (1750) | 3200 |

**Balance:** 3500 - 3200 = 300 (Fair)

---

### After Optimization

| Team | Position A | Position B | Total |
|------|------------|------------|-------|
| 1    | Alice (1800) | Elena (1500) | 3300 |
| 2    | Carol (1600) | David (1750) | 3350 |
| 3    | Boris (1700) | Frank (1550) | 3250 |

**Balance:** 3350 - 3250 = 100 (Excellent)

---

### Optimization Steps

1. **Initial Score**: 300 (balance) + variance penalty
2. **Genetic Algorithm**: Found solution with score 180
3. **Tabu Search**: Found solution with score 150
4. **Simulated Annealing**: Found solution with score 120
5. **Best Selection**: Simulated Annealing wins
6. **Local Search**: Refined to score 100
7. **Final Result**: Excellent balance achieved

---

## Algorithm Selection Insights

### When Each Algorithm Excels

| Algorithm | Best For | Characteristic |
|-----------|----------|----------------|
| Genetic Algorithm | Large search spaces | Population-based diversity |
| Tabu Search | Avoiding cycles | Memory-guided exploration |
| Simulated Annealing | Escaping local minima | Probabilistic acceptance |
| Local Search | Final polish | Greedy improvement |
| Ant Colony | Learning from history | Pheromone-guided construction |
| Constraint Programming | Guaranteed validity | Backtracking with propagation |
| Hybrid | Balanced approach | Multi-phase optimization |

### Parallel Advantage

Running algorithms in parallel ensures:
- **Robustness**: Different algorithms find different solutions
- **Speed**: Wall-clock time equals slowest algorithm, not sum
- **Quality**: Best of multiple approaches is selected

---

## Configuration Adaptation

The optimizer automatically adjusts for problem size:

| Problem Size | Adjustment |
|--------------|------------|
| > 100 players | +50% Tabu iterations |
| > 100 players | +30% Annealing iterations |
| Few players | Higher mutation rates |

This ensures both small recreational games and large tournament brackets receive appropriate optimization effort.

