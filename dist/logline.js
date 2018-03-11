(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Logline = factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

// throw out Errors, with global prefix 'Logline: ' ahead of err.message
function throwError(errMessage) {
    throw new Error('Logline: ' + errMessage);
}
// filter any function in a object
function filterFunction(obj) {
    var newObj = {},
        i;
    if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') {
        return obj;
    }
    for (i in obj) {
        if (obj.hasOwnProperty(i)) {
            if (typeof obj[i] !== 'function') {
                newObj[i] = filterFunction(obj[i]);
            }
        }
    }
    return newObj;
}

/**
 * Logline Interface
 * @class Interface
 */
var Logger = /** @class */function () {
    /**
     * Logline constructor
     * @constructor
     * @param {String} namespace - namespace to use
     */
    function Logger(namespace) {
        this._namespace = namespace;
    }
    /**
     * add a log record
     * @method _reocrd
     * @private
     * @parma {String} level - log level
     * @param {String} descriptor - to speed up search and improve understanding
     * @param {Mixed} [data] - additional data
     */
    Logger.prototype._record = function (level, descriptor, data) {
        throwError('method _record is not implemented.');
    };
    /**
     * add a level-info record
     * @method info
     * @param {String} descriptor - to speed up search and improve understanding
     * @param {Mixed} [data] - additional data
     */
    Logger.prototype.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._record.apply(this, ['info'].concat(args));
    };
    /**
     * add a level-warn record
     * @method warn
     * @param {String} descriptor - to speed up search and improve understanding
     * @param {Mixed} [data] - additional data
     */
    Logger.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._record.apply(this, ['warn'].concat(args));
    };
    /**
     * add a level-error record
     * @method error
     * @param {String} descriptor - to speed up search and improve understanding
     * @param {Mixed} [data] - additional data
     */
    Logger.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._record.apply(this, ['error'].concat(args));
    };
    /**
     * add a level-critical record
     * @method critical
     * @param {String} descriptor - to speed up search and improve understanding
     * @param {Mixed} [data] - additional data
     */
    Logger.prototype.critical = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._record.apply(this, ['critical'].concat(args));
    };
    /**
     * initialize protocol
     * @method init
     * @static
     * @param {String} database - database name to use
     */
    Logger.init = function (database) {};
    /**
     * transform human readable time string, such as '3d', '.3' and '1.2' into Unix timestamp
     * the default relative time is Date.now(), if no second parameter is provided
     * @method transTimeFormat
     * @static
     * @param {String} time - time string to transform
     * @param {Number} [relative] - relative time to compare, default Date.now()
     * @return {Number|NaN} timestamp transformed
     */
    Logger.transTimeFormat = function (time, relative) {
        // if falsy value or timestamp already, pass it through directly,
        if (!time || /^\d{13}$/.test(time)) {
            return +time;
        }
        // incase relative time isn't unix timestamp format,
        // neither a falsy value which will turned out to be Date.now()
        if (relative && !/^\d{13}$/.test(relative)) {
            throw new TypeError('relative time should be standard unix timestamp');
        }
        return (relative || Date.now()) - time.replace(/d$/, '') * 24 * 3600 * 1000;
    };
    /**
     * get logs in range
     * if from and end is not defined, will fetch full log
     * @method get
     * @static
     * @param {String} from - time from, unix timestamp
     * @param {String} to - time end, unix timestamp
     * @param {Function} readyFn - function to call back with logs as parameter
     */
    Logger.get = function (from, to, readyFn) {
        throwError('method get is not implemented.');
    };
    /**
     * clean logs = keep limited logs
     * @method keep
     * @static
     * @param {Number} daysToMaintain - keep logs within days
     */
    Logger.keep = function (daysToMaintain) {
        throwError('method keep is not implemented.');
    };
    /**
     * delete log database
     * @method clean
     * @static
     */
    Logger.clean = function () {
        throwError('method clean is not implemented.');
    };
    Object.defineProperty(Logger, "STATUS", {
        /**
         * protocol status map
         * @prop {Object} STATUS
         */
        get: function get() {
            return {
                INITING: 1,
                INITED: 2,
                FAILED: 4
            };
        },
        enumerable: true,
        configurable: true
    });
    return Logger;
}();

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

/**
 * Pool, for storage of async calling
 * @class Pool
 */
var Pool = /** @class */function () {
    /**
     * Pool constructor
     * @constructor
     */
    function Pool() {
        this._pool = [];
    }
    /**
     * add an procedure
     * @method push
     * @param {Function} handler - procedure handler
     * @param {Object} context - procedure context
     */
    Pool.prototype.push = function (handler, context) {
        handler.context = context;
        this._pool.push(handler);
    };
    /**
     * consume pool
     * @method consume
     */
    Pool.prototype.consume = function () {
        var handler;
        while (handler = this._pool.shift()) {
            handler.call(handler.context);
        }
    };
    return Pool;
}();

/**
 * IndexedDB protocol
 * @class IndexedDBLogger
 */
var IndexedDBLogger = /** @class */function (_super) {
    __extends(IndexedDBLogger, _super);
    /**
     * IndexedDB protocol constructor
     * @constructor
     * @param {String} namespace - namespace to use
     */
    function IndexedDBLogger() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return _super.apply(this, args) || this;
    }
    /**
     * add a log record
     * @method _reocrd
     * @private
     * @parma {String} level - log level
     * @param {String} descriptor - to speed up search and improve understanding
     * @param {Mixed} [data] - additional data
     */
    IndexedDBLogger.prototype._record = function (level, descriptor, data) {
        var _this = this;
        if (IndexedDBLogger.status !== Logger['STATUS'].INITED) {
            IndexedDBLogger._pool.push(function () {
                return _this._record(level, descriptor, data);
            });
            if (IndexedDBLogger.status !== Logger['STATUS'].INITING) {
                IndexedDBLogger.init();
            }
            return;
        }
        var transaction = IndexedDBLogger.db.transaction(['logs'], IDBTransaction.READ_WRITE || 'readwrite');
        transaction.onerror = function (event) {
            return throwError(event.target.error);
        };
        var store = transaction.objectStore('logs');
        // should not contains any function in data
        // otherwise 'DOMException: Failed to execute 'add' on 'IDBObjectStore': An object could not be cloned.' will be thrown
        var request = store.add({
            time: Date.now(),
            level: level,
            namespace: this._namespace,
            descriptor: descriptor,
            data: filterFunction(data)
        });
        request.onerror = function (event) {
            IndexedDBLogger.status = Logger['STATUS'].FAILED;
            throwError(event.target.error);
        };
    };
    /**
     * initialize protocol
     * @method init
     * @static
     * @param {String} database - database name to use
     */
    IndexedDBLogger.init = function (database) {
        if (!IndexedDBLogger.support) {
            throwError('your platform does not support indexeddb protocol.');
        }
        if (IndexedDBLogger.status) {
            return false;
        }
        IndexedDBLogger._pool = IndexedDBLogger._pool || new Pool();
        IndexedDBLogger._database = database || 'logline';
        IndexedDBLogger.status = _super['STATUS'].INITING;
        IndexedDBLogger.request = window.indexedDB.open(IndexedDBLogger._database);
        IndexedDBLogger.request.onerror = function (event) {
            return throwError('protocol indexeddb is prevented.');
        };
        IndexedDBLogger.request.onsuccess = function (event) {
            IndexedDBLogger.db = event.target.result;
            IndexedDBLogger.status = _super['STATUS'].INITED;
            IndexedDBLogger._pool.consume();
            // globally handle db request errors
            IndexedDBLogger.db.onerror = function (event) {
                return throwError(event.target.error);
            };
        };
        IndexedDBLogger.request.onupgradeneeded = function (event) {
            // init dabasebase
            var db = event.target.result,
                store = db.createObjectStore('logs', { autoIncrement: true });
            store.createIndex('namespace', 'namespace', { unique: false });
            store.createIndex('level', 'level', { unique: false });
            store.createIndex('descriptor', 'descriptor', { unique: false });
            store.createIndex('data', 'data', { unique: false });
        };
    };
    /**
     * get logs in range
     * if from and end is not defined, will fetch full log
     * @method get
     * @static
     * @param {String} [from] - time from, unix time stamp or falsy
     * @param {String} [to] - time end, unix time stamp or falsy
     * @param {Function} readyFn - function to call back with logs as parameter
     */
    IndexedDBLogger.get = function (from, to, readyFn) {
        if (IndexedDBLogger.status !== _super['STATUS'].INITED) {
            return IndexedDBLogger._pool.push(function () {
                return IndexedDBLogger.get(from, to, readyFn);
            });
        }
        from = Logger.transTimeFormat(from);
        to = Logger.transTimeFormat(to);
        var store = IndexedDBLogger._getTransactionStore(IDBTransaction.READ_ONLY);
        // IDBObjectStore.getAll is a non-standard API
        if (store.getAll) {
            var result_1,
                logs_1 = [];
            store.getAll().onsuccess = function (event) {
                result_1 = event.target.result;
                for (var i = 0; i < result_1.length; i++) {
                    if (from && result_1[i].time < from || to && result_1[i].time > to) {
                        continue;
                    }
                    logs_1.push(result_1[i]);
                }
                readyFn(logs_1);
            };
        } else {
            var request = store.openCursor(),
                logs_2 = [];
            request.onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    if (from && cursor.value.time < from || to && cursor.value.time > to) {
                        return cursor.continue();
                    }
                    logs_2.push({
                        time: cursor.value.time,
                        level: cursor.value.level,
                        namespace: cursor.value.namespace,
                        descriptor: cursor.value.descriptor,
                        data: cursor.value.data
                    });
                    cursor.continue();
                } else {
                    readyFn(logs_2);
                }
            };
        }
    };
    /**
     * clean logs = keep limited logs
     * @method keep
     * @static
     * @param {Number} daysToMaintain - keep logs within days
     */
    IndexedDBLogger.keep = function (daysToMaintain) {
        if (IndexedDBLogger.status !== _super['STATUS'].INITED) {
            return IndexedDBLogger._pool.push(function () {
                return IndexedDBLogger.keep(daysToMaintain);
            });
        }
        var store = IndexedDBLogger._getTransactionStore(IDBTransaction.READ_WRITE);
        if (!daysToMaintain) {
            var request = store.clear().onerror = function (event) {
                return throwError(event.target.error);
            };
        } else {
            var range_1 = Date.now() - (daysToMaintain || 2) * 24 * 3600 * 1000;
            var request = store.openCursor();
            request.onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor && cursor.value.time < range_1) {
                    store.delete(cursor.primaryKey);
                    cursor.continue();
                }
            };
            request.onerror = function (event) {
                return throwError('unable to locate logs earlier than ' + daysToMaintain + 'd.');
            };
        }
    };
    /**
     * delete log database
     * @method clean
     * @static
     */
    IndexedDBLogger.clean = function () {
        if (IndexedDBLogger.status !== _super['STATUS'].INITED) {
            return IndexedDBLogger._pool.push(function () {
                return IndexedDBLogger.clean();
            });
        }
        // database can be removed only after all connections are closed
        IndexedDBLogger.db.close();
        var request = window.indexedDB.deleteDatabase(IndexedDBLogger._database);
        request.onerror = function (event) {
            return throwError(event.target.error);
        };
        /* eslint no-unused-vars: "off" */
        request.onsuccess = function (event) {
            delete IndexedDBLogger.status;
            delete IndexedDBLogger.db;
        };
    };
    /**
     * get internal transaction store
     * @method _getTransactionStore
     * @private
     * @static
     * @param {String} mode - transaction mode
     * @return {Object} - internal object store
     */
    IndexedDBLogger._getTransactionStore = function (mode) {
        if (IndexedDBLogger.db) {
            var transaction = IndexedDBLogger.db.transaction(['logs'], mode || IDBTransaction.READ_WRITE);
            transaction.onerror = function (event) {
                return throwError(event.target.error);
            };
            return transaction.objectStore('logs');
        } else {
            throwError('log database is not created or connections are closed, considering init it.');
        }
    };
    Object.defineProperty(IndexedDBLogger, "support", {
        /**
         * detect support situation
         * @prop {Boolean} support
         */
        get: function get() {
            var support = !!('indexedDB' in window && 'IDBTransaction' in window && 'IDBKeyRange' in window);
            if (support) {
                //@ts-ignore
                IDBTransaction.READ_WRITE = IDBTransaction.READ_WRITE || 'readwrite';
                //@ts-ignore
                IDBTransaction.READ_ONLY = 'readonly';
            }
            return support;
        },
        enumerable: true,
        configurable: true
    });
    return IndexedDBLogger;
}(Logger);

/**
 * Localstorage protocol
 * @class LocalStorageLogger
 */
var LocalStorageLogger = /** @class */function (_super) {
    __extends(LocalStorageLogger, _super);
    /**
     * Localstorage protocol constructor
     * @constructor
     * @param {String} namespace - namespace to use
     */
    function LocalStorageLogger() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return _super.apply(this, args) || this;
    }
    /**
     * add a log record
     * @method _reocrd
     * @private
     * @parma {String} level - log level
     * @param {String} descriptor - to speed up search and improve understanding
     * @param {Mixed} [data] - additional data
     */
    LocalStorageLogger.prototype._record = function (level, descriptor, data) {
        var logs = window.localStorage.getItem(LocalStorageLogger._database) ? JSON.parse(window.localStorage.getItem(LocalStorageLogger._database)) : [];
        logs.push([Date.now(), this._namespace, level, descriptor, data]);
        try {
            window.localStorage.setItem(LocalStorageLogger._database, JSON.stringify(logs));
        } catch (e) {
            throwError('error inserting record');
        }
    };
    /**
     * initialize protocol
     * @method init
     * @static
     * @param {String} database - database name to use
     */
    LocalStorageLogger.init = function (database) {
        if (!LocalStorageLogger.support) {
            throwError('your platform does not support localstorage protocol.');
        }
        LocalStorageLogger._database = database || 'logline';
        if (!window.localStorage.getItem(LocalStorageLogger._database)) {
            window.localStorage.setItem(LocalStorageLogger._database, JSON.stringify([]));
        }
        LocalStorageLogger.status = _super['STATUS'].INITED;
    };
    /**
     * get logs in range
     * if from and end is not defined, will fetch full log
     * @method get
     * @static
     * @param {String} from - time from, unix time stamp or falsy
     * @param {String} to - time end, unix time stamp or falsy
     * @param {Function} readyFn - function to call back with logs as parameter
     */
    LocalStorageLogger.get = function (from, to, readyFn) {
        var logs = JSON.parse(window.localStorage.getItem(LocalStorageLogger._database)),
            i;
        from = Logger.transTimeFormat(from);
        to = Logger.transTimeFormat(to);
        for (i = 0; i < logs.length; i++) {
            if (from && logs[i][0] < from || to && logs[i][0] > to) {
                continue;
            }
            logs[i] = {
                time: logs[i][0],
                namespace: logs[i][1],
                level: logs[i][2],
                descriptor: logs[i][3],
                data: logs[i][4]
            };
        }
        readyFn(logs);
    };
    /**
     * clean logs = keep limited logs
     * @method keep
     * @static
     * @param {Number} daysToMaintain - keep logs within days
     */
    LocalStorageLogger.keep = function (daysToMaintain) {
        var logs = !daysToMaintain ? [] : (window.localStorage.getItem(LocalStorageLogger._database) ? JSON.parse(window.localStorage.getItem(LocalStorageLogger._database)) : []).filter(function (log) {
            return log.time >= Date.now() - (daysToMaintain || 2) * 24 * 3600 * 1000;
        });
        window.localStorage.setItem(LocalStorageLogger._database, JSON.stringify(logs));
    };
    /**
     * delete log database
     * @method clean
     * @static
     */
    LocalStorageLogger.clean = function () {
        delete LocalStorageLogger.status;
        window.localStorage.removeItem(LocalStorageLogger._database);
    };
    Object.defineProperty(LocalStorageLogger, "support", {
        /**
         * detect support situation
         * @prop {Boolean} support
         */
        get: function get() {
            return 'localStorage' in window;
        },
        enumerable: true,
        configurable: true
    });
    return LocalStorageLogger;
}(Logger);

/**
 * Websql protocol
 * @class WebsqlLogger
 */
var WebsqlLogger = /** @class */function (_super) {
    __extends(WebsqlLogger, _super);
    /**
     * Websql logline constructor
     * @constructor
     * @param {String} namespace - namespace to use
     */
    function WebsqlLogger() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return _super.apply(this, args) || this;
    }
    /**
     * add a log record
     * @method _reocrd
     * @private
     * @parma {String} level - log level
     * @param {String} descriptor - to speed up search and improve understanding
     * @param {Mixed} [data] - additional data
     */
    WebsqlLogger.prototype._record = function (level, descriptor, data) {
        var _this = this;
        if (WebsqlLogger.status !== Logger['STATUS'].INITED) {
            WebsqlLogger._pool.push(function () {
                return _this._record(level, descriptor, data);
            });
            if (WebsqlLogger.status !== Logger['STATUS'].INITING) {
                WebsqlLogger.init();
            }
            return;
        }
        try {
            WebsqlLogger._db.transaction(function (tx) {
                tx.executeSql('INSERT INTO logs (time, namespace, level, descriptor, data) VALUES(?, ?, ?, ? ,?)', [Date.now(), _this._namespace, level, descriptor, data === undefined || data === '' ? '' : JSON.stringify(data) || ''], function () {}, function (tx, e) {
                    throw e.message;
                });
            });
        } catch (e) {
            throwError('error inserting record');
        }
    };
    /**
     * initialize protocol
     * @method init
     * @static
     * @param {String} database - database name to use
     */
    WebsqlLogger.init = function (database) {
        if (!WebsqlLogger.support) {
            throwError(new Error('your platform does not support websql protocol.'));
        }
        if (WebsqlLogger.status) {
            return false;
        }
        WebsqlLogger._pool = WebsqlLogger._pool || new Pool();
        WebsqlLogger._database = database || 'logline';
        WebsqlLogger.status = _super['STATUS'].INITING;
        try {
            WebsqlLogger._db = window.openDatabase(WebsqlLogger._database, '1.0', 'cats loves logs', 4.85 * 1024 * 1024);
            WebsqlLogger._db.transaction(function (tx) {
                tx.executeSql('CREATE TABLE IF NOT EXISTS logs (time, namespace, level, descriptor, data)', [], function () {
                    WebsqlLogger.status = _super['STATUS'].INITED;
                    WebsqlLogger._pool.consume();
                }, function () {
                    WebsqlLogger.status = _super['STATUS'].FAILED;
                });
            });
        } catch (e) {
            throwError('unable to init log database.');
        }
    };
    /**
     * get logs in range
     * if from and end is not defined, will fetch full log
     * @method get
     * @static
     * @param {String} from - time from, unix time stamp or falsy
     * @param {String} to - time end, unix time stamp or falsy
     * @param {Function} readyFn - function to call back with logs as parameter
     */
    WebsqlLogger.get = function (from, to, readyFn) {
        if (WebsqlLogger.status !== _super['STATUS'].INITED) {
            return WebsqlLogger._pool.push(function () {
                return WebsqlLogger.get(from, to, readyFn);
            });
        }
        from = Logger.transTimeFormat(from);
        to = Logger.transTimeFormat(to);
        try {
            WebsqlLogger._db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM logs ORDER BY time DESC', [], function (tx, res) {
                    var logs = [],
                        line,
                        index = res.rows.length,
                        item;
                    while (--index >= 0) {
                        item = res.rows.item(index);
                        if (from && item.time < from || to && item.time > to) {
                            continue;
                        }
                        // in some devices, properties are configureable: false, writable: false
                        // we need deep copy
                        line = JSON.parse(JSON.stringify(item));
                        // incase data is an object, not a string
                        try {
                            line.data = JSON.parse(line.data);
                        } catch (e) {}
                        logs.push(line);
                    }
                    readyFn(logs);
                }, function (tx, e) {
                    throw e.message;
                });
            });
        } catch (e) {
            throwError('unable to collect logs from database.');
        }
    };
    /**
     * clean logs = keep limited logs
     * @method keep
     * @static
     * @param {Number} daysToMaintain - keep logs within days
     */
    WebsqlLogger.keep = function (daysToMaintain) {
        if (WebsqlLogger.status !== _super['STATUS'].INITED) {
            return WebsqlLogger._pool.push(function () {
                return WebsqlLogger.keep(daysToMaintain);
            });
        }
        try {
            WebsqlLogger._db.transaction(function (tx) {
                if (daysToMaintain) {
                    tx.executeSql('DELETE FROM logs WHERE time < ?', [Date.now() - (daysToMaintain || 2) * 24 * 3600 * 1000], function () {}, function (tx, e) {
                        throw e.message;
                    });
                } else {
                    tx.executeSql('DELETE FROM logs', [], function () {}, function (tx, e) {
                        throw e.message;
                    });
                }
            });
        } catch (e) {
            throwError('unable to clean logs from database.');
        }
    };
    /**
     * delete log database
     * @method clean
     * @static
     */
    WebsqlLogger.clean = function () {
        if (WebsqlLogger.status !== _super['STATUS'].INITED) {
            WebsqlLogger._pool.push(function () {
                return WebsqlLogger.clean();
            });
            return;
        }
        try {
            WebsqlLogger._db.transaction(function (tx) {
                tx.executeSql('DROP TABLE logs', [], function () {
                    delete WebsqlLogger.status;
                }, function (tx, e) {
                    throw e.message;
                });
            });
        } catch (e) {
            throwError('unable to clean log database.');
        }
    };
    Object.defineProperty(WebsqlLogger, "support", {
        /**
         * detect support situation
         * @prop {Boolean} support
         */
        get: function get() {
            return 'openDatabase' in window;
        },
        enumerable: true,
        configurable: true
    });
    return WebsqlLogger;
}(Logger);

var Logline = /** @class */function () {
    /**
     * Logline constructor
     * @constructor
     * @param {String} namespace - namespace to use
     * @return {Object Protocol Instance}
     */
    function Logline(namespace) {
        if (!(this instanceof Logline)) {
            return new Logline(namespace);
        }
        Logline._checkProtocol();
        return new Logline._protocol(namespace);
    }
    /**
     * choose a protocol to initialize
     * @method _initProtocol
     * @private
     * @static
     * @param {Object Protocol Class} protocol - protocol to use, must under Logline.PROTOCOL
     * @return {Object} Logline
     */
    Logline._initProtocol = function (protocol) {
        Logline._protocol = protocol;
        Logline._protocol.init(Logline._database || 'logline');
    };
    /**
     * check protocol
     * if no protocol is chosen, will try to choose an available one automatically
     * if none of the protocols is available, an error will be thrown
     * @method _checkProtocol
     * @private
     * @static
     */
    Logline._checkProtocol = function () {
        if (!Logline._protocol) {
            var protocols = Object.keys(Logline.PROTOCOL),
                protocol = void 0;
            while (protocol = Logline.PROTOCOL[protocols.shift()]) {
                if (protocol.support) {
                    Logline._initProtocol(protocol);
                    return;
                }
            }
            throw new Error(protocols.join(', ').toLowerCase() + ' protocols are not supported on this platform');
        }
    };
    /**
     * get logs in range
     * if from and end is not defined, will fetch full log
     * @method get
     * @static
     * @param {String} [from] - time from
     * @param {String} [to] - time end
     * @param {Function} readyFn - function to call back with logs as parameter
     */
    Logline.get = function (from, to, readyFn) {
        Logline._checkProtocol();
        switch (arguments.length) {
            case 1:
                readyFn = from;
                from = undefined;
                break;
            case 2:
                readyFn = to;
                to = undefined;
                break;
            case 3:
            default:
                break;
        }
        Logline._protocol.get(from, to, readyFn);
    };
    /**
     * read all logs
     * @method all
     * @static
     * @param {Function} readyFn - function to call back with logs as parameter
     */
    Logline.all = function (readyFn) {
        Logline.get(readyFn);
    };
    /**
     * clean up logs = keep limited logs
     * @method keep
     * @static
     * @param {String} daysToMaintain - specialfy days to keep, support human readable format such as '3d', '.3'
     * @return {Object} Logline
     */
    Logline.keep = function (daysToMaintain) {
        Logline._checkProtocol();
        Logline._protocol.keep(daysToMaintain);
        return this;
    };
    /**
     * delete log database
     * @method clean
     * @static
     * @return {Object} Logline
     */
    Logline.clean = function () {
        Logline._checkProtocol();
        Logline._protocol.clean();
        return this;
    };
    /**
     * choose a protocol
     * @method using
     * @static
     * @param {Object Protocol Class} protocol - wanted protocol, should be on of Logline.PROTOCOL
     * @param {String} [database] - custome database name
     * @return {Object} Logline
     */
    Logline.using = function (protocol, database) {
        // protocol unavailable is not allowed
        if (-1 === [IndexedDBLogger, LocalStorageLogger, WebsqlLogger].indexOf(protocol)) {
            throwError('specialfied protocol ' + (protocol ? protocol + ' ' : '') + 'is not available');
        }
        // once protocol is selected, it shall not be changed during runtime
        if (Logline._protocol) {
            return this;
        }
        Logline.database(database || Logline._database);
        Logline._initProtocol(protocol);
        return this;
    };
    /**
     * specialfy a custome database name, in case of any conflicts
     * @methd database
     * @static
     * @param {String} name - target database name
     */
    Logline.database = function (name) {
        Logline._database = name;
    };
    return Logline;
}();
// export protocols for modification and mounting
Logline.PROTOCOL = {
    INDEXEDDB: IndexedDBLogger,
    LOCALSTORAGE: LocalStorageLogger,
    WEBSQL: WebsqlLogger
};
// export protocol interface for user custom implements
Logline.INTERFACE = Object.freeze(Logger);

return Logline;

})));
