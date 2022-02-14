<template>
  <el-main>
    <el-container class="pl-3 pr-3 pt-0">
      <el-row class="w-full">
        <!-- Title -->
        <h1 class="text-3xl font-bold text-light inline-block mr-3">
          {{ $t('services.title') }}
        </h1>
        <div class="inline-block text-light select-none">
          <nuxt-link to="/internal">
            <fa :icon="['fas', 'home']" />
          </nuxt-link>
        </div>
        <div class="inline float-right">
          <excel-uploader @my-file-uploader-change="handleExcelUpload" />
        </div>
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
              {{ $t('services.category') }}
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
              {{ $t('services.location') }}
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
          <el-table-column :label="$t('services.name')" width="320">
            <template slot-scope="scope">
              <p
                class="m-0 text-gray-500 cursor-pointer hover:text-theme-1"
                @click="onDetailView(scope.row)"
              >
                {{ scope.row.title }}
              </p>
              <p class="m-0 text-gray-400">
                {{ $t('common.created_at') }}
                {{ scope.row.createdAt | formatDateTime }}
              </p>
              <p class="m-0 text-gray-400">
                {{ $t('common.last_updated') }}
                {{ scope.row.updatedAt | formatDateTime }}
              </p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('services.price')">
            <template slot-scope="scope">
              <p>
                {{ scope.row.price | formatNumber }}
              </p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('services.category')">
            <template slot-scope="scope">
              <el-button
                size="mini"
                class="text-light shadow border-none"
                :type="fetchCategoryButtonStyle(scope.row.price)"
              >
                {{ scope.row.category ? scope.row.category.title : '' }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column :label="$t('services.location')">
            <template slot-scope="scope">
              <p style="color: green;">
                {{ scope.row.location ? scope.row.location.name : '' }}
              </p>
            </template>
          </el-table-column>
        </DataTable>
        <el-dialog
          destroy-on-close
          :visible.sync="detailPageVisible"
          width="60%"
        >
          <div>
            <div>
              <label class="text-theme-1">
                {{ $t('services.name') }}
              </label>
              <el-input
                v-model="form.title"
                disabled
                class="el-default-input"
              ></el-input>
            </div>
            <div class="mt-5">
              <label class="text-theme-1">
                {{ $t('services.description') }}
              </label>
              <el-input
                v-model="form.description"
                class="el-default-input"
                type="textarea"
                disabled
                autosize
              >
              </el-input>
            </div>
            <div class="mt-5">
              <label class="text-theme-1">
                {{ $t('services.origin') }}
              </label>
              <el-input
                v-model="form.originUrl"
                disabled
                class="el-default-input"
              ></el-input>
            </div>
            <div class="mt-5">
              <label class="text-theme-1">
                {{ $t('services.address') }}
              </label>
              <el-input
                v-model="form.fullAddress"
                disabled
                class="el-default-input"
              ></el-input>
            </div>
            <div class="mt-5">
              <label class="text-theme-1">
                {{ $t('services.phone') }}
              </label>
              <el-input
                v-model="form.phoneNumber"
                disabled
                class="el-default-input"
              ></el-input>
            </div>
            <div class="mt-5">
              <label class="text-theme-1">
                {{ $t('services.category') }}
              </label>
              <el-input
                v-model="form.categoryName"
                disabled
                class="el-default-input"
              ></el-input>
            </div>
            <div class="mt-5">
              <label class="text-theme-1">
                {{ $t('services.location') }}
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
              {{ $t('services.amenities') }}
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
            <el-button @click="detailPageVisible = false">
              {{ $t('common.cancel') }}
            </el-button>
          </span>
        </el-dialog>
      </el-card>
    </el-container>
  </el-main>
</template>
<script src="./script.js"></script>
<style lang="scss">
.vue-treeselect__control {
  width: 200px;
  height: 40px;
  background: #e6e9f0;
}

.vue-treeselect__single-value {
  color: var(--color-theme-1);
}
</style>
