<template>
  <el-main>
    <Breadcrumb :title="$t('users.create.title')" />
    <el-container class="p-3 mb-10">
      <el-row class="w-full">
        <el-col :span="24" class="mx-auto float-none">
          <el-card shadow="always" class="w-full p-5">
            <FormWrapper
              v-loading="isLoading"
              class="block"
              @my-form-submit="submitUser"
            >
              <el-row :gutter="20" class="relative m-0">
                <el-col :span="14">
                  <div class="mt-5">
                    <label class="text-theme-1">
                      {{ $t('users.create.fullName') }}
                    </label>
                    <InputWrapper rules="required">
                      <el-input
                        v-model="form.fullName"
                        class="el-default-input"
                      ></el-input>
                    </InputWrapper>
                  </div>
                  <div class="mt-10">
                    <label class="text-theme-1">
                      {{ $t('users.create.email') }}
                    </label>
                    <InputWrapper rules="required|email">
                      <el-input
                        v-model="form.email"
                        class="el-default-input"
                      ></el-input>
                    </InputWrapper>
                  </div>
                  <div class="mt-10">
                    <label class="text-theme-1">
                      {{ $t('users.create.password') }}
                    </label>
                    <InputWrapper rules="required">
                      <el-input
                        v-model="form.password"
                        show-password
                        class="el-default-input"
                      ></el-input>
                    </InputWrapper>
                  </div>
                  <div class="mt-10">
                    <label class="text-theme-1">
                      {{ $t('users.create.phone') }}
                    </label>
                    <InputWrapper rules="required|numeric">
                      <el-input
                        v-model="form.phone"
                        class="el-default-input"
                      ></el-input>
                    </InputWrapper>
                  </div>
                  <div class="mt-10">
                    <label class="text-theme-1">
                      {{ $t('users.create.gender') }}
                    </label>
                    <InputWrapper rules="required">
                      <el-radio v-model="form.gender" label="MALE">
                        {{ $t('users.create.gender-male') }}
                      </el-radio>
                      <el-radio v-model="form.gender" label="FEMALE">
                        {{ $t('users.create.gender-female') }}
                      </el-radio>
                    </InputWrapper>
                  </div>
                  <div class="mt-5">
                    <label class="text-theme-1">
                      {{ $t('users.create.birthday') }}
                    </label>
                    <InputWrapper>
                      <el-date-picker
                        v-model="form.birthday"
                        class="el-default-input"
                        type="date"
                        :placeholder="$t('users.create.birthday')"
                      >
                      </el-date-picker>
                    </InputWrapper>
                  </div>
                  <div class="mt-10">
                    <label class="text-theme-1">
                      {{ $t('users.create.role') }}
                    </label>
                    <InputWrapper>
                      <el-select v-model="form.roleId" class="el-default-input">
                        <el-option
                          v-for="role in roles"
                          :key="'role-' + role.id"
                          :label="$t('users.role.' + role.name)"
                          :value="role.id"
                        >
                        </el-option>
                      </el-select>
                    </InputWrapper>
                  </div>
                  <div class="mt-10">
                    <label class="text-theme-1">
                      {{ $t('users.create.bio') }}
                    </label>
                    <InputWrapper>
                      <el-input
                        v-model="form.bio"
                        class="el-default-input"
                        type="textarea"
                        :rows="4"
                      >
                      </el-input>
                    </InputWrapper>
                  </div>
                  <div class="mt-10">
                    <label class="text-theme-1">
                      {{ $t('users.create.note') }}
                    </label>
                    <InputWrapper>
                      <el-input
                        v-model="form.note"
                        class="el-default-input"
                        type="textarea"
                        :rows="4"
                      >
                      </el-input>
                    </InputWrapper>
                  </div>
                  <div class="mt-10">
                    <label class="text-theme-1">
                      {{ $t('users.create.status') }}
                    </label>
                    <el-switch
                      v-model="form.status"
                      active-color="#13ce66"
                      active-value="ACTIVE"
                      inactive-value="INACTIVE"
                    >
                    </el-switch>
                  </div>
                </el-col>
                <el-col :span="10">
                  <div class="mt-5 pl-5">
                    <label class="text-theme-1">
                      {{ $t('users.create.avatar') }}
                    </label>
                    <InputWrapper rules="required">
                      <FileUploader
                        v-model="imageList"
                        :limit="1"
                        @my-file-uploader-change="handleFileUploadChange"
                      />
                    </InputWrapper>
                  </div>
                  <div
                    class="text-center absolute"
                    style="bottom: 0; right: 0;"
                  >
                    <el-button
                      round
                      :loading="isLoading"
                      type="primary"
                      class="bg-gray-200 text-theme-1 hover:bg-gray-300 shadow border-none"
                      @click="$router.push('/users')"
                    >
                      {{ $t('users.create.go-back') }}
                    </el-button>
                    <el-button
                      round
                      :loading="isLoading"
                      native-type="submit"
                      type="primary"
                      class="bg-theme-1 text-light hover:bg-theme-1-600 shadow border-none"
                    >
                      {{ $t('users.create.submit') }}
                    </el-button>
                  </div>
                </el-col>
              </el-row>
            </FormWrapper>
          </el-card>
        </el-col>
      </el-row>
    </el-container>
  </el-main>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import { Message } from 'element-ui'
import {
  FormWrapper,
  InputWrapper,
  Breadcrumb,
  FileUploader,
} from '~/components/common'
import { userActions, roleActions } from '~/constants/vuex'
import { fileMixin } from '~/mixins'
const permission = 'SUPERADMIN'
export default {
  components: { FormWrapper, InputWrapper, Breadcrumb, FileUploader },
  mixins: [fileMixin],
  middleware({ store, query, redirect }) {
    if (!permission.includes(store.state.auth.data.role)) {
      Message.error('Permission denied')
      return redirect('/')
    }
  },
  async fetch() {
    try {
      this.isLoading = true
      await this.fetchRoles()
      this.isLoading = false
    } catch (error) {
      this.isLoading = false
    }
  },
  data() {
    return {
      form: {
        fullName: null,
        email: null,
        password: null,
        phone: null,
        avatar: null,
        gender: 'MALE',
        birthday: null,
        bio: null,
        note: null,
        status: 'ACTIVE',
        roleId: 4,
      },
      imageList: [],
      isLoading: false,
    }
  },
  computed: {
    ...mapState({
      roles: (state) => state.user.role.data,
    }),
  },
  methods: {
    ...mapActions({
      fetchRoles: roleActions.FETCH.DATA,
      reFetchUsers: userActions.FETCH.DATA,
      submitSingleUser: userActions.SUBMIT.SINGLE,
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
        const responseUrls = await this.uploadFilesToS3(
          this.imageList,
          'USER_IMAGES'
        )
        this.form.avatar = await responseUrls[0]
        await this.submitSingleUser(this.form)
        this.reFetchUsers()
        this.$router.push('/users')
        // Reset form
        this.form = {
          fullName: null,
          email: null,
          password: null,
          phone: null,
          avatar: null,
          gender: 'MALE',
          birthday: null,
          bio: null,
          note: null,
          status: 'ACTIVE',
          roleId: 4,
        }
        this.imageList = []
        this.isLoading = false
      } catch (err) {
        this.isLoading = false
      }
    },
  },
}
</script>
