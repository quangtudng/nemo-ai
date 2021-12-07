<template>
  <el-main>
    <Breadcrumb :title="$t('services.create.title')" />
    <el-container class="p-3 mb-10">
      <el-row class="w-full">
        <el-col :span="24" class="mx-auto float-none">
          <el-card shadow="always" class="w-full p-5">
            <FormWrapper
              v-loading="isLoading"
              class="block"
              @my-form-submit="updateService"
            >
              <el-row :gutter="20" class="relative m-0">
                <el-col :span="14">
                  <!-- Title -->
                  <div class="mt-5">
                    <label class="text-theme-1">
                      Tiêu đề
                    </label>
                    <InputWrapper rules="required">
                      <el-input
                        v-model="form.title"
                        class="el-default-input"
                      ></el-input>
                    </InputWrapper>
                  </div>
                  <!-- Description -->
                  <div class="mt-10">
                    <label class="text-theme-1">
                      Mô tả
                    </label>
                    <InputWrapper>
                      <el-input
                        v-model="form.description"
                        class="el-default-input"
                        type="textarea"
                        :rows="4"
                      >
                      </el-input>
                    </InputWrapper>
                  </div>
                  <!-- Service category -->
                  <div class="mt-10">
                    <label class="text-theme-1">
                      {{ $t('services.create.serviceCategory') }}
                    </label>
                    <InputWrapper rules="required">
                      <el-select
                        v-model="form.categoryId"
                        filterable
                        class="el-default-input"
                        style="width: 400px;"
                      >
                        <el-option
                          v-for="category in serviceCategories"
                          :key="'category-' + category.id"
                          :label="category.title"
                          :value="category.id"
                        />
                      </el-select>
                    </InputWrapper>
                  </div>
                  <!-- Amenity -->
                  <div class="mt-10">
                    <label class="text-theme-1">
                      {{ $t('services.create.amenities') }}
                    </label>
                    <InputWrapper>
                      <el-select
                        v-model="form.serviceAmenities"
                        filterable
                        multiple
                        class="el-default-input"
                        style="width: 400px;"
                      >
                        <el-option
                          v-for="amenity in amenities"
                          :key="'amenity-' + amenity.id"
                          :label="amenity.title"
                          :value="amenity.id"
                        />
                      </el-select>
                    </InputWrapper>
                  </div>
                  <!-- Destination -->
                  <div class="mt-10">
                    <label class="text-theme-1">
                      {{ $t('services.create.destinations') }}
                    </label>
                    <InputWrapper rules="required">
                      <treeselect
                        v-model="form.locationId"
                        :options="locations"
                        :normalizer="normalizer"
                        no-children-text="Empty"
                        :default-expand-level="1"
                        :match-keys="['name']"
                      />
                    </InputWrapper>
                  </div>
                  <!-- Price -->
                  <div class="mt-5">
                    <label class="text-theme-1">
                      {{ $t('services.create.price') }}
                      <small>VNĐ</small>
                    </label>
                    <InputWrapper rules="numeric">
                      <el-input
                        v-model="form.price"
                        class="el-default-input"
                        type="number"
                      ></el-input>
                    </InputWrapper>
                  </div>
                  <!-- Main page -->
                  <div class="mt-5">
                    <label class="text-theme-1">
                      Trang chủ dịch vụ
                    </label>
                    <InputWrapper>
                      <el-input
                        v-model="form.originUrl"
                        class="el-default-input"
                      ></el-input>
                    </InputWrapper>
                  </div>
                  <!-- Full address -->
                  <div class="mt-5">
                    <label class="text-theme-1">
                      Địa chỉ dịch vụ
                    </label>
                    <InputWrapper>
                      <el-input
                        v-model="form.fullAddress"
                        class="el-default-input"
                      ></el-input>
                    </InputWrapper>
                  </div>
                  <!-- Phonenumber -->
                  <div class="mt-5">
                    <label class="text-theme-1">
                      Số điện thoại
                    </label>
                    <InputWrapper>
                      <el-input
                        v-model="form.phoneNumber"
                        class="el-default-input"
                      ></el-input>
                    </InputWrapper>
                  </div>
                </el-col>
                <!-- Right side -->
                <el-col :span="10">
                  <!-- Thumbnail -->
                  <div class="mt-5">
                    <label class="text-theme-1">
                      {{ $t('services.create.thumbnail') }}
                    </label>
                    <InputWrapper>
                      <FileUploader
                        v-model="imageList"
                        :limit="10"
                        @my-file-uploader-change="handleFileUploadChange"
                      />
                    </InputWrapper>
                  </div>
                  <!-- Submit section area -->
                  <div
                    class="text-center absolute"
                    style="bottom: 0; right: 0;"
                  >
                    <el-button
                      :loading="isLoading"
                      type="primary"
                      class="bg-gray-200 text-theme-1 hover:bg-gray-300 shadow border-none"
                      @click="$router.push('/internal/services')"
                    >
                      {{ $t('services.create.go-back') }}
                    </el-button>
                    <el-button
                      :loading="isLoading"
                      native-type="submit"
                      type="primary"
                      class="bg-theme-1 text-light hover:bg-theme-1-600 shadow border-none"
                    >
                      {{ $t('services.create.submit') }}
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
<script src="./script.js" />
<style>
.vue-treeselect__control {
  width: 400px;
  height: 40px;
  background: #e6e9f0;
}

.vue-treeselect__single-value {
  color: var(--color-theme-1);
}
</style>
