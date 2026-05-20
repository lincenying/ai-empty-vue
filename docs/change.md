# 变更记录

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
