<template>
  <el-submenu :index="count">
    <template slot="title">
      <i :class="item.icon" :style="{ color: item['icon-color'] }"></i>
      <span>{{ $t(item.title) }}</span>
    </template>
    <component
      :is="child.children.length > 0 ? SubMenu : Item"
      v-for="(child, index) in item.children"
      :key="child.title"
      :item="child"
      :count="count + '-' + (index + 1)"
    ></component>
  </el-submenu>
</template>
<script>
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
    SubMenu() {
      return () => import('./SubMenu.vue')
    },
    Item() {
      return () => import('./Item.vue')
    },
  },
}
</script>
