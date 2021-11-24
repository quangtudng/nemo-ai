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
              @my-form-submit="submitService"
            >
              <el-row :gutter="20" class="relative m-0">
                <el-col :span="14">
                  <!-- Multi-languages inputs -->
                  <!-- Tiêu đề -->
                  <div class="mt-5">
                    <label class="text-theme-1">
                      Tiêu đề tiếng Việt
                    </label>
                    <InputWrapper rules="required">
                      <el-input
                        v-model="form.viTitle"
                        class="el-default-input"
                      ></el-input>
                    </InputWrapper>
                  </div>
                  <!-- Mô tả -->
                  <div class="mt-10">
                    <label class="text-theme-1">
                      Mô tả tiếng Việt
                    </label>
                    <InputWrapper rules="required">
                      <el-input
                        v-model="form.viDescription"
                        class="el-default-input"
                        type="textarea"
                        :rows="4"
                      >
                      </el-input>
                    </InputWrapper>
                  </div>
                  <!-- Multi-languages inputs -->
                  <!-- Dynamic content tabs -->
                  <el-tabs
                    v-model="activeContentTab"
                    editable
                    @tab-add="handleContentTabAdd"
                    @tab-remove="handleContentTabRemove"
                  >
                    <el-tab-pane
                      v-for="(tab, index) in contentTabs"
                      :key="'service-content-' + index"
                      :name="'service-content-' + index"
                      :label="$t('services.create.content-tab') + (index + 1)"
                      class="p-10 bg-gray-100"
                      style="border-radius: 30px;"
                    >
                      <!-- Tiêu đề tiếng Việt của nội dung lẻ -->
                      <div class="mt-5">
                        <label class="text-theme-1">
                          Tiêu đề tiếng Việt nội dung {{ index + 1 }}
                        </label>
                        <InputWrapper rules="required">
                          <el-input
                            v-model="contentTabs[index].viTitle"
                            class="el-default-input"
                          ></el-input>
                        </InputWrapper>
                      </div>
                      <!-- English title of dynamic content -->
                      <div class="mt-5">
                        <label class="text-theme-1">
                          English title of content {{ index + 1 }}
                        </label>
                        <InputWrapper rules="required">
                          <el-input
                            v-model="contentTabs[index].enTitle"
                            class="el-default-input"
                          ></el-input>
                        </InputWrapper>
                      </div>
                      <!-- Nội dung tiếng Việt lẻ -->
                      <div class="mt-5">
                        <label class="text-theme-1">
                          Nội dung tiếng Việt {{ index + 1 }}
                        </label>
                        <InputWrapper rules="required">
                          <el-input
                            v-model="contentTabs[index].viContent"
                            class="el-default-input"
                            type="textarea"
                            :rows="4"
                          ></el-input>
                        </InputWrapper>
                      </div>
                      <!-- English content of dynamic content -->
                      <div class="mt-5">
                        <label class="text-theme-1">
                          English content {{ index + 1 }}
                        </label>
                        <InputWrapper rules="required">
                          <el-input
                            v-model="contentTabs[index].enContent"
                            class="el-default-input"
                            type="textarea"
                            :rows="4"
                          ></el-input>
                        </InputWrapper>
                      </div>
                    </el-tab-pane>
                  </el-tabs>
                  <!-- Net price -->
                  <div class="mt-5">
                    <label class="text-theme-1">
                      {{ $t('services.create.netPrice') }}
                      <small>{{ form.netPrice | formatNumber }} VNĐ</small>
                    </label>
                    <InputWrapper rules="required|numeric">
                      <el-input
                        v-model="form.netPrice"
                        class="el-default-input"
                        type="number"
                      ></el-input>
                    </InputWrapper>
                  </div>
                  <!-- Price -->
                  <div class="mt-5">
                    <label class="text-theme-1">
                      {{ $t('services.create.price') }}
                      <small>{{ form.price | formatNumber }} VNĐ</small>
                    </label>
                    <InputWrapper rules="required|numeric">
                      <el-input
                        v-model="form.price"
                        class="el-default-input"
                        type="number"
                      ></el-input>
                    </InputWrapper>
                  </div>
                  <!-- currentPrice -->
                  <div class="mt-5">
                    <label class="text-theme-1">
                      {{ $t('services.create.currentPrice') }}
                      <small>{{ form.currentPrice | formatNumber }} VNĐ</small>
                    </label>
                    <InputWrapper rules="numeric">
                      <el-input
                        v-model="form.currentPrice"
                        class="el-default-input"
                        type="number"
                      ></el-input>
                    </InputWrapper>
                  </div>
                  <!-- Service category -->
                  <div class="mt-10">
                    <label class="text-theme-1">
                      {{ $t('services.create.serviceCategory') }}
                    </label>
                    <InputWrapper>
                      <el-select
                        v-model="pickedServiceCategoryId"
                        filterable
                        class="el-default-input"
                      >
                        <el-option
                          v-for="parentServiceCategory in serviceCategories"
                          :key="
                            'parentServiceCategory-' + parentServiceCategory.id
                          "
                          :label="parentServiceCategory[locale + 'Name']"
                          :value="parentServiceCategory.id"
                        >
                        </el-option>
                        <el-option-group
                          v-for="serviceCategory in serviceCategories"
                          :key="'serviceCategory-' + serviceCategory.id"
                          :label="serviceCategory[locale + 'Name']"
                        >
                          <el-option
                            v-for="child in serviceCategory.children"
                            :key="'serviceCategory-' + child.id"
                            :label="child[locale + 'Name']"
                            :value="child.id"
                          >
                          </el-option>
                        </el-option-group>
                      </el-select>
                    </InputWrapper>
                  </div>
                  <!-- Destination -->
                  <div class="mt-10">
                    <label class="text-theme-1">
                      {{ $t('services.create.destinations') }}
                    </label>
                    <InputWrapper>
                      <el-select
                        v-model="form.destinationIds"
                        multiple
                        filterable
                        class="el-default-input"
                      >
                        <el-option-group
                          v-for="destination in destinations"
                          :key="'destination-' + destination.id"
                          :label="destination[locale + 'Name']"
                        >
                          <!-- Continents -->
                          <el-option
                            v-for="childDestination in destination.children"
                            :key="'destination-' + childDestination.id"
                            :label="childDestination[locale + 'Name']"
                            :value="childDestination.id"
                          />
                        </el-option-group>
                        <!-- Vietnam with the regions -->
                        <el-option-group
                          v-for="region in (destinations[3] ? destinations[3].children : [])"
                          :key="'region-' + region.id"
                          :label="region[locale + 'Name']"
                        >
                          <el-option-group
                            v-for="city in region.children"
                            :key="'city-' + city.id"
                            :label="city[locale + 'Name']"
                            :value="city.id"
                          >
                            <el-option
                              v-for="cityChild in city.children"
                              :key="'city-' + cityChild.id"
                              :label="cityChild[locale + 'Name']"
                              :value="cityChild.id"
                            />
                          </el-option-group>
                        </el-option-group>
                      </el-select>
                    </InputWrapper>
                  </div>
                  <!-- Note -->
                  <div class="mt-10">
                    <label class="text-theme-1">
                      {{ $t('services.create.note') }}
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
                  <!-- Status -->
                  <div class="mt-10">
                    <label class="text-theme-1">
                      {{ $t('services.create.status') }}
                    </label>
                    <el-switch
                      v-model="form.status"
                      active-color="#13ce66"
                      active-value="ACTIVE"
                      inactive-value="DRAFT"
                    >
                    </el-switch>
                  </div>
                </el-col>
                <!-- Right side -->
                <el-col :span="10">
                  <!-- English title -->
                  <div class="mt-5">
                    <label class="text-theme-1">
                      English title
                    </label>
                    <InputWrapper rules="required">
                      <el-input
                        v-model="form.enTitle"
                        class="el-default-input"
                      ></el-input>
                    </InputWrapper>
                  </div>
                  <!-- English description -->
                  <div class="mt-10">
                    <label class="text-theme-1">
                      English description
                    </label>
                    <InputWrapper rules="required">
                      <el-input
                        v-model="form.enDescription"
                        class="el-default-input"
                        type="textarea"
                        :rows="4"
                      >
                      </el-input>
                    </InputWrapper>
                  </div>
                  <!-- Thumbnail -->
                  <div class="mt-5">
                    <label class="text-theme-1">
                      {{ $t('services.create.thumbnail') }}
                    </label>
                    <InputWrapper rules="required">
                      <FileUploader
                        v-model="imageList"
                        :limit="1"
                        @my-file-uploader-change="handleFileUploadChange"
                      />
                    </InputWrapper>
                  </div>
                  <!-- Submit -->
                  <div
                    class="text-center absolute"
                    style="bottom: 0; right: 0;"
                  >
                    <el-button
                      round
                      :loading="isLoading"
                      type="primary"
                      class="bg-gray-200 text-theme-1 hover:bg-gray-300 shadow border-none"
                      @click="$router.push('/internal/services')"
                    >
                      {{ $t('services.create.go-back') }}
                    </el-button>
                    <el-button
                      round
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
