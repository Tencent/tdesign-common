import get from 'lodash/get';
import uniqueId from 'lodash/uniqueId';
import { TreeStore } from './TreeStore';

const { hasOwnProperty } = Object.prototype;

const defaultStatus: any = {
  expandMutex: false,
  activable: true,
  checkable: false,
  disabled: false,
  draggable: false,
  loading: false,
};

export class TreeNode {
  // 节点隶属的树实例
  tree: TreeStore;
  // 节点 id ，唯一标志
  value: string;
  // 节点文本
  label: string;
  // 节点数据
  dataset: any;
  // 父节点
  parent: TreeNode;
  // 子节点列表
  children: TreeNode[] | boolean;
  // 节点在视图上实际的展开状态
  expanded: boolean;
  // 展开时是否收起同级节点，对子节点生效
  expandMutex: boolean;
  // 节点在视图上实际的激活状态
  actived: boolean;
  // 是否可激活
  activable: boolean;
  // 是否可选中
  checkable: boolean;
  // 节点在视图上实际的选中态
  checked: boolean;
  // 节点实际是否为半选状态
  indeterminate: boolean;
  // 节点是否已禁用
  disabled: boolean;
  // 节点是否可拖动
  draggable: boolean;
  // 节点是否可视
  visible: boolean;
  // 节点在树中的层级
  level: number;
  // 节点是否正在加载数据
  loading: boolean;

  constructor(tree: TreeStore, data?: any, parent?: TreeNode) {
    this.dataset = data;
    this.tree = tree;

    const config = tree.config || {};
    const prefix = config.prefix || 't';
    const keys = get(tree, 'config.keys', {});
    const propChildren = keys.children || 'children';
    const propLabel = keys.label || 'label';
    const propValue = keys.value || 'value';

    const spec = {
      ...defaultStatus,
      activable: config.activable,
      checkable: config.checkable,
      expandMutex: config.expandMutex,
      disabled: config.disabled,
      ...data,
    };
    const children = spec[propChildren];

    this.set(spec);
    this.label = spec[propLabel] || '';
    this.value = spec[propValue] || uniqueId(prefix);
    this.tree.nodeMap.set(this.value, this);

    if (parent && parent instanceof TreeNode) {
      this.parent = parent;
    }

    // 初始化状态计算
    this.level = 0;
    this.visible = true;
    this.actived = false;
    this.expanded = false;
    this.initExpanded();
    this.update();
    tree.reflow(this);

    // 这里的逻辑不能放到状态计算之前
    // 因为子节点状态计算依赖父节点状态
    if (Array.isArray(children)) {
      this.append(children);
    } else if (children === true) {
      this.children = children;
      if (!config.lazy) {
        this.loadChildren();
      }
    }

    // checked 状态依赖于子节点状态
    // 因此初始化状态放到子节点插入之后
    this.checked = false;
    this.indeterminate = false;
    this.updateChecked();
  }

  // 追加数据
  append(list: any[]): void {
    if (list.length <= 0) {
      return;
    }
    if (!Array.isArray(this.children)) {
      this.children = [];
    }
    const {
      children,
      tree,
    } = this;
    list.forEach((item) => {
      const node = new TreeNode(this.tree, item, this);
      children.push(node);
    });
    tree.reflow(this);
  }

  // 异步加载子节点数据
  async loadChildren(): Promise<void> {
    const config = get(this, 'tree.config', {});
    if (this.children === true && !this.loading) {
      if (typeof config.load === 'function') {
        this.set({
          loading: true,
        });
        this.update();
        let list = [];
        try {
          list = await config.load(this);
        } catch (err) {
          console.error(err);
        }
        this.set({
          loading: false,
        });
        if (Array.isArray(list) && list.length > 0) {
          this.append(list);
        } else {
          this.children = false;
        }
      }
    }
  }

  // 设置状态
  set(item: any): void {
    const { tree } = this;
    const keys = Object.keys(item);
    const changedProps: any = {};
    keys.forEach((key) => {
      if (hasOwnProperty.call(defaultStatus, key) || key === 'label') {
        if (this[key] !== item[key]) {
          changedProps[key] = true;
        }
        this[key] = item[key];
      }
    });
    tree.updated(this);
  }

  // 获取单个父节点
  getParent(): TreeNode {
    return this.parent;
  }

  // 获取所有父节点
  getParents(): TreeNode[] {
    const parents = [];
    let node = this.parent;
    while (node) {
      parents.push(node);
      node = node.parent;
    }
    return parents;
  }

  // 获取兄弟节点，包含自己在内
  getSiblings(): TreeNode[] {
    const { parent, tree } = this;
    let list: Array<TreeNode> = [];
    if (parent) {
      if (Array.isArray(parent.children)) {
        list = parent.children;
      }
    } else {
      list = tree.roots;
    }
    return list;
  }

  // 获取根节点
  getRoot(): TreeNode {
    const parents = this.getParents();
    return parents[0] || null;
  }

  // 获取节点在父节点的子节点列表中的位置
  // 如果没有父节点，则获取节点在根节点列表的位置
  getIndex(): number {
    const list = this.getSiblings();
    return list.indexOf(this);
  }

  // 初始化节点展开状态
  initExpanded(): void {
    const { tree } = this;
    const { config } = tree;
    let expanded = false;
    if (
      typeof config.expandLevel === 'number'
      && this.getLevel() < config.expandLevel
    ) {
      tree.expandedMap.set(this.value, true);
      expanded = true;
    }
    if (config.expandAll) {
      expanded = true;
    }
    if (this.children === true && config.lazy) {
      expanded = false;
    }
    if (expanded) {
      tree.expandedMap.set(this.value, true);
    } else {
      tree.expandedMap.delete(this.value);
    }
    this.expanded = expanded;
  }

  // 检查节点是否已展开
  isExpanded(map?: Map<string, boolean>): boolean {
    const expandedMap = map || this.tree.expandedMap;
    return expandedMap.get(this.value);
  }

  // 展开或者关闭节点
  toggleExpanded(): string[] {
    return this.setExpanded(!this.isExpanded());
  }

  // 设置节点展开状态
  setExpanded(expanded: boolean, opts?: any): string[] {
    const {
      tree,
      parent,
    } = this;
    const options = {
      directly: false,
      ...opts,
    };

    let map = tree.expandedMap;
    if (!options.directly) {
      map = new Map(tree.expandedMap);
    }

    // 手风琴效果，先折叠同级节点
    if (expanded) {
      let isExpandMutex = false;
      if (parent) {
        isExpandMutex = parent.expandMutex;
      } else {
        isExpandMutex = get(tree, 'config.expandMutex');
      }
      if (isExpandMutex) {
        const siblings = this.getSiblings();
        siblings.forEach((node) => {
          map.delete(node.value);
        });
      }
      map.set(this.value, true);
    } else {
      map.delete(this.value);
    }
    if (options.directly) {
      this.afterExpanded();
    }
    return tree.getExpanded(map);
  }

  // 节点展开关闭后需要调用的状态检查函数
  afterExpanded(): void {
    this.update();
    if (Array.isArray(this.children)) {
      this.updateDeep();
    } else if (this.children === true) {
      this.loadChildren();
    }
  }

  // 检查节点是否被激活
  isActived(map?: Map<string, boolean>): boolean {
    const activedMap = map || this.tree.activedMap;
    return activedMap.get(this.value);
  }

  // 切换节点激活态
  toggleActived(): string[] {
    return this.setActived(!this.isActived());
  }

  // 设置节点激活态
  setActived(actived: boolean, opts?: any): string[] {
    const {
      tree,
    } = this;
    const options = {
      directly: false,
      ...opts,
    };
    const config = tree.config || {};
    let map = tree.activedMap;
    if (!options.directly) {
      map = new Map(tree.activedMap);
    }
    if (this.activable) {
      if (actived) {
        if (!config.activeMultiple) {
          map.clear();
        }
        map.set(this.value, true);
      } else {
        map.delete(this.value);
      }
    }
    if (options.directly) {
      this.update();
    }
    return tree.getActived(map);
  }

  // 计算属性，判断节点是否被选中
  // map: 预期选中项map，用于计算节点在预期环境中的选中态
  isChecked(map?: Map<string, boolean>): boolean {
    const {
      children,
      tree,
    } = this;
    const {
      checkStrictly,
    } = tree.config;
    let checked = false;
    const checkedMap = map || tree.checkedMap;
    if (checkedMap.get(this.value)) {
      // 如果在 checked 节点列表中，则直接为 true
      checked = true;
    } else if (Array.isArray(children) && !checkStrictly) {
      // 如果是父节点，需检查所有子节点状态
      checked = children.every(node => node.isChecked(checkedMap));
    } else if (!checkStrictly) {
      // 从父节点状态推断子节点状态
      // 这里再调用 isChecked 会导致死循环
      const parents = this.getParents();
      checked = parents.some(node => (checkedMap.get(node.value)));
    }
    return checked;
  }

  // 是叶节点
  isLeaf(): boolean {
    return !this.children;
  }

  // 是否为半选状态
  isIndeterminate(): boolean {
    const {
      children,
    } = this;
    let indeterminate = false;
    if (Array.isArray(children)) {
      // 叶节点不存在半选状态
      let childChecked: null | boolean = null;
      indeterminate = children.some((node: TreeNode) => {
        if (node.isIndeterminate()) {
          // 子节点有任意一个半选，则其为半选状态
          return true;
        }
        if (childChecked === null) {
          childChecked = node.isChecked();
        }
        if (childChecked !== node.isChecked()) {
          // 子节点选中状态不一致，则其为半选状态
          return true;
        }
        return false;
      });
    }
    return indeterminate;
  }

  // 切换选中态
  toggleChecked(): string[] {
    return this.setChecked(!this.isChecked());
  }

  // 更新单个节点的选中态
  // 返回树选中列表
  setChecked(checked: boolean, opts?: any): string[] {
    const {
      checkable,
      tree,
    } = this;
    const config = tree.config || {};
    const options = {
      directly: false,
      ...opts,
    };
    let map = tree.checkedMap;
    if (!options.directly) {
      map = new Map(tree.checkedMap);
    }
    if (checkable && checked !== this.isChecked()) {
      if (config.checkStrictly) {
        if (checked) {
          map.set(this.value, true);
        } else {
          map.delete(this.value);
        }
      } else {
        const children = this.walk();
        // 子节点的预期选中态与当前节点同步
        children.forEach((node) => {
          if (checked) {
            map.set(node.value, true);
          } else {
            map.delete(node.value);
          }
        });
        // 消除全部父节点的预期选中态
        // 父节点的预期选中态将通过计算得出
        const parents = this.getParents();
        parents.forEach((node) => {
          map.delete(node.value);
        });
      }
    }
    if (options.directly) {
      if (config.checkStrictly) {
        this.updateChecked();
      } else {
        const relatedNodes = tree.getRelatedNodes([this.value]);
        relatedNodes.forEach((node) => {
          node.updateChecked();
        });
      }
    }
    return tree.getChecked(map);
  }

  // 获取节点所在层级
  getLevel(): number {
    const parents = this.getParents();
    return parents.length;
  }

  // 判断节点是否可视
  getVisible(): boolean {
    const {
      filter,
    } = this.tree;
    const parents = this.getParents();
    const expandVisible = parents.every((node: TreeNode) => node.isExpanded());
    let filterVisible = true;
    if (typeof filter === 'function') {
      filterVisible = filter(this);
    }
    const visible = (expandVisible && filterVisible);
    return visible;
  }

  // 更新节点状态
  update(): void {
    this.level = this.getLevel();
    this.actived = this.isActived();
    this.expanded = this.isExpanded();
    this.visible = this.getVisible();
    this.tree.updated(this);
  }

  // 更新选中态属性值
  updateChecked(): void {
    this.checked = this.isChecked();
    this.indeterminate = this.isIndeterminate();
    this.tree.updated(this);
  }

  // 更新节点下所有节点状态
  updateDeep(): void {
    const list = this.walk();
    list.forEach((node) => {
      node.update();
    });
  }

  // 获取包含自己在内所有的子节点
  walk(): TreeNode[] {
    const { children } = this;
    let list: TreeNode[] = [];
    list.push(this);
    if (Array.isArray(children) && children.length > 0) {
      children.forEach((node) => {
        list = list.concat(node.walk());
      });
    }
    return list;
  }
}

export default TreeNode;
