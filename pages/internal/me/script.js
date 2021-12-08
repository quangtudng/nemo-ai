import { mapActions } from 'vuex'
import {
  FormWrapper,
  InputWrapper,
  Breadcrumb,
  FileUploader,
} from '~/components/common'
export default {
  layout: 'internal',
  components: { FormWrapper, InputWrapper, Breadcrumb, FileUploader },
  async fetch() {
    try {
      this.isLoading = true
      const currentUser = await this.fetchMe()
      const allRoles = await this.fetchRoles()

      this.form = {
        ...this.form,
        ...currentUser.data,
        roleId: currentUser.data.role.id,
      }
      if (currentUser.data.avatar) {
        this.imageList.push({ url: currentUser.data.avatar })
      }
      this.roles = allRoles?.data?.data || []
      this.isLoading = false
    } catch (error) {
      console.log(error)
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
      updateMe: 'auth/updateMe',
      fetchMe: 'auth/fetchMe',
    }),
    async handleFileUploadChange(fileList) {
      //
    },
    async processImage() {
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
      try {
        if (this.form.password === null || this.form.password === '') {
          delete this.form.password
        }
        this.isLoading = true
        await this.processImage()
        await this.updateMe(this.form)
        this.isLoading = false
      } catch (e) {
        console.log(e)
        this.isLoading = false
      }
    },
  },
}
