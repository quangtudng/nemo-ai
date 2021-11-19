// For commit mutations in the same module
// Use { root: true } as the third argument
export default {
  FETCH: {
    DATA: 'user/role/fetchData',
    MORE: 'user/role/fetchMoreData',
    SINGLE: 'user/role/fetchSingle',
    PERMISSONS: 'user/role/fetchPermissions',
  },
  SUBMIT: {
    MULTIPLE: 'user/role/submitMultiple',
    SINGLE: 'user/role/submitSingle',
  },
  UPDATE: {
    MULTIPLE: 'user/role/updateMultiple',
    SINGLE: 'user/role/updateSingle',
  },
  DELETE: {
    MULTIPLE: 'user/role/deleteMultiple',
    SINGLE: 'user/role/deleteSingle',
  },
}
