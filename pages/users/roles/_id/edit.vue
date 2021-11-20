<template>
  <el-main>
    <Breadcrumb :title="$t('roles.create.title')" />
    <el-container class="p-3 mb-10">
      <el-row class="w-full">
        <el-col :span="24" class="mx-auto float-none">
          <el-card shadow="always" class="w-full p-5">
            <FormWrapper
              v-loading="isLoading"
              class="block"
              @my-form-submit="submitRole"
            >
              <el-row :gutter="20" class="relative m-0">
                <el-col :span="14">
                  <div class="mt-5">
                    <label class="text-theme-1">
                      {{ $t('roles.create.name') }}
                    </label>
                    <InputWrapper rules="required">
                      <el-input
                        v-model="form.name"
                        class="el-default-input"
                      ></el-input>
                    </InputWrapper>
                  </div>
                  <div class="mt-10">
                    <label class="text-theme-1">
                      {{ $t('roles.create.description') }}
                    </label>
                    <InputWrapper rules="required">
                      <el-input
                        v-model="form.description"
                        class="el-default-input"
                        type="textarea"
                        :rows="4"
                      >
                      </el-input>
                    </InputWrapper>
                  </div>
                  <div class="mt-10">
                    <label class="text-theme-1">
                      {{ $t('roles.create.permissions') }}
                    </label>
                    <InputWrapper rules="required">
                      <el-checkbox-group v-model="checkedPermissions">
                        <el-checkbox
                          v-for="permission in permissions"
                          :key="'permission-' + permission.id"
                          :label="permission.name"
                          class="block"
                        >
                          {{ permission.name }}
                        </el-checkbox>
                      </el-checkbox-group>
                    </InputWrapper>
                  </div>
                  <div>
                    <el-button
                      round
                      :loading="isLoading"
                      type="primary"
                      class="bg-gray-200 text-theme-1 hover:bg-gray-300 shadow border-none"
                      @click="$router.push('/users/roles')"
                    >
                      {{ $t('roles.create.go-back') }}
                    </el-button>
                    <el-button
                      round
                      :loading="isLoading"
                      native-type="submit"
                      type="primary"
                      class="bg-theme-1 text-light hover:bg-theme-1-600 shadow border-none"
                    >
                      {{ $t('roles.create.submit') }}
                    </el-button>
                  </div>
                </el-col>
              </el-row>
            </FormWrapper>
          </el-card>
        </el-col>
      </el-row>
    </el-container>
  </el-main>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import { Message } from 'element-ui'
import { FormWrapper, InputWrapper, Breadcrumb } from '~/components/common'
import { roleActions } from '~/constants/vuex'
const permission = 'SUPERADMIN'
export default {
  components: { FormWrapper, InputWrapper, Breadcrumb },
  middleware({ store, query, redirect }) {
    if (!permission.includes(store.state.auth.data.role)) {
      Message.error('Permission denied')
      return redirect('/')
    }
  },
  async fetch() {
    try {
      this.isLoading = true
      await this.fetchPermissions()
      const { data } = await this.$store.dispatch(
        roleActions.FETCH.SINGLE,
        this.$route.params.id
      )
      this.form.name = data.data.name
      this.form.description = data.data.description
      this.checkedPermissions = data.data.permissions.map(
        (permission) => permission.name
      )
      await this.fetchRoles()
      this.isLoading = false
    } catch (error) {
      this.isLoading = false
    }
  },
  data() {
    return {
      form: {
        name: null,
        description: null,
        permissionIds: [], // cannot be null, will cause cannot read property length of null on v-for render
      },
      isLoading: false,
      checkedPermissions: [],
    }
  },
  computed: {
    ...mapState({
      permissions: (state) => state.user.role.permissions,
    }),
  },
  methods: {
    ...mapActions({
      fetchPermissions: roleActions.FETCH.PERMISSONS,
      reFetchRoles: roleActions.FETCH.DATA,
      updateSingleRole: roleActions.UPDATE.SINGLE,
    }),
    async submitRole() {
      this.isLoading = true
      try {
        await this.permissions.forEach((permission) => {
          if (this.checkedPermissions.includes(permission.name)) {
            this.form.permissionIds.push(permission.id)
          }
        })
        await this.updateSingleRole({
          id: this.$route.params.id,
          form: this.form,
        })
        this.reFetchRoles()
        this.isLoading = false
        this.$router.push('/users/roles')
      } catch (error) {
        this.isLoading = false
      }
    },
  },
}
</script>
