// For commit mutations in the same module
// Use { root: true } as the third argument
export default {
  FETCH: {
    DATA: 'service/category/fetchData',
    MORE: 'service/category/fetchMoreData',
    SINGLE: 'service/category/fetchSingle',
    CHILDREN: 'service/category/fetchChildren',
  },
  SUBMIT: {
    MULTIPLE: 'service/category/submitMultiple',
    SINGLE: 'service/category/submitSingle',
  },
  UPDATE: {
    MULTIPLE: 'service/category/updateMultiple',
    SINGLE: 'service/category/updateSingle',
  },
  DELETE: {
    MULTIPLE: 'service/category/deleteMultiple',
    SINGLE: 'service/category/deleteSingle',
  },
}
