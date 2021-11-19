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
      <!-- <el-badge :is-dot="true" class="mt-5 mr-3">
        <fa
          class="text-light text-xl block"
          :icon="['fas', 'bell']"
          style="line-height: 60px;"
        />
      </el-badge> -->
      <el-dropdown @command="handleAvatarCommand">
        <el-avatar
          class="block"
          style="margin: 10px;"
          :src="auth.avatar"
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
import { authActions, rootMutations } from '~/constants/vuex'
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
      if (this.auth) {
        return this.auth.currentUser.avatar
      } else {
        return require('~/assets/img/default-man.png')
      }
    },
    username() {
      if (this.auth) {
        return this.auth.currentUser.name
      } else {
        return 'Super admin'
      }
    },
  },
  methods: {
    ...mapMutations({
      SET_LANG: rootMutations.SET.LANG,
      TOGGLE_SIDEBAR_COLLAPSE: rootMutations.TOGGLE.SIDEBAR_COLLAPSE,
    }),
    changeLanguage(locale) {
      this.$changeLocale(locale)
    },
    handleAvatarCommand(command) {
      this[command]()
    },
    logout() {
      this.$router.push('/login')
      this.$store.dispatch(authActions.LOGOUT)
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
