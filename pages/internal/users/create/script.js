import { mapActions } from 'vuex'
import { Message } from 'element-ui'
import {
  FormWrapper,
  InputWrapper,
  Breadcrumb,
  FileUploader,
} from '~/components/common'
import { fileMixin } from '~/mixins'
const permission = 'SUPERADMIN'
export default {
  layout: 'internal',
  components: { FormWrapper, InputWrapper, Breadcrumb, FileUploader },
  mixins: [fileMixin],
  middleware({ store, redirect }) {
    if (!permission.includes(store.state.auth.data.role.label)) {
      Message.error('Permission denied')
      return redirect('/')
    }
  },
  async fetch() {
    try {
      this.isLoading = true
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
        fullname: null,
        email: null,
        password: null,
        phoneNumber: null,
        avatar: null,
        bio: null,
        status: 1,
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
    handleFileUploadChange(fileList) {
      console.log(fileList)
    },
    async submitUser() {
      try {
        this.isLoading = true
        /// ////////////////////////////////////
        // Process images
        // resize() only return { raw: Image() } object, so you must spread it
        if (this.imageList) {
          const responseUrls = await this.uploadFilesToS3(
            this.imageList,
            'USER_IMAGES'
          )
          this.form.avatar = await responseUrls[0]
        }
        await this.submitSingleUser(this.form)
        // Reset form
        this.form = {
          fullname: null,
          email: null,
          password: null,
          phoneNumber: null,
          avatar: null,
          bio: null,
          status: 1,
          roleId: null,
        }
        this.imageList = []
        this.isLoading = false
        this.$router.push('/internal/users')
      } catch (err) {
        this.isLoading = false
      }
    },
  },
}
