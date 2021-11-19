// For commit mutations in the same module
// Use { root: true } as the third argument
export default {
  FETCH: {
    DATA: 'service/fetchData',
    MORE: 'service/fetchMoreData',
    SINGLE: 'service/fetchSingle',
  },
  SUBMIT: {
    MULTIPLE: 'service/submitMultiple',
    SINGLE: 'service/submitSingle',
  },
  UPDATE: {
    MULTIPLE: 'service/updateMultiple',
    SINGLE: 'service/updateSingle',
  },
  DELETE: {
    MULTIPLE: 'service/deleteMultiple',
    SINGLE: 'service/deleteSingle',
  },
}
