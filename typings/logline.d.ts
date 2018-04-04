import Logger from "../src/logger";

// Type definitions for logline
// Project: https://github.com/latel/logline
// Definitions by: silentkk <https://github.com/latel>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/// <reference path="./logger.d.ts"/>
/// <reference path="./plugin.d.ts"/>

declare module Logline {
    export interface QueryCallback {
        (err: Error, data?: LogContent[]): void;
    }

    export interface DeleteCallback {
        (err: Error): void;
    }

    export type ConfigOptions = {
        database?: string;
        logger?: LoggerDef;
        maxDays?: number;
        maxRecords?: number;
    };

    export function config(options: ConfigOptions): void;

    export function database(database: string): void;

    export function using(logger: LoggerDef, database?: string): void;

    export function get(from?: number, to?: number, callback?: QueryCallback): PromiseConstructor;

    export function all(callback?: QueryCallback): PromiseConstructor;

    export function keep(daysToKeep?: number): PromiseConstructor;

    export function clean(): PromiseConstructor;

    export namespace q {
        function all(callback: QueryCallback): PromiseConstructor;
        function before(time: Date, callback: QueryCallback): PromiseConstructor;
        function last(callback: QueryCallback): PromiseConstructor;
        function from(startPoint: Date, callback: QueryCallback): PromiseConstructor;
        function from(startPoint: Date, endPoint: Date, callback: QueryCallback): PromiseConstructor;
    }

    export namespace d {
        function database(callback: DeleteCallback): PromiseConstructor;
        function all(callback: DeleteCallback): PromiseConstructor;
        function before(time: Date, callback: DeleteCallback): PromiseConstructor;
    }
}
