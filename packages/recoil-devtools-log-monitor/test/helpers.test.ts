import { brighten } from '../src/helpers';

describe('brighten', () => {
  it('lightens each RGB channel', () => {
    expect(brighten('#808080', 0.2)).toBe('#9a9a9a');
  });
});
