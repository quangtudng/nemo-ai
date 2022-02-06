<template>
  <el-container class="p-3">
    <div v-if="customers.length === 0" class="empty-view">
      <el-card
        shadow="always"
        class="border-0 rounded-none w-full h-full"
        :body-style="{ padding: '0px' }"
      >
      </el-card>
    </div>
    <el-card
      v-if="customers.length != 0"
      shadow="always"
      class="border-0 rounded-none w-full h-full mr-3"
      :body-style="{ padding: '0px' }"
      style="max-width: 350px;"
    >
      <div class="flex flex-row">
        <div style="border-right: 1px solid #ededed;" class="w-full">
          <div
            class="px-5 py-2"
            style="
              box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 4px 0px;
              height: 64px;
            "
          >
            <div class="flex h-full">
              <div class="ml-4 flex items-center">
                <p class="text-lg font-bold mr-2">
                  {{ $t('chat.title') }}
                </p>
                <el-tag
                  key="customer-tag"
                  type="primary"
                  effect="dark"
                  size="small"
                >
                  {{ customers.length }}
                </el-tag>
              </div>
            </div>
          </div>
          <div class="customer-list">
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
                      <p class="customer-email text-gray-600 font-semibold">
                        {{ customer.email || $t('chat.no-email') }}
                      </p>
                      <p class="customer-last-timestamp">
                        {{
                          customer.last_message.created_at | formatRelativeTime
                        }}
                      </p>
                    </div>
                    <div class="customer-message-box">
                      <p class="customer-message">
                        {{ $t('chat.conversation-in-progress') }}
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
                              : `${$t('chat.customer')}: `
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
      class="relative border-0 rounded-none w-full h-full"
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
                <p class="text-base font-semibold text-gray-700">
                  {{ $t('chat.customer') }}
                </p>
                <p class="text-xs text-gray-600">
                  {{ $t('chat.last-active') }}
                  {{
                    selectedCustomer.last_message.created_at
                      | formatRelativeTime
                  }}
                </p>
              </div>
            </div>
            <div class="flex items-center mr-5">
              <el-button
                v-if="isInConversation(selectedCustomer)"
                class="text-light shadow border-none bg-primary-500"
                size="mini"
              >
                <span class="text-sm">
                  {{ $t('chat.conversation-in-progress') }}
                </span>
              </el-button>
              <el-button
                v-else
                class="text-light shadow border-none bg-danger-500"
                size="mini"
              >
                <span class="text-sm">
                  {{ $t('chat.conversation-ended') }}
                </span>
              </el-button>
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
                    {{ $t('chat.conversation-started') }}
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
              <div style="height: 78vh; overflow: auto;">
                <div class="status-information">
                  <em class="el-icon-info text-lg" />
                  <span class="text-sm ml-2">
                    {{ $t('chat.general-info') }}
                  </span>
                </div>
                <div style="padding: 24px 16px;">
                  <div>
                    <p class="mb-4 font-semibold">
                      {{ $t('chat.customer-summary') }}
                    </p>
                    <el-row>
                      <el-col :span="24">
                        <em class="el-icon-message text-gray-500 mb-2" />
                        <span class="text-gray-600 text-sm font-semibold">
                          Email:
                        </span>
                        <span class="text-gray-600 text-sm">
                          {{ selectedCustomer.email || $t('chat.no-email') }}
                        </span>
                      </el-col>
                      <el-col :span="24">
                        <em class="el-icon-date text-gray-500 mb-2" />
                        <span class="text-gray-600 text-sm font-semibold">
                          {{ $t('chat.first-contacted') }}:
                        </span>
                        <span class="text-gray-600 text-sm">
                          {{
                            selectedCustomer.first_contacted | formatDateTime
                          }}
                        </span>
                      </el-col>
                      <el-col :span="24">
                        <em class="el-icon-timer text-gray-500 mb-2" />
                        <span class="text-gray-600 text-sm font-semibold">
                          {{ $t('chat.last-active') }}:
                        </span>
                        <span class="text-gray-600 text-sm">
                          {{ selectedCustomer.last_contacted | formatDateTime }}
                        </span>
                      </el-col>
                    </el-row>
                  </div>
                  <div class="mt-4">
                    <p class="mb-4 font-semibold">
                      {{ $t('chat.service-interest') }}
                    </p>
                    <el-table
                      :data="selectedCustomer.selectedInterests"
                      border
                      style="width: 100%;"
                      max-height="500"
                    >
                      <el-table-column :label="$t('services.name')">
                        <template slot-scope="scope">
                          <p
                            class="break-words whitespace-pre-line font-bold text-gray-600"
                            style="word-break: break-word;"
                          >
                            {{ scope.row.title }}
                          </p>
                        </template>
                      </el-table-column>
                      <el-table-column
                        :label="$t('services.location')"
                        width="120"
                      >
                        <template slot-scope="scope">
                          <el-tag
                            :key="`location-interest-${scope.row.id}`"
                            type="primary"
                            effect="dark"
                            size="small"
                          >
                            {{ scope.row.location.name }}
                          </el-tag>
                        </template>
                      </el-table-column>
                      <el-table-column :label="$t('services.category')">
                        <template slot-scope="scope">
                          <el-tag
                            :key="`category-interest-${scope.row.id}`"
                            type="success"
                            effect="dark"
                            size="small"
                          >
                            {{ scope.row.category.title }}
                          </el-tag>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
  </el-container>
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
</style>
