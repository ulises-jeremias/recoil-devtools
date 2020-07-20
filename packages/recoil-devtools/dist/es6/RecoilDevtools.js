var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React, { Children } from 'react';
export var RecoilDevtools = function (_a) {
    var values = _a.values, children = _a.children;
    return (React.createElement(React.Fragment, null, Children.map(children, function (child) {
        if (!React.isValidElement(child)) {
            return child;
        }
        return React.cloneElement(child, __assign({ values: values }, child.props));
    })));
};
