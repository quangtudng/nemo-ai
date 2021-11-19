import qs from 'qs'
import { userMutations } from '~/constants/vuex'
export default {
  async fetchData({ state, commit }) {
    const response = await this.$authApi.get(
      '/users?' + qs.stringify(state.query, { arrayFormat: 'repeat' })
    )
    commit(userMutations.SET.DATA, response.data.data, { root: true })
    // Fix total later
    commit(userMutations.SET.TOTAL, response.data.total, { root: true })
    return response.data.data
  },
  async fetchMoreData() {
    const response = await this.$authApi.get('/users')
    return response
  },
  async fetchSingle({ rootState }, id) {
    const response = await this.$authApi.get('/users/' + id)
    return response
  },
  async submitSingle({ rootState }, form) {
    const response = await this.$authApi.post('/users', form)
    return response
  },
  async updateSingle({ rootState }, data) {
    const response = await this.$authApi.patch('/users/' + data.id, data.form)
    return response
  },
  async deleteSingle({ rootState }, id) {
    const response = await this.$authApi.delete('/users/' + id)
    return response
  },
}
