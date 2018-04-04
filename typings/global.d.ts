// this file defines global Logline object

type LEVEL = 'debug' | 'info' | 'warn' | 'error' | 'critical';

interface descriptionAndData {
    description: string;
    data: object
}

type descriptor = [ number, LEVEL, string, string, any ]

declare module "*.json" {
    const value: any;
    export default value;
}

declare abstract class iLogger {
    abstract record(level: LEVEL, description: string, data: any): void;
    abstract parseDescriptionData(...descriptions: any[]): descriptionAndData;
    abstract debug(...descriptions: any[]): void;
    abstract info(...descriptions: any[]): void;
    abstract warn(...descriptions: any[]): void;
    abstract error(...descriptions: any[]): void;
    abstract critical(...descriptions: any[]): void;
}
