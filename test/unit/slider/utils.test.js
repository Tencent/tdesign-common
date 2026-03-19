import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getStopStyle, formatSliderValue, formatLabel, formatPrecision } from '../../../js/slider/utils';

describe('slider/utils', () => {
  describe('getStopStyle', () => {
    it('应该返回水平位置样式', () => {
      const result = getStopStyle(50, false);
      expect(result).toEqual({ left: '50%' });
    });

    it('应该返回垂直位置样式', () => {
      const result = getStopStyle(30, true);
      expect(result).toEqual({ top: 'calc(70% - 1px)' });
    });

    it('应该处理0的位置', () => {
      const horizontal = getStopStyle(0, false);
      const vertical = getStopStyle(0, true);
      expect(horizontal).toEqual({ left: '0%' });
      expect(vertical).toEqual({ top: 'calc(100% - 1px)' });
    });

    it('应该处理100的位置', () => {
      const horizontal = getStopStyle(100, false);
      const vertical = getStopStyle(100, true);
      expect(horizontal).toEqual({ left: '100%' });
      expect(vertical).toEqual({ top: 'calc(0% - 1px)' });
    });

    it('应该处理小数位置', () => {
      const horizontal = getStopStyle(33.33, false);
      const vertical = getStopStyle(66.67, true);
      expect(horizontal).toEqual({ left: '33.33%' });
      expect(vertical).toEqual({ top: 'calc(33.33% - 1px)' });
    });
  });

  describe('formatSliderValue', () => {
    describe('type为first时', () => {
      it('应该返回数组第一个值', () => {
        expect(formatSliderValue([10, 20], 'first')).toBe(10);
      });

      it('应该返回单数值', () => {
        expect(formatSliderValue(50, 'first')).toBe(50);
      });

      it('应该处理负数', () => {
        expect(formatSliderValue([-5, 5], 'first')).toBe(-5);
      });

      it('应该处理零值', () => {
        expect(formatSliderValue(0, 'first')).toBe(0);
      });

      it('应该处理大数值', () => {
        expect(formatSliderValue([1000000, 2000000], 'first')).toBe(1000000);
      });
    });

    describe('type为second时', () => {
      it('应该返回数组第二个值', () => {
        expect(formatSliderValue([10, 20], 'second')).toBe(20);
      });

      it('应该返回0当值为非数组', () => {
        expect(formatSliderValue(50, 'second')).toBe(0);
      });

      it('应该返回0当值为undefined', () => {
        expect(formatSliderValue(undefined, 'second')).toBe(0);
      });

      it('应该处理负数', () => {
        expect(formatSliderValue([-5, -10], 'second')).toBe(-10);
      });

      it('应该处理小数', () => {
        expect(formatSliderValue([1.5, 2.5], 'second')).toBe(2.5);
      });
    });
  });

  describe('formatLabel', () => {
    beforeEach(() => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('应该返回数值当label为falsy', () => {
      expect(formatLabel(null, 50)).toBe('50');
      expect(formatLabel(false, 50)).toBe('50');
      expect(formatLabel(undefined, 50)).toBe('50');
      expect(formatLabel('', 50)).toBe('50');
    });

    it('应该替换${value}占位符', () => {
      expect(formatLabel('${value}%', 50)).toBe('50%');
      expect(formatLabel('Value: ${value}', 100)).toBe('Value: 100');
    });

    it('应该替换多个${value}占位符', () => {
      expect(formatLabel('${value} - ${value}', 50)).toBe('50 - 50');
      expect(formatLabel('${value}${value}', 10)).toBe('1010');
    });

    it('应该返回原字符串当没有${value}占位符', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn');
      expect(formatLabel('Static Label', 50)).toBe('Static Label');
      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it('应该处理负数值', () => {
      expect(formatLabel('${value}', -10)).toBe('-10');
      expect(formatLabel('${value}°', -5)).toBe('-5°');
    });

    it('应该处理零值', () => {
      expect(formatLabel('${value}', 0)).toBe('0');
      expect(formatLabel('${value}%', 0)).toBe('0%');
    });

    it('应该处理小数值', () => {
      expect(formatLabel('${value}', 3.14)).toBe('3.14');
      expect(formatLabel('${value}px', 1.5)).toBe('1.5px');
    });

    it('应该处理复杂占位符格式', () => {
      expect(formatLabel('Progress: ${value}%', 75)).toBe('Progress: 75%');
      expect(formatLabel('[$${value}]', 100)).toBe('[$100]');
    });

    it('应该返回对象当label是对象', () => {
      const labelObj = { text: 'Custom', value: 50 };
      expect(formatLabel(labelObj, 50)).toBe(labelObj);
    });

    it('应该警告当label字符串不包含${value}', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn');
      formatLabel('Invalid Label', 50);
      expect(consoleWarnSpy).toHaveBeenCalledWith("fail to parse label prop, please pass string such as '${value}'");
    });
  });

  describe('formatPrecision', () => {
    it('应该格式化到指定精度', () => {
      expect(formatPrecision(3.14159, 2)).toBe(3.14);
      expect(formatPrecision(3.14159, 3)).toBe(3.142);
      expect(formatPrecision(3.14159, 4)).toBe(3.1416);
    });

    it('应该处理精度为0', () => {
      expect(formatPrecision(3.7, 0)).toBe(4);
      expect(formatPrecision(3.2, 0)).toBe(3);
      expect(formatPrecision(3.5, 0)).toBe(4);
    });

    it('应该处理整数', () => {
      expect(formatPrecision(5, 2)).toBe(5);
      expect(formatPrecision(10, 0)).toBe(10);
    });

    it('应该处理负数', () => {
      expect(formatPrecision(-3.14159, 2)).toBe(-3.14);
      expect(formatPrecision(-2.5, 0)).toBe(-3);
    });

    it('应该处理零值', () => {
      expect(formatPrecision(0, 2)).toBe(0);
      expect(formatPrecision(0, 0)).toBe(0);
    });

    it('应该处理小数精度', () => {
      expect(formatPrecision(1.2345, 1)).toBe(1.2);
      expect(formatPrecision(1.2345, 2)).toBe(1.23);
      expect(formatPrecision(1.2345, 3)).toBe(1.234);
    });

    it('应该处理大数值', () => {
      expect(formatPrecision(1234.5678, 2)).toBe(1234.57);
      expect(formatPrecision(999.9999, 3)).toBe(1000);
    });

    it('应该处理科学计数法字符串', () => {
      expect(formatPrecision(parseFloat('1.23e-4'), 6)).toBe(0.000123);
      expect(formatPrecision(parseFloat('1.23e4'), 2)).toBe(12300);
    });

    it('应该返回数字类型', () => {
      expect(typeof formatPrecision(3.14, 2)).toBe('number');
      expect(typeof formatPrecision(5, 0)).toBe('number');
    });
  });
});
