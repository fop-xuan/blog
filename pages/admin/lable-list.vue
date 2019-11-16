<template>
    <table-template
        :tableData='tableData'
        @handleEdit='handleEdit'
        @handleDelete='handleDelete'
    ></table-template>
</template>

<script>
import tableTemplate from '@/components/admin/table-template'
export default {
    data() {
        return {
            tableData: {
                titleList: [{
                    prop: 'lable',
                    label: '标签名'
                }],
                dateList: []
            }
        }
    },
    created() {
        this.getLablesList()
    },
    methods: {
        async getLablesList() {
            const { data: { list } } = await this.$axios.get('/lables/list')
            this.tableData.dateList = list
        },
        async handleEdit(index, row) {
            try {
                const success = await this.$prompt('请输入新的标签名：', '修改', {
                    closeOnClickModal: false,
                    confirmButtonText: '确定',
                    cancelButtonText: '放弃修改',
                    inputValue: row.lable,
                    inputValidator(nowValue) {
                        if (nowValue === row.lable) {
                            return '标签还未做修改'
                        } else if (nowValue === '') {
                            return '不能为空值'
                        }
                    },
                    center: true
                })
                this.sumbitEdit(success.value, row._id, index)
            } catch (err) {
                console.log(err)
            }
        },
        async sumbitEdit(newLable, _id, index) {
            const { data } = await this.$axios.post('/lables/edit', {
                lable: newLable,
                _id: _id
            })
            if (data.code) {
                this.renderEditedLable(newLable, index)
            } else {
                this.$notify.error({
                    title: '错误',
                    message: data.msg,
                })
            }
        },
        renderEditedLable(newLable, index) {
            this.tableData.dateList.splice(index, 1, {
                ...this.tableData.dateList[index],
                lable: newLable
            })
        },
        async handleDelete(index, row) {
            try {
                await this.$confirm('此操作将永久删除分类, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                this.sumbitDelete(index, row._id)
            } catch(err) {
                console.log(err)
            } 
        },
        async sumbitDelete(index, _id) {
            const { data } = await this.$axios.post('/lables/delete', { _id })
            if (data) {
                this.rendertDeletedLable(index)
            }
        },
        rendertDeletedLable(index) {
            this.tableData.dateList.splice(index, 1)
        }
    },
    components: {
        tableTemplate
    }
}
</script>
