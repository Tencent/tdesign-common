class TList<T> {
  list: Array<T>;

  constructor(list: Array<T>) {
    this.list = list;
  }

  /** 如果 index 存在，则表示给指定位置添加新元素 */
  add(val: T, index?: number) {
    if (index) {
      this.list.splice(index, 0, val);
    } else {
      this.list.push(val);
    }
  }

  delete(val: T, compare?: (item: T) => boolean) {
    const compareFunc = compare || ((item) => item === val);
    const index = this.list.findIndex(compareFunc);
    this.deleteByIndex(index);
  }

  deleteByIndex(index: number) {
    this.list.splice(index, 1);
  }
}
