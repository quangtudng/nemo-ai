<template>
  <el-main>
    <el-container class="pl-3 pr-3 pt-0">
      <el-row class="w-full">
        <!-- Title -->
        <h1 class="text-3xl font-bold text-light inline-block mr-3">
          {{ $t('locations.title') }}
        </h1>
        <div class="inline-block text-light select-none">
          <nuxt-link to="/">
            <fa :icon="['fas', 'home']" />
          </nuxt-link>
        </div>
      </el-row>
    </el-container>
    <el-container class="p-3">
      <el-card
        shadow="always"
        class="border-0 rounded-lg w-full h-full"
        :body-style="{ padding: '0px' }"
      >
        <!-- Start tree table -->
        <el-row class="flex flex-row">
          <el-col :span="7" style="border-right: 1px solid #ededed;">
            <div
              class="text-theme-1 p-1"
              style="border-bottom: 1px solid #ededed;"
            >
              <el-input
                id="default-input-search"
                v-model="searchQuery"
                class="el-default-input el-override-input"
                prefix-icon="el-icon-search"
                :placeholder="$t('locations.search')"
              />
            </div>
            <div style="overflow: auto; height: 1310px;" class="p-1">
              <el-tree
                ref="tree"
                :data="locationTableData"
                :props="defaultProps"
                default-expand-all
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                @node-click="handleNodeClick"
              >
                <div
                  slot-scope="{ node, data }"
                  class="flex justify-between flex-1 mb-1"
                >
                  <div>
                    <em
                      v-if="data.type === 'country' || data.type === 'province'"
                      class="el-icon-s-cooperation text-brown"
                    ></em>
                    <em
                      v-if="data.type === 'city'"
                      class="el-icon-location text-danger"
                    ></em>
                    <span
                      :class="
                        selectedLocationId === data.id
                          ? 'text-theme-1'
                          : 'text-gray-600'
                      "
                    >
                      {{ node.label }}
                    </span>
                  </div>
                  <p class="hidden xl:block text-xs">
                    {{ data.serviceCount }}
                  </p>
                </div>
              </el-tree>
            </div>
          </el-col>
          <el-col :span="17">
            <div
              v-if="selectedLocationId"
              v-loading="isLoading"
              class="h-full w-full px-10 py-3"
            >
              <el-row>
                <FormWrapper class="block" @my-form-submit="onSubmitUpdate">
                  <el-col :span="24">
                    <div class="mt-10">
                      <label class="text-theme-1">
                        {{ $t('locations.label') }}
                      </label>
                      <InputWrapper>
                        <el-input
                          v-model="form.name"
                          :disabled="true"
                          class="el-default-input"
                        ></el-input>
                      </InputWrapper>
                    </div>
                    <div class="mt-10">
                      <label class="text-theme-1">
                        {{ $t('locations.type') }}
                      </label>
                      <InputWrapper>
                        <el-input
                          v-model="form.type"
                          :disabled="true"
                          class="el-default-input"
                        ></el-input>
                      </InputWrapper>
                    </div>
                    <div class="mt-10">
                      <label class="text-theme-1">
                        {{ $t('locations.description') }}
                      </label>
                      <InputWrapper rules="min:5|max:1000">
                        <el-input
                          v-model="form.description"
                          class="el-default-input"
                          type="textarea"
                          :rows="4"
                        >
                        </el-input>
                      </InputWrapper>
                    </div>
                    <div class="mt-10">
                      <img
                        src="~/assets/img/internal/map-thumbnail.png"
                        alt="Map thumbnail"
                        height="500"
                        width="500"
                        class="cursor-pointer"
                        @click="locationDialogVisible = true"
                      />
                      <el-dialog
                        v-if="locationDialogVisible"
                        :visible.sync="locationDialogVisible"
                        width="70%"
                        center
                        custom-class="location-dialog"
                      >
                        <span slot="title" class="dialog-footer">
                          <fa :icon="['fas', 'map-marker-alt']" />
                          <span class="ml-1">{{ selectedLocationName }}</span>
                        </span>
                        <GoogleMap
                          :location="selectedLocationName"
                          :zoom="selectedLocationId === 1 ? 5 : 10"
                        />
                      </el-dialog>
                    </div>
                    <div class="mt-10">
                      <el-table
                        class="datatable"
                        :data="categoryTableData"
                        border
                        style="width: 100%;"
                      >
                        <el-table-column
                          prop="category_id"
                          label="ID"
                          width="180"
                        >
                        </el-table-column>
                        <el-table-column
                          prop="category_title"
                          :label="$t('locations.category')"
                          width="180"
                        >
                        </el-table-column>
                        <el-table-column
                          prop="count"
                          :label="$t('locations.service_count')"
                        >
                        </el-table-column>
                      </el-table>
                    </div>
                    <div class="mt-5 text-right">
                      <el-button
                        :loading="isLoading"
                        :disabled="isLoading"
                        native-type="submit"
                        type="primary"
                        class="login-input-submit bg-theme-1 hover:bg-theme-1-700"
                      >
                        {{ $t('common.edit') }}
                      </el-button>
                    </div>
                  </el-col>
                </FormWrapper>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </el-container>
  </el-main>
</template>
<script src="./script.js"></script>
<style lang="scss">
.el-override-input {
  .el-input__inner {
    border-radius: 0px !important;
    background: #fff;
  }
}
.is-current {
  background: #fff !important;
}
.location-dialog {
  .el-dialog__header {
    text-align: left;
  }
  .el-dialog__body {
    padding: 0;
  }
}
</style>
