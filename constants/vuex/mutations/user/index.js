// For commit mutations in the same module
// Use { root: true } as the third argument
export default {
  SET: {
    DATA: 'user/SET_DATA',
    TOTAL: 'user/SET_TOTAL',
    //
    QUERY: 'user/SET_QUERY',
  },
  CLEAR: {
    QUERY: 'user/CLEAR_QUERY',
  },
  TOGGLE: {},
  ADD: {},
  REMOVE: {},
  INC: {
    QUERY_PAGE: 'user/INC_QUERY_PAGE',
  },
  SUB: {
    QUERY_PAGE: 'user/SUB_QUERY_PAGE',
  },
}
