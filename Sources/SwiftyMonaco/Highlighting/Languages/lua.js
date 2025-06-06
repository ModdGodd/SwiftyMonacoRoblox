// This is a comprehensive Monarch language definition for Roblox Luau,
// structured for clarity and maintainability.

export const robloxLuauLang = {
    // Set defaultToken to invalid to see what you do not tokenize yet.
    // Otherwise, set to '' to ignore untokenized text.
    defaultToken: 'invalid',
    tokenPostfix: '.lua',

    // Keywords of the Luau language
    keywords: [
        'and', 'break', 'do', 'else', 'elseif', 'end', 'false', 'for', 'function',
        'if', 'in', 'local', 'nil', 'not', 'or', 'repeat', 'return', 'then',
        'true', 'until', 'while', 'continue', 'export', 'type'
    ],

    // Built-in globals and common Roblox-specific globals
    globals: [
        'game', 'workspace', 'script', 'plugin', '_G', 'shared', 'print', 'warn', 'error',
        'pcall', 'xpcall', 'typeof', 'assert', 'select', 'ipairs', 'pairs', 'next',
        'tonumber', 'tostring', 'rawequal', 'rawget', 'rawset', 'getfenv', 'setfenv',
        'getmetatable', 'setmetatable', 'newproxy', 'os', 'math', 'string', 'table',
        'coroutine', 'debug', 'utf8', 'task', 'wait', 'delay', 'spawn'
    ],

    // Common Roblox data types and classes
    typeKeywords: [
        // Primitives
        'any', 'boolean', 'string', 'number', 'thread', 'userdata', 'void',
        // Roblox DataTypes
        'Axes', 'BrickColor', 'CFrame', 'Color3', 'ColorSequence', 'ColorSequenceKeypoint',
        'DockWidgetPluginGuiInfo', 'Enum', 'EnumItem', 'Faces', 'Instance', 'NumberRange',
        'NumberSequence', 'NumberSequenceKeypoint', 'PathWaypoint', 'PhysicalProperties', 'Random',
        'Ray', 'Rect', 'Region3', 'Region3int16', 'TweenInfo', 'UDim', 'UDim2', 'Vector2',
        'Vector2int16', 'Vector3', 'Vector3int16',
        // Common Instances
        'Part', 'Model', 'Script', 'LocalScript', 'ModuleScript', 'RemoteEvent', 'RemoteFunction',
        'BindableEvent', 'BindableFunction', 'Player', 'Character', 'Humanoid', 'Accessory',
        'Animation', 'Animator', 'Sound', 'Camera', 'SurfaceGui', 'BillboardGui', 'ScreenGui',
        'Frame', 'TextLabel', 'TextButton', 'TextBox', 'ImageLabel', 'ImageButton', 'ProximityPrompt',
        'Configuration', 'ValueBase', 'BoolValue', 'StringValue', 'NumberValue', 'ObjectValue',
        'CFrameValue', 'Vector3Value', 'RayValue', 'Color3Value', 'BrickColorValue'
    ],

    // Operators
    operators: [
        '+', '-', '*', '/', '%', '^', '#',
        '==', '~=', '<=', '>=', '<', '>',
        '=', '..', '...'
    ],

    // Regular expression for symbols
    symbols: /[=><!~?:&|+\-*\/\^%#]+/,

    // C style string escapes
    escapes: /\\(?:[abfnrtv\\"']|z\s*|x[0-9A-Fa-f]{2}|u\{[0-9A-Fa-f]+\})/,

    // The main tokenizer
    tokenizer: {
        root: [
            // Identifiers and keywords
            [/[a-zA-Z_]\w*/, {
                cases: {
                    '@keywords': { token: 'keyword.$0' },
                    '@globals': { token: 'variable.predefined' },
                    '@typeKeywords': { token: 'type.identifier' },
                    '@default': 'identifier'
                }
            }],

            // Whitespace
            { include: '@whitespace' },

            // Delimiters and operators
            [/[{}()\[\]]/, '@brackets'],
            [/[<>](?!@symbols)/, '@brackets'],
            [/@symbols/, {
                cases: {
                    '@operators': 'operator',
                    '@default': ''
                }
            }],

            // Numbers
            [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
            [/0[xX][0-9a-fA-F_]+/, 'number.hex'],
            [/\d+/, 'number'],

            // Delimiters
            [/[;,.:]/, 'delimiter'],

            // Strings
            [/"/, 'string', '@string_double'],
            [/'/, 'string', '@string_single'],
            [/\[(=*)\[/, { token: 'string.quote', bracket: '@open', next: '@string_block.$1' }],
        ],

        // Rules for different string types
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

        // Whitespace and comments
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
