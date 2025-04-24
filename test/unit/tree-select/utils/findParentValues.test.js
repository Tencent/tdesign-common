import { describe, it, expect } from 'vitest';
import { findParentValues } from '../../../../js/tree-select/utils';

describe('tree-select:findParentValues', () => {
  describe('base', () => {
    const data = [{
      value: 't1',
      label: 't1',
      children: [{
        value: 't1.1',
        label: 't1.1',
        children: [{
          value: 't1.1.1',
          label: 't1.1.1',
        }],
      }],
    }, {
      value: 't2',
      label: 't2',
      children: [{
        value: 't2.1',
        label: 't2.1',
      }],
    }];

    it('string', () => {
      const value = 't1.1.1';
      const parentValues = findParentValues(data, value, 'value', 'children');
      expect(parentValues).toEqual(['t1', 't1.1']);

      const value2 = 't2.1';
      const parentValues2 = findParentValues(data, value2, 'value', 'children');
      expect(parentValues2).toEqual(['t2']);

      const value3 = 't2';
      const parentValues3 = findParentValues(data, value3, 'value', 'children');
      expect(parentValues3).toEqual([]);

      const value4 = 't3';
      const parentValues4 = findParentValues(data, value4, 'value', 'children');
      expect(parentValues4).toEqual([]);
    });

    it('object', () => {
      const value = { value: 't1.1.1', label: 't1.1.1' };
      const parentValues = findParentValues(data, value, 'value', 'children');
      expect(parentValues).toEqual(['t1', 't1.1']);

      const value2 = { value: 't2.1', label: 't2.1' };
      const parentValues2 = findParentValues(data, value2, 'value', 'children');
      expect(parentValues2).toEqual(['t2']);

      const value3 = { value: 't2', label: 't2' };
      const parentValues3 = findParentValues(data, value3, 'value', 'children');
      expect(parentValues3).toEqual([]);

      const value4 = { value: 't3', label: 't3' };
      const parentValues4 = findParentValues(data, value4, 'value', 'children');
      expect(parentValues4).toEqual([]);
    });
  });

  describe('alias', () => {
    const aliasData = [{
      key: 't1',
      name: 't1',
      group: [{
        key: 't1.1',
        name: 't1.1',
        group: [{
          key: 't1.1.1',
          name: 't1.1.1',
        }],
      }],
    }, {
      key: 't2',
      name: 't2',
      group: [{
        key: 't2.1',
        name: 't2.1',
      }],
    }];

    it('string', () => {
      const value = 't1.1.1';
      const parentValues = findParentValues(aliasData, value, 'key', 'group');
      expect(parentValues).toEqual(['t1', 't1.1']);

      const value2 = 't2.1';
      const parentValues2 = findParentValues(aliasData, value2, 'key', 'group');
      expect(parentValues2).toEqual(['t2']);

      const value3 = 't2';
      const parentValues3 = findParentValues(aliasData, value3, 'key', 'group');
      expect(parentValues3).toEqual([]);

      const value4 = 't3';
      const parentValues4 = findParentValues(aliasData, value4, 'key', 'group');
      expect(parentValues4).toEqual([]);
    });

    it('object', () => {
      const value = { key: 't1.1.1', name: 't1.1.1' };
      const parentValues = findParentValues(aliasData, value, 'key', 'group');
      expect(parentValues).toEqual(['t1', 't1.1']);

      const value2 = { key: 't2.1', name: 't2.1' };
      const parentValues2 = findParentValues(aliasData, value2, 'key', 'group');
      expect(parentValues2).toEqual(['t2']);

      const value3 = { key: 't2', name: 't2' };
      const parentValues3 = findParentValues(aliasData, value3, 'key', 'group');
      expect(parentValues3).toEqual([]);

      const value4 = { key: 't3', name: 't3' };
      const parentValues4 = findParentValues(aliasData, value4, 'key', 'group');
      expect(parentValues4).toEqual([]);
    });
  });
});
