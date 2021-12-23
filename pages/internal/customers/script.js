// Modify this DataTable component to suit your api
import { mapState, mapActions } from 'vuex'
import { debounce } from 'lodash'
import { Breadcrumb } from '~/components/common'

export default {
  layout: 'internal',
  components: {
    Breadcrumb,
  },
  data() {
    return {
      customers: [],
      messages: [
        {
          id: 1,
          owner: 'nemo',
          action: null,
          body:
            'Xin chào, tôi là Nemo, trợ lý ảo của NemoAI. Tôi có thể giúp gì cho bạn ?',
          created_at: '2021-12-12 18:24:51.652911',
        },
        {
          id: 2,
          owner: 'customer',
          action: null,
          body:
            'Xin chào Nemo, tôi tên là Thanh. Tôi muốn tìm địa điểm du lịch tại Đà Nẵng',
          created_at: '2021-12-12 18:24:51.652911',
        },
        {
          id: 3,
          owner: 'nemo',
          action: null,
          body:
            'Vâng, tất nhiên là tôi có thể giúp bạn rồi, bạn muốn tìm kiếm dịch vụ gì ?',
          created_at: '2021-12-12 18:24:51.652911',
        },
        {
          id: 4,
          owner: 'customers',
          action: null,
          body: 'Tôi muốn tìm kiếm nhà hàng ở Đà Nẵng',
          created_at: '2021-12-12 22:24:51.652911',
        },
        {
          id: 5,
          owner: 'nemo',
          action: null,
          body:
            'Đây là tất cả các nhà hàng mà tôi có thể tìm thấy ở khu vực Đà Nẵng',
          created_at: '2021-12-12 22:24:55.652911',
        },
      ],
      selectedCustomer: null,
      isLoadingCustomer: false,
      isLoading: false,
      searchQuery: '',
      replyText: '',
      activeHoverItem: 0,
      showCustomerDetail: false,
      // XHR parameter
      customerXHR: null,
      messageXHR: null,
    }
  },
  computed: {
    ...mapState({
      auth: (state) => state.auth.data,
    }),
  },
  watch: {
    searchQuery(val) {
      this.$refs.tree.filter(val)
    },
  },
  created() {
    console.log('Start all XHRs')
    this.startCustomerXhr()
    this.startMessageXhr()
  },
  destroyed() {
    console.log('Stop all XHRs')
    clearInterval(this.customerXHR)
    clearInterval(this.messageXHR)
  },
  methods: {
    ...mapActions({
      fetchCustomers: 'customer/fetchData',
    }),
    handleCustomerScroll(el) {
      if (
        el.srcElement.offsetHeight + el.srcElement.scrollTop >=
        el.srcElement.scrollHeight - 10
      ) {
        this.fetchMoreCustomer()
      }
    },
    async startCustomerXhr() {
      await this.syncNewCustomers()
      this.customerXHR = setInterval(
        async function () {
          console.log('Fetching new customers...')
          await this.syncNewCustomers()
        }.bind(this),
        5000
      )
    },
    startMessageXhr() {
      this.messageXHR = setInterval(function () {
        console.log('Fetching new messages...')
      }, 5000)
    },
    fetchMoreCustomer: debounce(function () {
      this.isLoadingCustomer = true
      console.log('fetch moreeee')
      setTimeout(() => {
        this.isLoadingCustomer = false
      }, 1000)
    }, 1000),
    async syncNewCustomers() {
      const response = await this.fetchCustomers()
      const customers = response?.data?.data
      if (customers) {
        console.log(customers)
        this.customers = customers
      }
      // If there is no selected customer, then automatically assign it to the first customer in the list
      if (this.customers.length > 0 && !this.selectedCustomer) {
        this.selectedCustomer = this.customers[0].id
      }
    },
    shouldShowTimeStamp(messages, index) {
      try {
        if (index === 0) {
          return true
        } else {
          const TWO_HOUR = 60 * 60 * 2000
          const currentTimestamp = Date.parse(messages[index].created_at)
          const lastTimeStamp = Date.parse(messages[index - 1].created_at)
          return currentTimestamp - lastTimeStamp > TWO_HOUR
        }
      } catch (e) {
        console.log(e)
        return false
      }
    },
  },
}
