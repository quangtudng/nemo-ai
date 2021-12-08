import { Message } from 'element-ui'
export default function ({ $axios, app }, inject) {
  const fileApi = (endpoint, files, folderPrefix = '') => {
    try {
      if (process.env.NODE_ENV === 'development') {
        Message('DevOnly | File uploading API executed')
      }
      console.log(files)
      const formData = new FormData()
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        formData.append('file', file)
      }
      if (folderPrefix) {
        formData.append('folder', folderPrefix)
      }
      return $axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
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
