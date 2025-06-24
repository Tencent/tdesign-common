/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
import { promises } from 'fs';
import { mapToParentName } from './components';
import type { ComponentLog, ComponentLogMap, LogItem, Logs, LogType, Platform, VersionLog } from './types';

export const LOG_TYPES = ['🚨 Breaking Changes', '🚀 Features', '🐞 Bug Fixes'] as const;

let targetPlatform: Platform = 'web';

export default async function generateChangelogJson(changelogPath: string, platform: Platform) {
  try {
    const logMd = await promises.readFile(changelogPath, 'utf-8');
    targetPlatform = platform;
    const detailedLogs = parseMd2Json(logMd);
    const compMap = formatJson2CompMap(detailedLogs);
    console.log('\x1b[32m%s\x1b[0m', '✅ Sync CHANGELOG.md to changelog.json');
    return compMap;
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Fail to generate changelog.json', '\x1b[33m', error);
    return {};
  }
}

/**
 * 将整份 Markdown 先根据版本号拆分
 */
function parseMd2Json(logMd: string) {
  const headerRegex = /^\s*##\s*🌈\s*(\d+\.\d+\.\d+)\s+`(\d{4}-\d{2}-\d{2})`\s*$/gm;
  const matches = Array.from(logMd.matchAll(headerRegex));

  const logs = matches.map((match, i) => {
    const version = match[1];
    const date = match[2];

    const start = match.index + match[0].length;
    const end = i < matches.length - 1 ? matches[i + 1].index : logMd.length;
    const log = logMd.slice(start, end).trim();

    return {
      version,
      date,
      log: parseLogByType(log),
    };
  });

  return logs;
}

/**
 * 进一步根据指定的变更类型拆分
 */
function parseLogByType(logBlock: string) {
  const logs: Logs = {};

  LOG_TYPES.forEach((type) => {
    const typeRegex = new RegExp(`### ${type}\\r?\\n([\\s\\S]+?)(?=### |$)`, 'g');
    const matches = Array.from(logBlock.matchAll(typeRegex));

    if (matches.length > 0) {
      const logBlock = matches.map((match) => match[1]).join('\n');
      const entries = extractLogEntries(logBlock);
      logs[type] = groupLogByComponent(entries);
    }
  });

  return logs;
}

/**
 * 获取每种变更类型里面的每一段日志
 * - case 1: 单独一行 -> 作为一条
 * - case 2: 存在父子列表 -> 使用换行符，合并为一条
 */
function extractLogEntries(logBlock: string) {
  const lines = logBlock.split('\n').filter((line) => line.trim() !== '');
  const logs: string[] = [];

  let currEntry = '';
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // 跳过空行
    if (!line) continue;

    // 是否为子项（短横线前面有空格）
    const isChildEntry = /^\s+-/.test(lines[i]);

    // 是否为父项（直接以短横线开头）
    const isParentEntry = line.startsWith('-') && !isChildEntry;

    if (isParentEntry) {
      // 如果是父项，保存之前的日志
      if (currEntry) {
        logs.push(currEntry.trim());
      }
      // 开始新项，去掉开头的 -
      currEntry = line.substring(1).trim();
    } else if (isChildEntry) {
      // 如果是子项，添加到当前项中
      const childContent = line.replace(/^\s*-\s*/, '').trim();
      currEntry += `\n${childContent}`;
    }
  }

  // 处理最后一项
  logs.push(currEntry.trim());
  return logs;
}

/**
 * 根据每一条日志提及的组件名，将其归类
 */
function groupLogByComponent(entries: string[]) {
  const logs: LogItem[] = [];

  entries.forEach((entry) => {
    const nameRegex = /`([^`]+)`:/;
    const match = entry.match(nameRegex);
    if (!match) return;

    const rawName = match[1];
    const compName = mapToParentName(rawName, targetPlatform);
    if (!compName) return;

    // 当前日志为父组件，去掉前缀
    if (rawName === compName) {
      const logWithoutPrefix = entry.replace(nameRegex, '').trim();
      const lines = logWithoutPrefix.split('\n').map((line) => line.trim());
      const isGroupedLog = lines[0].startsWith('@');
      // 首行存在 @用户名 -> 同一个PR
      if (isGroupedLog) {
        // 整体插入，渲染为列表
        logs.push({ component: compName, description: logWithoutPrefix });
      } else {
        // 每一行渲染为单独的日志项
        lines.forEach((line) => {
          logs.push({ component: compName, description: line });
        });
      }
    } else {
      // 子组件保留前缀，且整体插入
      logs.push({ component: compName, description: entry });
    }
  });

  return logs;
}

/**
 * 将解析后的日志 JSON 转换为以组件名作为 key 的映射格式
 */
function formatJson2CompMap(logJson: VersionLog[]) {
  const compMap: ComponentLogMap = {};

  logJson.forEach((entry) => {
    const { version, date, log } = entry;

    (Object.keys(log) as LogType[]).forEach((type) => {
      log[type]?.forEach((item: LogItem) => {
        const { component, description } = item;

        if (!compMap[component]) {
          compMap[component] = [];
        }

        // 查找当前组件的版本记录
        let versionEntry = compMap[component].find(
          (v) => v.version === version
        );

        if (!versionEntry) {
          versionEntry = {
            version,
            date,
          } as ComponentLog;
          compMap[component].push(versionEntry);
        }

        if (!versionEntry[type]) {
          versionEntry[type] = [];
        }
        versionEntry[type].push(description);
      });
    });
  });

  // 按组件名字母顺序排序
  const sortedCompMap = Object.keys(compMap)
    .sort((a, b) => a.localeCompare(b))
    .reduce((acc, key) => ({ ...acc, [key]: compMap[key] }), {});

  return sortedCompMap as ComponentLogMap;
}
