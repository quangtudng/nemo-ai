<template>
  <el-container class="pl-3 pr-3 pt-0">
    <el-row class="w-full">
      <h1 class="text-3xl font-bold text-light inline-block mr-3">
        {{ title }}
      </h1>
      <div class="inline-block text-light select-none">
        <nuxt-link to="/internal">
          <fa :icon="['fas', 'home']" />
        </nuxt-link>
      </div>
    </el-row>
  </el-container>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
}
</script>
