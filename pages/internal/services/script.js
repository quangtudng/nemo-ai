import { mapActions, mapState } from 'vuex'
import { Message } from 'element-ui'
import { DataTable, Breadcrumb, ExcelUploader } from '~/components/common'
import { dataTableMixin } from '~/mixins'
const permission = 'SUPERADMIN'
export default {
  layout: 'internal',
  mixins: [dataTableMixin],
  components: {
    DataTable,
    Breadcrumb,
    ExcelUploader,
    GoogleMap: () => import('~/components/common/Templates/Map/GMap.vue'),
  },
  async fetch() {
    try {
      const services = await this.fetchTableData(this.query)
      this.tableData = services?.data?.data || []
      this.tableDataTotal = services?.data?.total || 0
    } catch (error) {
      console.log(error)
    }
  },
  middleware({ store, redirect }) {
    if (!permission.includes(store.state.auth.data.role.label)) {
      Message.error('Permission denied')
      return redirect('/internal')
    }
  },
  data() {
    return {
      // Text filter
      searchQuery: '',
      // Service category filter
      serviceCategoryFilter: null,
      serviceCategories: [],
      // Location tree select filter
      locations: [],
      locationFilter: null,
      normalizer(node) {
        return {
          id: node.id,
          label: `${node.name} (${node.serviceCount})`,
          children: node.children,
        }
      },
      // Form to display general information of service
      detailPageVisible: false,
      form: {
        title: '',
        description: '',
        originUrl: '',
        fullAddress: '',
        phoneNumber: '',
        thumbnail: '',
        price: 0,
        locationName: '',
        categoryName: '',
        serviceAmenities: [],
      },
    }
  },
  async created() {
    try {
      this.isLoading = true
      // Fetch service categories
      const serviceCategories = await this.fetchServiceCategories({
        limit: 100,
      })
      this.serviceCategories = serviceCategories?.data?.data || []
      // Fetch service locations
      const locations = await this.fetchLocations()
      if (locations?.data) {
        this.locations = locations.data
      }
      this.isLoading = false
    } catch (error) {
      console.log(error)
    }
  },
  computed: {
    ...mapState({
      locale: (state) => state.locale,
    }),
  },
  methods: {
    ...mapActions({
      fetchTableData: 'service/fetchData',
      deleteSingleService: 'service/deleteSingle',
      fetchServiceCategories: 'category/fetchData',
      fetchLocations: 'location/fetchData',
      uploadServiceExcel: 'service/submitExcel',
    }),
    onDetailView(row) {
      this.detailPageVisible = true
      this.form.title = row.title || ''
      this.form.description = row.description || ''
      this.form.originUrl = row.originUrl || ''
      this.form.fullAddress = row.fullAddress || ''
      this.form.phoneNumber = row.phoneNumber || ''
      this.form.categoryName = row.category?.title || ''
      this.form.locationName = row.location?.name || 'Việt Nam'
      this.form.serviceAmenities = row.amenities || []
    },
    onEdit(payload) {
      this.$router.push(`/internal/services/${payload.rowData.id}/edit`)
    },
    onDelete(payload) {
      try {
        this.$confirm(this.$t('validation.delete_confirmation'), 'Warning', {
          confirmButtonText: this.$t('common.delete'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning',
        }).then(async () => {
          const result = await this.deleteSingleService(payload.rowData.id)
          if (result.status === 200) {
            this.$message.success(this.$t('info.RESOURCE_DELETED_SUCCESS'))
          }
          await this.onClearFilter()
        })
      } catch (error) {
        console.log(error)
      }
    },
    async onFilter() {
      try {
        const locationId = this.locationFilter || 0
        const categoryId = this.serviceCategoryFilter || 0
        const filter = this.searchQuery
          ? { title: this.searchQuery, locationId, categoryId }
          : { title: '', locationId, categoryId }
        this.setDataQuery({
          page: 1,
          ...filter,
        })
        await this.$fetch()
      } catch (error) {
        console.log(error)
      }
    },
    async onClearFilter() {
      try {
        this.locationFilter = null
        this.serviceCategoryFilter = null
        this.searchQuery = ''
        await this.onRefresh()
      } catch (error) {
        console.log(error)
      }
    },
    fetchCategoryButtonStyle(price) {
      let colorClass
      if (!price) {
        colorClass = 'danger'
      } else if (price > 100000 && price < 1000000) {
        colorClass = 'warning'
      } else {
        colorClass = 'success'
      }
      return colorClass
    },
    handleExcelUpload(fileList) {
      try {
        this.$confirm(
          this.$t('validation.upload_confirmation'),
          this.$t('common.add-new'),
          {
            confirmButtonText: this.$t('common.delete'),
            cancelButtonText: this.$t('common.cancel'),
            type: 'warning',
          }
        ).then(async () => {
          if (fileList && fileList.length) {
            const file = fileList[0]?.raw
            const result = await this.uploadServiceExcel([file])
            if (result.status === 201) {
              setTimeout(() => {
                this.$message.success(
                  `${this.$t('info.RESOURCE_CREATED_SUCCESS')}`
                )
              }, 500)
            } else {
              setTimeout(() => {
                this.$message.success(
                  `${this.$t('info.RESOURCE_CREATED_FAILED')}`
                )
              }, 500)
            }
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
  },
}
