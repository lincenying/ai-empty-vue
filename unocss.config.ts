import type { Preset } from 'unocss'
import { webConfig, webRemConfig } from '@lincy/unocss-base-config'
import { fontSize, needRem } from './src/design.config.ts'

/** UnoCSS / Tailwind 无单位尺寸与 xl 等命名档按 16px 根字号生成 rem */
const TAILWIND_ROOT_FONT_SIZE = 16

/**
 * html font-size 为设计稿基准（100）时，把按 16px 根字号写出的 rem 换成当前根字号下的等像素值。
 * 例如 h-20 为 5rem（80px）→ 0.8rem，p-6 为 1.5rem（24px）→ 0.24rem，w-xl / rounded-xl 同理。
 * 必须排在 px→rem 之前，避免稿面 px 被再缩一次。
 */
function presetScaleRem(baseFontSize: number): Preset {
    const scale = TAILWIND_ROOT_FONT_SIZE / baseFontSize
    return {
        name: 'preset-scale-rem',
        enforce: 'pre',
        postprocess(util) {
            util.entries.forEach((entry) => {
                const value = entry[1]
                if (typeof value !== 'string' || !value.includes('rem'))
                    return
                entry[1] = value.replace(/(-?(?:\d+(?:\.\d+)?|\.\d+))rem/g, (_, raw: string) => {
                    const rem = Number((Number(raw) * scale).toFixed(6))
                    return `${rem}rem`
                })
            })
        },
    }
}

const base = needRem ? webRemConfig({ baseFontSize: fontSize }, 'wind3', { preflight: 'on-demand' }) : webConfig('wind3', { preflight: 'on-demand' })

export default {
    ...base,
    presets: [
        ...needRem ? [presetScaleRem(fontSize)] : [],
        ...(base.presets ?? []),
    ],
    theme: {
        ...base.theme,
        colors: {
            ...(base.theme as { colors?: Record<string, unknown> })?.colors,
            primary: {
                50: '#eff6ff',
                100: '#dbeafe',
                200: '#bfdbfe',
                300: '#93c5fd',
                400: '#60a5fa',
                500: '#3b82f6',
                600: '#2563eb',
                700: '#1d4ed8',
                800: '#1e40af',
                900: '#1e3a8a',
            },
        },
    },
    shortcuts: [
        ...(Array.isArray(base.shortcuts) ? base.shortcuts : []),
        {
            'shadow-card': 'shadow-[0_1px_3px_0_rgba(16,42,100,0.04),0_4px_16px_-2px_rgba(16,42,100,0.06)]',
            'shadow-card-hover': 'shadow-[0_4px_12px_0_rgba(16,42,100,0.06),0_12px_32px_-4px_rgba(16,42,100,0.10)]',
            'shadow-soft': 'shadow-[0_2px_8px_rgba(16,42,100,0.05)]',
        },
    ],
}
