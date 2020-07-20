define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.timer = exports.formatTime = exports.pad = exports.repeat = void 0;
    exports.repeat = function (str, times) {
        return new Array(times + 1).join(str);
    };
    exports.pad = function (num, maxLength) {
        return exports.repeat('0', maxLength - num.toString().length) + num;
    };
    exports.formatTime = function (time) {
        return exports.pad(time.getHours(), 2) + ":" + exports.pad(time.getMinutes(), 2) + ":" + exports.pad(time.getSeconds(), 2) + "." + exports.pad(time.getMilliseconds(), 3);
    };
    // Use performance API if it's available in order to get better precision
    exports.timer = typeof performance !== 'undefined' &&
        performance !== null &&
        typeof performance.now === 'function'
        ? performance
        : Date;
});
