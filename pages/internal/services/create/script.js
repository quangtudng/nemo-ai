import { mapActions } from 'vuex'
import {
  FormWrapper,
  InputWrapper,
  Breadcrumb,
  FileUploader,
} from '~/components/common'
import { fileMixin } from '~/mixins'
export default {
  layout: 'internal',
  components: { FormWrapper, InputWrapper, Breadcrumb, FileUploader },
  mixins: [fileMixin],
  async fetch() {
    try {
      this.isLoading = true
      const locations = await this.fetchManyLocations()
      const serviceCategories = await this.fetchManyServiceCategories({
        limit: 100,
      })
      const amenities = await this.fetchManyAmenities({ limit: 1000 })

      this.amenities = amenities?.data?.data || []
      this.locations = locations?.data || []
      this.serviceCategories = serviceCategories?.data?.data || []
      this.isLoading = false
    } catch (error) {
      this.isLoading = false
      console.log(error)
    }
  },
  data() {
    return {
      // Submit form data
      form: {
        title: '',
        description: '',
        originUrl: '',
        fullAddress: '',
        phoneNumber: '',
        thumbnail: '',
        price: null,
        locationId: null,
        categoryId: null,
        serviceImageUrls: [],
        serviceAmenities: [],
      },
      // Data holders
      serviceCategories: [],
      locations: [],
      amenities: [],
      imageList: [],
      // Misc data
      isLoading: false,
      normalizer(node) {
        return {
          id: node.id,
          label: `${node.name} (${node.serviceCount})`,
          children: node.children,
        }
      },
    }
  },
  methods: {
    ...mapActions({
      fetchManyLocations: 'location/fetchData',
      fetchManyServiceCategories: 'category/fetchData',
      fetchManyAmenities: 'amenity/fetchData',
      submitSingleService: 'service/submitSingle',
    }),
    async uploadNewUrls() {
      try {
        const readyFiles =
          this.imageList?.filter((image) => image.status === 'ready') || []
        const rawFiles = readyFiles?.map((image) => image.raw) || []
        const response = await this.$fileApi(
          'cloudinary/upload',
          rawFiles,
          'SERVICE_IMAGE'
        )
        const newImageArray = response?.data?.data || []
        return newImageArray.map((image) => image.url) || []
      } catch (error) {
        console.log(error)
        return []
      }
    },
    async processImages() {
      try {
        if (this.imageList?.length > 0) {
          const newUrls = await this.uploadNewUrls()
          if (newUrls.length > 0) {
            this.form.thumbnail = newUrls[0]
            this.form.serviceImageUrls = newUrls
          }
        } else {
          // Delete all images if empty
          this.form.thumbnail = ''
          this.form.serviceImageUrls = []
        }
      } catch (error) {
        console.log(error)
      }
    },
    async submitService() {
      try {
        this.isLoading = true
        await this.processImages()
        const result = await this.submitSingleService(this.form)
        if (result.status === 201) {
          // Reset form
          this.form = {
            title: '',
            description: '',
            originUrl: '',
            fullAddress: '',
            phoneNumber: '',
            thumbnail: '',
            price: null,
            locationId: null,
            categoryId: null,
            serviceImageUrls: [],
            serviceAmenities: [],
          }
          this.$message.success(`${this.$t('info.RESOURCE_CREATED_SUCCESS')}`)
          setTimeout(() => {
            this.$router.push('/internal/services')
          }, 500)
        }
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        console.log(error)
      }
    },
  },
}
