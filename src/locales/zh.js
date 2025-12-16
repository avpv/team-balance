// src/locales/zh.js
// Chinese translations - 中文翻译

export default {
    // Common
    common: {
        save: '保存',
        cancel: '取消',
        close: '关闭',
        confirm: '确认',
        delete: '删除',
        edit: '编辑',
        reset: '重置',
        add: '添加',
        remove: '移除',
        import: '导入',
        export: '导出',
        download: '下载',
        copy: '复制',
        loading: '加载中...',
        search: '搜索',
        select: '选择',
        selectAll: '全选',
        player: '球员',
        players: '球员',
        team: '队伍',
        teams: '队伍',
        position: '位置',
        positions: '位置',
        rating: '评分',
        ratings: '评分',
        comparisons: '比较',
        warning: '警告',
        dangerZone: '危险区域',
        yes: '是',
        no: '否'
    },

    // Navigation
    nav: {
        settings: '设置',
        compare: '比较',
        rankings: '排名',
        teams: '队伍'
    },

    // Settings Page
    settings: {
        title: '球员管理',
        subtitle: '选择您的活动，添加球员并管理您的阵容',

        // Activity Selector
        activity: {
            label: '活动类型',
            placeholder: '选择运动或活动...',
            recentActivities: '最近活动',
            allActivities: '所有活动',
            newTeam: '新队伍',
            newTeamTitle: '创建具有独立球员名单的新队伍',
            helpText: '选择您的运动或活动，然后点击"新队伍"开始。每个队伍都有自己的球员名单，保存在侧边栏中。',
            switchingTo: '正在切换到{{activity}}...',
            willBeApplied: '创建新队伍时将应用{{activity}}',
            newTeamCreated: '新队伍已创建',
            invalidActivity: '选择的活动无效',
            selectFirst: '请先选择一个活动'
        },

        // Add Player Form
        addPlayers: {
            title: '添加球员',
            importPlayers: '导入球员',
            importBtn: '导入',
            importHelp: '上传包含球员姓名和位置的CSV或JSON文件',
            addIndividual: '单独添加球员',
            playerName: '球员姓名',
            playerNamePlaceholder: '例如：张三',
            playerNameHelp: '输入球员的全名',
            positionsLabel: '位置',
            positionsHint: '（选择所有适用的）',
            positionsHelp: '选择该球员可以担任的一个或多个位置',
            addPlayerBtn: '添加球员',
            bulkActions: '批量操作',
            resetAllRatings: '重置所有评分',
            removeAllPlayers: '移除所有球员',
            bulkActionsWarning: '这些操作无法撤销。请谨慎使用。'
        },

        // Player List
        playerList: {
            title: '当前球员',
            noPlayers: '尚未添加球员',
            addPlayersPrompt: '使用上面的表单添加球员',
            editPositions: '编辑位置',
            resetPlayer: '重置评分',
            removePlayer: '移除球员'
        },

        // Position Stats
        positionStats: {
            title: '位置概览',
            playersAtPosition: '该位置有{{count}}名球员'
        },

        // Welcome Guide
        welcome: {
            title: '欢迎使用TeamBalance！',
            subtitle: '创建完美平衡的队伍。按4个简单步骤开始：',
            step1: '选择您的运动或活动',
            step1Detail: '从下面的下拉菜单开始',
            step2: '添加您的球员',
            step2Detail: '并分配他们的位置',
            step3: '进行球员对比',
            step3Detail: '建立准确的技能评分',
            step4: '自动生成平衡队伍',
            step4Detail: '一键完成'
        },

        // Modals
        modals: {
            editPositions: {
                title: '编辑位置 - {{name}}',
                label: '位置（选择所有适用的）：'
            },
            resetPlayer: {
                title: '重置球员 - {{name}}',
                label: '选择要重置的位置：',
                warning: '这将把球员的评分重置为1500，并清除所选位置的比较历史记录。'
            },
            resetAll: {
                title: '重置所有球员评分',
                label: '选择要为所有球员重置的位置：',
                warning: '这将把所有球员重置为1500 ELO，并清除所选位置的所有比较历史记录。此操作无法撤销！'
            },
            clearAll: {
                title: '移除所有球员',
                label: '选择要移除所有球员的位置：',
                warning: '这将移除所有担任所选位置的球员。将删除他们的所有数据、评分和历史记录。此操作无法撤销！'
            },
            importPlayers: {
                title: '导入球员',
                confirmBtn: '导入'
            }
        }
    },

    // Compare Page
    compare: {
        title: '比较球员',
        subtitle: '通过面对面比较建立准确的球员评分',

        // Position Selector
        positionSelector: {
            title: '选择位置',
            selectPosition: '选择要比较的位置',
            pickPosition: '选择下方的位置开始面对面比较球员并建立您的排名。',
            quickKeys: '快捷键：',
            quickKeysHint: '左 • 右 • 平局',
            resetPosition: '重置位置比较',
            resetAll: '全部重置',
            progress: '{{completed}}/{{total}} 比较',
            complete: '完成！',
            notEnoughPlayers: '球员不足',
            statusComplete: '已完成',
            statusInProgress: '进行中',
            statusReady: '准备就绪',
            noPlayersAtPosition: '尚未分配{{position}}位置的球员。请在设置页面添加球员。'
        },

        // Comparison Area
        comparison: {
            whoIsBetter: '谁更擅长',
            selectPosition: '选择上面的位置开始比较球员',
            needMorePlayers: '至少需要2名球员',
            needMorePlayersDetail: '在设置页面为该位置添加更多球员以开始比较',
            allComplete: '所有比较已完成！',
            allCompleteDetail: '太棒了！{{position}}的所有球员比较都已完成。',
            suggestion: '接下来试试比较{{position}}球员吧！',
            allPositionsComplete: '所有位置都已完成！',
            draw: '平局',
            drawTooltip: '两名球员技能相当（W键）',
            leftKeyHint: 'A键',
            rightKeyHint: 'D键',
            positionComplete: '位置完成！',
            comparedCount: '{{count}} 次比较',
            compare: '比较',
            reset: '重置'
        },

        // Messages
        messages: {
            insufficientPlayers: '{{position}}：比较至少需要2名球员。当前该位置有{{count}}名球员。',
            allCompared: '{{position}}：该位置的所有比较都已完成。',
            resetConfirm: '确定要重置{{position}}的所有比较吗？此操作无法撤销。',
            resetSuccess: '{{position}}的比较已重置'
        },

        // Reset Modal
        resetModal: {
            title: '重置所有比较',
            label: '选择要重置比较的位置：',
            warning: '这将重置所选位置的所有比较历史记录。球员评分将重新计算为1500。此操作无法撤销！'
        }
    },

    // Rankings Page
    rankings: {
        title: '球员排名',
        subtitle: '查看和比较所有位置的球员技能评分',

        // Position Filter
        positionFilter: {
            all: '所有位置',
            filterBy: '按位置筛选'
        },

        // Rankings Table
        table: {
            rank: '排名',
            player: '球员',
            position: '位置',
            rating: '评分',
            comparisons: '比较次数',
            noPlayers: '没有可排名的球员',
            addPlayersPrompt: '在设置页面添加球员以查看排名'
        }
    },

    // Teams Page
    teams: {
        title: '创建平衡队伍',
        subtitle: '配置队伍组成和权重，然后使用数学算法生成最优平衡的队伍',

        // Team Builder
        builder: {
            numberOfTeams: '队伍数量',
            numberOfTeamsHelp: '选择要创建的队伍数量（{{min}}-{{max}}）',
            composition: '队伍组成和权重',
            compositionHelp: '设置每个位置的球员数量及其重要性权重（权重越高 = 对平衡越重要）',
            position: '位置',
            count: '数量',
            countTooltip: '该位置每队的球员数',
            weight: '权重',
            weightTooltip: '平衡优先级（1.0-3.0，越高越重要）',
            generateBtn: '生成平衡队伍',
            generating: '正在生成队伍...',
            needMorePlayers: '请在设置页面添加至少2名球员以创建队伍'
        },

        // Generated Teams
        results: {
            title: '您的平衡队伍',
            teamsGenerated: '已生成{{count}}支队伍',
            showEloRatings: '显示ELO评分',
            showPositions: '显示位置',
            exportBtn: '导出',
            balanceQuality: '队伍平衡质量：',
            eloDifference: '{{value}} ELO平均差值',
            excellent: '优秀',
            veryGood: '非常好',
            good: '良好',
            fair: '一般',
            poor: '较差',
            excellentMsg: '出色的平衡！',
            goodMsg: '良好的平衡',
            poorMsg: '考虑重新生成以获得更好的平衡',
            lowerIsBetter: '差值越小意味着队伍越均衡。'
        },

        // Export Modal
        export: {
            title: '导出队伍',
            formatText: '纯文本',
            formatCsv: 'CSV',
            formatJson: 'JSON',
            copyBtn: '复制',
            downloadBtn: '下载',
            copiedSuccess: '已复制到剪贴板！',
            exportSuccess: '队伍已导出！',
            exportAs: '导出为{{format}}',
            preview: '预览'
        }
    },

    // Sidebar
    sidebar: {
        title: '最近的队伍',
        noTeams: '还没有队伍',
        createFirst: '创建您的第一支队伍',
        deleteTeam: '删除队伍',
        deleteConfirm: '删除这支队伍？',
        deleteConfirmWithPlayers: '删除有{{count}}名球员的队伍？',
        deletedMessage: '队伍已删除。请从侧边栏选择一支队伍继续。',
        allDeletedMessage: '所有队伍已删除。请选择一个活动继续。'
    },

    // Import Wizard
    import: {
        selectSource: '选择导入来源',
        textInput: '文本输入',
        textInputDesc: '直接粘贴CSV或JSON数据',
        fileUpload: '文件上传',
        fileUploadDesc: '上传CSV或JSON文件',
        apiImport: 'API导入',
        apiImportDesc: '从外部API导入',
        dropFile: '将文件拖放到此处或点击浏览',
        supportedFormats: '支持的格式：CSV、JSON',
        delimiter: '分隔符',
        preview: '预览',
        foundPlayers: '找到{{count}}名球员',
        noData: '请提供要导入的数据',
        noPlayersFound: '未找到球员',
        importSuccess: '已导入{{imported}}名球员',
        importSuccessWithSkipped: '已导入{{imported}}名球员，跳过{{skipped}}名',
        importFailed: '导入失败',
        back: '返回',
        // File Import
        csvUploadTitle: '上传CSV文件',
        jsonUploadTitle: '上传JSON文件',
        fieldDelimiter: '字段分隔符',
        delimiterHint: '选择字段的分隔方式',
        comma: '逗号 (,)',
        tab: '制表符 (\\t)',
        semicolon: '分号 (;)',
        clickToSelect: '点击选择文件',
        orDragAndDrop: '或拖放到此处',
        expectedFormat: '预期格式',
        csvExample: 'CSV示例',
        jsonExample: 'JSON示例',
        csvFormatNote: 'CSV文件应包含带有"name"和"positions"列的标题行。',
        jsonFormatNote: 'JSON文件应包含具有"name"和"positions"字段的对象数组。',
        browseFiles: '浏览文件',
        changeFile: '更换文件',
        copied: '已复制！',
        // Text Import
        pasteOrType: '粘贴或输入球员数据',
        playerData: '球员数据',
        pasteDataPlaceholder: '在此粘贴CSV或JSON数据...',
        examples: '示例',
        csvFormat: 'CSV格式',
        jsonFormat: 'JSON格式',
        namesOnly: '仅姓名',
        allPositionsAssigned: '将分配所有位置',
        // API Import
        fetchFromUrl: '从URL获取',
        url: 'URL',
        urlHint: '输入您的JSON数据URL',
        fetchData: '获取数据',
        fetching: '获取中...',
        authentication: '身份验证',
        authHint: '如有需要，请选择身份验证方式',
        authNone: '无（公开URL）',
        authBearer: 'Bearer令牌',
        authApiKey: 'API密钥',
        authBasic: '基本身份验证',
        authCustomHeaders: '自定义请求头',
        expectedJsonFormat: '预期JSON格式',
        responseExample: '响应示例',
        notes: '注意事项',
        noteJsonRequired: 'URL必须返回JSON数据',
        noteArrayRequired: '响应应为球员对象数组',
        noteFieldsRequired: '每个对象必须包含"name"和"positions"字段',
        noteCorsRequired: '服务器必须启用CORS',
        urlRequired: '请输入URL',
        invalidUrl: '无效的URL',
        invalidUrlDetail: '请输入有效的URL（例如：https://example.com/data.json）',
        fetchingFrom: '正在从{{url}}获取数据...',
        fetchSuccess: '数据获取成功！',
        fetchedItems: '从URL获取了{{count}}个项目。',
        fetchFailed: '数据获取失败',
        fileReadError: '文件读取错误'
    },

    // Error Messages
    errors: {
        dataIncomplete: '球员数据不完整。请检查您的球员列表。',
        loadFailed: '无法加载下一个比较。请重试。',
        selectPosition: '请至少选择一个位置',
        selectActivity: '请先选择活动类型',
        selectPlayerPerTeam: '请每队至少选择一名球员',
        exportFailed: '导出失败',
        playerNotFound: '未找到球员',
        invalidJson: '无效的JSON格式',
        noDataToImport: '没有要导入的数据',
        unexpectedError: '发生意外错误'
    },

    // Success Messages
    success: {
        winWin: '平局已记录',
        exportComplete: '队伍已导出！',
        resetComplete: '已重置{{count}}次比较',
        playerAdded: '球员"{{name}}"已添加！',
        playerRemoved: '球员"{{name}}"已移除',
        playerUpdated: '球员"{{name}}"已更新',
        positionsUpdated: '已更新{{name}}的位置',
        removedPlayers: '已移除{{count}}名球员',
        dataMigrated: '数据已迁移到v{{version}}'
    },

    // Info Messages
    info: {
        noComparisons: '没有可重置的比较',
        optimizing: '正在优化队伍...这可能需要一些时间',
        reloading: '正在重新加载...'
    },

    // Titles
    titles: {
        status: '状态',
        dataError: '数据错误',
        applicationError: '应用程序错误',
        reloadPage: '重新加载页面',
        failedToLoad: '加载{{name}}失败'
    },

    // Language names (for language selector)
    languages: {
        en: '英语',
        ru: '俄语',
        es: '西班牙语',
        fr: '法语',
        de: '德语',
        ja: '日语',
        zh: '中文',
        selectLanguage: '选择语言'
    }
};
