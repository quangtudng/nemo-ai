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
    const result = await this.fetchTableData(this.query)
    this.tableData = result.data.data
    this.tableDataTotal = result.data.total
  },
  data() {
    return {
      selectedItems: null,
      tableData: [],
      tableDataTotal: 0,
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
    setDataQuery(query) {
      this.query = { ...this.query, ...query }
    },
    async onPageChange(currentPage) {
      this.setDataQuery({
        page: currentPage,
      })
      await this.$fetch()
    },
    async onPagePrev() {
      this.query.page--
      await this.$fetch()
    },
    async onPageNext() {
      this.query.page++
      await this.$fetch()
    },
    onSelectionChange(selected) {
      this.selectedItems = selected
    },
    async onSortChange(payload) {
      this.setDataQuery({
        sort: `${payload.prop},${
          payload.order === 'ascending' ? 'ASC' : 'DESC'
        }`,
      })
      await this.$fetch()
    },
    async onLimitChange(limit) {
      this.setDataQuery({
        page: 1,
        limit,
      })
      await this.$fetch()
    },
    onRefresh: debounce(async function () {
      this.query = {
        page: 1,
        limit: 10,
      }
      await this.$fetch()
    }, 300),
  },
}
