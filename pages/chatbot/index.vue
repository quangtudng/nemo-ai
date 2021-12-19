<template>
  <div>
    <div class="header">
      <div class="flex items-center h-full text-gray-600">
        <div>
          <el-avatar
            :src="require('~/assets/img/ai.png')"
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
            :src="require('~/assets/img/ai.png')"
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
              :src="require('~/assets/img/ai.png')"
              alt="nemo"
              fit="contain"
              class="nemo-avatar"
              :size="100"
            />
            <p class="text-lg text-center mt-5 font-semibold">
              Xin chào, tôi là Nemo!
            </p>
            <p class="text-sm text-center text-gray-500">
              Tôi sẽ giúp bạn tìm địa điểm du lịch.
            </p>
          </div>
          <div class="messenger-message">
            <div
              v-for="(message, index) in messages"
              :key="`message-${message.id}`"
            >
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
                  message.owner === 'nemo' ? 'is-nemo-chat' : 'is-customer-chat'
                "
              >
                <div
                  v-if="message.owner === 'nemo'"
                  class="flex justify-end items-end"
                >
                  <el-avatar
                    :src="require('~/assets/img/ai.png')"
                    alt="nemo"
                    fit="contain"
                    size="large"
                  />
                </div>
                <el-card
                  shadow="always"
                  class="main-chatbox border-0 text-white w-full h-full ml-3"
                  :body-style="{ padding: '0px' }"
                >
                  <p>
                    {{ message.message }}
                  </p>
                </el-card>
              </div>
            </div>
          </div>
        </div>
        <div class="messenger-reply-box">
          <el-input
            id="default-input-search"
            v-model="replyText"
            class="el-default-input"
            :placeholder="'Hãy nhắn gì đó cho Nemo...'"
            type="textarea"
            :rows="4"
          >
          </el-input>
          <div class="ml-3 flex items-center justify-self-center">
            <fa
              class="text-theme-1 cursor-pointer"
              style="font-size: 28px;"
              :icon="['fas', 'paper-plane']"
            />
          </div>
        </div>
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
