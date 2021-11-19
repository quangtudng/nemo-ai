import { Message } from 'element-ui'
export default function ({ $axios, app }, inject) {
  // Create a custom axios instance
  const clientApi = $axios.create({
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
  clientApi.onRequest((config) => {
    if (process.env.NODE_ENV === 'development') {
      Message('DevOnly | Client API executed')
    }
    // Must return config
    return config
  })
  clientApi.onError((error) => {
    error.response.data.message.forEach((message) => {
      Message.error(app.i18n.t('error.' + message.code))
    })
  })

  // Inject to context as $clientApi
  inject('clientApi', clientApi)
}
