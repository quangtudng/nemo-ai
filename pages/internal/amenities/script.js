// Modify this DataTable component to suit your api
import { mapActions, mapState } from 'vuex'
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
      fetchTableData: 'amenity/fetchData',
      deleteSingleAmenity: 'amenity/deleteSingle',
      updateSingleAmenity: 'amenity/updateSingle',
      createSingleAmenity: 'amenity/submitSingle',
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
      this.$confirm(
        'Do you want to delete this amenity. This action cannot be reversed',
        'Warning',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning',
        }
      ).then(async () => {
        await this.onConfirmDelete(payload.rowData.id)
      })
    },
    async onConfirmDelete(id) {
      await this.deleteSingleAmenity(id)
      await this.$fetch()
    },
    async submitAmenity() {
      try {
        this.isLoading = true
        await this.createSingleAmenity(this.createForm)
        await this.$fetch()
        this.createDialogVisible = false
        this.isLoading = false
      } catch (error) {
        this.createDialogVisible = false
        this.isLoading = false
        console.log(error)
      }
    },
    async updateAmenity() {
      try {
        this.isLoading = true
        if (this.updateForm.id) {
          await this.updateSingleAmenity({
            id: this.updateForm.id,
            form: this.updateForm,
          })
        }
        await this.$fetch()
        this.editDialogVisible = false
        this.isLoading = false
      } catch (error) {
        this.editDialogVisible = false
        this.isLoading = false
        console.log(error)
      }
    },
    onFilter() {
      const filter = this.searchQuery
        ? { title: this.searchQuery }
        : { title: '' }
      this.setDataQuery({
        page: 1,
        ...filter,
      })
      this.$fetch()
    },
    onClearFilter() {
      this.searchQuery = null
      this.onRefresh()
    },
  },
}
