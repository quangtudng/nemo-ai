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
      const allRoles = await this.fetchRoles()
      this.roles = allRoles?.data?.data || []
      this.isLoading = false
    } catch (error) {
      console.error(error)
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
      submitSingleUser: 'user/submitSingle',
    }),
    async handleFileUploadChange(fileList) {
      try {
        this.isLoading = true
        if (this.imageList?.length > 0) {
          const rawFile = await this.imageList[0]?.raw
          const response = await this.$fileApi(
            'cloudinary/upload',
            [rawFile],
            'AVATAR'
          )
          const imageArray = response?.data?.data || []
          // Assign the uploaded image url to the user avatar if exists
          if (imageArray && imageArray.length > 0) {
            this.form.avatar = imageArray[0]?.url || ''
          }
        } else {
          // If there is no image, that means no avatar
          this.form.avatar = ''
        }
        this.isLoading = false
      } catch (e) {
        this.isLoading = false
        console.log(e)
        setTimeout(() => {
          this.$message.error(`${this.$t('error.FILE_UPLOADED_FAILED')}`)
        }, 100)
      }
    },
    async submitUser() {
      try {
        this.isLoading = true
        const result = await this.submitSingleUser(this.form)
        if (result.status === 201) {
          // Reset form
          this.form = {
            fullname: '',
            email: '',
            password: '',
            phoneNumber: '',
            bio: '',
            avatar: '',
            status: 0,
            roleId: null,
          }
          this.imageList = []
          this.$message.success(`${this.$t('info.RESOURCE_CREATED_SUCCESS')}`)

          setTimeout(() => {
            this.$router.push('/internal/users')
          }, 500)
        }
        this.isLoading = false
      } catch (err) {
        this.isLoading = false
      }
    },
  },
}
