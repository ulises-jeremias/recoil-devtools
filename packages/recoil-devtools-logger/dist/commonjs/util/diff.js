"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = exports.style = void 0;
var deep_diff_1 = require("deep-diff");
// https://github.com/flitbit/diff#differences
var dictionary = {
    E: {
        color: '#2196F3',
        text: 'CHANGED:',
    },
    N: {
        color: '#4CAF50',
        text: 'ADDED:',
    },
    D: {
        color: '#F44336',
        text: 'DELETED:',
    },
    A: {
        color: '#2196F3',
        text: 'ARRAY:',
    },
};
function style(kind) {
    return "color: " + dictionary[kind].color + "; font-weight: bold";
}
exports.style = style;
function render(diff) {
    var kind = diff.kind, path = diff.path, lhs = diff.lhs, rhs = diff.rhs, index = diff.index, item = diff.item;
    switch (kind) {
        case 'E':
            return [path.join('.'), lhs, '→', rhs];
        case 'N':
            return [path.join('.'), rhs];
        case 'D':
            return [path.join('.')];
        case 'A':
            return [path.join('.') + "[" + index + "]", item];
        default:
            return [];
    }
}
exports.render = render;
function diffLogger(prevState, newState, logger, isCollapsed) {
    var diffs = deep_diff_1.diff(prevState, newState);
    try {
        if (isCollapsed) {
            logger.groupCollapsed('diff');
        }
        else {
            logger.group('diff');
        }
    }
    catch (e) {
        logger.log('diff');
    }
    if (diffs) {
        diffs.forEach(function (elem) {
            var kind = elem.kind;
            var output = render(elem);
            logger.log.apply(logger, __spreadArrays(["%c " + dictionary[kind].text, style(kind)], output));
        });
    }
    else {
        logger.log('—— no diff ——');
    }
    try {
        logger.groupEnd();
    }
    catch (e) {
        logger.log('—— diff end —— ');
    }
}
exports.default = diffLogger;
