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
    });

    it('object', () => {
      const value = { value: 't1.1.1', label: 't1.1.1' };
      const parentValues = findParentValues(data, value, 'value', 'children');
      expect(parentValues).toEqual(['t1', 't1.1']);
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
    });

    it('object', () => {
      const value = { key: 't1.1.1', name: 't1.1.1' };
      const parentValues = findParentValues(aliasData, value, 'key', 'group');
      expect(parentValues).toEqual(['t1', 't1.1']);
    });
  });
});
