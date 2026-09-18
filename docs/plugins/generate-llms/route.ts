/**
 * llms.txt 规范产物的站点路由（浏览器运行时工具）。
 *
 * 正式环境分域部署：主域名（如 https://tdesign.tencent.com/vue-next/）只部署 HTML 入口文件，
 * llms 产物（llms.txt / llms-full.txt / llms/<slug>.md）部署在静态资源域名（即 vite `base`，
 * 如 https://static.tdesign.tencent.com/vue-next/llms.txt）。主域名路径被 SPA 兜底（返回 index.html）时，
 * 由这里创建的路由优先命中，将浏览器整体跳转到对应静态文件，保证正式主域名 URL 直接可达。
 *
 * 注意：本文件供各站点浏览器代码导入，必须保持纯净（无 Node / vite 构建期依赖），
 * 因此不要从 index.ts（含 fs 依赖）导入，也不要在 index.ts 中再导出本文件。
 */

/** 守卫所需的导航目标信息（vue-router RouteLocationNormalized 的最小结构） */
export interface LlmsRouteLocation {
  path: string;
  params: Record<string, string | string[]>;
}

export interface LlmsRedirectRouteOptions {
  /** 站点路径前缀，如 '/vue-next'、'/vue-next-chat' */
  prefix: string;
  /**
   * 产物部署基址，默认取 vite 的 `import.meta.env.BASE_URL`：
   * 生产为静态资源域名（以 / 结尾），本地为 '/'。
   */
  baseUrl?: string;
}

export interface LlmsRedirectRoute {
  path: string;
  beforeEnter: (to: LlmsRouteLocation) => boolean;
}

/** 以类型安全的方式读取 import.meta.env.BASE_URL（本模块不依赖 vite/client 类型声明） */
function resolveBaseUrl(baseUrl?: string): string {
  if (baseUrl) return baseUrl;
  const meta = import.meta as unknown as { env?: { BASE_URL?: string } };
  return meta.env?.BASE_URL || '/';
}

/**
 * 创建 llms.txt 规范产物的跳转路由，spread 进各站点路由表即可。
 *
 * 路由只做一件事：`beforeEnter` 中整体跳转（`window.location.replace`）到
 * `<baseUrl>/llms.txt|llms-full.txt|llms/<slug>.md` 静态文件，并返回 false 取消当前 SPA 导航。
 * 另附带「页面路径 + .md」兼容跳转：`<prefix>/components/<slug>.md` 同样跳转到 `<baseUrl>/llms/<slug>.md`。
 * 静态路径天然优先于动态 catch-all（如 `/:w+`），但建议仍放在路由表靠前位置以便阅读。
 */
export function createLlmsRedirectRoutes(options: LlmsRedirectRouteOptions): LlmsRedirectRoute[] {
  const { prefix, baseUrl } = options;

  const redirectTo = (relPath: string): boolean => {
    const base = resolveBaseUrl(baseUrl).replace(/\/+$/, '');
    window.location.replace(`${base}/${relPath.replace(/^\/+/, '')}`);
    return false;
  };

  return [
    {
      path: `${prefix}/llms.txt`,
      beforeEnter: () => redirectTo('llms.txt'),
    },
    {
      path: `${prefix}/llms-full.txt`,
      beforeEnter: () => redirectTo('llms-full.txt'),
    },
    {
      path: `${prefix}/llms/:file([^/]+\\.md)`,
      beforeEnter: (to) => redirectTo(`llms/${String(to.params.file ?? '')}`),
    },
    {
      // 兼容 LLM 惯用的「页面路径 + .md」猜测地址：组件文档页 URL 追加 .md 时，
      // 跳转到对应 llms 产物（<prefix>/components/<name>.md -> <base>/llms/<name>.md）。
      // 静态路由 components/<name> 优先级更高，正常组件页不受影响。
      path: `${prefix}/components/:file([^/]+\\.md)`,
      beforeEnter: (to) => redirectTo(`llms/${String(to.params.file ?? '')}`),
    },
  ];
}
