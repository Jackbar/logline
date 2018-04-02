import Logger from '../logger';
import * as event from '../lib/event';

const LOGGER_NAME = 'localstorage';
const MAX_CACHE_SIZE = 20;
const SETS_INTERVAL = 12 * 60 * 60 * 1000;
const SETS_PREFIX = '_db_';
const SETS_WRITE_TIMELIMIT = 3;
const LOCALSTORAGE_API = [
    'setItem',
    'getItem',
    'removeItem',
    'key',
    'length',
    'clear'
];

// write caches to database
const write = () => {
    let cache = LocalstorageLogger.cacheQueue,
        sets = {};
    for (let log of cache) {
        let data = {
            timestamp: log[0],
            level: log[1],
            namespace: log[2],
            description: log[3],
            data: log[4]
        };
        event.fire('beforeRecord', data);
        // allow event handler to modify the data
        log[0] = data.timestamp;
        log[1] = data.level;
        log[2] = data.namespace;
        log[3] = data.description;
        log[4] = data.data;
    }
    for (let log of cache) {
        let setName = getSetName(log[0]);
        sets[setName] = sets[setName] || [];
        sets[setName].push(log);
    }
    for (let setName in sets) {
        if (sets.hasOwnProperty(setName)) {
            let setsOld = getSet(setName);
            writeSets(setName, setsOld.concat(sets[setName]));
        }
    }
    LocalstorageLogger.cacheQueue = [];
};

const writeSets = (setName: string, logs: LogContent[], tries: number = 0) => {
    try {
        if (tries > SETS_WRITE_TIMELIMIT - 1) {
            return event.fire('error', {
                identifier: LOGGER_NAME,
                mesage: 'writing logline has tried too much times'
            });
        }
        localStorage.setItem(setName, JSON.stringify(logs));
    } catch (e) {
        shitOldRecord();
        writeSets(setName, logs, tries++);
    }
};

// decide which set to write to or read from
const getSetName = (timestamp?: number) => {
    let time = timestamp || Date.now();
    let sets = Math.floor(time / SETS_INTERVAL);
    return LocalstorageLogger.database + SETS_PREFIX + sets;
};

const getSet = (setName: string): LogContent[] => {
    return JSON.parse(localStorage.getItem(setName)) || [];
};

// auto remove old log sets when localStorage is full
const shitOldRecord = () => {
    let setKeys = [];
    for (let key in localStorage) {
        if (
            localStorage.hasOwnProperty(key) &&
            -1 < key.indexOf(LocalstorageLogger.database + SETS_PREFIX)
        ) {
            if (setKeys.length === 0) {
                setKeys[0] = key;
            } else if (key < setKeys[0]) {
                // always put older sets at index 0
                setKeys.unshift(key);
            } else {
                setKeys.push(key);
            }
        }
        localStorage.removeItem(setKeys[0]);
    }
};

class LocalstorageLogger extends Logger {
    static database: string = 'logline';
    static status: number = Logger.STATUS.INITIAL;
    static cacheQueue: descriptor[] = [];
    static cacheWriteTimer: number;
    static lastRecordTimestamp: number = 0;
    constructor(namespace: string) {
        super(namespace);
    }

    record(level: LEVEL, description: string, data: any = ''): void {
        try {
            let timestamp = Date.now();
            // in case timestamp duplicated when writing logs too much frequently
            if (LocalstorageLogger.lastRecordTimestamp === timestamp) {
                setTimeout(() => this.record(level, description, data));
                return;
            }
            let caches = LocalstorageLogger.cacheQueue;
            clearTimeout(LocalstorageLogger.cacheWriteTimer);
            caches.push([timestamp, level, this.namespace, description, data]);
            LocalstorageLogger.lastRecordTimestamp = timestamp;
            // if cache is full, write to databse and clean it up again
            if (caches.length >= MAX_CACHE_SIZE) {
                write();
            } else {
                // write cache to database periodically
                LocalstorageLogger.cacheWriteTimer = setTimeout(() => write(), 200);
            }
        } catch (e) {
            return event.fire('error', {
                identifier: LOGGER_NAME,
                mesage: e.mesage
            });
        }
    }

    static init(database: string = 'logline') {
        LocalstorageLogger.database = database;
        // ensure that cached logs should been written
        window.addEventListener('beforeunload', () => write());
        LocalstorageLogger.status = Logger.STATUS.INITED;
    }

    static get(from?: number, to?: number, callback?: any): descriptor[] {
        return (
            JSON.parse(localStorage.getItem(LocalstorageLogger.database)) || []
        );
    }

    static clean() {
        localStorage.removeItem(LocalstorageLogger.database);
    }

    static support() {
        if (typeof localStorage === 'undefined') {
            return false;
        }
        try {
            localStorage.setItem('__logline_test__', '1');
            if (localStorage.getItem('__logline_test_') !== '1') {
                return false;
            }
            localStorage.removeItem('__logline_test__');
            return true;
        } catch (e) {
            return false;
        }
    }
}

export default LocalstorageLogger;
