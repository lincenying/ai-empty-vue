<template>
    <el-dialog
        v-model="visible"
        :title="title"
        width="420px"
        align-center
        :show-close="false"
        :close-on-click-modal="false"
    >
        <div class="flex items-start gap-3">
            <div
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                :class="
                    type === 'danger'
                        ? 'bg-red-50 text-red-500'
                        : type === 'warning'
                            ? 'bg-amber-50 text-amber-500'
                            : 'bg-blue-50 text-blue-600'
                "
            >
                <el-icon :size="20"><WarningFilled /></el-icon>
            </div>
            <p class="pt-2 text-sm leading-6 text-slate-600">
                <slot>{{ content }}</slot>
            </p>
        </div>
        <template #footer>
            <el-button @click="handleCancel">{{ cancelText }}</el-button>
            <el-button
                :type="type"
                :loading="loading"
                @click="emit('confirm')"
            >
                {{ confirmText }}
            </el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        title?: string
        content?: string
        /** danger 用于删除，warning 用于停用 / 禁用 */
        type?: 'primary' | 'warning' | 'danger'
        confirmText?: string
        cancelText?: string
        loading?: boolean
    }>(),
    {
        title: '操作确认',
        content: '确定要执行该操作吗？',
        type: 'primary',
        confirmText: '确定',
        cancelText: '取消',
    },
)

const emit = defineEmits<{
    confirm: []
    cancel: []
}>()

/**
 * 确认弹窗：统一的二次确认交互（删除等危险操作）
 */
const visible = defineModel<boolean>({ default: false })

function handleCancel(): void {
    visible.value = false
    emit('cancel')
}
</script>
