import qs from 'qs'
export default {
  fetchData({ state, commit }, query) {
    return this.$clientApi.get(
      '/categories?' + qs.stringify(query, { arrayFormat: 'repeat' })
    )
  },
  fetchSingle({ rootState }, id) {
    return this.$clientApi.get('/categories/' + id)
  },
  submitSingle({ rootState }, form) {
    return this.$authApi.post('/categories', form)
  },
  updateSingle({ rootState }, data) {
    return this.$authApi.patch('/categories/' + data.id, data.form)
  },
  deleteSingle({ rootState }, id) {
    return this.$authApi.delete('/categories/' + id)
  },
}
