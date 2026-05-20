<template>
    <div class="w-full h-full app-main">
        <ElConfigProvider :locale="locale">
            <router-view />
        </ElConfigProvider>
    </div>
</template>

<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import { ElNotification } from './config/element'
import TimestampChecker from './utils/check-reload'

const locale = reactive(zhCn)

if (!import.meta.env.DEV && import.meta.env.SSR !== true) {
    const timestampChecker = new TimestampChecker()

    timestampChecker.start()

    function handleTimestampChanged(_event: Event) {
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

    function onVisibilityChange() {
        if (document.visibilityState === 'hidden') {
            timestampChecker.stop()
        }
        else if (document.visibilityState === 'visible' && !timestampChecker.instance) {
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
