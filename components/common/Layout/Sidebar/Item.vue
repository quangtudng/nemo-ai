<template>
  <el-menu-item
    v-if="isAllowed"
    :index="count"
    :class="{
      'default-sidebar-item': !$store.state.options.sidebarCollapsed,
      'default-sidebar-item-collapsed': $store.state.options.sidebarCollapsed,
    }"
    @click="$router.push(item.to)"
  >
    <em
      :class="{
        [item.icon]: $store.state.options.sidebarCollapsed,
      }"
      :style="{ color: item['icon-color'] }"
    ></em>
    <span>{{ $t(item.title) }}</span>
  </el-menu-item>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      },
    },
    count: {
      type: String,
      default: '1',
    },
  },
  computed: {
    ...mapState({
      auth: (state) => state.auth.data,
    }),
    isAllowed() {
      const role = this.auth?.role
      if (!role) return false
      return this.item.role.includes(role)
    },
  },
}
</script>
<style lang="scss">
.default-sidebar-item {
  font-family: Google Sans;
  font-size: 14px;
  font-weight: bold;
  color: var(--color-theme-1);
}
.default-sidebar-item.is-active {
  border-right: 10px solid var(--color-theme-1);
  background-color: #ccd2e0 !important;
}
.default-sidebar-item-collapsed.is-active {
  border-left: 3px solid var(--color-theme-1);
  background-color: #ccd2e0 !important;
}
</style>
