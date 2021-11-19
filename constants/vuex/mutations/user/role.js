// For commit mutations in the same module
// Use { root: true } as the third argument
export default {
  SET: {
    DATA: 'user/role/SET_DATA',
    TOTAL: 'user/role/SET_TOTAL',
    PERMISSIONS: 'user/role/SET_PERMISSIONS',
  },
  CLEAR: {
    QUERY: 'user/role/CLEAR_QUERY',
  },
  TOGGLE: {},
  ADD: {},
  REMOVE: {},
  INC: {
    QUERY_PAGE: 'user/role/INC_QUERY_PAGE',
  },
  SUB: {
    QUERY_PAGE: 'user/role/SUB_QUERY_PAGE',
  },
}
