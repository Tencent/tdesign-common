import { describe, expect, it } from 'vitest';
import { findParentValues } from '../../../../js/tree-select/utils';

describe('tree-select:findParentValues bigint values', () => {
  const options = [
    { value: 1n, children: [{ value: 0n }, { value: 9007199254740993n }] },
    { value: 1, children: [{ value: 0 }] },
  ];

  // Issue: https://github.com/Tencent/tdesign-vue-next/issues/6798
  it.each([0n, 9007199254740993n])('resolves primitive and object bigint value %s', (value) => {
    expect(findParentValues(options, value, 'value', 'children')).toEqual([1n]);
    expect(findParentValues(options, { value }, 'value', 'children')).toEqual([1n]);
  });

  // Issue: https://github.com/Tencent/tdesign-vue-next/issues/6798
  it('does not coerce numeric zero to bigint zero', () => {
    expect(findParentValues(options, 0, 'value', 'children')).toEqual([1]);
    expect(findParentValues(options, '0', 'value', 'children')).toEqual([]);
  });

  // Issue: https://github.com/Tencent/tdesign-vue-next/issues/6798
  it('supports aliased fields containing bigint zero', () => {
    const data = [{ id: 1n, nodes: [{ id: 0n }] }];
    expect(findParentValues(data, { id: 0n }, 'id', 'nodes')).toEqual([1n]);
  });
});
