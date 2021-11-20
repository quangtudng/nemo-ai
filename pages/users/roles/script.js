// Modify this DataTable component to suit your api
import qs from 'qs'
import { mapActions, mapState, mapMutations } from 'vuex'
import { Message } from 'element-ui'
import { DataTable, Breadcrumb } from '~/components/common'
import {
  roleActions as moduleActions,
  roleMutations as moduleMutations,
} from '~/constants/vuex'
import { dataTableMixin } from '~/mixins'
// const pluralize = require('pluralize')
// const moduleName = 'role' // Module name
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
  computed: {
    ...mapState({
      // this.moduleName cause error
      // "this" is undefined in VueX mapping process
      tableData: (state) => state.user.role.data,
      tableDataQuery: (state) => state.user.role.query,
      tableDataTotal: (state) => state.user.role.total,
    }),
  },
  methods: {
    ...mapActions({
      fetchData: moduleActions.FETCH.DATA,
      deleteSingle: moduleActions.DELETE.SINGLE,
    }),
    ...mapMutations({
      setDataQuery: moduleMutations.SET.QUERY,
      clearDataQuery: moduleMutations.CLEAR.QUERY,
      incDataQueryPage: moduleMutations.INC.QUERY_PAGE,
      subDataQueryPage: moduleMutations.SUB.QUERY_PAGE,
    }),
    onEdit(payload) {
      this.$router.push(`/users/roles/${payload.rowData.id}/edit`)
    },
    async onDelete(payload) {
      try {
        await this.deleteSingle(payload.rowData.id)
        this.$fetch()
      } catch (error) {
        //
      }
    },
  },
}
