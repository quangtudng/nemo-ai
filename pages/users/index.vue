<template>
  <el-main>
    <el-container class="pl-3 pr-3 pt-0">
      <el-row class="w-full">
        <!-- Title -->
        <h1 class="text-3xl font-bold text-light inline-block mr-3">
          {{ $t('users.title') }}
        </h1>
        <div class="inline-block text-light select-none">
          <nuxt-link to="/">
            <fa :icon="['fas', 'home']" />
          </nuxt-link>
        </div>
        <el-button
          size="large"
          class="bg-gray-200 text-theme-1 hover:bg-gray-300 shadow border-none float-right mt-3"
          round
          :loading="$fetchState.pending"
          @click="$router.push('/roles')"
        >
          {{ $t('users.roles') }}
        </el-button>
      </el-row>
    </el-container>
    <el-container class="p-3">
      <el-card shadow="always" class="border-0 rounded-lg w-full p-5">
        <el-row class="flex flex-row mb-10">
          <div class="text-theme-1 mr-5">
            <label for="default-input-search">
              {{ $t('users.search') }}
            </label>
            <el-input
              id="default-input-search"
              v-model="searchString"
              class="el-default-input"
              prefix-icon="el-icon-search"
              :placeholder="$t('users.search')"
            >
            </el-input>
          </div>
          <div class="text-theme-1 mr-5">
            <label for="default-input-role" class="block">
              {{ $t('users.role.title') }}
            </label>
            <el-select
              v-model="roleFilter"
              class="el-default-input"
              :placeholder="$t('users.role.title')"
            >
              <el-option
                v-for="role in roles"
                :key="'role-' + role.id"
                :label="$t('users.role.' + role.label)"
                :value="role.id"
              >
              </el-option>
            </el-select>
          </div>
          <div style="padding-top: 24px;" class="mr-5">
            <el-button
              size="large"
              class="bg-theme-1 text-light hover:bg-theme-1-600 shadow border-none"
              round
              :loading="$fetchState.pending"
              @click="onFilter"
            >
              {{ $t('users.filter') }}
            </el-button>
            <el-button
              size="large"
              class="bg-gray-200 text-theme-1 hover:bg-gray-300 shadow border-none"
              round
              :loading="$fetchState.pending"
              @click="onClearFilter"
            >
              {{ $t('users.delete-filter') }}
            </el-button>
          </div>
        </el-row>
        <!-- Start data table -->
        <DataTable
          v-loading="$fetchState.pending"
          :data="tableDataState"
          :total="tableDataTotal"
          :limit="tableDataQuery.limit"
          :current-page="tableDataQuery.page"
          :multiple-choice="false"
          @my-table-edit="onEdit"
          @my-table-delete="onDelete"
          @my-table-add-new="$router.push('/users/create')"
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
            :label="$t('users.index.fullname')"
            prop="fullname"
            sortable
          />
          <el-table-column
            :label="$t('users.index.phonenumber')"
            prop="phoneNumber"
            sortable
          />
          <el-table-column
            :label="$t('users.index.email')"
            prop="email"
            sortable
          >
            <template slot-scope="scope">
              <p style="color: green;">
                {{ scope.row.email }}
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
