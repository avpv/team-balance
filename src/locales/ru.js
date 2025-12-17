// src/locales/ru.js
// Russian translations

export default {
    // Common
    common: {
        save: 'Сохранить',
        cancel: 'Отмена',
        close: 'Закрыть',
        confirm: 'Подтвердить',
        delete: 'Удалить',
        edit: 'Редактировать',
        reset: 'Сбросить',
        add: 'Добавить',
        remove: 'Удалить',
        import: 'Импорт',
        export: 'Экспорт',
        download: 'Скачать',
        copy: 'Копировать',
        loading: 'Загрузка...',
        search: 'Поиск',
        select: 'Выбрать',
        selectAll: 'Выбрать все',
        player: 'игрок',
        players: 'игроки',
        team: 'команда',
        teams: 'команды',
        position: 'Позиция',
        positions: 'Позиции',
        rating: 'Рейтинг',
        ratings: 'Рейтинги',
        comparisons: 'сравнения',
        comparisonsShort: 'сравн.',
        multiPosition: 'Мульти-поз',
        warning: 'Предупреждение',
        dangerZone: 'Опасная зона',
        yes: 'Да',
        no: 'Нет'
    },

    // Navigation
    nav: {
        settings: 'Настройки',
        compare: 'Сравнение',
        rankings: 'Рейтинги',
        teams: 'Команды'
    },

    // Settings Page
    settings: {
        title: 'Управление игроками',
        subtitle: 'Выберите активность, добавьте игроков и управляйте составом',

        // Activity Selector
        activity: {
            label: 'Тип активности',
            placeholder: 'Выберите вид спорта или активность...',
            recentActivities: 'Недавние активности',
            allActivities: 'Все активности',
            newTeam: 'Новая команда',
            newTeamTitle: 'Создать новую команду со своим списком игроков',
            helpText: 'Выберите вид спорта или активность, затем нажмите "Новая команда" для начала. Каждая команда имеет свой список игроков и сохраняется в боковой панели.',
            switchingTo: 'Переключение на {{activity}}...',
            willBeApplied: '{{activity}} будет применено при создании новой команды',
            newTeamCreated: 'Новая команда создана',
            invalidActivity: 'Выбрана недопустимая активность',
            selectFirst: 'Сначала выберите активность'
        },

        // Add Player Form
        addPlayers: {
            title: 'Добавить игроков',
            importPlayers: 'Импорт игроков',
            importBtn: 'Импорт',
            importHelp: 'Загрузите CSV или JSON файл с именами и позициями игроков',
            addIndividual: 'Добавить игроков вручную',
            playerName: 'Имя игрока',
            playerNamePlaceholder: 'напр., Иван Иванов',
            playerNameHelp: 'Введите полное имя игрока',
            positionsLabel: 'Позиции',
            positionsHint: '(выберите все подходящие)',
            positionsHelp: 'Выберите одну или несколько позиций, на которых может играть этот игрок',
            addPlayerBtn: 'Добавить игрока',
            bulkActions: 'Массовые действия',
            resetAllRatings: 'Сбросить все рейтинги',
            removeAllPlayers: 'Удалить всех игроков',
            bulkActionsWarning: 'Эти действия нельзя отменить. Используйте с осторожностью.'
        },

        // Player List
        playerList: {
            title: 'Текущие игроки',
            noPlayers: 'Игроки ещё не добавлены',
            addPlayersPrompt: 'Добавьте игроков с помощью формы выше',
            editPositions: 'Редактировать позиции',
            resetPlayer: 'Сбросить рейтинги',
            removePlayer: 'Удалить игрока'
        },

        // Position Stats
        positionStats: {
            title: 'Обзор позиций',
            playersAtPosition: '{{count}} игрок(ов) на этой позиции'
        },

        // Welcome Guide
        welcome: {
            title: 'Добро пожаловать в TeamBalance!',
            subtitle: 'Создавайте идеально сбалансированные команды. Начните с 4 простых шагов:',
            step1: 'Выберите вид спорта или активность',
            step1Detail: 'из выпадающего списка ниже',
            step2: 'Добавьте своих игроков',
            step2Detail: 'и назначьте им позиции',
            step3: 'Сравните игроков попарно',
            step3Detail: 'для построения точных рейтингов',
            step4: 'Автоматически сгенерируйте команды',
            step4Detail: 'одним нажатием'
        },

        // Modals
        modals: {
            editPositions: {
                title: 'Редактировать позиции - {{name}}',
                label: 'Позиции (выберите все подходящие):'
            },
            resetPlayer: {
                title: 'Сбросить игрока - {{name}}',
                label: 'Выберите позиции для сброса:',
                warning: 'Это сбросит рейтинг игрока до 1500 и очистит историю сравнений для выбранных позиций.'
            },
            resetAll: {
                title: 'Сбросить рейтинги всех игроков',
                label: 'Выберите позиции для сброса ВСЕХ игроков:',
                warning: 'Это сбросит ВСЕХ игроков до 1500 ELO и очистит ВСЮ историю сравнений для выбранных позиций. Это действие нельзя отменить!'
            },
            clearAll: {
                title: 'Удалить всех игроков',
                label: 'Выберите позиции для удаления ВСЕХ игроков:',
                warning: 'Это удалит ВСЕХ игроков на выбранных позициях. Все их данные, рейтинги и история будут удалены. Это действие нельзя отменить!'
            },
            importPlayers: {
                title: 'Импорт игроков',
                confirmBtn: 'Импортировать'
            }
        }
    },

    // Compare Page
    compare: {
        title: 'Сравнение игроков',
        subtitle: 'Создайте точные рейтинги игроков через попарные сравнения',

        // Position Selector
        positionSelector: {
            title: 'Выберите позицию',
            selectPosition: 'Выберите позицию для сравнения',
            pickPosition: 'Выберите позицию ниже, чтобы начать сравнивать игроков и строить рейтинг.',
            quickKeys: 'Горячие клавиши:',
            quickKeysHint: 'левый • правый • ничья',
            resetPosition: 'Сбросить сравнения позиции',
            resetAll: 'Сбросить все',
            progress: '{{completed}}/{{total}} сравнений',
            complete: 'Готово!',
            notEnoughPlayers: 'Недостаточно игроков',
            statusComplete: 'Завершено',
            statusInProgress: 'В процессе',
            statusReady: 'Готово к началу',
            noPlayersAtPosition: 'На позиции {{position}} ещё нет игроков. Добавьте игроков на странице настроек.'
        },

        // Comparison Area
        comparison: {
            whoIsBetter: 'Кто лучше на позиции',
            selectPosition: 'Выберите позицию выше, чтобы начать сравнивать игроков',
            needMorePlayers: 'Нужно минимум 2 игрока',
            needMorePlayersDetail: 'Добавьте больше игроков на этой позиции на странице настроек',
            allComplete: 'Все сравнения завершены!',
            allCompleteDetail: 'Отлично! Все сравнения игроков для {{position}} завершены.',
            suggestion: 'Попробуйте сравнить игроков на позиции {{position}}!',
            allPositionsComplete: 'Все позиции сравнены!',
            draw: 'Ничья',
            drawTooltip: 'Оба игрока равны (клавиша W)',
            leftKeyHint: 'Клавиша A',
            rightKeyHint: 'Клавиша D',
            positionComplete: 'Позиция завершена!',
            comparedCount: '{{count}} сравнений',
            compare: 'Сравнить',
            reset: 'Сбросить'
        },

        // Messages
        messages: {
            insufficientPlayers: '{{position}}: Нужно минимум 2 игрока для сравнения. Сейчас {{count}} игрок(ов) на этой позиции.',
            allCompared: '{{position}}: Все сравнения для этой позиции завершены.',
            resetConfirm: 'Вы уверены, что хотите сбросить все сравнения для {{position}}? Это действие нельзя отменить.',
            resetSuccess: 'Сравнения для {{position}} сброшены'
        },

        // Reset Modal
        resetModal: {
            title: 'Сбросить все сравнения',
            label: 'Выберите позиции для сброса сравнений:',
            warning: 'Это сбросит всю историю сравнений для выбранных позиций. Рейтинги игроков будут пересчитаны до 1500. Это действие нельзя отменить!'
        }
    },

    // Rankings Page
    rankings: {
        title: 'Рейтинги игроков',
        subtitle: 'Просмотр и сравнение рейтингов игроков по всем позициям',
        playersRanked: '{{count}} игрок(ов) в рейтинге',

        // Position Filter
        positionFilter: {
            all: 'Все позиции',
            filterBy: 'Фильтр по позиции'
        },

        // Rankings Table
        table: {
            rank: 'Место',
            player: 'Игрок',
            position: 'Позиция',
            rating: 'Рейтинг',
            comparisons: 'Сравнения',
            noPlayers: 'Нет игроков для ранжирования',
            addPlayersPrompt: 'Добавьте игроков на странице настроек для просмотра рейтингов'
        }
    },

    // Teams Page
    teams: {
        title: 'Создание сбалансированных команд',
        subtitle: 'Настройте состав и веса команды, затем сгенерируйте оптимально сбалансированные команды с помощью математических алгоритмов',

        // Team Builder
        builder: {
            numberOfTeams: 'Количество команд',
            numberOfTeamsHelp: 'Выберите сколько команд создать ({{min}}-{{max}})',
            composition: 'Состав команды и веса',
            compositionHelp: 'Укажите количество игроков на позиции и их важность (больший вес = важнее для баланса)',
            configLabel: 'Конфигурация построителя команд',
            compositionConfigLabel: 'Настройка состава команды',
            teamCountLabel: 'Количество команд для создания',
            position: 'Позиция',
            count: 'Кол-во',
            countTooltip: 'Игроков на команду на этой позиции',
            playerCountLabel: 'Количество {{position}} на команду',
            weight: 'Вес',
            weightTooltip: 'Приоритет баланса (1.0-3.0, выше = важнее)',
            positionWeightLabel: 'Вес позиции {{position}}',
            generateBtn: 'Сгенерировать команды',
            generating: 'Генерация команд...',
            optimizingLabel: 'Оптимизация команд...',
            needMorePlayers: 'Добавьте минимум 2 игроков на странице настроек для создания команд'
        },

        // Generated Teams
        results: {
            title: 'Ваши сбалансированные команды',
            teamsGenerated: '{{count}} команд создано',
            regionLabel: 'Результаты генерации команд',
            showEloRatings: 'Показать ELO рейтинги',
            showPositions: 'Показать позиции',
            toggleEloLabel: 'Переключить видимость ELO рейтингов',
            togglePositionsLabel: 'Переключить видимость позиций игроков',
            exportBtn: 'Экспорт',
            exportLabel: 'Экспортировать команды в файл',
            balanceQuality: 'Качество баланса команд:',
            eloDifference: '{{value}} ELO средняя разница',
            teamNumber: 'Команда {{number}}',
            excellent: 'Отлично',
            veryGood: 'Очень хорошо',
            good: 'Хорошо',
            fair: 'Нормально',
            poor: 'Плохо',
            excellentMsg: 'Отличный баланс!',
            goodMsg: 'Хороший баланс',
            poorMsg: 'Попробуйте перегенерировать для лучшего баланса',
            lowerIsBetter: 'Меньшая разница означает более равные команды.'
        },

        // Export Modal
        export: {
            title: 'Экспорт команд',
            formatText: 'Текст',
            formatCsv: 'CSV',
            formatJson: 'JSON',
            copyBtn: 'Копировать',
            downloadBtn: 'Скачать',
            copiedSuccess: 'Скопировано в буфер обмена!',
            exportSuccess: 'Команды экспортированы!',
            exportAs: 'Экспорт как {{format}}',
            preview: 'Предпросмотр'
        }
    },

    // Sidebar
    sidebar: {
        title: 'Недавние команды',
        noTeams: 'Команд пока нет',
        createFirst: 'Создайте свою первую команду',
        deleteTeam: 'Удалить команду',
        deleteConfirm: 'Удалить эту команду?',
        deleteConfirmWithPlayers: 'Удалить команду с {{count}} игроками?',
        deletedMessage: 'Команда удалена. Выберите команду в боковой панели для продолжения.',
        allDeletedMessage: 'Все команды удалены. Выберите активность для продолжения.'
    },

    // Import Wizard
    import: {
        selectSource: 'Выберите источник импорта',
        textInput: 'Текстовый ввод',
        textInputDesc: 'Вставьте CSV или JSON данные напрямую',
        fileUpload: 'Загрузка файла',
        fileUploadDesc: 'Загрузите CSV или JSON файл',
        apiImport: 'Импорт из API',
        apiImportDesc: 'Импорт из внешнего API',
        dropFile: 'Перетащите файл сюда или нажмите для выбора',
        supportedFormats: 'Поддерживаемые форматы: CSV, JSON',
        delimiter: 'Разделитель',
        preview: 'Предпросмотр',
        foundPlayers: 'Найдено {{count}} игрок(ов)',
        noData: 'Пожалуйста, предоставьте данные для импорта',
        noPlayersFound: 'Игроки не найдены',
        importSuccess: 'Импортировано {{imported}} игрок(ов)',
        importSuccessWithSkipped: 'Импортировано {{imported}} игрок(ов), пропущено {{skipped}}',
        importFailed: 'Импорт не удался',
        back: 'Назад',
        // File Import
        csvUploadTitle: 'Загрузить CSV файл',
        jsonUploadTitle: 'Загрузить JSON файл',
        fieldDelimiter: 'Разделитель полей',
        delimiterHint: 'Выберите способ разделения полей',
        comma: 'Запятая (,)',
        tab: 'Табуляция (\\t)',
        semicolon: 'Точка с запятой (;)',
        clickToSelect: 'Нажмите для выбора файла',
        orDragAndDrop: 'или перетащите сюда',
        expectedFormat: 'Ожидаемый формат',
        csvExample: 'Пример CSV',
        jsonExample: 'Пример JSON',
        csvFormatNote: 'CSV файлы должны иметь строку заголовка с колонками "name" и "positions".',
        jsonFormatNote: 'JSON файлы должны содержать массив объектов с полями "name" и "positions".',
        browseFiles: 'Выбрать файлы',
        changeFile: 'Изменить файл',
        copied: 'Скопировано!',
        // Text Import
        pasteOrType: 'Вставьте или введите данные игроков',
        playerData: 'Данные игроков',
        pasteDataPlaceholder: 'Вставьте CSV или JSON данные сюда...',
        examples: 'Примеры',
        csvFormat: 'Формат CSV',
        jsonFormat: 'Формат JSON',
        namesOnly: 'Только имена',
        allPositionsAssigned: 'Все позиции будут назначены',
        // API Import
        fetchFromUrl: 'Получить из URL',
        url: 'URL',
        urlHint: 'Введите URL ваших JSON данных',
        fetchData: 'Получить данные',
        fetching: 'Загрузка...',
        authentication: 'Аутентификация',
        authHint: 'Выберите метод аутентификации при необходимости',
        authNone: 'Без аутентификации (публичный URL)',
        authBearer: 'Bearer токен',
        authApiKey: 'API ключ',
        authBasic: 'Basic аутентификация',
        authCustomHeaders: 'Пользовательские заголовки',
        expectedJsonFormat: 'Ожидаемый формат JSON',
        responseExample: 'Пример ответа',
        notes: 'Примечания',
        noteJsonRequired: 'URL должен возвращать JSON данные',
        noteArrayRequired: 'Ответ должен быть массивом объектов игроков',
        noteFieldsRequired: 'Каждый объект должен иметь поля "name" и "positions"',
        noteCorsRequired: 'На сервере должен быть включён CORS',
        urlRequired: 'Пожалуйста, введите URL',
        invalidUrl: 'Неверный URL',
        invalidUrlDetail: 'Пожалуйста, введите корректный URL (например, https://example.com/data.json)',
        fetchingFrom: 'Получение данных из {{url}}...',
        fetchSuccess: 'Данные успешно получены!',
        fetchedItems: 'Получено {{count}} элемент(ов) из URL.',
        fetchFailed: 'Не удалось получить данные',
        fileReadError: 'Ошибка чтения файла'
    },

    // Error Messages
    errors: {
        dataIncomplete: 'Данные игрока неполные. Проверьте список игроков.',
        loadFailed: 'Не удалось загрузить следующее сравнение. Попробуйте снова.',
        selectPosition: 'Выберите хотя бы одну позицию',
        selectActivity: 'Сначала выберите тип активности',
        selectPlayerPerTeam: 'Выберите хотя бы одного игрока на команду',
        exportFailed: 'Экспорт не удался',
        playerNotFound: 'Игрок не найден',
        invalidJson: 'Неверный формат JSON',
        noDataToImport: 'Нет данных для импорта',
        unexpectedError: 'Произошла непредвиденная ошибка'
    },

    // Success Messages
    success: {
        winWin: 'Ничья записана',
        exportComplete: 'Команды экспортированы!',
        resetComplete: '{{count}} сравнений сброшено',
        playerAdded: 'Игрок "{{name}}" добавлен!',
        playerRemoved: 'Игрок "{{name}}" удалён',
        playerUpdated: 'Игрок "{{name}}" обновлён',
        positionsUpdated: 'Позиции обновлены для {{name}}',
        removedPlayers: 'Удалено {{count}} игрок(ов)',
        dataMigrated: 'Данные перенесены в версию {{version}}',
        teamsCreated: 'Команды созданы! Баланс: {{balance}} взвешенная разница ELO'
    },

    // Info Messages
    info: {
        noComparisons: 'Нет сравнений для сброса',
        optimizing: 'Оптимизация команд... Это может занять некоторое время',
        reloading: 'Перезагрузка...'
    },

    // Titles
    titles: {
        status: 'Статус',
        dataError: 'Ошибка данных',
        applicationError: 'Ошибка приложения',
        reloadPage: 'Перезагрузить страницу',
        failedToLoad: 'Не удалось загрузить {{name}}'
    },

    // Language names (for language selector)
    languages: {
        en: 'Английский',
        ru: 'Русский',
        es: 'Испанский',
        fr: 'Французский',
        de: 'Немецкий',
        ja: 'Японский',
        zh: 'Китайский',
        selectLanguage: 'Выберите язык'
    }
};
