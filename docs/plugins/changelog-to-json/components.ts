import type { Platform } from './types';

/**
 * Key 对应组件文档页面的 URL
 */
export const COMMON_COMP_MAP: Record<string, string[]> = {
  Avatar: ['AvatarGroup'],
  BackTop: [],
  Badge: [],
  Button: [],
  Calendar: [],
  Cascader: [],
  Checkbox: ['CheckboxGroup'],
  Collapse: ['CollapsePanel'],
  ConfigProvider: [],
  Dialog: ['DialogPlugin'],
  Divider: [],
  Drawer: ['DrawerPlugin'],
  Empty: [],
  Guide: [],
  Form: ['FormItem', 'FormList'],
  Icon: [],
  Image: [],
  ImageViewer: [],
  Input: [],
  Link: [],
  List: ['ListItem'],
  Loading: ['LoadingPlugin'],
  Popup: ['PopupPlugin'],
  Progress: [],
  QRCode: [],
  Table: [],
  Tabs: ['TabPanel'],
  Tag: ['CheckTag', 'CheckTagGroup'],
  Textarea: [],
  Toast: [],
  Radio: ['RadioGroup'],
  Rate: [],
  Slider: [],
  Skeleton: [],
  Steps: ['StepItem'],
  Switch: [],
  TreeSelect: [],
  Overlay: [],
  Upload: [],
} as const;

export const WEB_COMP_MAP: Record<string, string[]> = {
  Affix: [],
  Anchor: ['AnchorItem'],
  Alert: [],
  AutoComplete: [],
  Breadcrumb: ['BreadcrumbItem'],
  Card: [],
  ColorPicker: ['ColorPickerPanel'],
  Comment: [],
  DatePicker: ['DateRangePicker', 'DatePickerPanel', 'DateRangePickerPanel'],
  Descriptions: ['DescriptionsItem'],
  Dropdown: ['DropdownItem'],
  Grid: ['Col', 'Row'],
  InputAdornment: [],
  InputNumber: [],
  Layout: ['Header', 'Aside', 'Content', 'Footer'],
  Menu: ['HeadMenu', 'Submenu', 'MenuItem'],
  Message: ['MessagePlugin'],
  Notification: ['NotificationPlugin'],
  Pagination: ['PaginationMini'],
  Popconfirm: [],
  RangeInput: [],
  Select: [],
  SelectInput: [],
  Statistic: [],
  StickyTool: [],
  Space: [],
  Swiper: ['SwiperNavigation'],
  TagInput: [],
  Timeline: [],
  TimePicker: ['TimeRangePicker', 'TimePickerPanel'],
  Tooltip: ['TooltipLite'],
  Transfer: [],
  Tree: [],
  Typography: ['Text', 'Title', 'Paragraph'],
  Watermark: [],
} as const;

export const MOBILE_COMP_MAP: Record<string, string[]> = {
  ActionSheet: [],
  Cell: ['CellGroup'],
  ColorPicker: [],
  CountDown: [],
  DateTimePicker: [],
  DropdownMenu: ['DropdownItem'],
  Grid: ['GridItem'],
  Fab: [],
  Footer: [],
  Layout: ['Col', 'Row'],
  Message: ['MessageItem'],
  Navbar: [],
  NoticeBar: [],
  Indexes: ['IndexesAnchor'],
  Picker: [],
  Popover: [],
  PullDownRefresh: [],
  Result: [],
  ScrollView: [],
  Search: [],
  Slider: [],
  SideBar: ['SideBarItem'],
  Stepper: [],
  Sticky: [],
  Swiper: ['SwiperNav'],
  SwipeCell: [],
  TabBar: ['TabBarItem'],
  Transition: [],
} as const;

export const mapToParentName = (name: string, platform: Platform) => {
  const isWeb = platform === 'web';

  const mergedMap = {
    ...COMMON_COMP_MAP,
    ...(isWeb ? WEB_COMP_MAP : MOBILE_COMP_MAP),
  };

  const found = Object.entries(mergedMap).find(
    ([key, values]) => key === name || values.includes(name)
  );

  // 返回父组件名
  if (found) return found[0];

  return null;
};
