// src/locales/en.js
// English translations

export default {
    // Common
    common: {
        save: 'Save',
        cancel: 'Cancel',
        close: 'Close',
        confirm: 'Confirm',
        delete: 'Delete',
        edit: 'Edit',
        reset: 'Reset',
        add: 'Add',
        remove: 'Remove',
        import: 'Import',
        export: 'Export',
        download: 'Download',
        copy: 'Copy',
        loading: 'Loading...',
        search: 'Search',
        select: 'Select',
        selectAll: 'Select All',
        player: 'player',
        players: 'players',
        team: 'team',
        teams: 'teams',
        position: 'Position',
        positions: 'Positions',
        rating: 'Rating',
        ratings: 'Ratings',
        comparisons: 'comparisons',
        comparisonsShort: 'comp.',
        multiPosition: 'Multi-pos',
        warning: 'Warning',
        dangerZone: 'Danger Zone',
        yes: 'Yes',
        no: 'No'
    },

    // Navigation
    nav: {
        settings: 'Settings',
        compare: 'Compare',
        rankings: 'Rankings',
        teams: 'Teams'
    },

    // Settings Page
    settings: {
        title: 'Player Management',
        subtitle: 'Select your activity, add players, and manage your roster',

        // Activity Selector
        activity: {
            label: 'Activity Type',
            placeholder: 'Select a sport or activity...',
            recentActivities: 'Recent Activities',
            allActivities: 'All Activities',
            newTeam: 'New Team',
            newTeamTitle: 'Create a new team with its own player list',
            helpText: 'Choose your sport or activity, then click "New Team" to start. Each team has its own player list and is saved in the sidebar.',
            switchingTo: 'Switching to {{activity}}...',
            willBeApplied: '{{activity}} will be applied when you create a new team',
            newTeamCreated: 'New team created',
            invalidActivity: 'Invalid activity selected',
            selectFirst: 'Please select an activity first'
        },

        // Add Player Form
        addPlayers: {
            title: 'Add Players',
            importPlayers: 'Import Players',
            importBtn: 'Import',
            importHelp: 'Upload a CSV or JSON file with your players\' names and positions',
            addIndividual: 'Add Individual Players',
            playerName: 'Player Name',
            playerNamePlaceholder: 'e.g., John Smith',
            playerNameHelp: 'Enter the full name of the player',
            positionsLabel: 'Positions',
            positionsHint: '(select all that apply)',
            positionsHelp: 'Select one or more positions this player can fill',
            addPlayerBtn: 'Add Player',
            bulkActions: 'Bulk Actions',
            resetAllRatings: 'Reset All Ratings',
            removeAllPlayers: 'Remove All Players',
            bulkActionsWarning: 'These actions cannot be undone. Use with caution.'
        },

        // Player List
        playerList: {
            title: 'Current Players',
            noPlayers: 'No players added yet',
            addPlayersPrompt: 'Add players using the form above',
            editPositions: 'Edit positions',
            resetPlayer: 'Reset ratings',
            removePlayer: 'Remove player'
        },

        // Position Stats
        positionStats: {
            title: 'Position Overview',
            playersAtPosition: '{{count}} player(s) at this position'
        },

        // Welcome Guide
        welcome: {
            title: 'Welcome to TeamBalance!',
            subtitle: 'Create perfectly balanced teams. Get started in 4 simple steps:',
            step1: 'Select your sport or activity',
            step1Detail: 'from the dropdown below to begin',
            step2: 'Add your players',
            step2Detail: 'and assign their positions',
            step3: 'Compare players head-to-head',
            step3Detail: 'to build accurate skill ratings',
            step4: 'Generate balanced teams automatically',
            step4Detail: 'with one click'
        },

        // Modals
        modals: {
            editPositions: {
                title: 'Edit Positions - {{name}}',
                label: 'Positions (select all applicable):'
            },
            resetPlayer: {
                title: 'Reset Player - {{name}}',
                label: 'Select positions to reset:',
                warning: 'This will reset the player\'s rating to 1500 and clear comparison history for the selected positions.'
            },
            resetAll: {
                title: 'Reset All Player Ratings',
                label: 'Select positions to reset for ALL players:',
                warning: 'This will reset ALL players to 1500 ELO and clear ALL comparison history for the selected positions. This action cannot be undone!'
            },
            clearAll: {
                title: 'Remove All Players',
                label: 'Select positions to remove ALL players from:',
                warning: 'This will remove ALL players who play the selected positions. This will delete all their data, ratings, and history. This action cannot be undone!'
            },
            importPlayers: {
                title: 'Import Players',
                confirmBtn: 'Import'
            }
        }
    },

    // Compare Page
    compare: {
        title: 'Compare Players',
        subtitle: 'Build accurate player ratings through head-to-head comparisons',

        // Position Selector
        positionSelector: {
            title: 'Select Position',
            selectPosition: 'Select Position to Compare',
            pickPosition: 'Pick a position below to start comparing players head-to-head and build your rankings.',
            quickKeys: 'Quick keys:',
            quickKeysHint: 'left • right • draw',
            resetPosition: 'Reset position comparisons',
            resetAll: 'Reset All',
            progress: '{{completed}}/{{total}} comparisons',
            complete: 'Complete!',
            notEnoughPlayers: 'Not enough players',
            statusComplete: 'Complete',
            statusInProgress: 'In Progress',
            statusReady: 'Ready',
            noPlayersAtPosition: 'No players assigned to the {{position}} position yet. Add players on the Settings page.'
        },

        // Comparison Area
        comparison: {
            whoIsBetter: 'Who is better at',
            selectPosition: 'Select a position above to start comparing players',
            needMorePlayers: 'Need at least 2 players',
            needMorePlayersDetail: 'Add more players at this position on the Settings page to start comparing',
            allComplete: 'All comparisons finished!',
            allCompleteDetail: 'Great job! All player comparisons for {{position}} are complete.',
            suggestion: 'Try comparing {{position}} players next!',
            allPositionsComplete: 'All positions are complete!',
            draw: 'Draw',
            drawTooltip: 'Both players are equally skilled (W key)',
            leftKeyHint: 'A key',
            rightKeyHint: 'D key',
            positionComplete: 'Position Complete!',
            comparedCount: '{{count}} comparisons',
            compare: 'Compare',
            reset: 'Reset'
        },

        // Messages
        messages: {
            insufficientPlayers: '{{position}}: Need at least 2 players for comparison. Currently {{count}} player(s) at this position.',
            allCompared: '{{position}}: All comparisons have been completed for this position.',
            resetConfirm: 'Are you sure you want to reset all comparisons for {{position}}? This cannot be undone.',
            resetSuccess: '{{position}} comparisons have been reset'
        },

        // Reset Modal
        resetModal: {
            title: 'Reset All Comparisons',
            label: 'Select positions to reset comparisons:',
            warning: 'This will reset all comparison history for selected positions. Player ratings will be recalculated to 1500. This action cannot be undone!'
        }
    },

    // Rankings Page
    rankings: {
        title: 'Player Rankings',
        subtitle: 'View and compare player skill ratings across all positions',

        // Position Filter
        positionFilter: {
            all: 'All Positions',
            filterBy: 'Filter by position'
        },

        // Rankings Table
        table: {
            rank: 'Rank',
            player: 'Player',
            position: 'Position',
            rating: 'Rating',
            comparisons: 'Comparisons',
            noPlayers: 'No players to rank',
            addPlayersPrompt: 'Add players on the Settings page to see rankings'
        }
    },

    // Teams Page
    teams: {
        title: 'Create Balanced Teams',
        subtitle: 'Configure team composition and weights, then generate optimally balanced teams using mathematical algorithms',

        // Team Builder
        builder: {
            numberOfTeams: 'Number of Teams',
            numberOfTeamsHelp: 'Choose how many teams to create ({{min}}-{{max}})',
            composition: 'Team Composition & Weights',
            compositionHelp: 'Set how many players per position and their importance weight (higher weight = more important for balance)',
            configLabel: 'Team builder configuration',
            compositionConfigLabel: 'Team composition configuration',
            teamCountLabel: 'Number of teams to create',
            position: 'Position',
            count: 'Count',
            countTooltip: 'Players per team at this position',
            playerCountLabel: 'Number of {{position}}s per team',
            weight: 'Weight',
            weightTooltip: 'Balance priority (1.0-3.0, higher = more important)',
            positionWeightLabel: '{{position}} position weight',
            generateBtn: 'Generate Balanced Teams',
            generating: 'Generating Teams...',
            optimizingLabel: 'Optimizing teams...',
            needMorePlayers: 'Add at least 2 players on the Settings page to create teams'
        },

        // Generated Teams
        results: {
            title: 'Your Balanced Teams',
            teamsGenerated: '{{count}} teams generated',
            regionLabel: 'Generated teams results',
            showEloRatings: 'Show ELO Ratings',
            showPositions: 'Show Positions',
            toggleEloLabel: 'Toggle ELO ratings visibility',
            togglePositionsLabel: 'Toggle player positions visibility',
            exportBtn: 'Export',
            exportLabel: 'Export teams to file',
            balanceQuality: 'Team Balance Quality:',
            eloDifference: '{{value}} ELO average difference',
            teamNumber: 'Team {{number}}',
            excellent: 'Excellent',
            veryGood: 'Very Good',
            good: 'Good',
            fair: 'Fair',
            poor: 'Poor',
            excellentMsg: 'Excellent balance!',
            goodMsg: 'Good balance',
            poorMsg: 'Consider re-generating for better balance',
            lowerIsBetter: 'Lower difference means more even teams.'
        },

        // Export Modal
        export: {
            title: 'Export Teams',
            formatText: 'Plain Text',
            formatCsv: 'CSV',
            formatJson: 'JSON',
            copyBtn: 'Copy',
            downloadBtn: 'Download',
            copiedSuccess: 'Copied to clipboard!',
            exportSuccess: 'Teams exported!',
            exportAs: 'Export as {{format}}',
            preview: 'Preview'
        }
    },

    // Sidebar
    sidebar: {
        title: 'Recent Teams',
        noTeams: 'No teams yet',
        createFirst: 'Create your first team',
        deleteTeam: 'Delete team',
        deleteConfirm: 'Delete this team?',
        deleteConfirmWithPlayers: 'Delete team with {{count}} players?',
        deletedMessage: 'Team deleted. Select a team from the sidebar to continue.',
        allDeletedMessage: 'All teams deleted. Please select an activity to continue.'
    },

    // Import Wizard
    import: {
        selectSource: 'Select Import Source',
        textInput: 'Text Input',
        textInputDesc: 'Paste CSV or JSON data directly',
        fileUpload: 'File Upload',
        fileUploadDesc: 'Upload a CSV or JSON file',
        apiImport: 'API Import',
        apiImportDesc: 'Import from external API',
        dropFile: 'Drop a file here or click to browse',
        supportedFormats: 'Supported formats: CSV, JSON',
        delimiter: 'Delimiter',
        preview: 'Preview',
        foundPlayers: 'Found {{count}} player(s)',
        noData: 'Please provide data to import',
        noPlayersFound: 'No players found',
        importSuccess: 'Imported {{imported}} player(s)',
        importSuccessWithSkipped: 'Imported {{imported}} player(s), skipped {{skipped}}',
        importFailed: 'Import failed',
        back: 'Back',
        // File Import
        csvUploadTitle: 'Upload CSV File',
        jsonUploadTitle: 'Upload JSON File',
        fieldDelimiter: 'Field Delimiter',
        delimiterHint: 'Choose how fields are separated',
        comma: 'Comma (,)',
        tab: 'Tab (\\t)',
        semicolon: 'Semicolon (;)',
        clickToSelect: 'Click to select a file',
        orDragAndDrop: 'or drag and drop here',
        expectedFormat: 'Expected Format',
        csvExample: 'CSV Example',
        jsonExample: 'JSON Example',
        csvFormatNote: 'CSV files should have a header row with "name" and "positions" columns.',
        jsonFormatNote: 'JSON files should contain an array of objects with "name" and "positions" fields.',
        browseFiles: 'Browse Files',
        changeFile: 'Change File',
        copied: 'Copied!',
        // Text Import
        pasteOrType: 'Paste or Type Player Data',
        playerData: 'Player Data',
        pasteDataPlaceholder: 'Paste CSV or JSON data here...',
        examples: 'Examples',
        csvFormat: 'CSV Format',
        jsonFormat: 'JSON Format',
        namesOnly: 'Names Only',
        allPositionsAssigned: 'All positions will be assigned',
        // API Import
        fetchFromUrl: 'Fetch from URL',
        url: 'URL',
        urlHint: 'Enter the URL of your JSON data',
        fetchData: 'Fetch Data',
        fetching: 'Fetching...',
        authentication: 'Authentication',
        authHint: 'Select authentication method if required',
        authNone: 'None (Public URL)',
        authBearer: 'Bearer Token',
        authApiKey: 'API Key',
        authBasic: 'Basic Auth',
        authCustomHeaders: 'Custom Headers',
        expectedJsonFormat: 'Expected JSON Format',
        responseExample: 'Response Example',
        notes: 'Notes',
        noteJsonRequired: 'The URL must return JSON data',
        noteArrayRequired: 'Response should be an array of player objects',
        noteFieldsRequired: 'Each object must have "name" and "positions" fields',
        noteCorsRequired: 'CORS must be enabled on the server',
        urlRequired: 'Please enter a URL',
        invalidUrl: 'Invalid URL',
        invalidUrlDetail: 'Please enter a valid URL (e.g., https://example.com/data.json)',
        fetchingFrom: 'Fetching data from {{url}}...',
        fetchSuccess: 'Data fetched successfully!',
        fetchedItems: 'Fetched {{count}} item(s) from the URL.',
        fetchFailed: 'Failed to fetch data',
        fileReadError: 'Error reading file'
    },

    // Error Messages
    errors: {
        dataIncomplete: 'Player data is incomplete. Please check your player list.',
        loadFailed: 'Unable to load the next comparison. Please try again.',
        selectPosition: 'Please select at least one position',
        selectActivity: 'Please select an activity type first',
        selectPlayerPerTeam: 'Please select at least one player per team',
        exportFailed: 'Export failed',
        playerNotFound: 'Player not found',
        invalidJson: 'Invalid JSON format',
        noDataToImport: 'No data to import',
        unexpectedError: 'An unexpected error occurred'
    },

    // Success Messages
    success: {
        winWin: 'Win-Win recorded',
        exportComplete: 'Teams exported!',
        resetComplete: '{{count}} comparisons have been reset',
        playerAdded: 'Player "{{name}}" added!',
        playerRemoved: 'Player "{{name}}" removed',
        playerUpdated: 'Player "{{name}}" updated',
        positionsUpdated: 'Positions updated for {{name}}',
        removedPlayers: 'Removed {{count}} player(s)',
        dataMigrated: 'Data migrated to v{{version}}',
        teamsCreated: 'Teams created! Balance: {{balance}} weighted ELO difference'
    },

    // Info Messages
    info: {
        noComparisons: 'No comparisons to reset',
        optimizing: 'Optimizing teams... This may take a moment',
        reloading: 'Reloading...'
    },

    // Titles
    titles: {
        status: 'Status',
        dataError: 'Data Error',
        applicationError: 'Application Error',
        reloadPage: 'Reload Page',
        failedToLoad: 'Failed to load {{name}}'
    },

    // Language names (for language selector)
    languages: {
        en: 'English',
        ru: 'Russian',
        es: 'Spanish',
        fr: 'French',
        de: 'German',
        ja: 'Japanese',
        zh: 'Chinese',
        selectLanguage: 'Select Language'
    }
};
