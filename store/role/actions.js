import qs from 'qs'
export default {
  fetchData({ rootState }, query) {
    return this.$authApi.get(
      '/roles?' + qs.stringify(query, { arrayFormat: 'repeat' })
    )
  },
}
