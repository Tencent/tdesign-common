export type AnimationType = 'ripple' | 'expand' | 'fade';

export default {
  classPrefix: 't',
  animation: {
    include: ['ripple', 'expand', 'fade'],
    exclude: []
  } as Record<'include'|'exclude', Array<AnimationType>>,
  calendar: {
    firstDayOfWeek: 1,
    fillWithZero: true,
    controllerConfig: undefined,
  },
  dialog: {
    confirmBtnTheme: {
      default: 'primary',
      info: 'primary',
      warning: 'primary',
      danger: 'primary',
      success: 'primary',
    },
  },
  popconfirm: {
    confirmBtnTheme: {
      default: 'primary',
      warning: 'primary',
      danger: 'primary',
    },
  },
  table: {
    // 展开和收起图标（使用收起图标）
    expandIcon: undefined,
    // 排序图标（使用降序图标）
    sortIcon: undefined,
    // 过滤图标
    filterIcon: undefined,
  },
  select: {
    // 清除按钮
    clearIcon: undefined,
  },
  tree: {
    // 目录层级图标
    folderIcon: undefined,
  },
  datePicker: {
    firstDayOfWeek: 1,
  },
  steps: {
    errorIcon: undefined,
  },
  tag: {
    closeIcon: undefined,
  },
  form: {
    requiredMark: true,
  },
};
