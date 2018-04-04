// this file defines plugin interface

interface MountPoint {

}

type ErrorContent = {
    identifier: string;
    description: string;
}

interface PluginDef {
    // a unique plugin name
    name: string;
    // method to initilaze the plugin, resolve true if everything is ok
    init(): any;
    // mount method under global Logline namespace
    mounts?: MountPoint,
    events?: {
        // get fired whenever any event happend
        __global__?(name: string, data?: any),
        // get fired before any new log record is written, can be used to modifiy log content
        // record will not be written if beforeRecord hook returns false
        beforeRecord?(data: LogContent): boolean|void;
        // get fired before any log record is deleted
        // record will not be written if beforeDelete hook return false
        beforeDelete?(data: any): boolean|void;
        // get fired when any error happend
        error?(errorContent: ErrorContent)
        // get fired whenever a debug event is triggered
        debug?(data?: any);
    }
}
