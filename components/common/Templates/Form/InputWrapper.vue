<template>
  <ValidationProvider v-slot="{ errors }" :rules="rules" class="relative">
    <el-form-item :label="label" :for="labelFor" class="mb-0">
      <slot></slot>
    </el-form-item>
    <div class="text-danger mb-3">
      <small>
        {{ $t(errors[0]) }}
      </small>
    </div>
  </ValidationProvider>
</template>
<script>
import { ValidationProvider } from 'vee-validate'
export default {
  name: 'InputWrapper',
  components: {
    ValidationProvider,
  },
  props: {
    rules: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    labelFor: {
      type: String,
      default: '',
    },
  },
}
</script>
