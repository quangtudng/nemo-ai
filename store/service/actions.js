import qs from 'qs'
export default {
  fetchData({ rootState }, query) {
    return this.$clientApi.get(
      '/services?' + qs.stringify(query, { arrayFormat: 'repeat' })
    )
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
