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
      createDialogVisible: false,
      editDialogVisible: false,
      isLoading: false,
      createForm: {
        title: '',
        description: '',
      },
      updateForm: {
        id: null,
        title: '',
        description: '',
      },
    }
  },
  computed: {
    ...mapState({
      auth: (state) => state.auth.data,
    }),
  },
  methods: {
    ...mapActions({
      fetchTableData: 'category/fetchData',
      createSingleCategory: 'category/submitSingle',
      updateSingleCategory: 'category/updateSingle',
      deleteSingleCategory: 'category/deleteSingle',
    }),
    onEdit(payload) {
      this.updateForm.title = payload.rowData.title
      this.updateForm.description = payload.rowData.description
      this.updateForm.id = payload.rowData.id
      this.editDialogVisible = true
    },
    onCreate() {
      this.createDialogVisible = true
    },
    onDelete(payload) {
      this.$confirm(this.$t('validation.delete_confirmation'), 'Warning', {
        confirmButtonText: this.$t('common.delete'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning',
      })
        .then(async () => {
          const result = await this.deleteSingleCategory(payload.rowData.id)
          if (result.status === 200) {
            this.$message.success(this.$t('info.RESOURCE_DELETED_SUCCESS'))
          }
          await this.onClearFilter()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async submitCategory() {
      try {
        this.isLoading = true
        const result = await this.createSingleCategory(this.createForm)
        if (result.status === 201) {
          this.createForm = {
            title: '',
            description: '',
          }
          this.createDialogVisible = false
          await this.onClearFilter()
          setTimeout(() => {
            this.$message.success(`${this.$t('info.RESOURCE_CREATED_SUCCESS')}`)
          }, 500)
        }
        this.isLoading = false
      } catch (error) {
        this.createDialogVisible = false
        this.isLoading = false
        console.log(error)
      }
    },
    async updateCategory() {
      try {
        this.isLoading = true
        const result = await this.updateSingleCategory({
          id: this.updateForm.id,
          form: this.updateForm,
        })
        if (result.status === 200) {
          await this.onClearFilter()
          this.editDialogVisible = false
          setTimeout(() => {
            this.$message.success(`${this.$t('info.RESOURCE_UPDATED_SUCCESS')}`)
          }, 500)
        }
        this.isLoading = false
      } catch (error) {
        this.editDialogVisible = false
        this.isLoading = false
        console.log(error)
      }
    },
    async onFilter() {
      try {
        const filter = this.searchQuery
          ? { title: this.searchQuery }
          : { title: '' }
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
      this.searchQuery = ''
      await this.onRefresh()
    },
  },
}
