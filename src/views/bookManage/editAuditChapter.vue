<template>
  <div id="website-setting">
    <h3>{{ status == 1 ? "编辑章节" : "章节审核" }}</h3>
    <el-form
      ref="dataForm"
      :model="form"
      label-width="100px"
      style="width: 90%;"
    >
      <!-- <el-row :gutter="0">
        <el-col :xs="24" :sm="24" :lg="24"> -->
      <el-form-item label="小说名:">
        <el-input v-model="bookName" readonly />
      </el-form-item>
      <el-form-item label="章节标题">
        <el-input v-model="form.Title" />
      </el-form-item>
      <el-form-item label="作者寄语">
        <el-input v-model="form.Note" type="textarea" :rows="4" />
      </el-form-item>
      <el-form-item label="收费方式:">
        <el-radio-group v-model="form.defaultSell">
          <el-radio :label="1">免费</el-radio>
          <el-radio :label="0">收费</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="status == 'update'" label="排序">
        <el-input v-model="form.Sortid" />
      </el-form-item>
      <el-form-item v-if="Columnx == 1" label="章节内容">
        <el-input v-model="form.Content" type="textarea" :rows="20" />
      </el-form-item>
      <el-form-item v-if="Columnx == 3" label="漫画内容">
        <el-upload
          :on-success="handleAvatarSuccess"
          action="admin/uploadImg"
          list-type="picture-card"
          :on-remove="handleRemove"
          :file-list="fileList"
          :on-preview="handlePictureCardPreview"
        >
          <i class="el-icon-plus" />
        </el-upload>
      </el-form-item>
      <!-- </el-col>
      </el-row> -->

      <el-form-item>
        <el-button
          v-if="status == 1"
          type="primary"
          @click="updateC"
        >确认编辑</el-button>
        <el-button
          v-if="status == 2"
          type="primary"
          @click="auditC"
        >审核</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import {
  updateAuditChapter,
  getChapterAuditContent,
  toAuditChapter
} from '@/api/book'
export default {
  name: 'AddChapter',
  components: {},
  props: {},
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      form: {
        Title: '',
        Note: '',
        Content: '',
        defaultSell: '',
        Sortid: ''
      },
      bookId: '',
      Columnx: 1,
      bookName: '',
      Chapterid: '',
      Content: [],
      fileList: [],
      status: 1
    }
  },
  computed: {},
  watch: {},
  created() {
    this.bookId = this.$route.query.id
    this.Columnx = this.$route.query.Columnx
    this.bookName = this.$route.query.bookName
    this.status = this.$route.query.status
    const _d = {}
    _d.ChapterId = this.$route.query.ChapterId
    getChapterAuditContent(_d).then(res => {
      this.form.Content = res.data.Content
      if (this.Columnx == 3) {
        this.Content = res.data.Content.split(',')
        this.Content.forEach((item, index) => {
          this.fileList.push({
            name: index,
            url: 'http://' + this.$store.getters.domain + item,
            id: index
          })
        })
      }
      this.form.defaultSell = res.chapterData.Sell
      this.form.Title = res.chapterData.Title
      this.form.Note = res.chapterData.Note
      this.form.ChapterId = res.chapterData.ID
      this.form.Sortid = res.chapterData.Sortid
    })
  },
  mounted() {},
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleAvatarSuccess(res, file) {
      const str = res.url
      this.Content.push(str)
    },
    getIndex(arr, item) {
      for (var i in arr) {
        if (arr[i] == item) {
          return i
        }
      }
    },
    handleRemove(file, fileList) {
      if (file.response) {
        const str = file.response.url
        const index = this.getIndex(this.Content, str)
        this.Content.splice(index, 1)
      } else {
        let str = file.url
        str = '/upload' + str.match(/upload(\S*)/)[1]
        const index = this.getIndex(this.Content, str)
        this.Content.splice(index, 1)
      }
    },
    updateC() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = this.form
          tempData.BookId = this.bookId
          if (this.Columnx == 3) {
            tempData.Content = this.Content.join(',')
          }
          updateAuditChapter(tempData).then(res => {
            if (res.status == 'S') {
              this.$notify({
                title: 'Success',
                message: '编辑成功',
                type: 'success',
                duration: 1000
              })
              const query = {}
              query.id = this.bookId
              query.Columnx = this.Columnx
              query.bookName = this.bookName
              this.$router.push({
                path: 'chapterAuditLists',
                query
              })
            } else {
              this.$notify({
                title: 'Error',
                message: res.message,
                type: 'warning',
                duration: 1000
              })
            }
          })
        }
      })
    },
    auditC() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = this.form
          tempData.BookId = this.bookId
          if (this.Columnx == 3) {
            tempData.Content = this.Content.join(',')
          }
          tempData.type = 'chapterid'
          toAuditChapter(tempData).then(res => {
            if (res.code == 0) {
              this.$notify({
                title: 'Success',
                message: '审核成功',
                type: 'success',
                duration: 1000
              })
              const query = {}
              query.id = this.bookId
              query.Columnx = this.Columnx
              query.bookName = this.bookName
              this.$router.push({
                path: 'chapterAuditLists',
                query
              })
            } else {
              this.$notify({
                title: 'Error',
                message: res.msg,
                type: 'warning',
                duration: 1000
              })
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
#website-setting {
  width: 100%;
  padding: 20px;
  h3 {
    color: #304156;
    padding: 10px 0 30px 20px;
    border-bottom: 1px solid #eee;
    margin: 0;
    margin-bottom: 40px;
    font-size: 24px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 160px;
    line-height: 160px;
    text-align: center;
  }
  .avatar {
    width: 120px;
    height: 160px;
    display: block;
  }
}
.el-upload-list--picture-card .el-upload-list__item-thumbnail {
  height: auto !important;
}
</style>
