export default function ({ app, query }) {
  // Get the current locale
  if (query.lang) {
    app.i18n.locale = query.lang
  }
}
