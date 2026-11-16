import { describe, expect, it } from 'vitest';
import { formatTime } from '../../../js/date-picker/format';

// format 里没有时间部分时，解析结果恒为 00:00:00，
// 此时应该用 defaultTime 而不是解析结果（issue #3761）
describe('date-picker formatTime defaultTime', () => {
  it('applies both defaultTime entries when format has no time part', () => {
    const result = formatTime(['2024-01-01', '2024-01-31'], 'YYYY-MM-DD', 'HH:mm:ss', ['00:00:00', '23:59:59']);
    expect(result).toEqual(['00:00:00', '23:59:59']);
  });

  it('keeps the parsed time when format carries a time part', () => {
    const result = formatTime(['2024-01-01 08:30:00', '2024-01-31 18:45:00'], 'YYYY-MM-DD HH:mm:ss', 'HH:mm:ss', [
      '00:00:00',
      '23:59:59',
    ]);
    expect(result).toEqual(['08:30:00', '18:45:00']);
  });

  it('falls back to defaultTime for an empty value', () => {
    const result = formatTime(['', ''], 'YYYY-MM-DD', 'HH:mm:ss', ['00:00:00', '23:59:59']);
    expect(result).toEqual(['00:00:00', '23:59:59']);
  });
});
