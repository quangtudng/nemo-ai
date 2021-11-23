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
            >
            </el-input>
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
                v-for="parentServiceCategory in serviceCategories"
                :key="'parentServiceCategory-' + parentServiceCategory.id"
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
          </div>
          <div class="text-theme-1 mr-5">
            <label for="default-input-author" class="block">
              {{ $t('services.author.title') }}
            </label>
            <el-select
              v-model="authorFilter"
              class="el-default-input"
              :placeholder="$t('services.author.title')"
              filterable
              style="width: 180px;"
            >
              <el-option
                v-for="author in users"
                :key="'author-' + author.id"
                :label="author.fullName"
                :value="author.id"
              >
              </el-option>
            </el-select>
          </div>
          <div style="padding-top: 24px;" class="mr-5">
            <el-button
              size="large"
              class="bg-theme-1 text-light hover:bg-theme-1-600 shadow border-none"
              :loading="$fetchState.pending"
              round
              @click="onFilter"
            >
              {{ $t('services.filter') }}
            </el-button>
            <el-button
              size="large"
              class="bg-gray-200 text-theme-1 hover:bg-gray-300 shadow border-none"
              :loading="$fetchState.pending"
              round
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
          :limit="tableDataQuery.limit"
          :current-page="tableDataQuery.page"
          :multiple-choice="false"
          @my-table-edit="onEdit"
          @my-table-delete="onDelete"
          @my-table-add-new="$router.push('/services/create')"
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
          <el-table-column
            :label="$t('services.index.title')"
            :prop="locale + 'Title'"
            width="320"
            sortable
          >
            <template slot-scope="scope">
              <p class="m-0 text-gray-500">
                {{ scope.row.user.fullName }}
              </p>
              <p class="m-0 text-gray-400">
                {{ $t('services.index.created-at') }}
                {{ scope.row.createdAt | formatDateTime }}
              </p>
              <p class="m-0 text-gray-400">
                {{ $t('services.index.last-updated') }}
                {{ scope.row.updatedAt | formatDateTime }}
              </p>
              <p>
                {{ scope.row[locale + 'Title'] }}
              </p>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('services.index.netPrice')"
            prop="netPrice"
            sortable
          >
            <template slot-scope="scope">
              <p>
                {{ scope.row.netPrice | formatNumber }}
              </p>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('services.index.price')"
            prop="price"
            sortable
          >
            <template slot-scope="scope">
              <p>
                {{ scope.row.price | formatNumber }}
              </p>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('services.index.currentPrice')"
            prop="currentPrice"
            sortable
          >
            <template slot-scope="scope">
              <p>
                {{ scope.row.currentPrice | formatNumber }}
              </p>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('services.index.serviceCategories')"
            prop="serviceCategories"
            sortable
            width="190"
          >
            <template slot-scope="scope">
              <p
                v-for="serviceCategory in scope.row.serviceCategories"
                :key="serviceCategory.enSlug + scope.$index"
                style="color: var(--color-theme-1);"
              >
                {{ serviceCategory[locale + 'Name'] }}
              </p>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('services.index.destinations')"
            prop="destinations"
            sortable
          >
            <template slot-scope="scope">
              <p
                v-for="destination in scope.row.destinations"
                :key="destination.enSlug + scope.$index"
                style="color: var(--color-theme-1);"
              >
                {{ destination[locale + 'Name'] }}
              </p>
            </template>
          </el-table-column>
        </DataTable>
      </el-card>
    </el-container>
  </el-main>
</template>
<script src="./script.js"></script>
<style lang="scss" scoped src="./style-scoped.scss"></style>
<style lang="scss" src="./style.scss"></style>
