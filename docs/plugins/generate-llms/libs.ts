import { CHAT_COMPONENT_MAP, MOBILE_COMPONENT_MAP, WEB_COMPONENT_MAP } from '../../../js/components';
import type { ComponentMap, Platform } from './types';

export const COMPONENT_MAPS: Record<Platform, ComponentMap> = {
  web: WEB_COMPONENT_MAP,
  mobile: MOBILE_COMPONENT_MAP,
  chat: CHAT_COMPONENT_MAP,
};

export const getComponentMap = (platform: Platform): ComponentMap => COMPONENT_MAPS[platform] ?? {};
