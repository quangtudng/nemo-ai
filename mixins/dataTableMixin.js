import qs from 'qs'
import { debounce } from 'lodash'
/// ////////////////////////////////////////////////////
// This mixins require these in the index page using it:
/// ////////////////////////////////////////////////////
// computed: {
//     ...mapState({
//       // this.moduleName cause error
//       // "this" is undefined in VueX mapping process
//       tableData: (state) => state[moduleName].data,
//       tableDataQuery: (state) => state[moduleName].query,
//       tableDataTotal: (state) => state[moduleName].total,
//     }),
//   },
//   methods: {
//     ...mapActions({
//       fetchData: moduleActions.FETCH.DATA,
//       deleteSingle: moduleActions.DELETE.SINGLE,
//     }),
//     ...mapMutations({
//       setDataQuery: moduleMutations.SET.QUERY,
//       clearDataQuery: moduleMutations.CLEAR.QUERY,
//       incDataQueryPage: moduleMutations.INC.QUERY_PAGE,
//       subDataQueryPage: moduleMutations.SUB.QUERY_PAGE,
//     }),
// },
/// ////////////////////////////////////////////////////
/// ////////////////////////////////////////////////////
export default {
  async fetch() {
    await this.pushRouterQuery()
    this.fetchData()
  },
  data() {
    return {
      selectedItems: null,
      tableDataState: [],
      query: {
        page: 1,
        limit: 10,
      },
    }
  },
  methods: {
    onSizeChange(total) {
      console.log('pagination changed to ' + total)
    },
    async onPageChange(currentPage) {
      await this.setDataQuery({
        page: currentPage,
      })
      this.$fetch()
    },
    async onPagePrev() {
      await this.subDataQueryPage()
      this.$fetch()
    },
    async onPageNext() {
      await this.incDataQueryPage()
      this.$fetch()
    },
    onSelectionChange(selected) {
      this.selectedItems = selected
    },
    async onSortChange(payload) {
      await this.setDataQuery({
        sort: `${payload.prop},${
          payload.order === 'ascending' ? 'ASC' : 'DESC'
        }`,
      })
      this.$fetch()
    },
    async onLimitChange(limit) {
      await this.setDataQuery({
        page: 1,
        limit,
      })
      this.$fetch()
    },
    onRefresh: debounce(async function () {
      await this.clearDataQuery()
      this.$fetch()
    }, 300),
    pushRouterQuery() {
      // this.$router.push does change the $route.query,
      // but doesn't change the browser url from the 2nd time above (cache or something, i dunno)
      history.pushState(
        {},
        '',
        this.$route.path +
          '?' +
          qs.stringify(this.tableDataQuery, { arrayFormat: 'repeat' })
      )
    },
  },
}
