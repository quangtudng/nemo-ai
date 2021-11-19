import Jimp from 'jimp'
// const slug = require('slug')
// const moment = require('moment')
// Specially made for Element UI image uploader
export default {
  methods: {
    // Work flow:
    // Get pre-signed url
    // Process files (resize, adjust,...)
    // Send raw file to server
    /// ////////////////////////////////////
    // Process images
    // Save new adjusted fileList
    // let urls = this.getSignedUrlS3(files)
    // loop through fileList and send them each time loop
    /// ////////////////////////////////////
    // Keep getSignedUrlS3 and upload files seperate because:
    // we can get multiple urls
    // but can only upload 1 file at a time (pre-signed url limitation)
    async getSignedUrlS3(files, folderPrefix = 'UNCATEGORIZED_FILES') {
      files = await files.map((file) => {
        // const fileName = this.getUniqueFileName(file)
        return {
          fileName: file.name,
          // Get the file's extension
          type: file.raw.type,
          folderPrefix,
        }
      })
      const responseUrls = files.map(async (file) => {
        const response = await this.$authApi.post('/medias/presigned-url', file)
        return response.data.data.presignedUrl
      })
      return responseUrls
    },
    // Has to have .raw (Element UI uploader's format)
    async uploadFilesToS3(files, folderPrefix) {
      const urls = await this.getSignedUrlS3(files, folderPrefix)
      const responseUrls = await urls.map(async (url, index) => {
        const resolveUrl = await url
        const response = await this.$fileApi(resolveUrl, files[index].raw)
        const questionIndex = response.config.url.indexOf('?')
        const responseUrl = response.config.url.substring(0, questionIndex)
        return responseUrl
      })
      return responseUrls
    },
    // Image only
    async resize(path, width, height) {
      // Read the image from the blob path (blob:http://....)
      const image = await Jimp.read(path)
      await image.resize(width, height)
      // Convert to base64 string
      const base64String = await image.getBase64Async(image.getMIME())
      // Return new image
      const newImage = new Image()
      newImage.src = base64String
      // Return the new image object
      return { raw: newImage }
    },
  },
}
