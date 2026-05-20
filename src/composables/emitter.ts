import mitt from 'mitt'

/** 事件类型定义 */
export interface IEmitterEvents {
    'no-auth': void
    'need-login': void
    'api-error': string
    'cancel-interval': void
    'nprogress-start': string
    'nprogress-done': string
}

type EmitterEventsMap = {
    [K in keyof IEmitterEvents]: IEmitterEvents[K]
} & Record<string, unknown>

const emitter = mitt<EmitterEventsMap>()

/** 触发未授权事件 */
export function emitNoAuth(): void {
    emitter.emit('no-auth')
}

/** 触发需要登录事件 */
export function emitNeedLogin(): void {
    emitter.emit('need-login')
}

/** 触发接口错误事件 */
export function emitApiError(message: string): void {
    emitter.emit('api-error', message)
}

/** 触发取消轮询事件 */
export function emitCancelInterval(): void {
    emitter.emit('cancel-interval')
}

/** 触发 NProgress 开始 */
export function emitNprogressStart(type: string): void {
    emitter.emit('nprogress-start', type)
}

/** 触发 NProgress 结束 */
export function emitNprogressDone(type: string): void {
    emitter.emit('nprogress-done', type)
}

export default emitter
