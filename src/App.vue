<template>
    <div v-loading="loading" element-loading-text="数据加载中, 请稍等..." class="w-full h-full app-main">
        <ElConfigProvider :locale="locale">
            <template v-if="!loading">
                <router-view></router-view>
            </template>
        </ElConfigProvider>
    </div>
</template>

<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import { ElNotification } from './config/element'
import TimestampChecker from './utils/check-reload'

// const router = useRouter()

const locale = reactive(zhCn)

const loading = ref(false)

if (!import.meta.env.DEV && import.meta.env.SSR !== true) {
    const timestampChecker = new TimestampChecker()

    // 开始检查
    timestampChecker.start()

    // 如果需要停止检查
    // timestampChecker.stop();

    // 获取当前存储的时间戳
    // const current = timestampChecker.getCurrentTimestamp();

    // 清空时间戳
    // timestampChecker.clearTimestamp();

    function handleTimestampChanged(event: Event) {
        const customEvent = event as CustomEvent
        console.log('时间戳变化事件:', customEvent.detail)
        if (!timestampChecker.instance) {
            timestampChecker.stop()
            timestampChecker.instance = ElNotification({
                type: 'success',
                title: '通知',
                dangerouslyUseHTMLString: true,
                message: '<div>新内容可用，单击<b style="color: red; cursor: pointer;">这里</b>更新 (更新前请确认所有内容都已保存)</div>',
                onClick() {
                    window.location.reload()
                },
                onClose() {
                    timestampChecker.start()
                    timestampChecker.instance = null
                },
                duration: 0,
            })
        }
    }

    // 监听自定义事件

    function onVisibilityChange() {
        if (document.visibilityState === 'hidden') {
            console.log(`已离开页面, 取消检查更新心跳`)
            timestampChecker.stop()
        }
        else if (document.visibilityState === 'visible') {
            console.log(`已进入页面, 重新开始检查更新心跳`)
            if (!timestampChecker.instance)
                timestampChecker.start()
        }
    }

    onMounted(() => {
        window.addEventListener('timestamp-changed', handleTimestampChanged)
        document.addEventListener('visibilitychange', onVisibilityChange)
    })

    onUnmounted(() => {
        document.removeEventListener('visibilitychange', onVisibilityChange)
        window.removeEventListener('timestamp-changed', handleTimestampChanged)
    })
}
</script>
