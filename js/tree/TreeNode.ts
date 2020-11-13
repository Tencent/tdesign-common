import get from 'lodash/get';
import remove from 'lodash/remove';
import uniqueId from 'lodash/uniqueId';
import { TreeStore } from './TreeStore';

const {
  hasOwnProperty,
} = Object.prototype;

const defaultStatus: any = {
  expanded: false,
  expandMutex: false,
  active: false,
  activable: true,
  checkProps: null,
  checkable: false,
  disabled: false,
  draggable: false,
  loading: false,
};

export class TreeNode {
  tree: TreeStore;
  value: string;
  label: string;
  dataset: any;
  parent: TreeNode;
  children: TreeNode[] | boolean;
  expanded: boolean;
  expandMutex: boolean;
  active: boolean;
  activable: boolean;
  checkProps: object;
  checkable: boolean;
  disabled: boolean;
  draggable: boolean;
  visible: boolean;
  level: number;
  loading: boolean;
  checked: boolean;
  indeterminate: boolean;

  constructor(tree: TreeStore, data?: object, parent?: TreeNode) {
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
      expanded: config.expandAll,
      ...data,
    };
    const children = spec[propChildren];

    this.set(spec);
    this.label = spec[propLabel] || '';
    this.value = spec[propValue] || uniqueId(prefix);
    this.tree.nodeMap.set(this.value, this);

    this.visible = true;
    this.level = 0;
    if (parent && parent instanceof TreeNode) {
      this.parent = parent;
    }
    this.update();

    if (
      typeof config.expandLevel === 'number'
      && this.level < config.expandLevel
    ) {
      this.expanded = true;
    }

    tree.reflow(this);

    if (Array.isArray(children)) {
      this.append(children);
    } else if (children === true) {
      this.children = children;
      if (config.lazy) {
        this.expanded = false;
      } else {
        this.loadChildren();
      }
    }

    this.checked = false;
    this.indeterminate = false;
    this.updateChecked();
  }

  // 追加数据
  append(list: object[]): void {
    if (list.length <= 0) {
      return;
    }
    if (!Array.isArray(this.children)) {
      this.children = [];
    }
    const {
      children,
    } = this;
    list.forEach((item) => {
      const node = new TreeNode(this.tree, item, this);
      children.push(node);
    });
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
    const {
      tree,
    } = this;
    const keys = Object.keys(item);
    const changedProps: any = {};
    keys.forEach((key) => {
      if (
        hasOwnProperty.call(defaultStatus, key)
        || key === 'label'
      ) {
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
    const {
      parent,
      tree,
    } = this;
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

  // 展开或者关闭节点
  toggleExpand(): void {
    const isExpand = !this.expanded;
    if (isExpand) {
      this.expand();
    } else {
      this.collapse();
    }
  }

  // 展开节点
  expand(): void {
    const {
      parent,
      tree,
      children,
    } = this;
    const siblings = this.getSiblings();
    let isExpandMutex = false;
    if (parent) {
      isExpandMutex = parent.expandMutex;
    } else {
      isExpandMutex = get(tree, 'config.expandMutex');
    }
    // 手风琴效果，先折叠同级节点
    if (isExpandMutex) {
      siblings.forEach((node) => {
        node.collapse();
      });
    }
    this.set({
      expanded: true,
    });
    if (Array.isArray(children)) {
      this.updateDeep();
    } else if (children === true) {
      this.loadChildren();
    }
  }

  // 关闭节点
  collapse(): void {
    this.set({
      expanded: false,
    });
    this.updateDeep();
  }

  toggleActive(): void {
    const active = !this.active;
    if (active) {
      this.setActive();
    } else {
      this.disActive();
    }
  }

  setActive(): void {
    const {
      tree,
    } = this;
    const config = tree.config || {};
    if (this.activable) {
      if (!config.activeMultiple) {
        tree.actived.forEach((node: TreeNode) => {
          node.set({
            active: false,
          });
        });
        tree.actived.length = 0;
      }
      tree.actived.push(this);
      this.set({
        active: true,
      });
    }
  }

  disActive(): void {
    const {
      tree,
    } = this;
    remove(
      tree.actived,
      (node: TreeNode) => (node.value === this.value)
    );
    this.set({
      active: false,
    });
  }

  // 计算属性，判断节点是否被选中
  // map: 预期选中项map，用于计算节点在预期环境中的选中态
  isChecked(map?: Map<string, boolean>): boolean {
    const {
      children,
      tree,
    } = this;
    let checked = false;
    const checkedMap = map || tree.checkedMap;
    if (checkedMap.get(this.value)) {
      // 如果在 checked 节点列表中，则直接为 true
      checked = true;
    } else if (Array.isArray(children)) {
      // 如果是父节点，需检查所有子节点状态
      checked = children.every(node => node.isChecked(checkedMap));
    } else {
      const parents = this.getParents();
      // 这里再调用 isChecked 会导致死循环
      checked = parents.some(node => (checkedMap.get(node.value)));
    }
    return checked;
  }

  // 是否为半选状态
  isIndeterminate() {
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
  setChecked(checked: boolean): string[] {
    const {
      checkable,
      tree,
    } = this;
    const map = new Map(tree.checkedMap);
    if (checkable && checked !== this.isChecked()) {
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
    return tree.getChecked(map);
  }

  // 更新节点状态
  // level: 节点所在层级
  // visible: 节点在树中是否可见
  update(): void {
    const parents = this.getParents();
    this.level = parents.length;
    this.visible = parents.every((node: TreeNode) => node.expanded);
  }

  // 更新选中态属性值
  updateChecked(): void {
    this.checked = this.isChecked();
    this.indeterminate = this.isIndeterminate();
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
    const {
      children,
    } = this;
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
