<template>
  <div id="website-setting">
    <h3>小说导入</h3>
    <div class="btn-group">
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >下载模版</el-button>
      <el-button
        v-waves
        class="filter-item"
        type="danger"
        icon="el-icon-info"
        plain
        style="float:right"
        @click="toLogs"
      >查看日志</el-button>
      <el-button
        v-waves
        class="filter-item"
        type="success"
        icon="el-icon-upload"
        plain
        :loading="downloadLoading"
        @click="sureExport"
      >确认导入</el-button>
      <!--
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-upload"
        @click="handleFilter"
        plain
        >确认导入</el-button
      > -->
      <el-upload
        class="upload-demo"
        action="admin/uploadExcel"
        :on-remove="handleRemove"
        :limit="1"
        :on-exceed="handleExceed"
        :file-list="fileList"
        :on-success="handleSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <el-button
          class="filter-item"
          style="margin-top: 10px;"
          type="primary"
          icon="el-icon-upload2"
          plain
        >点击上传</el-button>
      </el-upload>
    </div>
    <div class="guide">
      <h4>导入说明</h4>
      <p>1.  下载导入模板</p>
      <p>2. 按照导入模板填写小说数据</p>
      <p>
        3. 填写导入文件
        <span
          class="exp"
        >(列子：1小说名（测试小说）2作者笔名（蝴蝶糖）3分类名（现代言情）4是否收费（是）5是否完本（是）6频道（女频）)</span>
      </p>
      <p>4. 上传导入文件</p>
      <p>5. 执行导入</p>
    </div>
    <el-table
      v-show="hasErr"
      :key="tableKey"
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
      <el-table-column label="小说名" prop="id" align="center">
        <template slot-scope="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.title" size="small" />
          </template>
          <span v-else>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作者" prop="id" align="center">
        <template slot-scope="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.author" size="small" />
          </template>
          <span v-else>{{ row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="id" align="center">
        <template slot-scope="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.book_class" size="small" />
          </template>
          <span v-else>{{ row.book_class }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否收费" prop="id" align="center">
        <template slot-scope="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.sell" size="small" />
          </template>
          <span v-else>{{ row.sell }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否完本" prop="id" align="center">
        <template slot-scope="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.full" size="small" />
          </template>
          <span v-else>{{ row.full }}</span>
        </template>
      </el-table-column>
      <el-table-column label="频道" prop="id" align="center">
        <template slot-scope="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.gender" class="edit-input" size="small" />
          </template>
          <span v-else>{{ row.gender }}</span>
        </template>
      </el-table-column>
      <el-table-column label="错误内容" align="center">
        <template slot-scope="scope">
          <span style="color:red">{{ scope.row.mes }}</span>
        </template>
      </el-table-column>
      <el-table-column label="行号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.line }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status | statusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            size="mini"
            type="primary"
            @click="row.edit = !row.edit"
          >编辑</el-button>
          <el-button
            size="mini"
            type="primary"
            plain
            @click="upload(row)"
          >上传</el-button>
          <el-button
            v-if="row.edit"
            class="cancel-btn"
            size="mini"
            type="warning"
            @click="cancelEdit(row)"
          >
            取消
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { bookAuditImportDo } from '@/api/book'
import { testingExcel, addExcelError } from '@/api/export'
import waves from '@/directive/waves' // waves directive
export default {
  name: 'ExportAuthor',
  components: {},
  directives: { waves },
  filters: {
    statusFilter(status) {
      const StatusMap = ['未处理', '已处理']
      return StatusMap[status]
    }
  },
  props: {},
  data() {
    return {
      tableKey: 0,
      listdata: [],
      fileList: [],
      downloadLoading: false,
      url: '',
      hasErr: false
    }
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    upload(row) {
      const _d = {}
      _d.data = {}
      _d.data.title = row.title
      _d.data.author = row.author
      _d.data.book_class = row.book_class
      _d.data.sell = row.sell
      _d.data.full = row.full
      _d.data.gender = row.gender
      _d.line = row.line
      _d.url = this.url
      _d.type = 'book'
      addExcelError(_d).then(res => {
        if (res.code === 0) {
          row.edit = false
          this.listdata[row.index].status = 1
        } else {
          this.$notify({
            title: 'Error',
            message: res.msg,
            type: 'warning',
            duration: 1000
          })
        }
      })
    },
    cancelEdit(row) {
      row.title = row.originalTitle
      row.author = row.originalAuthor
      row.book_class = row.originalBookClass
      row.sell = row.originalSell
      row.full = row.originalFull
      row.gender = row.originalGender
      row.edit = false
    },
    toLogs() {
      this.$router.push('bookLogLists')
    },
    sureExport() {
      this.downloadLoading = true
      const _d = {}
      _d.url = this.url
      bookAuditImportDo(_d).then(res => {
        if (res.status === 'S') {
          this.$notify({
            title: 'Success',
            message: '导入成功',
            type: 'success',
            duration: 1000
          })
          this.fileList = []
          this.listdata = []
        } else {
          this.$notify({
            title: 'Error',
            message: res.message,
            type: 'warning',
            duration: 1000
          })
        }
        this.downloadLoading = false
      })
    },
    beforeAvatarUpload(file, fileList) {
      const str = file.name
      const xls = str.indexOf('xls') !== -1
      const xlsx = str.indexOf('xlsx') !== -1
      if (!xls && !xlsx) {
        this.$message.error('上传图片只能是 xls/xlsx 格式!')
      }
      return xls
    },
    handleSuccess(file, fileList) {
      this.url = file.url
      if (file.code === 0) {
        const _d = {}
        _d.type = 'book'
        _d.url = file.url
        testingExcel(_d).then(res => {
          if (res.code === 1) {
            this.hasErr = true
            const items = res.data
            this.listdata = items.map((v, i) => {
              this.$set(v, 'edit', false)
              this.$set(v, 'index', i)
              this.$set(v, 'status', 0)
              v.originalTitle = v.title
              v.originalAuthor = v.author
              v.originalBookClass = v.book_class
              v.originalSell = v.sell
              v.originalFull = v.full
              v.originalGender = v.gender
              return v
            })

            this.fileList = []
          } else {
            this.url = file.url
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
    handleFilter() {},
    handleDownload() {
      this.downloadLoading = true
      window.location.href =
        'http://' +
        this.$store.getters.domainExport +
        '/admin/bookaudit/template'
      this.downloadLoading = false
    },
    download(url) {
      var iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      iframe.src = url
      document.body.appendChild(iframe)
    },
    onSubmit() {
      console.log('submit!')
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
    padding: 20px 0 40px 20px;
    border-bottom: 1px solid #eee;
    margin: 0;
    margin-bottom: 40px;
    font-size: 24px;
  }
  .guide {
    color: #304156;
    padding-left: 20px;
    margin-bottom: 20px;
    h4 {
      font-size: 18px;
    }
    p {
      font-size: 16px;
      padding-left: 20px;
    }
    .exp {
      font-size: 14px;
      color: #376daf;
      padding-left: 20px;
    }
  }
  .btn-group {
    padding-left: 40px;
  }
}
</style>
