<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="请输入章节名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        plain
        @click="addChapter"
      >新增章节</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="danger"
        icon="el-icon-delete"
        @click="batchRemove"
      >批量删除</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="danger"
        icon="el-icon-delete"
        plain
        @click="allRemove"
      >全本删除</el-button>
    </div>

    <el-table
      ref="multipleTable"
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      />
      <el-table-column label="ID" prop="id" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.ID }}</span>
        </template>
      </el-table-column>
      <el-table-column label="小说名" min-swidth="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.book_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="章节名" min-width="120px" align="center">
        <template slot-scope="{ row }">
          <span class="link-type" @click="handleUpdate(row)">{{
            row.Title
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="字数" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.Words }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收费方式" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.Sell | SellFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" sortable="custom">
        <template slot-scope="{ row }">
          <span>{{ row.Sortid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.Dtime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        min-width="240"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            size="mini"
            type="primary"
            @click="handleUpdate(row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="toDel(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog
      ref="corporationDialog"
      v-el-drag-dialog
      title="章节编辑"
      :visible.sync="dialogForm1Visible"
      class="chapter-lists-dialog1"
      @opened="handleOpened"
      @close="fileList = []"
    >
      <el-form
        ref="formData"
        :model="form"
        label-width="100px"
        style="width: 96%; margin-left:50px;"
      >
        <el-row :gutter="40">
          <el-col :xs="12" :sm="12" :lg="12">
            <el-form-item label="小说名:">
              <el-input v-model="bookName" readonly />
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="12">
            <el-form-item label="章节标题">
              <el-input v-model="form.Title" />
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="12">
            <el-form-item label="作者寄语:">
              <el-input
                v-model="form.Note"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="12">
            <el-form-item label="收费方式:">
              <el-radio-group v-model="form.defaultSell">
                <el-radio :label="1">免费</el-radio>
                <el-radio :label="0">收费</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="排序:">
              <el-input v-model="form.Sortid" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item v-if="Columnx == 1" label="章节内容:">
          <el-input
            v-model="form.Content"
            type="textarea"
            :rows="20"
          />
        </el-form-item>
        <el-form-item v-if="Columnx == 3" label="漫画内容:">
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogForm1Visible = false">取消</el-button>
        <el-button
          v-if="status == 'edit'"
          :loading="loading"
          type="primary"
          @click="updateC"
        >确认</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import {
  getChapter,
  delChapter,
  updateChapter,
  getChapterContent,
  destroyChapterByBookId
} from '@/api/book'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'BookLists',
  components: { Pagination },
  directives: { waves },
  filters: {
    SellFilter(Sell) {
      const SellMap = ['收费', '免费']
      return SellMap[Sell]
    }
  },
  data() {
    return {
      multipleSelection: [],
      loading: false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        BookId: '',
        sort: 'asc'
      },
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogForm1Visible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [
          { required: true, message: 'type is required', trigger: 'change' }
        ],
        timestamp: [
          {
            type: 'date',
            required: true,
            message: 'timestamp is required',
            trigger: 'change'
          }
        ],
        title: [
          { required: true, message: 'title is required', trigger: 'blur' }
        ]
      },
      downloadLoading: false,
      bookId: '',
      Columnx: '',
      bookName: '',
      Content: [],
      fileList: [],
      dialogImageUrl: '',
      Chapterid: '',
      status: 'edit',
      dialogVisible: false,
      form: {
        Title: '',
        Note: '',
        Content: '',
        defaultSell: '',
        Sortid: ''
      },
      ids: []
    }
  },
  created() {
    this.listQuery.BookId = this.$route.query.id
    this.bookId = this.$route.query.id
    this.Columnx = this.$route.query.Columnx
    this.bookName = this.$route.query.bookName
    this.getList()
  },
  methods: {
    allRemove() {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const _d = {}
          _d.book_id = this.bookId
          destroyChapterByBookId(_d).then(res => {
            if (res.code == 0) {
              this.$notify({
                title: 'Success',
                message: '删除成功',
                type: 'success',
                duration: 1000
              })
              this.$router.push('bookLists')
            } else {
              this.$notify({
                title: 'Error',
                message: res.msg,
                type: 'warning',
                duration: 1000
              })
            }
          })
        })
        .catch(() => {
          this.$notify({
            title: 'Info',
            message: '已取消删除',
            type: 'info',
            duration: 1000
          })
        })
    },
    batchRemove() {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const _d = {}
          _d.ids = this.ids
          delChapter(_d).then(res => {
            if (res.code == 0) {
              this.$notify({
                title: 'Success',
                message: '删除成功',
                type: 'success',
                duration: 1000
              })
            } else {
              this.$notify({
                title: 'Error',
                message: res.msg,
                type: 'warning',
                duration: 1000
              })
            }
            this.getList()
          })
        })
        .catch(() => {
          this.$notify({
            title: 'Info',
            message: '已取消删除',
            type: 'info',
            duration: 1000
          })
        })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      const ids = []
      this.multipleSelection.map(item => {
        ids.push(item.ID)
      })
      this.ids = ids
    },
    sortChange() {
      if (this.listQuery.sort == 'desc') {
        this.listQuery.sort = 'asc'
      } else {
        this.listQuery.sort = 'desc'
      }
      this.handleFilter()
    },
    toDel(item) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const _d = {}
          _d.ids = [item.ID]
          delChapter(_d).then(res => {
            if (res.code == 0) {
              this.$notify({
                title: 'Success',
                message: '删除成功',
                type: 'success',
                duration: 1000
              })
            } else {
              this.$notify({
                title: 'Error',
                message: res.msg,
                type: 'warning',
                duration: 1000
              })
            }
            this.getList()
          })
        })
        .catch(() => {
          this.$notify({
            title: 'Info',
            message: '已取消删除',
            type: 'info',
            duration: 1000
          })
        })
    },
    addChapter() {
      const query = {}
      query.id = this.bookId
      query.Columnx = this.Columnx
      query.status = 0
      query.bookName = this.bookName
      this.$router.push({
        path: 'addChapter',
        query
      })
    },
    getList() {
      this.listLoading = true
      getChapter(this.listQuery).then(res => {
        if (res.code == 0) {
          this.list = res.data
          this.total = res.count
        } else {
          this.list = []
          this.total = 0
        }
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleOpened() {
      this.$refs.corporationDialog.$el.scrollTop = 0
    },
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
    handleUpdate(row) {
      this.status = 'edit'
      this.Content = ''
      const _d = {}
      _d.ChapterId = row.ID
      getChapterContent(_d).then(res => {
        this.form.Content = res.data.Content
        if (this.Columnx == 3) {
          this.Content = res.data.Content.split(',')
          this.Content.forEach((item, index) => {
            this.fileList.push({
              name: index,
              url: 'http://' + this.$store.getters.domain + item,
              // url: "http://172.27.38.163" + item,
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
      this.dialogForm1Visible = true
      this.$nextTick(() => {
        this.$refs['formData'].clearValidate()
      })
    },
    updateC() {
      this.$refs['formData'].validate(valid => {
        if (valid) {
          const tempData = this.form
          tempData.BookId = this.bookId
          if (this.Columnx == 3) {
            tempData.Content = this.Content.join(',')
          }
          updateChapter(tempData).then(res => {
            if (res.status == 'S') {
              this.$notify({
                title: 'Success',
                message: '编辑成功',
                type: 'success',
                duration: 1000
              })
              this.dialogForm1Visible = false
              this.getList()
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
.el-icon-close {
  color: rgb(221, 74, 74);
}
.el-icon-check {
  color: rgb(82, 168, 82);
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
.el-upload-list--picture-card .el-upload-list__item-thumbnail {
  height: auto !important;
}
.chapter-lists-dialog1 .el-dialog {
  width: 80% !important;
  margin-top: 4vh !important;
  overflow: hidden;
}
.chapter-lists-dialog1 .el-col {
  border-left: 0px solid #eee;
  &:nth-of-type(1) {
    border-left: none;
  }
  .next-line {
    // .el-form-item__label {
    //   float: none;
    // }
    .el-form-item__content {
      // margin-left: 0 !important;
      line-height: 20px;
    }
    // .content-copy {
    //   display: block;
    //   max-height: 500px;
    //   overflow-y: scroll;
    // }
  }
}
</style>
