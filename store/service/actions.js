import qs from 'qs'
import { serviceMutations } from '~/constants/vuex'
export default {
  async fetchData({ state, commit }) {
    const response = await this.$clientApi.get(
      '/services?' + qs.stringify(state.query, { arrayFormat: 'repeat' })
    )
    commit(serviceMutations.SET.DATA, response.data.data, { root: true })
    // Fix total later
    commit(serviceMutations.SET.TOTAL, response.data.total, { root: true })
    return response.data.data
  },
  async fetchMoreData() {
    const response = await this.$clientApi.get('/services')
    return response
  },
  async fetchSingle({ rootState }, id) {
    const response = await this.$clientApi.get('/services/' + id)
    return response
  },
  async submitSingle({ rootState }, form) {
    const response = await this.$authApi.post('/services', form)
    return response
  },
  async updateSingle({ rootState }, data) {
    const response = await this.$authApi.patch(
      '/services/' + data.id,
      data.form
    )
    return response
  },
  async deleteSingle({ rootState }, id) {
    const response = await this.$authApi.delete('/services/' + id)
    return response
  },
}
