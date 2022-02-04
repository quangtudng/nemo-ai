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
      <div
        :class="
          !selectedService
            ? ['service-section']
            : ['service-without-background-section']
        "
      >
        <el-row class="h-full p-8 overflow-y-scroll">
          <el-col v-if="!selectedService" :span="24">
            <p class="nemo-title">
              Nemo Travelling System
            </p>
            <p class="nemo-subtitle">
              Tìm kiếm thông tin của các địa điểm du lịch thích hợp cùng trợ lý
              ảo Nemo.
            </p>
          </el-col>
          <el-col v-else :span="24">
            <!-- General information -->
            <el-row>
              <el-col :span="24">
                <p class="text-3xl font-semibold">
                  {{ selectedService.title }}
                </p>
                <div class="text-sm flex">
                  <div class="border-r border-gray-500 px-2">
                    <fa :icon="['fas', 'map-marker-alt']" />
                    <span
                      class="text-gray-600 cursor-pointer dotted-text"
                      @click="locationDialogVisible = true"
                    >
                      {{
                        selectedService.fullAddress
                          ? selectedService.fullAddress
                          : selectedService.location.name
                      }}
                    </span>
                  </div>
                  <div class="border-r border-gray-500 px-2">
                    <fa :icon="['fas', 'phone']" />
                    <a
                      v-if="selectedService.phoneNumber"
                      :href="`tel:${selectedService.phoneNumber}`"
                      class="text-gray-600"
                    >
                      <span class="dotted-text">
                        {{ selectedService.phoneNumber }}
                      </span>
                    </a>
                    <span v-else class="text-gray-600">
                      Chưa cập nhật
                    </span>
                  </div>
                  <div class="border-r border-gray-500 px-2">
                    <fa :icon="['fas', 'home']" />
                    <a
                      v-if="selectedService.originUrl"
                      :href="selectedService.originUrl"
                      target="_blank"
                    >
                      <span class="text-gray-600 dotted-text">Trang chủ</span>
                    </a>
                    <span v-else class="text-gray-600">Chưa cập nhật</span>
                  </div>
                </div>
              </el-col>
            </el-row>
            <!-- Covid notice -->
            <el-row class="mt-5">
              <el-col :span="24" style="background-color: #eafaf4;">
                <div class="p-3 flex">
                  <div
                    class="mr-2 bg-success-500"
                    style="min-width: 4px;"
                  ></div>
                  <div>
                    <span class="font-semibold">Covid-19:</span>
                    <span>
                      Trong thời điểm đại dịch Covid-19, mong quý khách theo dõi
                      thông tin và giữ an toàn khi đi du lịch.
                    </span>
                  </div>
                </div>
              </el-col>
            </el-row>
            <!-- Carousel -->
            <el-row
              v-if="selectedService.serviceImages.length > 0"
              class="mt-10"
              style="height: 400px;"
            >
              <el-col :span="24" class="px-3 h-full">
                <el-carousel
                  :interval="4000"
                  indicator-position="none"
                  height="400px"
                >
                  <el-carousel-item
                    v-for="serviceImage in selectedService.serviceImages"
                    :key="`serviceImage-${serviceImage.id}`"
                  >
                    <div class="w-full h-full">
                      <img
                        class="w-full h-full object-cover"
                        :src="serviceImage.url"
                        alt="Service image"
                      />
                    </div>
                  </el-carousel-item>
                </el-carousel>
              </el-col>
            </el-row>
            <!-- About -->
            <el-row>
              <el-col :span="24">
                <el-card
                  shadow="never"
                  class="rounded-lg w-full h-full mt-10 p-5"
                  style="box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 4px 0px;"
                  :body-style="{ padding: '0px' }"
                >
                  <div class="text-3xl font-bold border-b pb-4">
                    <span>
                      Giới thiệu
                    </span>
                  </div>
                  <el-row class="mt-6">
                    <el-col :span="24" :lg="10" class="pr-6 mb-5">
                      <div class="mb-4">
                        <p class="font-semibold mb-1">
                          Khoảng giá
                        </p>
                        <div class="text-sm">
                          <p v-if="selectedService.price" class="text-sm">
                            {{ selectedService.price | formatNumber }}
                            VNĐ
                          </p>
                          <p v-else>
                            Chưa cập nhật
                          </p>
                        </div>
                      </div>
                      <div class="mb-4">
                        <p class="font-semibold">
                          Mô tả
                        </p>
                        <div class="text-sm">
                          <p v-if="selectedService.description">
                            {{ selectedService.description }}
                          </p>
                          <p v-else>
                            Chưa cập nhật
                          </p>
                        </div>
                      </div>
                    </el-col>
                    <el-col :span="24" :lg="14">
                      <div class="mb-4">
                        <p class="font-semibold mb-1">
                          Tiện nghi
                        </p>
                        <div class="text-sm">
                          <div v-if="selectedService.amenities.length > 0">
                            <el-row>
                              <el-col
                                v-for="(am, i) in selectedService.amenities"
                                :key="'amenity-' + am.id"
                                :span="24"
                                :lg="12"
                              >
                                <div
                                  v-if="i < 20 || amenityExpaned"
                                  class="text-sm mb-2"
                                  style="max-width: 200px;"
                                >
                                  <fa :icon="['fas', am.icon]" class="mr-1" />
                                  <span>{{ am.title }}</span>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <span v-else>Chưa cập nhật</span>
                        </div>
                        <div v-if="selectedService.amenities.length >= 20">
                          <span
                            v-if="!amenityExpaned"
                            class="text-sm dotted-text cursor-pointer"
                            @click="amenityExpaned = true"
                          >
                            Xem thêm
                          </span>
                          <span
                            v-else
                            class="text-sm dotted-text cursor-pointer"
                            @click="amenityExpaned = false"
                          >
                            Thu gọn
                          </span>
                        </div>
                      </div>
                      <el-row>
                        <el-col :span="12">
                          <div class="mb-4">
                            <p class="font-semibold mb-1">
                              Website
                            </p>
                            <div class="text-sm">
                              <fa class="mr-1" :icon="['fas', 'home']" />
                              <a
                                v-if="selectedService.originUrl"
                                :href="selectedService.originUrl"
                                target="_blank"
                              >
                                <span class="dotted-text">Trang chủ</span>
                              </a>
                              <span v-else>Chưa cập nhật</span>
                            </div>
                          </div>
                        </el-col>
                        <el-col :span="12">
                          <div class="mb-4">
                            <p class="font-semibold mb-1">
                              Số điện thoại
                            </p>
                            <div class="text-sm">
                              <fa class="mr-1" :icon="['fas', 'phone']" />
                              <a
                                v-if="selectedService.phoneNumber"
                                :href="`tel:${selectedService.phoneNumber}`"
                              >
                                <span class="dotted-text">
                                  {{ selectedService.phoneNumber }}
                                </span>
                              </a>
                              <span v-else>Chưa cập nhật</span>
                            </div>
                          </div>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </el-card>
              </el-col>
            </el-row>
            <!-- Location -->
            <el-row>
              <el-col :span="24" class="mt-10">
                <p class="text-xl font-semibold">
                  Khu vực
                </p>
                <span class="text-gray-700 text-sm">
                  {{
                    selectedService.fullAddress
                      ? selectedService.fullAddress
                      : selectedService.location.name
                  }}
                </span>
                <img
                  src="~/assets/img/internal/map-thumbnail-2.png"
                  alt="Map thumbnail"
                  height="241"
                  class="cursor-pointer w-full"
                  @click="locationDialogVisible = true"
                />
                <el-dialog
                  v-if="locationDialogVisible"
                  :visible.sync="locationDialogVisible"
                  width="70%"
                  center
                  custom-class="location-dialog"
                >
                  <span slot="title" class="dialog-footer">
                    <fa :icon="['fas', 'map-marker-alt']" />
                    <span class="ml-1">
                      {{
                        selectedService.fullAddress
                          ? selectedService.fullAddress
                          : selectedService.location.name
                      }}
                    </span>
                  </span>
                  <GoogleMap
                    :location="
                      selectedService.fullAddress || selectedService.title
                    "
                    :zoom="15"
                  />
                </el-dialog>
              </el-col>
            </el-row>
            <!-- Covid precaution -->
            <el-row>
              <el-col :span="24">
                <el-card
                  shadow="never"
                  class="rounded-lg w-full h-full mt-10 p-5"
                  style="box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 4px 0px;"
                  :body-style="{ padding: '0px' }"
                >
                  <div class="text-xl font-bold flex">
                    <img
                      src="~/assets/img/handwash.png"
                      alt="Covid handwash"
                      width="55"
                      height="60"
                      class="mr-3"
                    />
                    <span style="line-height: 60px;">
                      Du lịch an toàn giữa đại dịch COVID-19
                    </span>
                  </div>
                  <el-row class="mt-6">
                    <el-col :span="24" :lg="12" class="pr-6 mb-5">
                      <p class="font-semibold mb-4">
                        Giữ bản thân an toàn trong đại dịch COVID khi du lịch
                      </p>
                      <ul class="list-disc list-inside text-sm">
                        <li class="mt-2">
                          Chích ngừa và tiêm vắc-xin COVID-19 đầy đủ
                        </li>
                        <li class="mt-2">
                          Giữ khoảng cách 2 mét đối với những du khách khác
                        </li>
                        <li class="mt-2">
                          Mang theo sẵn các bình xà phòng sát khuẩn cá nhân và
                          vệ sinh rửa tay thường xuyên
                        </li>
                        <li class="mt-2">
                          Tránh các không gian thông khí kém và nơi đông người
                          và che miệng khi ho và hắt hơi
                        </li>
                      </ul>
                    </el-col>
                    <el-col :span="24" :lg="12">
                      <p class="font-semibold mb-4">
                        Cộng đồng
                      </p>
                      <div class="mt-2">
                        <fa
                          :icon="['fas', 'clinic-medical']"
                          class="text-gray-600 mr-1"
                        />
                        <a
                          href="https://vietnamese.cdc.gov/coronavirus/2019-ncov/prevent-getting-sick/prevention.html"
                          target="_blank"
                        >
                          <span class="text-sm dotted-text">
                            Cục y tế dự phòng
                          </span>
                        </a>
                      </div>
                      <div class="mt-2">
                        <fa :icon="['fas', 'map']" class="text-gray-600 mr-1" />
                        <a
                          href="http://bandocovid.yte.gov.vn/map"
                          target="_blank"
                        >
                          <span class="text-sm dotted-text">
                            Bản đồ Covid Việt Nam
                          </span>
                        </a>
                      </div>
                    </el-col>
                  </el-row>
                </el-card>
              </el-col>
            </el-row>
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
                    <div
                      v-if="message.body"
                      class="break-words whitespace-pre-line"
                    >
                      <span>{{ message.body }}</span>
                      <span
                        v-if="message.type === 2"
                        class="font-bold cursor-pointer"
                        @click="getAllSelectedService(message.id)"
                      >
                        Hiển thị
                      </span>
                    </div>
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
    <el-dialog
      title="Tất cả các dịch vụ theo tìm kiếm"
      :visible.sync="serviceDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="70%"
    >
      <el-table
        class="datatable"
        :data="allServices"
        border
        style="width: 100%;"
        max-height="450"
      >
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="thumbnail" label="Ảnh" width="180">
          <template slot-scope="scope">
            <img
              v-if="scope.row.thumbnail"
              :src="scope.row.thumbnail"
              alt="Map thumbnail"
              class="cursor-pointer"
              @click="getDetailService(scope.row.id)"
            />
            <img
              v-else
              :src="require('~/assets/img/no-img.jpg')"
              alt="Map thumbnail"
              class="cursor-pointer"
              @click="getDetailService(scope.row.id)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="Tên địa điểm">
          <template slot-scope="scope">
            <span
              class="break-words whitespace-pre-line"
              style="word-break: break-word;"
            >
              {{ scope.row.title }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="location.name" label="Khu vực" width="180">
          <template slot-scope="scope">
            <span
              class="break-words whitespace-pre-line"
              style="word-break: break-word;"
            >
              {{ scope.row.location.name }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="category.title" label="Loại dịch vụ">
          <template slot-scope="scope">
            <span
              class="break-words whitespace-pre-line"
              style="word-break: break-word;"
            >
              {{ scope.row.category.title }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
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
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
