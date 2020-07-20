declare const _default: {
    level: () => string;
    logger: Console;
    logErrors: boolean;
    collapsed: boolean;
    predicate: boolean;
    duration: boolean;
    timestamp: boolean;
    stateTransformer: (state: any) => any;
    actionTransformer: (action: any) => any;
    errorTransformer: (error: any) => any;
    colors: {
        title: () => string;
        prevState: () => string;
        action: () => string;
        nextState: () => string;
        error: () => string;
    };
    diff: boolean;
    diffPredicate: (...data: any[]) => boolean;
    transformer: any;
};
export default _default;
