<template>
  <el-drawer
    :visible="!isCollapsed"
    :with-header="false"
    direction="ltr"
    size="370"
    :before-close="handleClose"
  >
    <el-menu
      class="sidebar-menu border-none"
      :default-active="activeIndex"
      :background-color="backgroundColor"
      :text-color="textColor"
      :active-text-color="activeTextColor"
    >
      <el-menu-item
        class="header p-0"
        :style="{ height: headerHeight + 'px' }"
        @click="$router.push('/internal')"
      >
        <slot name="header">
          Hello
        </slot>
      </el-menu-item>
      <div class="sy-2"></div>
      <component
        :is="child.children.length > 0 ? SubMenu : Item"
        v-for="(child, index) in sidebar"
        :key="child.title"
        :item="child"
        :count="index + 1 + ''"
      ></component>
    </el-menu>
  </el-drawer>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
const sidebarTree = require('~/constants/config/sidebar.json')
export default {
  name: 'Sidebar',
  props: {
    backgroundColor: {
      type: String,
      default: 'var(--color-sidebar-background)',
    },
    textColor: {
      type: String,
      default: 'var(--color-sidebar-text)',
    },
    activeTextColor: {
      type: String,
      default: 'var(--color-sidebar-text-active)',
    },
    headerHeight: {
      type: Number,
      default: 200,
    },
  },
  data() {
    return {
      sidebar: sidebarTree.data,
    }
  },
  computed: {
    ...mapState({
      isCollapsed: (state) => state.options.sidebarCollapsed,
    }),
    SubMenu() {
      return () => import('./SubMenu.vue')
    },
    Item() {
      return () => import('./Item.vue')
    },
    activeIndex() {
      return (
        sidebarTree.data.findIndex((item) => {
          return item.to === this.$route.path
        }) +
        1 +
        ''
      )
    },
  },
  methods: {
    ...mapMutations({
      COLLAPSE_SIDEBAR: 'COLLAPSE_SIDEBAR',
      OPEN_SIDEBAR: 'OPEN_SIDEBAR',
    }),
    handleClose() {
      this.COLLAPSE_SIDEBAR()
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~assets/scss/base/layout/grid';
</style>
