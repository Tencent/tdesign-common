import { Platform } from './types';

/**
 * Key 对应组件文档页面的 URL
 */
const COMMON_COMP_MAP: Record<string, string[]> = {
  Avatar: ['AvatarGroup'],
  BackTop: [],
  Badge: [],
  Button: [],
  Calendar: [],
  Cascader: [],
  Checkbox: ['CheckboxGroup'],
  Collapse: ['CollapsePanel'],
  ConfigProvider: [],
  Dialog: [],
  Divider: [],
  Drawer: [],
  Empty: [],
  Guide: [],
  Icon: [],
  Image: [],
  ImageViewer: [],
  Input: [],
  Link: [],
  Loading: [],
  Popup: [],
  Progress: [],
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

const WEB_COMP_MAP: Record<string, string[]> = {
  Affix: [],
  Anchor: ['AnchorItem'],
  Alert: [],
  Breadcrumb: ['BreadcrumbItem'],
  Card: [],
  ColorPicker: ['ColorPickerPanel'],
  Comment: [],
  DatePicker: ['DateRangePicker', 'DatePickerPanel', 'DateRangePickerPanel'],
  Descriptions: ['DescriptionsItem'],
  Dropdown: ['DropdownItem'],
  Grid: ['Col', 'Row'],
  Form: ['FormItem', 'FormList'],
  InputAdornment: [],
  InputNumber: [],
  Layout: ['Header', 'Aside', 'Content', 'Footer'],
  List: ['ListItem'],
  Menu: ['HeadMenu', 'Submenu', 'MenuItem'],
  Message: [],
  Notification: [],
  Pagination: ['PaginationMini'],
  Popconfirm: [],
  RangeInput: [],
  Select: [],
  SelectInput: [],
  Statistic: [],
  StickyTool: [],
  Space: [],
  Swiper: ['SwiperNavigation'],
  Table: [],
  TagInput: [],
  Timeline: [],
  TimePicker: ['TimeRangePicker', 'TimePickerPanel'],
  Tooltip: [],
  Transfer: [],
  Tree: [],
  Typography: [
    'Text',
    'Title',
    'Paragraph',
    'TypographyEllipsis',
    'TypographyCopyable',
  ],
  Watermark: [],
} as const;

const MOBILE_COMP_MAP: Record<string, string[]> = {
  ActionSheet: [],
  Cell: ['CellGroup'],
  CheckTag: [],
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
