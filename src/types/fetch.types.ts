export type Methods = 'get' | 'post' | 'delete' | 'put'

export interface ServiceType {
    url: string
    method: Methods
    /** 请求体或查询序列化对象 */
    data?: Objable
    /** 是否验证code, 默认:true */
    checkCode?: boolean
    /** 超时时间 */
    timeout?: number
    [key: string]: any
}
