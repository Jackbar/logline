import * as util from './lib/util';

class Logger implements iLogger {
    constructor(protected namespace: string) {
    }

    parseDescriptionData(...descriptions: any[]) {
        var description = '', i = 0, data;
        for (; i < descriptions.length - 2; i++) {
            switch (Object.prototype.toString.call(descriptions[i])) {
                default:
                    description += descriptions[i];
                    break;
            }
        }
        if (typeof descriptions[descriptions.length - 1] === 'object') {
            data = descriptions[descriptions.length - 1];
        } else {
            description += descriptions[descriptions.length  - 1];
        }
        return { description, data };
    }

    record(level: LEVEL, description: string, data: any = '') {
    }
    debug(...descriptions) {
        let result = this.parseDescriptionData(...descriptions);
        return this.record('debug', result.description, result.data);
    }
    info(...descriptions) {
        let result = this.parseDescriptionData(...descriptions);
        return this.record('info', result.description, result.data);
    }
    warn(...descriptions) {
        let result = this.parseDescriptionData(...descriptions);
        return this.record('warn', result.description, result.data);
    }
    error(...descriptions) {
        let result = this.parseDescriptionData(...descriptions);
        return this.record('error', result.description, result.data);
    }
    critical(...descriptions) {
        let result = this.parseDescriptionData(...descriptions);
        return this.record('critical', result.description, result.data);
    }

    static STATUS = {
        INITIAL: 0,
        INITING: 1,
        INITED: 2,
        FAILED: 4
    }
}

export default Logger;
