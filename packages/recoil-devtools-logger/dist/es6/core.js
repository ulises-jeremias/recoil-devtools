var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { formatTime } from './util/helpers';
import diffLogger from './util/diff';
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
var getLogLevel = function (level, action, newValue, type) {
    switch (typeof level) {
        case 'object':
            var typeLevel = level[type];
            return typeof typeLevel === 'function'
                ? typeLevel.apply(void 0, newValue) : typeLevel;
        case 'function':
            return level(action);
        default:
            return level;
    }
};
var defaultTitleFormatter = function (options) {
    var timestamp = options.timestamp, duration = options.duration;
    return function (action, time, took) {
        var parts = ['action'];
        parts.push("%c" + String(action.description));
        if (timestamp)
            parts.push("%c@" + time);
        if (duration)
            parts.push("%c(in " + took.toFixed(2) + " ms)");
        return parts.join(' ');
    };
};
var printBuffer = function (buffer, options) {
    var logger = options.logger, actionTransformer = options.actionTransformer, _a = options.titleFormatter, titleFormatter = _a === void 0 ? defaultTitleFormatter(options) : _a, collapsed = options.collapsed, colors = options.colors, level = options.level, diff = options.diff;
    var isUsingDefaultFormatter = typeof options.titleFormatter === 'undefined';
    buffer.forEach(function (logEntry, key) {
        var _a = logEntry.started, started = _a === void 0 ? 0 : _a, _b = logEntry.startedTime, startedTime = _b === void 0 ? new Date() : _b, action = logEntry.action, prevState = logEntry.prevState, error = logEntry.error;
        var took = logEntry.took, nextState = logEntry.nextState;
        var nextEntry = buffer[key + 1];
        if (nextEntry) {
            nextState = nextEntry.prevState;
            took = nextEntry.started - started;
        }
        // Message
        var formattedAction = actionTransformer(action);
        var isCollapsed = typeof collapsed === 'function'
            ? collapsed(function () { return nextState; }, action, logEntry)
            : collapsed;
        var formattedTime = formatTime(startedTime);
        var titleCSS = colors.title
            ? "color: " + colors.title(formattedAction) + ";"
            : '';
        var headerCSS = ['color: gray; font-weight: lighter;'];
        headerCSS.push(titleCSS);
        if (options.timestamp)
            headerCSS.push('color: gray; font-weight: lighter;');
        if (options.duration)
            headerCSS.push('color: gray; font-weight: lighter;');
        var title = titleFormatter(formattedAction, formattedTime, took);
        // Render
        try {
            if (isCollapsed) {
                if (colors.title && isUsingDefaultFormatter) {
                    logger.groupCollapsed.apply(logger, __spreadArrays(["%c " + title], headerCSS));
                }
                else
                    logger.groupCollapsed(title);
            }
            else if (colors.title && isUsingDefaultFormatter) {
                logger.group.apply(logger, __spreadArrays(["%c " + title], headerCSS));
            }
            else {
                logger.group(title);
            }
        }
        catch (e) {
            logger.log(title);
        }
        var prevStateLevel = getLogLevel(level, formattedAction, [prevState], 'prevState');
        var actionLevel = getLogLevel(level, formattedAction, [formattedAction], 'action');
        var errorLevel = getLogLevel(level, formattedAction, [error, prevState], 'error');
        var nextStateLevel = getLogLevel(level, formattedAction, [nextState], 'nextState');
        if (prevStateLevel) {
            if (colors.prevState) {
                var styles = "color: " + colors.prevState(prevState) + "; font-weight: bold";
                logger[prevStateLevel]('%c prev state', styles, prevState);
            }
            else
                logger[prevStateLevel]('prev state', prevState);
        }
        if (actionLevel) {
            if (colors.action) {
                var styles = "color: " + colors.action(formattedAction) + "; font-weight: bold";
                logger[actionLevel]('%c action    ', styles, formattedAction);
            }
            else
                logger[actionLevel]('action    ', formattedAction);
        }
        if (error && errorLevel) {
            if (colors.error) {
                var styles = "color: " + colors.error(error, prevState) + "; font-weight: bold;";
                logger[errorLevel]('%c error     ', styles, error);
            }
            else
                logger[errorLevel]('error     ', error);
        }
        if (nextStateLevel) {
            if (colors.nextState) {
                var styles = "color: " + colors.nextState(nextState) + "; font-weight: bold";
                logger[nextStateLevel]('%c next state', styles, nextState);
            }
            else
                logger[nextStateLevel]('next state', nextState);
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
        }
        catch (e) {
            logger.log('—— log end ——');
        }
    });
};
export default printBuffer;
