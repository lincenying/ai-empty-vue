<template>
    <el-drawer
        v-model="visible"
        :title="title"
        :size="size"
        :class="drawerClass"
        v-bind="passthroughAttrs"
        destroy-on-close
        @closed="emit('closed')"
    >
        <slot />
        <template v-if="!hideFooter" #footer>
            <slot name="footer">
                <div class="flex justify-end gap-2 pb-2">
                    <el-button @click="handleCancel">{{ cancelText }}</el-button>
                    <el-button type="primary" :loading="loading" @click="emit('confirm')">
                        {{ confirmText }}
                    </el-button>
                </div>
            </slot>
        </template>
    </el-drawer>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
    defineProps<{
        title: string
        size?: string | number
        confirmText?: string
        cancelText?: string
        loading?: boolean
        hideFooter?: boolean
        /** 内容区填满并隐藏外层滚动（适合内部表格滚动） */
        fillBody?: boolean
    }>(),
    {
        size: '480px',
        confirmText: '保存',
        cancelText: '取消',
        fillBody: false,
    },
)

const emit = defineEmits<{
    confirm: []
    cancel: []
    closed: []
}>()

/**
 * 基础抽屉：统一尺寸 / 底部按钮布局，详情与表单抽屉基于此扩展
 */
const visible = defineModel<boolean>({ default: false })
const attrs = useAttrs()

const drawerClass = computed(() => {
    const extra = attrs.class
    const fill = props.fillBody ? 'base-drawer--fill' : ''
    if (!extra)
        return fill || undefined
    if (typeof extra === 'string')
        return [extra, fill].filter(Boolean).join(' ')
    if (Array.isArray(extra))
        return [...extra, fill].filter(Boolean)
    return [extra, fill].filter(Boolean)
})

/** 透传属性时排除 class，避免与 drawerClass 重复 */
const passthroughAttrs = computed(() => {
    const { class: _className, ...rest } = attrs as Record<string, unknown>
    return rest
})

function handleCancel(): void {
    visible.value = false
    emit('cancel')
}
</script>

<style>
.base-drawer--fill .el-drawer__body {
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
</style>
