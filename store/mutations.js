export default {
  // Communicate with Devtools
  SET_LANG(state, locale) {
    if (state.locales.includes(locale)) {
      state.locale = locale
      localStorage.setItem('locale', locale)
    }
  },
  SET_SERVER_STATE(state, serverReady) {
    state.serverReady = serverReady
  },
  COLLAPSE_SIDEBAR(state) {
    state.options.sidebarCollapsed = true
  },
  OPEN_SIDEBAR(state) {
    state.options.sidebarCollapsed = false
  },
}
