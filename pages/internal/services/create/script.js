import { mapActions } from 'vuex'
import { Message } from 'element-ui'
import {
  FormWrapper,
  InputWrapper,
  Breadcrumb,
  FileUploader,
} from '~/components/common'
import { fileMixin, onExitWarningMixin } from '~/mixins'
const permission = 'SUPERADMIN'
export default {
  layout: 'internal',
  components: { FormWrapper, InputWrapper, Breadcrumb, FileUploader },
  mixins: [fileMixin, onExitWarningMixin],
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
      const amenities = await this.fetchManyAmenities({ limit: 1000 })
      this.amenities = amenities?.data?.data || []
      this.locations = locations?.data || []
      this.serviceCategories = serviceCategories?.data?.data || []
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
      submitSingleService: 'service/submitSingle',
    }),
    async handleFileUploadChange(fileList) {
      //
    },
    async submitService() {
      try {
        this.isLoading = true
        console.log(this.form)
        await this.submitSingleService(this.form)
        // Reset form
        this.form = {
          title: null,
          description: null,
          originUrl: null,
          fullAddress: null,
          phoneNumber: null,
          thumbnail: null,
          price: null,
          locationId: null,
          categoryId: null,
          serviceImageUrls: [],
          serviceAmenities: [],
        }
        // Redirect back to table list
        this.$router.push('/internal/services')
        this.isLoading = false
      } catch (err) {
        this.isLoading = false
      }
    },
  },
}
