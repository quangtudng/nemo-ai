<template>
  <el-main>
    <el-container class="pl-3 pr-3 pt-0">
      <el-row class="w-full">
        <!-- Title -->
        <h1 class="text-3xl font-bold text-light inline-block mr-3">
          {{ $t('locations.title') }}
        </h1>
        <div class="inline-block text-light select-none">
          <nuxt-link to="/internal">
            <fa :icon="['fas', 'home']" />
          </nuxt-link>
        </div>
      </el-row>
    </el-container>
    <el-container class="p-3">
      <el-card
        shadow="always"
        class="border-0 rounded-lg w-full h-full mr-3"
        :body-style="{ padding: '0px' }"
        style="max-width: 350px;"
      >
        <div class="flex flex-row">
          <div style="border-right: 1px solid #ededed;" class="w-full">
            <div
              class="text-theme-1 p-1"
              style="
                box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 4px 0px;
                height: 64px;
              "
            >
              <el-input
                id="default-input-search"
                v-model="searchQuery"
                class="el-default-input el-override-chat-input"
                prefix-icon="el-icon-search"
                :placeholder="'Finding customers'"
              />
            </div>
            <div class="customer-list" @scroll="handleCustomerScroll">
              <!--
                Here, we're moving the position-anchoring off of the overflow container and
                onto a content wrapper (contained within the overflow area). This allows the
                absolutely positioned elements to anchor to the bounding box of the content,
                not the viewport.
		           -->
              <div class="relative">
                <div
                  v-for="customer in customers"
                  :key="`customer-${customer.id}`"
                >
                  <div
                    class="messenger-box"
                    :style="
                      customer.long_id === selectedCustomer.long_id
                        ? 'border-left: 5px solid var(--color-theme-1);'
                        : ''
                    "
                    @click="onChangeCustomer(customer)"
                  >
                    <div class="messenger-inner-box">
                      <div class="customer-info-box">
                        <p class="customer-name">
                          Khách hàng
                        </p>
                        <p class="customer-last-timestamp">
                          {{
                            customer.last_message.created_at
                              | formatRelativeTime
                          }}
                        </p>
                      </div>
                      <div class="customer-message-box">
                        <p class="customer-message">
                          {{ customer.email || 'No email provided' }}
                        </p>
                        <div class="flex justify-between">
                          <p
                            :class="[
                              'customer-message',
                              !customer.viewed ? 'text-theme-1' : '',
                            ]"
                          >
                            {{
                              customer.last_message.owner === 'nemo'
                                ? 'Nemo: '
                                : 'Customer: '
                            }}
                            {{ customer.last_message.body }}
                          </p>
                          <fa
                            v-if="!customer.viewed"
                            class="el-icon-message self-center text-theme-1"
                            :icon="['fas', 'envelope']"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-card>
      <el-card
        shadow="always"
        class="relative border-0 rounded-lg w-full h-full"
        :body-style="{ padding: '0px' }"
      >
        <div v-if="isLoading" class="card-loading-spinner">
          <em class="el-icon-loading loading-spinner" />
        </div>
        <el-row class="w-full">
          <el-col :span="24">
            <div class="messenger-general-info">
              <div class="flex">
                <el-avatar
                  :src="require('~/assets/img/default-man.png')"
                  alt="customer-image"
                  size="large"
                  class="ml-5 self-center"
                />
                <div class="ml-4">
                  <p class="text-base text-gray-600">
                    Khách hàng
                  </p>
                  <p class="text-xs text-gray-500">
                    <el-tag type="success" effect="dark" size="mini">
                      Active now
                    </el-tag>
                  </p>
                </div>
              </div>
              <div class="flex items-center mr-5">
                <el-button
                  class="bg-theme-1 text-light hover:bg-theme-1-600 shadow border-none"
                  size="mini"
                >
                  <span class="text-sm">Conversation started</span>
                </el-button>
                <el-button size="mini" @click="showCustomerDetail = true">
                  <fa
                    class="cursor-pointer text-theme-1 text-sm"
                    :icon="['fas', 'ellipsis-h']"
                  />
                  <span class="text-sm">More</span>
                </el-button>
                <el-dialog
                  title="Customer detail"
                  :visible.sync="showCustomerDetail"
                  width="60%"
                >
                  <el-card class="mb-5 rounded-none" shadow="hover">
                    <p class="mb-4">
                      Customer summary
                    </p>
                    <el-row>
                      <el-col :span="24">
                        <em class="el-icon-message text-gray-500 mb-2" />
                        <span class="text-gray-600 text-sm">
                          Email: Not provided
                        </span>
                      </el-col>
                      <el-col :span="24">
                        <em class="el-icon-date text-gray-500 mb-2" />
                        <span class="text-gray-600 text-sm">
                          First contacted: 12/12/2021 - 5:24 pm
                        </span>
                      </el-col>
                      <el-col :span="24">
                        <em
                          class="el-icon-location-outline text-gray-500 mb-2"
                        />
                        <span class="text-gray-600 text-sm">
                          Location: Vietnam
                        </span>
                      </el-col>
                      <el-col :span="24">
                        <em class="el-icon-timer text-gray-500 mb-2" />
                        <span class="text-gray-600 text-sm">
                          Last contacted: 12/12/2021 - 6:24 pm
                        </span>
                      </el-col>
                    </el-row>
                  </el-card>
                  <el-card class="mb-5 rounded-none" shadow="hover">
                    <p>Activities</p>
                  </el-card>
                  <el-card class="mb-5 rounded-none" shadow="hover">
                    <p>Service interest</p>
                  </el-card>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="showCustomerDetail = false">
                      Cancel
                    </el-button>
                    <el-button
                      type="primary"
                      @click="showCustomerDetail = false"
                    >
                      Confirm
                    </el-button>
                  </span>
                </el-dialog>
              </div>
            </div>
            <el-row>
              <el-col
                :span="11"
                class="expand-full-chat"
                style="box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 4px 0px;"
              >
                <div class="messenger-chatbox">
                  <div
                    v-for="(message, index) in messages"
                    :key="`message-${message.id}`"
                  >
                    <p
                      v-if="index == 0"
                      class="text-gray-500 text-xs text-center mt-8"
                    >
                      Conversation started
                    </p>
                    <el-divider
                      v-if="shouldShowTimeStamp(messages, index)"
                      content-position="center"
                      class="mt-4"
                    >
                      <span class="text-gray-500 text-xs">
                        {{ message.created_at | formatDateTime }}
                      </span>
                    </el-divider>
                    <div
                      :class="
                        message.owner === 'nemo'
                          ? 'is-nemo-chat'
                          : 'is-customer-chat'
                      "
                      @mouseenter="activeHoverItem = message.id"
                      @mouseleave="activeHoverItem = 0"
                    >
                      <el-card
                        shadow="always"
                        class="main-chatbox border-0 w-max text-white h-full mr-3"
                        :body-style="{ padding: '0px' }"
                      >
                        <p class="break-words">
                          {{ message.body }}
                        </p>
                      </el-card>
                      <p
                        v-if="activeHoverItem === message.id"
                        class="chatbox-timestamp"
                      >
                        {{ message.created_at | formatTime }}
                      </p>
                      <div
                        v-if="message.owner === 'nemo'"
                        class="flex justify-end items-end"
                      >
                        <el-avatar
                          :src="require('~/assets/img/ai-36x36.png')"
                          alt="nemo"
                          fit="contain"
                          size="large"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col
                :span="13"
                class="hidden xl:block"
                style="padding: 24px 16px;"
              >
                <el-card class="mb-5 rounded-none" shadow="hover">
                  <p class="mb-4">
                    Customer summary
                  </p>
                  <el-row>
                    <el-col :span="24">
                      <em class="el-icon-message text-gray-500 mb-2" />
                      <span class="text-gray-600 text-sm">
                        Email: Not provided
                      </span>
                    </el-col>
                    <el-col :span="24">
                      <em class="el-icon-date text-gray-500 mb-2" />
                      <span class="text-gray-600 text-sm">
                        First contacted: 12/12/2021 - 5:24 pm
                      </span>
                    </el-col>
                    <el-col :span="24">
                      <em class="el-icon-location-outline text-gray-500 mb-2" />
                      <span class="text-gray-600 text-sm">
                        Location: Vietnam
                      </span>
                    </el-col>
                    <el-col :span="24">
                      <em class="el-icon-timer text-gray-500 mb-2" />
                      <span class="text-gray-600 text-sm">
                        Last contacted: 12/12/2021 - 6:24 pm
                      </span>
                    </el-col>
                  </el-row>
                </el-card>
                <el-card class="mb-5 rounded-none" shadow="hover">
                  <p>Activities</p>
                </el-card>
                <el-card class="mb-5 rounded-none" shadow="hover">
                  <p>Service interest</p>
                </el-card>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-card>
    </el-container>
  </el-main>
</template>
<script src="./script.js"></script>
<style lang="scss" src="./style.scss" scoped></style>
<style lang="scss">
.el-default-input {
  textarea {
    overflow-y: hidden;
    resize: none;
    border-radius: 24px;
    max-height: 48px !important;
    padding: 14px 21px 8px 28px !important;
  }
}
.el-override-chat-input {
  .el-input__inner {
    border-radius: 0px !important;
    background: #fff;
  }
}
</style>
