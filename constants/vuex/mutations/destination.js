// For commit mutations in the same module
// Use { root: true } as the third argument
export default {
  SET: {
    DATA: 'destination/SET_DATA',
    TOTAL: 'destination/SET_TOTAL',
    //
    QUERY: 'destination/SET_QUERY',
  },
  CLEAR: {
    QUERY: 'destination/CLEAR_QUERY',
  },
  TOGGLE: {},
  ADD: {
    REGION: 'destination/ADD_REGION',
  },
  REMOVE: {},
  INC: {
    QUERY_PAGE: 'destination/INC_QUERY_PAGE',
  },
  SUB: {
    QUERY_PAGE: 'destination/SUB_QUERY_PAGE',
  },
}
