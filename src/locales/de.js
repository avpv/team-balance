// src/locales/de.js
// German translations - Deutsche Übersetzungen

export default {
    // Common
    common: {
        save: 'Speichern',
        cancel: 'Abbrechen',
        close: 'Schließen',
        confirm: 'Bestätigen',
        delete: 'Löschen',
        edit: 'Bearbeiten',
        reset: 'Zurücksetzen',
        add: 'Hinzufügen',
        remove: 'Entfernen',
        import: 'Importieren',
        export: 'Exportieren',
        download: 'Herunterladen',
        copy: 'Kopieren',
        loading: 'Laden...',
        search: 'Suchen',
        select: 'Auswählen',
        selectAll: 'Alle auswählen',
        player: 'Spieler',
        players: 'Spieler',
        team: 'Team',
        teams: 'Teams',
        position: 'Position',
        positions: 'Positionen',
        rating: 'Bewertung',
        ratings: 'Bewertungen',
        comparisons: 'Vergleiche',
        comparisonsShort: 'Vgl.',
        multiPosition: 'Multi-Pos',
        warning: 'Warnung',
        dangerZone: 'Gefahrenbereich',
        yes: 'Ja',
        no: 'Nein'
    },

    // Navigation
    nav: {
        settings: 'Einstellungen',
        compare: 'Vergleichen',
        rankings: 'Rangliste',
        teams: 'Teams'
    },

    // Settings Page
    settings: {
        title: 'Spielerverwaltung',
        subtitle: 'Wählen Sie Ihre Aktivität, fügen Sie Spieler hinzu und verwalten Sie Ihren Kader',

        // Activity Selector
        activity: {
            label: 'Aktivitätstyp',
            placeholder: 'Sport oder Aktivität auswählen...',
            recentActivities: 'Letzte Aktivitäten',
            allActivities: 'Alle Aktivitäten',
            newTeam: 'Neues Team',
            newTeamTitle: 'Ein neues Team mit eigener Spielerliste erstellen',
            helpText: 'Wählen Sie Ihren Sport oder Ihre Aktivität und klicken Sie dann auf "Neues Team". Jedes Team hat seine eigene Spielerliste und wird in der Seitenleiste gespeichert.',
            switchingTo: 'Wechsle zu {{activity}}...',
            willBeApplied: '{{activity}} wird angewendet, wenn Sie ein neues Team erstellen',
            newTeamCreated: 'Neues Team erstellt',
            invalidActivity: 'Ungültige Aktivität ausgewählt',
            selectFirst: 'Bitte wählen Sie zuerst eine Aktivität aus'
        },

        // Add Player Form
        addPlayers: {
            title: 'Spieler hinzufügen',
            importPlayers: 'Spieler importieren',
            importBtn: 'Importieren',
            importHelp: 'Laden Sie eine CSV- oder JSON-Datei mit den Namen und Positionen Ihrer Spieler hoch',
            addIndividual: 'Einzelne Spieler hinzufügen',
            playerName: 'Spielername',
            playerNamePlaceholder: 'z.B. Max Mustermann',
            playerNameHelp: 'Geben Sie den vollständigen Namen des Spielers ein',
            positionsLabel: 'Positionen',
            positionsHint: '(alle zutreffenden auswählen)',
            positionsHelp: 'Wählen Sie eine oder mehrere Positionen, die dieser Spieler spielen kann',
            addPlayerBtn: 'Spieler hinzufügen',
            bulkActions: 'Massenaktionen',
            resetAllRatings: 'Alle Bewertungen zurücksetzen',
            removeAllPlayers: 'Alle Spieler entfernen',
            bulkActionsWarning: 'Diese Aktionen können nicht rückgängig gemacht werden. Mit Vorsicht verwenden.'
        },

        // Player List
        playerList: {
            title: 'Aktuelle Spieler',
            noPlayers: 'Noch keine Spieler hinzugefügt',
            addPlayersPrompt: 'Fügen Sie Spieler mit dem obigen Formular hinzu',
            editPositions: 'Positionen bearbeiten',
            resetPlayer: 'Bewertungen zurücksetzen',
            removePlayer: 'Spieler entfernen'
        },

        // Position Stats
        positionStats: {
            title: 'Positionsübersicht',
            playersAtPosition: '{{count}} Spieler auf dieser Position'
        },

        // Welcome Guide
        welcome: {
            title: 'Willkommen bei TeamBalance!',
            subtitle: 'Erstellen Sie perfekt ausgewogene Teams. Beginnen Sie in 4 einfachen Schritten:',
            step1: 'Wählen Sie Ihren Sport oder Ihre Aktivität',
            step1Detail: 'aus dem Dropdown-Menü unten',
            step2: 'Fügen Sie Ihre Spieler hinzu',
            step2Detail: 'und weisen Sie ihnen Positionen zu',
            step3: 'Vergleichen Sie Spieler direkt',
            step3Detail: 'um genaue Fähigkeitsbewertungen zu erstellen',
            step4: 'Generieren Sie ausgewogene Teams automatisch',
            step4Detail: 'mit einem Klick'
        },

        // Modals
        modals: {
            editPositions: {
                title: 'Positionen bearbeiten - {{name}}',
                label: 'Positionen (alle zutreffenden auswählen):'
            },
            resetPlayer: {
                title: 'Spieler zurücksetzen - {{name}}',
                label: 'Positionen zum Zurücksetzen auswählen:',
                warning: 'Dies setzt die Bewertung des Spielers auf 1500 zurück und löscht den Vergleichsverlauf für die ausgewählten Positionen.'
            },
            resetAll: {
                title: 'Alle Spielerbewertungen zurücksetzen',
                label: 'Positionen für ALLE Spieler zum Zurücksetzen auswählen:',
                warning: 'Dies setzt ALLE Spieler auf 1500 ELO zurück und löscht ALLEN Vergleichsverlauf für die ausgewählten Positionen. Diese Aktion kann nicht rückgängig gemacht werden!'
            },
            clearAll: {
                title: 'Alle Spieler entfernen',
                label: 'Positionen auswählen, von denen ALLE Spieler entfernt werden sollen:',
                warning: 'Dies entfernt ALLE Spieler, die die ausgewählten Positionen spielen. Alle ihre Daten, Bewertungen und der Verlauf werden gelöscht. Diese Aktion kann nicht rückgängig gemacht werden!'
            },
            importPlayers: {
                title: 'Spieler importieren',
                confirmBtn: 'Importieren'
            }
        }
    },

    // Compare Page
    compare: {
        title: 'Spieler vergleichen',
        subtitle: 'Erstellen Sie genaue Spielerbewertungen durch direkte Vergleiche',

        // Position Selector
        positionSelector: {
            title: 'Position auswählen',
            selectPosition: 'Position zum Vergleichen auswählen',
            pickPosition: 'Wählen Sie unten eine Position, um Spieler direkt zu vergleichen und Ihre Rangliste aufzubauen.',
            quickKeys: 'Schnelltasten:',
            quickKeysHint: 'links • rechts • unentschieden',
            resetPosition: 'Positionsvergleiche zurücksetzen',
            resetAll: 'Alle zurücksetzen',
            progress: '{{completed}}/{{total}} Vergleiche',
            complete: 'Abgeschlossen!',
            notEnoughPlayers: 'Nicht genügend Spieler',
            statusComplete: 'Abgeschlossen',
            statusInProgress: 'In Bearbeitung',
            statusReady: 'Bereit',
            noPlayersAtPosition: 'Noch keine Spieler der Position {{position}} zugewiesen. Fügen Sie auf der Einstellungsseite Spieler hinzu.'
        },

        // Comparison Area
        comparison: {
            whoIsBetter: 'Wer ist besser bei',
            selectPosition: 'Wählen Sie oben eine Position, um mit dem Vergleichen zu beginnen',
            needMorePlayers: 'Mindestens 2 Spieler benötigt',
            needMorePlayersDetail: 'Fügen Sie auf der Einstellungsseite mehr Spieler für diese Position hinzu',
            allComplete: 'Alle Vergleiche abgeschlossen!',
            allCompleteDetail: 'Großartig! Alle Spielervergleiche für {{position}} sind abgeschlossen.',
            suggestion: 'Versuchen Sie als Nächstes, {{position}}-Spieler zu vergleichen!',
            allPositionsComplete: 'Alle Positionen sind abgeschlossen!',
            draw: 'Unentschieden',
            drawTooltip: 'Beide Spieler sind gleich stark (W-Taste)',
            leftKeyHint: 'A-Taste',
            rightKeyHint: 'D-Taste',
            positionComplete: 'Position abgeschlossen!',
            comparedCount: '{{count}} Vergleiche',
            compare: 'Vergleichen',
            reset: 'Zurücksetzen'
        },

        // Messages
        messages: {
            insufficientPlayers: '{{position}}: Mindestens 2 Spieler zum Vergleichen benötigt. Derzeit {{count}} Spieler auf dieser Position.',
            allCompared: '{{position}}: Alle Vergleiche für diese Position wurden abgeschlossen.',
            resetConfirm: 'Sind Sie sicher, dass Sie alle Vergleiche für {{position}} zurücksetzen möchten? Dies kann nicht rückgängig gemacht werden.',
            resetSuccess: '{{position}}-Vergleiche wurden zurückgesetzt'
        },

        // Reset Modal
        resetModal: {
            title: 'Alle Vergleiche zurücksetzen',
            label: 'Positionen zum Zurücksetzen der Vergleiche auswählen:',
            warning: 'Dies setzt den gesamten Vergleichsverlauf für die ausgewählten Positionen zurück. Spielerbewertungen werden auf 1500 neu berechnet. Diese Aktion kann nicht rückgängig gemacht werden!'
        }
    },

    // Rankings Page
    rankings: {
        title: 'Spielerrangliste',
        subtitle: 'Sehen und vergleichen Sie die Fähigkeitsbewertungen aller Spieler für alle Positionen',

        // Position Filter
        positionFilter: {
            all: 'Alle Positionen',
            filterBy: 'Nach Position filtern'
        },

        // Rankings Table
        table: {
            rank: 'Rang',
            player: 'Spieler',
            position: 'Position',
            rating: 'Bewertung',
            comparisons: 'Vergleiche',
            noPlayers: 'Keine Spieler zum Ranken',
            addPlayersPrompt: 'Fügen Sie auf der Einstellungsseite Spieler hinzu, um die Rangliste zu sehen'
        }
    },

    // Teams Page
    teams: {
        title: 'Ausgewogene Teams erstellen',
        subtitle: 'Konfigurieren Sie Teamzusammensetzung und Gewichtungen, dann generieren Sie optimal ausgewogene Teams mit mathematischen Algorithmen',

        // Team Builder
        builder: {
            numberOfTeams: 'Anzahl der Teams',
            numberOfTeamsHelp: 'Wählen Sie, wie viele Teams erstellt werden sollen ({{min}}-{{max}})',
            composition: 'Teamzusammensetzung & Gewichtungen',
            compositionHelp: 'Legen Sie fest, wie viele Spieler pro Position und deren Wichtigkeitsgewicht (höheres Gewicht = wichtiger für die Balance)',
            position: 'Position',
            count: 'Anzahl',
            countTooltip: 'Spieler pro Team auf dieser Position',
            weight: 'Gewicht',
            weightTooltip: 'Balance-Priorität (1.0-3.0, höher = wichtiger)',
            generateBtn: 'Ausgewogene Teams generieren',
            generating: 'Teams werden generiert...',
            needMorePlayers: 'Fügen Sie mindestens 2 Spieler auf der Einstellungsseite hinzu, um Teams zu erstellen'
        },

        // Generated Teams
        results: {
            title: 'Ihre ausgewogenen Teams',
            teamsGenerated: '{{count}} Teams generiert',
            showEloRatings: 'ELO-Bewertungen anzeigen',
            showPositions: 'Positionen anzeigen',
            exportBtn: 'Exportieren',
            balanceQuality: 'Team-Balance-Qualität:',
            eloDifference: '{{value}} durchschnittliche ELO-Differenz',
            excellent: 'Ausgezeichnet',
            veryGood: 'Sehr gut',
            good: 'Gut',
            fair: 'Befriedigend',
            poor: 'Schlecht',
            excellentMsg: 'Ausgezeichnete Balance!',
            goodMsg: 'Gute Balance',
            poorMsg: 'Erwägen Sie eine Neugenerierung für bessere Balance',
            lowerIsBetter: 'Geringere Differenz bedeutet ausgeglichenere Teams.'
        },

        // Export Modal
        export: {
            title: 'Teams exportieren',
            formatText: 'Klartext',
            formatCsv: 'CSV',
            formatJson: 'JSON',
            copyBtn: 'Kopieren',
            downloadBtn: 'Herunterladen',
            copiedSuccess: 'In die Zwischenablage kopiert!',
            exportSuccess: 'Teams exportiert!',
            exportAs: 'Exportieren als {{format}}',
            preview: 'Vorschau'
        }
    },

    // Sidebar
    sidebar: {
        title: 'Letzte Teams',
        noTeams: 'Noch keine Teams',
        createFirst: 'Erstellen Sie Ihr erstes Team',
        deleteTeam: 'Team löschen',
        deleteConfirm: 'Dieses Team löschen?',
        deleteConfirmWithPlayers: 'Team mit {{count}} Spielern löschen?',
        deletedMessage: 'Team gelöscht. Wählen Sie ein Team aus der Seitenleiste, um fortzufahren.',
        allDeletedMessage: 'Alle Teams gelöscht. Bitte wählen Sie eine Aktivität, um fortzufahren.'
    },

    // Import Wizard
    import: {
        selectSource: 'Importquelle auswählen',
        textInput: 'Texteingabe',
        textInputDesc: 'CSV- oder JSON-Daten direkt einfügen',
        fileUpload: 'Datei hochladen',
        fileUploadDesc: 'Eine CSV- oder JSON-Datei hochladen',
        apiImport: 'API-Import',
        apiImportDesc: 'Von externer API importieren',
        dropFile: 'Datei hierher ziehen oder klicken zum Durchsuchen',
        supportedFormats: 'Unterstützte Formate: CSV, JSON',
        delimiter: 'Trennzeichen',
        preview: 'Vorschau',
        foundPlayers: '{{count}} Spieler gefunden',
        noData: 'Bitte geben Sie Daten zum Importieren an',
        noPlayersFound: 'Keine Spieler gefunden',
        importSuccess: '{{imported}} Spieler importiert',
        importSuccessWithSkipped: '{{imported}} Spieler importiert, {{skipped}} übersprungen',
        importFailed: 'Import fehlgeschlagen',
        back: 'Zurück',
        // File Import
        csvUploadTitle: 'CSV-Datei hochladen',
        jsonUploadTitle: 'JSON-Datei hochladen',
        fieldDelimiter: 'Feldtrennzeichen',
        delimiterHint: 'Wählen Sie, wie Felder getrennt werden',
        comma: 'Komma (,)',
        tab: 'Tabulator (\\t)',
        semicolon: 'Semikolon (;)',
        clickToSelect: 'Klicken Sie, um eine Datei auszuwählen',
        orDragAndDrop: 'oder hierher ziehen',
        expectedFormat: 'Erwartetes Format',
        csvExample: 'CSV-Beispiel',
        jsonExample: 'JSON-Beispiel',
        csvFormatNote: 'CSV-Dateien sollten eine Kopfzeile mit den Spalten "name" und "positions" haben.',
        jsonFormatNote: 'JSON-Dateien sollten ein Array von Objekten mit den Feldern "name" und "positions" enthalten.',
        browseFiles: 'Dateien durchsuchen',
        changeFile: 'Datei ändern',
        copied: 'Kopiert!',
        // Text Import
        pasteOrType: 'Spielerdaten einfügen oder eingeben',
        playerData: 'Spielerdaten',
        pasteDataPlaceholder: 'CSV- oder JSON-Daten hier einfügen...',
        examples: 'Beispiele',
        csvFormat: 'CSV-Format',
        jsonFormat: 'JSON-Format',
        namesOnly: 'Nur Namen',
        allPositionsAssigned: 'Alle Positionen werden zugewiesen',
        // API Import
        fetchFromUrl: 'Von URL abrufen',
        url: 'URL',
        urlHint: 'Geben Sie die URL Ihrer JSON-Daten ein',
        fetchData: 'Daten abrufen',
        fetching: 'Wird abgerufen...',
        authentication: 'Authentifizierung',
        authHint: 'Wählen Sie bei Bedarf eine Authentifizierungsmethode',
        authNone: 'Keine (Öffentliche URL)',
        authBearer: 'Bearer-Token',
        authApiKey: 'API-Schlüssel',
        authBasic: 'Basic-Authentifizierung',
        authCustomHeaders: 'Benutzerdefinierte Header',
        expectedJsonFormat: 'Erwartetes JSON-Format',
        responseExample: 'Antwortbeispiel',
        notes: 'Hinweise',
        noteJsonRequired: 'Die URL muss JSON-Daten zurückgeben',
        noteArrayRequired: 'Antwort sollte ein Array von Spielerobjekten sein',
        noteFieldsRequired: 'Jedes Objekt muss die Felder "name" und "positions" haben',
        noteCorsRequired: 'CORS muss auf dem Server aktiviert sein',
        urlRequired: 'Bitte geben Sie eine URL ein',
        invalidUrl: 'Ungültige URL',
        invalidUrlDetail: 'Bitte geben Sie eine gültige URL ein (z.B. https://example.com/data.json)',
        fetchingFrom: 'Daten werden von {{url}} abgerufen...',
        fetchSuccess: 'Daten erfolgreich abgerufen!',
        fetchedItems: '{{count}} Element(e) von der URL abgerufen.',
        fetchFailed: 'Daten konnten nicht abgerufen werden',
        fileReadError: 'Fehler beim Lesen der Datei'
    },

    // Error Messages
    errors: {
        dataIncomplete: 'Spielerdaten sind unvollständig. Bitte überprüfen Sie Ihre Spielerliste.',
        loadFailed: 'Der nächste Vergleich konnte nicht geladen werden. Bitte versuchen Sie es erneut.',
        selectPosition: 'Bitte wählen Sie mindestens eine Position aus',
        selectActivity: 'Bitte wählen Sie zuerst einen Aktivitätstyp aus',
        selectPlayerPerTeam: 'Bitte wählen Sie mindestens einen Spieler pro Team aus',
        exportFailed: 'Export fehlgeschlagen',
        playerNotFound: 'Spieler nicht gefunden',
        invalidJson: 'Ungültiges JSON-Format',
        noDataToImport: 'Keine Daten zum Importieren',
        unexpectedError: 'Ein unerwarteter Fehler ist aufgetreten'
    },

    // Success Messages
    success: {
        winWin: 'Unentschieden aufgezeichnet',
        exportComplete: 'Teams exportiert!',
        resetComplete: '{{count}} Vergleiche wurden zurückgesetzt',
        playerAdded: 'Spieler "{{name}}" hinzugefügt!',
        playerRemoved: 'Spieler "{{name}}" entfernt',
        playerUpdated: 'Spieler "{{name}}" aktualisiert',
        positionsUpdated: 'Positionen für {{name}} aktualisiert',
        removedPlayers: '{{count}} Spieler entfernt',
        dataMigrated: 'Daten migriert zu v{{version}}'
    },

    // Info Messages
    info: {
        noComparisons: 'Keine Vergleiche zum Zurücksetzen',
        optimizing: 'Optimiere Teams... Dies kann einen Moment dauern',
        reloading: 'Neu laden...'
    },

    // Titles
    titles: {
        status: 'Status',
        dataError: 'Datenfehler',
        applicationError: 'Anwendungsfehler',
        reloadPage: 'Seite neu laden',
        failedToLoad: '{{name}} konnte nicht geladen werden'
    },

    // Language names (for language selector)
    languages: {
        en: 'Englisch',
        ru: 'Russisch',
        es: 'Spanisch',
        fr: 'Französisch',
        de: 'Deutsch',
        ja: 'Japanisch',
        zh: 'Chinesisch',
        selectLanguage: 'Sprache auswählen'
    }
};
