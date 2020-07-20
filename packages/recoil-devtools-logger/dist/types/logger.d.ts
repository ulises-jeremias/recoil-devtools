import { LogLevel } from './core';
import defaults from './defaults';
export interface Options {
    level?: LogLevel;
    duration?: boolean;
    timestamp?: boolean;
    colors?: object;
    logger?: object;
    logErrors?: boolean | Function;
    collapsed?: Function;
    predicate?: Function;
    diff?: boolean;
    diffPredicate?: Function;
    stateTransformer?: Function;
    actionTransformer?: Function;
    errorTransformer?: Function;
}
/**
 * Creates logger with following options
 *
 * @namespace
 * @param {object} options - options for logger
 * @param {LogLevel} options.level - console[level]
 * @param {boolean} options.duration - print duration of each action?
 * @param {boolean} options.timestamp - print timestamp with each action?
 * @param {object} options.colors - custom colors
 * @param {object} options.logger - implementation of the `console` API
 * @param {Function} options.logErrors - should errors in action execution be caught, logged, and re-thrown?
 * @param {Function} options.collapsed - is group collapsed?
 * @param {Function} options.predicate - condition which resolves logger behavior
 * @param {Function} options.stateTransformer - transform state before print
 * @param {Function} options.actionTransformer - transform action before print
 * @param {Function} options.errorTransformer - transform error before print
 *
 * @returns {Function} logger
 */
declare const createLogger: (options?: Options) => (next: Function) => ({ prevState, nextState, action, }: {
    prevState: any;
    nextState: any;
    action?: any;
}) => any;
declare const defaultLogger: (next: Function) => ({ prevState, nextState, action, }: {
    prevState: any;
    nextState: any;
    action?: any;
}) => any;
export { defaults, createLogger, defaultLogger as logger };
export default defaultLogger;
