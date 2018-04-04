// this file defines storage interface

/// <reference path="./global.d.ts"/>

interface LogContent {
    timestamp: Date;
    namespace: string;
    level: LEVEL;
    description: string;
    data: any
}

type LogDataSet = LogContent[];

interface LoggerDef {
}
