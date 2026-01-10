// src/locales/ko.js
// Korean translations - 한국어 번역

export default {
    // Common
    common: {
        save: '저장',
        cancel: '취소',
        close: '닫기',
        confirm: '확인',
        delete: '삭제',
        edit: '편집',
        reset: '초기화',
        add: '추가',
        remove: '제거',
        import: '가져오기',
        export: '내보내기',
        download: '다운로드',
        copy: '복사',
        loading: '로딩 중...',
        search: '검색',
        select: '선택',
        selectAll: '모두 선택',
        player: '선수',
        players: '선수',
        team: '팀',
        teams: '팀',
        position: '포지션',
        positions: '포지션',
        rating: '레이팅',
        ratings: '레이팅',
        comparisons: '비교',
        comparisonsShort: '비교',
        multiPosition: '다중 포지션',
        warning: '경고',
        dangerZone: '위험 영역',
        yes: '예',
        no: '아니오'
    },

    // Navigation
    nav: {
        settings: '설정',
        compare: '비교',
        rankings: '순위',
        teams: '팀'
    },

    // Settings Page
    settings: {
        title: '선수 관리',
        subtitle: '활동을 선택하고, 선수를 추가하고, 로스터를 관리하세요',

        // Activity Selector
        activity: {
            label: '활동 유형',
            placeholder: '스포츠 또는 활동을 선택하세요...',
            recentActivities: '최근 활동',
            allActivities: '모든 활동',
            newTeam: '새 팀',
            newTeamTitle: '자체 선수 목록으로 새 팀 만들기',
            helpText: '스포츠 또는 활동을 선택한 다음 "새 팀"을 클릭하여 시작하세요. 각 팀은 자체 선수 목록을 가지며 사이드바에 저장됩니다.',
            switchingTo: '{{activity}}(으)로 전환 중...',
            willBeApplied: '새 팀을 만들 때 {{activity}}이(가) 적용됩니다',
            newTeamCreated: '새 팀이 생성되었습니다',
            invalidActivity: '잘못된 활동이 선택되었습니다',
            selectFirst: '먼저 활동을 선택해 주세요'
        },

        // Add Player Form
        addPlayers: {
            title: '선수 추가',
            importPlayers: '선수 가져오기',
            importBtn: '가져오기',
            importHelp: '선수 이름과 포지션이 포함된 CSV 또는 JSON 파일을 업로드하세요',
            addIndividual: '개별 선수 추가',
            playerName: '선수 이름',
            playerNamePlaceholder: '예: 홍길동',
            playerNameHelp: '선수의 전체 이름을 입력하세요',
            positionsLabel: '포지션',
            positionsHint: '(해당하는 모든 항목 선택)',
            positionsHelp: '이 선수가 맡을 수 있는 포지션을 하나 이상 선택하세요',
            addPlayerBtn: '선수 추가',
            bulkActions: '일괄 작업',
            resetAllRatings: '모든 레이팅 초기화',
            removeAllPlayers: '모든 선수 제거',
            bulkActionsWarning: '이 작업은 되돌릴 수 없습니다. 주의해서 사용하세요.'
        },

        // Player List
        playerList: {
            title: '현재 선수',
            noPlayers: '아직 추가된 선수가 없습니다',
            addPlayersPrompt: '위의 양식을 사용하여 선수를 추가하세요',
            editPositions: '포지션 편집',
            resetPlayer: '레이팅 초기화',
            removePlayer: '선수 제거'
        },

        // Position Stats
        positionStats: {
            title: '포지션 개요',
            playersAtPosition: '이 포지션에 {{count}}명의 선수'
        },

        // Welcome Guide
        welcome: {
            title: 'TeamBalance에 오신 것을 환영합니다!',
            subtitle: '완벽하게 균형 잡힌 팀을 만드세요. 4단계로 시작하세요:',
            step1: '스포츠 또는 활동 선택',
            step1Detail: '아래 드롭다운에서 선택하여 시작',
            step2: '선수 추가',
            step2Detail: '및 포지션 지정',
            step3: '선수 1:1 비교',
            step3Detail: '로 정확한 실력 레이팅 구축',
            step4: '균형 잡힌 팀 자동 생성',
            step4Detail: '한 번의 클릭으로'
        },

        // Modals
        modals: {
            editPositions: {
                title: '포지션 편집 - {{name}}',
                label: '포지션 (해당하는 모든 항목 선택):'
            },
            resetPlayer: {
                title: '선수 초기화 - {{name}}',
                label: '초기화할 포지션 선택:',
                warning: '선택한 포지션에 대해 선수의 레이팅이 1500으로 초기화되고 비교 기록이 삭제됩니다.'
            },
            resetAll: {
                title: '모든 선수 레이팅 초기화',
                label: '모든 선수에 대해 초기화할 포지션 선택:',
                warning: '선택한 포지션에 대해 모든 선수가 1500 ELO로 초기화되고 모든 비교 기록이 삭제됩니다. 이 작업은 되돌릴 수 없습니다!'
            },
            clearAll: {
                title: '모든 선수 제거',
                label: '모든 선수를 제거할 포지션 선택:',
                warning: '선택한 포지션의 모든 선수가 제거됩니다. 모든 데이터, 레이팅, 기록이 삭제됩니다. 이 작업은 되돌릴 수 없습니다!'
            },
            importPlayers: {
                title: '선수 가져오기',
                confirmBtn: '가져오기'
            },
            removePlayer: {
                confirmMessage: '{{name}}을(를) 제거하시겠습니까?'
            }
        }
    },

    // Compare Page
    compare: {
        title: '선수 비교',
        subtitle: '1:1 비교를 통해 정확한 선수 레이팅 구축',

        // Position Selector
        positionSelector: {
            title: '포지션 선택',
            selectPosition: '비교할 포지션 선택',
            pickPosition: '아래에서 포지션을 선택하여 선수 간 1:1 비교를 시작하고 순위를 구축하세요.',
            quickKeys: '단축키:',
            quickKeysHint: '왼쪽 • 오른쪽 • 무승부',
            resetPosition: '포지션 비교 초기화',
            resetAll: '모두 초기화',
            progress: '{{completed}}/{{total}} 비교',
            complete: '완료!',
            notEnoughPlayers: '선수가 부족합니다',
            statusComplete: '완료',
            statusInProgress: '진행 중',
            statusReady: '준비됨',
            noPlayersAtPosition: '아직 {{position}} 포지션에 배정된 선수가 없습니다. 설정 페이지에서 선수를 추가하세요.'
        },

        // Comparison Area
        comparison: {
            whoIsBetter: '누가 더 잘합니까',
            selectPosition: '위에서 포지션을 선택하여 선수 비교 시작',
            needMorePlayers: '최소 2명의 선수 필요',
            needMorePlayersDetail: '비교를 시작하려면 설정 페이지에서 이 포지션에 선수를 더 추가하세요',
            allComplete: '모든 비교 완료!',
            allCompleteDetail: '잘했습니다! {{position}}의 모든 선수 비교가 완료되었습니다.',
            suggestion: '다음으로 {{position}} 선수를 비교해 보세요!',
            allPositionsComplete: '모든 포지션이 완료되었습니다!',
            draw: '무승부',
            drawTooltip: '두 선수의 실력이 동등함 (W 키)',
            leftKeyHint: 'A 키',
            rightKeyHint: 'D 키',
            positionComplete: '포지션 완료!',
            comparedCount: '{{count}} 비교',
            compare: '비교',
            reset: '초기화'
        },

        // Messages
        messages: {
            insufficientPlayers: '{{position}}: 비교하려면 최소 2명의 선수가 필요합니다. 현재 이 포지션에 {{count}}명의 선수가 있습니다.',
            allCompared: '{{position}}: 이 포지션의 모든 비교가 완료되었습니다.',
            resetConfirm: '{{position}}의 모든 비교를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
            resetSuccess: '{{position}} 비교가 초기화되었습니다'
        },

        // Reset Modal
        resetModal: {
            title: '모든 비교 초기화',
            label: '비교를 초기화할 포지션 선택:',
            warning: '선택한 포지션의 모든 비교 기록이 초기화됩니다. 선수 레이팅이 1500으로 재계산됩니다. 이 작업은 되돌릴 수 없습니다!'
        }
    },

    // Rankings Page
    rankings: {
        title: '선수 순위',
        subtitle: '모든 포지션에서 선수 실력 레이팅 보기 및 비교',
        playersRanked: '{{count}}명의 선수 순위',
        noPlayersAtPosition: '아직 {{position}} 포지션에 배정된 선수가 없습니다. 설정 페이지에서 선수를 추가하세요.',

        // Position Filter
        positionFilter: {
            all: '모든 포지션',
            filterBy: '포지션별 필터'
        },

        // Rankings Table
        table: {
            rank: '순위',
            player: '선수',
            position: '포지션',
            rating: '레이팅',
            comparisons: '비교',
            noPlayers: '순위를 매길 선수가 없습니다',
            addPlayersPrompt: '순위를 보려면 설정 페이지에서 선수를 추가하세요'
        }
    },

    // Teams Page
    teams: {
        title: '균형 잡힌 팀 만들기',
        subtitle: '팀 구성 및 가중치를 설정한 다음 수학적 알고리즘을 사용하여 최적으로 균형 잡힌 팀 생성',

        // Team Builder
        builder: {
            numberOfTeams: '팀 수',
            numberOfTeamsHelp: '만들 팀 수 선택 ({{min}}-{{max}})',
            composition: '팀 구성 및 가중치',
            compositionHelp: '포지션별 선수 수와 중요도 가중치 설정 (높은 가중치 = 균형에 더 중요)',
            configLabel: '팀 빌더 설정',
            compositionConfigLabel: '팀 구성 설정',
            teamCountLabel: '만들 팀 수',
            position: '포지션',
            count: '인원',
            countTooltip: '팀당 이 포지션의 선수 수',
            playerCountLabel: '팀당 {{position}} 수',
            weight: '가중치',
            weightTooltip: '균형 우선순위 (1.0-3.0, 높을수록 더 중요)',
            positionWeightLabel: '{{position}} 포지션 가중치',
            generateBtn: '균형 잡힌 팀 생성',
            generating: '팀 생성 중...',
            optimizingLabel: '팀 최적화 중...',
            needMorePlayers: '팀을 만들려면 설정 페이지에서 최소 2명의 선수를 추가하세요'
        },

        // Generated Teams
        results: {
            title: '생성된 균형 팀',
            teamsGenerated: '{{count}}개 팀 생성됨',
            regionLabel: '생성된 팀 결과',
            showEloRatings: 'ELO 레이팅 표시',
            showPositions: '포지션 표시',
            toggleEloLabel: 'ELO 레이팅 표시 전환',
            togglePositionsLabel: '선수 포지션 표시 전환',
            exportBtn: '내보내기',
            exportLabel: '팀을 파일로 내보내기',
            balanceQuality: '팀 균형 품질:',
            eloDifference: '{{value}} ELO 평균 차이',
            teamNumber: '팀 {{number}}',
            excellent: '훌륭함',
            veryGood: '매우 좋음',
            good: '좋음',
            fair: '보통',
            poor: '나쁨',
            excellentMsg: '훌륭한 균형!',
            goodMsg: '좋은 균형',
            poorMsg: '더 나은 균형을 위해 다시 생성하는 것을 고려하세요',
            lowerIsBetter: '차이가 낮을수록 더 균등한 팀입니다.'
        },

        // Export Modal
        export: {
            title: '팀 내보내기',
            formatText: '일반 텍스트',
            formatCsv: 'CSV',
            formatJson: 'JSON',
            copyBtn: '복사',
            downloadBtn: '다운로드',
            copiedSuccess: '클립보드에 복사되었습니다!',
            exportSuccess: '팀이 내보내졌습니다!',
            exportAs: '{{format}}(으)로 내보내기',
            preview: '미리보기'
        }
    },

    // Sidebar
    sidebar: {
        title: '최근 팀',
        noTeams: '아직 팀이 없습니다',
        createFirst: '첫 번째 팀 만들기',
        deleteTeam: '팀 삭제',
        deleteConfirm: '이 팀을 삭제하시겠습니까?',
        deleteConfirmWithPlayers: '{{count}}명의 선수가 있는 팀을 삭제하시겠습니까?',
        deletedMessage: '팀이 삭제되었습니다. 계속하려면 사이드바에서 팀을 선택하세요.',
        allDeletedMessage: '모든 팀이 삭제되었습니다. 계속하려면 활동을 선택하세요.'
    },

    // Import Wizard
    import: {
        selectSource: '가져오기 소스 선택',
        textInput: '텍스트 입력',
        textInputDesc: 'CSV 또는 JSON 데이터 직접 붙여넣기',
        fileUpload: '파일 업로드',
        fileUploadDesc: 'CSV 또는 JSON 파일 업로드',
        apiImport: 'API 가져오기',
        apiImportDesc: '외부 API에서 가져오기',
        dropFile: '파일을 여기에 놓거나 클릭하여 찾아보기',
        supportedFormats: '지원 형식: CSV, JSON',
        delimiter: '구분자',
        preview: '미리보기',
        foundPlayers: '{{count}}명의 선수 발견',
        noData: '가져올 데이터를 제공해 주세요',
        noPlayersFound: '선수를 찾을 수 없습니다',
        importSuccess: '{{imported}}명의 선수를 가져왔습니다',
        importSuccessWithSkipped: '{{imported}}명의 선수를 가져오고 {{skipped}}명을 건너뛰었습니다',
        importFailed: '가져오기 실패',
        back: '뒤로',
        // File Import
        csvUploadTitle: 'CSV 파일 업로드',
        jsonUploadTitle: 'JSON 파일 업로드',
        fieldDelimiter: '필드 구분자',
        delimiterHint: '필드 구분 방식 선택',
        comma: '쉼표 (,)',
        tab: '탭 (\\t)',
        semicolon: '세미콜론 (;)',
        clickToSelect: '클릭하여 파일 선택',
        orDragAndDrop: '또는 여기에 끌어다 놓기',
        expectedFormat: '예상 형식',
        csvExample: 'CSV 예시',
        jsonExample: 'JSON 예시',
        csvFormatNote: 'CSV 파일에는 "name"과 "positions" 열이 있는 헤더 행이 있어야 합니다.',
        jsonFormatNote: 'JSON 파일에는 "name"과 "positions" 필드가 있는 객체 배열이 포함되어야 합니다.',
        browseFiles: '파일 찾아보기',
        changeFile: '파일 변경',
        copied: '복사됨!',
        // Text Import
        pasteOrType: '선수 데이터 붙여넣기 또는 입력',
        playerData: '선수 데이터',
        pasteDataPlaceholder: 'CSV 또는 JSON 데이터를 여기에 붙여넣으세요...',
        examples: '예시',
        csvFormat: 'CSV 형식',
        jsonFormat: 'JSON 형식',
        namesOnly: '이름만',
        allPositionsAssigned: '모든 포지션이 지정됩니다',
        // API Import
        fetchFromUrl: 'URL에서 가져오기',
        url: 'URL',
        urlHint: 'JSON 데이터의 URL을 입력하세요',
        fetchData: '데이터 가져오기',
        fetching: '가져오는 중...',
        authentication: '인증',
        authHint: '필요한 경우 인증 방법 선택',
        authNone: '없음 (공개 URL)',
        authBearer: 'Bearer 토큰',
        authApiKey: 'API 키',
        authBasic: '기본 인증',
        authCustomHeaders: '사용자 정의 헤더',
        expectedJsonFormat: '예상 JSON 형식',
        responseExample: '응답 예시',
        notes: '참고',
        noteJsonRequired: 'URL은 JSON 데이터를 반환해야 합니다',
        noteArrayRequired: '응답은 선수 객체 배열이어야 합니다',
        noteFieldsRequired: '각 객체에는 "name"과 "positions" 필드가 있어야 합니다',
        noteCorsRequired: '서버에서 CORS가 활성화되어 있어야 합니다',
        urlRequired: 'URL을 입력해 주세요',
        invalidUrl: '잘못된 URL',
        invalidUrlDetail: '유효한 URL을 입력해 주세요 (예: https://example.com/data.json)',
        fetchingFrom: '{{url}}에서 데이터를 가져오는 중...',
        fetchSuccess: '데이터를 성공적으로 가져왔습니다!',
        fetchedItems: 'URL에서 {{count}}개 항목을 가져왔습니다.',
        fetchFailed: '데이터 가져오기 실패',
        fileReadError: '파일 읽기 오류'
    },

    // Error Messages
    errors: {
        dataIncomplete: '선수 데이터가 불완전합니다. 선수 목록을 확인해 주세요.',
        loadFailed: '다음 비교를 로드할 수 없습니다. 다시 시도해 주세요.',
        selectPosition: '최소 하나의 포지션을 선택해 주세요',
        selectActivity: '먼저 활동 유형을 선택해 주세요',
        selectPlayerPerTeam: '팀당 최소 한 명의 선수를 선택해 주세요',
        exportFailed: '내보내기 실패',
        playerNotFound: '선수를 찾을 수 없습니다',
        invalidJson: '잘못된 JSON 형식',
        noDataToImport: '가져올 데이터가 없습니다',
        unexpectedError: '예기치 않은 오류가 발생했습니다'
    },

    // Success Messages
    success: {
        winWin: '승리 기록됨',
        exportComplete: '팀이 내보내졌습니다!',
        resetComplete: '{{count}}개의 비교가 초기화되었습니다',
        playerAdded: '선수 "{{name}}"이(가) 추가되었습니다!',
        playerRemoved: '선수 "{{name}}"이(가) 제거되었습니다',
        playerUpdated: '선수 "{{name}}"이(가) 업데이트되었습니다',
        positionsUpdated: '{{name}}의 포지션이 업데이트되었습니다',
        removedPlayers: '{{count}}명의 선수가 제거되었습니다',
        dataMigrated: '데이터가 v{{version}}으로 마이그레이션되었습니다',
        teamsCreated: '팀이 생성되었습니다! 균형: {{balance}} 가중 ELO 차이'
    },

    // Info Messages
    info: {
        noComparisons: '초기화할 비교가 없습니다',
        optimizing: '팀 최적화 중... 잠시 기다려 주세요',
        reloading: '다시 로딩 중...'
    },

    // Titles
    titles: {
        status: '상태',
        dataError: '데이터 오류',
        applicationError: '애플리케이션 오류',
        reloadPage: '페이지 새로고침',
        failedToLoad: '{{name}} 로드 실패'
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
        ko: 'Korean',
        selectLanguage: '언어 선택'
    }
};
