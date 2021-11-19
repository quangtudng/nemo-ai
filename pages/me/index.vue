<template>
  <el-main>
    <Breadcrumb :title="$t('users.edit.title')" />
    <el-container class="p-3 mb-10">
      <el-row class="w-full">
        <el-col :span="24" class="mx-auto float-none">
          <el-card shadow="always" class="w-full p-5">
            <FormWrapper
              v-loading="isLoading"
              class="block"
              @my-form-submit="submitUpdate"
            >
              <el-row :gutter="20" class="relative m-0">
                <el-col :span="14">
                  <div class="mt-5">
                    <label class="text-theme-1">
                      {{ $t('users.edit.fullName') }}
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
                      {{ $t('users.edit.email') }}
                    </label>
                    <InputWrapper rules="required|email">
                      <el-input
                        v-model="form.email"
                        :disabled="true"
                        class="el-default-input"
                      ></el-input>
                    </InputWrapper>
                  </div>
                  <div class="mt-10">
                    <label class="text-theme-1">
                      {{ $t('users.edit.password') }}
                    </label>
                    <!-- Password is not required in edit -->
                    <InputWrapper>
                      <el-input
                        v-model="form.password"
                        show-password
                        class="el-default-input"
                      ></el-input>
                    </InputWrapper>
                  </div>
                  <div class="mt-10">
                    <label class="text-theme-1">
                      {{ $t('users.edit.phone') }}
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
                      {{ $t('users.edit.gender') }}
                    </label>
                    <InputWrapper rules="required">
                      <el-radio v-model="form.gender" label="MALE">
                        {{ $t('users.edit.gender-male') }}
                      </el-radio>
                      <el-radio v-model="form.gender" label="FEMALE">
                        {{ $t('users.edit.gender-female') }}
                      </el-radio>
                    </InputWrapper>
                  </div>
                  <div class="mt-5">
                    <label class="text-theme-1">
                      {{ $t('users.edit.birthday') }}
                    </label>
                    <InputWrapper>
                      <el-date-picker
                        v-model="form.birthday"
                        class="el-default-input"
                        type="date"
                        :placeholder="$t('users.edit.birthday')"
                      >
                      </el-date-picker>
                    </InputWrapper>
                  </div>
                  <div class="mt-10">
                    <label class="text-theme-1">
                      {{ $t('users.edit.role') }}
                    </label>
                    <InputWrapper>
                      <el-select
                        v-model="form.roleId"
                        class="el-default-input"
                        :disabled="true"
                      >
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
                      {{ $t('users.edit.bio') }}
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
                      {{ $t('users.edit.note') }}
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
                      {{ $t('users.edit.status') }}
                    </label>
                    <el-switch
                      v-model="form.status"
                      :disabled="true"
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
                      {{ $t('users.edit.avatar') }}
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
                      @click="$router.push('/')"
                    >
                      {{ $t('users.edit.go-back') }}
                    </el-button>
                    <el-button
                      round
                      :loading="isLoading"
                      native-type="submit"
                      type="primary"
                      class="bg-theme-1 text-light hover:bg-theme-1-600 shadow border-none"
                    >
                      {{ $t('users.edit.submit') }}
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
import { mapActions, mapState, mapMutations } from 'vuex'
import {
  FormWrapper,
  InputWrapper,
  Breadcrumb,
  FileUploader,
} from '~/components/common'
import { authActions, roleActions, authMutations } from '~/constants/vuex'
import { fileMixin } from '~/mixins'
export default {
  components: { FormWrapper, InputWrapper, Breadcrumb, FileUploader },
  mixins: [fileMixin],
  async fetch() {
    try {
      this.isLoading = true
      const { data } = await this.$store.dispatch(authActions.FETCH.ME)
      this.form = { ...this.form, ...data.data }
      if (data.data.avatar) {
        this.imageList.push({ url: data.data.avatar })
      }
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
      updateProfile: authActions.UPDATE.ME,
    }),
    ...mapMutations({
      setAuthFullName: authMutations.SET.AUTH_FULLNAME,
      setAuthAvatar: authMutations.SET.AUTH_AVATAR,
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
        this.setAuthFullName(this.form.fullName)
        this.setAuthAvatar(this.form.avatar)
        if (this.form.password === null || this.form.password === '') {
          await delete this.form.password
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
</script>
