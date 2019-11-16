<template>
    <div class="add-lable">
        <h2>添加新标签</h2>
        <div>
            <el-input placeholder="请输入新标签" v-model="lable" clearable suffix-icon="el-icon-edit"></el-input>
            <el-button icon='el-icon-folder-add' style="margin-left:10px" @click='add' type='success' :disabled="isSumit">
                添加
            </el-button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            lable: ''
        }
    },
    computed: {
        isSumit() {
            if (this.lable.length) {
                return false
            } else {
                return true
            }
        }
    },
    methods: {
        async add() {
            const { data } =  await this.$axios.post('/lables/add', { lable: this.lable })
            this.$notify({
                title: '提示',
                message: data.msg,
                type: data.type
            })
            if (data.code) {
                this.lable = ''
            }
        }
    }
}
</script>

<style lang='less' scoped>
    .add-lable{
        text-align: center;
        h2{
            margin-bottom: 20px;
        }
        div{
            margin: 0 auto;
            width: 50%;
        }
    }
</style>
