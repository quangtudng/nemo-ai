import { mapActions, mapState, mapMutations } from 'vuex'
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
  components: { FormWrapper, InputWrapper, Breadcrumb, FileUploader },
  mixins: [fileMixin, onExitWarningMixin],
  middleware({ store, query, redirect }) {
    if (!permission.includes(store.state.auth.data.role)) {
      Message.error('Permission denied')
      return redirect('/')
    }
  },
  async fetch() {
    try {
      this.isLoading = true
      await this.fetchServiceCategories()
      for (const i in 4) {
        await this.fetchServiceCategoryChildren(i)
      }
      // ;[6, 7, 8].forEach(async (id) => {
      //   const { data } = await this.fetchSingleDestination(id)
      //   this.ADD_REGION(data.data)
      // })
      await this.fetchDestinations()
      this.isLoading = false
    } catch (error) {
      this.isLoading = false
    }
  },
  data() {
    return {
      form: {
        enTitle: null,
        viTitle: null,
        enSlug: null,
        viSlug: null,
        enDescription: null,
        viDescription: null,
        enContent: null,
        viContent: null,
        note: null,
        thumbnail: [],
        status: 'ACTIVE',
        price: null,
        currentPrice: null,
        netPrice: null,
        serviceCategoryIds: null,
        destinationIds: null,
      },
      contentTabs: [
        {
          viTitle: '',
          viContent: '',
          enTitle: '',
          enContent: '',
        },
      ],
      pickedServiceCategoryId: null,
      activeContentTab: 'service-content-0',
      imageList: [],
      isLoading: false,
    }
  },
  computed: {
    ...mapState({
      serviceCategories: (state) => state.service.category.data,
      destinations: (state) => state.destination.data,
      regions: (state) => state.destination.regions,
      locale: (state) => state.locale,
    }),
  },
  methods: {
    ...mapActions({
      fetchServiceCategoryChildren: 'service/category/fetchChildren',
      fetchSingleDestination: 'destination/fetchSingle',
      fetchServiceCategories: 'service/category/fetchData',
      fetchDestinations: 'destination/fetchData',
      reFetchServices: 'service/fetchData',
      submitSingleService: 'service/submitSingle',
    }),
    ...mapMutations({
      ADD_REGION: 'destination/ADD_REGION',
    }),
    async handleFileUploadChange(fileList) {
      //
    },
    handleContentTabAdd() {
      this.contentTabs.push({
        viTitle: '',
        viContent: '',
        enTitle: '',
        enContent: '',
      })
    },
    handleContentTabRemove(targetName) {
      this.$confirm(this.$t('services.delete-content-warning'), 'Warning', {
        confirmButtonText: this.$t('services.delete-content-ok'),
        cancelButtonText: this.$t('services.delete-content-cancel'),
        type: 'warning',
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: this.$t('services.delete-content-success'),
          })
          if (this.contentTabs.length > 1) {
            const tabIndex = targetName.split('-')[2] // service-content-x
            this.contentTabs.splice(tabIndex, 1)
            this.activeContentTab = 'service-content-0' // Jump to first tab
          } else {
            this.$message.error(this.$t('services.minimum-tabs'))
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('services.delete-content-abort'),
          })
        })
    },
    async submitService() {
      try {
        this.isLoading = true
        this.form.price = +this.form.price
        this.form.netPrice = +this.form.netPrice
        this.form.currentPrice = this.form.currentPrice
          ? +this.form.currentPrice
          : 0
        this.form.serviceCategoryIds = [this.pickedServiceCategoryId]
        const responseUrls = await this.uploadFilesToS3(
          this.imageList,
          'SERVICE_IMAGES'
        )
        // Resolve each of the url
        // Optimize this with Promise.all() later
        this.form.thumbnail = await responseUrls[0]
        // for (const i in responseUrls.length) {
        //   const responseUrl = await responseUrls[i]
        //   await this.form.thumbnail.push(responseUrl)
        // }
        this.form.viContent = JSON.stringify(
          this.contentTabs.map((tab) => {
            return {
              viTitle: tab.viTitle,
              viContent: tab.viContent,
            }
          })
        )
        this.form.enContent = JSON.stringify(
          this.contentTabs.map((tab) => {
            return {
              enTitle: tab.enTitle,
              enContent: tab.enContent,
            }
          })
        )
        await this.submitSingleService(this.form)
        this.reFetchServices()
        this.$router.push('/services')
        // Reset form
        this.form = {
          enTitle: null,
          viTitle: null,
          enSlug: null,
          viSlug: null,
          enDescription: null,
          viDescription: null,
          enContent: null,
          viContent: null,
          note: null,
          thumbnail: null,
          status: 'ACTIVE',
          price: null,
          currentPrice: null,
          netPrice: null,
          serviceCategoryIds: null,
          destinationIds: null,
        }
        this.imageList = []
        this.contentTabs = [
          {
            viTitle: '',
            viContent: '',
            enTitle: '',
            enContent: '',
          },
        ]
        this.activeContentTab = 'service-content-0'
        this.isLoading = false
      } catch (err) {
        this.isLoading = false
      }
    },
  },
}
