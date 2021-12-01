import qs from 'qs'
export default {
  fetchData({ state, commit }, query) {
    try {
      const result = this.$authApi.get(
        '/categories?' + qs.stringify(query, { arrayFormat: 'repeat' })
      )
      return result
    } catch (e) {
      console.log(e)
    }
  },
}
