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
    async submitUser() {
      try {
        this.isLoading = true
        await this.submitSingleUser(this.form)
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
        this.isLoading = false
      } catch (err) {
        this.isLoading = false
      }
    },
  },
}
