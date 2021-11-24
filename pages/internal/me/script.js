import { mapActions, mapMutations } from 'vuex'
import {
  FormWrapper,
  InputWrapper,
  Breadcrumb,
  FileUploader,
} from '~/components/common'
import { fileMixin } from '~/mixins'
export default {
  layout: 'internal',
  components: { FormWrapper, InputWrapper, Breadcrumb, FileUploader },
  mixins: [fileMixin],
  async fetch() {
    try {
      this.isLoading = true
      const currentUser = await this.$store.dispatch('auth/fetchMe')
      this.form = { ...this.form, ...currentUser.data }
      this.form.roleId = currentUser.data.role.id
      if (currentUser.data.avatar) {
        this.imageList.push({ url: currentUser.data.avatar })
      }
      const allRoles = await this.fetchRoles()
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
        fullname: null,
        email: null,
        password: null,
        phoneNumber: null,
        avatar: null,
        bio: null,
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
      updateProfile: 'auth/updateMe',
    }),
    ...mapMutations({
      setAuthFullName: 'auth/SET_AUTH_FULLNAME',
      setAuthAvatar: 'auth/SET_AUTH_AVATAR',
    }),
    async handleFileUploadChange(fileList) {
      /// ////////////////////////////////////
      // Process images
      // resize() only return { raw: Image() } object, so you must spread it
      const responseUrls = await this.uploadFilesToS3(
        this.imageList,
        'USER_IMAGES'
      )
      this.form.avatar = await responseUrls[0]
    },
    async submitUpdate() {
      try {
        this.setAuthFullName(this.form.fullname)
        this.setAuthAvatar(this.form.avatar)
        if (this.form.password === null || this.form.password === '') {
          delete this.form.password
        }
        this.isLoading = true
        await this.updateProfile(this.form)
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
      }
    },
  },
}
