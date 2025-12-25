# Elo Rating Methodology

## Introduction

The Elo rating system is used to evaluate the relative strength of players based on pairwise comparisons. Originally developed for chess, this system has been adapted to rate players by position in team sports.

---

## Core Principles

### Initial Rating

Every new player starts with a rating of **1500** — the neutral point on a scale from 0 to 3000.

### System Concept

Instead of absolute skill assessment, the system compares players in pairs: "Who is stronger — Player A or Player B?" Based on comparison results, ratings are adjusted: the winner gains points, the loser loses points.

---

## Calculation Formula

### Expected Score

Before each comparison, the system calculates the **expected win probability** for each player:

```
Expected Score = 1 / (1 + 10^((Opponent Rating − Player Rating) / 400))
```

The number 400 is the standard Elo divisor that determines sensitivity to rating differences.

**Expected Score Examples:**

| Rating Difference | Expected Score for Stronger Player |
|-------------------|-------------------------------------|
| 0 (equal)         | 50%                                 |
| 100 points        | 64%                                 |
| 200 points        | 76%                                 |
| 400 points        | 91%                                 |

### Rating Change

After a comparison, ratings are updated using the formula:

```
Rating Change = K × (Actual Result − Expected Result)
```

Where:
- **Actual Result**: 1 for winner, 0 for loser
- **K-factor**: volatility coefficient (see below)

---

## K-Factor (Volatility Coefficient)

The K-factor determines how much a single comparison affects the rating. The system uses a **dynamic K-factor** that depends on player experience and skill level:

| Category | K-Factor | Conditions |
|----------|----------|------------|
| Novice   | 40       | Less than 20 comparisons |
| Base     | 30       | Experienced player (default) |
| Expert   | 20       | Rating > 1800 and > 30 comparisons |
| Master   | 15       | Rating > 2000 and > 50 comparisons |

**Logic:** Newcomers quickly find their "true" level thanks to a high K-factor. Experienced players with established ratings see more gradual changes.

### Pool Size Adjustment

If there are few players at a position, the K-factor increases to compensate for fewer possible comparisons:

```
Adjustment Factor = √(15 / number of players at position)
```

The coefficient is bounded between 0.5 and 2.0.

---

## Example: Comparison Iterations

Consider three players at the "Defender" position, all starting with a rating of 1500.

### Initial State

| Player  | Rating | Comparisons |
|---------|--------|-------------|
| Alex    | 1500   | 0           |
| Boris   | 1500   | 0           |
| Victor  | 1500   | 0           |

---

### Iteration 1: Alex vs Boris

**Question:** Who is stronger at the defender position — Alex or Boris?
**Answer:** Alex

**Calculation:**

1. Expected scores (ratings are equal):
   - Alex: 1 / (1 + 10^((1500−1500)/400)) = 1 / (1 + 1) = **0.50**
   - Boris: **0.50**

2. K-factor: 40 (both are novices, fewer than 20 comparisons)

3. Rating changes:
   - Alex (won): 40 × (1 − 0.50) = **+20**
   - Boris (lost): 40 × (0 − 0.50) = **−20**

**Result:**

| Player  | Rating | Comparisons |
|---------|--------|-------------|
| Alex    | 1520   | 1           |
| Boris   | 1480   | 1           |
| Victor  | 1500   | 0           |

---

### Iteration 2: Alex vs Victor

**Question:** Who is stronger — Alex or Victor?
**Answer:** Alex

**Calculation:**

1. Expected scores:
   - Alex: 1 / (1 + 10^((1500−1520)/400)) = 1 / (1 + 10^(−0.05)) ≈ **0.53**
   - Victor: ≈ **0.47**

2. K-factor: 40

3. Rating changes:
   - Alex: 40 × (1 − 0.53) = **+19**
   - Victor: 40 × (0 − 0.47) = **−19**

**Result:**

| Player  | Rating | Comparisons |
|---------|--------|-------------|
| Alex    | 1539   | 2           |
| Boris   | 1480   | 1           |
| Victor  | 1481   | 1           |

---

### Iteration 3: Boris vs Victor

**Question:** Who is stronger — Boris or Victor?
**Answer:** Victor

**Calculation:**

1. Expected scores:
   - Boris: 1 / (1 + 10^((1481−1480)/400)) ≈ **0.50**
   - Victor: ≈ **0.50**

2. K-factor: 40

3. Rating changes:
   - Boris: 40 × (0 − 0.50) = **−20**
   - Victor: 40 × (1 − 0.50) = **+20**

**Result after first round:**

| Player  | Rating | Comparisons |
|---------|--------|-------------|
| Alex    | 1539   | 2           |
| Victor  | 1501   | 2           |
| Boris   | 1460   | 2           |

---

### Iteration 4: Victor vs Alex (second round)

**Question:** Who is stronger — Victor or Alex?
**Answer:** Victor (upset — underdog wins)

**Calculation:**

1. Expected scores:
   - Victor: 1 / (1 + 10^((1539−1501)/400)) ≈ **0.45**
   - Alex: ≈ **0.55**

2. K-factor: 40

3. Rating changes:
   - Victor: 40 × (1 − 0.45) = **+22** (more points for beating the favorite)
   - Alex: 40 × (0 − 0.55) = **−22** (more loss for losing to the underdog)

**Result:**

| Player  | Rating | Comparisons |
|---------|--------|-------------|
| Victor  | 1523   | 3           |
| Alex    | 1517   | 3           |
| Boris   | 1460   | 2           |

---

## Key Observations

### Upset Effect

When a "weaker" player defeats a "stronger" one:
- The winner gains **more points** than when beating an equal opponent
- The loser loses **more points** than when losing to an equal opponent

This is the key mechanism of the Elo system: unexpected results have a stronger impact on ratings.

### Rating Convergence

As the number of comparisons increases:
1. Ratings stabilize around the player's "true" level
2. K-factor decreases, reducing volatility
3. Rankings become more reliable

### Separate Ratings by Position

Each player has **independent ratings** for each position. A player can be a master at one position and a novice at another.

---

## Confidence Levels

The system evaluates rating reliability based on the percentage of completed comparisons:

| Level      | Comparisons Completed |
|------------|----------------------|
| Very Low   | 0–19%                |
| Low        | 20–39%               |
| Medium     | 40–59%               |
| High       | 60–79%               |
| Very High  | 80%+                 |

Maximum number of comparisons for N players: **N × (N−1) / 2**

---

## Application in Team Balancing

After accumulating enough comparisons, ratings are used to create balanced teams:

- **Excellent balance**: difference < 100 points
- **Good balance**: difference < 200 points
- **Fair balance**: difference < 300 points
- **Poor balance**: difference > 500 points

The team optimizer aims to minimize the difference in total ratings between teams.
