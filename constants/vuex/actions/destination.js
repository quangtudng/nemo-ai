// For commit mutations in the same module
// Use { root: true } as the third argument
export default {
  FETCH: {
    DATA: 'destination/fetchData',
    MORE: 'destination/fetchMoreData',
    SINGLE: 'destination/fetchSingle',
    CHILDREN: 'destination/fetchChildren',
  },
  SUBMIT: {
    MULTIPLE: 'destination/submitMultiple',
    SINGLE: 'destination/submitSingle',
  },
  UPDATE: {
    MULTIPLE: 'destination/updateMultiple',
    SINGLE: 'destination/updateSingle',
  },
  DELETE: {
    MULTIPLE: 'destination/deleteMultiple',
    SINGLE: 'destination/deleteSingle',
  },
}
