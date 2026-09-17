import { CHAT_COMPONENT_MAP, MOBILE_COMPONENT_MAP, WEB_COMPONENT_MAP } from '../../../js/components';
import type { ComponentMap, Platform } from './types';

export const COMPONENT_MAPS: Record<Platform, ComponentMap> = {
  web: WEB_COMPONENT_MAP,
  mobile: MOBILE_COMPONENT_MAP,
  chat: CHAT_COMPONENT_MAP,
};

export const getComponentMap = (platform: Platform): ComponentMap => COMPONENT_MAPS[platform] ?? {};

/** spline 分类在 llms.txt 索引中的展示顺序，未列出的分类按名称排在末尾 */
export const SPLINE_ORDER = ['base', 'layout', 'navigation', 'form', 'data', 'message', 'ai'];

/** spline 分类的默认中文标签，未知分类回退为 spline 原值 */
export const SPLINE_LABELS: Record<string, string> = {
  base: '基础',
  layout: '布局',
  navigation: '导航',
  form: '表单',
  data: '数据展示',
  message: '反馈',
  ai: 'AI',
  explain: '说明',
  other: '其他',
};
