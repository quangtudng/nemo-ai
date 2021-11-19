import { Message } from 'element-ui'
export default function ({ $axios, app }, inject) {
  const fileApi = (signedRequest, file) => {
    try {
      if (process.env.NODE_ENV === 'development') {
        Message('DevOnly | File uploading API executed')
      }
      return $axios.put(signedRequest, file, {
        headers: {
          'Content-Type': file.type,
        },
      })
    } catch (error) {
      error.response.data.message.forEach((message) => {
        Message.error(app.i18n.t('error.' + message.code))
      })
    }
  }
  // Inject to context as $fileUploadApi
  inject('fileApi', fileApi)
}
