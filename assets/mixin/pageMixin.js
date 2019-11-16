const CHANG_PAGE = 'changePage'
export default {
    data() {
        return {
            totalCount: this.$store.state.count.articles,
            limit: 6,
            page: 1
        }
    },
    methods: {
        changePage(page) { // 请求翻页数据
            this.page = page
            this.$emit(CHANG_PAGE, page)
        }
    }
}
