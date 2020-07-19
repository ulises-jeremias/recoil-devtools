export default {
  level: () => 'log',
  logger: console,
  logErrors: true,
  collapsed: false,
  predicate: false,
  duration: false,
  timestamp: true,
  stateTransformer: (state: any) => state,
  actionTransformer: (action: any) => action,
  errorTransformer: (error: any) => error,
  colors: {
    title: () => 'inherit',
    prevState: () => '#9E9E9E',
    action: () => '#03A9F4',
    nextState: () => '#4CAF50',
    error: () => '#F20404',
  },
  diff: false,
  diffPredicate: (...data: any[]) => false,

  // Deprecated options
  transformer: undefined,
};
