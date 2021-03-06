import { mapActions } from 'vuex'
import VueWeather from 'vue-weather-widget'

export default {
  name: 'Chatbot',
  layout: 'client',
  components: {
    VueWeather,
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
      weatherDialog: false,
      allServices: [],
      locationDialogVisible: false,
      amenityExpaned: false,
      weatherLocation: {
        name: '',
        latitude: 0,
        longitude: 0,
      },
      imageLists: [
        require('~/assets/img/chatbot-background.png'),
        require('~/assets/img/chatbot-background-1.png'),
        require('~/assets/img/chatbot-background-2.png'),
        require('~/assets/img/chatbot-background-3.png'),
        require('~/assets/img/chatbot-background-4.png'),
        require('~/assets/img/chatbot-background-5.png'),
      ],
      background: require('~/assets/img/chatbot-background.png'),
      backgroundId: 0,
      backgroundXHR: null,
    }
  },
  created() {
    console.log('background XHR started')
    this.startBackgroundXHR()
  },
  methods: {
    ...mapActions({
      webhook: 'message/webhook',
      getCustomerMessage: 'message/public_xhr',
      customerServices: 'message/customer_services',
      saveCustomerInterests: 'customer/saveCustomerInterests',
      weatherRequest: 'message/weatherRequest',
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
    startBackgroundXHR() {
      this.backgroundXHR = setInterval(
        function () {
          const randomIndex = Math.floor(Math.random() * this.imageLists.length)
          this.background = this.imageLists[randomIndex]
          this.backgroundId = randomIndex
        }.bind(this),
        5000
      )
    },
    destroyed() {
      console.log('Stop background XHR')
      clearInterval(this.backgroundXHR)
    },
    newLine() {
      this.replyText = `${this.replyText}\n`
    },
    async startNewConversation() {
      try {
        const response = await this.sendNewMessage('new')
        const newMessages = response?.data?.messages
        const newCustomer = response?.data?.customer
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
      } catch (error) {
        console.log(error)
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
            console.log('Stop background XHR')
            clearInterval(this.backgroundXHR)
            console.log('background XHR started')
            this.startBackgroundXHR()
          } else {
            // Add new message to the server
            const response = await this.sendNewMessage(body)
            if (response?.data?.messages) {
              const messages = response.data?.messages
              this.handleNewMessages(messages)
            } else {
              this.handleErrorMessage()
            }
          }
        }
      } catch (error) {
        console.log(error)
        this.handleErrorMessage()
      }
    },
    async sendNewMessage(body) {
      /**
       * Send new message to the server
       */
      try {
        const newMessage = await this.webhook({
          body,
          customerLongId: this.customerId,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        })
        return newMessage
      } catch (error) {
        console.log(error)
        return null
      }
    },
    handleErrorMessage() {
      this.messages.push({
        id: Date.now(),
        owner: 'nemo',
        body:
          'Xin l???i b???n, nh??ng hi???n t???i Nemo ??ang g???p m???t ch??t v???n ????? v??? k??? thu???t. Nemo s??? quay tr??? l???i trong th???i gian s???m nh???t',
      })
    },
    handleNewMessages(messages, isClear = false) {
      /**
       * Format message from server and add it to messenger section
       */
      try {
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
      } catch (error) {
        console.log(error)
      }
    },
    triggerSendAnimation(toggle = true) {
      /**
       * Trigger a sending animation on the messenger chat
       */
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
      /**
       * Get all selected services from the server when customer clicks on the show more text
       */
      try {
        this.serviceDialog = true
        this.allServices = []
        const result = await this.customerServices(messageId)
        this.allServices = result.data
      } catch (error) {
        console.log(error)
      }
    },
    async getWeatherRequest(messageId) {
      /**
       * Get weather request from server by getting longtitude and latitude
       */
      try {
        const result = await this.weatherRequest(messageId)
        if (result.data.name && result.data.latitude && result.data.longitude) {
          this.weatherLocation.name = result.data.name + ''
          this.weatherLocation.latitude = result.data.latitude + ''
          this.weatherLocation.longitude = result.data.longitude + ''
          this.weatherDialog = true
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getDetailService(serviceId) {
      /**
       * Get the detail of a service when user click on a service in the list
       */
      try {
        this.amenityExpaned = false
        this.selectedService =
          this.allServices.find((service) => service.id === serviceId) || null
        this.serviceDialog = false
        await this.saveCustomerInterests({
          customerLongId: this.customerId,
          interestId: this.selectedService.id,
        })
        console.log('Stop background XHR')
        clearInterval(this.backgroundXHR)
      } catch (error) {
        console.log(error)
      }
    },
  },
}
