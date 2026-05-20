import type { BuildOptions, ServerOptions } from 'vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const outDir = 'dist'

interface CbmDevProxy {
    on: (event: string, listener: (...args: unknown[]) => void) => unknown
}

/**
 * 开发代理 SSE 流式响应时禁用缓冲
 */
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
            '/cbm': {
                target: 'http://192.168.5.202:28080',
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
                    if (id.includes('node_modules')) {
                        return 'vendor'
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
