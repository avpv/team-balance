// src/locales/ja.js
// Japanese translations - 日本語翻訳

export default {
    // Common
    common: {
        save: '保存',
        cancel: 'キャンセル',
        close: '閉じる',
        confirm: '確認',
        delete: '削除',
        edit: '編集',
        reset: 'リセット',
        add: '追加',
        remove: '削除',
        import: 'インポート',
        export: 'エクスポート',
        download: 'ダウンロード',
        copy: 'コピー',
        loading: '読み込み中...',
        search: '検索',
        select: '選択',
        selectAll: 'すべて選択',
        player: 'プレイヤー',
        players: 'プレイヤー',
        team: 'チーム',
        teams: 'チーム',
        position: 'ポジション',
        positions: 'ポジション',
        rating: 'レーティング',
        ratings: 'レーティング',
        comparisons: '比較',
        warning: '警告',
        dangerZone: '危険ゾーン',
        yes: 'はい',
        no: 'いいえ'
    },

    // Navigation
    nav: {
        settings: '設定',
        compare: '比較',
        rankings: 'ランキング',
        teams: 'チーム'
    },

    // Settings Page
    settings: {
        title: 'プレイヤー管理',
        subtitle: 'アクティビティを選択し、プレイヤーを追加してロスターを管理',

        // Activity Selector
        activity: {
            label: 'アクティビティタイプ',
            placeholder: 'スポーツまたはアクティビティを選択...',
            recentActivities: '最近のアクティビティ',
            allActivities: 'すべてのアクティビティ',
            newTeam: '新しいチーム',
            newTeamTitle: '独自のプレイヤーリストを持つ新しいチームを作成',
            helpText: 'スポーツまたはアクティビティを選択し、「新しいチーム」をクリックして開始します。各チームには独自のプレイヤーリストがあり、サイドバーに保存されます。',
            switchingTo: '{{activity}}に切り替え中...',
            willBeApplied: '新しいチームを作成すると{{activity}}が適用されます',
            newTeamCreated: '新しいチームが作成されました',
            invalidActivity: '無効なアクティビティが選択されました',
            selectFirst: '最初にアクティビティを選択してください'
        },

        // Add Player Form
        addPlayers: {
            title: 'プレイヤーを追加',
            importPlayers: 'プレイヤーをインポート',
            importBtn: 'インポート',
            importHelp: 'プレイヤーの名前とポジションを含むCSVまたはJSONファイルをアップロード',
            addIndividual: '個別にプレイヤーを追加',
            playerName: 'プレイヤー名',
            playerNamePlaceholder: '例：山田太郎',
            playerNameHelp: 'プレイヤーのフルネームを入力してください',
            positionsLabel: 'ポジション',
            positionsHint: '（該当するものをすべて選択）',
            positionsHelp: 'このプレイヤーが担当できるポジションを1つ以上選択',
            addPlayerBtn: 'プレイヤーを追加',
            bulkActions: '一括操作',
            resetAllRatings: 'すべてのレーティングをリセット',
            removeAllPlayers: 'すべてのプレイヤーを削除',
            bulkActionsWarning: 'これらの操作は元に戻せません。慎重に使用してください。'
        },

        // Player List
        playerList: {
            title: '現在のプレイヤー',
            noPlayers: 'プレイヤーがまだ追加されていません',
            addPlayersPrompt: '上のフォームを使用してプレイヤーを追加してください',
            editPositions: 'ポジションを編集',
            resetPlayer: 'レーティングをリセット',
            removePlayer: 'プレイヤーを削除'
        },

        // Position Stats
        positionStats: {
            title: 'ポジション概要',
            playersAtPosition: 'このポジションに{{count}}人のプレイヤー'
        },

        // Welcome Guide
        welcome: {
            title: 'TeamBalanceへようこそ！',
            subtitle: '完璧にバランスの取れたチームを作成します。4つの簡単なステップで開始：',
            step1: 'スポーツまたはアクティビティを選択',
            step1Detail: '下のドロップダウンから開始します',
            step2: 'プレイヤーを追加',
            step2Detail: 'ポジションを割り当てます',
            step3: 'プレイヤーを直接比較',
            step3Detail: '正確なスキルレーティングを構築します',
            step4: 'バランスの取れたチームを自動生成',
            step4Detail: 'ワンクリックで'
        },

        // Modals
        modals: {
            editPositions: {
                title: 'ポジションを編集 - {{name}}',
                label: 'ポジション（該当するものをすべて選択）：'
            },
            resetPlayer: {
                title: 'プレイヤーをリセット - {{name}}',
                label: 'リセットするポジションを選択：',
                warning: 'これによりプレイヤーのレーティングが1500にリセットされ、選択したポジションの比較履歴がクリアされます。'
            },
            resetAll: {
                title: 'すべてのプレイヤーレーティングをリセット',
                label: 'すべてのプレイヤーでリセットするポジションを選択：',
                warning: 'これによりすべてのプレイヤーが1500 ELOにリセットされ、選択したポジションのすべての比較履歴がクリアされます。この操作は元に戻せません！'
            },
            clearAll: {
                title: 'すべてのプレイヤーを削除',
                label: 'すべてのプレイヤーを削除するポジションを選択：',
                warning: '選択したポジションをプレイするすべてのプレイヤーが削除されます。すべてのデータ、レーティング、履歴が削除されます。この操作は元に戻せません！'
            },
            importPlayers: {
                title: 'プレイヤーをインポート',
                confirmBtn: 'インポート'
            }
        }
    },

    // Compare Page
    compare: {
        title: 'プレイヤーを比較',
        subtitle: '直接比較を通じて正確なプレイヤーレーティングを構築',

        // Position Selector
        positionSelector: {
            title: 'ポジションを選択',
            resetPosition: 'ポジション比較をリセット',
            resetAll: 'すべてリセット',
            progress: '{{completed}}/{{total}} 比較',
            complete: '完了！'
        },

        // Comparison Area
        comparison: {
            whoIsBetter: 'どちらが上手？',
            selectPosition: '上のポジションを選択してプレイヤーの比較を開始',
            needMorePlayers: '少なくとも2人のプレイヤーが必要',
            needMorePlayersDetail: '設定ページでこのポジションにプレイヤーを追加して比較を開始',
            allComplete: 'すべての比較が完了しました！',
            allCompleteDetail: '素晴らしい！{{position}}のすべてのプレイヤー比較が完了しました。',
            suggestion: '次は{{position}}プレイヤーを比較してみてください！',
            allPositionsComplete: 'すべてのポジションが完了しました！',
            draw: '引き分け',
            drawTooltip: '両方のプレイヤーが同等のスキル（Wキー）',
            leftKeyHint: 'Aキー',
            rightKeyHint: 'Dキー',
            positionComplete: 'ポジション完了！',
            comparedCount: '{{count}} 比較'
        },

        // Messages
        messages: {
            insufficientPlayers: '{{position}}：比較には少なくとも2人のプレイヤーが必要です。現在このポジションには{{count}}人のプレイヤーがいます。',
            allCompared: '{{position}}：このポジションのすべての比較が完了しました。',
            resetConfirm: '{{position}}のすべての比較をリセットしてもよろしいですか？この操作は元に戻せません。',
            resetSuccess: '{{position}}の比較がリセットされました'
        },

        // Reset Modal
        resetModal: {
            title: 'すべての比較をリセット',
            label: '比較をリセットするポジションを選択：',
            warning: '選択したポジションのすべての比較履歴がリセットされます。プレイヤーレーティングは1500に再計算されます。この操作は元に戻せません！'
        }
    },

    // Rankings Page
    rankings: {
        title: 'プレイヤーランキング',
        subtitle: 'すべてのポジションでプレイヤーのスキルレーティングを確認・比較',

        // Position Filter
        positionFilter: {
            all: 'すべてのポジション',
            filterBy: 'ポジションでフィルター'
        },

        // Rankings Table
        table: {
            rank: '順位',
            player: 'プレイヤー',
            position: 'ポジション',
            rating: 'レーティング',
            comparisons: '比較',
            noPlayers: 'ランク付けするプレイヤーがいません',
            addPlayersPrompt: 'ランキングを表示するには設定ページでプレイヤーを追加してください'
        }
    },

    // Teams Page
    teams: {
        title: 'バランスの取れたチームを作成',
        subtitle: 'チーム構成とウェイトを設定し、数学的アルゴリズムを使用して最適にバランスの取れたチームを生成',

        // Team Builder
        builder: {
            numberOfTeams: 'チーム数',
            numberOfTeamsHelp: '作成するチーム数を選択（{{min}}-{{max}}）',
            composition: 'チーム構成とウェイト',
            compositionHelp: 'ポジションごとのプレイヤー数と重要度ウェイトを設定（ウェイトが高い＝バランスにより重要）',
            position: 'ポジション',
            count: '人数',
            countTooltip: 'このポジションのチームあたりのプレイヤー数',
            weight: 'ウェイト',
            weightTooltip: 'バランス優先度（1.0-3.0、高い＝より重要）',
            generateBtn: 'バランスの取れたチームを生成',
            generating: 'チーム生成中...',
            needMorePlayers: 'チームを作成するには設定ページで少なくとも2人のプレイヤーを追加してください'
        },

        // Generated Teams
        results: {
            title: 'バランスの取れたチーム',
            teamsGenerated: '{{count}}チーム生成',
            showEloRatings: 'ELOレーティングを表示',
            showPositions: 'ポジションを表示',
            exportBtn: 'エクスポート',
            balanceQuality: 'チームバランス品質：',
            eloDifference: '{{value}} ELO平均差',
            excellent: '優秀',
            veryGood: '非常に良い',
            good: '良い',
            fair: '普通',
            poor: '悪い',
            excellentMsg: '優れたバランス！',
            goodMsg: '良いバランス',
            poorMsg: 'より良いバランスのために再生成を検討してください',
            lowerIsBetter: '差が小さいほどチームが均等です。'
        },

        // Export Modal
        export: {
            title: 'チームをエクスポート',
            formatText: 'プレーンテキスト',
            formatCsv: 'CSV',
            formatJson: 'JSON',
            copyBtn: 'コピー',
            downloadBtn: 'ダウンロード',
            copiedSuccess: 'クリップボードにコピーしました！',
            exportSuccess: 'チームをエクスポートしました！'
        }
    },

    // Sidebar
    sidebar: {
        title: '最近のチーム',
        noTeams: 'チームがまだありません',
        createFirst: '最初のチームを作成',
        deleteTeam: 'チームを削除',
        deleteConfirm: 'このチームを削除しますか？',
        deleteConfirmWithPlayers: '{{count}}人のプレイヤーがいるチームを削除しますか？',
        deletedMessage: 'チームが削除されました。続行するにはサイドバーからチームを選択してください。',
        allDeletedMessage: 'すべてのチームが削除されました。続行するにはアクティビティを選択してください。'
    },

    // Import Wizard
    import: {
        selectSource: 'インポートソースを選択',
        textInput: 'テキスト入力',
        textInputDesc: 'CSVまたはJSONデータを直接貼り付け',
        fileUpload: 'ファイルアップロード',
        fileUploadDesc: 'CSVまたはJSONファイルをアップロード',
        apiImport: 'APIインポート',
        apiImportDesc: '外部APIからインポート',
        dropFile: 'ファイルをここにドロップまたはクリックして参照',
        supportedFormats: 'サポートされる形式：CSV、JSON',
        delimiter: '区切り文字',
        preview: 'プレビュー',
        foundPlayers: '{{count}}人のプレイヤーが見つかりました',
        noData: 'インポートするデータを提供してください',
        noPlayersFound: 'プレイヤーが見つかりません',
        importSuccess: '{{imported}}人のプレイヤーをインポートしました',
        importSuccessWithSkipped: '{{imported}}人のプレイヤーをインポート、{{skipped}}人をスキップ',
        importFailed: 'インポートに失敗しました'
    },

    // Error Messages
    errors: {
        dataIncomplete: 'プレイヤーデータが不完全です。プレイヤーリストを確認してください。',
        loadFailed: '次の比較を読み込めませんでした。もう一度お試しください。',
        selectPosition: '少なくとも1つのポジションを選択してください',
        selectActivity: '最初にアクティビティタイプを選択してください',
        selectPlayerPerTeam: 'チームあたり少なくとも1人のプレイヤーを選択してください',
        exportFailed: 'エクスポートに失敗しました',
        playerNotFound: 'プレイヤーが見つかりません',
        invalidJson: '無効なJSON形式',
        noDataToImport: 'インポートするデータがありません',
        unexpectedError: '予期しないエラーが発生しました'
    },

    // Success Messages
    success: {
        winWin: '引き分けを記録しました',
        exportComplete: 'チームをエクスポートしました！',
        resetComplete: '{{count}}件の比較がリセットされました',
        playerAdded: 'プレイヤー「{{name}}」を追加しました！',
        playerRemoved: 'プレイヤー「{{name}}」を削除しました',
        playerUpdated: 'プレイヤー「{{name}}」を更新しました',
        positionsUpdated: '{{name}}のポジションを更新しました',
        removedPlayers: '{{count}}人のプレイヤーを削除しました',
        dataMigrated: 'データをv{{version}}に移行しました'
    },

    // Info Messages
    info: {
        noComparisons: 'リセットする比較がありません',
        optimizing: 'チームを最適化中... しばらくお待ちください',
        reloading: '再読み込み中...'
    },

    // Titles
    titles: {
        status: 'ステータス',
        dataError: 'データエラー',
        applicationError: 'アプリケーションエラー',
        reloadPage: 'ページを再読み込み',
        failedToLoad: '{{name}}の読み込みに失敗しました'
    },

    // Language names (for language selector)
    languages: {
        en: '英語',
        es: 'スペイン語',
        fr: 'フランス語',
        de: 'ドイツ語',
        ja: '日本語',
        zh: '中国語',
        selectLanguage: '言語を選択'
    }
};
