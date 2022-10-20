import fs from 'fs';

/**
 * 渲染 live demo 逻辑，提取 md 头信息生成框架需要的字符串
 * @param {object} options
 * @param {object} options.usage
 * @param {string} options.demoPath
 * @param {string} options.componentName
 * @returns
 */
export function compileUsage(options) {
  const { usage, demoPath, componentName } = options || {};

  const { title = '', description = '' } = usage || {};

  if (!fs.existsSync(demoPath)) {
    // eslint-disable-next-line no-console
    console.log('\x1B[36m%s\x1B[0m', `${componentName} 组件未提供 ${demoPath} 文件!`);
    return null;
  }

  return {
    importStr: `import Usage from '${demoPath}';`,
    installStr: 'Usage,',
    markdownStr: `${title ? `### ${title}` : ''}\n${description}\n\n<Usage />`,
  };
}

export default {
  compileUsage
};
