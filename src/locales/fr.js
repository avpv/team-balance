// src/locales/fr.js
// French translations - Traductions françaises

export default {
    // Common
    common: {
        save: 'Enregistrer',
        cancel: 'Annuler',
        close: 'Fermer',
        confirm: 'Confirmer',
        delete: 'Supprimer',
        edit: 'Modifier',
        reset: 'Réinitialiser',
        add: 'Ajouter',
        remove: 'Supprimer',
        import: 'Importer',
        export: 'Exporter',
        download: 'Télécharger',
        copy: 'Copier',
        loading: 'Chargement...',
        search: 'Rechercher',
        select: 'Sélectionner',
        selectAll: 'Tout sélectionner',
        player: 'joueur',
        players: 'joueurs',
        team: 'équipe',
        teams: 'équipes',
        position: 'Position',
        positions: 'Positions',
        rating: 'Note',
        ratings: 'Notes',
        comparisons: 'comparaisons',
        comparisonsShort: 'comp.',
        multiPosition: 'Multi-pos',
        warning: 'Attention',
        dangerZone: 'Zone de danger',
        yes: 'Oui',
        no: 'Non'
    },

    // Navigation
    nav: {
        settings: 'Paramètres',
        compare: 'Comparer',
        rankings: 'Classements',
        teams: 'Équipes'
    },

    // Settings Page
    settings: {
        title: 'Gestion des Joueurs',
        subtitle: 'Sélectionnez votre activité, ajoutez des joueurs et gérez votre effectif',

        // Activity Selector
        activity: {
            label: 'Type d\'Activité',
            placeholder: 'Sélectionnez un sport ou une activité...',
            recentActivities: 'Activités Récentes',
            allActivities: 'Toutes les Activités',
            newTeam: 'Nouvelle Équipe',
            newTeamTitle: 'Créer une nouvelle équipe avec sa propre liste de joueurs',
            helpText: 'Choisissez votre sport ou activité, puis cliquez sur "Nouvelle Équipe" pour commencer. Chaque équipe a sa propre liste de joueurs et est sauvegardée dans la barre latérale.',
            switchingTo: 'Passage à {{activity}}...',
            willBeApplied: '{{activity}} sera appliqué lorsque vous créerez une nouvelle équipe',
            newTeamCreated: 'Nouvelle équipe créée',
            invalidActivity: 'Activité sélectionnée invalide',
            selectFirst: 'Veuillez d\'abord sélectionner une activité'
        },

        // Add Player Form
        addPlayers: {
            title: 'Ajouter des Joueurs',
            importPlayers: 'Importer des Joueurs',
            importBtn: 'Importer',
            importHelp: 'Téléchargez un fichier CSV ou JSON avec les noms et positions de vos joueurs',
            addIndividual: 'Ajouter des Joueurs Individuellement',
            playerName: 'Nom du Joueur',
            playerNamePlaceholder: 'ex., Jean Dupont',
            playerNameHelp: 'Entrez le nom complet du joueur',
            positionsLabel: 'Positions',
            positionsHint: '(sélectionnez toutes celles qui s\'appliquent)',
            positionsHelp: 'Sélectionnez une ou plusieurs positions que ce joueur peut occuper',
            addPlayerBtn: 'Ajouter le Joueur',
            bulkActions: 'Actions Groupées',
            resetAllRatings: 'Réinitialiser Toutes les Notes',
            removeAllPlayers: 'Supprimer Tous les Joueurs',
            bulkActionsWarning: 'Ces actions sont irréversibles. Utilisez avec précaution.'
        },

        // Player List
        playerList: {
            title: 'Joueurs Actuels',
            noPlayers: 'Aucun joueur ajouté',
            addPlayersPrompt: 'Ajoutez des joueurs avec le formulaire ci-dessus',
            editPositions: 'Modifier les positions',
            resetPlayer: 'Réinitialiser les notes',
            removePlayer: 'Supprimer le joueur'
        },

        // Position Stats
        positionStats: {
            title: 'Aperçu des Positions',
            playersAtPosition: '{{count}} joueur(s) à cette position'
        },

        // Welcome Guide
        welcome: {
            title: 'Bienvenue sur TeamBalance !',
            subtitle: 'Créez des équipes parfaitement équilibrées. Commencez en 4 étapes simples :',
            step1: 'Sélectionnez votre sport ou activité',
            step1Detail: 'dans le menu déroulant ci-dessous pour commencer',
            step2: 'Ajoutez vos joueurs',
            step2Detail: 'et attribuez leurs positions',
            step3: 'Comparez les joueurs face à face',
            step3Detail: 'pour établir des notes de compétence précises',
            step4: 'Générez des équipes équilibrées automatiquement',
            step4Detail: 'en un seul clic'
        },

        // Modals
        modals: {
            editPositions: {
                title: 'Modifier les Positions - {{name}}',
                label: 'Positions (sélectionnez toutes celles applicables) :'
            },
            resetPlayer: {
                title: 'Réinitialiser le Joueur - {{name}}',
                label: 'Sélectionnez les positions à réinitialiser :',
                warning: 'Cela réinitialisera la note du joueur à 1500 et effacera l\'historique des comparaisons pour les positions sélectionnées.'
            },
            resetAll: {
                title: 'Réinitialiser les Notes de Tous les Joueurs',
                label: 'Sélectionnez les positions à réinitialiser pour TOUS les joueurs :',
                warning: 'Cela réinitialisera TOUS les joueurs à 1500 ELO et effacera TOUT l\'historique des comparaisons pour les positions sélectionnées. Cette action est irréversible !'
            },
            clearAll: {
                title: 'Supprimer Tous les Joueurs',
                label: 'Sélectionnez les positions dont supprimer TOUS les joueurs :',
                warning: 'Cela supprimera TOUS les joueurs occupant les positions sélectionnées. Toutes leurs données, notes et historique seront supprimés. Cette action est irréversible !'
            },
            importPlayers: {
                title: 'Importer des Joueurs',
                confirmBtn: 'Importer'
            }
        }
    },

    // Compare Page
    compare: {
        title: 'Comparer les Joueurs',
        subtitle: 'Établissez des notes précises grâce aux comparaisons directes',

        // Position Selector
        positionSelector: {
            title: 'Sélectionner la Position',
            selectPosition: 'Sélectionner la Position à Comparer',
            pickPosition: 'Choisissez une position ci-dessous pour commencer à comparer les joueurs face à face et construire votre classement.',
            quickKeys: 'Touches rapides :',
            quickKeysHint: 'gauche • droite • égalité',
            resetPosition: 'Réinitialiser les comparaisons de position',
            resetAll: 'Tout Réinitialiser',
            progress: '{{completed}}/{{total}} comparaisons',
            complete: 'Terminé !',
            notEnoughPlayers: 'Pas assez de joueurs',
            statusComplete: 'Terminé',
            statusInProgress: 'En Cours',
            statusReady: 'Prêt',
            noPlayersAtPosition: 'Aucun joueur assigné à la position {{position}} pour l\'instant. Ajoutez des joueurs sur la page Paramètres.'
        },

        // Comparison Area
        comparison: {
            whoIsBetter: 'Qui est meilleur en',
            selectPosition: 'Sélectionnez une position ci-dessus pour commencer à comparer les joueurs',
            needMorePlayers: 'Au moins 2 joueurs nécessaires',
            needMorePlayersDetail: 'Ajoutez plus de joueurs à cette position sur la page Paramètres pour commencer à comparer',
            allComplete: 'Toutes les comparaisons terminées !',
            allCompleteDetail: 'Excellent ! Toutes les comparaisons de joueurs pour {{position}} sont terminées.',
            suggestion: 'Essayez de comparer les joueurs {{position}} ensuite !',
            allPositionsComplete: 'Toutes les positions sont terminées !',
            draw: 'Égalité',
            drawTooltip: 'Les deux joueurs sont de niveau égal (touche W)',
            leftKeyHint: 'Touche A',
            rightKeyHint: 'Touche D',
            positionComplete: 'Position Terminée !',
            comparedCount: '{{count}} comparaisons',
            compare: 'Comparer',
            reset: 'Réinitialiser'
        },

        // Messages
        messages: {
            insufficientPlayers: '{{position}} : Au moins 2 joueurs nécessaires pour comparer. Actuellement {{count}} joueur(s) à cette position.',
            allCompared: '{{position}} : Toutes les comparaisons ont été effectuées pour cette position.',
            resetConfirm: 'Êtes-vous sûr de vouloir réinitialiser toutes les comparaisons pour {{position}} ? Cette action est irréversible.',
            resetSuccess: 'Les comparaisons de {{position}} ont été réinitialisées'
        },

        // Reset Modal
        resetModal: {
            title: 'Réinitialiser Toutes les Comparaisons',
            label: 'Sélectionnez les positions pour réinitialiser les comparaisons :',
            warning: 'Cela réinitialisera tout l\'historique des comparaisons pour les positions sélectionnées. Les notes des joueurs seront recalculées à 1500. Cette action est irréversible !'
        }
    },

    // Rankings Page
    rankings: {
        title: 'Classement des Joueurs',
        subtitle: 'Consultez et comparez les notes de compétence des joueurs pour toutes les positions',
        playersRanked: '{{count}} joueur(s) classé(s)',
        noPlayersAtPosition: 'Aucun joueur assigné à la position {{position}} pour l\'instant. Ajoutez des joueurs sur la page Paramètres.',

        // Position Filter
        positionFilter: {
            all: 'Toutes les Positions',
            filterBy: 'Filtrer par position'
        },

        // Rankings Table
        table: {
            rank: 'Rang',
            player: 'Joueur',
            position: 'Position',
            rating: 'Note',
            comparisons: 'Comparaisons',
            noPlayers: 'Aucun joueur à classer',
            addPlayersPrompt: 'Ajoutez des joueurs sur la page Paramètres pour voir les classements'
        }
    },

    // Teams Page
    teams: {
        title: 'Créer des Équipes Équilibrées',
        subtitle: 'Configurez la composition et les pondérations, puis générez des équipes optimalement équilibrées grâce aux algorithmes mathématiques',

        // Team Builder
        builder: {
            numberOfTeams: 'Nombre d\'Équipes',
            numberOfTeamsHelp: 'Choisissez combien d\'équipes créer ({{min}}-{{max}})',
            composition: 'Composition et Pondérations',
            compositionHelp: 'Définissez le nombre de joueurs par position et leur poids d\'importance (poids plus élevé = plus important pour l\'équilibre)',
            configLabel: 'Configuration du générateur d\'équipes',
            compositionConfigLabel: 'Configuration de la composition d\'équipe',
            teamCountLabel: 'Nombre d\'équipes à créer',
            position: 'Position',
            count: 'Nombre',
            countTooltip: 'Joueurs par équipe à cette position',
            playerCountLabel: 'Nombre de {{position}} par équipe',
            weight: 'Poids',
            weightTooltip: 'Priorité d\'équilibrage (1.0-3.0, plus élevé = plus important)',
            positionWeightLabel: 'Poids de la position {{position}}',
            generateBtn: 'Générer des Équipes Équilibrées',
            generating: 'Génération des Équipes...',
            optimizingLabel: 'Optimisation des équipes...',
            needMorePlayers: 'Ajoutez au moins 2 joueurs sur la page Paramètres pour créer des équipes'
        },

        // Generated Teams
        results: {
            title: 'Vos Équipes Équilibrées',
            teamsGenerated: '{{count}} équipes générées',
            regionLabel: 'Résultats des équipes générées',
            showEloRatings: 'Afficher les Notes ELO',
            showPositions: 'Afficher les Positions',
            toggleEloLabel: 'Basculer la visibilité des notes ELO',
            togglePositionsLabel: 'Basculer la visibilité des positions',
            exportBtn: 'Exporter',
            exportLabel: 'Exporter les équipes vers un fichier',
            balanceQuality: 'Qualité de l\'Équilibre :',
            eloDifference: '{{value}} différence ELO moyenne',
            teamNumber: 'Équipe {{number}}',
            excellent: 'Excellent',
            veryGood: 'Très Bien',
            good: 'Bien',
            fair: 'Moyen',
            poor: 'Faible',
            excellentMsg: 'Excellent équilibre !',
            goodMsg: 'Bon équilibre',
            poorMsg: 'Envisagez de régénérer pour un meilleur équilibre',
            lowerIsBetter: 'Une différence plus faible signifie des équipes plus équilibrées.'
        },

        // Export Modal
        export: {
            title: 'Exporter les Équipes',
            formatText: 'Texte Brut',
            formatCsv: 'CSV',
            formatJson: 'JSON',
            copyBtn: 'Copier',
            downloadBtn: 'Télécharger',
            copiedSuccess: 'Copié dans le presse-papiers !',
            exportSuccess: 'Équipes exportées !',
            exportAs: 'Exporter en {{format}}',
            preview: 'Aperçu'
        }
    },

    // Sidebar
    sidebar: {
        title: 'Équipes Récentes',
        noTeams: 'Pas encore d\'équipes',
        createFirst: 'Créez votre première équipe',
        deleteTeam: 'Supprimer l\'équipe',
        deleteConfirm: 'Supprimer cette équipe ?',
        deleteConfirmWithPlayers: 'Supprimer l\'équipe avec {{count}} joueurs ?',
        deletedMessage: 'Équipe supprimée. Sélectionnez une équipe dans la barre latérale pour continuer.',
        allDeletedMessage: 'Toutes les équipes supprimées. Veuillez sélectionner une activité pour continuer.'
    },

    // Import Wizard
    import: {
        selectSource: 'Sélectionner la Source d\'Importation',
        textInput: 'Saisie de Texte',
        textInputDesc: 'Collez des données CSV ou JSON directement',
        fileUpload: 'Téléchargement de Fichier',
        fileUploadDesc: 'Téléchargez un fichier CSV ou JSON',
        apiImport: 'Importation API',
        apiImportDesc: 'Importer depuis une API externe',
        dropFile: 'Déposez un fichier ici ou cliquez pour parcourir',
        supportedFormats: 'Formats supportés : CSV, JSON',
        delimiter: 'Délimiteur',
        preview: 'Aperçu',
        foundPlayers: '{{count}} joueur(s) trouvé(s)',
        noData: 'Veuillez fournir des données à importer',
        noPlayersFound: 'Aucun joueur trouvé',
        importSuccess: '{{imported}} joueur(s) importé(s)',
        importSuccessWithSkipped: '{{imported}} joueur(s) importé(s), {{skipped}} ignoré(s)',
        importFailed: 'L\'importation a échoué',
        back: 'Retour',
        // File Import
        csvUploadTitle: 'Télécharger un fichier CSV',
        jsonUploadTitle: 'Télécharger un fichier JSON',
        fieldDelimiter: 'Délimiteur de champs',
        delimiterHint: 'Choisissez comment les champs sont séparés',
        comma: 'Virgule (,)',
        tab: 'Tabulation (\\t)',
        semicolon: 'Point-virgule (;)',
        clickToSelect: 'Cliquez pour sélectionner un fichier',
        orDragAndDrop: 'ou glissez-déposez ici',
        expectedFormat: 'Format attendu',
        csvExample: 'Exemple CSV',
        jsonExample: 'Exemple JSON',
        csvFormatNote: 'Les fichiers CSV doivent avoir une ligne d\'en-tête avec les colonnes "name" et "positions".',
        jsonFormatNote: 'Les fichiers JSON doivent contenir un tableau d\'objets avec les champs "name" et "positions".',
        browseFiles: 'Parcourir les fichiers',
        changeFile: 'Changer de fichier',
        copied: 'Copié !',
        // Text Import
        pasteOrType: 'Collez ou saisissez les données des joueurs',
        playerData: 'Données des joueurs',
        pasteDataPlaceholder: 'Collez les données CSV ou JSON ici...',
        examples: 'Exemples',
        csvFormat: 'Format CSV',
        jsonFormat: 'Format JSON',
        namesOnly: 'Noms uniquement',
        allPositionsAssigned: 'Toutes les positions seront attribuées',
        // API Import
        fetchFromUrl: 'Récupérer depuis une URL',
        url: 'URL',
        urlHint: 'Entrez l\'URL de vos données JSON',
        fetchData: 'Récupérer les données',
        fetching: 'Récupération...',
        authentication: 'Authentification',
        authHint: 'Sélectionnez la méthode d\'authentification si nécessaire',
        authNone: 'Aucune (URL publique)',
        authBearer: 'Token Bearer',
        authApiKey: 'Clé API',
        authBasic: 'Authentification basique',
        authCustomHeaders: 'En-têtes personnalisés',
        expectedJsonFormat: 'Format JSON attendu',
        responseExample: 'Exemple de réponse',
        notes: 'Notes',
        noteJsonRequired: 'L\'URL doit retourner des données JSON',
        noteArrayRequired: 'La réponse doit être un tableau d\'objets joueurs',
        noteFieldsRequired: 'Chaque objet doit avoir les champs "name" et "positions"',
        noteCorsRequired: 'CORS doit être activé sur le serveur',
        urlRequired: 'Veuillez entrer une URL',
        invalidUrl: 'URL invalide',
        invalidUrlDetail: 'Veuillez entrer une URL valide (ex : https://example.com/data.json)',
        fetchingFrom: 'Récupération des données depuis {{url}}...',
        fetchSuccess: 'Données récupérées avec succès !',
        fetchedItems: '{{count}} élément(s) récupéré(s) depuis l\'URL.',
        fetchFailed: 'Échec de la récupération des données',
        fileReadError: 'Erreur de lecture du fichier'
    },

    // Error Messages
    errors: {
        dataIncomplete: 'Les données du joueur sont incomplètes. Veuillez vérifier votre liste de joueurs.',
        loadFailed: 'Impossible de charger la comparaison suivante. Veuillez réessayer.',
        selectPosition: 'Veuillez sélectionner au moins une position',
        selectActivity: 'Veuillez d\'abord sélectionner un type d\'activité',
        selectPlayerPerTeam: 'Veuillez sélectionner au moins un joueur par équipe',
        exportFailed: 'L\'exportation a échoué',
        playerNotFound: 'Joueur non trouvé',
        invalidJson: 'Format JSON invalide',
        noDataToImport: 'Aucune donnée à importer',
        unexpectedError: 'Une erreur inattendue s\'est produite'
    },

    // Success Messages
    success: {
        winWin: 'Égalité enregistrée',
        exportComplete: 'Équipes exportées !',
        resetComplete: '{{count}} comparaisons ont été réinitialisées',
        playerAdded: 'Joueur "{{name}}" ajouté !',
        playerRemoved: 'Joueur "{{name}}" supprimé',
        playerUpdated: 'Joueur "{{name}}" mis à jour',
        positionsUpdated: 'Positions mises à jour pour {{name}}',
        removedPlayers: '{{count}} joueur(s) supprimé(s)',
        dataMigrated: 'Données migrées vers v{{version}}',
        teamsCreated: 'Équipes créées ! Balance : {{balance}} différence ELO pondérée'
    },

    // Info Messages
    info: {
        noComparisons: 'Aucune comparaison à réinitialiser',
        optimizing: 'Optimisation des équipes... Cela peut prendre un moment',
        reloading: 'Rechargement...'
    },

    // Titles
    titles: {
        status: 'Statut',
        dataError: 'Erreur de Données',
        applicationError: 'Erreur d\'Application',
        reloadPage: 'Recharger la Page',
        failedToLoad: 'Échec du chargement de {{name}}'
    },

    // Language names (for language selector)
    languages: {
        en: 'Anglais',
        ru: 'Russe',
        es: 'Espagnol',
        fr: 'Français',
        de: 'Allemand',
        ja: 'Japonais',
        zh: 'Chinois',
        selectLanguage: 'Sélectionner la Langue'
    }
};
