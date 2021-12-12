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
      const service = await this.fetchSingleService(this.$route.params.id)
      const amenities = await this.fetchManyAmenities({ limit: 1000 })

      // Form data
      this.form = {
        ...this.form,
        ...service.data,
        locationId: service?.data?.location?.id || null,
        categoryId: service?.data?.category?.id || null,
        serviceImageUrls:
          service?.data?.serviceImages?.map((image) => image.url) || [],
        serviceAmenities:
          service?.data?.amenities?.map((amenity) => amenity.id) || [],
      }
      // Component data
      this.amenities = amenities?.data?.data || []
      this.locations = locations?.data || []
      this.serviceCategories = serviceCategories?.data?.data || []
      this.imageList =
        service?.data?.serviceImages?.map((image) => ({
          url: image.url,
          name: 'existing-file.jpeg',
        })) || []
      this.isLoading = false
    } catch (error) {
      this.isLoading = false
    }
  },
  data() {
    return {
      // Submit form data (same parameter with the API)
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
      updateSingleService: 'service/updateSingle',
      fetchSingleService: 'service/fetchSingle',
    }),
    async processNewImages() {
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
          const newUrls = await this.processNewImages()
          const existUrls =
            this.imageList
              ?.filter((image) => image.status === 'success')
              ?.map((image) => image.url) || []
          // Merge new and old images
          const allUrls = existUrls?.concat(newUrls) || []
          console.log(allUrls)
          if (allUrls.length > 0) {
            this.form.thumbnail = allUrls[0]
            this.form.serviceImageUrls = allUrls
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
    async updateService() {
      try {
        this.isLoading = true
        if (!this.form.price) this.form.price = 0
        await this.processImages()
        const result = await this.updateSingleService({
          id: this.$route.params.id,
          form: this.form,
        })
        if (result.status === 200) {
          this.$message.success(`${this.$t('info.RESOURCE_UPDATED_SUCCESS')}`)
          setTimeout(() => {
            this.$router.push('/internal/services')
          }, 500)
        }
        this.isLoading = false
      } catch (error) {
        console.log(error)
        this.isLoading = false
      }
    },
  },
}
