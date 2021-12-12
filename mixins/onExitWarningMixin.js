export default {
  beforeRouteLeave(to, from, next) {
    const answer = window.confirm(this.$t('validation.exit_confirmation'))
    if (answer) {
      next()
    } else {
      next(false)
    }
  },
}
