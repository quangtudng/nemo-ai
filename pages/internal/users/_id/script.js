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
  middleware({ store, query, redirect }) {
    if (!permission.includes(store.state.auth.data.role.label)) {
      Message.error('Permission denied')
      return redirect('/')
    }
  },
  async fetch() {
    try {
      this.isLoading = true
      const id = this.$route.params.id
      const userData = await this.$store.dispatch('user/fetchSingle', id)
      this.form = { ...this.form, ...userData.data }
      this.form.roleId = userData.data.role.id
      if (userData.data.avatar) {
        this.imageList.push({ url: userData.data.avatar })
      }
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
      updateSingleUser: 'user/updateSingle',
    }),
    async handleFileUploadChange(fileList) {
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
    },
    async submitUpdate() {
      if (this.form.password === null || this.form.password === '') {
        delete this.form.password
      }
      this.isLoading = true
      try {
        await this.updateSingleUser({
          id: this.$route.params.id,
          form: this.form,
        })
        this.isLoading = false
        this.$router.push('/internal/users')
      } catch (error) {
        this.isLoading = false
      }
    },
  },
}
