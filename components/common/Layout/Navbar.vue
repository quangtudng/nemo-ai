<template>
  <el-header class="p-0 bg-none relative default-navbar">
    <!--  -->
    <el-button
      circle
      class="block absolute border-none shadow default-sidebar-toggle"
      @click="TOGGLE_SIDEBAR_COLLAPSE()"
    >
      <fa :icon="['fas', 'bars']" />
    </el-button>
    <div class="float-right flex flex-row" style="height: 60px;">
      <el-dropdown @command="changeLanguage">
        <span class="text-light mr-5 text-xl" style="line-height: 60px;">
          <fa :icon="['fas', 'language']" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="vi">
            Tiếng Việt
          </el-dropdown-item>
          <el-dropdown-item command="en">
            English
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown @command="handleAvatarCommand">
        <el-avatar
          class="block"
          style="margin: 10px;"
          :src="avatar"
        ></el-avatar>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="me">
            {{ $t('navbar.profile') }}
          </el-dropdown-item>
          <el-dropdown-item command="logout">
            {{ $t('navbar.logout') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  name: 'Navbar',
  props: {
    backgroundColor: {
      type: String,
      default: 'var(--color-navbar-background)',
    },
    textColor: {
      type: String,
      default: 'var(--color-navbar-text)',
    },
    activeTextColor: {
      type: String,
      default: 'var(--color-navbar-text-active)',
    },
  },
  data() {
    return {
      activeIndex: '1',
    }
  },
  computed: {
    ...mapState({
      locale: (state) => state.locale,
      options: (state) => state.options,
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
  methods: {
    ...mapMutations({
      SET_LANG: 'SET_LANG',
      TOGGLE_SIDEBAR_COLLAPSE: 'TOGGLE_SIDEBAR_COLLAPSE',
    }),
    changeLanguage(locale) {
      this.$changeLocale(locale)
    },
    handleAvatarCommand(command) {
      this[command]()
    },
    logout() {
      this.$router.push('/login')
      this.$store.dispatch('auth/logout')
    },
    me() {
      this.$router.push('/me')
    },
  },
}
</script>
<style lang="scss" scoped>
.default-sidebar-toggle {
  top: 50%;
  left: 0;
  transform: translate(-50%, -50%);
}
</style>
<style lang="scss">
.default-navbar {
  .el-badge__content.is-fixed.is-dot {
    border: none;
    top: 3px;
    right: 6px;
  }
}
</style>
