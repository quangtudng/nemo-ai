export default function ({ app, query }) {
  if (query.lang) {
    app.i18n.locale = query.lang
  }
}
