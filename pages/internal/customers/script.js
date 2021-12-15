// Modify this DataTable component to suit your api
import { mapState } from 'vuex'
import { debounce } from 'lodash'
import { Breadcrumb } from '~/components/common'

export default {
  layout: 'internal',
  components: {
    Breadcrumb,
  },
  data() {
    return {
      customers: [
        {
          id: 1,
          name: 'Khách hàng',
          email: 'quangtupct@gmail.com',
          location: 'Việt Nam',
          viewed: 0,
          last_message: {
            id: 1,
            owner: 'nemo',
            message: 'Bạn có muốn biết thêm về Nemo ?',
            created_at: '2021-12-12 21:24:51.652911',
          },
        },
        {
          id: 2,
          name: 'Khách hàng',
          email: null,
          location: 'Việt Nam',
          viewed: 1,
          last_message: {
            id: 2,
            owner: 'nemo',
            message: 'Cảm ơn bạn. Tên bạn là gì ?',
            created_at: '2021-12-12 21:24:51.652911',
          },
        },
        {
          id: 3,
          name: 'Khách hàng',
          email: 'quangtuan@gmail.com',
          location: 'Việt Nam',
          viewed: 0,
          last_message: {
            id: 3,
            owner: 'customer',
            message: 'Tôi muốn biết về khu vực Đà Nẵng',
            created_at: '2021-12-12 21:24:51.652911',
          },
        },
        {
          id: 4,
          name: 'Khách hàng',
          email: null,
          location: 'Việt Nam',
          viewed: 1,
          last_message: {
            id: 4,
            owner: 'customer',
            message: 'Xin chào, bạn là ai ?',
            created_at: '2021-12-12 21:24:51.652911',
          },
        },
        {
          id: 5,
          name: 'Khách hàng',
          email: null,
          location: 'Việt Nam',
          viewed: 0,
          last_message: {
            id: 5,
            owner: 'customer',
            message: 'Tôi muốn tìm nhà hàng ở Hồ Chí Minh',
            created_at: '2021-12-12 21:24:51.652911',
          },
        },
        {
          id: 6,
          name: 'Khách hàng',
          email: null,
          location: 'Việt Nam',
          viewed: 1,
          last_message: {
            id: 6,
            owner: 'nemo',
            message: 'Tôi muốn biết tình hình Covid ở Đà Nẵng',
            created_at: '2021-12-12 21:24:51.652911',
          },
        },
        {
          id: 7,
          name: 'Khách hàng',
          email: null,
          location: 'Việt Nam',
          viewed: 1,
          last_message: {
            id: 7,
            owner: 'customer',
            message: 'Có bao nhiêu nhà hàng ở Đà Nẵng',
            created_at: '2021-12-12 21:24:51.652911',
          },
        },
        {
          id: 8,
          name: 'Khách hàng',
          email: null,
          location: 'Việt Nam',
          viewed: 1,
          last_message: {
            id: 8,
            owner: 'nemo',
            message:
              'Xin lỗi, tôi không hiểu câu hỏi trên của bạn, vui lòng nhập lại',
            created_at: '2021-12-12 21:24:51.652911',
          },
        },
        {
          id: 9,
          name: 'Khách hàng',
          email: null,
          location: 'Việt Nam',
          viewed: 1,
          last_message: {
            id: 9,
            owner: 'customer',
            message: 'Xin chào Nemo, tôi tên là Nguyễn Văn Tú',
            created_at: '2021-12-12 21:24:51.652911',
          },
        },
        {
          id: 10,
          name: 'Khách hàng',
          email: null,
          location: 'Việt Nam',
          viewed: 1,
          last_message: {
            id: 10,
            owner: 'nemo',
            message:
              'Xin chào, tôi là Nemo, trợ lý ảo của NemoAI. Tôi có thể giúp gì cho bạn ?',
            created_at: '2021-12-12 21:24:51.652911',
          },
        },
      ],
      messages: [
        {
          id: 1,
          owner: 'nemo',
          action: null,
          message:
            'Xin chào, tôi là Nemo, trợ lý ảo của NemoAI. Tôi có thể giúp gì cho bạn ?',
          created_at: '2021-12-12 18:24:51.652911',
        },
        {
          id: 2,
          owner: 'customer',
          action: null,
          message:
            'Xin chào Nemo, tôi tên là Thanh. Tôi muốn tìm địa điểm du lịch tại Đà Nẵng',
          created_at: '2021-12-12 18:24:51.652911',
        },
        {
          id: 3,
          owner: 'nemo',
          action: null,
          message:
            'Vâng, tất nhiên là tôi có thể giúp bạn rồi, bạn muốn tìm kiếm dịch vụ gì ?',
          created_at: '2021-12-12 18:24:51.652911',
        },
        {
          id: 4,
          owner: 'customers',
          action: null,
          message: 'Tôi muốn tìm kiếm nhà hàng ở Đà Nẵng',
          created_at: '2021-12-12 22:24:51.652911',
        },
        {
          id: 5,
          owner: 'nemo',
          action: null,
          message:
            'Đây là tất cả các nhà hàng mà tôi có thể tìm thấy ở khu vực Đà Nẵng',
          created_at: '2021-12-12 22:24:55.652911',
        },
      ],
      selectedCustomer: 1,
      isLoadingCustomer: false,
      isLoading: false,
      searchQuery: '',
      replyText: '',
      activeHoverItem: 0,
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
  methods: {
    handleCustomerScroll(el) {
      if (
        el.srcElement.offsetHeight + el.srcElement.scrollTop >=
        el.srcElement.scrollHeight - 10
      ) {
        this.fetchMoreCustomer()
      }
    },
    fetchMoreCustomer: debounce(function () {
      this.isLoadingCustomer = true
      console.log('fetch moreeee')
      setTimeout(() => {
        this.isLoadingCustomer = false
      }, 1000)
    }, 1000),
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
