import Logger from '../logger';
import * as util from "../lib/util";
import * as event from '../lib/event';


class LoggerIndexedDB extends Logger implements iLogger {
    constructor(namespace: string) {
        super(namespace);
    }

    record(level: LEVEL, description: string, data: any = ''): void {
    }

    static init(database: string = 'logline') {
        return true;
    }

    static get(from?: number, to?: number, callback?: any): descriptor[] {
        return [];
    }

    static clean() {
    }

    static support() {
        if (
            typeof indexedDB === 'undefined'
            || typeof IDBTransaction === 'undefined'
            || typeof IDBKeyRange === 'undefined'
        ) {
            return false;
        }
        try {
            // in safari, indexeddb is not available under iframe
            let req = indexedDB.open('__logline_test__');
            req.onsuccess = () => req.result.close();
            // in some device, following const variables are not defined
            // @ts-ignore
            IDBTransaction.READ_ONLY = IDBTransaction.READ_ONLY || 'readonly';
            // @ts-ignore
            IDBTransaction.READ_WRITE = IDBTransaction.READ_WRITE || 'readwrite';
            return true;
        } catch(e) {
            return false;
        }
    }
}

export default LoggerIndexedDB;
