<template>
  <el-container class="default-layout-container h-full-vh">
    <div class="default-sidebar-wrapper" @mouseenter="handlerHoverSidebar" />
    <Sidebar :header-height="220">
      <template v-slot:header>
        <div class="default-header-avatar-inner">
          <el-avatar class="mx-auto block" :size="90" :src="avatar"></el-avatar>
          <h2 class="default-header-avatar-name">
            {{ fullname }}
          </h2>
          <p class="default-header-avatar-status">
            <fa class="text-success" :icon="['fas', 'dot-circle']" />
            <span>{{ $t('sidebar.online') }}</span>
          </p>
        </div>
      </template>
    </Sidebar>
    <el-container class="flex-col default-page-background">
      <!-- el-header -->
      <Navbar />
      <!-- el-main -->
      <div class="default-page-container h-full">
        <nuxt class="relative" />
      </div>
    </el-container>
  </el-container>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { Navbar, Sidebar } from '~/components/common'
export default {
  name: 'Internal',
  middleware: ['internalAuthRequired', 'internalRedirect'],
  components: {
    Navbar,
    Sidebar,
  },
  computed: {
    ...mapState({
      auth: (state) => state.auth.data,
    }),
    avatar() {
      if (this.auth?.avatar) {
        return this.auth.avatar
      } else {
        return require('~/assets/img/default-man.png')
      }
    },
    fullname() {
      if (this.auth?.fullname) {
        return this.auth.fullname
      } else {
        return 'Unknown User'
      }
    },
  },
  created() {
    // We store this configuration in localStorage because it lasts forever
    this.$i18n.locale = localStorage.getItem('locale')
    this.SET_LANG(localStorage.getItem('locale')) // store in state and localStorage
  },
  mounted() {
    window.onbeforeunload = function (e) {
      e = e || window.event
      // For IE and Firefox prior to version 4
      if (e) {
        e.returnValue = 'Sure?'
      }
      // For Safari
      return 'Sure?'
    }
  },
  methods: {
    ...mapMutations({
      SET_LANG: 'SET_LANG',
      OPEN_SIDEBAR: 'OPEN_SIDEBAR',
    }),
    handlerHoverSidebar() {
      this.OPEN_SIDEBAR()
    },
  },
}
</script>
<style lang="scss" scoped>
.default-page-background {
  background-image: url(~assets/img/header-bg.svg);
  background-position: top;
  background-repeat: no-repeat;
  background-size: 100%;
  background-attachment: local;
}
.default-header-avatar-inner {
  margin-top: 30px;
  white-space: normal;
  .default-header-avatar-name {
    margin-top: 10px;
    font-weight: bold;
    font-size: 24px;
    line-height: 30px;
    color: #012066;
    text-align: center;
    padding: 1rem;
    word-wrap: break-word;
  }
  .default-header-avatar-status {
    line-height: 18px;
    margin-top: 10px;
    text-align: center;
  }
}
.default-sidebar-wrapper {
  width: 20px;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 9999;
}
</style>
