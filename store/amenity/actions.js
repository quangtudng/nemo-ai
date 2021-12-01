import qs from 'qs'
export default {
  fetchData({ rootState }, query) {
    return this.$clientApi.get(
      '/amenities?' + qs.stringify(query, { arrayFormat: 'repeat' })
    )
  },
  fetchSingle({ rootState }, id) {
    return this.$clientApi.get('/amenities/' + id)
  },
  submitSingle({ rootState }, form) {
    return this.$authApi.post('/amenities', form)
  },
  updateSingle({ rootState }, data) {
    return this.$authApi.patch('/amenities/' + data.id, data.form)
  },
  deleteSingle({ rootState }, id) {
    return this.$authApi.delete('/amenities/' + id)
  },
}
