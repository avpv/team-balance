# TeamBalance MCP Server

MCP (Model Context Protocol) сервер для TeamBalance — системы создания сбалансированных команд с использованием ELO рейтинга.

## Возможности

- **Управление сессиями**: создание, список, экспорт/импорт сессий
- **Управление игроками**: добавление, удаление, массовое добавление
- **Система сравнений**: рекомендации следующей пары, запись результатов
- **ELO рейтинг**: автоматический расчёт рейтингов с адаптивным K-фактором
- **Генерация команд**: оптимизация баланса с учётом позиций и рейтингов
- **Поддержка 10+ видов спорта и киберспорта**

## Установка

```bash
cd mcp-server
npm install
npm run build
```

## Использование с Claude Desktop

Добавьте в `~/.config/claude/claude.json` (Linux/Mac) или `%AppData%\Claude\claude.json` (Windows):

```json
{
  "mcpServers": {
    "team-balance": {
      "command": "node",
      "args": ["/path/to/team-balance/mcp-server/build/index.js"]
    }
  }
}
```

## Доступные инструменты (Tools)

### Активности

| Tool | Описание |
|------|----------|
| `list_activities` | Список всех доступных активностей |
| `get_activity` | Подробная конфигурация активности |

### Сессии

| Tool | Описание |
|------|----------|
| `create_session` | Создать новую сессию |
| `list_sessions` | Список всех сессий |
| `get_session` | Информация о сессии |
| `set_active_session` | Установить активную сессию |
| `delete_session` | Удалить сессию |

### Игроки

| Tool | Описание |
|------|----------|
| `add_player` | Добавить игрока |
| `add_players_bulk` | Добавить несколько игроков |
| `list_players` | Список игроков в сессии |
| `remove_player` | Удалить игрока |

### Сравнения

| Tool | Описание |
|------|----------|
| `get_next_comparison` | Получить рекомендованную пару для сравнения |
| `record_comparison` | Записать результат сравнения |

### Рейтинги и команды

| Tool | Описание |
|------|----------|
| `get_rankings` | Рейтинги игроков по позициям |
| `generate_teams` | Сгенерировать сбалансированные команды |

### Экспорт/Импорт

| Tool | Описание |
|------|----------|
| `export_session` | Экспортировать сессию в JSON |
| `import_session` | Импортировать сессию из JSON |

## Доступные ресурсы (Resources)

| Resource | Описание |
|----------|----------|
| `session://current` | Информация о текущей сессии |
| `players://current` | Игроки текущей сессии |
| `activities://list` | Список активностей |

## Поддерживаемые активности

### Спорт
- `volleyball` — Волейбол (S, OPP, OH, MB, L)
- `basketball` — Баскетбол (PG, SG, SF, PF, C)
- `soccer` — 5-а-side футбол (GK, D, M, F)

### Киберспорт
- `leagueOfLegends` — League of Legends (TOP, JG, MID, ADC, SUP)
- `valorant` — Valorant (DUE, INI, CON, SEN)
- `counterStrike2` — CS2 (IGL, AWP, ENT, SUP, LUR)
- `dota2` — Dota 2 (P1-P5)

### Работа
- `workProject` — Проектная команда (TL, PM, BE, FE, UX, QA)

### Универсальные
- `team1`, `team2`, `team3` — Универсальные шаблоны

## Пример использования

```
# 1. Создать сессию
create_session activity="volleyball" name="Вечерняя игра"

# 2. Добавить игроков
add_player name="Иван" positions=["S", "OH"]
add_player name="Мария" positions=["OH", "MB"]
add_player name="Петр" positions=["MB", "L"]
...

# 3. Провести сравнения
get_next_comparison
# → player1: Иван, player2: Мария, position: OH

record_comparison player1Name="Иван" player2Name="Мария" winnerName="Мария" position="OH"

# 4. Сгенерировать команды
generate_teams teamCount=2 composition={"S": 1, "OH": 2, "MB": 2}
```

## Разработка

```bash
# Режим разработки
npm run dev

# Сборка
npm run build

# Тестирование с MCP Inspector
npm run inspector

# Проверка типов
npm run type-check
```

## Хранение данных

Данные хранятся в файле `data.json` в директории `mcp-server/`. Файл создаётся автоматически при первом использовании.

## Лицензия

MIT
