<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.Title"
        placeholder="请输入书名"
        style="width: 200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.ID"
        placeholder="请输入ID"
        style="width: 200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.class_id"
        placeholder="选择分类"
        clearable
        class="filter-item"
        style="width: 120px"
        @keyup.enter.native="search"
      >
        <el-option
          v-for="item in classLists"
          :key="item.ID"
          :label="item.ClassName"
          :value="item.ID"
        />
      </el-select>
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
        @click="handleCreate"
      >新增小说</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="success"
        plain
        @click="toSort"
      >分类</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="success"
        plain
        @click="toTag"
      >标签</el-button>
      <el-button
        v-waves
        class="filter-item"
        type="danger"
        icon="el-icon-warning-outline"
        plain
        @click="log"
      >日志</el-button>
      <el-button
        v-waves
        class="filter-item"
        type="danger"
        icon="el-icon-delete"
        @click="batchRemove"
      >批量删除</el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item fright"
        type="primary"
        icon="el-icon-download"
        plain
        @click="handleDownload"
      >导出</el-button>
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
      <el-table-column
        label="小说名"
        min-swidth="200px"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span class="link-type" @click="toBookDetails(scope.row)">{{
            scope.row.Title
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="最新章节"
        min-width="120px"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          <span>{{ row.last_chapter_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分类" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.class_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="章节" align="center">
        <template slot-scope="{ row }">
          <span class="link-type" @click="toChapterLists(row)">{{
            row.Chapter
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作者" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.Penname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="字数" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.Words }}</span>
        </template>
      </el-table-column>
      <el-table-column label="完本" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.Full | FullFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收费" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.Sell | SellFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入库->更新" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.Ptime | timeFilter }}</span><span style="font-weight:800;color:#337ab7">-></span><span>{{ row.Ltime | timeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="300"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            size="mini"
            type="success"
            plain
            class="super-mini"
            @click="addChapter(row)"
          >新增</el-button>
          <el-button
            size="mini"
            type="primary"
            plain
            class="super-mini"
            @click="handleImport(row)"
          >导入</el-button>
          <el-button
            size="mini"
            type="primary"
            class="super-mini"
            @click="handleUpdate(row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="primary"
            class="super-mini"
            plain
            @click="exportOne(row)"
          >
            导出</el-button>
          <el-button
            size="mini"
            type="danger"
            class="super-mini"
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
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      class="book-lists-dialog"
      @opened="handleOpened"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 90%; margin-left:50px;"
      >
        <el-row :gutter="40">
          <el-col :xs="7" :sm="7" :lg="7">
            <el-form-item label="小说名:" prop="Title">
              <el-input v-model="temp.Title" />
            </el-form-item>
            <el-form-item label="作者:" prop="Uid">
              <el-select
                v-model="temp.Uid"
                placeholder="选择作者"
                clearable
                class="filter-item"
                style="width: 120px"
                :filter-method="getAuthor"
                filterable
              >
                <el-option
                  v-for="(item, index) in authorLists"
                  :key="index"
                  :label="item.Penname"
                  :value="item.Uid"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="小说封面">
              <el-upload
                class="avatar-uploader"
                action="admin/uploadSmallImg"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload1"
              >
                <img
                  v-if="temp.Coverimg"
                  :src="'http://' + $store.getters.domain + temp.Coverimg"
                  class="avatar"
                >
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
              <p>注：图片尺寸为600*800，不能超过10M.</p>
            </el-form-item>
          </el-col>
          <el-col :xs="7" :sm="7" :lg="7">
            <el-form-item label="类型:">
              <el-radio-group v-model="temp.Columnx">
                <el-radio :label="1">普通小说</el-radio>
                <el-radio :label="3">漫画</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="版权:">
              <el-radio-group v-model="temp.copyright">
                <el-radio :label="0">信息网络传播权</el-radio>
                <el-radio :label="1">其他</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="驻站:">
              <el-radio-group v-model="temp.Exclusive">
                <el-radio :label="0" :disabled="isDisabled">是</el-radio>
                <el-radio :label="1" :disabled="isDisabled">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="单本推送:">
              <el-radio-group v-model="temp.is_personal">
                <el-radio :label="0" :disabled="isDisabled">否</el-radio>
                <el-radio :label="1" :disabled="isDisabled">是</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="收费方式:">
              <el-radio-group v-model="temp.SellType">
                <el-radio :label="1" :disabled="isDisabled">按章</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="收费:">
              <el-radio-group v-model="temp.Sell">
                <el-radio :label="0" :disabled="isDisabled">是</el-radio>
                <el-radio :label="1" :disabled="isDisabled">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="完本:">
              <el-radio-group v-model="temp.Full">
                <el-radio :label="1" :disabled="isDisabled">是</el-radio>
                <el-radio :label="0" :disabled="isDisabled">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="频道:">
              <el-radio-group v-model="temp.Gender">
                <el-radio :label="1" @change="changeGender(1)">女频</el-radio>
                <el-radio :label="2" @change="changeGender(2)">男频</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="分类:">
              <el-select
                v-model="temp.Sid"
                placeholder="请选择分类"
                clearable
                class="filter-item"
                style="width: 200px"
              >
                <el-option
                  v-for="(item, index) in classLists"
                  :key="index"
                  :label="item.ClassName"
                  :value="item.ID"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="10" :sm="10" :lg="10">
            <el-form-item label="标签:">
              <el-checkbox-group v-model="temp.Tags">
                <el-checkbox
                  v-for="(item, index) in tagLists"
                  :key="index"
                  :label="item.ID"
                  name="type"
                >{{ item.ClassName }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="一句话描述:" prop="Brief">
              <el-input
                v-model="temp.Brief"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="详细描述:" prop="Description">
              <el-input
                v-model="temp.Description"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          :loading="loading"
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >确认</el-button>
      </div>
    </el-dialog>

    <el-dialog
      v-el-drag-dialog
      :visible.sync="dialogimportVisible"
      title="章节导入"
    >
      <el-form
        ref="dataFormImport"
        :model="importTemp"
        label-position="left"
        label-width="100px"
        style="width: 90%; margin-left:50px;"
      >
        <el-form-item label="小说名:">
          <el-input v-model="importTemp.Title" readonly />
        </el-form-item>
        <el-form-item label="导入:">
          <el-upload
            class="upload-demo"
            action="admin/uploadText"
            :on-remove="handleRemove"
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="fileList"
            :on-success="handleSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <el-button
              class="filter-item"
              type="primary"
              icon="el-icon-upload2"
              plain
            >点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="导入说明">
          <p style="margin:0;">
            1. 下载notepad++。下载地址:
            <a
              href="https://www.cr173.com/down.asp?id=2907"
              target="_blank"
              style="color:#337ab7"
            >https://www.cr173.com/down.asp?id=2907</a>
            。
          </p>
          <p style="margin:0;">
            2. 打开软件，将需要处理的txt文本拖入软件，等待编辑
          </p>
          <p style="margin:0;">
            3. 打开软件，将需要处理的txt文本拖入软件，等待编辑
          </p>
          <p style="margin:0;">
            4. 依次点击notepad++菜单栏里的--->编码-->转为UTF-8无BOM格式编码
          </p>
          <p style="margin:0;">5. 使用快捷键Ctrl+S保存编辑后的txt文本</p>
        </el-form-item>
      </el-form>
      <el-table
        v-show="hasErr"
        :key="tableKey1"
        :data="listdata"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
        />
        <el-table-column label="章节名" prop="id" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="错误内容" align="center">
          <template slot-scope="scope">
            <span style="color:red">{{ scope.row.mes }}</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogimportVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="loading"
          :disabled="hasErr"
          @click="sureExport"
        >确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getBook,
  addBook,
  updateBook,
  delBook,
  getTag,
  bookImportDo,
  bookExport
} from '@/api/book'
import { category } from '@/api/data'
import { getAuthor } from '@/api/author'
import { testingTxt } from '@/api/export'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import moment from 'moment'
export default {
  name: 'BookLists',
  components: { Pagination },
  directives: { waves },
  filters: {
    timeFilter(time) {
      return moment(time).format('YY-MM-DD')
    },
    FullFilter(Full) {
      const FullMap = ['连载', '完本']
      return FullMap[Full]
    },
    SellFilter(Sell) {
      const SellMap = ['收费', '免费']
      return SellMap[Sell]
    }
  },
  data() {
    return {
      listdata: [],
      loading: false,
      fileList: [],
      isDisabled: false,
      classLists: [],
      authorLists: [],
      tagLists: [],
      tableKey: 0,
      tableKey1: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      temp: {
        Title: '',
        Uid: '',
        copyright: 0,
        Sell: 0,
        Full: 1,
        Exclusive: 0,
        SellType: 1,
        Gender: 1,
        Exclusive: 0,
        Tags: [],
        Coverimg: '',
        Words: 0,
        Sid: '',
        Brief: '',
        Description: '',
        Columnx: 1,
        is_personal: 0
      },
      importTemp: {
        Title: '',
        url: '',
        bookId: '',
        sortId: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑小说',
        create: '新增小说'
      },
      dialogimportVisible: false,
      pvData: [],
      rules: {
        Title: [{ required: true, message: '请输入小说名', trigger: 'blur' }],
        Uid: [{ required: true, message: '请选择作者', trigger: 'blur' }],
        Description: [
          { required: true, message: '请输入一句话描述', trigger: 'blur' }
        ],
        Brief: [{ required: true, message: '请输入详细描述', trigger: 'blur' }]
      },
      downloadLoading: false,
      Sid: 0,
      ids: [],
      hasErr: false
    }
  },
  watch: {
    temp: {
      handler(newValue) {
        if (newValue.copyright == 1) {
          this.isDisabled = true
        } else {
          this.isDisabled = false
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.getList()
    this.getCategory()
    this.getAuthor()
    this.getTagLists()
  },
  methods: {
    handleOpened() {
      this.$refs.corporationDialog.$el.scrollTop = 0
    },
    changeGender(id) {
      this.Sid = id
      this.temp.Sid = ''
      this.getCategory()
    },
    exportOne(row) {
      window.location.href =
        'http://' +
        this.$store.getters.domainExport +
        `/admin/book/exportOne?book_id=${row.ID}`
    },
    toBookDetails(row) {
      window.open(
        'http://www.ziycw.com' + `/#/BookDetails?bookId=${row.ID}`,
        '_blank'
      )
    },
    handleDownload() {
      // this.downloadLoading = true;
      // let _d = this.listQuery;
      // _d.ids = this.ids;
      // bookExport(_d).then(res => {
      //   this.download(res.url);
      //   this.downloadLoading = false;
      // });
      // /admin/book/export
      this.downloadLoading = true
      window.location.href =
        'http://' +
        this.$store.getters.domainExport +
        `/admin/book/export?Title=${this.listQuery.Title || ''}&class_id=${this
          .listQuery.class_id || ''}&ID=${this.listQuery.ID ||
          ''}&ids=${this.ids.join(',')}`
      this.downloadLoading = false
    },
    download(url) {
      var iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      iframe.src = url
      document.body.appendChild(iframe)
    },
    sureExport() {
      this.loading = true
      bookImportDo(this.importTemp).then(res => {
        if (res.code == 0) {
          this.$notify({
            title: 'Success',
            message: '导入成功',
            type: 'success',
            duration: 1000
          })
          this.$router.push('chapterAudit')
          this.fileList = []
          this.dialogimportVisible = false
        } else {
          this.$notify({
            title: 'Error',
            message: res.msg,
            type: 'warning',
            duration: 2000
          })
        }
        this.loading = false
      })
    },
    beforeAvatarUpload(file, fileList) {
      const str = file.name
      const txt = str.indexOf('txt') != -1
      if (!txt) {
        this.$message.error('上传文件只能是 txt 格式!')
      }
      return txt
    },
    handleSuccess(file, fileList) {
      if (file.code == 0) {
        const _d = {}
        _d.url = file.url
        testingTxt(_d).then(res => {
          if (res.code == 1) {
            this.hasErr = true
            this.listdata = res.data
            this.fileList = []
          } else if (res.code == 2) {
            this.$notify({
              title: 'Error',
              message: res.msg,
              type: 'warning',
              duration: 2000
            })
            this.importTemp.url = file.url
            this.hasErr = false
            this.listdata = []
          } else {
            this.$notify({
              title: 'Success',
              message: res.msg,
              type: 'success',
              duration: 2000
            })
            this.importTemp.url = file.url
            this.hasErr = false
            this.listdata = []
          }
        })
      } else {
        this.$notify({
          title: 'Error',
          message: file.msg,
          type: 'warning',
          duration: 1000
        })
      }
    },
    handleRemove(file, fileList) {},
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      const ids = []
      this.multipleSelection.map(item => {
        ids.push(item.ID)
      })
      this.ids = ids
    },
    // batchRemove
    batchRemove() {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const _d = {}
          _d.ids = this.ids
          delBook(_d).then(res => {
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
    // del
    toDel(item) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const _d = {}
          _d.ids = [item.ID]
          delBook(_d).then(res => {
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
    getTagLists() {
      getTag({ limit: 100, page: 1 }).then(res => {
        this.tagLists = res.data
      })
    },
    getAuthor(val) {
      const _d = {}
      _d.Penname = val
      _d.limit = 1000
      _d.page = 1
      getAuthor(_d).then(res => {
        this.authorLists = res.data
      })
    },
    getCategory() {
      const _d = {}
      _d.limit = 100
      _d.page = 1
      _d.Sid = this.Sid
      category(_d).then(res => {
        this.classLists = res.data
      })
    },
    handleAvatarSuccess(res, file) {
      this.temp.Coverimg = res.url
    },
    beforeAvatarUpload1(file) {
      // const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 10MB!')
      }
      return isLt2M
    },
    toChapterLists(row) {
      const query = {}
      query.id = row.ID
      query.Columnx = row.Columnx
      query.bookName = row.Title
      this.$router.push({
        path: 'ChapterLists',
        query
      })
    },
    addChapter(row) {
      const query = {}
      query.id = row.ID
      query.Columnx = row.Columnx
      query.status = 0
      query.bookName = row.Title
      this.$router.push({
        path: 'addChapter',
        query
      })
    },
    log() {
      this.$router.push('logLists')
    },
    toSort() {
      this.$router.push('sortLists')
    },
    toTag() {
      this.$router.push('tagLists')
    },
    getList() {
      this.listLoading = true
      getBook(this.listQuery).then(res => {
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
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        Title: '',
        Uid: '',
        copyright: 0,
        Sell: 0,
        Full: 1,
        Exclusive: 0,
        SellType: 1,
        Gender: 1,
        Exclusive: 0,
        Tags: [],
        Coverimg: '',
        Words: 0,
        Sid: '',
        Brief: '',
        Description: '',
        Columnx: 1,
        is_personal: 0
      }
      this.Sid = 1
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.getCategory()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.loading = true
          const tempData = Object.assign({}, this.temp)
          tempData.Tags = tempData.Tags.join(',')
          addBook(tempData).then(res => {
            if (res.status == 'S') {
              this.$notify({
                title: 'Success',
                message: '新增成功',
                type: 'success',
                duration: 1000
              })
            } else {
              this.$notify({
                title: 'Error',
                message: res.message,
                type: 'warning',
                duration: 1000
              })
            }
            this.loading = false
            this.getList()
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      if (row.Gender == 1) {
        this.Sid = 1
        this.getCategory()
      } else {
        this.Sid = 2
        this.getCategory()
      }
      const tagsCopy = this.temp.Tags.split(',')
      this.temp.Tags = tagsCopy.map((value, index) => {
        const val = Number(value)
        return val
      })
      this.temp.id = row.ID
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleImport(row) {
      this.dialogimportVisible = true
      this.importTemp.Title = row.Title
      this.importTemp.bookId = row.ID
      // this.importTemp.sortId = row.Sortid;
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.loading = true
          const tempData = Object.assign({}, this.temp)
          tempData.Tags = tempData.Tags.join(',')
          updateBook(tempData).then(res => {
            if (res.status == 'S') {
              this.$notify({
                title: 'Success',
                message: '编辑成功',
                type: 'success',
                duration: 1000
              })
            } else {
              this.$notify({
                title: 'Error',
                message: res.message,
                type: 'warning',
                duration: 1000
              })
            }
            this.loading = false
            this.getList()
            this.dialogFormVisible = false
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
.book-lists-dialog .el-dialog {
  width: 80% !important;
  margin-top: 10vh !important;
}
.el-col {
  border-left: 1px solid #eee;
  &:nth-of-type(1) {
    border-left: none;
  }
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
  width: 160px;
  height: 200px;
  line-height: 200px;
  text-align: center;
}
.avatar {
  width: 160px;
  min-height: 200px;
  display: block;
}
.super-mini {
  padding: 4px 0px !important;
  width: 40px !important;
}
</style>
