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
                        v-model="form.fullname"
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
                    <InputWrapper>
                      <el-input
                        v-model="form.phoneNumber"
                        class="el-default-input"
                      ></el-input>
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
                          :label="$t('users.role.' + role.label)"
                          :value="role.id"
                          :disabled="role.id == 1"
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
                      {{ $t('users.create.status') }}
                    </label>
                    <el-switch
                      v-model="form.status"
                      active-color="#13ce66"
                      :active-value="1"
                      :inactive-value="0"
                    >
                    </el-switch>
                  </div>
                </el-col>
                <el-col :span="10">
                  <div class="mt-5 pl-5">
                    <label class="text-theme-1">
                      {{ $t('users.create.avatar') }}
                    </label>
                    <InputWrapper>
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
                      :loading="isLoading"
                      type="primary"
                      class="bg-gray-200 text-theme-1 hover:bg-gray-300 shadow border-none"
                      @click="$router.push('/internal/users')"
                    >
                      {{ $t('users.create.go-back') }}
                    </el-button>
                    <el-button
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
<script src="./script.js"></script>
