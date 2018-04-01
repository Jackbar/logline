import Logger from '../logger';
import * as util from "../lib/util";
import * as event from '../lib/event';

const MAX_CACHE_SIZE = 20;
// TODO: big json take times to parse/stringify, consider implements sets
const SETS_INTERVAL = 60 * 60 * 1000;


class LocalstorageLogger extends Logger implements iLogger {
    static database: string = 'logline';
    static status: number = Logger.STATUS.INITIAL;
    static cacheQueue: descriptor[] = [];
    static cacheLock: number;
    constructor(namespace: string) {
        super(namespace);
    }

    record(level: LEVEL, description: string, data: any = ''): void {
        let caches = LocalstorageLogger.cacheQueue;
        clearTimeout(LocalstorageLogger.cacheLock);
        caches.push([ level, this.namespace, description, data ]);
        if (caches.length >= MAX_CACHE_SIZE) {
            LocalstorageLogger.write();
        } else {
            LocalstorageLogger.cacheLock = setTimeout(() => LocalstorageLogger.write(), 200);
        }
    }

    static init(database: string = 'logline') {
        LocalstorageLogger.database = database;
        // ensure that cached logs should been written
        window.addEventListener('beforeunload', () => LocalstorageLogger.write());
        LocalstorageLogger.status = Logger.STATUS.INITED;
    }

    static write() {
        let logs = LocalstorageLogger.get();
        for (let log of LocalstorageLogger.cacheQueue) {
            let data = { level: log[0], namespace: log[1], description: log[2], data: log[3] };
            // TODO: 没有考虑event.fire返回的格式是否正确
            event.fire('beforeRecord', data);
            log[0] = data.level;
            log[1] = data.namespace;
            log[2] = data.description;
            log[3] = data.data;
        }
        logs = logs.concat(LocalstorageLogger.cacheQueue);
        localStorage.setItem(LocalstorageLogger.database, JSON.stringify(logs));
        LocalstorageLogger.cacheQueue = [];
    }

    static get(from?: number, to?: number, callback?: any): descriptor[] {
        return JSON.parse(localStorage.getItem(LocalstorageLogger.database)) || [];
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
