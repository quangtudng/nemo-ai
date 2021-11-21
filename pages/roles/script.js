// Modify this DataTable component to suit your api
import qs from 'qs'
import { mapActions, mapState, mapMutations } from 'vuex'
import { Message } from 'element-ui'
import { DataTable, Breadcrumb } from '~/components/common'
import { dataTableMixin } from '~/mixins'
const moduleName = 'role'
const permission = 'SUPERADMIN'

export default {
  mixins: [dataTableMixin],
  components: {
    DataTable,
    Breadcrumb,
  },
  data() {
    return {
      moduleName, // For the mixins
    }
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
      store.commit('role/SET_QUERY', query)
    }
  },
  computed: {
    ...mapState({
      tableData: (state) => state.role.data,
      tableDataQuery: (state) => state.role.query,
      tableDataTotal: (state) => state.role.total,
    }),
  },
  methods: {
    ...mapActions({
      fetchData: 'role/fetchData',
    }),
    ...mapMutations({
      setDataQuery: 'role/SET_QUERY',
      clearDataQuery: 'role/CLEAR_QUERY',
      incDataQueryPage: 'role/INC_QUERY_PAGE',
      subDataQueryPage: 'role/SUB_QUERY_PAGE',
    }),
    onEdit(payload) {
      Message.error('Role cannot be edit')
    },
    onDelete(payload) {
      Message.error('Role cannot be deleted')
    },
  },
}
