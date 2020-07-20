export var repeat = function (str, times) {
    return new Array(times + 1).join(str);
};
export var pad = function (num, maxLength) {
    return repeat('0', maxLength - num.toString().length) + num;
};
export var formatTime = function (time) {
    return pad(time.getHours(), 2) + ":" + pad(time.getMinutes(), 2) + ":" + pad(time.getSeconds(), 2) + "." + pad(time.getMilliseconds(), 3);
};
// Use performance API if it's available in order to get better precision
export var timer = typeof performance !== 'undefined' &&
    performance !== null &&
    typeof performance.now === 'function'
    ? performance
    : Date;
