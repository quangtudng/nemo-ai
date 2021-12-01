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
