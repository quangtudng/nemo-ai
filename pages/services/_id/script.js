import { mapActions, mapState, mapMutations } from 'vuex'
import { Message } from 'element-ui'
import {
  FormWrapper,
  InputWrapper,
  Breadcrumb,
  FileUploader,
} from '~/components/common'
import {
  serviceActions,
  serviceCategoryActions,
  destinationActions,
  destinationMutations,
} from '~/constants/vuex'
import { fileMixin } from '~/mixins'
const permission = 'SUPERADMIN'
export default {
  components: { FormWrapper, InputWrapper, Breadcrumb, FileUploader },
  mixins: [fileMixin],
  middleware({ store, query, redirect }) {
    if (!permission.includes(store.state.auth.data.role)) {
      Message.error('Permission denied')
      return redirect('/')
    }
  },
  async fetch() {
    try {
      this.isLoading = true
      const { data } = await this.$store.dispatch(
        serviceActions.FETCH.SINGLE,
        this.$route.params.id
      )
      this.form = { ...this.form, ...data.data }
      this.imageList.push({ url: data.data.thumbnail })
      this.pickedServiceCategoryId = data.data.serviceCategories[0].id
      this.form.destinationIds = data.data.destinations.map((destination) => {
        return destination.id
      })
      const viContent = JSON.parse(data.data.viContent)
      JSON.parse(data.data.enContent).forEach((item, index) => {
        this.contentTabs.push({
          viTitle: viContent[index].viTitle,
          viContent: viContent[index].viContent,
          enTitle: item.enTitle,
          enContent: item.enContent,
        })
      })
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
        thumbnail: null,
        status: 'ACTIVE',
        price: null,
        currentPrice: null,
        netPrice: null,
        serviceCategoryIds: null,
        destinationIds: null,
      },
      contentTabs: [],
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
      fetchServiceCategories: serviceCategoryActions.FETCH.DATA,
      fetchServiceCategoryChildren: serviceCategoryActions.FETCH.CHILDREN,
      fetchDestinations: destinationActions.FETCH.DATA,
      fetchSingleDestination: destinationActions.FETCH.SINGLE,
      reFetchServices: serviceActions.FETCH.DATA,
      updateSingleService: serviceActions.UPDATE.SINGLE,
    }),
    ...mapMutations({
      ADD_REGION: destinationMutations.ADD.REGION,
    }),
    async handleFileUploadChange(fileList) {
      const responseUrls = await this.uploadFilesToS3(
        this.imageList,
        'SERVICE_IMAGES'
      )
      // Resolve each of the url
      // Optimize this with Promise.all() later
      this.form.thumbnail = await JSON.stringify(
        responseUrls.map(async (url) => {
          return await url
        })
      )
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
    async updateService() {
      try {
        this.isLoading = true
        delete this.form.userId
        this.form.price = +this.form.price
        this.form.netPrice = +this.form.netPrice
        this.form.currentPrice = this.form.currentPrice
          ? +this.form.currentPrice
          : 0
        this.form.serviceCategoryIds = [this.pickedServiceCategoryId]
        this.form.viContent = await JSON.stringify(
          this.contentTabs.map((tab) => {
            return {
              viTitle: tab.viTitle,
              viContent: tab.viContent,
            }
          })
        )
        this.form.enContent = await JSON.stringify(
          this.contentTabs.map((tab) => {
            return {
              enTitle: tab.enTitle,
              enContent: tab.enContent,
            }
          })
        )
        await this.updateSingleService({
          id: this.$route.params.id,
          form: this.form,
        })
        this.reFetchServices()
        this.isLoading = false
        this.$router.push('/services')
      } catch (err) {
        this.isLoading = false
      }
    },
  },
}
