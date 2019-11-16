<template>
    <div style='text-align:center'>
        <el-table
            :data="tableData.dateList"
            border
            stripe
            style="width: 100%;margin-top:30px">
            <el-table-column :label="title.label" :prop="title.prop" v-for='(title,index) in tableData.titleList' :key='index'></el-table-column>
            <el-table-column label="操作" width="300" v-if='isTool'>
                <template v-slot="scope">
                    <el-button type='warning' icon='el-icon-edit' size='mini' @click="handleEdit(scope.$index, scope.row)" v-if='isEdit'>修改内容</el-button>
                    <el-button type='danger' icon='el-icon-delete' size='mini' @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
        style="margin-top:20px"
            @current-change='currentChange'
            :current-page='page'
            layout="prev, pager, next"
            hide-on-single-page
            background
            :page-size='limit'
            :total="totalCount">
        </el-pagination>
    </div>
</template>

<script>
const HANDLE_EDIT = 'handleEdit'
const HANDLE_DELETE = 'handleDelete'
const CHANG_PAGE = 'changePage'
export default {
    props: {
        tableData: {
            type: Object,
            default() {
                return {}
            }
        },
        totalCount: {
            type: Number,
            default: 0
        },
        limit: {
            type: Number,
            default: 0
        },
        isTool: {
            type: Boolean,
            default: true
        },
        page: {
            type: Number,
            default: 0
        },
        isEdit: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        handleEdit(index, row) {
            this.$emit(HANDLE_EDIT, index, row)
        },
        handleDelete(index, row) {
            this.$emit(HANDLE_DELETE, index, row)
        },
        currentChange(page) {
            this.$emit(CHANG_PAGE, page)
        }
    }
}
</script>
