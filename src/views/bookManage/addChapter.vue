<template>
  <div id="website-setting">
    <h3>新增待审核章节</h3>
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
        <el-button type="primary" @click="addC()">确认</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { addAuditChapter, getChapterTitle } from '@/api/book'
export default {
  name: 'AddChapter',
  components: {},
  props: {},
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      textMap: {
        update: '编辑章节',
        create: '新增章节'
      },
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
      fileList: []
    }
  },
  computed: {},
  watch: {},
  created() {
    this.bookId = this.$route.query.id
    this.Columnx = this.$route.query.Columnx
    this.bookName = this.$route.query.bookName
    const _d = {}
    _d.BookId = this.$route.query.id
    getChapterTitle(_d).then(res => {
      this.form.Title = res.Title
      this.form.defaultSell = res.defaultSell
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
    addC() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = this.form
          tempData.BookId = this.bookId
          if (this.Columnx == 3) {
            tempData.Content = this.Content.join(',')
          }
          addAuditChapter(tempData).then(res => {
            if (res.status == 'S') {
              this.$notify({
                title: 'Success',
                message: '新增成功',
                type: 'success',
                duration: 1000
              })
              // http://localhost:9527/#/bookManage/chapterAuditLists?id=726&Columnx=1&bookName=adssd
              this.$router.push({
                path: 'chapterAuditLists',
                query: {
                  id: this.bookId,
                  Columnx: this.Columnx,
                  bookName: this.bookName
                }
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
