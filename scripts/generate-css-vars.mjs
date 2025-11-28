import fs from 'fs';
import path from 'path';

const [COMPONENT_NAME,  FRAMEWORK] = process.argv.slice(2);

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
};

const LESS_FILE_MAP = {
  'Mobile(Vue)': 'src/_common/style/mobile/components/${COMPONENT_NAME}/_var.less',
  'Mobile(React)': 'src/_common/style/mobile/components/${COMPONENT_NAME}/_var.less',
  'Miniprogram': 'packages/components/${COMPONENT_NAME}/${COMPONENT_NAME}.less',
  'Miniprogram(Chat)': 'packages/components/chat/${COMPONENT_NAME}/${COMPONENT_NAME}.less',
};

const DOCS_FILE_MAP = {
  'Mobile(Vue)': 'src/${COMPONENT_NAME}/${COMPONENT_NAME}',
  'Mobile(React)': 'src/${COMPONENT_NAME}/${COMPONENT_NAME}',
  'Miniprogram': 'packages/components/${COMPONENT_NAME}/README',
  'Miniprogram(Chat)': 'packages/components/chat/${COMPONENT_NAME}/README',
};

const resolveCwd = (...args) => {
  args.unshift(process.cwd());
  return path.join(...args);
};

const findFilePath = (framework, componentName) => {
  const lessPathTemplate = LESS_FILE_MAP[framework];
  if (!lessPathTemplate) {
    throw new Error(`⚠️ 未找到 framework "${framework}" 对应的路径配置`);
  }

  const lessPath = lessPathTemplate.replace(new RegExp('\\$\\{COMPONENT_NAME\\}', 'g'), componentName);
  return resolveCwd(lessPath);
};

const getAllComponentName = async (dirPath) => {
  const items = await fs.promises.readdir(dirPath, { withFileTypes: true });
  return items.filter((item) => item.isDirectory()).map((item) => item.name);
};

const generateCssVariables = async (componentName) => {
  const lessPath = [];
  const parsedKeys = [];
  let cssVariableBodyContent = '';

  if (COMBINE_MAP[componentName]) {
    COMBINE_MAP[componentName].forEach((item) => {
      lessPath.push(findFilePath(FRAMEWORK, item));
    });
  } else {
    lessPath.push(findFilePath(FRAMEWORK, componentName));
  }

  const validPaths = lessPath.filter((item) => fs.existsSync(item));

  // 使用 fs.promises.readFile 并行读取文件
  const fileContents = await Promise.all(validPaths.map((item) => fs.promises.readFile(item, 'utf8')));

  fileContents.forEach((file) => {
    const matchReg = /(?<=var)\([\s\S]*?(?=;)/g;

    const list = file.match(matchReg)?.sort();

    list?.forEach((item) => {
      const key = item.slice(1, item.indexOf(',')).trim();
      const value = item.slice(item.indexOf(',') + 2, item.length - 1).trim();
      if (!key || !value) {
        throw new Error('⚠️ 解析失败，请检查 less 文件');
      }
      if (!parsedKeys.includes(key)) {
        parsedKeys.push(key);
        cssVariableBodyContent += `${key} | ${value} | -${'\n'}`;
      }
    });
  });

  return cssVariableBodyContent;
};

/**
 * 替换文档中的 CSS 变量部分
 * @param {string} filePath - 文档路径
 * @param {string} headContent - 变量表头部内容
 * @param {string} variables - 生成的变量内容
 */
const updateDocVariables = (filePath, headContent, variables) => {
  const path = resolveCwd(filePath);

  if (!fs.existsSync(path)) return;

  const content = fs.readFileSync(path, 'utf8');
  const cssVariablesSection = `\n${headContent}${variables}`;

  // 检查是否存在 ### CSS Variables 部分
  if (content.includes('### CSS Variables')) {
    // 替换现有部分
    const newContent = content.replace(/(^|\n+)### CSS Variables[\s\S]*?(?=###|$)/, cssVariablesSection);
    fs.writeFileSync(path, newContent, 'utf8');
  } else {
    // 追加到文件末尾
    const trimmedContent = content.trimEnd();
    const newContent = `${trimmedContent}\n${cssVariablesSection}`;
    fs.writeFileSync(path, newContent, 'utf8');
  }
};

// 批量处理所有组件
const processAllComponents = async () => {
  const cssVariableHeadContent = `\n### CSS Variables\n\n组件提供了下列 CSS 变量，可用于自定义样式。\n名称 | 默认值 | 描述 \n-- | -- | --\n`;
  const cssVariableHeadContentEn = `\n### CSS Variables\n\nThe component provides the following CSS variables, which can be used to customize styles.\nName | Default Value | Description \n-- | -- | --\n`;

  let COMPONENT_NAMES = [];
  if (COMPONENT_NAME === 'all') {
    COMPONENT_NAMES = await getAllComponentName(resolveCwd('src'));
  } else {
    COMPONENT_NAMES = [COMPONENT_NAME];
  }

  // 并行处理所有组件
  await Promise.all(
    COMPONENT_NAMES.map(async (name) => {
      const variables = await generateCssVariables(name);
      if (variables) {
        const docsPathTemplate = DOCS_FILE_MAP[FRAMEWORK];
        if (!docsPathTemplate) {
          throw new Error(`⚠️ 未找到 framework "${FRAMEWORK}" 对应的文档路径配置`);
        }
        const docsPath = docsPathTemplate.replace(new RegExp('\\$\\{COMPONENT_NAME\\}', 'g'), name);

        updateDocVariables(`${docsPath}.md`, cssVariableHeadContent, variables);
        updateDocVariables(`${docsPath}.en-US.md`, cssVariableHeadContentEn, variables);
        console.log(`✅ "${name}" 组件文档更新完成`);
      } else {
        console.log(`${name}" 没有找到 CSS 变量`);
      }
    }),
  );
};

// npm run api:css button "Mobile(Vue)"
// npm run api:css all "Mobile(Vue)"
processAllComponents().catch((err) =>
  console.error(`${COMPONENT_NAME === 'all' ? '❌ 批量处理失败:' : `${COMPONENT_NAME}处理失败`}`, err),
);
