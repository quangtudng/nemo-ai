// Modify this DataTable component to suit your api
import { mapActions, mapState } from 'vuex'
import { debounce } from 'lodash'
import { Breadcrumb } from '~/components/common'

export default {
  layout: 'internal',
  components: {
    Breadcrumb,
    GoogleMap: () => import('~/components/common/Templates/Map/GMap.vue'),
  },
  async fetch() {
    try {
      // Fetch all locations
      const locationsResult = await this.fetchLocations(this.query)
      if (locationsResult && locationsResult.data) {
        this.locationTableData = locationsResult?.data || []
      }
      // Automatically select the first location
      if (this.locationTableData.length > 0) {
        this.selectedLocationId = this.locationTableData[0]?.id || null
        this.selectedLocationName =
          this.locationTableData[0]?.name +
            ' ' +
            this.locationTableData[0]?.type || 'Việt Nam'
        this.isLoading = true
        await this.getSingleLocation(this.selectedLocationId)
      }
    } catch (error) {
      console.log(error)
    }
  },
  data() {
    return {
      categoryTableData: [],
      locationTableData: [],
      form: {
        name: '',
        type: '',
        description: '',
      },
      isLoading: false,
      searchQuery: '',
      selectedLocationId: null,
      selectedLocationName: '',
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      locationDialogVisible: false,
    }
  },
  computed: {
    ...mapState({
      auth: (state) => state.auth.data,
    }),
  },
  watch: {
    searchQuery(val) {
      try {
        this.$refs.tree.filter(val)
      } catch (error) {
        console.log(error)
      }
    },
  },
  methods: {
    ...mapActions({
      fetchLocations: 'location/fetchData',
      fetchSingleLocation: 'location/fetchSingle',
      updateSingleLocation: 'location/updateSingle',
    }),
    handleNodeClick: debounce(async function (data, label) {
      try {
        if (this.selectedLocationId !== data.id) {
          this.selectedLocationId = data.id
          this.selectedLocationName = data.name + ' ' + data.type || 'Việt Nam'
          this.isLoading = true
          await this.getSingleLocation(data.id)
        }
      } catch (error) {
        console.log(error)
      }
    }, 800),
    async getSingleLocation(id) {
      try {
        const locationResult = await this.fetchSingleLocation(id)
        setTimeout(() => {
          if (locationResult && locationResult.data) {
            this.form = { ...this.form, ...locationResult.data }
            this.form.type = this.$t(`locations.${this.form.type}`)
            this.categoryTableData = locationResult.data.categoryCount
          }
          this.isLoading = false
        }, 500)
      } catch (error) {
        console.log(error)
      }
    },
    filterNode(value, data) {
      try {
        if (!value) return true
        const treeData = this.$accent(data.name)
        const searchData = this.$accent(value)
        if (treeData && searchData) return treeData.includes(searchData)
        return false
      } catch (error) {
        console.log(error)
        return false
      }
    },
    onSubmitUpdate: debounce(async function () {
      try {
        if (this.selectedLocationId) {
          this.isLoading = true
          const result = await this.updateSingleLocation({
            id: this.selectedLocationId,
            form: {
              description: this.form.description,
            },
          })
          if (result.status === 200) {
            this.$message.success(`${this.$t('info.RESOURCE_UPDATED_SUCCESS')}`)
          }
          setTimeout(() => {
            this.isLoading = false
          }, 500)
        }
      } catch (error) {
        console.log(error)
      }
    }, 500),
  },
}
