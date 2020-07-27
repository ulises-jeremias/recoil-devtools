import { style, render, default as diffLogger } from '../../src/util/diff';

describe('style', () => {
    it('return css rules for the given kind of diff changes', () => {
        expect(style('E')).toBe('color: #2196F3; font-weight: bold');
        expect(style('N')).toBe('color: #4CAF50; font-weight: bold');
        expect(style('D')).toBe('color: #F44336; font-weight: bold');
        expect(style('A')).toBe('color: #2196F3; font-weight: bold');
    });
});

describe('render', () => {
    it('should return an array indicating the changes', () => {
        expect(render({
            kind: 'E',
            path: ['capitain', 'name'],
            lhs: 'kirk',
            rhs: 'picard',
        })).toEqual(['capitain.name', 'kirk', '→', 'picard']);
    });

    it('should return an array indicating an added property/element', () => {
        expect(render({
            kind: 'N',
            path: ['crew', 'engineer'],
            rhs: 'geordi',
        })).toEqual(['crew.engineer', 'geordi']);
    });

    it('should return an array indicating a removed property/element', () => {
        expect(render({
            kind: 'D',
            path: ['crew', 'security'],
        })).toEqual(['crew.security']);
    });

    it('should return an array indicating a changed index', () => {
        expect(render({
            kind: 'A',
            path: ['crew'],
            index: 2,
            item: {
            kind: 'N',
            rhs: 'after',
            },
        })).toEqual(['crew[2]', {
            kind: 'N',
            rhs: 'after',
        }]);
    });

    it('should return an empty array', () => {
        expect(render({})).toEqual([]);
    });
});

describe('diffLogger', () => {
    let logger: any;

    beforeEach(() => {
        logger = {
            log: jest.fn(),
            groupCollapsed: jest.fn(),
            groupEnd: jest.fn(),
            group: jest.fn(),
        };
    });

    it('should show no diff with group collapsed', () => {
        diffLogger({}, {}, logger, true);

        expect(logger.group).toHaveBeenCalledTimes(0);
        expect(logger.groupCollapsed).toHaveBeenCalled();
        expect(logger.groupEnd).toHaveBeenCalled();
        expect(logger.log).toHaveBeenCalled();
        expect(logger.log).toHaveBeenCalledWith('—— no diff ——');
    });

    it('should show no diff with group not collapsed', () => {
        diffLogger({}, {}, logger, false);

        expect(logger.group).toHaveBeenCalled();
        expect(logger.groupCollapsed).toHaveBeenCalledTimes(0);
        expect(logger.groupEnd).toHaveBeenCalled();
        expect(logger.log).toHaveBeenCalled();
        expect(logger.log).toHaveBeenCalledWith('—— no diff ——');
    });

    it('should log no diff without group', () => {
        const loggerWithNoGroupCollapsed = Object.assign({}, logger, {
            groupCollapsed: () => {
                throw new Error()
            },
            groupEnd: () => {
                throw new Error()
            },
        });

        diffLogger({}, {}, loggerWithNoGroupCollapsed, true);

        expect(loggerWithNoGroupCollapsed.log).toHaveBeenCalledWith('diff');
        expect(loggerWithNoGroupCollapsed.log).toHaveBeenCalledWith('—— no diff ——');
        expect(loggerWithNoGroupCollapsed.log).toHaveBeenCalledWith('—— diff end —— ');
    });

    it('should log the diffs', () => {
        diffLogger({name: 'kirk'}, {name: 'picard'}, logger, false);

        expect(logger.log).toHaveBeenCalledWith('%c CHANGED:', 'color: #2196F3; font-weight: bold', 'name', 'kirk', '→', 'picard');
    });
});
