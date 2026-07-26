# TDesign Mobile TabBar Glass 与 CSS Fallback 技术说明

## 1. 文档目的

本文面向 `tdesign-api`、`tdesign-common` 和 `tdesign-mobile-vue` 的维护者，说明 TabBar `effect="glass"` 的当前技术设计、视觉分层、Chromium 增强管线、CSS fallback、参数边界、生命周期、性能约束、测试要求和维护注意事项。

本文描述的是当前本地功能分支的实现快照，不代表功能已经达到正式 PR 或发布状态。合入前仍需完成来源审计、跨仓同步、当前 HEAD 全量验证和远程 CI。

本文不将调参 Demo 中的内部参数视为公共 API，也不承诺与 Apple Liquid Glass 的未公开内部模型或参数完全一致。

## 2. 目标与非目标

### 2.1 目标

- 保持现有 TabBar 默认行为和 `effect="normal"` 完全兼容。
- 通过 `effect="glass"` 提供半透明 Glass 材质。
- 在支持的 Chromium 环境中提供真实背景相关的边缘折射。
- 在其他环境中保留可读、可交互的 CSS fallback。
- 支持 SSR、hydration、多实例、动态尺寸变化和运行时切换。
- 保持公开 API 简洁，不暴露折射算法的内部调参面。
- 视觉装饰不得拦截 TabBarItem 的点击、选中和无障碍交互。

### 2.2 非目标

- 不承诺跨浏览器完全一致的 SVG 背景位移。
- 不使用 WebGL、WebGPU、Three.js 或第三方渲染依赖。
- 不复制、缓存或截图页面背景。
- 不使用持续运行的动画帧循环模拟折射。
- 不公开 `thicknessRatio`、`bezelRatio`、`refractiveIndex` 等内部算法参数。
- 不将静态渐变、高光或色散装饰描述为真实背景折射。
- 不把当前调参 Demo、诊断页面或性能指标作为稳定产品 API。

## 3. 跨仓职责

| 仓库                         | 职责                                                 | 主要文件                                                                  |
| ---------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------- |
| `TDesignOteam/tdesign-api`   | 定义并生成公共 API                                   | TabBar `type.ts`、`props.ts`、中英文 API 文档                             |
| `Tencent/tdesign-common`     | 公共 Less、CSS variables、主题默认值和维护文档       | `style/mobile/components/tab-bar/`、`style/mobile/theme/_components.less` |
| `Tencent/tdesign-mobile-vue` | Vue DOM、运行时滤镜、纹理生成、生命周期、测试和 Demo | `src/tab-bar/`、`site/mobile/router.ts`                                   |

API 生成文件不得在 `tdesign-mobile-vue` 中手工维护。公共样式应先落入 `tdesign-common`，再通过 `src/_common` 对齐到组件仓。

## 4. 公共 API

```ts
effect?: 'normal' | 'glass';
```

- 默认值：`normal`。
- `normal`：保持原有 DOM、布局、样式和交互路径。
- `glass`：渲染 Glass 基线层，并在客户端能力满足时启用 Chromium SVG 增强。
- `effect` 与 `shape` 正交。
- 当前共享选中胶囊只在 `effect="glass" && shape="round"` 时出现。

内部光学参数通过私有开发上下文注入，仅供 Demo 和验证使用，不是组件公开契约。

## 5. 渐进增强模型

当前实现采用三级能力模型：

```text
Level 0：可读基线
半透明底色 + 阴影 + 静态边缘高光 + 内容与交互

Level 1：CSS fallback
Level 0 + backdrop blur + 全局饱和度

Level 2：Chromium SVG enhancement
Level 1 + displacement map + 动态镜面高光 + 局部高饱和合成
```

任一级能力失败都必须向下退化，不允许隐藏内容、阻断交互或抛出未处理异常。

## 6. 材质和效果分层

### 6.1 视觉堆叠顺序

从背景到前景：

```text
页面真实背景
  ↓
Refraction / 背景采样与折射层          z-index: 0
  └─ Dynamic Specular 在 SVG filter 内部合成
  ↓
Material Base / 半透明材质基底         z-index: 0，DOM 顺序靠后
  ↓
Surface Sheen / 静态表面边缘高光       z-index: 0，DOM 顺序最靠后
  ↓
Selection Indicator / 共享选中胶囊    z-index: 1
  ↓
TabBarItem Content / 图标与文字        z-index: 2
```

Refraction、Material Base 和 Surface Sheen 都使用 `z-index: 0`，由 DOM 顺序决定同层绘制顺序。Material Base 会以半透明底色覆盖折射结果，Surface Sheen 再绘制在基底上方。

所有装饰层必须满足：

```css
position: absolute;
inset: 0;
border-radius: inherit;
pointer-events: none;
```

### 6.2 Refraction

Refraction 层通过 `backdrop-filter` 处理 TabBar 后方的真实页面内容。

CSS fallback：

```text
真实背景 → blur(12px) → saturate(140%)
```

Chromium 增强：

```text
真实背景
  → feGaussianBlur
  → displacement map
  → feDisplacementMap
  → refracted
```

该层负责：

- 背景网格、文字和图片的几何偏移。
- 边缘折射范围和方向。
- 中心区域稳定性。
- 折射前的背景清晰度。

### 6.3 Dynamic Specular

Dynamic Specular 不是独立 DOM 层，也不属于 Material Base。它是 Refraction 层的 SVG filter 内部处理阶段，因此没有独立 `z-index`，最终结果随 Refraction 层以 `z-index: 0` 输出。

处理流程：

```text
refracted
  ├─ feColorMatrix saturate
  ├─ 使用 specular map 裁切局部高饱和背景
  └─ 与原折射背景合成

specular map
  ├─ 调节 Alpha
  └─ screen 混合白色镜面高光
```

Dynamic Specular 同时贡献：

- 高光区域内的折射背景饱和度。
- 白色方向性镜面高光。

### 6.4 Material Base

Material Base 是覆盖在折射结果上方的半透明底色，并承载外部阴影。

职责：

- 提供稳定的材质色调。
- 降低复杂背景对内容可读性的干扰。
- 控制折射可见度。
- 通过阴影表达悬浮层级。

Material Base 不执行背景位移，也不生成动态高光。

### 6.5 Surface Sheen

Surface Sheen 是纯 CSS 静态轮廓光。当前实现使用带 mask 的 2px 垂直渐变边缘环。

它与 Dynamic Specular 的区别：

| 项目                       | Dynamic Specular | Surface Sheen                |
| -------------------------- | ---------------- | ---------------------------- |
| 所在位置                   | SVG filter 内部  | 独立 CSS DOM 层              |
| 是否受 `lightAngle` 控制   | 是               | 否                           |
| 是否需要纹理               | 是               | 否                           |
| 是否依赖 Chromium SVG 增强 | 是               | 否                           |
| 是否操作折射背景           | 是               | 否                           |
| 主要用途                   | 动态镜面响应     | 静态边缘轮廓和 fallback 质感 |

Surface Sheen 当前没有公开或内部滑块参数，其宽度、方向、Alpha 和渐变节点均为公共 Less 中的固定值。

### 6.6 Elevation Shadow

Shadow 不是单独的覆盖层，而是 Material Base 的外部投影。

它用于：

- 区分悬浮 TabBar 和页面背景。
- 提高浅色或复杂背景下的轮廓识别。
- 配合明暗主题表达不同的悬浮深度。

### 6.7 Selection Indicator

共享选中胶囊是交互状态层，不属于 Glass 光学模型。

当前行为：

- 仅在 `effect="glass" && shape="round"` 时渲染。
- 宽度按 TabBarItem 数量计算。
- 使用 `translate3d()` 在选项之间移动。
- 使用半透明品牌色背景和独立边缘高光。
- 在 `prefers-reduced-motion: reduce` 下关闭过渡。

### 6.8 Content

TabBarItem 图标、文字和交互位于 `z-index: 2`。视觉层不得影响：

- 点击区域。
- `onChange`。
- 选中值更新。
- 二级菜单或其他 TabBarItem 行为。
- `role="tablist"` 和子项语义。

## 7. Chromium SVG 光学管线

完整滤镜图：

```text
SourceGraphic
  → feGaussianBlur                         result: blurred-source

blurred-source + displacement-map
  → feDisplacementMap                      result: refracted

refracted
  → feColorMatrix(type="saturate")         result: refracted-saturated

refracted-saturated + specular-map
  → feComposite(operator="in")             result: masked-specular

specular-map
  → feComponentTransfer(alpha slope)       result: faded-specular

masked-specular + refracted
  → feBlend(mode="normal")                 result: refracted-highlight

faded-specular + refracted-highlight
  → feBlend(mode="screen")                 final output
```

SVG `<filter>` 自身是 `width="0" height="0"` 的定义节点，不是可见层，也没有独立 z-index。Refraction DOM 层通过私有 CSS variable 引用实例专属 filter ID。

## 8. 纹理生成

### 8.1 输入

纹理生成器接收：

- CSS width。
- CSS height。
- 计算后的圆角 radius。
- DPR。
- 内部 tuning。

### 8.2 Displacement map

- R 通道控制水平位移。
- G 通道控制垂直位移。
- 中性值为 `128/128`。
- 材质外部 Alpha 为 0。
- 中心区域保持中性，不应发生整体漂移。
- 位移主要限制在 bezel 区域。

### 8.3 Specular map

- RGB 固定为白色。
- Alpha 表示方向性镜面高光强度。
- 光源方向由 `lightAngle` 转换为二维向量。
- 高光应从边缘向中心连续衰减，不允许出现明显断层。
- Specular map 是滤镜控制纹理，不是 Material Base。

### 8.4 编码

RGBA 数组通过临时 Canvas、`ImageData` 和 `toDataURL('image/png')` 编码为 data URL，再传入 SVG `feImage`。

Canvas 只负责编码，纹理算法应保持为可直接测试的纯数据逻辑。编码完成后应释放 Canvas 尺寸和引用。

## 9. 参数模型

### 9.1 公共 API

| 参数     | 默认值   | 作用                                    |
| -------- | -------- | --------------------------------------- |
| `effect` | `normal` | 选择普通或 Glass 材质                   |
| `shape`  | `normal` | 选择普通或 round 外形，与 `effect` 正交 |

光学参数不进入 v1 公共 API。

### 9.2 内部光学参数

| 参数                 | 当前默认值 |          Demo 范围 | 主要归属                      | 作用                       |
| -------------------- | ---------: | -----------------: | ----------------------------- | -------------------------- |
| `surface`            | `squircle` | `squircle` / `lip` | Refraction                    | 选择折射截面轮廓           |
| `thicknessRatio`     |      `0.7` |              `0–2` | Refraction                    | 控制等效厚度和折射曲线幅度 |
| `bezelRatio`         |     `0.85` |            `0.1–1` | Refraction + Dynamic Specular | 控制边缘效果覆盖宽度       |
| `refractiveIndex`    |      `1.5` |            `1–2.5` | Refraction                    | 控制折射率差               |
| `displacementGain`   |        `1` |              `0–2` | Refraction                    | 缩放最终位移强度           |
| `blur`               |    `0.4px` |            `0–4px` | Refraction                    | 位移前背景模糊             |
| `specularOpacity`    |      `0.5` |              `0–1` | Dynamic Specular              | 控制白色高光 Alpha         |
| `specularSaturation` |        `2` |              `1–6` | Dynamic Specular              | 控制高光区域背景饱和度     |
| `lightAngle`         |   `270deg` |         `0–360deg` | Dynamic Specular              | 控制受光方向               |
| `textureDpr`         |   设备 DPR |         Demo `1–2` | Rendering Quality             | 控制纹理采样质量           |

内部默认值是实现细节，不属于兼容性承诺。维护者可以通过验证结果调整默认值，但不得在未更新像素测试、性能数据和视觉证据时静默改变。

### 9.3 材质外观和 fallback 参数

| 参数或 Token                       | 当前默认值                    | 归属          | 说明               |
| ---------------------------------- | ----------------------------- | ------------- | ------------------ |
| `--td-tab-bar-glass-bg-color`      | Light `rgba(255,255,255,42%)` | Material Base | Glass 底色和透明度 |
| `--td-tab-bar-glass-bg-color`      | Dark `rgba(36,36,36,46%)`     | Material Base | 暗色 Glass 底色    |
| `--td-tab-bar-glass-shadow`        | 主题相关双层阴影              | Elevation     | 悬浮深度           |
| `--td-tab-bar-glass-fallback-blur` | `12px`                        | CSS fallback  | 普通背景模糊       |
| `saturate(140%)`                   | 固定值                        | CSS fallback  | 当前未提供 Token   |
| `--td-tab-bar-selected-bg-color`   | 品牌色                        | Selection     | 选中胶囊颜色       |
| `--td-tab-bar-selected-bg-opacity` | `16%`                         | Selection     | 选中胶囊透明度     |

Surface Sheen 的 2px 宽度、渐变方向和 Alpha 节点当前为固定 Less，不是 Token。

### 9.4 几何和 Demo 参数

下列参数用于诊断或布局验证，不属于 Glass 公共 API：

- TabBar width：Demo `280–620px`。
- TabBar height：Demo `52–88px`。
- Background scale、X、Y。
- Grid、text、image 背景。
- 背景自动移动。
- 多实例开关。
- Normal、fallback、final 对照模式。

## 10. CSS fallback

### 10.1 始终保留的效果

即使 SVG 增强不可用，Glass DOM 仍提供：

- 半透明材质底色。
- Light/Dark 主题底色。
- 外部悬浮阴影。
- round 胶囊轮廓。
- 静态 Surface Sheen。
- 共享选中胶囊及其动画。
- 图标、文字和全部交互。

### 10.2 支持普通 backdrop-filter 时

Refraction 层使用：

```css
backdrop-filter: blur(var(--td-tab-bar-glass-fallback-blur)) saturate(140%);
```

### 10.3 完全不支持 backdrop-filter 时

浏览器会忽略该属性，但 Material Base、Shadow、Surface Sheen、Selection 和 Content 仍必须可见。底色透明度需要保证内容可读，不能依赖 blur 才形成可用界面。

### 10.4 fallback 不具备的能力

纯 CSS fallback 不提供：

- 背景网格、文字或图片的几何弯曲。
- displacement map 位移。
- 基于折射后背景的局部 Specular saturation。
- Canvas Specular map 的动态白色高光。
- 根据 `surface`、厚度和折射率变化的真实背景相关效果。

### 10.5 可选增强方向

以下内容可以作为未来 CSS fallback 改进，但必须标记为视觉近似：

- 完整半透明外描边。
- 可旋转的 CSS 渐变高光。
- 多层 inset shadow 表达边缘厚度。
- `brightness()`、`contrast()` 和可调 `saturate()`。
- 使用 CSS mask 限制边缘高光范围。

不得用这些静态效果替代“真实背景折射”的验收证据。

## 11. 能力检测与浏览器边界

SVG 增强启用前必须同时满足：

- 客户端存在 `window` 和 `document`。
- 当前引擎被识别为 Chromium。
- 存在 `ResizeObserver`。
- 存在 `requestAnimationFrame` 和 `cancelAnimationFrame`。
- 存在 `ImageData`。
- 存在 `CSS.supports()`。
- `CSS.supports('backdrop-filter', 'url("#filter")')` 返回 true。

当前实现主动限制为 Chromium。非 Chromium 环境并不是完全没有 Glass，而是只使用 CSS fallback。

维护者不得仅根据 `CSS.supports()` 判断视觉正确性。语法支持不等于背景位移实际生效，仍需真实浏览器和背景相关性验证。

## 12. 生命周期

### 12.1 SSR

- SSR 输出 Glass 基线 DOM。
- SSR 不生成 Canvas 纹理。
- SSR 不输出实例 SVG filter。
- 服务端不得访问 `window`、`document`、Canvas 或 `ResizeObserver`。

### 12.2 客户端挂载

1. `onMounted` 标记运行时可用。
2. 检查能力。
3. 创建或复用当前实例的 `ResizeObserver`。
4. 用一次 `requestAnimationFrame` 合并测量和重建。
5. 读取尺寸和圆角。
6. 生成 displacement/specular RGBA。
7. 编码 data URL。
8. 生成实例唯一 filter ID。
9. 设置 Refraction 层的私有 CSS variable。

### 12.3 更新

以下变化触发按需重建：

- TabBar 尺寸变化。
- `shape` 变化。
- Demo 私有 tuning 变化。
- Glass 从关闭切换为开启。

相同尺寸、圆角、DPR 和 tuning 的签名不得重复生成。

### 12.4 清理

切换为 `effect="normal"` 或组件卸载时必须：

- 断开 `ResizeObserver`。
- 取消待执行的 animation frame。
- 清空 filter state。
- 清空尺寸签名。
- 释放 filter ID 引用。

任何生成、Canvas、`ImageData`、`toDataURL` 或 SVG 能力失败都应清除增强状态并保留 CSS fallback。

## 13. 多实例和 ID

- 每个 TabBar 实例必须使用唯一 filter ID。
- CSS variable 只设置在当前实例的 Refraction 层。
- 不允许使用固定全局 SVG ID。
- 不允许多个 TabBar 共享可变纹理状态。
- 多实例测试必须验证视觉和 DOM 引用不串用。

## 14. 性能约束

当前硬限制：

- 最大 DPR：`2`。
- 单张纹理最大总像素数：`512K` pixels，即 `524,288` pixels；不要求固定宽高组合。
- 超出预算时按比例缩小宽高，保持纹理宽高比。
- 位移 scale 上限：`18px`。
- 尺寸回调通过单次 rAF 合并。
- 静止状态不得持续重建。
- 不得存在持续 rAF、定时器或全局 resize 监听。

目标性能门槛：

- 390px TabBar 单次纹理生成不超过 16ms。
- 620px TabBar 单次纹理生成不超过 30ms。
- 高频 resize 后只执行最后一次有效重建。
- 静止 5 秒后重建计数保持不变。

性能结果必须在真实浏览器中记录，单元测试耗时不能替代浏览器生成耗时。

## 15. 主题、无障碍和交互

- Light 和 Dark 必须有独立 Material Base 与 Shadow 默认值。
- Glass 层必须 `aria-hidden="true"`。
- Glass 层必须 `pointer-events: none`。
- `<svg>` 只作为滤镜定义，必须隐藏且不可聚焦。
- TabBarItem 点击、选中和 `onChange` 不得改变。
- Selection 动画应遵守 `prefers-reduced-motion`。
- fallback 在缺少 blur 时仍需满足文字和图标对比度。
- 高光不得降低选中和未选中状态的辨识度。

## 16. Demo 与诊断

### 16.1 综合 Demo

路由：

```text
#/tab-bar/liquid-glass
```

用途：

- Normal、CSS fallback、Final Glass 并排比较。
- Grid、text、image 背景。
- 背景拖拽、缩放和自动移动。
- Light/Dark、尺寸、safe area、fixed 和多实例验证。
- 内部参数调校和性能指标。

### 16.2 分层检查 Demo

路由：

```text
#/tab-bar/liquid-glass-inspector
```

用途：

- 单独观察 Refraction。
- 单独观察 Specular overlay。
- 查看原始 Specular map。
- 单独观察 Surface Sheen。
- 与 Final Glass 使用相同背景和参数对照。

诊断背景应支持 grid、text、image，并共享拖拽和缩放状态。

## 17. 测试要求

### 17.1 纹理像素测试

必须覆盖：

- 相同输入逐字节确定性。
- 中心 R/G 为中性值。
- 左右、上下边缘产生相反位移。
- 圆角外透明。
- Specular Alpha 受光源方向控制。
- Specular 向中心连续衰减。
- bezel `1x` 等于 radius。
- 极端 radius 自动限制。
- 零尺寸返回不可增强结果。
- DPR 和像素预算限制。

### 17.2 组件和生命周期测试

必须覆盖：

- 默认 `normal` 不渲染 Glass 运行时 DOM。
- Glass 挂载后创建层和 filter。
- SSR 只输出 CSS 基线。
- hydration 无结构不一致。
- 多实例 ID 唯一。
- resize 同帧合并。
- `shape` 变化重建。
- `effect` 切换创建和清理资源。
- 卸载断开 observer 并取消帧。
- Canvas、`ImageData`、`toDataURL` 和能力失败自动 fallback。
- 无 `ResizeObserver` 时不注册全局 resize。
- 点击、选中、二级行为和 `onChange` 回归。

### 17.3 CSS 和视觉测试

必须覆盖：

- Normal 样式无回归。
- CSS fallback 在 blur 不支持时仍可读。
- Light/Dark。
- `shape="normal"` 和 `shape="round"`。
- fixed、placeholder、safe area、bordered。
- Decoration 不遮挡 TabBarItem。
- Selection 胶囊动画与 reduced motion。

### 17.4 浏览器测试

使用真实 Chromium 内核验证：

- Grid 边缘至少产生可观察的背景几何位移。
- 中心区域无明显整体漂移。
- 更换 grid、text、image 后折射内容随背景变化。
- 移动背景后折射仍采样真实背景。
- 多实例无串用。
- 连续切换 effect/shape 无残留。
- 320、390、430、620px 无裁切。
- DPR 1/2 纹理符合预算。
- 静止时无持续 CPU 活动。
- 控制台无 error、hydration warning 或资源异常。

### 17.5 建议执行命令

```bash
npx vitest run src/tab-bar/__test__/liquid-glass-map.test.ts
npx vitest run src/tab-bar/__test__/liquid-glass.test.tsx
npx vitest run src/tab-bar/__test__/liquid-glass-inspector.test.tsx
npx vitest run src/tab-bar/__test__/index.test.jsx
npm run test:demo
npm run test:snap
npm run lint
npx vue-tsc --noEmit --skipLibCheck
npm run build
git diff --check
```

测试通过只能证明当前本地实现满足对应检查，不代表来源合规、跨仓同步、远程 CI 或 PR 审核已经完成。

## 18. 故障排查

| 现象                      | 优先检查                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| 只有模糊，没有背景弯曲    | Chromium 检测、`CSS.supports()`、filter CSS variable、`feDisplacementMap` |
| 完全没有 blur             | 浏览器 `backdrop-filter` 支持、fallback blur Token、Material Base 可读性  |
| 背景弯曲但高光缺失        | Specular data URL、Alpha 覆盖率、`specularOpacity`、SVG blend graph       |
| 高光靠近中心出现断层      | Specular 内缘衰减是否连续、Alpha 是否过早归零                             |
| bezel 参数后半程无变化    | bezel 是否按 radius 计算、是否提前 clamp                                  |
| 中心图案消失或漂移        | 中心 displacement 是否保持 `128/128`                                      |
| resize 后裁切             | filter 区域、最新 width/height、observer/rAF 合并                         |
| 两个 TabBar 效果串用      | filter ID、CSS variable 作用域、实例状态                                  |
| 切换 normal 后仍有 filter | `stop()`、observer、scheduled frame 和 filter state 清理                  |
| SSR hydration warning     | 服务端是否输出了客户端 filter 或尺寸相关结构                              |
| 控制台出现 Canvas 异常    | `ImageData`、2D context、`toDataURL` 失败降级                             |

## 19. 已知限制

- 完整背景位移当前只支持并验证 Chromium。
- Chromium 判断依赖 user agent / userAgentData，未来可能需要更稳健的能力验证。
- `CSS.supports()` 只能证明语法接受，不能证明滤镜视觉正确。
- Surface Sheen 是固定方向，与 `lightAngle` 不同步。
- Surface Sheen 依赖 CSS mask 和 `mask-composite: exclude`；不支持该组合时必须验证渐变不会覆盖整个内容区域。
- fallback 的 `saturate(140%)` 当前是硬编码值。
- 当前没有独立完整外轮廓 border Token，外缘主要依赖 Surface Sheen 和 Shadow。
- Dynamic Specular 与 Refraction 在同一个 SVG 输出中，不能通过 z-index 单独排序。
- Selection Indicator 只存在于 Glass round 模式。
- Data URL 编码会产生短时内存开销。
- 调参 Demo 的参数范围不是公共兼容性契约。
- 当前本地 PASS 记录不能替代当前 HEAD、跨仓和远程 CI 的重新验证。

## 20. 来源与合规边界

正式 PR 前必须完成模块级来源审计。

当前光学核心包括：

- 曲面函数。
- 折射 profile。
- displacement/specular 纹理算法。
- SVG filter graph。
- 参数和默认值。

这些内容不得仅通过改名、调整常量或重排代码就声明为独立实现。如果相关实现与无明确许可证的外部项目结构高度相似，应执行以下二选一：

1. 根据行为规格独立重写光学核心，并保留独立设计记录和验收证据。
2. 获得明确的书面授权并确认许可证覆盖范围。

组件基础设施可以独立保留，包括：

- 公共 API 接线。
- SSR/hydration 结构。
- 唯一 ID。
- ResizeObserver 和 rAF 生命周期。
- CSS fallback。
- 主题 Token。
- Selection、布局和交互测试。

在来源问题解决前，不得把当前实现描述为已完成 clean-room、可正式发布或 PR-ready。

## 21. 维护规则

- 默认 `effect="normal"` 必须零运行时开销、零 Glass DOM。
- 不得把内部光学参数加入公开 API，除非有明确产品需求和跨框架设计。
- 修改纹理算法时必须同时更新像素测试和 Edge Dev 视觉证据。
- 修改层级时必须检查 Material Base 是否意外遮蔽折射和高光。
- 修改 Surface Sheen 时必须与 Dynamic Specular 分开验收。
- 修改公共 Less 后必须同步组件仓 `src/_common` 指针或对应提交。
- 修改 API 必须从 `tdesign-api` 生成，不能手改生成文件。
- 新增视觉层必须 `aria-hidden`、pointer-transparent，并脱离 flex 尺寸计算。
- 新增动画必须支持 `prefers-reduced-motion`。
- 新增性能逻辑不得引入持续 rAF、全局监听或无上限纹理。
- 不得提交研究原型、竞争实现源码或无明确来源的资源。

## 22. 合入前检查清单

- [ ] `effect` API 在 API/common/mobile 三仓一致。
- [ ] `normal` DOM、快照、样式和交互无回归。
- [ ] CSS fallback 在无 SVG、无 Canvas、无 ResizeObserver 时可读。
- [ ] SSR/hydration 通过。
- [ ] 多实例、resize、effect/shape 切换和卸载清理通过。
- [ ] 像素预算、DPR 和性能门槛通过。
- [ ] Edge Dev 的 grid/text/image、Light/Dark、尺寸和 DPR 证据完整。
- [ ] Surface Sheen、Dynamic Specular 和 Refraction 可独立诊断。
- [ ] 当前 HEAD 执行 lint、typecheck、test、snapshot 和 build。
- [ ] `tdesign-common` 多框架 CI 扇出全部通过。
- [ ] 来源审计完成，或已获得明确授权。
- [ ] 三个 PR 互相链接，并说明提交顺序和依赖关系。

## 23. 关键文件索引

### tdesign-common

```text
style/mobile/components/tab-bar/_index.less
style/mobile/components/tab-bar/_var.less
style/mobile/theme/_components.less
docs/mobile/api/tab-bar.md
docs/mobile/api/tab-bar.en-US.md
```

### tdesign-mobile-vue

```text
src/tab-bar/type.ts
src/tab-bar/props.ts
src/tab-bar/tab-bar.tsx
src/tab-bar/liquid-glass-map.ts
src/tab-bar/useTabBarGlassFilter.ts
src/tab-bar/demos/liquid-glass.vue
src/tab-bar/demos/liquid-glass-inspector.vue
src/tab-bar/__test__/liquid-glass-map.test.ts
src/tab-bar/__test__/liquid-glass.test.tsx
src/tab-bar/__test__/liquid-glass-inspector.test.tsx
src/tab-bar/__test__/index.test.jsx
```

### tdesign-api

```text
packages/products/tdesign-mobile-vue/src/tab-bar/type.ts
packages/products/tdesign-mobile-vue/src/tab-bar/props.ts
packages/products/tdesign-mobile-vue/src/tab-bar/tab-bar.md
packages/products/tdesign-mobile-vue/src/tab-bar/tab-bar.en-US.md
```
