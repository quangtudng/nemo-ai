<template>
  <el-upload
    ref="upload"
    class="excel-upload mt-3"
    drag
    action="#"
    list-type="text"
    :auto-upload="false"
    :file-list="fileList"
    :on-change="handleChange"
    :before-upload="handleBeforeUpload"
  >
    <el-button
      class="bg-gray-200 text-theme-1 hover:bg-gray-300 shadow border-none"
      size="small"
    >
      <em class="el-icon-folder-opened text-base" />
      <span>Upload</span>
    </el-button>
  </el-upload>
</template>
<script>
export default {
  props: {
    maxSize: {
      type: Number,
      default: 2,
    },
  },
  data() {
    return {
      types: [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ],
      fileList: [],
    }
  },
  methods: {
    handleBeforeUpload(file) {
      const isSizeValid = file.size / 1048576 < this.maxSize
      const isFileValid = this.types && this.types.includes(file.raw.type)
      const supportedFile = this.types?.join() || ''
      if (!isFileValid) {
        this.$message.error(`File not supported (Supported: ${supportedFile})`)
        this.fileList = []
      }
      if (!isSizeValid) {
        this.$message.error(this.$t('validate.file.size') + this.maxSize + 'Mb')
        this.fileList = []
      }
      return isSizeValid && isFileValid
    },
    handleChange(file, fileList) {
      if (this.handleBeforeUpload(file)) {
        this.$emit('my-file-uploader-change', fileList)
        this.fileList = []
      }
    },
  },
}
</script>
<style lang="scss">
.excel-upload {
  .el-upload {
    .el-upload-dragger {
      border: none;
    }
  }
}
</style>
