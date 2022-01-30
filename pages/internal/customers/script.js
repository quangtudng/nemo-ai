// Modify this DataTable component to suit your api
import { mapState, mapActions } from 'vuex'
import { Breadcrumb } from '~/components/common'

export default {
  layout: 'internal',
  components: {
    Breadcrumb,
  },
  data() {
    return {
      // Main data holder
      customers: [],
      messages: [],
      selectedCustomer: null,
      // Misc data
      searchQuery: '',
      activeHoverItem: 0,
      showCustomerDetail: false,
      isLoading: false,
      // XHR parameter
      customerXHR: null,
    }
  },
  computed: {
    ...mapState({
      auth: (state) => state.auth.data,
    }),
  },
  async created() {
    this.isLoading = true
    await this.syncNewCustomers()
    await this.syncNewMessages()
    this.isLoading = false
    console.log('Start all XHRs')
    this.startCustomerXHR()
  },
  destroyed() {
    console.log('Stop all XHRs')
    clearInterval(this.customerXHR)
  },
  methods: {
    ...mapActions({
      fetchCustomers: 'customer/fetchData',
      getCustomerMessage: 'message/public_xhr',
    }),
    handleCustomerScroll(el) {
      if (
        el.srcElement.offsetHeight + el.srcElement.scrollTop >=
        el.srcElement.scrollHeight - 10
      ) {
        console.log('scroll to bottom')
      }
    },
    async onChangeCustomer(customer) {
      if (
        !this.isLoading &&
        customer.long_id !== this.selectedCustomer.long_id
      ) {
        this.isLoading = true
        this.selectedCustomer = customer
        await this.syncNewMessages()
        const replyBox = this.$el.querySelector('.messenger-chatbox')
        replyBox.scrollTo({
          top: replyBox.scrollHeight,
          behavior: 'smooth',
        })
        this.isLoading = false
      }
    },
    startCustomerXHR() {
      this.customerXHR = setInterval(
        async function () {
          await this.syncNewCustomers()
          await this.syncNewMessages()
        }.bind(this),
        5000
      )
    },
    async syncNewCustomers() {
      const response = await this.fetchCustomers()
      const customers = response?.data?.data
      if (customers) {
        this.customers = customers
      }
      // If there is no selected customer, then automatically assign it to the first customer in the list
      // If there is current selected customer, update it with newer information
      if (this.customers.length > 0) {
        if (!this.selectedCustomer) {
          this.selectedCustomer = this.customers[0]
        } else {
          this.selectedCustomer = this.customers.find(
            (customer) => customer.id === this.selectedCustomer.id
          )
        }
      }
    },
    async syncNewMessages() {
      // Attempt to get the customer's messages
      if (this.selectedCustomer?.long_id) {
        this.selectedCustomer.viewed = 1
        const messageResponse = await this.getCustomerMessage(
          this.selectedCustomer.long_id
        )
        const existMessages = messageResponse.data?.data
        if (existMessages && existMessages?.length > 0) {
          this.handleNewMessages(existMessages)
        }
      }
    },
    handleNewMessages(messages) {
      // Format message from server and add it to messenger section
      const formattedMessages = messages.map((message) => ({
        id: message.id,
        owner: message.owner,
        body: message.body,
        created_at: message.createdAt,
      }))
      if (formattedMessages.length > 0) {
        // Update with server messages
        this.messages = formattedMessages
      }
    },
    shouldShowTimeStamp(messages, index) {
      try {
        if (index === 0) {
          return true
        } else {
          const FIFTEEN_MINUTES = 15 * 60 * 1000
          const currentTimestamp = Date.parse(messages[index].created_at)
          const lastTimeStamp = Date.parse(messages[index - 1].created_at)
          return currentTimestamp - lastTimeStamp > FIFTEEN_MINUTES
        }
      } catch (e) {
        console.log(e)
        return false
      }
    },
  },
}
