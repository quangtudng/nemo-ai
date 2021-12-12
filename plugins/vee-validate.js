/* eslint-disable camelcase */
import { extend } from 'vee-validate'
import PhoneNumber from 'awesome-phonenumber'
import {
  email,
  required,
  numeric,
  min,
  max,
  min_value,
  max_value,
} from 'vee-validate/dist/rules'

// Override the default message.
// In i18n format
// Actual messages are inside locale files
extend('email', {
  ...email,
  message: 'validation.email',
})

extend('required', {
  ...required,
  message: 'validation.required',
})

extend('numeric', {
  ...numeric,
  message: 'validation.numeric',
})

extend('min', {
  ...min,
  message: 'validation.value_too_short',
})
extend('max', {
  ...max,
  message: 'validation.value_too_long',
})

extend('min_value', {
  ...min_value,
  message: 'validation.value_too_small',
})
extend('max_value', {
  ...max_value,
  message: 'validation.value_too_large',
})

extend('phone', {
  message: 'validation.invalid_phone_number',
  validate(value) {
    return new Promise((resolve) => {
      const phone = new PhoneNumber(value, 'VN')
      resolve({ valid: phone.isValid() })
    })
  },
})
