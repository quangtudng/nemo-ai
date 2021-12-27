<template>
  <div>
    <div class="header">
      <div class="flex items-center h-full text-gray-600">
        <div>
          <el-avatar
            :src="require('~/assets/img/ai-36x36.png')"
            alt="nemo"
            fit="contain"
            class="mr-3"
            :size="36"
          />
        </div>
        <div
          style="line-height: 63px; width: max-content;"
          class="cursor-pointer"
          @click="$router.push('/internal')"
        >
          NemoAI Travelling System
        </div>
      </div>
    </div>
    <div class="flex section-wrapper">
      <div class="service-section">
        <el-row class="h-full p-10">
          <el-col :span="24">
            <p class="nemo-title">
              Nemo Travelling System
            </p>
            <p class="nemo-subtitle">
              Tìm kiếm thông tin của các địa điểm du lịch thích hợp cùng trợ lý
              ảo Nemo.
            </p>
          </el-col>
        </el-row>
      </div>
      <div class="messenger-section">
        <div class="messenger-header">
          <el-avatar
            :src="require('~/assets/img/ai-36x36.png')"
            alt="nemo"
            fit="contain"
            class="mr-3"
            :size="36"
          />
          <p style="line-height: 36px;">
            Nemo
          </p>
        </div>
        <div class="main-messenger-box">
          <div class="my-10 text-center">
            <el-avatar
              :src="require('~/assets/img/ai-100x100.png')"
              alt="nemo"
              fit="contain"
              class="nemo-avatar"
              :size="100"
            />
            <p class="text-lg text-center mt-5 font-semibold">
              Xin chào, tôi là Nemo!
            </p>
            <p class="text-sm text-center text-gray-500 mb-5">
              Tôi sẽ giúp bạn tìm địa điểm du lịch.
            </p>
            <transition name="chat-fade" mode="out-in">
              <el-button
                v-if="!customerId"
                key="start-button"
                class="border-0 bg-theme-1 hover:bg-theme-1-600 text-light select-none"
                size="large"
                @click="startNewConversation"
              >
                Bắt đầu trò chuyện
              </el-button>
            </transition>
          </div>
          <transition name="chat-fade" mode="out-in">
            <div
              v-if="customerId"
              key="messenger-section"
              class="messenger-message"
            >
              <div
                v-for="(message, index) in messages"
                :key="`message-${message.id}`"
              >
                <el-divider
                  v-if="shouldShowTimeStamp(index)"
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
                >
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
                  <el-card
                    shadow="always"
                    class="main-chatbox border-0 w-max text-white h-full ml-3 mr-1"
                    :body-style="{ padding: '0px' }"
                  >
                    <p v-if="message.body" class="break-words">
                      {{ message.body }}
                    </p>
                    <div v-else class="ticontainer">
                      <div class="tiblock">
                        <div class="tidot"></div>
                        <div class="tidot"></div>
                        <div class="tidot"></div>
                      </div>
                    </div>
                  </el-card>
                </div>
              </div>
            </div>
          </transition>
        </div>
        <transition name="chat-fade" mode="out-in">
          <div
            v-if="customerId"
            key="reply-section"
            class="messenger-reply-box"
          >
            <el-input
              id="default-input-search"
              v-model="replyText"
              class="el-default-input"
              :placeholder="'Hãy nhắn gì đó cho Nemo...'"
              type="textarea"
              :disabled="isSending"
              :rows="4"
              autofocus
              @keydown.enter.exact.prevent.native
              @keyup.enter.exact.native="submitReply"
              @keydown.enter.shift.exact.native="newLine"
            >
            </el-input>
            <div class="ml-3 flex items-center justify-self-center">
              <fa
                class="text-theme-1 cursor-pointer"
                style="font-size: 28px;"
                :icon="['fas', 'paper-plane']"
                @click="submitReply"
              />
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
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
