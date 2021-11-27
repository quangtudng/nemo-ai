// Modify this DataTable component to suit your api
import qs from 'qs'
import { mapActions } from 'vuex'
import { Message } from 'element-ui'
import { DataTable, Breadcrumb } from '~/components/common'
import { dataTableMixin } from '~/mixins'
const permission = 'SUPERADMIN'

export default {
  layout: 'internal',
  mixins: [dataTableMixin],
  components: {
    DataTable,
    Breadcrumb,
  },
  middleware({ store, query, redirect }) {
    if (!permission.includes(store.state.auth.data.role.label)) {
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
  methods: {
    ...mapActions({
      fetchTableData: 'role/fetchData',
    }),
    onEdit(payload) {
      Message.error('Role cannot be edit')
    },
    onDelete(payload) {
      Message.error('Role cannot be deleted')
    },
  },
}
