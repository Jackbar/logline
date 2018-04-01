import Logger from '../logger';
import * as util from "../lib/util";
import * as event from '../lib/event';


class LoggerWebSQL extends Logger implements iLogger {
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
