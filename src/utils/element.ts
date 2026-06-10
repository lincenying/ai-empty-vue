import { ElMessage, ElMessageBox } from '~/config/element'

type MessageType = 'success' | 'warning' | 'info' | 'error'
type ConfigType = string | { content?: string, type: MessageType, message?: string }

/**
 * 显示消息提示
 * @param config 配置信息
 * @param config.content 内容
 * @param config.type 类型
 * @example
 * ```
 * showMsg('content')
 * showMsg({ content: 'content'; type: 'success' | 'warning' | 'info' | 'error' })
 * ```
 */
export function showMsg(config: ConfigType) {
    let content, type: MessageType
    if (!config) {
        content = '接口返回数据错误'
        type = 'error'
    }
    else if (typeof config === 'string') {
        content = config
        type = 'error'
    }
    else {
        content = config.content
        type = config.type
    }
    ElMessage[type](content)
}

/**
 * 登录提示框
 * @param content 内容
 * @param callback 回调函数
 * @example
 * ```
 * loginMsgBox('content', () => {
 *     console.log('callback')
 * })
 * ```
 */
export function loginMsgBox(content: string, callback: AnyFn) {
    ElMessageBox.alert(content, '提示', {
        confirmButtonText: '确定',
        type: 'warning',
        showClose: false,
        buttonSize: 'small',
        callback: () => {
            if (callback && callback instanceof Function) {
                callback()
            }
        },
    })
}

/**
 * 确认提示框
 * @param content 内容
 * @param callback 回调函数
 * @example
 * ```
 * confirmMsg('确定要删除吗？', () => {
 *     console.log('callback')
 * })
 * ```
 */
export function confirmMsg(content: string, callback: AnyFn) {
    ElMessageBox.confirm(content, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        buttonSize: 'small',
        callback: (btn: string) => {
            if (callback && callback instanceof Function) {
                btn === 'confirm' && callback()
            }
        },
    })
}

/**
 * 提示框
 * @param content 内容
 * @param callback 回调函数
 * @example
 * ```
 * promptMsg('请输入密码', (value) => {
 *     console.log(value)
 * })
 * ```
 */
export function promptMsg(content: string, callback: AnyFn) {
    ElMessageBox.prompt(content, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '输入不能为空',
        type: 'warning',
        inputType: 'password',
        showClose: false,
        buttonSize: 'small',
    }).then(({ value }) => {
        if (callback && callback instanceof Function) {
            callback(value)
        }
    }).catch(() => { })
}
