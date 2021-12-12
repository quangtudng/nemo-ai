import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

export default ({ app, store, query }, inject) => {
  // Set i18n instance on app
  // This way we can use it in middleware and pages asyncData/fetch

  app.i18n = new VueI18n({
    locale: store.state.locale,
    silentFallbackWarn: true,
    fallbackLocale: 'vi',
    messages: {
      en: require('~/locales/en.json'),
      vi: require('~/locales/vi.json'),
    },
  })

  const changeLocale = (locale) => {
    // Set locale in i18n
    app.i18n.locale = locale
    // Set locale in VueX state
    store.commit('SET_LANG', locale)
    // Set locale in localStorage
    localStorage.setItem('locale', locale)
    // Set locale in query param
    app.router.push({ query: { lang: locale } })
  }

  if (!query.lang) {
    if (localStorage.getItem('locale')) {
      changeLocale(localStorage.getItem('locale'))
    }
  } else {
    changeLocale(query.lang)
  }

  inject('changeLocale', changeLocale)
}
