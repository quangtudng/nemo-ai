<template>
  <div class="datatable">
    <div class="mb-5">
      <el-select
        :value="limit"
        size="mini"
        class="select-none datatable-limit-select"
        style="width: 80px;"
        @input="handleLimitChange"
      >
        <el-option
          v-for="paginateLimit in [10, 25, 50]"
          :key="'paginate-limit-' + paginateLimit"
          :label="paginateLimit"
          :value="paginateLimit"
          class="select-none"
        >
        </el-option>
      </el-select>
      <el-button
        circle
        size="mini"
        icon="el-icon-refresh"
        class="ml-1 select-none border-none duration-150 focus:bg-theme-1 focus:text-light shadow hover:bg-theme-1 hover:text-light"
        @click="$emit('my-table-refresh')"
      >
      </el-button>
      <el-button
        v-if="addNewButton"
        class="float-right border-0 bg-theme-1 hover:bg-theme-1-600 text-light select-none"
        size="large"
        @click="$emit('my-table-add-new')"
      >
        {{ $t('components.table.data.add-new') }}
      </el-button>
    </div>
    <hr />
    <el-table
      class="w-full"
      :height="height"
      :data="data"
      @selection-change="
        (selected) => {
          $emit('my-table-selection-change', selected)
        }
      "
      @sort-change="
        (payload) => {
          $emit('my-table-sort-change', payload)
        }
      "
    >
      <el-table-column
        v-if="multipleChoice"
        type="selection"
        width="55"
        class="select-none"
      />
      <slot></slot>
      <el-table-column width="40" align="right">
        <template slot-scope="scope">
          <el-dropdown trigger="click" @command="handleActionCommand">
            <span class="el-dropdown-link text-xl text-theme-1">
              <fa :icon="['fas', 'cog']" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="action in actions"
                :key="`${action.name}:${scope.$index}`"
                :command="`${action.name}:${scope.$index}`"
              >
                {{ $t(action.label) }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      class="my-5 text-center select-none"
      :total="total"
      :current-page="currentPage"
      :page-size="limit"
      @size-change="
        (total) => {
          $emit('my-table-size-change', total)
        }
      "
      @current-change="
        (currentPage) => {
          $emit('my-table-page-change', currentPage)
        }
      "
      @prev-click="
        (currentPage) => {
          $emit('my-table-page-prev', currentPage)
        }
      "
      @next-click="
        (currentPage) => {
          $emit('my-table-page-next', currentPage)
        }
      "
    />
    <div></div>
  </div>
</template>
<script>
export default {
  props: {
    height: {
      type: Number,
      default: 400,
    },
    multipleChoice: {
      type: Boolean,
      default: true,
    },
    actions: {
      type: Array,
      default() {
        return [
          {
            name: 'edit',
            label: 'components.table.data.edit',
          },
          {
            name: 'delete',
            label: 'components.table.data.delete',
          },
        ]
      },
    },
    limit: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
    currentPage: {
      type: Number,
      required: true,
    },
    addNewButton: {
      type: Boolean,
      default: true,
      required: false,
    },
  },
  methods: {
    handleLimitChange(e) {
      this.$emit('my-table-limit-change', e)
    },
    handleActionCommand(command) {
      const actionHandler = command.split(':')
      this.$emit('my-table-' + actionHandler[0], {
        rowID: actionHandler[1],
        rowData: this.data[actionHandler[1]],
      })
    },
  },
}
</script>
<style lang="scss">
.datatable {
  .el-table__header-wrapper {
    th {
      background-color: #e9ecf4;
      font-weight: bolder;
      font-size: 14px;
      line-height: 19px;
      color: var(--color-theme-1);
    }
  }
  .el-table__body-wrapper {
    td {
      color: var(--color-theme-1);
      font-size: 14px;
      line-height: 17px;
    }
  }
  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: var(--color-theme-1);
  }
  .datatable-limit-select {
    // width: 200px;
    height: 28px;
    background: #eff0f3;
    border-radius: 22.5px;
    input {
      height: 28px;
      background: none;
      border-radius: 22.5px;
      color: var(--color-theme-1);
      font-weight: bold;
      border: none;
    }
  }
}
</style>
