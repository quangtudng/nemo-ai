// For commit mutations in the same module
// Use { root: true } as the third argument
export default {
  LOGIN: 'auth/login',
  LOGOUT: 'auth/logout',
  FETCH: {
    ME: 'auth/fetchMe',
  },
  UPDATE: {
    ME: 'auth/updateMe',
  },
}
