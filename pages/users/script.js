// Modify this DataTable component to suit your api
import qs from 'qs'
import { mapActions, mapState, mapMutations } from 'vuex'
import { Message } from 'element-ui'
import { DataTable, Breadcrumb } from '~/components/common'
import {
  userActions as moduleActions,
  userMutations as moduleMutations,
  roleActions,
} from '~/constants/vuex'
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
      store.commit(moduleMutations.SET.QUERY, query)
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
      roles: (state) => state.user.role.data,
    }),
  },
  methods: {
    ...mapActions({
      fetchData: moduleActions.FETCH.DATA,
      deleteSingle: moduleActions.DELETE.SINGLE,
      fetchRoles: roleActions.FETCH.DATA,
    }),
    ...mapMutations({
      setDataQuery: moduleMutations.SET.QUERY,
      clearDataQuery: moduleMutations.CLEAR.QUERY,
      incDataQueryPage: moduleMutations.INC.QUERY_PAGE,
      subDataQueryPage: moduleMutations.SUB.QUERY_PAGE,
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
    async onFilter() {
      await this.setDataQuery({
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
