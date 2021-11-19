<template>
  <el-main>
    <el-container class="pl-3 pr-3 pt-0">
      <el-row class="w-full">
        <!-- Title -->
        <h1 class="text-3xl font-bold text-light inline-block mr-3">
          {{ $t('roles.title') }}
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
        <DataTable
          v-loading="$fetchState.pending"
          :data="tableData"
          :total="tableDataTotal"
          :limit="tableDataQuery.limit"
          :current-page="tableDataQuery.page"
          :multiple-choice="false"
          @my-table-edit="onEdit"
          @my-table-delete="onDelete"
          @my-table-add-new="$router.push('/users/roles/create')"
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
            :label="$t('roles.index.name')"
            prop="name"
            sortable
          />
          <el-table-column
            :label="$t('roles.index.description')"
            prop="description"
            sortable
          />
        </DataTable>
      </el-card>
    </el-container>
  </el-main>
</template>
<script src="./script.js"></script>
