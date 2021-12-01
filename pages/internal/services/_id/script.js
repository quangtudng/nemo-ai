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

      this.amenities = amenities?.data?.data || []
      this.locations = locations?.data || []
      this.serviceCategories = serviceCategories?.data?.data || []

      // Form data
      this.form.title = service.data?.title || null
      this.form.description = service.data?.description || null
      this.form.originUrl = service.data?.originUrl || null
      this.form.fullAddress = service.data?.fullAddress || null
      this.form.phoneNumber = service.data?.phoneNumber || null
      this.form.thumbnail = service.data?.thumbnail || null
      this.form.price = service?.data?.price || 0
      this.form.locationId = service?.data?.location?.id || null
      this.form.categoryId = service?.data?.category?.id || null
      this.form.serviceImageUrls =
        service?.data?.serviceImages?.map((image) => ({
          url: image.url,
          name: 'existing-file.jpeg',
        })) || []
      this.form.serviceAmenities =
        service?.data?.amenities?.map((amenity) => amenity.id) || []
      this.isLoading = false
    } catch (error) {
      this.isLoading = false
    }
  },
  data() {
    return {
      // Submit form data (same parameter with the API)
      form: {
        title: null,
        description: null,
        originUrl: null,
        fullAddress: null,
        phoneNumber: null,
        thumbnail: null,
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
    async handleFileUploadChange(fileList) {
      const responseUrls = await this.uploadFilesToS3(
        this.imageList,
        'SERVICE_IMAGES'
      )
      // Resolve each of the url
      // Optimize this with Promise.all() later
      this.form.thumbnail = JSON.stringify(
        responseUrls.map((url) => {
          return url
        })
      )
    },
    async updateService() {
      try {
        this.isLoading = true
        if (!this.form.price) this.form.price = 0
        await this.updateSingleService({
          id: this.$route.params.id,
          form: this.form,
        })
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
