<template>
  <el-main>
    <el-container class="pl-3 pr-3 pt-0">
      <el-row class="w-full">
        <!-- Title -->
        <h1 class="text-3xl font-bold text-light inline-block mr-3">
          {{ $t('services.title') }}
        </h1>
        <div class="inline-block text-light select-none">
          <nuxt-link to="/">
            <fa :icon="['fas', 'home']" />
          </nuxt-link>
        </div>
        <el-button
          size="large"
          class="bg-gray-200 text-theme-1 hover:bg-gray-300 shadow border-none float-right mt-3"
          :loading="$fetchState.pending"
          @click="$router.push('/internal/amenities')"
        >
          {{ $t('services.amenities') }}
        </el-button>
      </el-row>
    </el-container>
    <el-container class="p-3">
      <el-card shadow="always" class="border-0 rounded-lg w-full p-5">
        <el-row class="flex flex-row mb-10">
          <div class="text-theme-1 mr-5">
            <label for="default-input-search" class="block">
              {{ $t('services.search') }}
            </label>
            <el-input
              id="default-input-search"
              v-model="searchQuery"
              class="el-default-input"
              prefix-icon="el-icon-search"
              :placeholder="$t('services.search')"
              style="width: 180px;"
            />
          </div>
          <div class="text-theme-1 mr-5">
            <label for="default-input-service-categories" class="block">
              {{ $t('services.service-categories.title') }}
            </label>
            <el-select
              v-model="serviceCategoryFilter"
              filterable
              class="el-default-input"
              style="width: 180px;"
            >
              <el-option
                v-for="category in serviceCategories"
                :key="'category-' + category.id"
                :label="category.title"
                :value="category.id"
              />
            </el-select>
          </div>
          <div class="mr-5">
            <label for="default-input-author" class="text-theme-1 block">
              {{ $t('services.author.title') }}
            </label>
            <treeselect
              v-model="locationFilter"
              :options="locations"
              :normalizer="normalizer"
              no-children-text="Empty"
              :default-expand-level="1"
              :match-keys="['name']"
            />
          </div>
          <div style="padding-top: 24px;" class="mr-5">
            <el-button
              size="large"
              class="bg-theme-1 text-light hover:bg-theme-1-600 shadow border-none"
              :loading="$fetchState.pending"
              @click="onFilter"
            >
              {{ $t('services.filter') }}
            </el-button>
            <el-button
              size="large"
              class="bg-gray-200 text-theme-1 hover:bg-gray-300 shadow border-none"
              :loading="$fetchState.pending"
              @click="onClearFilter"
            >
              {{ $t('services.delete-filter') }}
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
          @my-table-add-new="$router.push('/internal/services/create')"
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
          <el-table-column :label="$t('services.index.title')" width="320">
            <template slot-scope="scope">
              <p
                class="m-0 text-gray-500 cursor-pointer hover:text-theme-1"
                @click="onDetailView(scope.row)"
              >
                {{ scope.row.title }}
              </p>
              <p class="m-0 text-gray-400">
                {{ $t('services.index.created-at') }}
                {{ scope.row.createdAt | formatDateTime }}
              </p>
              <p class="m-0 text-gray-400">
                {{ $t('services.index.last-updated') }}
                {{ scope.row.updatedAt | formatDateTime }}
              </p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('services.index.price')">
            <template slot-scope="scope">
              <p>
                {{ scope.row.price | formatNumber }}
              </p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('services.index.serviceCategories')">
            <template slot-scope="scope">
              <p style="color: var(--color-theme-1);">
                {{ scope.row.category ? scope.row.category.title : '' }}
              </p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('services.index.destinations')">
            <template slot-scope="scope">
              <p style="color: var(--color-theme-1);">
                {{ scope.row.location ? scope.row.location.name : '' }}
              </p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('services.index.createdAt')">
            <template slot-scope="scope">
              <p style="color: var(--color-theme-1);">
                {{ scope.row.createdAt | formatDateTime }}
              </p>
            </template>
          </el-table-column>
        </DataTable>
        <el-dialog
          destroy-on-close
          title="Thông tin chi tiết"
          :visible.sync="detailPageVisible"
          width="60%"
        >
          <div>
            <div>
              <label class="text-theme-1">
                Tiêu đề
              </label>
              <el-input
                v-model="form.title"
                disabled
                class="el-default-input"
              ></el-input>
            </div>
            <div class="mt-5">
              <label class="text-theme-1">
                Mô tả
              </label>
              <el-input
                v-model="form.description"
                class="el-default-input"
                type="textarea"
                disabled
                :rows="4"
              >
              </el-input>
            </div>
            <div class="mt-5">
              <label class="text-theme-1">
                Trang chủ dịch vụ
              </label>
              <el-input
                v-model="form.originUrl"
                disabled
                class="el-default-input"
              ></el-input>
            </div>
            <div class="mt-5">
              <label class="text-theme-1">
                Địa chỉ dịch vụ
              </label>
              <el-input
                v-model="form.fullAddress"
                disabled
                class="el-default-input"
              ></el-input>
            </div>
            <div class="mt-5">
              <label class="text-theme-1">
                Số điện thoại
              </label>
              <el-input
                v-model="form.phoneNumber"
                disabled
                class="el-default-input"
              ></el-input>
            </div>
            <div class="mt-5">
              <label class="text-theme-1">
                Loại hình dịch vụ
              </label>
              <el-input
                v-model="form.categoryName"
                disabled
                class="el-default-input"
              ></el-input>
            </div>
            <div class="mt-5">
              <label class="text-theme-1">
                Địa điểm dịch vụ
              </label>
              <el-input
                v-model="form.locationName"
                disabled
                class="el-default-input"
              ></el-input>
            </div>
          </div>
          <div v-if="form.serviceAmenities.length > 0" class="mt-5">
            <label class="text-theme-1">
              Tiện ích dịch vụ
            </label>
            <el-table
              :data="form.serviceAmenities"
              max-height="250"
              border
              style="width: 100%;"
            >
              <el-table-column prop="id" label="ID" width="100" />
              <el-table-column prop="title" label="Title" />
              <el-table-column prop="description" label="Description" />
            </el-table>
          </div>
          <div class="mt-5">
            <GoogleMap
              v-if="detailPageVisible"
              :location="`${form.title} ${form.locationName}`"
              :zoom="10"
            />
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="detailPageVisible = false">Close</el-button>
          </span>
        </el-dialog>
      </el-card>
    </el-container>
  </el-main>
</template>
<script src="./script.js"></script>
<style lang="scss" scoped src="./style-scoped.scss"></style>
<style lang="scss" src="./style.scss"></style>
