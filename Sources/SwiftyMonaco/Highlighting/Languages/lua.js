// Monarch syntax definition for Roblox Luau + executor environment
return {
    defaultToken: '',
    tokenPostfix: '.lua',

    // Luau keywords
    keywords: [
        'and','break','do','else','elseif','end','false','for','function',
        'if','in','local','nil','not','or','repeat','return','then',
        'true','until','while','continue','export','type'
    ],

    // Built-in globals + Roblox globals
    globals: [
        '_G','shared','game','workspace','script','plugin',
        'print','warn','error','assert','pcall','xpcall','typeof','type',
        'select','ipairs','pairs','next','rawget','rawset','rawequal',
        'getfenv','setfenv','getmetatable','setmetatable','newproxy',
        'os','math','string','table','coroutine','debug','utf8',
        'task','wait','delay','spawn','tick','elapsedTime'
    ],

    // Roblox datatypes
    typeKeywords: [
        'any','boolean','string','number','thread','userdata','void',
        'Axes','BrickColor','CFrame','Color3','ColorSequence','ColorSequenceKeypoint',
        'DockWidgetPluginGuiInfo','Enum','EnumItem','Faces','Instance','NumberRange',
        'NumberSequence','NumberSequenceKeypoint','PathWaypoint','PhysicalProperties','Random',
        'Ray','Rect','Region3','Region3int16','TweenInfo','UDim','UDim2','Vector2',
        'Vector2int16','Vector3','Vector3int16','DateTime','OverlapParams','RaycastParams',
        'RaycastResult','ColorSequence','ColorSequenceKeypoint','NumberSequence','NumberSequenceKeypoint',
        'WorldPivot'
    ],

    // Roblox Services (explicit list)
    robloxServices: [
        'Players','RunService','TweenService','UserInputService','HttpService','SoundService',
        'MarketplaceService','TeleportService','PathfindingService','BadgeService','DataStoreService',
        'CollectionService','ReplicatedStorage','ServerScriptService','ServerStorage',
        'StarterGui','StarterPack','StarterPlayer','Lighting','Teams','Chat','LocalizationService',
        'ContentProvider','InsertService','NetworkClient','NetworkServer','GuiService','Debris',
        'ContextActionService','VirtualInputManager','Stats','Workspace','CoreGui','CorePackages',
        'MessagingService','PhysicsService','PolicyService','ProximityPromptService'
    ],

    // Executor environment / UNC APIs
    executorEnv: [
        'getgenv','getrenv','getsenv','getfenv','setfenv',
        'checkcaller','getcallingscript',
        'getidentity','setidentity','getthreadidentity','setthreadidentity',
        'newcclosure','islclosure','iscclosure',
        'getgc','getreg','getregistry','getconstants','getupvalues','getprotos',
        'getloadedmodules','getconnections','gethiddenproperty','sethiddenproperty',
        'hookfunction','hookmetamethod','unhookmetamethod','clonefunction','decompile',
        'fireclickdetector','firetouchinterest','firesignal','fireproximityprompt',
        'identifyexecutor','isexecutorclosure',
        // File + IO
        'writefile','readfile','appendfile','delfile','isfile','isfolder','makefolder','listfiles','listfolders',
        // HTTP + WebSocket
        'request','http_request','httprequest','syn.request','syn.websocket',
        // Crypt + Clipboard
        'crypt','setclipboard','getclipboard',
        // Console
        'rconsoleprint','rconsolewarn','rconsoleerr','rconsoleinfo','rconsoleclear',
        // Input
        'mouse1click','mouse1press','mouse1release','mouse2click','mouse2press','mouse2release','mousemoveabs','mousemoverel','mousescroll',
        // Drawing API
        'Drawing'
    ],

    // Luau operators
    operators: [
        '+','-','*','/','%','^','#',
        '==','~=','<=','>=','<','>',
        '=','..','...'
    ],

    // Symbol regex
    symbols: /[=><!~?:&|+\-*\/\^%#]+/,

    // Escape sequences
    escapes: /\\(?:[abfnrtv\\"']|z\s*|x[0-9A-Fa-f]{2}|u\{[0-9A-Fa-f]+\})/,

    // Tokenizer
    tokenizer: {
        root: [
            // Identifiers and classification
            [/[a-zA-Z_]\w*/, {
                cases: {
                    '@keywords': { token: 'keyword.$0' },
                    '@globals': { token: 'variable.predefined' },
                    '@typeKeywords': { token: 'type.identifier' },
                    '@robloxServices': { token: 'type.class' },
                    '@executorEnv': { token: 'variable.executor' },
                    '@default': 'identifier'
                }
            }],

            // Whitespace
            { include: '@whitespace' },

            // Brackets / delimiters
            [/[{}()\[\]]/, '@brackets'],
            [/@symbols/, {
                cases: {
                    '@operators': 'operator',
                    '@default': ''
                }
            }],
            [/[;,.:]/, 'delimiter'],

            // Numbers
            [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
            [/0[xX][0-9a-fA-F_]+/, 'number.hex'],
            [/\d+/, 'number'],

            // Strings
            [/"/, 'string', '@string_double'],
            [/'/, 'string', '@string_single'],
            [/\[(=*)\[/, { token: 'string.quote', bracket: '@open', next: '@string_block.$1' }],
        ],

        // String states
        string_double: [
            [/[^\\"]+/, 'string'],
            [/@escapes/, 'string.escape'],
            [/\\./, 'string.escape.invalid'],
            [/"/, 'string', '@pop']
        ],
        string_single: [
            [/[^\\']+/, 'string'],
            [/@escapes/, 'string.escape'],
            [/\\./, 'string.escape.invalid'],
            [/'/, 'string', '@pop']
        ],
        string_block: [
            [/[^\]]+/, 'string'],
            [/\]\1\]/, { token: 'string.quote', bracket: '@close', next: '@pop' }],
            [/\]/, 'string']
        ],

        // Whitespace & comments
        whitespace: [
            [/[ \t\r\n]+/, ''],
            [/--\[(=*)\[/, { token: 'comment', bracket: '@open', next: '@comment_block.$1' }],
            [/--.*$/, 'comment'],
        ],
        comment_block: [
            [/[^\]]+/, 'comment'],
            [/\]\1\]/, { token: 'comment', bracket: '@close', next: '@pop' }],
            [/\]/, 'comment']
        ],
    },
};
