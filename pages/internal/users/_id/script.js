import { mapActions } from 'vuex'
import { Message } from 'element-ui'
import {
  FormWrapper,
  InputWrapper,
  Breadcrumb,
  FileUploader,
} from '~/components/common'
import { fileMixin } from '~/mixins'
const permissions = ['SUPERADMIN', 'MODERATOR']
export default {
  layout: 'internal',
  components: { FormWrapper, InputWrapper, Breadcrumb, FileUploader },
  mixins: [fileMixin],
  middleware({ store, redirect }) {
    const roleLabel = store.state.auth.data?.role?.label || ''
    if (!permissions.includes(roleLabel)) {
      Message.error(this.$t('error.PERMISSION_DENIED'))
      return redirect('/internal')
    }
  },
  async fetch() {
    try {
      this.isLoading = true
      // Fetch user that is being edited
      const id = this.$route.params.id
      const userData = await this.fetchSingleUser(id)
      this.form = { ...this.form, ...userData.data }
      this.form.roleId = userData.data.role.id
      if (userData.data.avatar) {
        this.imageList.push({ url: userData.data.avatar })
      }
      // Fetch all roles
      const allRoles = await this.fetchRoles()
      this.roles = allRoles?.data?.data || []
      this.isLoading = false
    } catch (error) {
      this.isLoading = false
    }
  },
  data() {
    return {
      form: {
        fullname: '',
        email: '',
        password: '',
        phoneNumber: '',
        bio: '',
        avatar: '',
        status: 0,
        roleId: null,
      },
      imageList: [],
      isLoading: false,
      roles: [],
    }
  },
  methods: {
    ...mapActions({
      fetchRoles: 'role/fetchData',
      fetchSingleUser: 'user/fetchSingle',
      updateSingleUser: 'user/updateSingle',
    }),
    async processNewImage() {
      try {
        this.isLoading = true
        if (this.imageList?.length > 0) {
          const shouldUploadNewFile = Boolean(
            this.imageList[0] && this.imageList[0]?.status === 'ready'
          )
          if (shouldUploadNewFile) {
            const response = await this.$fileApi(
              'cloudinary/upload',
              [this.imageList[0]?.raw],
              'AVATAR'
            )
            const imageArray = response?.data?.data || []
            const shouldAssignNewAvatar = Boolean(
              imageArray && imageArray.length > 0
            )
            if (shouldAssignNewAvatar) {
              this.form.avatar = imageArray[0]?.url || ''
            }
          }
        } else {
          // No avatar or want to delete their old avatar
          this.form.avatar = ''
        }
        this.isLoading = false
      } catch (e) {
        this.isLoading = false
        console.log(e)
      }
    },
    async submitUpdate() {
      if (this.form.password === null || this.form.password === '') {
        delete this.form.password
      }
      this.isLoading = true
      try {
        await this.processNewImage()
        const result = await this.updateSingleUser({
          id: this.$route.params.id,
          form: this.form,
        })
        if (result.status === 200) {
          this.$message.success(`${this.$t('info.RESOURCE_UPDATED_SUCCESS')}`)
          setTimeout(() => {
            this.$router.push('/internal/users')
          }, 500)
        }
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
      }
    },
  },
}
