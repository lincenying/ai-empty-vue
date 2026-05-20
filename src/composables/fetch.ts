import type { FetchOptions } from 'ofetch'
import type { Methods, ServiceType } from '@/types/fetch.types'
import { isFormData, objToCookies } from '@lincy/utils'
import { ElMessage } from 'element-plus'
import { ofetch } from 'ofetch'
import qs from 'qs'
import emitter, { emitNeedLogin } from '@/composables/emitter'
import { baseUrl } from '@/config'

const pendingRequest = new Map<string, AbortController>()

const isDev = import.meta.env.DEV

/**
 * 判断是否为带统一业务 code 的 JSON 响应体
 */
function isBizPayload(v: unknown): v is ResponseData<unknown> {
    return typeof v === 'object' && v !== null && 'code' in v && typeof (v as ResponseData<unknown>).code === 'number'
}

/**
 * ofetch Api 封装
 */
export const useApi: (cookies?: Record<string, string | number | boolean>, needSignal?: boolean) => ApiType = (cookies, needSignal = false) => {
    const apiFetch = ofetch.create({
        baseURL: baseUrl,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Cookie': (cookies && objToCookies(cookies)) || '',
        },
    })

    return {
        abortKey: '',
        getAbortKey() {
            return this.abortKey
        },
        generateRequestKey(config: ServiceType) {
            const { url, method, data } = config
            return `${[url, method, qs.stringify(data ?? {})].join('&')}&_ts=${Date.now()}`
        },
        abortRequest(abortKey?: string) {
            const key = abortKey ?? this.abortKey
            if (!key || !pendingRequest.has(key)) {
                return
            }
            const controller = pendingRequest.get(key)
            controller?.abort('取消请求')
            pendingRequest.delete(key)
        },
        post(url: string, data?: Objable, options?: FetchOptions) {
            return this.RESTful(url, 'post', data, options)
        },
        get(url: string, data?: Objable, options?: FetchOptions) {
            return this.RESTful(url, 'get', data, options)
        },
        put(url: string, data?: Objable, options?: FetchOptions) {
            return this.RESTful(url, 'put', data, options)
        },
        delete(url: string, data?: Objable, options?: FetchOptions) {
            return this.RESTful(url, 'delete', data, options)
        },
        RESTful<T>(url: string, method: Methods = 'get', data?: Objable, options?: FetchOptions) {
            return this.fetch<T>(url, method, data, options)
        },
        async fetch<T>(url: string, method: Methods, data?: Objable, options?: FetchOptions): Promise<ResponseData<T>> {
            if (isDev) {
                console.log('%c[request-url] >> ', 'color: red', baseUrl + url, data ?? {})
            }

            let currentAbortKey: string | undefined
            let signal: AbortSignal | undefined
            if (needSignal) {
                currentAbortKey = this.generateRequestKey({ url, method, data: data ?? {} })
                this.abortKey = currentAbortKey
                const controller = new AbortController()
                signal = controller.signal
                pendingRequest.set(currentAbortKey, controller)
            }

            const mergedOptions: FetchOptions = {
                method,
                query: method === 'get' ? data : undefined,
                body: method === 'get' ? undefined : data,
                timeout: 10000,
                signal,
                ...options,
                headers: {
                    ...options?.headers,
                    ...(isFormData(data) ? {} : { 'Content-Type': 'application/json' }),
                },
                onRequest({ request, options: reqOpts }) {
                    if (isDev) {
                        console.log('[fetch request]', request, reqOpts)
                    }
                },
                onRequestError({ error }) {
                    ElMessage.closeAll()
                    if (error) {
                        ElMessage.error('数据请求失败，请稍后重试')
                    }
                    if (isDev) {
                        console.log('[fetch response error]', error)
                    }
                },
                onResponse({ response }) {
                    const payload = response._data
                    if (!isBizPayload(payload)) {
                        return
                    }
                    if (payload.code === 401) {
                        emitNeedLogin()
                        response._data = null
                        return
                    }
                    if (payload.code !== 200) {
                        ElMessage.error(payload.message || '请求失败')
                        emitter.emit('api-error', payload.message || '请求失败')
                        response._data = null
                    }
                },
                onResponseError({ response }) {
                    if (response.status === 401) {
                        emitNeedLogin()
                    }
                    if (isDev) {
                        console.log('[fetch response error]', response.status)
                    }
                },
            }

            try {
                return (await apiFetch(url, mergedOptions)) as ResponseData<T>
            }
            finally {
                if (currentAbortKey) {
                    pendingRequest.delete(currentAbortKey)
                }
            }
        },
    }
}

if (typeof window !== 'undefined') {
    window.$$api = useApi()
}

export const $api = useApi()
export const $fetch = useApi(undefined, true)
