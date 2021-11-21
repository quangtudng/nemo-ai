import qs from 'qs'
export default {
  async fetchData({ state, commit }) {
    const response = await this.$authApi.get(
      '/users?' + qs.stringify(state.query, { arrayFormat: 'repeat' })
    )
    commit('user/SET_DATA', response.data.data, { root: true })
    // Fix total later
    commit('user/SET_TOTAL', response.data.total, { root: true })
    return response.data.data
  },
  fetchMoreData() {
    return this.$authApi.get('/users')
  },
  fetchSingle({ rootState }, id) {
    return this.$authApi.get('/users/' + id)
  },
  submitSingle({ rootState }, form) {
    return this.$authApi.post('/users', form)
  },
  updateSingle({ rootState }, data) {
    return this.$authApi.patch('/users/' + data.id, data.form)
  },
  deleteSingle({ rootState }, id) {
    return this.$authApi.delete('/users/' + id)
  },
}
