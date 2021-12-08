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
      // Fetch table data
      const services = await this.fetchTableData(this.query)
      this.tableData = services?.data?.data || []
      this.tableDataTotal = services?.data?.total || 0
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
    } catch (error) {
      console.log(error)
    }
  },
  middleware({ store, redirect }) {
    if (!permission.includes(store.state.auth.data.role.label)) {
      Message.error('Permission denied')
      return redirect('/')
    }
  },
  data() {
    return {
      searchQuery: null,
      serviceCategoryFilter: null,
      serviceCategories: [],
      locations: [],
      locationFilter: null,
      normalizer(node) {
        return {
          id: node.id,
          label: `${node.name} (${node.serviceCount})`,
          children: node.children,
        }
      },
      detailPageVisible: false,
      form: {
        title: null,
        description: null,
        originUrl: null,
        fullAddress: null,
        phoneNumber: null,
        thumbnail: null,
        price: null,
        locationName: null,
        categoryName: null,
        serviceAmenities: [],
      },
    }
  },
  async created() {
    this.isLoading = true
    await this.fetchServiceCategories()
    this.isLoading = false
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
      this.form.title = row.title || null
      this.form.description = row.description || null
      this.form.originUrl = row.originUrl || null
      this.form.fullAddress = row.fullAddress || null
      this.form.phoneNumber = row.phoneNumber || null
      this.form.categoryName = row.category?.title || null
      this.form.locationName = row.location?.name || 'Việt Nam'
      this.form.serviceAmenities = row.amenities || []
      console.log(row)
    },
    onEdit(payload) {
      this.$router.push(`/internal/services/${payload.rowData.id}/edit`)
    },
    onDelete(payload) {
      try {
        this.$confirm(
          'Do you want to delete this service. This action cannot be reversed',
          'Warning',
          {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
          }
        ).then(async () => {
          await this.onConfirmDelete(payload.rowData.id)
        })
      } catch (error) {
        console.log(error)
      }
    },
    async onConfirmDelete(id) {
      await this.deleteSingleService(id)
      await this.$fetch()
    },
    onFilter() {
      const locationId = this.locationFilter || 0
      const categoryId = this.serviceCategoryFilter || 0
      const filter = this.searchQuery
        ? { title: this.searchQuery, locationId, categoryId }
        : { title: '', locationId, categoryId }
      this.setDataQuery({
        page: 1,
        ...filter,
      })
      this.$fetch()
    },
    onClearFilter() {
      this.locationFilter = null
      this.serviceCategoryFilter = null
      this.searchQuery = null
      this.onRefresh()
    },
    handleExcelUpload(fileList) {
      try {
        this.$confirm('Do you want to upload this excel file', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning',
        }).then(async () => {
          if (fileList && fileList.length) {
            const file = fileList[0]?.raw
            await this.uploadServiceExcel([file])
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
  },
}
