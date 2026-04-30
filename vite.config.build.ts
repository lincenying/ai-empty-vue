import type { BuildOptions, ServerOptions } from 'vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const outDir = '../_build/chat_v2_2'

interface CbmDevProxy {
    on: (event: string, listener: (...args: unknown[]) => void) => unknown
}

function configureCbmDevProxy(proxy: CbmDevProxy): void {
    proxy.on('proxyRes', (...args: unknown[]) => {
        const proxyRes = args[0] as { headers?: Record<string, string | string[] | undefined> }
        const res = args[2] as { setHeader?: (name: string, value: string) => void }
        const raw = proxyRes.headers?.['content-type']
        const ct = typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] ?? '' : ''
        if (!ct.includes('text/event-stream'))
            return
        proxyRes.headers!['cache-control'] = 'no-store, no-transform'
        proxyRes.headers!['x-accel-buffering'] = 'no'
        res.setHeader?.('x-accel-buffering', 'no')
    })
}

const config: { server: ServerOptions, build: BuildOptions } = {
    server: {
        port: 5173,
        proxy: {
            // 代理配置
            '/cbm': {
                target: 'http://192.168.5.202:18101',
                // target: 'http://192.168.5.210:18101',
                // target: "http://192.168.5.166:18101",
                changeOrigin: true,
                ws: true,
                configure: configureCbmDevProxy,
            },
        },
    },
    build: {
        target: 'es2018',
        cssTarget: 'chrome79',
        minify: true,
        assetsInlineLimit: 4096,
        chunkSizeWarningLimit: 1000,
        outDir,
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html'),
            },
            external: /static\/.*?\.[cm]*js/,
            output: {
                manualChunks(id: string) {
                    // 处理css分块
                    // if (id.includes('.css') || id.includes('.scss') || id.includes('.sass') || id.includes('.less')) {
                    //     if (id.includes('node_modules'))
                    //         return 'vendor'
                    //     return 'main'
                    // }
                    if (id.includes('node_modules')) {
                        if (!id.includes('echarts') && !id.includes('zrender')) {
                            return 'vendor'
                        }
                        return 'echarts'
                    }
                    if (id.includes('__uno.css')) {
                        return 'unocss'
                    }
                },
            },
        },
    },
}

export default config
