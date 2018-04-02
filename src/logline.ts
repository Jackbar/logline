import Logger from './logger';
import LoggerLocalStorage from './logger/localstorage';
import LoggerIndexedDB from './logger/indexeddb';
import LoggerWebsql from './logger/websql';
import PluginConsole from './plugin/console';
import * as util from './lib/util';
import * as event from './lib/event';

interface LoggerListContent {
    __weight?: number
};

class Logline {
    static loggers: LoggerListContent[] = [];
    static plugins: PluginDef[] = [];
    constructor(namespace: string) {
        // @ts-ignore
        return new Logline.loggers[2](namespace);
    }

    static logger(loggerDef: LoggerDef, weight: number = 0) {
        Logline.loggers.push(loggerDef);
    }

    static plugin(pluginDef: PluginDef) {
        let { name, mounts, events } = pluginDef;
        if (!name) {
            return event.fire('error', { identifier: 'Logline', message: 'plugin must have a unique name' });
        }
        if (mounts) {
            for (let api in mounts) {
                if (mounts.hasOwnProperty(api)) {
                    if (Logline[api]) {
                        event.fire('error', { identifier: 'Logline', message: `plugin ${name} is mouting an already existed api ${api}` });
                    }
                    Logline[api] = mounts[api];
                }
            }
        }
        if (events) {
            for (let eventName in events) {
                if (events.hasOwnProperty(eventName)) {
                    event.on(eventName, events[eventName], name);
                }
            }
        }
        Logline.plugins.push(pluginDef);
    }

    static on(name, handler, plugin) {
        event.on(name, handler, plugin);
    }

    static off() {
        event.off(name);
    }

    static fire(name, data) {
        event.fire(name, data);
    }
}

Logline.logger(LoggerIndexedDB);
Logline.logger(LoggerWebsql);
Logline.logger(LoggerLocalStorage);
Logline.plugin(PluginConsole);

export default Logline;
