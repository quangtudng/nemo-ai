import { mapActions } from 'vuex'
export default {
  name: 'Chatbot',
  layout: 'client',
  components: {
    GoogleMap: () => import('~/components/common/Templates/Map/GMap.vue'),
  },
  async fetch() {
    try {
      const customerId = this.$route?.query?.c
      // Attempt to get the customer info and messages
      if (customerId) {
        const res = await this.getCustomerMessage(customerId)
        const existMessages = res.data?.data
        if (existMessages && existMessages?.length > 0) {
          this.customerId = customerId
          this.handleNewMessages(existMessages)
        }
      }
      // Remove from parameter if no existing customer is found
      if (!this.customerId) {
        history.pushState({}, null, this.$route.path)
      }
    } catch (e) {
      history.pushState({}, null, this.$route.path)
      console.log(e)
    }
  },
  data() {
    return {
      messages: [],
      replyText: '',
      customerId: null,
      isSending: false,
      selectedService: null,
      serviceDialog: false,
      allServices: [],
      locationDialogVisible: false,
    }
  },
  methods: {
    ...mapActions({
      webhook: 'message/webhook',
      getCustomerMessage: 'message/public_xhr',
      customerServices: 'message/customer_services',
    }),
    shouldShowTimeStamp(index) {
      /**
       *  Timestamp divider will be shown if the two messages are between 2 hours
       */
      try {
        if (index === 0) {
          return true
        } else {
          const FIFTEEN_MINUTES = 15 * 60 * 1000
          const currentTimestamp = Date.parse(this.messages[index].created_at)
          const lastTimeStamp = Date.parse(this.messages[index - 1].created_at)
          return currentTimestamp - lastTimeStamp > FIFTEEN_MINUTES
        }
      } catch (e) {
        console.log(e)
        return false
      }
    },
    newLine() {
      this.replyText = `${this.replyText}\n`
    },
    async startNewConversation() {
      const response = await this.sendNewMessage('new')
      const newMessages = response.data?.messages
      const newCustomer = response.data?.customer
      if (newMessages && newCustomer) {
        this.handleNewMessages(newMessages, true)
        // Change parameter to customer long id
        this.customerId = newCustomer.longId
        history.pushState(
          {},
          null,
          this.$route.path + '?c=' + encodeURIComponent(newCustomer.longId)
        )
      }
    },
    async submitReply() {
      const body = this.replyText?.trim()
      try {
        if (body) {
          this.isSending = true
          this.replyText = ''
          // Add mock sending message
          this.messages.push({
            id: Date.now(),
            owner: 'customer',
            body,
            isMock: true,
          })
          if (body === 'new') {
            this.selectedService = null
            // Start a new conversation again
            await this.startNewConversation()
          } else {
            // Add new message to the server
            const response = await this.sendNewMessage(body)
            if (response.data?.messages) {
              const messages = response.data?.messages
              this.handleNewMessages(messages)
            } else {
              this.handleErrorMessage()
            }
          }
        }
      } catch (e) {
        console.log(e)
        this.handleErrorMessage()
      }
    },
    async sendNewMessage(body) {
      const newMessage = await this.webhook({
        body,
        customerLongId: this.customerId,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })
      return newMessage
    },
    handleErrorMessage() {
      this.messages.push({
        id: Date.now(),
        owner: 'nemo',
        body:
          'Xin lỗi bạn, nhưng hiện tại Nemo đang gặp một chút vấn đề về kỹ thuật. Nemo sẽ quay trở lại trong thời gian sớm nhất',
      })
    },
    handleNewMessages(messages, isClear = false) {
      // Format message from server and add it to messenger section
      const formattedMessages = messages.map((message) => ({
        id: message.id,
        owner: message.owner,
        body: message.body,
        type: message.type,
        created_at: message.createdAt,
      }))
      if (formattedMessages.length > 0) {
        this.triggerSendAnimation()
        setTimeout(() => {
          this.triggerSendAnimation(false)
          // Remove mock message
          this.messages = this.messages.filter((message) => !message.isMock)
          // Update with server messages
          this.messages = isClear
            ? formattedMessages
            : this.messages.concat(formattedMessages)
          // Scroll to bottom and unlock textarea
          this.$nextTick(() => {
            this.scrollToBottom()
            this.$el.querySelector('textarea').focus()
          })
        }, 2500)
      }
      this.isSending = false
    },
    triggerSendAnimation(toggle = true) {
      // Trigger a sending animation on the messenger chat
      if (toggle) {
        this.messages.push({
          id: Date.now(),
          owner: 'nemo',
        })
        this.scrollToBottom()
      } else {
        this.messages = this.messages.filter((message) => message.body)
      }
    },
    scrollToBottom() {
      // Scroll to bottom
      this.$nextTick(() => {
        const replyBox = this.$el.querySelector('.main-messenger-box')
        replyBox.scrollTo({
          top: replyBox.scrollHeight,
          behavior: 'smooth',
        })
      })
    },
    async getAllSelectedService(messageId) {
      this.serviceDialog = true
      this.allServices = []
      const result = await this.customerServices(messageId)
      this.allServices = result.data
    },
    getDetailService(serviceId) {
      this.selectedService =
        this.allServices.find((service) => service.id === serviceId) || null
      this.serviceDialog = false
    },
  },
}
