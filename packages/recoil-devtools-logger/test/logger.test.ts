import { createLogger } from '../src/logger';

const createMockConsole = () => ({
  log: vi.fn(),
  group: vi.fn(),
  groupCollapsed: vi.fn(),
  groupEnd: vi.fn(),
});

describe('createLogger', () => {
  it('prints state changes with the default formatting and grouping', () => {
    const console = createMockConsole();
    const next = vi.fn().mockReturnValue('next result');
    const action = { description: 'Increment' };

    const result = createLogger({ logger: console })(next)({
      prevState: { count: 0 },
      nextState: { count: 1 },
      action,
    });

    expect(result).toBe('next result');
    expect(next).toHaveBeenCalledWith(action);
    expect(console.group).toHaveBeenCalledOnce();
    expect(console.group.mock.calls[0][0]).toMatch(
      /^%c action %cIncrement %c@\d{2}:\d{2}:\d{2}\.\d{3} %c\(in \d+\.\d{2} ms\)$/
    );
    expect(console.group.mock.calls[0].slice(1)).toEqual([
      'color: gray; font-weight: lighter;',
      'color: inherit;',
      'color: gray; font-weight: lighter;',
      'color: gray; font-weight: lighter;',
    ]);
    expect(console.log.mock.calls).toEqual([
      ['%c prev state', 'color: #9E9E9E; font-weight: bold', { count: 0 }],
      ['%c action    ', 'color: #03A9F4; font-weight: bold', action],
      ['%c next state', 'color: #4CAF50; font-weight: bold', { count: 1 }],
    ]);
    expect(console.groupCollapsed).not.toHaveBeenCalled();
    expect(console.groupEnd).toHaveBeenCalledOnce();
  });

  it('uses a collapsed console group when configured', () => {
    const console = createMockConsole();

    createLogger({ logger: console, collapsed: true })(() => undefined)({
      prevState: 'before',
      nextState: 'after',
      action: { description: 'Update' },
    });

    expect(console.group).not.toHaveBeenCalled();
    expect(console.groupCollapsed).toHaveBeenCalledOnce();
    expect(console.groupCollapsed.mock.calls[0][0]).toMatch(
      /^%c action %cUpdate /
    );
    expect(console.groupEnd).toHaveBeenCalledOnce();
  });

  it('captures, transforms, prints, and rethrows errors from the next handler', () => {
    const console = createMockConsole();
    const originalError = new Error('original error');
    const transformedError = new Error('transformed error');
    const errorTransformer = vi.fn().mockReturnValue(transformedError);
    const next = vi.fn(() => {
      throw originalError;
    });
    const action = { description: 'Fail' };

    const log = createLogger({
      logger: console,
      logErrors: true,
      errorTransformer,
    })(next);

    expect(() =>
      log({
        prevState: { status: 'ready' },
        nextState: { status: 'failed' },
        action,
      })
    ).toThrow(transformedError);
    expect(errorTransformer).toHaveBeenCalledOnce();
    expect(errorTransformer).toHaveBeenCalledWith(originalError);
    expect(console.log).toHaveBeenCalledWith(
      '%c error     ',
      'color: #F20404; font-weight: bold;',
      transformedError
    );
    expect(console.groupEnd).toHaveBeenCalledOnce();
  });
});
