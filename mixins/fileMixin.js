import Jimp from 'jimp'
export default {
  methods: {
    // Image only
    async resize(path, width, height) {
      // Read the image from the blob path (blob:http://....)
      const image = await Jimp.read(path)
      image.resize(width, height)
      // Convert to base64 string
      const base64String = await image.getBase64Async(image.getMIME())
      // Return new image
      const newImage = new Image()
      newImage.src = base64String
      // Return the new image object
      return { raw: newImage }
    },
  },
  // This is a method to process the image and distinct the existing urls and new urls into one array
  processUploadingImage(fileList) {
    //
  },
}
