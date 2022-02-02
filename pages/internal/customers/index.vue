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
      <div v-if="customers.length === 0" class="empty-view">
        <el-card
          shadow="always"
          class="relative border-0 rounded-lg w-full h-full"
          :body-style="{ padding: '0px' }"
        >
        </el-card>
      </div>
      <el-card
        v-if="customers.length != 0"
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
                        <p class="customer-email">
                          {{ customer.email || 'No email provided' }}
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
                          Conversation started
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
        v-if="customers.length != 0"
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
                <div class="ml-6">
                  <p
                    class="text-lg font-bold text-gray-700"
                    style="line-height: 48px;"
                  >
                    Khách hàng
                  </p>
                </div>
              </div>
              <div class="flex items-center mr-5">
                <el-button
                  class="text-light shadow border-none"
                  size="mini"
                  style="background-color: #adb5bd;"
                >
                  <span class="text-sm">Conversation started</span>
                </el-button>
                <el-button size="mini" @click="showCustomerDetail = true">
                  <fa
                    class="cursor-pointer text-sm"
                    :icon="['fas', 'ellipsis-h']"
                    style="color: #adb5bd;"
                  />
                  <span class="text-sm">More</span>
                </el-button>
                <el-dialog
                  title="Customer detail"
                  :visible.sync="showCustomerDetail"
                  width="60%"
                >
                  <el-card class="mb-5 rounded-none" shadow="hover">
                    <p class="mb-4 font-bold">
                      Customer summary
                    </p>
                    <el-row>
                      <el-col :span="24">
                        <em class="el-icon-message text-gray-500 mb-2" />
                        <span class="text-gray-600 text-sm">
                          Email: {{ selectedCustomer.email || 'Not provided' }}
                        </span>
                      </el-col>
                      <el-col :span="24">
                        <em class="el-icon-date text-gray-500 mb-2" />
                        <span class="text-gray-600 text-sm">
                          First contacted:
                          {{
                            selectedCustomer.first_contacted | formatDateTime
                          }}
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
                          Last contacted:
                          {{ selectedCustomer.last_contacted | formatDateTime }}
                        </span>
                      </el-col>
                    </el-row>
                  </el-card>
                  <el-card class="mb-5 rounded-none" shadow="hover">
                    <p class="font-bold">
                      Service interest
                    </p>
                    <el-table
                      class="datatable"
                      :data="selectedCustomer.selectedInterests"
                      border
                      style="width: 100%;"
                      max-height="450"
                    >
                      <el-table-column prop="thumbnail" label="Ảnh" width="100">
                        <template slot-scope="scope">
                          <img
                            v-if="scope.row.thumbnail"
                            :src="scope.row.thumbnail"
                            alt="Map thumbnail"
                          />
                          <img
                            v-else
                            :src="require('~/assets/img/no-img.jpg')"
                            alt="Map thumbnail"
                          />
                        </template>
                      </el-table-column>
                      <el-table-column prop="title" label="Tên">
                        <template slot-scope="scope">
                          <span
                            class="break-words whitespace-pre-line"
                            style="word-break: break-word;"
                          >
                            {{ scope.row.title }}
                          </span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="location.name" label="Khu vực">
                        <template slot-scope="scope">
                          <span
                            class="break-words whitespace-pre-line"
                            style="word-break: break-word;"
                          >
                            {{ scope.row.location.name }}
                          </span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="category.title"
                        label="Loại dịch vụ"
                      >
                        <template slot-scope="scope">
                          <span
                            class="break-words whitespace-pre-line"
                            style="word-break: break-word;"
                          >
                            {{
                              scope.row.category ? scope.row.category.title : ''
                            }}
                          </span>
                        </template>
                      </el-table-column>
                    </el-table>
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
                        <p class="break-words whitespace-pre-line">
                          <span>{{ message.body }}</span>
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
              <el-col :span="13" class="hidden xl:block">
                <div class="status-information">
                  <em class="el-icon-date text-lg" />
                  <span class="text-sm ml-2">Conversation started</span>
                </div>
                <div style="padding: 24px 16px;">
                  <el-card class="mb-5 rounded-none" shadow="hover">
                    <p class="mb-4 font-semibold">
                      Customer summary
                    </p>
                    <el-row>
                      <el-col :span="24">
                        <em class="el-icon-message text-gray-500 mb-2" />
                        <span class="text-gray-600 text-sm font-semibold">
                          Email:
                        </span>
                        <span class="text-gray-600 text-sm">
                          {{ selectedCustomer.email || 'Not provided' }}
                        </span>
                      </el-col>
                      <el-col :span="24">
                        <em class="el-icon-date text-gray-500 mb-2" />
                        <span class="text-gray-600 text-sm font-semibold">
                          First contacted:
                        </span>
                        <span class="text-gray-600 text-sm">
                          {{
                            selectedCustomer.first_contacted | formatDateTime
                          }}
                        </span>
                      </el-col>
                      <el-col :span="24">
                        <em
                          class="el-icon-location-outline text-gray-500 mb-2"
                        />
                        <span class="text-gray-600 text-sm font-semibold">
                          Location:
                        </span>
                        <span class="text-gray-600 text-sm">
                          Vietnam
                        </span>
                      </el-col>
                      <el-col :span="24">
                        <em class="el-icon-timer text-gray-500 mb-2" />
                        <span class="text-gray-600 text-sm font-semibold">
                          Last contacted:
                        </span>
                        <span class="text-gray-600 text-sm">
                          {{ selectedCustomer.last_contacted | formatDateTime }}
                        </span>
                      </el-col>
                    </el-row>
                  </el-card>
                  <el-card
                    class="mb-5 rounded-none"
                    shadow="hover"
                    style="max-height: 470px;"
                  >
                    <p class="mb-4 font-semibold">
                      Service interest
                    </p>
                    <el-table
                      class="datatable"
                      :data="selectedCustomer.selectedInterests"
                      border
                      style="width: 100%;"
                      max-height="390"
                    >
                      <el-table-column prop="thumbnail" label="Ảnh" width="100">
                        <template slot-scope="scope">
                          <img
                            v-if="scope.row.thumbnail"
                            :src="scope.row.thumbnail"
                            alt="Map thumbnail"
                          />
                          <img
                            v-else
                            :src="require('~/assets/img/no-img.jpg')"
                            alt="Map thumbnail"
                          />
                        </template>
                      </el-table-column>
                      <el-table-column prop="title" label="Tên">
                        <template slot-scope="scope">
                          <span
                            class="break-words whitespace-pre-line"
                            style="word-break: break-word;"
                          >
                            {{ scope.row.title }}
                          </span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="location.name" label="Khu vực">
                        <template slot-scope="scope">
                          <span
                            class="break-words whitespace-pre-line"
                            style="word-break: break-word;"
                          >
                            {{ scope.row.location.name }}
                          </span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="category.title"
                        label="Loại dịch vụ"
                      >
                        <template slot-scope="scope">
                          <span
                            class="break-words whitespace-pre-line"
                            style="word-break: break-word;"
                          >
                            {{
                              scope.row.category ? scope.row.category.title : ''
                            }}
                          </span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-card>
                </div>
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
