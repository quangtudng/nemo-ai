<template>
  <el-card shadow="always" class="border-0 rounded-lg">
    <div slot="header" class="clearfix">
      <span class="font-bold">{{ title }}</span>
    </div>
    <el-table :data="data" style="width: 100%;">
      <el-table-column
        v-for="col in headers"
        :key="col.key"
        :prop="col.key"
        :label="col.label"
        :width="col.width"
      ></el-table-column>
    </el-table>
  </el-card>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Table title',
    },
    headers: {
      type: Array,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
  },
}
</script>
