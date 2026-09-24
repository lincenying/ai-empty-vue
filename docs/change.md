# 变更记录

## 2026-09-24 16:16:59

### 改动内容

- 新增空白首页 `src/pages/home-page.vue`
- 将 `/` 路由指向首页

### Commit Message

```
feat: 新增空白首页
```

## 2026-08-20 14:09:00

### 改动内容

- 修复 UnoCSS 66.7 / 66.8 混用导致 `vite` 启动崩溃（`activatedRules` 为 undefined）
- 在 `pnpm-workspace.yaml` 增加 overrides，强制 `unocss` 及相关 `@unocss/*` 统一为 66.8.0

### Commit Message

```
fix: 统一 UnoCSS 版本以修复开发服务器启动失败
```

## 2026-07-21 16:55:00

### 改动内容

- 修复 `src/config/element.ts` 中 `NodeJS.Timeout` 类型在浏览器 tsconfig 下找不到命名空间的问题，改为 `ReturnType<typeof setTimeout>`

### Commit Message

```
fix: 修复 NProgress 定时器类型依赖 NodeJS 命名空间的问题
```

## 2026-05-20

### 改动内容

- 修复 `config/index.ts` 环境变量与 `.env` 对齐（`VITE_APP_API`、`VITE_APP_API_DOMAIN`）
- 移除缺失字体引用，`#root` 改为 `#app`
- 统一事件总线为 mitt，提供 `emitNeedLogin` 等辅助方法；fetch 401 触发登录流程
- `main.ts` 注册 Element Plus 插件，补充 NProgress 样式
- 清理历史残留：`shims.d.ts`、无效 loading、`@unhead/vue` 自动导入、echarts 分包、旧 outDir
- 构建输出改为 `dist/`，保留 `/cbm` 代理、版本更新检测、px→rem 方案
- 补充 `api/`、`pages/`、`layouts/`、`stores/`、`components/` 目录骨架与 README

### Commit Message

```
refactor: 优化空项目模板并修复构建与类型检查问题
```
