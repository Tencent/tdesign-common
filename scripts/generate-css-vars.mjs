import fs from 'fs';
import path from 'path';

// 获取命令行参数
const [FRAMEWORK, COMPONENT_NAME] = process.argv.slice(2);

// 组合组件映射
const COMBINE_MAP = {
  avatar: ['avatar-group', 'avatar'],
  cell: ['cell-group', 'cell'],
  collapse: ['collapse', 'collapse-panel'],
  'dropdown-menu': ['dropdown-menu', 'dropdown-item'],
  tag: ['tag', 'check-tag'],
  checkbox: ['checkbox-group', 'checkbox'],
  indexes: ['indexes', 'indexes-anchor'],
  picker: ['picker', 'picker-item'],
  radio: ['radio-group', 'radio'],
  'side-bar': ['side-bar', 'side-bar-item'],
  steps: ['steps', 'step-item'],
  swiper: ['swiper', 'swiper-nav'],
  tabs: ['tabs', 'tab-panel'],
  'tab-bar': ['tab-bar', 'tab-bar-item'],
  grid: ['grid', 'grid-item'],
  layout: ['row', 'col'],
  form: ['form', 'form-item'],
  qrcode: ['qrcode', 'qrcode/components/qrcode-canvas', 'qrcode/components/qrcode-status'],
  'chat-markdown': [
    'chat-markdown',
    'chat-markdown/components/chat-markdown-code',
    'chat-markdown/components/chat-markdown-node',
    'chat-markdown/components/chat-markdown-table',
  ],
};

// 框架基础路径映射
const FRAMEWORK_BASE_PATH_MAP = {
  'Mobile(Vue)': 'src/',
  'Mobile(React)': 'src/',
  Miniprogram: 'packages/components/',
  'Miniprogram(Chat)': 'packages/components/chat/'
};

// 需要过滤的目录名称
const FILTERED_DIR = [
  'mixins',
  'node_modules',
  'common',
  'hooks',
  'locale',
  'shared'
];

// LESS 文件路径模板
const LESS_FILE_MAP = {
  'Mobile(Vue)': '_common/style/mobile/components/{COMPONENT_NAME}/_var.less',
  'Mobile(React)': '_common/style/mobile/components/{COMPONENT_NAME}/_var.less',
  Miniprogram: '{COMPONENT_NAME}/{COMPONENT_NAME}.less',
  'Miniprogram(Chat)': '{COMPONENT_NAME}/{COMPONENT_NAME}.less',
};

// 文档文件路径模板
const DOCS_FILE_MAP = {
  'Mobile(Vue)': '{COMPONENT_NAME}/{COMPONENT_NAME}',
  'Mobile(React)': '{COMPONENT_NAME}/{COMPONENT_NAME}',
  Miniprogram: '{COMPONENT_NAME}/README',
  'Miniprogram(Chat)': '{COMPONENT_NAME}/README',
};

/**
 * 解析当前工作目录路径
 * @param {...string} args - 路径参数
 * @returns {string} 解析后的绝对路径
 */
const resolveCwd = (...args) => {
  args.unshift(process.cwd());
  return path.join(...args);
};

/**
 * 验证输入参数
 * @returns {boolean} 参数是否有效
 */
const validateInput = () => {
  if (!FRAMEWORK || !COMPONENT_NAME) {
    // eslint-disable-next-line no-console
    console.error('❌ 请提供必要的参数: framework 和 componentName');
    return false;
  }

  if (!FRAMEWORK_BASE_PATH_MAP[FRAMEWORK]) {
    // eslint-disable-next-line no-console
    console.error(`❌ 不支持的框架: ${FRAMEWORK}`);
    return false;
  }

  return true;
};

/**
 * 查找文件路径
 * @param {string} framework - 框架名称
 * @param {string} componentName - 组件名称
 * @returns {string} 文件路径
 */
const findFilePath = (framework, componentName) => {
  const lessPathTemplate = LESS_FILE_MAP[framework];
  if (!lessPathTemplate) {
    throw new Error(`⚠️ 未找到 framework "${framework}" 对应的路径配置`);
  }
  const lessPath = FRAMEWORK_BASE_PATH_MAP[framework]
    + lessPathTemplate.replace(/{COMPONENT_NAME}/g, componentName);

  return resolveCwd(lessPath);
};

/**
 * 获取所有组件名称
 * @param {string} framework - 框架名称
 * @returns {Promise<string[]>} 组件名称数组
 */
const getAllComponentName = async (framework) => {
  const dirPath = resolveCwd(FRAMEWORK_BASE_PATH_MAP[framework]);
  try {
    const items = await fs.promises.readdir(dirPath, { withFileTypes: true });
    return items
      .filter((item) => item.isDirectory())
      .map((item) => item.name)
      .filter((name) => (
        !name.startsWith('.')
        && !name.startsWith('_')
        && !FILTERED_DIR.includes(name)
      ));
  } catch (error) {
    throw new Error(`❌ 无法读取目录 ${dirPath}: ${error.message}`);
  }
};

/**
 * 解析 CSS 变量
 * @param {string} content - 文件内容
 * @param {Set<string>} parsedKeys - 已解析的键名集合
 * @returns {string} 解析后的变量内容
 */
const parseCssVariables = (content, parsedKeys) => {
  const matchReg = /(?<=var)\(([^()]*?(?:\([^()]*?\))?[^()]*)\)/g;
  const matches = content.match(matchReg);

  if (!matches) return '';

  let result = '';

  matches
    .filter(Boolean)
    .sort()
    .forEach((item) => {
      const key = item.slice(1, item.indexOf(',')).trim();
      const value = item.slice(item.indexOf(',') + 2, item.length - 1).trim();

      if (!key || !value) {
        // eslint-disable-next-line no-console
        console.warn('⚠️ 解析失败，请检查 less 文件中的变量格式');
        return;
      }

      if (!parsedKeys.has(key)) {
        parsedKeys.add(key);
        result += `${key} | ${value} | -\n`;
      }
    });

  return result;
};

/**
 * 生成 CSS 变量内容
 * @param {string} componentName - 组件名称
 * @returns {Promise<string>} CSS 变量内容
 */
const generateCssVariables = async (componentName) => {
  const lessPaths = [];
  const parsedKeys = new Set();

  try {
    if (COMBINE_MAP[componentName]) {
      COMBINE_MAP[componentName].forEach((item) => {
        lessPaths.push(findFilePath(FRAMEWORK, item));
      });
    } else {
      lessPaths.push(findFilePath(FRAMEWORK, componentName));
    }

    const validPaths = lessPaths.filter((filePath) => fs.existsSync(filePath));

    if (validPaths.length === 0) {
      // eslint-disable-next-line no-console
      console.warn(`⚠️ 未找到组件 "${componentName}" 的 LESS 文件`);
      return '';
    }

    // 并行读取所有有效文件
    const fileContents = await Promise.all(
      validPaths.map((filePath) => fs.promises.readFile(filePath, 'utf8'))
    );

    let cssVariableContent = '';

    fileContents.forEach((content) => {
      cssVariableContent += parseCssVariables(content, parsedKeys);
    });

    return cssVariableContent;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`❌ 处理组件 "${componentName}" 时出错:`, error.message);
    return '';
  }
};

/**
 * 替换文档中的 CSS 变量部分
 * @param {string} filePath - 文档路径
 * @param {string} headContent - 变量表头部内容
 * @param {string} variables - 生成的变量内容
 */
const updateDocVariables = (filePath, headContent, variables) => {
  const fullPath = resolveCwd(filePath);

  if (!fs.existsSync(fullPath)) {
    return;
  }

  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    const cssVariablesSection = `\n${headContent}${variables}`;

    let newContent;

    if (content.includes('### CSS Variables')) {
      // 替换现有部分
      newContent = content.replace(
        /(^|\n+)### CSS Variables[\s\S]*?(?=###|$)/,
        cssVariablesSection
      );
    } else {
      // 追加到文件末尾
      const trimmedContent = content.trimEnd();
      newContent = `${trimmedContent}${cssVariablesSection}`;
    }

    fs.writeFileSync(fullPath, newContent, 'utf8');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`❌ 更新文档文件 "${fullPath}" 时出错:`, error.message);
  }
};

/**
 * 处理单个组件
 * @param {string} componentName - 组件名称
 * @param {string} cssVariableHeadContent - 中文头部内容
 * @param {string} cssVariableHeadContentEn - 英文头部内容
 */
const processComponent = async (
  componentName,
  cssVariableHeadContent,
  cssVariableHeadContentEn
) => {
  try {
    const variables = await generateCssVariables(componentName);

    if (variables) {
      const docsPathTemplate = DOCS_FILE_MAP[FRAMEWORK];
      if (!docsPathTemplate) {
        throw new Error(`⚠️ 未找到 framework "${FRAMEWORK}" 对应的文档路径配置`);
      }

      const docsPath = FRAMEWORK_BASE_PATH_MAP[FRAMEWORK]
        + docsPathTemplate.replace(/{COMPONENT_NAME}/g, componentName);

      updateDocVariables(`${docsPath}.md`, cssVariableHeadContent, variables);
      updateDocVariables(`${docsPath}.en-US.md`, cssVariableHeadContentEn, variables);

      // eslint-disable-next-line no-console
      console.log(`✅ "${componentName}" 组件文档更新完成`);
    } else {
      // eslint-disable-next-line no-console
      console.log(`ℹ️ "${componentName}" 没有找到 CSS 变量`);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`❌ 处理组件 "${componentName}" 失败:`, error.message);
  }
};

/**
 * 批量处理所有组件
 */
const processAllComponents = async () => {
  const cssVariableHeadContent = '\n### CSS Variables\n\n'
    + '组件提供了下列 CSS 变量，可用于自定义样式。\n'
    + '名称 | 默认值 | 描述 \n-- | -- | --\n';
  const cssVariableHeadContentEn = '\n### CSS Variables\n\n'
    + 'The component provides the following CSS variables, which can be used to customize styles.\n'
    + 'Name | Default Value | Description \n-- | -- | --\n';

  let componentNames = [];

  try {
    if (COMPONENT_NAME === 'all') {
      componentNames = await getAllComponentName(FRAMEWORK);
    } else {
      componentNames = [COMPONENT_NAME];
    }

    // 并行处理所有组件
    await Promise.all(
      componentNames.map((name) => processComponent(name, cssVariableHeadContent, cssVariableHeadContentEn))
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ 批量处理失败:', error.message);
  }
};

// 主程序入口
const main = async () => {
  if (!validateInput()) {
    process.exit(1);
  }

  await processAllComponents();
};

// 执行主程序
main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(
    COMPONENT_NAME === 'all' ? '❌ 批量处理失败:' : `❌ ${COMPONENT_NAME} 处理失败`,
    error
  );
  process.exit(1);
});
