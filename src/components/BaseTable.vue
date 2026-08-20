<template>
    <div
        class="overflow-hidden rounded-2xl bg-white p-2 shadow-card"
        :class="{ 'flex h-full flex-col': Boolean(height || maxHeight) }"
    >
        <el-table
            v-loading="loading"
            :data="data"
            :height="height"
            :max-height="maxHeight"
            style="width: 100%"
            @selection-change="(rows: T[]) => emit('selectionChange', rows)"
            @row-click="(row: T) => emit('rowClick', row)"
            @sort-change="(sort) => emit('sortChange', { prop: sort.prop ?? '', order: sort.order })"
        >
            <el-table-column v-if="selectable" type="selection" width="48" />
            <el-table-column
                v-for="col in columns"
                :key="col.prop"
                :prop="col.prop"
                :label="col.label"
                :width="col.width"
                :min-width="col.minWidth"
                :fixed="col.fixed"
                :align="col.align"
                :sortable="col.sortable ? 'custom' : false"
                :show-overflow-tooltip="col.showOverflowTooltip"
            >
                <template #header="scope">
                    <slot :name="`header-${col.slot ?? col.prop}`" :column="scope.column" :col="col">
                        {{ col.label }}
                    </slot>
                </template>
                <template #default="scope">
                    <slot :name="col.slot ?? col.prop" :row="scope.row as T" :index="scope.$index">
                        {{ scope.row[col.prop] }}
                    </slot>
                </template>
            </el-table-column>

            <template #empty>
                <slot name="empty">
                    <Empty />
                </slot>
            </template>
        </el-table>

        <div v-if="pagination && total > 0" class="flex shrink-0 justify-end px-4 py-4">
            <el-pagination
                v-model:current-page="page"
                v-model:page-size="pageSize"
                :total="total"
                :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper"
                background
            />
        </div>
    </div>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
import type { TableColumn } from '@/types'
import Empty from './Empty.vue'

/**
 * 基础表格：列配置驱动 + 内置分页 + 空状态
 * 通过与列 prop 同名的插槽自定义单元格渲染
 */
withDefaults(
    defineProps<{
        columns: TableColumn[]
        data: T[]
        loading?: boolean
        /** 是否显示分页 */
        pagination?: boolean
        total?: number
        /** 是否显示多选列 */
        selectable?: boolean
        /** 固定高度，超出时表体内部滚动 */
        height?: string | number
        /** 最大高度，超出时表体内部滚动 */
        maxHeight?: string | number
    }>(),
    {
        pagination: true,
        total: 0,
    },
)

const emit = defineEmits<{
    selectionChange: [rows: T[]]
    rowClick: [row: T]
    /** 服务端排序：列配置 sortable 时触发 */
    sortChange: [sort: { prop: string, order: string | null }]
}>()
const page = defineModel<number>('page', { default: 1 })
const pageSize = defineModel<number>('pageSize', { default: 10 })
</script>
