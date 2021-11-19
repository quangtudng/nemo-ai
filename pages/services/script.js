// Modify this DataTable component to suit your api
import qs from 'qs'
import { mapActions, mapState, mapMutations } from 'vuex'
import { DataTable, Breadcrumb } from '~/components/common'
import {
  serviceActions as moduleActions,
  serviceMutations as moduleMutations,
  serviceCategoryActions,
  userActions,
} from '~/constants/vuex'
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
      store.commit(moduleMutations.SET.QUERY, query)
    }
  },
  data() {
    return {
      moduleName, // For the mixins
      searchString: null,
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
      fetchUsers: userActions.FETCH.DATA,
      fetchData: moduleActions.FETCH.DATA,
      deleteSingle: moduleActions.DELETE.SINGLE,
      fetchServiceCategories: serviceCategoryActions.FETCH.DATA,
      fetchServiceCategoryChildren: serviceCategoryActions.FETCH.CHILDREN,
    }),
    ...mapMutations({
      setDataQuery: moduleMutations.SET.QUERY,
      clearDataQuery: moduleMutations.CLEAR.QUERY,
      incDataQueryPage: moduleMutations.INC.QUERY_PAGE,
      subDataQueryPage: moduleMutations.SUB.QUERY_PAGE,
    }),
    onEdit(payload) {
      if (
        payload.rowData.user.fullName ===
          this.$store.state.auth.data.fullName ||
        this.$store.state.auth.data.role === 'ADMIN'
      ) {
        this.$router.push(
          `/${pluralize.plural(this.moduleName)}/${payload.rowData.id}/edit`
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
          this.$store.state.auth.data.role === 'ADMIN'
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
        s: this.searchString
          ? isNaN(this.searchString)
            ? JSON.stringify({
                $or: [
                  {
                    viTitle: { $contL: this.searchString },
                  },
                  {
                    viDescription: { $contL: this.searchString },
                  },
                  {
                    enTitle: { $contL: this.searchString },
                  },
                  {
                    enDescription: { $contL: this.searchString },
                  },
                  {
                    note: { $contL: this.searchString },
                  },
                  {
                    status: { $contL: this.searchString },
                  },
                ],
              })
            : JSON.stringify({
                $or: [
                  {
                    price: { $eq: +this.searchString },
                  },
                  {
                    currentPrice: { $eq: +this.searchString },
                  },
                  {
                    netPrice: { $eq: +this.searchString },
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
      this.searchString = null
      this.onRefresh()
    },
  },
}
