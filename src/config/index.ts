/** 是否服务端渲染 */
export const isSSR = import.meta.env.SSR

/** 接口前缀 */
export const baseUrl = import.meta.env.VITE_APP_API

/** 静态资源 / 接口域名前缀 */
export const assetsUrl = import.meta.env.VITE_APP_API_DOMAIN

/** 获取接口前缀 */
export const getBaseUrl = () => import.meta.env.VITE_APP_API

/** 获取静态资源前缀 */
export const getAssetsUrl = () => import.meta.env.VITE_APP_API_DOMAIN
