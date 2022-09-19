import difference from 'lodash/difference';
import camelCase from 'lodash/camelCase';
import isPlainObject from 'lodash/isPlainObject';
import mitt from 'mitt';

import { TreeNode } from './tree-node';
import {
  TreeNodeValue,
  TypeIdMap,
  TypeTimer,
  TypeTargetNode,
  TypeTreeNodeData,
  TypeTreeItem,
  TypeTreeStoreOptions,
  TypeTreeFilter,
  TypeTreeFilterOptions,
  TypeRelatedNodesOptions,
  TypeTreeEventState,
  TypeTreeNodeModel,
} from './types';

// 构建一个树的数据模型
// 基本设计思想：写入时更新，减少读取消耗，以减少未来实现虚拟滚动所需的计算量
// 任何一次数据写入，会触发相应节点的状态更新
export class TreeStore {
  // 根节点集合
  public children: TreeNode[];

  // 所有节点集合
  public nodes: TreeNode[];

  // 所有节点映射
  public nodeMap: Map<TreeNodeValue, TreeNode>;

  // 配置选项
  public config: TypeTreeStoreOptions;

  // 活动节点集合
  public activedMap: TypeIdMap;

  // 数据被更新的节点集合
  public updatedMap: TypeIdMap;

  // 选中节点集合
  public checkedMap: TypeIdMap;

  // 展开节点的集合
  public expandedMap: TypeIdMap;

  // 符合过滤条件的节点的集合
  public filterMap: TypeIdMap;

  // 数据更新计时器
  public updateTimer: TypeTimer;

  // 识别是否需要重排
  public shouldReflow: boolean;

  // 树节点过滤器
  public prevFilter: TypeTreeFilter;

  // 一个空节点 model
  public nullNodeModel: TypeTreeNodeModel;

  // 事件派发器
  public emitter: ReturnType<typeof mitt>;

  public constructor(options: TypeTreeStoreOptions) {
    const config: TypeTreeStoreOptions = {
      prefix: 't',
      keys: {},
      expandAll: false,
      expandLevel: 0,
      expandMutex: false,
      expandParent: false,
      activable: false,
      activeMultiple: false,
      checkable: false,
      checkStrictly: false,
      disabled: false,
      draggable: false,
      load: null,
      lazy: false,
      valueMode: 'onlyLeaf',
      filter: null,
      onLoad: null,
      onReflow: null,
      onUpdate: null,
      allowFoldNodeOnFilter: false,
      ...options,
    };
    this.config = config;
    this.nodes = [];
    this.children = [];
    this.nodeMap = new Map();
    this.activedMap = new Map();
    this.expandedMap = new Map();
    this.checkedMap = new Map();
    this.updatedMap = new Map();
    this.filterMap = new Map();
    this.prevFilter = null;
    // 这个计时器确保频繁的 update 事件被归纳为1次完整数据更新后的触发
    this.updateTimer = null;
    // 在子节点增删改查时，将此属性设置为 true，来触发视图更新
    this.shouldReflow = false;
    this.emitter = mitt();
    this.initNullNodeModel();
  }

  // 初始化空节点 model
  public initNullNodeModel() {
    // 空节点，用于判定当前的 filterText 是否为空，如果 filter(nullNode) 为 true, 那么可以判定 filterText 为空
    // 这里初始化空节点的方式似乎不是很完美
    const nullNode = new TreeNode(this, { value: '', label: '', children: [] });
    this.nullNodeModel = nullNode.getModel();
    // 需要将节点从树中移除
    nullNode.remove();
  }

  // 配置选项
  public setConfig(options: TypeTreeStoreOptions) {
    let hasChanged = false;
    Object.keys(options).forEach((key) => {
      const val = options[key];
      if (val !== this.config[key]) {
        hasChanged = true;
        this.config[key] = val;
      }
    });
    if (hasChanged) {
      // 在 td-tree 的 render 方法中调用 setConfig
      // 这样减少了 watch 属性
      // 仅在属性变更后刷新状态
      // 这样可以避免触发渲染死循环
      this.refreshState();
    }
  }

  // 获取根孩子节点列表
  public getChildren() {
    return this.children;
  }

  // 获取节点对象
  public getNode(item: TypeTargetNode): TreeNode {
    let node = null;
    if (typeof item === 'string' || typeof item === 'number') {
      node = this.nodeMap.get(item);
    } else if (item instanceof TreeNode) {
      node = this.nodeMap.get(item.value);
    }
    return node;
  }

  // 获取节点在总节点列表中的位置
  public getIndex(node: TreeNode): number {
    return this.nodes.indexOf(node);
  }

  // 获取指定节点的父节点
  public getParent(value: TypeTargetNode): TreeNode {
    let parent = null;
    const node = this.getNode(value);
    if (node) {
      parent = node.getParent();
    }
    return parent;
  }

  // 获取指定节点的所有父节点
  public getParents(value: TypeTargetNode): TreeNode[] {
    const node = this.getNode(value);
    let parents: TreeNode[] = [];
    if (node) {
      parents = node.getParents();
    }
    return parents;
  }

  // 获取指定节点在其所在 children 中的位置
  public getNodeIndex(value: TypeTargetNode): number {
    const node = this.getNode(value);
    let index = -1;
    if (node) {
      index = node.getIndex();
    }
    return index;
  }

  // 获取所有符合条件的节点
  public getNodes(
    item?: TypeTargetNode,
    options?: TypeTreeFilterOptions,
  ): TreeNode[] {
    let nodes: TreeNode[] = [];
    let val: TreeNodeValue = '';
    if (typeof item === 'string' || typeof item === 'number') {
      val = item;
    } else if (item instanceof TreeNode) {
      val = item.value;
    }
    if (!val) {
      nodes = this.nodes.slice(0);
    } else {
      const node = this.getNode(val);
      if (node) {
        nodes = node.walk();
      }
    }

    if (options) {
      const conf: TypeTreeFilterOptions = {
        filter: null,
        level: Infinity,
        ...options,
      };
      if (typeof conf.level === 'number' && conf.level !== Infinity) {
        nodes = nodes.filter((node) => node.level <= conf.level);
      }
      if (typeof conf.filter === 'function') {
        nodes = nodes.filter((node) => {
          const nodeModel = node.getModel();
          return conf.filter(nodeModel);
        });
      }
      if (isPlainObject(conf.props)) {
        nodes = nodes.filter((node) => {
          const result = Object.keys(conf.props).every((key) => {
            const propEqual = node[key] === conf.props[key];
            return propEqual;
          });
          return result;
        });
      }
    }
    return nodes;
  }

  // 给树添加节点数据
  public append(list: TypeTreeNodeData[]): void {
    list.forEach((item) => {
      const node = new TreeNode(this, item);
      this.children.push(node);
    });
    this.reflow();
  }

  // 重新加载数据
  public reload(list: TypeTreeNodeData[]): void {
    this.expandedMap.clear();
    this.checkedMap.clear();
    this.activedMap.clear();
    this.filterMap.clear();
    this.removeAll();
    this.append(list);
  }

  // 解析节点数据，适配多种节点类型
  public parseNodeData(
    para: TreeNodeValue | TreeNode | TypeTreeNodeData,
    item: TypeTreeNodeData | TypeTreeNodeData[] | TreeNode,
  ) {
    let value: TreeNodeValue = '';
    let node = null;
    let data = null;

    if (typeof para === 'string' || typeof para === 'number') {
      value = para;
      data = item;
      node = this.getNode(value);
    } else if (para instanceof TreeNode) {
      node = para;
      data = item;
    } else {
      data = para;
    }
    const spec = {
      node,
      data,
    };
    return spec;
  }

  /**
   * 向指定节点追加节点或者数据
   * 支持下列使用方式
   * item: 节点数据, TreeNode: 节点实例, value: 节点值(ID)
   * appendNodes(item)
   * appendNodes(TreeNode)
   * appendNodes(value, item)
   * appendNodes(value, TreeNode)
   * appendNodes(TreeNode, item)
   * appendNodes(TreeNode, TreeNode)
   */
  public appendNodes(
    para?: TypeTargetNode | TypeTreeNodeData,
    item?: TypeTreeNodeData | TreeNode,
  ): void {
    const spec = this.parseNodeData(para, item);
    if (spec.data) {
      if (!spec.node) {
        // 在根节点插入
        if (spec.data instanceof TreeNode) {
          spec.data.appendTo(this);
        } else if (Array.isArray(spec.data)) {
          this.append(spec.data);
        } else {
          this.append([spec.data]);
        }
      } else {
        // 插入到目标节点之下
        if (spec.data instanceof TreeNode) {
          spec.data.appendTo(this, spec.node);
        } else if (Array.isArray(spec.data)) {
          spec.node.append(spec.data);
        } else {
          spec.node.append([spec.data]);
        }
        spec.node.updateRelated();
      }
    }
  }

  // 在目标节点之前插入节点
  public insertBefore(value: TypeTargetNode, item: TypeTreeItem): void {
    const node = this.getNode(value);
    if (node) {
      node.insertBefore(item);
    }
  }

  // 在目标节点之后插入节点
  public insertAfter(value: TypeTargetNode, item: TypeTreeItem): void {
    const node = this.getNode(value);
    if (node) {
      node.insertAfter(item);
    }
  }

  // 更新树结构
  // 清空 nodes 数组，然后遍历所有根节点重新插入 node
  public refreshNodes(): void {
    const { children, nodes } = this;
    nodes.length = 0;
    children.forEach((node) => {
      const list = node.walk();
      Array.prototype.push.apply(nodes, list);
    });
  }

  // 更新所有树节点状态
  public refreshState(): void {
    const { nodes } = this;
    nodes.forEach((node) => {
      node.update();
      node.updateChecked();
    });
  }

  // 节点重排
  // 应该仅在树节点增删改查时调用
  public reflow(node?: TreeNode): void {
    this.shouldReflow = true;
    this.updated(node);
  }

  // 触发更新事件
  // 节点属性变更时调用
  public updated(node?: TreeNode): void {
    if (node?.value) {
      this.updatedMap.set(node.value, true);
    }
    if (this.updateTimer) return;
    this.updateTimer = +setTimeout(() => {
      clearTimeout(this.updateTimer);
      this.updateTimer = null;

      // 检查节点是否需要回流，重排数组
      if (this.shouldReflow) {
        this.refreshNodes();
        this.emit('reflow');
      }

      // 检查节点是否有被过滤，锁定路径节点
      // 在此之前要遍历节点生成一个经过排序的节点数组
      // 以便于优化锁定检查算法
      if (!this.config?.allowFoldNodeOnFilter) this.lockFilterPathNodes();

      const updatedList = Array.from(this.updatedMap.keys());
      if (updatedList.length > 0) {
        // 统计需要更新状态的节点，派发更新事件
        const updatedNodes = updatedList.map((value) => this.getNode(value));
        this.emit('update', {
          nodes: updatedNodes,
          map: this.updatedMap,
        });
      } else if (this.shouldReflow) {
        // 单纯的回流不需要更新节点状态
        // 但需要触发更新事件
        this.emit('update', {
          nodes: [],
          map: this.updatedMap,
        });
      }

      // 每次回流检查完毕，还原检查状态
      this.shouldReflow = false;
      this.updatedMap.clear();
    });
  }

  // 获取激活节点集合
  public getActived(map?: TypeIdMap): TreeNodeValue[] {
    const activedMap = map || this.activedMap;
    return Array.from(activedMap.keys());
  }

  // 获取指定范围的高亮节点
  public getActivedNodes(item?: TypeTargetNode): TreeNode[] {
    let nodes = this.getNodes(item);
    nodes = nodes.filter((node) => node.isActived());
    return nodes;
  }

  // 替换激活态
  public replaceActived(list: TreeNodeValue[]): void {
    this.resetActived();
    this.setActived(list);
  }

  // 设置激活态
  public setActived(actived: TreeNodeValue[]): void {
    const { activeMultiple } = this.config;
    const list = actived.slice(0);
    if (!activeMultiple) {
      list.length = 1;
    }
    list.forEach((val) => {
      this.activedMap.set(val, true);
      const node = this.getNode(val);
      if (node) {
        node.update();
      }
    });
  }

  // 重置激活态
  public resetActived(): void {
    const actived = this.getActived();
    this.activedMap.clear();
    const relatedNodes = this.getRelatedNodes(actived);
    relatedNodes.forEach((node) => {
      node.update();
    });
  }

  // 获取展开节点集合
  public getExpanded(map?: TypeIdMap): TreeNodeValue[] {
    const expandedMap = map || this.expandedMap;
    return Array.from(expandedMap.keys());
  }

  // 替换展开节点
  public replaceExpanded(list: TreeNodeValue[]): void {
    const expanded = this.getExpanded();
    const added = difference(list, expanded);
    const removed = difference(expanded, list);
    this.setExpandedDirectly(removed, false);
    this.updateExpanded(removed);
    this.setExpanded(added);
  }

  // 批量设置展开节点
  public setExpanded(list: TreeNodeValue[]): void {
    this.setExpandedDirectly(list);
    this.updateExpanded(list);
  }

  // 直接设置展开节点数据，不更新节点状态
  public setExpandedDirectly(list: TreeNodeValue[], expanded = true): void {
    list.forEach((val) => {
      if (expanded) {
        this.expandedMap.set(val, true);
        const node = this.getNode(val);
        if (node) {
          node.afterExpanded();
        }
      } else {
        this.expandedMap.delete(val);
      }
    });
  }

  // 清除所有展开节点
  public resetExpanded(): void {
    const expanded = this.getExpanded();
    this.expandedMap.clear();
    this.updateExpanded(expanded);
  }

  // 更新展开节点相关节点的状态
  public updateExpanded(list: TreeNodeValue[]): void {
    const relatedNodes = this.getRelatedNodes(list, {
      withParents: false,
    });
    relatedNodes.forEach((node) => {
      node.update();
    });
  }

  // 获取选中态节点 value 数组
  public getChecked(map?: TypeIdMap): TreeNodeValue[] {
    const { nodes, config } = this;
    const { valueMode, checkStrictly } = config;
    const list: TreeNodeValue[] = [];
    const checkedMap = map || this.checkedMap;
    nodes.forEach((node) => {
      if (node.isChecked(checkedMap)) {
        if (valueMode === 'parentFirst' && !checkStrictly) {
          if (!node.parent || !node.parent.isChecked(checkedMap)) {
            list.push(node.value);
          }
        } else if (valueMode === 'onlyLeaf' && !checkStrictly) {
          if (node.isLeaf()) {
            list.push(node.value);
          }
        } else {
          list.push(node.value);
        }
      }
    });
    return list;
  }

  // 获取指定节点下的选中节点
  public getCheckedNodes(item?: TypeTargetNode): TreeNode[] {
    let nodes = this.getNodes(item);
    nodes = nodes.filter((node) => node.isChecked());
    return nodes;
  }

  // 替换选中态列表
  public replaceChecked(list: TreeNodeValue[]): void {
    this.resetChecked();
    this.setChecked(list, true);
  }

  // 批量设置选中态
  public setChecked(list: TreeNodeValue[], isFromValueChange?: boolean): void {
    const { valueMode, checkStrictly, checkable } = this.config;
    if (!checkable) return;
    list.forEach((val: TreeNodeValue) => {
      const node = this.getNode(val);
      if (node) {
        if (valueMode === 'parentFirst' && !checkStrictly) {
          const childrenNodes = node.walk();
          childrenNodes.forEach((childNode) => {
            this.checkedMap.set(childNode.value, true);
          });
        } else {
          this.checkedMap.set(val, true);
          node.updateChecked(isFromValueChange);
        }
      }
    });
    if (!checkStrictly) {
      const checked = this.getChecked();
      const relatedNodes = this.getRelatedNodes(checked);
      relatedNodes.forEach((node) => {
        node.updateChecked();
      });
    }
  }

  // 清除所有选中节点
  public resetChecked(): void {
    const checked = this.getChecked();
    const relatedNodes = this.getRelatedNodes(checked);
    this.checkedMap.clear();
    relatedNodes.forEach((node) => {
      node.updateChecked();
    });
  }

  // 更新全部节点状态
  public updateAll(): void {
    const nodes = this.getNodes();
    nodes.forEach((node) => {
      node.update();
    });
  }

  // 移除指定节点
  public remove(value?: TypeTargetNode): void {
    const node = this.getNode(value);
    if (node) {
      node.remove();
    }
  }

  // 清空所有节点
  public removeAll(): void {
    const nodes = this.getNodes();
    nodes.forEach((node) => {
      node.remove();
    });
  }

  // 获取节点状态变化可能影响的周边节点
  // 实现最小遍历集合
  public getRelatedNodes(
    list: TreeNodeValue[],
    options?: TypeRelatedNodesOptions,
  ): TreeNode[] {
    const conf = {
      withParents: true,
      ...options,
    };
    const map = new Map();
    list.forEach((value) => {
      if (map.get(value)) return;
      const node = this.getNode(value);
      if (node) {
        const parents = node.getParents();
        const children = node.walk();
        let related = [];
        if (conf.withParents) {
          related = parents.concat(children);
        } else {
          related = children;
        }
        related.forEach((relatedNode) => {
          map.set(relatedNode.value, relatedNode);
        });
      }
    });
    const relatedNodes = Array.from(map.values());
    return relatedNodes;
  }

  // 触发绑定的事件
  public emit(name: string, state?: TypeTreeEventState): void {
    const { config, emitter } = this;
    const methodName = camelCase(`on-${name}`);
    const method = config[methodName];
    if (typeof method === 'function') {
      method(state);
    }
    emitter.emit(name, state);
  }

  // 锁定过滤节点的路径节点
  // 使得路径节点展开，可见，且不可操作
  public lockFilterPathNodes() {
    const { config } = this;
    const allNodes = this.getNodes();

    // 如果之前有进行过滤，则先解锁所有节点
    if (this.prevFilter) {
      allNodes.forEach((node: TreeNode) => {
        node.lock(false);
      });
    }

    const currentFilter = config.filter;
    // 当前没有过滤器
    // 则无需处理锁定节点
    if (!currentFilter || typeof currentFilter !== 'function') return;

    if (currentFilter(this.nullNodeModel)) return;

    this.prevFilter = config.filter;
    // 构造路径节点map
    const map = new Map();

    // 全部节点要经过排序，才能使用这个算法
    // 比起每个过滤节点调用 getParents 方法检查父节点状态
    // 算法复杂度 O(N*log(N)) => O(N)
    allNodes.reverse().forEach((item: TreeNode) => {
      const node = item;

      // 被过滤节点父节点固定为展开状态
      const parent = node.getParent();
      if (node.vmIsRest) {
        if (parent) {
          // 被过滤节点的父节点固定为展开状态
          parent.expanded = true;
        }
        // 被过滤节点固定为展示状态
        node.visible = true;
      }
      if (node.vmIsRest || map.get(node.value)) {
        if (parent && !parent.vmIsRest) {
          map.set(parent.value, true);
        }
      }
    });

    // 锁定路径节点展示样式
    const filterPathValues = Array.from(map.keys());
    filterPathValues.forEach((value: TreeNodeValue) => {
      const node = this.getNode(value);
      if (node) {
        node.lock(true);
      }
    });
  }
}

export default TreeStore;
