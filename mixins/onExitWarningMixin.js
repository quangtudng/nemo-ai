export default {
  beforeRouteLeave(to, from, next) {
    const answer = window.confirm(this.$t('warning.exit'))
    if (answer) {
      next()
    } else {
      next(false)
    }
  },
}
