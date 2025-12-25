import { describe, it, expect } from 'vitest';
import { hasStyleUnit, addStyleUnit } from '../../../js/utils/helper';

describe('helper utils', () => {
  describe('hasStyleUnit', () => {
    it('应该返回 true 当值包含 px 单位', () => {
      expect(hasStyleUnit('10px')).toBe(true);
      expect(hasStyleUnit('0px')).toBe(true);
      expect(hasStyleUnit('100px')).toBe(true);
    });

    it('应该返回 true 当值包含 rpx 单位', () => {
      expect(hasStyleUnit('10rpx')).toBe(true);
      expect(hasStyleUnit('20rpx')).toBe(true);
    });

    it('应该返回 true 当值包含 em 单位', () => {
      expect(hasStyleUnit('1em')).toBe(true);
      expect(hasStyleUnit('2.5em')).toBe(true);
    });

    it('应该返回 true 当值包含 rem 单位', () => {
      expect(hasStyleUnit('1rem')).toBe(true);
      expect(hasStyleUnit('1.5rem')).toBe(true);
    });

    it('应该返回 true 当值包含 % 单位', () => {
      expect(hasStyleUnit('50%')).toBe(true);
      expect(hasStyleUnit('100%')).toBe(true);
    });

    it('应该返回 true 当值包含 vh 单位', () => {
      expect(hasStyleUnit('100vh')).toBe(true);
      expect(hasStyleUnit('50vh')).toBe(true);
    });

    it('应该返回 true 当值包含 vw 单位', () => {
      expect(hasStyleUnit('100vw')).toBe(true);
      expect(hasStyleUnit('75vw')).toBe(true);
    });

    it('应该返回 false 当值不包含任何单位', () => {
      expect(hasStyleUnit('10')).toBe(false);
      expect(hasStyleUnit('0')).toBe(false);
      expect(hasStyleUnit('abc')).toBe(false);
      expect(hasStyleUnit('')).toBe(false);
    });

    it('应该返回 false 当值包含无效单位', () => {
      expect(hasStyleUnit('10pt')).toBe(false);
      expect(hasStyleUnit('20cm')).toBe(false);
      expect(hasStyleUnit('30mm')).toBe(false);
    });
  });

  describe('addStyleUnit', () => {
    it('应该保持原值当已经包含单位', () => {
      expect(addStyleUnit('10px')).toBe('10px');
      expect(addStyleUnit('20rpx')).toBe('20rpx');
      expect(addStyleUnit('1em')).toBe('1em');
      expect(addStyleUnit('2rem')).toBe('2rem');
      expect(addStyleUnit('50%')).toBe('50%');
      expect(addStyleUnit('100vh')).toBe('100vh');
      expect(addStyleUnit('75vw')).toBe('75vw');
    });

    it('应该添加默认 px 单位当传入数字', () => {
      expect(addStyleUnit(10)).toBe('10px');
      expect(addStyleUnit(0)).toBe('0px');
      expect(addStyleUnit(100)).toBe('100px');
      expect(addStyleUnit(-5)).toBe('-5px');
    });

    it('应该添加默认 px 单位当传入数字字符串', () => {
      expect(addStyleUnit('10')).toBe('10px');
      expect(addStyleUnit('0')).toBe('0px');
      expect(addStyleUnit('100')).toBe('100px');
      expect(addStyleUnit('-5')).toBe('-5px');
      expect(addStyleUnit('3.14')).toBe('3.14px');
    });

    it('应该添加指定单位', () => {
      expect(addStyleUnit(10, 'em')).toBe('10em');
      expect(addStyleUnit(20, 'rem')).toBe('20rem');
      expect(addStyleUnit(50, '%')).toBe('50%');
      expect(addStyleUnit(100, 'vh')).toBe('100vh');
    });

    it('应该保持原值当传入包含单位的字符串', () => {
      expect(addStyleUnit('10px')).toBe('10px');
      expect(addStyleUnit('20rpx')).toBe('20rpx');
      expect(addStyleUnit('1.5em')).toBe('1.5em');
      expect(addStyleUnit('2.3rem')).toBe('2.3rem');
    });

    it('应该正确处理边界值', () => {
      expect(addStyleUnit('')).toBe('px');
      expect(addStyleUnit(0)).toBe('0px');
      expect(addStyleUnit(NaN)).toBe('NaNpx');
    });
  });
});