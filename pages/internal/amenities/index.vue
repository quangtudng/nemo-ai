<template>
  <el-main>
    <el-container class="pl-3 pr-3 pt-0">
      <el-row class="w-full">
        <!-- Title -->
        <h1 class="text-3xl font-bold text-light inline-block mr-3">
          {{ $t('amenities.title') }}
        </h1>
        <div class="inline-block text-light select-none">
          <nuxt-link to="/internal">
            <fa :icon="['fas', 'home']" />
          </nuxt-link>
        </div>
      </el-row>
    </el-container>
    <el-container class="p-3">
      <el-card shadow="always" class="border-0 rounded-lg w-full p-5">
        <el-row class="flex flex-row mb-10">
          <div class="text-theme-1 mr-5">
            <label for="default-input-search">
              {{ $t('amenities.search') }}
            </label>
            <el-input
              id="default-input-search"
              v-model="searchQuery"
              class="el-default-input"
              prefix-icon="el-icon-search"
              :placeholder="$t('amenities.search')"
              @keyup="onFilter"
            >
            </el-input>
          </div>
          <div style="padding-top: 24px;" class="mr-5">
            <el-button
              size="large"
              class="bg-theme-1 text-light hover:bg-theme-1-600 shadow border-none"
              :loading="$fetchState.pending"
              @click="onFilter"
            >
              {{ $t('common.filter') }}
            </el-button>
            <el-button
              size="large"
              class="bg-gray-200 text-theme-1 hover:bg-gray-300 shadow border-none"
              :loading="$fetchState.pending"
              @click="onClearFilter"
            >
              {{ $t('common.delete-filter') }}
            </el-button>
          </div>
        </el-row>
        <!-- Start data table -->
        <DataTable
          v-loading="$fetchState.pending"
          :data="tableData"
          :total="tableDataTotal"
          :limit="query.limit"
          :current-page="query.page"
          :multiple-choice="false"
          @my-table-edit="onEdit"
          @my-table-delete="onDelete"
          @my-table-add-new="onCreate"
          @my-table-size-change="onSizeChange"
          @my-table-page-change="onPageChange"
          @my-table-page-prev="onPagePrev"
          @my-table-page-next="onPageNext"
          @my-table-selection-change="onSelectionChange"
          @my-table-sort-change="onSortChange"
          @my-table-limit-change="onLimitChange"
          @my-table-refresh="onRefresh"
        >
          <el-table-column type="index" width="50" />
          <el-table-column :label="$t('amenities.name')">
            <template slot-scope="scope">
              <span>
                {{ scope.row.title }}
              </span>
              <fa :icon="['fas', scope.row.icon]" class="ml-1" />
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('amenities.description')"
            prop="description"
          />
        </DataTable>
        <!-- Create dialog -->
        <FormWrapper
          v-loading="isLoading"
          class="block"
          @my-form-submit="submitAmenity"
        >
          <el-dialog
            :title="$t('amenities.create-new')"
            :visible.sync="createDialogVisible"
            width="60%"
          >
            <el-row :gutter="20" class="relative m-0">
              <el-col :span="24">
                <!-- Title -->
                <div>
                  <label class="text-theme-1">
                    {{ $t('amenities.name') }}
                  </label>
                  <InputWrapper rules="required|min:5|max:100">
                    <el-input
                      v-model="createForm.title"
                      class="el-default-input"
                    ></el-input>
                  </InputWrapper>
                </div>
                <!-- Description -->
                <div class="mt-5">
                  <label class="text-theme-1">
                    {{ $t('amenities.description') }}
                  </label>
                  <InputWrapper rules="min:5|max:1000">
                    <el-input
                      v-model="createForm.description"
                      class="el-default-input"
                      type="textarea"
                      :rows="4"
                    >
                    </el-input>
                  </InputWrapper>
                </div>
                <!-- Icon holder -->
                <div class="mt-5">
                  <label class="text-theme-1">
                    {{ $t('amenities.icon') }}
                  </label>
                  <InputWrapper>
                    <el-select
                      v-model="createForm.icon"
                      filterable
                      class="el-default-input"
                      :placeholder="$t('common.select')"
                    >
                      <el-option
                        v-for="icon in icons"
                        :key="'role-' + icon"
                        :value="icon"
                      >
                        <fa :icon="['fas', icon]" />
                        <span class="ml-1">{{ icon }}</span>
                      </el-option>
                    </el-select>
                  </InputWrapper>
                </div>
              </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
              <el-button
                type="primary"
                class="bg-gray-200 text-theme-1 hover:bg-gray-300 shadow border-none"
                @click="createDialogVisible = false"
              >
                {{ $t('common.go-back') }}
              </el-button>
              <el-button
                :loading="isLoading"
                native-type="submit"
                type="primary"
                class="bg-theme-1 text-light hover:bg-theme-1-600 shadow border-none"
              >
                {{ $t('common.add-new') }}
              </el-button>
            </span>
          </el-dialog>
        </FormWrapper>
        <!-- Update dialog -->
        <FormWrapper
          v-loading="isLoading"
          class="block"
          @my-form-submit="updateAmenity"
        >
          <el-dialog
            title="Edit amenity"
            :visible.sync="editDialogVisible"
            width="60%"
          >
            <el-row :gutter="20" class="relative m-0">
              <el-col :span="24">
                <!-- Title -->
                <div>
                  <label class="text-theme-1">
                    {{ $t('amenities.name') }}
                  </label>
                  <InputWrapper rules="required|min:5|max:100">
                    <el-input
                      v-model="updateForm.title"
                      class="el-default-input"
                    ></el-input>
                  </InputWrapper>
                </div>
                <!-- Description -->
                <div class="mt-5">
                  <label class="text-theme-1">
                    {{ $t('amenities.description') }}
                  </label>
                  <InputWrapper rules="min:5|max:1000">
                    <el-input
                      v-model="updateForm.description"
                      class="el-default-input"
                      type="textarea"
                      :rows="4"
                    >
                    </el-input>
                  </InputWrapper>
                </div>
                <!-- Icon holder -->
                <div class="mt-5">
                  <label class="text-theme-1">
                    {{ $t('amenities.icon') }}
                  </label>
                  <InputWrapper>
                    <el-select
                      v-model="updateForm.icon"
                      filterable
                      class="el-default-input"
                      :placeholder="$t('common.select')"
                    >
                      <el-option
                        v-for="icon in icons"
                        :key="'role-' + icon"
                        :value="icon"
                      >
                        <fa :icon="['fas', icon]" />
                        <span class="ml-1">{{ icon }}</span>
                      </el-option>
                    </el-select>
                  </InputWrapper>
                </div>
              </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
              <el-button
                type="primary"
                class="bg-gray-200 text-theme-1 hover:bg-gray-300 shadow border-none"
                @click="editDialogVisible = false"
              >
                {{ $t('common.go-back') }}
              </el-button>
              <el-button
                :loading="isLoading"
                native-type="submit"
                type="primary"
                class="bg-theme-1 text-light hover:bg-theme-1-600 shadow border-none"
              >
                {{ $t('common.edit') }}
              </el-button>
            </span>
          </el-dialog>
        </FormWrapper>
      </el-card>
    </el-container>
  </el-main>
</template>
<script src="./script.js"></script>
