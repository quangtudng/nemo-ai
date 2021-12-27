export default {
  fetchData({ rootState }) {
    return this.$authApi.get('/customers')
  },
}
