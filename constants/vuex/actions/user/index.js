// For commit mutations in the same module
// Use { root: true } as the third argument
export default {
  FETCH: {
    DATA: 'user/fetchData',
    MORE: 'user/fetchMoreData',
    SINGLE: 'user/fetchSingle',
  },
  SUBMIT: {
    MULTIPLE: 'user/submitMultiple',
    SINGLE: 'user/submitSingle',
  },
  UPDATE: {
    MULTIPLE: 'user/updateMultiple',
    SINGLE: 'user/updateSingle',
  },
  DELETE: {
    MULTIPLE: 'user/deleteMultiple',
    SINGLE: 'user/deleteSingle',
  },
}
