import qs from 'qs'
export default {
  fetchData({ rootState }, query) {
    return this.$authApi.get(
      '/users?' + qs.stringify(query, { arrayFormat: 'repeat' })
    )
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
