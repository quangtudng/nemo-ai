// Modify this DataTable component to suit your api
import { mapActions, mapState } from 'vuex'
import { Message } from 'element-ui'
import { DataTable, Breadcrumb } from '~/components/common'
import { dataTableMixin } from '~/mixins'
const permissions = ['SUPERADMIN', 'MODERATOR']

export default {
  layout: 'internal',
  mixins: [dataTableMixin],
  components: {
    DataTable,
    Breadcrumb,
  },
  middleware({ store, redirect }) {
    const roleLabel = store.state.auth.data?.role?.label || ''
    if (!permissions.includes(roleLabel)) {
      Message.error(this.$t('error.PERMISSION_DENIED'))
      return redirect('/internal')
    }
  },
  data() {
    return {
      searchQuery: '',
      roleQuery: null,
      roles: [],
    }
  },
  async created() {
    const data = await this.fetchRoles()
    this.roles = data.data?.data || []
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
    fetchRoleButtonStyle(role) {
      let colorClass = 'primary'
      if (role === 'SUPERADMIN') {
        colorClass = 'danger'
      }
      if (role === 'MODERATOR') {
        colorClass = 'warning'
      }
      if (role === 'AGENT') {
        colorClass = 'success'
      }
      return colorClass
    },
    onEdit(payload) {
      if (this.auth.id === payload.rowData.id) {
        this.$router.push('/internal/me')
      } else {
        this.$router.push(`/internal/users/${payload.rowData.id}/edit`)
      }
    },
    onDelete(payload) {
      try {
        if (this.auth.id === payload.rowData.id) {
          // Prevent user from deleting himself
          this.$message.error(this.$t('validation.delete_self'))
        } else if (payload.rowData.role.label === 'SUPERADMIN') {
          // Prevent user from deleting SUPERADMIN
          this.$message.error(this.$t('validation.delete_admin'))
        } else {
          // Confirm deletion
          this.$confirm(this.$t('validation.delete_confirmation'), 'Warning', {
            confirmButtonText: this.$t('common.delete'),
            cancelButtonText: this.$t('common.cancel'),
            type: 'warning',
          }).then(async () => {
            const result = await this.deleteSingle(payload.rowData.id)
            if (result.status === 200) {
              this.$message.success(this.$t('info.RESOURCE_DELETED_SUCCESS'))
            }
            await this.onClearFilter()
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    async onFilter() {
      try {
        const roleId = this.roleQuery || 0
        const filter = this.searchQuery
          ? { fullname: this.searchQuery, roleId }
          : { fullname: '', roleId }
        this.setDataQuery({
          page: 1,
          ...filter,
        })
        await this.$fetch()
      } catch (error) {
        console.log(error)
      }
    },
    async onClearFilter() {
      try {
        this.roleQuery = null
        this.searchQuery = ''
        await this.onRefresh()
      } catch (error) {
        console.log(error)
      }
    },
  },
}
