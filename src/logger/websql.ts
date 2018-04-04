import Logger from '../logger';
import Pool from '../lib/pool';
import * as util from "../lib/util";
import * as event from '../lib/event';


class LoggerWebSQL extends Logger {
    static database: string = 'logline';
    static db: any;
    static pool = new Pool();
    static status: number = Logger.STATUS.INITIAL;
    constructor(namespace: string) {
        super(namespace);
    }

    record(level: LEVEL, description: string, data: any = ''): void {
    }

    static init(database: string = 'logline') {
        return new Promise((resolve, reject) => {
            try {
                LoggerWebSQL.db = window.openDatabase(LoggerWebSQL.database, '1.0', 'logline database', 4.85 * 1024 * 1024);
                LoggerWebSQL.db.transaction(tx => {
                    tx.executeSql(
                        'CREATE TABLE IF NOT EXISTS logs (time, namespace, level, descriptor, data)', [],
                        () => {
                            LoggerWebSQL.status = Logger.STATUS.INITED;
                            Promise.resolve();
                        },
                        () => {
                            LoggerWebSQL.status = Logger.STATUS.FAILED;
                            Promise.reject(false);
                        }
                    );
                });
            } catch (e) {
                event.fire('error', { identifier: 'websql', message: e.message });
                Promise.reject(false);
            }
        });
    }

    static get(from?: number, to?: number, callback?: any): descriptor[] {
        return [];
    }

    static support() {
        if (
            typeof window.openDatabase === 'undefined'
        ) {
            return false;
        }
        try {
            // iOS8 expose WebSQL interfaces, but actually does not available
            window.openDatabase('__logline_test__', '1.0', 'logline websql support detect', 0.1 * 1024 * 1024);
            return true;
        } catch(e) {
            return false;
        }
    }
}

export default LoggerWebSQL;
