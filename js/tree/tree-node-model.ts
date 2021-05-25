import {
  TypeTreeNodeModel,
  TypeTreeNodeData,
  TypeTreeItem,
} from './types';
import { TreeNode } from './tree-node';

// 获取节点需要暴露的属性
function getExposedProps(node: TreeNode) {
  const {
    value,
    label,
    dataset,
    actived,
    expanded,
    checked,
    indeterminate,
    loading,
  } = node;

  return {
    value,
    label,
    data: dataset,
    actived,
    expanded,
    checked,
    indeterminate,
    loading,
  };
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
      return nodes.map((node: TreeNode) => node.getModel());
    },

    // 获取单个父节点数据
    getParent(): TypeTreeNodeModel {
      return node.parent?.getModel();
    },

    // 获取所有父节点数据
    getParents(): TypeTreeNodeModel[] {
      const nodes = node.getParents();
      return nodes.map((node: TreeNode) => node.getModel());
    },

    // 获取根节点
    getRoot(): TypeTreeNodeModel {
      const root = node.getRoot();
      return root?.getModel();
    },

    // 获取兄弟节点，包含自己在内
    getSiblings(): TypeTreeNodeModel[] {
      const nodes = node.getSiblings();
      return nodes.map((node: TreeNode) => node.getModel());
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
            childrenModel = nodes.map(node => node.getModel());
          } else {
            childrenModel = children.map(node => node.getModel());
          }
        } else {
          childrenModel = false;
        }
      } else if (typeof children === 'boolean') {
        childrenModel = children;
      }
      return childrenModel;
    },
  };
  return model;
}

// 更新封装对象
export function updateNodeModel(node: TreeNode, model: TypeTreeNodeModel) {
  // 同步节点属性
  const props = getExposedProps(node);
  Object.assign(model, props);
}
