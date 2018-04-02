
const NAME = 'logline';
const LEVEL_CONSOLE_MAP = {
    DEBUG: 'warn',
    INFO: 'log',
    WARN: 'warn',
    ERROR: 'error',
    CRITICAL: 'error'
};

let hasConsole = false;

export default {
    name: 'console',
    init() {
        return (hasConsole = typeof console !== 'undefined');
    },
    events: {
        beforeRecord(data) {
            hasConsole && console[LEVEL_CONSOLE_MAP[data.level.toUpperCase()] || LEVEL_CONSOLE_MAP.INFO](`${data.namespace} ${data.level.toUpperCase()} ${data.description}`, data.data);
        },
        error(error) {
            hasConsole && console[LEVEL_CONSOLE_MAP.ERROR](`${error.identifier} ERROR ${error.message}`);
        },
        debug(data) {
            hasConsole && console[LEVEL_CONSOLE_MAP.DEBUG](`${NAME} DEBUG ${data}`);
        }
    }
};
