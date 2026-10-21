import { describe, it, expect, vi } from 'vitest';
import TreeStore from '../../../js/tree/tree-store';
import { delay } from './kit';

// 允许不同层级存在重复 value
describe('tree:allowDuplicateValue', () => {
  const duplicateData = () => [
    {
      value: '1',
      children: [
        {
          value: '2',
          children: [
            {
              value: '3',
            },
          ],
        },
        {
          value: '3',
        },
      ],
    },
    {
      value: '2',
    },
  ];

  it('未开启时，重复 value 的节点相互覆盖', async () => {
    const tree = new TreeStore({});
    tree.append(duplicateData());
    await delay(0);
    // nodeMap 以 value 为 key，后创建的节点覆盖先创建的节点
    expect(
      tree
        .getNode('3')
        .getPath()
        .map((node) => node.value)
    ).toEqual(['1', '3']);
    expect(
      tree
        .getNode('2')
        .getPath()
        .map((node) => node.value)
    ).toEqual(['2']);
  });

  it('开启后，不同层级的相同 value 均可被记录', async () => {
    const tree = new TreeStore({
      allowDuplicateValue: true,
    });
    tree.append(duplicateData());
    await delay(0);
    // 路径数组可以唯一定位节点
    const node123 = tree.getNode(['1', '2', '3']);
    const node13 = tree.getNode(['1', '3']);
    const root2 = tree.getNode(['2']);
    expect(node123.value).toBe('3');
    expect(node13.value).toBe('3');
    expect(node123).not.toBe(node13);
    expect(root2.value).toBe('2');
    // 全部节点均被收录
    expect(tree.nodes.length).toBe(5);
  });

  it('开启后，getNode 支持节点实例获取', async () => {
    const tree = new TreeStore({
      allowDuplicateValue: true,
    });
    tree.append(duplicateData());
    await delay(0);
    const node123 = tree.getNode(['1', '2', '3']);
    expect(tree.getNode(node123)).toBe(node123);
  });

  it('开启后，选中态按路径 key 取值', async () => {
    const tree = new TreeStore({
      allowDuplicateValue: true,
      checkable: true,
      valueMode: 'onlyLeaf',
    });
    tree.append(duplicateData());
    await delay(0);

    const node123 = tree.getNode(['1', '2', '3']);
    node123.setChecked(true, { directly: true });
    await delay(0);

    expect(node123.isChecked()).toBe(true);
    // 另一个同 value 的节点不受影响
    const node13 = tree.getNode(['1', '3']);
    expect(node13.isChecked()).toBe(false);
    // 父节点全选，根节点处于半选状态
    expect(tree.getNode(['1', '2']).isChecked()).toBe(true);
    expect(tree.getNode(['1']).isIndeterminate()).toBe(true);

    const checked = tree.getChecked();
    expect(checked).toEqual(['1/2/3']);
    tree.setChecked(['1/2/3']);
    await delay(0);
    expect(node123.isChecked()).toBe(true);

    node123.setChecked(false, { directly: true });
    await delay(0);
    expect(tree.getChecked()).toEqual([]);
  });

  it('开启后，激活态与展开态按路径 key 管理', async () => {
    const tree = new TreeStore({
      allowDuplicateValue: true,
      activable: true,
      expandLevel: 2,
    });
    tree.append(duplicateData());
    await delay(0);

    const node123 = tree.getNode(['1', '2', '3']);
    const node13 = tree.getNode(['1', '3']);

    node123.setActived(true, { directly: true });
    await delay(0);
    expect(node123.isActived()).toBe(true);
    expect(node13.isActived()).toBe(false);
    expect(tree.getActived()).toEqual(['1/2/3']);

    // 根节点 '2' 与节点 '1/2' 的展开状态互不干扰
    const node12 = tree.getNode(['1', '2']);
    expect(node12.isExpanded()).toBe(true);
    node12.setExpanded(false, { directly: true });
    await delay(0);
    expect(node12.isExpanded()).toBe(false);
    expect(tree.getNode(['2']).isExpanded()).toBe(false);
  });

  it('开启后，同级出现重复 value 时告警', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const tree = new TreeStore({
      allowDuplicateValue: true,
    });
    tree.append([
      {
        value: '1',
        children: [
          {
            value: 'a',
          },
          {
            value: 'a',
          },
        ],
      },
    ]);
    await delay(0);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('开启后，remove 仅移除路径对应的节点', async () => {
    const tree = new TreeStore({
      allowDuplicateValue: true,
    });
    tree.append(duplicateData());
    await delay(0);

    const node123 = tree.getNode(['1', '2', '3']);
    node123.remove();
    await delay(0);

    expect(tree.getNode(['1', '2', '3'])).toBe(null);
    // 其它同 value 节点保留
    expect(tree.getNode(['1', '3'])).not.toBe(null);
    expect(tree.nodes.length).toBe(4);
  });

  it('开启后，数值 value 的路径 key 与 getNode 一致', async () => {
    const tree = new TreeStore({ allowDuplicateValue: true });
    tree.append([{ value: 1, children: [{ value: 2, children: [{ value: 2 }] }] }] as any);
    await delay(0);
    expect(tree.getNode([1, 2, 2]).value).toBe(2);
    expect(tree.getNode([1, 2]).value).toBe(2);
    expect(tree.getNode([1, 2])).not.toBe(tree.getNode([1, 2, 2]));
  });

  it('开启后，数值 value 支持直接查找与状态设置', async () => {
    const tree = new TreeStore({
      allowDuplicateValue: true,
      activable: true,
      checkable: true,
      valueMode: 'onlyLeaf',
    });
    tree.append([{ value: 1, children: [{ value: 2, children: [{ value: 2 }] }] }] as any);
    await delay(0);

    // 数值 value 归一化为字符串路径 key 后可被查找
    expect(tree.getNode(1).value).toBe(1);
    expect(tree.getNode([1, 2]).value).toBe(2);

    // 激活态与展开态支持数值 value 设置
    tree.setActived([1]);
    await delay(0);
    expect(tree.getNode(1).isActived()).toBe(true);

    tree.setExpanded([1]);
    await delay(0);
    expect(tree.getNode(1).isExpanded()).toBe(true);

    // 选中态支持数值 value 设置，取值仍为路径 key
    tree.setChecked([1]);
    await delay(0);
    expect(tree.getChecked()).toEqual(['1/2/2']);

    // replaceExpanded 中数值 value 与字符串路径 key 视为同一节点
    tree.replaceExpanded([1]);
    await delay(0);
    expect(tree.getNode(1).isExpanded()).toBe(true);
  });

  it('开启后，移动节点子树时路径 key 正确迁移', async () => {
    const tree = new TreeStore({ allowDuplicateValue: true });
    tree.append([
      { value: 'a', children: [{ value: 'b', children: [{ value: 'x' }] }] },
      { value: 'c', children: [{ value: 'd' }] },
    ]);
    await delay(0);
    // 把 b 子树移动到 c 下
    tree.getNode(['a', 'b']).appendTo(tree, tree.getNode(['c']));
    await delay(0);
    // 旧 key 查不到，新 key 可查到，后代节点一起迁移
    expect(tree.getNode(['a', 'b'])).toBe(null);
    expect(tree.getNode(['c', 'b']).value).toBe('b');
    expect(tree.getNode(['c', 'b', 'x']).value).toBe('x');
    expect(tree.getNode(['a']).value).toBe('a');
    expect(tree.nodes.length).toBe(5);
  });

  it('开启后，valueMode all 时父节点也按路径 key 取值', async () => {
    const tree = new TreeStore({ allowDuplicateValue: true, checkable: true, valueMode: 'all' });
    tree.append([{ value: 'p', children: [{ value: 'c1' }, { value: 'c2' }] }]);
    await delay(0);
    tree.setChecked(['p']);
    await delay(0);
    expect(tree.getChecked().sort()).toEqual(['p', 'p/c1', 'p/c2'].sort());
  });

  it('开启后，同级同 value 仍然共享 key（与 tree-v1 语义一致）', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const tree = new TreeStore({ allowDuplicateValue: true });
    tree.append([{ value: 'p', children: [{ value: 'c' }, { value: 'c' }] }]);
    await delay(0);
    // 路径 key 仅区分不同层级，同级同 value 后者覆盖前者，但有告警
    expect(tree.getNode(['p', 'c']).value).toBe('c');
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('开启后，过滤场景下命中节点与锁定路径节点正常', async () => {
    const tree = new TreeStore({
      allowDuplicateValue: true,
      filter: (node) => node.value === 'x',
    });
    tree.append([{ value: 'r', children: [{ value: 'x' }, { value: 'y', children: [{ value: 'x' }] }] }]);
    await delay(0);
    expect(tree.getNode(['r', 'x']).vmIsRest).toBe(true);
    expect(tree.getNode(['r', 'y', 'x']).vmIsRest).toBe(true);
    expect(tree.getNode(['r', 'y']).vmIsLocked).toBe(true);
  });

  it('开启后，setConfig 切换配置会重建路径 key', async () => {
    const tree = new TreeStore({ checkable: true });
    tree.append([{ value: '1', children: [{ value: '2' }] }, { value: '2' }]);
    await delay(0);

    tree.getNode('2').setChecked(true, { directly: true });
    tree.setConfig({ allowDuplicateValue: true });
    await delay(0);

    expect(tree.getNode(['1', '2'])).not.toBe(null);
    expect(tree.getNode(['2'])).not.toBe(null);
    expect(tree.getNode(['2']).isChecked()).toBe(true);

    tree.setConfig({ allowDuplicateValue: false });
    await delay(0);
    expect(tree.getNode('2')).not.toBe(null);
  });

  it('开启后，getNodes 使用 TreeNode 实例定位重复 value 子树', async () => {
    const tree = new TreeStore({ allowDuplicateValue: true });
    tree.append(duplicateData());
    await delay(0);

    const node123 = tree.getNode(['1', '2', '3']);
    expect(tree.getNodes(node123)).toEqual([node123]);
    expect(tree.getCheckedNodes(node123)).toEqual([]);
  });

  it('开启后，节点模型支持按路径删除重复 value 节点', async () => {
    const tree = new TreeStore({ allowDuplicateValue: true });
    tree.append(duplicateData());
    await delay(0);

    const root1 = tree.getNode(['1']);
    root1.getModel().remove(['1', '2', '3']);
    await delay(0);

    expect(tree.getNode(['1', '2', '3'])).toBe(null);
    expect(tree.getNode(['1', '3'])).not.toBe(null);
  });
});
