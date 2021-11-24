// Modify this DataTable component to suit your api
import qs from 'qs'
import { mapActions, mapState, mapMutations } from 'vuex'
import { DataTable, Breadcrumb } from '~/components/common'
import { dataTableMixin } from '~/mixins'
const pluralize = require('pluralize')
const moduleName = 'service' // Module name

export default {
  mixins: [dataTableMixin],
  components: {
    DataTable,
    Breadcrumb,
  },
  middleware({ store, query }) {
    if (qs.stringify(query) !== '') {
      // Looking for numeric string and convert them to Number
      Object.keys(query).forEach((key, index) => {
        if (!isNaN(query[key])) {
          query[key] = Number(query[key])
        }
      })
      store.commit('service/SET_QUERY', query)
    }
  },
  data() {
    return {
      moduleName, // For the mixins
      searchQuery: null,
      serviceCategoryFilter: null,
      authorFilter: null,
    }
  },
  async created() {
    this.isLoading = true
    await this.fetchServiceCategories()
    for (const i in 4) {
      await this.fetchServiceCategoryChildren(i)
    }
    await this.fetchUsers()
    this.isLoading = false
  },
  computed: {
    ...mapState({
      users: (state) => state.user.data,
      // this.moduleName cause error
      // "this" is undefined in VueX mapping process
      tableData: (state) => state[moduleName].data,
      tableDataQuery: (state) => state[moduleName].query,
      tableDataTotal: (state) => state[moduleName].total,
      serviceCategories: (state) => state.service.category.data,
      locale: (state) => state.locale,
    }),
  },
  methods: {
    ...mapActions({
      fetchUsers: 'user/fetchData',
      fetchData: 'service/fetchData',
      deleteSingle: 'service/deleteSingle',
      fetchServiceCategories: 'service/category/fetchData',
      fetchServiceCategoryChildren: 'service/category/fetchChildren',
    }),
    ...mapMutations({
      setDataQuery: 'service/SET_QUERY',
      clearDataQuery: 'service/CLEAR_QUERY',
      incDataQueryPage: 'service/INC_QUERY_PAGE',
      subDataQueryPage: 'service/SUB_QUERY_PAGE',
    }),
    onEdit(payload) {
      if (
        payload.rowData.user.fullName ===
          this.$store.state.auth.data.fullName ||
        this.$store.state.auth.data.role.label === 'SUPERADMIN'
      ) {
        this.$router.push(
          `/internal/${pluralize.plural(this.moduleName)}/${
            payload.rowData.id
          }/edit`
        )
      } else {
        this.$message.error(this.$t('error.METHOD_NOT_ALLOWED'))
      }
    },
    async onDelete(payload) {
      try {
        if (
          payload.rowData.user.fullName ===
            this.$store.state.auth.data.fullName ||
          this.$store.state.auth.data.role.label === 'SUPERADMIN'
        ) {
          await this.deleteSingle(payload.rowData.id)
          this.$fetch()
        } else {
          this.$message.error(this.$t('error.METHOD_NOT_ALLOWED'))
        }
      } catch (error) {
        //
      }
    },
    async onFilter() {
      const filter = []
      if (this.serviceCategoryFilter) {
        filter.push('serviceCategories.id||$eq||' + this.serviceCategoryFilter)
      }
      if (this.authorFilter) {
        filter.push('userId||$eq||' + this.authorFilter)
      }
      await this.setDataQuery({
        page: 1,
        filter,
        s: this.searchQuery
          ? isNaN(this.searchQuery)
            ? JSON.stringify({
                $or: [
                  {
                    viTitle: { $contL: this.searchQuery },
                  },
                  {
                    viDescription: { $contL: this.searchQuery },
                  },
                  {
                    enTitle: { $contL: this.searchQuery },
                  },
                  {
                    enDescription: { $contL: this.searchQuery },
                  },
                  {
                    note: { $contL: this.searchQuery },
                  },
                  {
                    status: { $contL: this.searchQuery },
                  },
                ],
              })
            : JSON.stringify({
                $or: [
                  {
                    price: { $eq: +this.searchQuery },
                  },
                  {
                    currentPrice: { $eq: +this.searchQuery },
                  },
                  {
                    netPrice: { $eq: +this.searchQuery },
                  },
                ],
              })
          : null,
      })
      this.$fetch()
    },
    onClearFilter() {
      this.authorFilter = null
      this.serviceCategoryFilter = null
      this.searchQuery = null
      this.onRefresh()
    },
  },
}
