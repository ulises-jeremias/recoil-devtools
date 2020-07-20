export default {
    level: function () { return 'log'; },
    logger: console,
    logErrors: true,
    collapsed: false,
    predicate: false,
    duration: true,
    timestamp: true,
    stateTransformer: function (state) { return state; },
    actionTransformer: function (action) { return action; },
    errorTransformer: function (error) { return error; },
    colors: {
        title: function () { return 'inherit'; },
        prevState: function () { return '#9E9E9E'; },
        action: function () { return '#03A9F4'; },
        nextState: function () { return '#4CAF50'; },
        error: function () { return '#F20404'; },
    },
    diff: false,
    diffPredicate: function () {
        var data = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            data[_i] = arguments[_i];
        }
        return false;
    },
    // Deprecated options
    transformer: undefined,
};
