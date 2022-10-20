import pick from 'lodash/pick';
import omit from 'lodash/omit';
import { TreeNode } from './tree-node';
import { OptionData } from '../common';
import {
  TreeNodeValue,
  TypeTreeNodeModel,
  TypeTreeNodeData,
  TypeTreeItem,
  TreeNodeModelProps,
} from './types';
import log from '../log/log';

// 获取节点需要暴露的属性
function getExposedProps(node: TreeNode): TreeNodeModelProps {
  const props = pick(node, [
    'value',
    'label',
    'data',
    'actived',
    'expanded',
    'checked',
    'indeterminate',
    'loading',
  ]) as TreeNodeModelProps;
  return props;
}

// 封装对外暴露的对象
export function createNodeModel(node: TreeNode): TypeTreeNodeModel {
  const props = getExposedProps(node);

  const model: TypeTreeNodeModel = {
    ...props,

    // 获取节点所处层级
    getLevel() {
      return node.getLevel();
    },

    // 获取节点在 children 中的位置
    getIndex() {
      return node.getIndex();
    },

    // 判断节点是否为 children 中的第一个节点
    isFirst() {
      return node.isFirst();
    },

    // 判断节点是否为 children 中的最后一个节点
    isLast() {
      return node.isLast();
    },

    // 判断节点是否为叶节点
    isLeaf() {
      return node.isLeaf();
    },

    // 插入数据到节点之前
    insertBefore(newData: TypeTreeItem) {
      return node.insertBefore(newData);
    },

    // 插入数据到节点之后
    insertAfter(newData: TypeTreeItem) {
      return node.insertAfter(newData);
    },

    // 给当前节点添加子节点数据
    appendData(data: TypeTreeNodeData | TypeTreeNodeData[]) {
      return node.append(data);
    },

    // 返回路径节点数据集合
    getPath(): TypeTreeNodeModel[] {
      const nodes = node.getPath();
      return nodes.map((item: TreeNode) => item.getModel());
    },

    // 获取单个父节点数据
    getParent(): TypeTreeNodeModel {
      return node.parent?.getModel();
    },

    // 获取所有父节点数据
    getParents(): TypeTreeNodeModel[] {
      const nodes = node.getParents();
      return nodes.map((item: TreeNode) => item.getModel());
    },

    // 获取根节点
    getRoot(): TypeTreeNodeModel {
      const root = node.getRoot();
      return root?.getModel();
    },

    // 获取兄弟节点，包含自己在内
    getSiblings(): TypeTreeNodeModel[] {
      const nodes = node.getSiblings();
      return nodes.map((item: TreeNode) => item.getModel());
    },

    // 返回当前节点的第一层子节点数据集合
    getChildren(deep?: boolean): boolean | TypeTreeNodeModel[] {
      let childrenModel: boolean | TypeTreeNodeModel[] = false;
      const { children } = node;
      if (Array.isArray(children)) {
        if (children.length > 0) {
          if (deep) {
            const nodes = node.walk();
            nodes.shift();
            childrenModel = nodes.map((item) => item.getModel());
          } else {
            childrenModel = children.map((item) => item.getModel());
          }
        } else {
          childrenModel = false;
        }
      } else if (typeof children === 'boolean') {
        childrenModel = children;
      }
      return childrenModel;
    },

    // 删除本节点，或者 value 指定的子节点
    remove(value?: TreeNodeValue) {
      if (!value) {
        node.remove();
        return;
      }

      const { tree } = node;
      const targetNode = tree.getNode(value);
      if (!targetNode) {
        log.warnOnce('Tree', `\`${value}\` is not exist`);
        return;
      }

      const parents = targetNode.getParents();
      const parentValues = parents.map((pnode) => (pnode.value));
      if (parentValues.indexOf(node.value) < 0) {
        log.warnOnce('Tree', `\`${value}\` is not a childNode of current node`);
        return;
      }
      targetNode.remove();
    },

    // 设置本节点携带的元数据
    setData(data: OptionData) {
      // 详细细节可见 https://github.com/Tencent/tdesign-common/issues/655
      const _data = omit(data, ['children', 'value', 'label']);
      const { keys } = node.tree.config;
      const dataValue = data[keys?.value || 'value'];
      const dataLabel = data[keys?.label || 'label'];
      if (dataValue !== undefined) _data.value = dataValue;
      if (dataLabel !== undefined) _data.label = dataLabel;

      Object.assign(node.data, _data);
      Object.assign(node, _data);
    },
  };

  return model;
}

// 更新封装对象
export function updateNodeModel(model: TypeTreeNodeModel, node: TreeNode) {
  // 同步节点属性
  const props = getExposedProps(node);
  Object.assign(model, props);
}
