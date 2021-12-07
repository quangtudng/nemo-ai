import { mapActions } from 'vuex'
import { Message } from 'element-ui'
import {
  FormWrapper,
  InputWrapper,
  Breadcrumb,
  FileUploader,
} from '~/components/common'
import { fileMixin } from '~/mixins'
const permission = 'SUPERADMIN'
export default {
  layout: 'internal',
  components: { FormWrapper, InputWrapper, Breadcrumb, FileUploader },
  mixins: [fileMixin],
  middleware({ store, redirect }) {
    if (!permission.includes(store.state.auth.data.role.label)) {
      Message.error('Permission denied')
      return redirect('/')
    }
  },
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
        price: 0,
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
    handleFileUploadChange(fileList) {
      //
    },
    async processNewImages() {
      try {
        const readyFiles =
          this.imageList?.filter((image) => image.status === 'ready') || []
        const rawFiles = readyFiles?.map((image) => image.raw) || []
        const response = await this.$fileApi(rawFiles, 'SERVICE_IMAGE')
        const newImageArray = response?.data?.data || []
        return newImageArray.map((image) => image.url) || []
      } catch (e) {
        console.log(e)
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
          const allUrls = existUrls?.concat(newUrls) || []
          if (allUrls.length > 0) {
            this.form.thumbnail = allUrls[0]
            this.form.serviceImageUrls = allUrls
          }
        } else {
          this.form.thumbnail = ''
          this.form.serviceImageUrls = []
        }
      } catch (e) {
        console.log(e)
        this.form.thumbnail = ''
        this.form.serviceImageUrls = []
      }
    },
    async updateService() {
      try {
        this.isLoading = true
        if (!this.form.price) this.form.price = 0
        await this.processImages()
        await this.updateSingleService({
          id: this.$route.params.id,
          form: this.form,
        })
        console.log(this.form)
        // Redirect back to table list
        this.$router.push('/internal/services')
        this.isLoading = false
      } catch (err) {
        console.log(err)
        this.isLoading = false
      }
    },
  },
}
