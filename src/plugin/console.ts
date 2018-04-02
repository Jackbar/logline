const LEVEL_CONSOLE_MAP = {
    INFO: 'log',
    WARN: 'warn',
    ERROR: 'error',
    CRITICAL: 'error'
};

export default {
    name: 'console',
    init() {
        return typeof console !== 'undefined';
    },
    events: {
        beforeRecord(data) {
            console[LEVEL_CONSOLE_MAP[data.level.toUpperCase()] || LEVEL_CONSOLE_MAP.INFO](`${data.namespace} ${data.level.toUpperCase()} ${data.description}`, data.data);
        },
        error(error) {
            console[LEVEL_CONSOLE_MAP.ERROR](`${error.message} ERROR ${error.description}`);
        }
    }
};
