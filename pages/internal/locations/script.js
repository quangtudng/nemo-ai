// Modify this DataTable component to suit your api
import { mapActions, mapState } from 'vuex'
import { debounce } from 'lodash'
import { Message } from 'element-ui'
import { Breadcrumb } from '~/components/common'
const permission = 'SUPERADMIN'

export default {
  layout: 'internal',
  components: {
    Breadcrumb,
    GoogleMap: () => import('~/components/common/Templates/Map/GMap.vue'),
  },
  async fetch() {
    // Fetch all locations
    const locationsResult = await this.fetchLocations(this.query)
    if (locationsResult && locationsResult.data) {
      this.locationTableData = locationsResult?.data || []
    }
    // Automatically fetch the first location
    if (this.locationTableData.length > 0) {
      this.selectedLocationId = this.locationTableData[0]?.id || null
      this.selectedLocationName = this.locationTableData[0]?.name || 'Việt Nam'
      this.isLoading = true
      await this.getSingleLocation(this.selectedLocationId)
    }
  },
  middleware({ store, query, redirect }) {
    if (!permission.includes(store.state.auth.data.role.label)) {
      Message.error('Permission denied')
      return redirect('/')
    }
  },
  data() {
    return {
      categoryTableData: [],
      locationTableData: [],
      form: {
        name: null,
        type: null,
        slug: null,
        description: null,
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
      this.$refs.tree.filter(val)
    },
  },
  methods: {
    ...mapActions({
      fetchLocations: 'location/fetchData',
      fetchSingleLocation: 'location/fetchSingle',
      updateSingleLocation: 'location/updateSingle',
    }),
    handleNodeClick: debounce(async function (data, label) {
      if (this.selectedLocationId !== data.id) {
        this.selectedLocationId = data.id
        this.selectedLocationName = data.name || 'Việt Nam'
        this.isLoading = true
        await this.getSingleLocation(data.id)
      }
    }, 800),
    async getSingleLocation(id) {
      const locationResult = await this.fetchSingleLocation(id)
      setTimeout(() => {
        if (locationResult && locationResult.data) {
          this.form = { ...this.form, ...locationResult.data }
          this.form.type = this.$t(`locations.edit.${this.form.type}`)
          this.categoryTableData = locationResult.data.categoryCount
        }
        this.isLoading = false
      }, 500)
    },
    filterNode(value, data) {
      if (!value) return true
      const treeData = this.$accent(data.name)
      const searchData = this.$accent(value)
      if (treeData && searchData) return treeData.includes(searchData)
      return false
    },
    onSubmitUpdate: debounce(async function () {
      if (this.selectedLocationId) {
        this.isLoading = true
        await this.updateSingleLocation({
          id: this.selectedLocationId,
          form: {
            description: this.form.description,
          },
        })
        setTimeout(() => {
          this.isLoading = false
        }, 500)
      }
    }, 500),
  },
}
