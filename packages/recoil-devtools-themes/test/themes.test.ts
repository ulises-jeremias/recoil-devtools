import { describe, expect, it } from 'vitest';
import * as themes from '../src';

const BASE_KEYS = [
  'base00',
  'base01',
  'base02',
  'base03',
  'base04',
  'base05',
  'base06',
  'base07',
  'base08',
  'base09',
  'base0A',
  'base0B',
  'base0C',
  'base0D',
  'base0E',
  'base0F',
] as const;

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

describe('recoil-devtools-themes', () => {
  it('exports the expected theme set', () => {
    expect(Object.keys(themes).sort()).toEqual(
      [
        'dracula',
        'gruvbox',
        'monokai',
        'nord',
        'ocean',
        'solarized',
        'solarizedLight',
        'ulisesjcf',
      ].sort()
    );
  });

  it.each(Object.entries(themes))(
    'theme %s is a valid base16 object',
    (_name, theme) => {
      expect(typeof theme.scheme).toBe('string');
      expect(theme.scheme.length).toBeGreaterThan(0);
      expect(typeof theme.author).toBe('string');
      expect(theme.author.length).toBeGreaterThan(0);
      for (const key of BASE_KEYS) {
        expect(theme[key], key).toMatch(HEX_COLOR);
      }
    }
  );
});
