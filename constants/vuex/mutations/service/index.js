// For commit mutations in the same module
// Use { root: true } as the third argument
export default {
  SET: {
    DATA: 'service/SET_DATA',
    TOTAL: 'service/SET_TOTAL',
    //
    QUERY: 'service/SET_QUERY',
  },
  CLEAR: {
    QUERY: 'service/CLEAR_QUERY',
  },
  TOGGLE: {},
  ADD: {},
  REMOVE: {},
  INC: {
    QUERY_PAGE: 'service/INC_QUERY_PAGE',
  },
  SUB: {
    QUERY_PAGE: 'service/SUB_QUERY_PAGE',
  },
}
