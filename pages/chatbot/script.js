export default {
  name: 'Chatbot',
  layout: 'client',
  data() {
    return {
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
      replyText: '',
    }
  },
  methods: {
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
