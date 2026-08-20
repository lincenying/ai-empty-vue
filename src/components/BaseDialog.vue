<template>
    <el-dialog
        v-model="visible"
        class="tf-base-dialog"
        :title="title"
        :width="width"
        align-center
        destroy-on-close
        :close-on-click-modal="closeOnClickModal"
        @closed="emit('closed')"
    >
        <slot />
        <template v-if="!hideFooter" #footer>
            <slot name="footer">
                <el-button @click="handleCancel">{{ cancelText }}</el-button>
                <el-button
                    type="primary"
                    :loading="loading"
                    :disabled="confirmDisabled"
                    @click="emit('confirm')"
                >
                    {{ confirmText }}
                </el-button>
            </slot>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        title: string
        width?: string | number
        confirmText?: string
        cancelText?: string
        loading?: boolean
        confirmDisabled?: boolean
        closeOnClickModal?: boolean
        /** 隐藏底部按钮（完全自定义 footer 时使用） */
        hideFooter?: boolean
    }>(),
    {
        width: '560px',
        confirmText: '确定',
        cancelText: '取消',
        closeOnClickModal: false,
    },
)

const emit = defineEmits<{
    confirm: []
    cancel: []
    closed: []
}>()

/**
 * 基础弹窗：统一宽度 / 底部按钮布局，业务弹窗基于此扩展
 */
const visible = defineModel<boolean>({ default: false })

function handleCancel(): void {
    visible.value = false
    emit('cancel')
}
</script>

<style lang="scss">
/* 弹窗挂载至 body，使用非 scoped 样式；限制最大高度，仅 body 区域滚动 */
.tf-base-dialog.el-dialog {
    display: flex;
    flex-direction: column;
    max-height: 80vh;
    margin: 0 !important;
    overflow: hidden;
}

.tf-base-dialog .el-dialog__header {
    flex-shrink: 0;
}

.tf-base-dialog .el-dialog__body {
    flex: 1;
    min-height: 0;
    overflow-x: hidden;
    overflow-y: auto;
}

.tf-base-dialog .el-dialog__footer {
    flex-shrink: 0;
}
</style>
