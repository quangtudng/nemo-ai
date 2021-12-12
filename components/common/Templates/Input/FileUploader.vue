<template>
  <span>
    <el-upload
      ref="upload"
      drag
      action="#"
      :class="{
        'limit-reached': limitReached,
      }"
      list-type="picture-card"
      :auto-upload="false"
      :file-list="fileList"
      :on-change="handleChange"
      :before-upload="handleBeforeUpload"
      :limit="limit"
      :multiple="limit > 1"
      :on-exceed="handleExceed"
    >
      <em slot="default" class="el-icon-plus"></em>
      <div slot="file" slot-scope="{ file }">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <em class="el-icon-zoom-in"></em>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file, fileList)"
          >
            <em class="el-icon-delete"></em>
          </span>
        </span>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </span>
</template>
<script>
export default {
  model: {
    prop: 'fileList',
    event: 'my-file-uploader-change',
  },
  props: {
    fileList: {
      type: Array,
      default() {
        return []
      },
    },
    types: {
      type: Array,
      default() {
        return ['image/jpeg', 'image/png']
      },
    },
    limit: {
      type: Number,
      default: 1,
    },
    maxSize: {
      type: Number,
      default: 2,
    },
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
    }
  },
  computed: {
    limitReached() {
      return this.fileList.length === this.limit
    },
  },
  methods: {
    handleBeforeUpload(file) {
      const isSizeValid = file.size / 1048576 < this.maxSize
      const isFileValid = this.types && this.types.includes(file.raw.type)
      const supportedFile = this.types?.join() || ''
      if (!isFileValid) {
        setTimeout(() => {
          this.$message.error(
            `${this.$t('validation.file_not_supported')} (${supportedFile})`
          )
        }, 100)
        this.handleRemove(file)
      }
      if (!isSizeValid) {
        setTimeout(() => {
          this.$message.error(
            `${this.$t('validation.file_size_too_large')} (${this.maxSize}Mb)`
          )
        }, 100)
        this.handleRemove(file)
      }
      return isSizeValid && isFileValid
    },
    handleChange(file, fileList) {
      if (this.handleBeforeUpload(file)) {
        this.$emit('my-file-uploader-change', fileList)
      }
    },
    // Not using the el-upload on-remove hook
    // This is a self-handled event
    handleRemove(file) {
      this.$refs.upload.uploadFiles = this.$refs.upload.uploadFiles.filter(
        (image) => {
          return image !== file
        }
      )
      this.$emit('my-file-uploader-change', this.$refs.upload.uploadFiles)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleExceed(files, fileList) {
      setTimeout(() => {
        this.$message.error(
          `${this.$t('validation.file_limit_reached')}: ${this.limit} file`
        )
      }, 100)
    },
  },
}
</script>
<style lang="scss">
.limit-reached {
  .el-upload--picture-card {
    display: none;
  }
  .el-upload-list--picture-card .el-upload-list__item {
    margin: auto;
  }
}
</style>
