import qs from 'qs'
export default {
  fetchData({ rootState }, query) {
    return this.$clientApi.get(
      '/locations?' + qs.stringify(query, { arrayFormat: 'repeat' })
    )
  },
  fetchSingle({ rootState }, id) {
    return this.$clientApi.get('/locations/' + id)
  },
  updateSingle({ rootState }, data) {
    return this.$authApi.patch('/locations/' + data.id, data.form)
  },
}
