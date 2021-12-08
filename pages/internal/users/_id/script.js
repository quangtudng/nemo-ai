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
      updateSingleUser: 'user/updateSingle',
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
          // Assign the uploaded image url to the user avatar
          if (imageArray && imageArray.length > 0) {
            this.form.avatar = imageArray[0]?.url || ''
          }
        } else {
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
        await this.updateSingleUser({
          id: this.$route.params.id,
          form: this.form,
        })
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
      }
    },
  },
}
