import qs from 'qs'
export default {
  async fetchData({ state, commit }) {
    const response = await this.$clientApi.get(
      '/services?' + qs.stringify(state.query, { arrayFormat: 'repeat' })
    )
    commit('service/SET_DATA', response.data.data, { root: true })
    // Fix total later
    commit('service/SET_TOTAL', response.data.total, { root: true })
    return response.data.data
  },
  fetchMoreData() {
    return this.$clientApi.get('/services')
  },
  fetchSingle({ rootState }, id) {
    return this.$clientApi.get('/services/' + id)
  },
  submitSingle({ rootState }, form) {
    return this.$authApi.post('/services', form)
  },
  updateSingle({ rootState }, data) {
    return this.$authApi.patch('/services/' + data.id, data.form)
  },
  deleteSingle({ rootState }, id) {
    return this.$authApi.delete('/services/' + id)
  },
}
