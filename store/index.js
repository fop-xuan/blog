
export const state = () => ({
    userInfo: null,
    count: {
        articles: 0,
        lables: 0
    },
    ranks: []
})
  
export const mutations = {
    setUserInfo(state, payload) {
        state.userInfo = payload.userInfo
    },
    setCount(state, payload) {
        const { articles, lables } = payload
        state.count.articles = articles
        state.count.lables = lables
    },
    setClickRank(state, payload) {
        state.ranks = payload.ranks
    }
}

export const actions = {
    async nuxtServerInit({ commit, dispatch }, { req, $axios }) {
        if (req.session.userInfo) {
            commit('setUserInfo', { userInfo: JSON.parse(req.session.userInfo) })
        }
        await dispatch('getCount')
        await dispatch('getClickRank')
    },
    async getCount({ commit }) {
        const articlesCount = this.$axios.get('/articles/count')
        const lablesCount = this.$axios.get('/lables/count')
        const info = await Promise.all([articlesCount, lablesCount])
        commit('setCount', { articles: info[0].data.count, lables: info[1].data.count })
    },
    async getClickRank({ commit }) {
        const { data: { ranks } } = await this.$axios('/articles/clickRank')
        commit('setClickRank', { ranks })
    },
    async signin({ commit }, payload) {
        const { username,  password } = payload
        const info = await this.$axios.$post('/users/signin', {
            username: username,
            password: password
        })
        if (info.code) {
            commit('setUserInfo', {
                userInfo: info.msg
            })
            return true
        } else {
            return false
        }
       
    },
    async signout({ commit }) {
        const info = await this.$axios.$get('/users/signout')
        if (info.code) {
            commit('setUserInfo', { userInfo: null })
            return true
        } else {
            return false
        }
    }
}
