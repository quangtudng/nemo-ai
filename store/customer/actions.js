export default {
  fetchData({ rootState }) {
    return this.$authApi.get('/customers')
  },
  saveCustomerInterests({ rootState }, body) {
    return this.$clientApi.post('/customers/interests', body)
  },
}
