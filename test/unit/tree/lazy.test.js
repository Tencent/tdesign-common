import { describe, it, expect } from 'vitest';
import TreeStore from '../../../js/tree/tree-store';
import { delay } from './kit';

const lazyLoad = async (tree, value) => {
  const promise = new Promise((resolve) => {
    tree.emitter.on('load', resolve);
  });
  tree.getNode(value).setExpanded(true, {
    directly: true,
  });
  await promise;
  // promise 触发后，还要再等一个 reflow 事件
  await delay(0);
};

// 节点延迟加载
describe('tree:lazy', () => {
  describe('treeStore:lazy', () => {
    it('lazy 属性为 true 时，延迟加载节点', async () => {
      const tree = new TreeStore({
        lazy: true,
        async load() {
          await delay(0);
          return [{
            value: 't1.1',
          }];
        },
      });
      tree.append([{
        value: 't1',
        children: true,
      }]);
      await delay(0);

      let nodes = tree.getNodes();
      expect(nodes.length).toBe(1);

      await lazyLoad(tree, 't1');

      nodes = tree.getNodes();
      expect(nodes.length).toBe(2);
      expect(nodes[1].value).toBe('t1.1');
    });

    it('延迟加载的节点，选中属性自动生效', async () => {
      const tree = new TreeStore({
        checkable: true,
        lazy: true,
        async load() {
          await delay(0);
          return [{
            value: 't1.1',
          }];
        },
      });
      tree.append([{
        value: 't1',
        children: true,
      }]);
      tree.getNode('t1').setChecked('t1', {
        directly: true,
      });
      await delay(0);

      let nodes = tree.getNodes();
      expect(nodes.length).toBe(1);

      await lazyLoad(tree, 't1');

      nodes = tree.getNodes();
      expect(nodes.length).toBe(2);
      expect(nodes[1].value).toBe('t1.1');
      expect(tree.getNode('t1').checked).toBe(true);
      expect(tree.getNode('t1.1').isChecked()).toBe(true);
      expect(tree.getNode('t1.1').checked).toBe(true);
    });
  });

  describe('treeStore:valueMode', () => {
    it('valueMode 默认为 onlyLeaf 时，子节点未加载的情况下，无法选中父节点', async () => {
      const tree = new TreeStore({
        checkable: true,
        lazy: true,
        async load() {
          await delay(0);
          return [{
            value: 't1.1'
          }];
        }
      });
      tree.append([{
        value: 't1',
        children: true,
      }]);

      const t1 = tree.getNode('t1');
      t1.setChecked('t1', {
        directly: true,
      });
      await delay(0);

      expect(tree.getNodes().length).toBe(1);
      expect(tree.getChecked().length).toBe(0);
      expect(t1.checked).toBe(false);
    });

    it('valueMode 默认为 onlyLeaf 时，子节点全部选中的情况下，自动选中父节点', async () => {
      const tree = new TreeStore({
        checkable: true,
        lazy: true,
        async load() {
          await delay(0);
          return [{
            value: 't1.1'
          }, {
            value: 't1.2'
          }];
        }
      });
      tree.append([{
        value: 't1',
        children: true,
      }]);
      const t1 = tree.getNode('t1');

      await lazyLoad(tree, 't1');

      expect(tree.getNodes().length).toBe(3);

      const t1d1 = tree.getNode('t1.1');
      const t1d2 = tree.getNode('t1.2');

      t1d1.setChecked(true, {
        directly: true,
      });
      t1d2.setChecked(true, {
        directly: true,
      });
      expect(tree.getChecked().length).toBe(2);
      expect(t1.checked).toBe(true);
      expect(t1d1.checked).toBe(true);
      expect(t1d2.checked).toBe(true);
    });

    it('valueMode 为 parentFirst', async () => {
      const tree = new TreeStore({
        checkable: true,
        valueMode: 'parentFirst',
        lazy: true,
        async load() {
          await delay(0);
          return [{
            value: 't1.1'
          }, {
            value: 't1.2'
          }];
        }
      });
      tree.append([{
        value: 't1',
        children: true,
      }]);
      const t1 = tree.getNode('t1');
      t1.setChecked(true, {
        directly: true,
      });
      await delay(0);

      expect(tree.getNodes().length).toBe(1);
      expect(tree.getChecked().length).toBe(1);
      expect(t1.checked).toBe(true);

      await lazyLoad(tree, 't1');

      expect(tree.getNodes().length).toBe(3);
      expect(tree.getChecked().length).toBe(1);
      expect(t1.checked).toBe(true);
      expect(tree.getNode('t1.1').checked).toBe(true);
      expect(tree.getNode('t1.2').checked).toBe(true);
    });

    it('valueMode 为 parentFirst 的半选状态', async () => {
      const tree = new TreeStore({
        checkable: true,
        valueMode: 'parentFirst',
        lazy: true,
        async load(node) {
          await delay(0);
          if (node.value === 't1') {
            return [{
              value: 't1.1',
              children: true,
            }];
          }
          if (node.value === 't1.1') {
            return [{
              value: 't1.1.1',
            }, {
              value: 't1.1.2'
            }];
          }
          return [];
        }
      });
      tree.append([{
        value: 't1',
        children: true,
      }]);

      // 展开 t1
      await lazyLoad(tree, 't1');

      expect(tree.getNodes().length).toBe(2);

      // 展开 t1.1
      await lazyLoad(tree, 't1.1');

      expect(tree.getNodes().length).toBe(4);

      tree.getNode('t1.1.1').setChecked(true, {
        directly: true,
      });

      expect(tree.getChecked().length).toBe(1);

      expect(tree.getNode('t1').checked).toBe(false);
      expect(tree.getNode('t1').indeterminate).toBe(true);

      expect(tree.getNode('t1.1').checked).toBe(false);
      expect(tree.getNode('t1.1').indeterminate).toBe(true);

      expect(tree.getNode('t1.1.1').checked).toBe(true);
      expect(tree.getNode('t1.1.2').checked).toBe(false);
    });

    it('valueMode 为 all', async () => {
      const tree = new TreeStore({
        checkable: true,
        valueMode: 'all',
        lazy: true,
        async load() {
          await delay(0);
          return [{
            value: 't1.1'
          }, {
            value: 't1.2'
          }];
        }
      });
      tree.append([{
        value: 't1',
        children: true,
      }]);

      const t1 = tree.getNode('t1');
      t1.setChecked(true, {
        directly: true,
      });
      await delay(0);

      expect(tree.getNodes().length).toBe(1);
      expect(tree.getChecked().length).toBe(1);
      expect(t1.checked).toBe(true);

      await lazyLoad(tree, 't1');

      expect(tree.getNodes().length).toBe(3);
      expect(tree.getChecked().length).toBe(3);
      expect(t1.checked).toBe(true);
      expect(tree.getNode('t1.1').checked).toBe(true);
      expect(tree.getNode('t1.2').checked).toBe(true);
    });

    it('valueMode 为 all 的半选状态', async () => {
      const tree = new TreeStore({
        checkable: true,
        valueMode: 'all',
        lazy: true,
        async load(node) {
          await delay(0);
          if (node.value === 't1') {
            return [{
              value: 't1.1',
              children: true,
            }];
          }
          if (node.value === 't1.1') {
            return [{
              value: 't1.1.1',
            }, {
              value: 't1.1.2'
            }];
          }
          return [];
        }
      });
      tree.append([{
        value: 't1',
        children: true,
      }]);

      // 展开 t1
      await lazyLoad(tree, 't1');

      expect(tree.getNodes().length).toBe(2);

      // 展开 t1.1
      await lazyLoad(tree, 't1.1');

      expect(tree.getNodes().length).toBe(4);

      tree.getNode('t1.1.1').setChecked(true, {
        directly: true,
      });

      expect(tree.getChecked().length).toBe(1);

      expect(tree.getNode('t1').checked).toBe(false);
      expect(tree.getNode('t1').indeterminate).toBe(true);

      expect(tree.getNode('t1.1').checked).toBe(false);
      expect(tree.getNode('t1.1').indeterminate).toBe(true);

      expect(tree.getNode('t1.1.1').checked).toBe(true);
      expect(tree.getNode('t1.1.2').checked).toBe(false);
    });
  });
});
