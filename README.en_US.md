Logline
=======

[中文](https://github.com/latel/logline/blob/master/README.md) | English

[![Build Status][travis-image]][travis-url]

Logline is a persistent HTML5 log agent with simple but powerful chaining CRUD API.

Logline have multiple store implements, and come with a `localstorage store` built-in as fallback when other stores are unavailable.

Features
-------

+ no extra dependencies
+ persist storage on the client using HTML5 webstorage
+ multiple stores, such as indexDB, websql, localStorage and wechat mini app
+ powerful CRUD API

Quick to get started
-------------------

To use logline, just drop a single Javascript file into your page:

```html
<script src="logline/dist/logline.js"></script>
<script>new Logline('app').info('hello world');</script>
```

Download the [latest logline from GitHub](https://github.com/latel/logline/releases/latest), or install with npm:

```shell
npm install logline --save-dev
```

or bower

```shell
bower install logline
```

Configuration
-------------

you can use `config()` method to configure Logline's default settings, such as store and database name.

```javascript
Logline.config({
    store: Logline.STORE.WEBSQL, // Force WebSQL, same as using setStore() 
    database: 'logline', // database name to use, same as using setStore() or database()
    level: 'info' // now only logs have higher level than `info` will be recorded
});
```

use `setStore()` to select certain store implement to use.

```javascript
Logline.setStore(Logline.STORE.WEBSQL);
```

use `database()` to provide a database name.

```javascript
Logline.database('_new_logline_database__');
```

Write Logs
----------

### Instances

Before you make any log, you must create a Logline instance, Logline can produces as many as instances as possible, just like there is many modules in your code base.

It's a better practise to create instance for every module with similar module name.

```javascript
let appLogger = new Logline('app'); // app is the namespace
let sdkLogger = new Logline('sdk'); // sdk is the namespace
```

There are several writing API on every instance, referring the log level you wanted: 

`debug` < `info` < `warn` < `error` < `critical`.

```javascript
appLogger.debug('app is now starting');
sdkLogger.info('calling api');
sdkLogger.warn('components Layer has un-normal border');
sdkLogger.error('api `getNetworkd` response with invalid data');
appLogger.critical('system is shutting down due to invalid sdk call');
```


Query Logs
----------

Logline implements several API to help you remove logs under `Logline.q` namespace.

### Logline.q.last(num: number = 100): Promise

query newest number of logs.

```javascript
// query logs using a Date object
Logline.q.last(200, res => console.table(res));
```

### Logline.q.before(time: Date|number, callback?: callback): Promise

query logs that before a given timestamp.

```javascript
// query logs using a Date object
Logline.q.before(new Date('2018-01-30T14:07:25'), res => console.table(res));

// query logs using a timestamp
Logline.q.before(1522390247400, res => console.table(res));

// query logs using a relative time base on current time
Logline.q.before(- 24 * 60 * 60 * 1000, res => console.table(res));

// Logline also support Promise gramma
Logline.q.before(- 24 * 60 * 60 * 1000).then(res => console.table(res));

// thus Logline.q API can easily react with yield
let logs = yield Logline.q.before(- 24 * 60 * 60 * 1000);

// of course async/await is the same
async (() => let logs = await Logline.q.before(- 24 * 60 * 60 * 1000););
```

### Logline.q.after(time: Date|number, callback?: function): Promise

query logs that after a given timestamp.

```javascript
// query logs using a Date object
Logline.q.after(new Date('2018-01-30T14:07:25'), res => console.table(res));

// query logs using a timestamp
Logline.q.after(1522390247400, res => console.table(res));

// query logs using a relative time base on current time
Logline.q.after(- 24 * 60 * 60 * 1000, res => console.table(res));
```

### Logline.q.within(start: Date|number, end: Date|number, callback?: function): Promise

query logs between given time range.

```javascript
Logline.q.within(-60 * 60 * 1000, -30 * 60 * 1000, res => console.table(res));
Logline.q.within(new Date('20180329T230100'), -30 * 60 * 1000).then(res => console.table(res));
```

Logline also provides chaining API with can with above API:

### filter(method: string|RegExp|object|function): Promise

### filter logs with description property

provide a string or RegExp as the only parameter.

```javascript
Logline.last().filter('userinfo').then(res => console.table(res));
Logline.last().filter(/userinfo|id/i).then(res => console.table(res));
```

provide a object descriptor to make detailed filtering.

```javascript
Logline.last().filter({
    module: /app.*/,
    description: 'userinfo', 
    level: 'info'
}).then(res => console.table(res));
```

provide a function to make more powerful filtering.

```javascript
Logline.last().filter(log => {
    return /app.*/.test(log.namespace)
    	&& -1 < log.description.indexOf('userinfo')
    	&& log.level === 'info';
}).then(res => console.table(res));
```

Delete Logs
-----------

### Using with *Logline.q*

you can use `Logline.q` related API to query and filter target logs, and then use `remove()` to remove them wisely.

```javascript
Logline.q.after(-24*60*60*1000).remove();
Logline.q.last(100).filter(/sdk/).remove();
```

Logline also implements several API to help you remove logs under `Logline.d` namespace.

### Logline.d.last(num: number = 100): Promise

query logs that before a given timestamp, similar to `Logline.q.last`

### Logline.d.before(time: Date|number): Promise

query logs that before a given timestamp, similar to `Logline.q.before`

### Logline.d.after(time: Date|number): Promise

query logs that before a given timestamp, similar to `Logline.q.after`

### Logline.d.within(startTime: Date|number, endTime: Date|number): Promise

query logs that before a given timestamp, similar to `Logline.q.within`

Events
------

Logline implements pub/sub model, you can use `on()` method to watch particular events.

```javascript
Logline.on('beforeRecord', data => {
    // you can modify the properties in data which will to be recorded
    data.namespace = `app:${data.namespace}`;
});
```

All watchable events are listed below:

name | data example
---- | ---------------
beforeRecord | { namespace: 'app', level: 'debug', descriptions: '', data: '' }
beforeDelete | number[], timestamp arrays indicates logs to delete.
error |  { store: 'localstorage', message: 'a text description about this error' }
databaseClosing | *storage specialfied*
databaseClosed | *storage specialfied*
databaseOpening | *storage specialfied*
databaseOpened | *storage specialfied*
queryStart | *storage specialfied*
queryEnd | LogContent[]


Custom database name
-------------------
Because indexeddb, websql and localstorage respect same domain policy, the default database name `logline` may have already been taken by other utilities. In this situation you can specialfy a custom database name as follows:

``` javascript
// special a second parameter when calling `setStore` API
Logline.setStore(Logline.PROTOCOL.WEBSQL, 'new_database_name');

// call `database` API
Logline.database('new_database_name');
```

FAQ
---

### How to upload logs
we hope Logline can focus on log recording and mupulations, thus you can use `Logline.q` API to query and filter logs you wanted and upload in your own manner.

There is a plugin which may help you [logline-plugin-upload](https://github.com/logline-plugins/upload).


[travis-image]: https://api.travis-ci.org/latel/logline.svg
[travis-url]: https://travis-ci.org/latel/logline
