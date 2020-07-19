import { formatTime } from './util/helpers';
import diffLogger from './util/diff';

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

type LogLevelFunction = string | ((...data: any[]) => string);

interface LogLevelObject {
  [key: string]: LogLevelFunction;
}

export type LogLevel = LogLevelFunction | LogLevelObject;

/**
 * Get log level string based on supplied params
 *
 * @param {string | Function | object} level - console[level]
 * @param {object} action - selected action
 * @param {array} newValue - selected newValue
 * @param {string} type - log entry type
 *
 * @returns {string} level
 */
const getLogLevel = (
  level: LogLevel,
  action: object,
  newValue: any[],
  type: string
): string => {
  switch (typeof level) {
    case 'object':
      const typeLevel = level[type];
      return typeof typeLevel === 'function'
        ? typeLevel(...newValue)
        : typeLevel;
    case 'function':
      return level(action);
    default:
      return level;
  }
};

const defaultTitleFormatter = (options: {
  timestamp?: any;
  duration?: any;
}) => {
  const { timestamp, duration } = options;

  return (action: { description: string }, time: any, took: number) => {
    const parts = ['action'];

    parts.push(`%c${String(action.description)}`);
    if (timestamp) parts.push(`%c@${time}`);
    if (duration) parts.push(`%c(in ${took.toFixed(2)} ms)`);

    return parts.join(' ');
  };
};

const printBuffer = (buffer: any[], options: Options) => {
  const {
    logger,
    actionTransformer,
    titleFormatter = defaultTitleFormatter(options),
    collapsed,
    colors,
    level,
    diff,
  } = options;

  const isUsingDefaultFormatter = typeof options.titleFormatter === 'undefined';

  buffer.forEach((logEntry: LogEntry, key: number) => {
    const {
      started = 0,
      startedTime = new Date(),
      action,
      prevState,
      error,
    } = logEntry;
    let { took, nextState } = logEntry;
    const nextEntry = buffer[key + 1];

    if (nextEntry) {
      nextState = nextEntry.prevState;
      took = nextEntry.started - started;
    }

    // Message
    const formattedAction = actionTransformer(action);
    const isCollapsed =
      typeof collapsed === 'function'
        ? collapsed(() => nextState, action, logEntry)
        : collapsed;

    const formattedTime = formatTime(startedTime);
    const titleCSS = colors.title
      ? `color: ${colors.title(formattedAction)};`
      : '';
    const headerCSS = ['color: gray; font-weight: lighter;'];
    headerCSS.push(titleCSS);
    if (options.timestamp) headerCSS.push('color: gray; font-weight: lighter;');
    if (options.duration) headerCSS.push('color: gray; font-weight: lighter;');
    const title = titleFormatter(formattedAction, formattedTime, took);

    // Render
    try {
      if (isCollapsed) {
        if (colors.title && isUsingDefaultFormatter) {
          logger.groupCollapsed(`%c ${title}`, ...headerCSS);
        } else logger.groupCollapsed(title);
      } else if (colors.title && isUsingDefaultFormatter) {
        logger.group(`%c ${title}`, ...headerCSS);
      } else {
        logger.group(title);
      }
    } catch (e) {
      logger.log(title);
    }

    const prevStateLevel = getLogLevel(
      level,
      formattedAction,
      [prevState],
      'prevState'
    );
    const actionLevel = getLogLevel(
      level,
      formattedAction,
      [formattedAction],
      'action'
    );
    const errorLevel = getLogLevel(
      level,
      formattedAction,
      [error, prevState],
      'error'
    );
    const nextStateLevel = getLogLevel(
      level,
      formattedAction,
      [nextState],
      'nextState'
    );

    if (prevStateLevel) {
      if (colors.prevState) {
        const styles = `color: ${colors.prevState(
          prevState
        )}; font-weight: bold`;

        logger[prevStateLevel]('%c prev state', styles, prevState);
      } else logger[prevStateLevel]('prev state', prevState);
    }

    if (actionLevel) {
      if (colors.action) {
        const styles = `color: ${colors.action(
          formattedAction
        )}; font-weight: bold`;

        logger[actionLevel]('%c action    ', styles, formattedAction);
      } else logger[actionLevel]('action    ', formattedAction);
    }

    if (error && errorLevel) {
      if (colors.error) {
        const styles = `color: ${colors.error(
          error,
          prevState
        )}; font-weight: bold;`;

        logger[errorLevel]('%c error     ', styles, error);
      } else logger[errorLevel]('error     ', error);
    }

    if (nextStateLevel) {
      if (colors.nextState) {
        const styles = `color: ${colors.nextState(
          nextState
        )}; font-weight: bold`;

        logger[nextStateLevel]('%c next state', styles, nextState);
      } else logger[nextStateLevel]('next state', nextState);
    }

    if (logger.withTrace) {
      logger.groupCollapsed('TRACE');
      logger.trace();
      logger.groupEnd();
    }

    if (diff) {
      diffLogger(prevState, nextState, logger, isCollapsed);
    }

    try {
      logger.groupEnd();
    } catch (e) {
      logger.log('—— log end ——');
    }
  });
};

export default printBuffer;
