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
  middleware({ store, redirect, app }) {
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
        icon: '',
      },
      updateForm: {
        id: null,
        title: '',
        description: '',
        icon: '',
      },
      icons: [
        'parking',
        'wifi',
        'swimming-pool',
        'utensils',
        'biking',
        'bicycle',
        'baby-carriage',
        'child',
        'cocktail',
        'coffee',
        'anchor',
        'running',
        'wind',
        'taxi',
        'bus',
        'car',
        'lock',
        'luggage-cart',
        'suitcase-rolling',
        'shopping-cart',
        'money-bill-alt',
        'gift',
        'umbrella-beach',
        'umbrella',
        'credit-card',
        'tshirt',
        'shield-virus',
        'sun',
        'briefcase',
        'tv',
        'bed',
        'toilet',
        'couch',
        'user-tie',
        'laptop',
        'road',
        'clock',
        'hamburger',
        'pizza-slice',
        'ice-cream',
        'hotdog',
        'fish',
        'mug-hot',
        'mountain',
        'city',
        'smoking-ban',
        'paw',
        'bath',
        'shoe-prints',
        'phone-square-alt',
        'smoking',
        'fax',
        'spa',
        'drumstick-bite',
        'gamepad',
        'heart',
        'dumbbell',
        'newspaper',
        'clinic-medical',
        'water',
        'hiking',
        'person-booth',
        'music',
        'church',
        'mobile-alt',
        'skiing-nordic',
        'table-tennis',
        'bolt',
        'broadcast-tower',
        'fist-raised',
        'golf-ball',
        'dice',
      ],
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
      this.updateForm.icon = payload.rowData.icon
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
          const result = await this.deleteSingleAmenity(payload.rowData.id)
          if (result.status === 200) {
            this.$message.success(this.$t('info.RESOURCE_DELETED_SUCCESS'))
          }
          await this.onClearFilter()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async submitAmenity() {
      try {
        this.isLoading = true
        const result = await this.createSingleAmenity(this.createForm)
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
    async updateAmenity() {
      try {
        this.isLoading = true
        const result = await this.updateSingleAmenity({
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
    async onClearFilter() {
      this.searchQuery = ''
      await this.onRefresh()
    },
  },
}
