// Modify this DataTable component to suit your api
import { mapActions, mapState } from 'vuex'
import { Message } from 'element-ui'
import { DataTable, Breadcrumb } from '~/components/common'
import { dataTableMixin } from '~/mixins'
const pluralize = require('pluralize')
const moduleName = 'user' // Module name
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
  data() {
    return {
      moduleName, // For the mixins
      searchQuery: null,
      roleQuery: null,
      roles: [],
    }
  },
  async created() {
    const data = await this.fetchRoles()
    this.roles = data?.data?.data || []
  },
  computed: {
    ...mapState({
      auth: (state) => state.auth.data,
    }),
  },
  methods: {
    ...mapActions({
      fetchTableData: 'user/fetchData',
      deleteSingle: 'user/deleteSingle',
      fetchRoles: 'role/fetchData',
    }),
    onEdit(payload) {
      if (this.auth.id === payload.rowData.id) {
        this.$router.push('/internal/me')
      } else {
        this.$router.push(
          `/internal/${pluralize.plural(this.moduleName)}/${
            payload.rowData.id
          }/edit`
        )
      }
    },
    onDelete(payload) {
      if (this.auth.id === payload.rowData.id) {
        Message.error('You cannot delete yourself')
      } else {
        this.$confirm(
          'Do you want to delete this user. This action cannot be reversed',
          'Warning',
          {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
          }
        ).then(async () => {
          await this.onConfirmDelete(payload.rowData.id)
        })
      }
    },
    async onConfirmDelete(id) {
      await this.deleteSingle(id)
      await this.$fetch()
    },
    onFilter() {
      const roleId = this.roleQuery || 0
      const filter = this.searchQuery
        ? {
            fullname: this.searchQuery,
            email: this.searchQuery,
            roleId,
          }
        : { fullname: '', email: '', roleId }
      this.setDataQuery({
        page: 1,
        ...filter,
      })
      this.$fetch()
    },
    onClearFilter() {
      this.roleQuery = null
      this.searchQuery = null
      this.onRefresh()
    },
  },
}
