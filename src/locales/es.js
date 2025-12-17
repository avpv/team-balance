// src/locales/es.js
// Spanish translations - Traducciones al español

export default {
    // Common
    common: {
        save: 'Guardar',
        cancel: 'Cancelar',
        close: 'Cerrar',
        confirm: 'Confirmar',
        delete: 'Eliminar',
        edit: 'Editar',
        reset: 'Restablecer',
        add: 'Agregar',
        remove: 'Eliminar',
        import: 'Importar',
        export: 'Exportar',
        download: 'Descargar',
        copy: 'Copiar',
        loading: 'Cargando...',
        search: 'Buscar',
        select: 'Seleccionar',
        selectAll: 'Seleccionar todo',
        player: 'jugador',
        players: 'jugadores',
        team: 'equipo',
        teams: 'equipos',
        position: 'Posición',
        positions: 'Posiciones',
        rating: 'Puntuación',
        ratings: 'Puntuaciones',
        comparisons: 'comparaciones',
        comparisonsShort: 'comp.',
        multiPosition: 'Multi-pos',
        warning: 'Advertencia',
        dangerZone: 'Zona de peligro',
        yes: 'Sí',
        no: 'No'
    },

    // Navigation
    nav: {
        settings: 'Configuración',
        compare: 'Comparar',
        rankings: 'Rankings',
        teams: 'Equipos'
    },

    // Settings Page
    settings: {
        title: 'Gestión de Jugadores',
        subtitle: 'Selecciona tu actividad, agrega jugadores y administra tu plantilla',

        // Activity Selector
        activity: {
            label: 'Tipo de Actividad',
            placeholder: 'Selecciona un deporte o actividad...',
            recentActivities: 'Actividades Recientes',
            allActivities: 'Todas las Actividades',
            newTeam: 'Nuevo Equipo',
            newTeamTitle: 'Crear un nuevo equipo con su propia lista de jugadores',
            helpText: 'Elige tu deporte o actividad, luego haz clic en "Nuevo Equipo" para comenzar. Cada equipo tiene su propia lista de jugadores y se guarda en la barra lateral.',
            switchingTo: 'Cambiando a {{activity}}...',
            willBeApplied: '{{activity}} se aplicará cuando crees un nuevo equipo',
            newTeamCreated: 'Nuevo equipo creado',
            invalidActivity: 'Actividad seleccionada no válida',
            selectFirst: 'Por favor, selecciona una actividad primero'
        },

        // Add Player Form
        addPlayers: {
            title: 'Agregar Jugadores',
            importPlayers: 'Importar Jugadores',
            importBtn: 'Importar',
            importHelp: 'Sube un archivo CSV o JSON con los nombres y posiciones de tus jugadores',
            addIndividual: 'Agregar Jugadores Individualmente',
            playerName: 'Nombre del Jugador',
            playerNamePlaceholder: 'ej., Juan García',
            playerNameHelp: 'Ingresa el nombre completo del jugador',
            positionsLabel: 'Posiciones',
            positionsHint: '(selecciona todas las que apliquen)',
            positionsHelp: 'Selecciona una o más posiciones que este jugador puede ocupar',
            addPlayerBtn: 'Agregar Jugador',
            bulkActions: 'Acciones Masivas',
            resetAllRatings: 'Restablecer Todas las Puntuaciones',
            removeAllPlayers: 'Eliminar Todos los Jugadores',
            bulkActionsWarning: 'Estas acciones no se pueden deshacer. Usa con precaución.'
        },

        // Player List
        playerList: {
            title: 'Jugadores Actuales',
            noPlayers: 'No se han agregado jugadores aún',
            addPlayersPrompt: 'Agrega jugadores usando el formulario de arriba',
            editPositions: 'Editar posiciones',
            resetPlayer: 'Restablecer puntuaciones',
            removePlayer: 'Eliminar jugador'
        },

        // Position Stats
        positionStats: {
            title: 'Resumen de Posiciones',
            playersAtPosition: '{{count}} jugador(es) en esta posición'
        },

        // Welcome Guide
        welcome: {
            title: '¡Bienvenido a TeamBalance!',
            subtitle: 'Crea equipos perfectamente equilibrados. Comienza en 4 sencillos pasos:',
            step1: 'Selecciona tu deporte o actividad',
            step1Detail: 'del menú desplegable de abajo para comenzar',
            step2: 'Agrega tus jugadores',
            step2Detail: 'y asigna sus posiciones',
            step3: 'Compara jugadores cara a cara',
            step3Detail: 'para construir puntuaciones de habilidad precisas',
            step4: 'Genera equipos equilibrados automáticamente',
            step4Detail: 'con un solo clic'
        },

        // Modals
        modals: {
            editPositions: {
                title: 'Editar Posiciones - {{name}}',
                label: 'Posiciones (selecciona todas las aplicables):'
            },
            resetPlayer: {
                title: 'Restablecer Jugador - {{name}}',
                label: 'Selecciona las posiciones a restablecer:',
                warning: 'Esto restablecerá la puntuación del jugador a 1500 y borrará el historial de comparaciones para las posiciones seleccionadas.'
            },
            resetAll: {
                title: 'Restablecer Puntuaciones de Todos los Jugadores',
                label: 'Selecciona las posiciones a restablecer para TODOS los jugadores:',
                warning: '¡Esto restablecerá TODOS los jugadores a 1500 ELO y borrará TODO el historial de comparaciones para las posiciones seleccionadas. Esta acción no se puede deshacer!'
            },
            clearAll: {
                title: 'Eliminar Todos los Jugadores',
                label: 'Selecciona las posiciones de las que eliminar TODOS los jugadores:',
                warning: '¡Esto eliminará TODOS los jugadores que juegan en las posiciones seleccionadas. Se borrarán todos sus datos, puntuaciones e historial. Esta acción no se puede deshacer!'
            },
            importPlayers: {
                title: 'Importar Jugadores',
                confirmBtn: 'Importar'
            }
        }
    },

    // Compare Page
    compare: {
        title: 'Comparar Jugadores',
        subtitle: 'Construye puntuaciones precisas de jugadores a través de comparaciones directas',

        // Position Selector
        positionSelector: {
            title: 'Seleccionar Posición',
            selectPosition: 'Seleccionar Posición para Comparar',
            pickPosition: 'Elige una posición abajo para comenzar a comparar jugadores cara a cara y construir tu ranking.',
            quickKeys: 'Teclas rápidas:',
            quickKeysHint: 'izquierda • derecha • empate',
            resetPosition: 'Restablecer comparaciones de posición',
            resetAll: 'Restablecer Todo',
            progress: '{{completed}}/{{total}} comparaciones',
            complete: '¡Completo!',
            notEnoughPlayers: 'No hay suficientes jugadores',
            statusComplete: 'Completo',
            statusInProgress: 'En Progreso',
            statusReady: 'Listo',
            noPlayersAtPosition: 'No hay jugadores asignados a la posición {{position}} todavía. Agrega jugadores en la página de Configuración.'
        },

        // Comparison Area
        comparison: {
            whoIsBetter: '¿Quién es mejor en',
            selectPosition: 'Selecciona una posición arriba para comenzar a comparar jugadores',
            needMorePlayers: 'Se necesitan al menos 2 jugadores',
            needMorePlayersDetail: 'Agrega más jugadores en esta posición en la página de Configuración para comenzar a comparar',
            allComplete: '¡Todas las comparaciones terminadas!',
            allCompleteDetail: '¡Buen trabajo! Todas las comparaciones de jugadores para {{position}} están completas.',
            suggestion: '¡Intenta comparar jugadores de {{position}} a continuación!',
            allPositionsComplete: '¡Todas las posiciones están completas!',
            draw: 'Empate',
            drawTooltip: 'Ambos jugadores son igualmente hábiles (tecla W)',
            leftKeyHint: 'Tecla A',
            rightKeyHint: 'Tecla D',
            positionComplete: '¡Posición Completa!',
            comparedCount: '{{count}} comparaciones',
            compare: 'Comparar',
            reset: 'Restablecer'
        },

        // Messages
        messages: {
            insufficientPlayers: '{{position}}: Se necesitan al menos 2 jugadores para comparar. Actualmente {{count}} jugador(es) en esta posición.',
            allCompared: '{{position}}: Todas las comparaciones han sido completadas para esta posición.',
            resetConfirm: '¿Estás seguro de que deseas restablecer todas las comparaciones para {{position}}? Esto no se puede deshacer.',
            resetSuccess: 'Las comparaciones de {{position}} han sido restablecidas'
        },

        // Reset Modal
        resetModal: {
            title: 'Restablecer Todas las Comparaciones',
            label: 'Selecciona las posiciones para restablecer comparaciones:',
            warning: '¡Esto restablecerá todo el historial de comparaciones para las posiciones seleccionadas. Las puntuaciones de los jugadores se recalcularán a 1500. Esta acción no se puede deshacer!'
        }
    },

    // Rankings Page
    rankings: {
        title: 'Rankings de Jugadores',
        subtitle: 'Ve y compara las puntuaciones de habilidad de los jugadores en todas las posiciones',
        playersRanked: '{{count}} jugador(es) clasificado(s)',
        noPlayersAtPosition: 'No hay jugadores asignados a la posición {{position}} todavía. Agrega jugadores en la página de Configuración.',

        // Position Filter
        positionFilter: {
            all: 'Todas las Posiciones',
            filterBy: 'Filtrar por posición'
        },

        // Rankings Table
        table: {
            rank: 'Rango',
            player: 'Jugador',
            position: 'Posición',
            rating: 'Puntuación',
            comparisons: 'Comparaciones',
            noPlayers: 'No hay jugadores para clasificar',
            addPlayersPrompt: 'Agrega jugadores en la página de Configuración para ver los rankings'
        }
    },

    // Teams Page
    teams: {
        title: 'Crear Equipos Equilibrados',
        subtitle: 'Configura la composición del equipo y los pesos, luego genera equipos óptimamente equilibrados usando algoritmos matemáticos',

        // Team Builder
        builder: {
            numberOfTeams: 'Número de Equipos',
            numberOfTeamsHelp: 'Elige cuántos equipos crear ({{min}}-{{max}})',
            composition: 'Composición del Equipo y Pesos',
            compositionHelp: 'Establece cuántos jugadores por posición y su peso de importancia (mayor peso = más importante para el equilibrio)',
            configLabel: 'Configuración del constructor de equipos',
            compositionConfigLabel: 'Configuración de composición del equipo',
            teamCountLabel: 'Número de equipos a crear',
            position: 'Posición',
            count: 'Cantidad',
            countTooltip: 'Jugadores por equipo en esta posición',
            playerCountLabel: 'Número de {{position}} por equipo',
            weight: 'Peso',
            weightTooltip: 'Prioridad de equilibrio (1.0-3.0, mayor = más importante)',
            positionWeightLabel: 'Peso de la posición {{position}}',
            generateBtn: 'Generar Equipos Equilibrados',
            generating: 'Generando Equipos...',
            optimizingLabel: 'Optimizando equipos...',
            needMorePlayers: 'Agrega al menos 2 jugadores en la página de Configuración para crear equipos'
        },

        // Generated Teams
        results: {
            title: 'Tus Equipos Equilibrados',
            teamsGenerated: '{{count}} equipos generados',
            regionLabel: 'Resultados de equipos generados',
            showEloRatings: 'Mostrar Puntuaciones ELO',
            showPositions: 'Mostrar Posiciones',
            toggleEloLabel: 'Alternar visibilidad de puntuaciones ELO',
            togglePositionsLabel: 'Alternar visibilidad de posiciones',
            exportBtn: 'Exportar',
            exportLabel: 'Exportar equipos a archivo',
            balanceQuality: 'Calidad del Equilibrio del Equipo:',
            eloDifference: '{{value}} diferencia promedio de ELO',
            teamNumber: 'Equipo {{number}}',
            excellent: 'Excelente',
            veryGood: 'Muy Bueno',
            good: 'Bueno',
            fair: 'Regular',
            poor: 'Pobre',
            excellentMsg: '¡Excelente equilibrio!',
            goodMsg: 'Buen equilibrio',
            poorMsg: 'Considera regenerar para mejor equilibrio',
            lowerIsBetter: 'Menor diferencia significa equipos más parejos.'
        },

        // Export Modal
        export: {
            title: 'Exportar Equipos',
            formatText: 'Texto Plano',
            formatCsv: 'CSV',
            formatJson: 'JSON',
            copyBtn: 'Copiar',
            downloadBtn: 'Descargar',
            copiedSuccess: '¡Copiado al portapapeles!',
            exportSuccess: '¡Equipos exportados!',
            exportAs: 'Exportar como {{format}}',
            preview: 'Vista previa'
        }
    },

    // Sidebar
    sidebar: {
        title: 'Equipos Recientes',
        noTeams: 'Aún no hay equipos',
        createFirst: 'Crea tu primer equipo',
        deleteTeam: 'Eliminar equipo',
        deleteConfirm: '¿Eliminar este equipo?',
        deleteConfirmWithPlayers: '¿Eliminar equipo con {{count}} jugadores?',
        deletedMessage: 'Equipo eliminado. Selecciona un equipo de la barra lateral para continuar.',
        allDeletedMessage: 'Todos los equipos eliminados. Por favor, selecciona una actividad para continuar.'
    },

    // Import Wizard
    import: {
        selectSource: 'Seleccionar Fuente de Importación',
        textInput: 'Entrada de Texto',
        textInputDesc: 'Pega datos CSV o JSON directamente',
        fileUpload: 'Subir Archivo',
        fileUploadDesc: 'Sube un archivo CSV o JSON',
        apiImport: 'Importar desde API',
        apiImportDesc: 'Importar desde API externa',
        dropFile: 'Suelta un archivo aquí o haz clic para explorar',
        supportedFormats: 'Formatos soportados: CSV, JSON',
        delimiter: 'Delimitador',
        preview: 'Vista Previa',
        foundPlayers: 'Se encontraron {{count}} jugador(es)',
        noData: 'Por favor proporciona datos para importar',
        noPlayersFound: 'No se encontraron jugadores',
        importSuccess: 'Se importaron {{imported}} jugador(es)',
        importSuccessWithSkipped: 'Se importaron {{imported}} jugador(es), se omitieron {{skipped}}',
        importFailed: 'La importación falló',
        back: 'Volver',
        // File Import
        csvUploadTitle: 'Subir archivo CSV',
        jsonUploadTitle: 'Subir archivo JSON',
        fieldDelimiter: 'Delimitador de campos',
        delimiterHint: 'Elige cómo se separan los campos',
        comma: 'Coma (,)',
        tab: 'Tabulación (\\t)',
        semicolon: 'Punto y coma (;)',
        clickToSelect: 'Haz clic para seleccionar un archivo',
        orDragAndDrop: 'o arrastra y suelta aquí',
        expectedFormat: 'Formato esperado',
        csvExample: 'Ejemplo CSV',
        jsonExample: 'Ejemplo JSON',
        csvFormatNote: 'Los archivos CSV deben tener una fila de encabezado con las columnas "name" y "positions".',
        jsonFormatNote: 'Los archivos JSON deben contener un array de objetos con los campos "name" y "positions".',
        browseFiles: 'Explorar archivos',
        changeFile: 'Cambiar archivo',
        copied: '¡Copiado!',
        // Text Import
        pasteOrType: 'Pega o escribe datos de jugadores',
        playerData: 'Datos de jugadores',
        pasteDataPlaceholder: 'Pega datos CSV o JSON aquí...',
        examples: 'Ejemplos',
        csvFormat: 'Formato CSV',
        jsonFormat: 'Formato JSON',
        namesOnly: 'Solo nombres',
        allPositionsAssigned: 'Se asignarán todas las posiciones',
        // API Import
        fetchFromUrl: 'Obtener desde URL',
        url: 'URL',
        urlHint: 'Ingresa la URL de tus datos JSON',
        fetchData: 'Obtener datos',
        fetching: 'Obteniendo...',
        authentication: 'Autenticación',
        authHint: 'Selecciona el método de autenticación si es necesario',
        authNone: 'Ninguna (URL pública)',
        authBearer: 'Token Bearer',
        authApiKey: 'Clave API',
        authBasic: 'Autenticación básica',
        authCustomHeaders: 'Encabezados personalizados',
        expectedJsonFormat: 'Formato JSON esperado',
        responseExample: 'Ejemplo de respuesta',
        notes: 'Notas',
        noteJsonRequired: 'La URL debe devolver datos JSON',
        noteArrayRequired: 'La respuesta debe ser un array de objetos de jugadores',
        noteFieldsRequired: 'Cada objeto debe tener los campos "name" y "positions"',
        noteCorsRequired: 'CORS debe estar habilitado en el servidor',
        urlRequired: 'Por favor ingresa una URL',
        invalidUrl: 'URL inválida',
        invalidUrlDetail: 'Por favor ingresa una URL válida (ej., https://example.com/data.json)',
        fetchingFrom: 'Obteniendo datos de {{url}}...',
        fetchSuccess: '¡Datos obtenidos exitosamente!',
        fetchedItems: 'Se obtuvieron {{count}} elemento(s) de la URL.',
        fetchFailed: 'Error al obtener datos',
        fileReadError: 'Error al leer el archivo'
    },

    // Error Messages
    errors: {
        dataIncomplete: 'Los datos del jugador están incompletos. Por favor revisa tu lista de jugadores.',
        loadFailed: 'No se pudo cargar la siguiente comparación. Por favor intenta de nuevo.',
        selectPosition: 'Por favor selecciona al menos una posición',
        selectActivity: 'Por favor selecciona un tipo de actividad primero',
        selectPlayerPerTeam: 'Por favor selecciona al menos un jugador por equipo',
        exportFailed: 'La exportación falló',
        playerNotFound: 'Jugador no encontrado',
        invalidJson: 'Formato JSON no válido',
        noDataToImport: 'No hay datos para importar',
        unexpectedError: 'Ocurrió un error inesperado'
    },

    // Success Messages
    success: {
        winWin: 'Empate registrado',
        exportComplete: '¡Equipos exportados!',
        resetComplete: '{{count}} comparaciones han sido restablecidas',
        playerAdded: '¡Jugador "{{name}}" agregado!',
        playerRemoved: 'Jugador "{{name}}" eliminado',
        playerUpdated: 'Jugador "{{name}}" actualizado',
        positionsUpdated: 'Posiciones actualizadas para {{name}}',
        removedPlayers: 'Se eliminaron {{count}} jugador(es)',
        dataMigrated: 'Datos migrados a v{{version}}',
        teamsCreated: '¡Equipos creados! Balance: {{balance}} diferencia ELO ponderada'
    },

    // Info Messages
    info: {
        noComparisons: 'No hay comparaciones que restablecer',
        optimizing: 'Optimizando equipos... Esto puede tomar un momento',
        reloading: 'Recargando...'
    },

    // Titles
    titles: {
        status: 'Estado',
        dataError: 'Error de Datos',
        applicationError: 'Error de Aplicación',
        reloadPage: 'Recargar Página',
        failedToLoad: 'Error al cargar {{name}}'
    },

    // Language names (for language selector)
    languages: {
        en: 'Inglés',
        ru: 'Ruso',
        es: 'Español',
        fr: 'Francés',
        de: 'Alemán',
        ja: 'Japonés',
        zh: 'Chino',
        selectLanguage: 'Seleccionar Idioma'
    }
};
