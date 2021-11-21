// Modify this DataTable component to suit your api
import qs from 'qs'
import { mapActions, mapState, mapMutations } from 'vuex'
import { Message } from 'element-ui'
import { DataTable, Breadcrumb } from '~/components/common'
import { dataTableMixin } from '~/mixins'
const pluralize = require('pluralize')
const moduleName = 'user' // Module name
const permission = 'SUPERADMIN'

export default {
  mixins: [dataTableMixin],
  components: {
    DataTable,
    Breadcrumb,
  },
  middleware({ store, query, redirect }) {
    if (!permission.includes(store.state.auth.data.role)) {
      Message.error('Permission denied')
      return redirect('/')
    }
    if (qs.stringify(query) !== '') {
      // Looking for numeric string and convert them to Number
      Object.keys(query).forEach((key, index) => {
        if (!isNaN(query[key])) {
          query[key] = Number(query[key])
        }
      })
      store.commit('user/SET_QUERY', query)
    }
  },
  data() {
    return {
      moduleName, // For the mixins
      searchString: null,
      roleFilter: null,
    }
  },
  created() {
    try {
      this.fetchRoles()
    } catch (error) {
      //
    }
  },
  computed: {
    ...mapState({
      // this.moduleName cause error
      // "this" is undefined in VueX mapping process
      tableData: (state) => state[moduleName].data,
      tableDataQuery: (state) => state[moduleName].query,
      tableDataTotal: (state) => state[moduleName].total,
      roles: (state) => state.role.data,
    }),
  },
  methods: {
    ...mapActions({
      // fetchData: 'user/fetchData',
      deleteSingle: 'user/deleteSingle',
      fetchRoles: 'role/fetchData',
    }),
    ...mapMutations({
      setDataQuery: 'user/SET_QUERY',
      clearDataQuery: 'user/CLEAR_QUERY',
      incDataQueryPage: 'user/INC_QUERY_PAGE',
      subDataQueryPage: 'user/SUB_QUERY_PAGE',
    }),
    onEdit(payload) {
      this.$router.push(
        `/${pluralize.plural(this.moduleName)}/${payload.rowData.id}/edit`
      )
    },
    async onDelete(payload) {
      try {
        await this.deleteSingle(payload.rowData.id)
        this.$fetch()
      } catch (error) {
        //
      }
    },
    async fetchData() {
      const response = await this.$authApi.get(
        '/users?' + qs.stringify(this.query, { arrayFormat: 'repeat' })
      )
      this.tableDataState = response.data.data
      // commit('user/SET_DATA', response.data.data, { root: true })
      // Fix total later
      // commit('user/SET_TOTAL', response.data.total, { root: true })
      return response.data.data
    },
    onFilter() {
      this.setDataQuery({
        page: 1,
        filter: this.roleFilter ? 'role.id||$eq||' + this.roleFilter : null,
        s: this.searchString
          ? JSON.stringify({
              $or: [
                {
                  fullName: { $cont: this.searchString },
                },
                {
                  phone: { $cont: this.searchString },
                },
                {
                  email: { $cont: this.searchString },
                },
              ],
            })
          : null,
      })
      this.$fetch()
    },
    onClearFilter() {
      this.roleFilter = null
      this.searchString = null
      this.onRefresh()
    },
  },
}
