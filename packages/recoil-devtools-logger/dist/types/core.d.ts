export interface Options {
    titleFormatter?: any;
    timestamp: any;
    duration: any;
    level: LogLevel;
    colors: any;
    logger: any;
    logErrors: boolean | Function;
    collapsed: boolean | Function;
    predicate: boolean | Function;
    diffPredicate: Function;
    stateTransformer: Function;
    actionTransformer: Function;
    errorTransformer: Function;
    diff: object;
}
export interface LogEntry {
    started?: number;
    startedTime?: Date;
    prevState?: any;
    action?: any;
    error?: any;
    took?: number;
    nextState?: any;
}
declare type LogLevelFunction = string | ((...data: any[]) => string);
interface LogLevelObject {
    [key: string]: LogLevelFunction;
}
export declare type LogLevel = LogLevelFunction | LogLevelObject;
declare const printBuffer: (buffer: any[], options: Options) => void;
export default printBuffer;
