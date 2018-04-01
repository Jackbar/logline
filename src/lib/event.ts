interface eventHandler {
    __plugin: string;
}

let eventsMap = { __global__: [] };

/* register a event handler */
export function on(name: string, handler, plugin?: string) {
    handler.__plugin = plugin;
    eventsMap[name] = eventsMap[name] || [];
    eventsMap[name].push(handler);
}

/* remove event handlers by name space or pluginName */
export function off(name?: string, plugin?: string) {
    if (name) {
        delete eventsMap[name];
    }
    if (plugin) {
        for (let i in eventsMap) {
            if (eventsMap.hasOwnProperty(i)) {
                let handlersClean = [];
                for (let handler of eventsMap[i]) {
                    if (handler.__plugin !== plugin) {
                        handlersClean.push(handler);
                    }
                }
                eventsMap[i]
            }
        }
    }
}

/* fire event handlers*/
export function fire(name: string, data?: any) {
    let globalHandlers = eventsMap.__global__;
    let handlers = eventsMap[name] || [];
    for (let handler of handlers) {
        handler(data);
    }
}
