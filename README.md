# AI Empty Vue

Vue 3 + TypeScript + Vite 空项目模板，内置 Element Plus、UnoCSS、Pinia、Vue Router。

## 特性

- **开发代理**：`/cbm` 转发至后端（见 `vite.config.build.ts`）
- **版本更新检测**：生产环境轮询 `timestamp.json`，有新版本时提示刷新
- **px → rem**：`design.config.ts` + `postcss-px-to-viewport-8-plugin` + UnoCSS rem 配置

## 快速开始

```bash
pnpm install
pnpm dev
```

## 脚本

| 命令            | 说明                                          |
| --------------- | --------------------------------------------- |
| `pnpm dev`      | 开发服务器                                    |
| `pnpm build`    | 生产构建（输出 `dist/`，含 `timestamp.json`） |
| `pnpm preview`  | 预览构建产物                                  |
| `pnpm lint`     | ESLint                                        |
| `pnpm lint:ts`  | TypeScript 类型检查                           |
| `pnpm lint:fix` | ESLint 自动修复                               |

## 环境变量

| 变量                  | 说明                                                    |
| --------------------- | ------------------------------------------------------- |
| `VITE_APP_ENV`        | 环境标识：development / production / pre-release / test |
| `VITE_APP_API`        | 接口前缀，如 `/api`                                     |
| `VITE_APP_API_DOMAIN` | 静态资源或接口域名前缀                                  |

配置文件：`.env.development`、`.env.production`、`.env.staging`、`.env.test`

## 目录结构

```
src/
├── api/          # 接口封装
├── assets/       # 静态资源与全局样式
├── components/   # 公共组件
├── composables/  # 组合式函数（含 fetch、emitter）
├── config/       # 应用配置（Element、环境变量）
├── layouts/      # 布局
├── pages/        # 页面
├── router/       # 路由
├── stores/       # Pinia
├── types/        # 类型定义
└── utils/        # 工具函数
```

## 代理说明

开发时请求 `/cbm/*` 会代理到 `vite.config.build.ts` 中配置的 `target`，SSE 流式响应已禁用代理缓冲。

## 版本更新检测

生产构建会在 `dist/timestamp.json` 写入构建时间戳；`App.vue` 中 `TimestampChecker` 定时对比，发现变化后弹出 Element Plus 通知引导刷新。
