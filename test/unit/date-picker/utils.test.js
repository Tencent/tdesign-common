import { describe, it, expect } from 'vitest';
import { extractTimeFormat } from '../../../js/date-picker/format';

describe('utils', () => {
  describe(' extractTimeFormat', () => {
    it('YYYY-MM-DD HH:mm:ss', () => {
      const res = extractTimeFormat('YYYY-MM-DD HH:mm:ss');
      expect(res).toBe('HH:mm:ss');
    });

    it('YYYY-MM-DD HH时mm分ss秒', () => {
      const res = extractTimeFormat('YYYY-MM-DD HH时mm分ss秒');
      expect(res).toBe('HH时mm分ss秒');
    });

    it('YYYY-MM-DD HH时mm分ss秒SSS毫秒', () => {
      const res = extractTimeFormat('YYYY-MM-DD HH时mm分ss秒SSS毫秒');
      expect(res).toBe('HH时mm分ss秒SSS毫秒');
    });
  });
});
