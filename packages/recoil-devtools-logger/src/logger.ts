import printBuffer, { LogEntry, LogLevel } from './core';
import { timer } from './util/helpers';
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
 * @param {Options} options - options for logger
 * @param {LogLevel} options.level - console[level]
 * @param {boolean} options.duration - print duration of each action?
 * @param {boolean} options.timestamp - print timestamp with each action?
 * @param {Object} options.colors - custom colors
 * @param {Object} options.logger - implementation of the `console` API
 * @param {Function} options.logErrors - should errors in action execution be caught, logged, and re-thrown?
 * @param {Function} options.collapsed - is group collapsed?
 * @param {Function} options.predicate - condition which resolves logger behavior
 * @param {Function} options.stateTransformer - transform state before print
 * @param {Function} options.actionTransformer - transform action before print
 * @param {Function} options.errorTransformer - transform error before print
 *
 * @returns {Function} logger
 */
const createLogger = (options?: Options) => {
  const loggerOptions = { ...defaults, ...options };

  const {
    logger,
    stateTransformer,
    errorTransformer,
    predicate,
    logErrors,
    diffPredicate,
  } = loggerOptions;

  // Return if 'console' object is not defined
  if (typeof logger === 'undefined') {
    return (next: Function) => () => next(null);
  }

  const logBuffer: any[] = [];

  return (next: Function) => ({
    prevState,
    nextState,
    action,
  }: {
    prevState: any;
    nextState: any;
    action: any;
  }) => {
    // Exit early if predicate function returns 'false'
    if (
      typeof predicate === 'function' &&
      !predicate({ prevState, nextState }, action)
    ) {
      return next(action);
    }

    const logEntry: LogEntry = {};

    logBuffer.push(logEntry);

    logEntry.started = timer.now();
    logEntry.startedTime = new Date();
    logEntry.prevState = stateTransformer(prevState);
    logEntry.action = action;

    let returnedValue;
    if (logErrors) {
      try {
        returnedValue = next(action);
      } catch (e) {
        logEntry.error = errorTransformer(e);
      }
    } else {
      returnedValue = next(action);
    }

    logEntry.took = timer.now() - logEntry.started;
    logEntry.nextState = stateTransformer(nextState);

    const diff =
      loggerOptions.diff && typeof diffPredicate === 'function'
        ? diffPredicate(nextState, action)
        : loggerOptions.diff;
    printBuffer(logBuffer, { ...loggerOptions, diff });
    logBuffer.length = 0;

    if (logEntry.error) throw logEntry.error;
    return returnedValue;
  };
};

const defaultLogger = createLogger();

export { defaults, createLogger, defaultLogger as logger };

export default defaultLogger;
