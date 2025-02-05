<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="success"
        icon="el-icon-download"
        plain
        @click="importTemplate"
      >下载导入模版</el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
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
      <el-table-column label="ID" prop="id" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.ID }}</span>
        </template>
      </el-table-column>
      <el-table-column label="渠道名" align="center">
        <template slot-scope="{ row }">
          <span class="link-type" @click="toDetails(row)">{{ row.Name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            size="mini"
            type="primary"
            plain
            @click="bulkImport(row)"
          >导入</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 10"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog
      v-el-drag-dialog
      title="导入小说"
      :visible.sync="dialogFormVisible1"
      class="task-dialog"
    >
      <el-form
        ref="dataForm1"
        :model="temp1"
        label-position="left"
        label-width="120px"
        style="width: 80%; margin-left:50px;"
      >
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
            style="margin: 10px 0 10px 0;"
            type="primary"
            icon="el-icon-upload2"
            plain
          >点击上传</el-button>
        </el-upload>
      </el-form>
      <div class="guide">
        <h4>导入说明</h4>
        <p>1. 下载导入模板</p>
        <p>2. 按照导入模板填写数据</p>
        <p>
          3. 填写导入文件
          <span class="exp">(例子: 1小说名)</span>
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
              <el-input v-model="row.Title" size="small" />
            </template>
            <span v-else>{{ row.Title }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="小说id" prop="id" align="center">
          <template slot-scope="{ row }">
            <template v-if="row.edit">
              <el-input v-model="row.book_id" size="small" />
            </template>
            <span v-else>{{ row.book_id }}</span>
          </template>
        </el-table-column> -->
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
          width="300"
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取消</el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="sureExport"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getChannelData, editChannel, doPushImport } from '@/api/channel'
import { testingExcel, addExcelError } from '@/api/export'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Channeltask',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const StatusMap = ['未处理', '已处理']
      return StatusMap[status]
    }
  },
  data() {
    return {
      dialogFormVisible1: false,
      loading: false,
      multipleSelection: [],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      dialogFormVisible: false,
      url: '',
      fileList: [],
      temp1: {
        fileList: []
      },
      hasErr: false,
      listdata: [],
      push_id: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    toDetails(row) {
      this.$router.push({
        path: 'channelExportList',
        query: { field: row.Field }
      })
    },

    cancelEdit(row) {
      row.Title = row.originalTitle
      // row.book_id = row.originalBookId;
      row.edit = false
    },
    upload(row) {
      const _d = {}
      _d.data = {}
      // _d.data.book_id = row.book_id;
      _d.data.Title = row.Title
      _d.line = row.line
      _d.url = this.url
      _d.type = 'push'
      _d.push_id = this.push_id
      addExcelError(_d).then(res => {
        if (res.code == 0) {
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
    importTemplate() {
      this.downloadLoading = true
      window.location.href =
        'http://' + this.$store.getters.domainExport + '/admin/pushTemplate'
      this.downloadLoading = false
    },
    sureExport() {
      this.loading = true
      const _d = {}
      _d.push_id = this.push_id
      _d.url = this.url
      doPushImport(_d).then(res => {
        if (res.status == 'S') {
        } else {
          setTimeout(() => {
            this.$notify({
              title: 'Success',
              message: '导入成功',
              type: 'success',
              duration: 1000
            })
          }, 5000)
        }
        this.loading = false
        this.dialogFormVisible1 = false
        this.fileList = []
        this.getList()
      })
    },
    beforeAvatarUpload(file, fileList) {
      const str = file.name
      const xls = str.indexOf('xls') != -1
      const xlsx = str.indexOf('xlsx') != -1
      if (!xls && !xlsx) {
        this.$message.error('上传文件只能是 xls/xlsx 格式!')
      }
      return xls
    },
    handleSuccess(file, fileList) {
      this.url = file.url
      if (file.code == 0) {
        const _d = {}
        _d.type = 'push'
        _d.url = file.url
        _d.push_id = this.push_id
        testingExcel(_d).then(res => {
          if (res.code == 1) {
            this.hasErr = true
            const items = res.data
            this.listdata = items.map((v, i) => {
              this.$set(v, 'edit', false)
              this.$set(v, 'index', i)
              this.$set(v, 'status', 0)
              v.originalTitle = v.Title
              // v.originalBookId = v.book_id;
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
    bulkImport(row) {
      // this.resetTemp();
      this.push_id = row.ID
      this.dialogFormVisible1 = true
      this.$nextTick(() => {
        this.$refs['dataForm1'].clearValidate()
      })
    },
    update() {
      this.loading = true
      const _d = {}

      if (this.form.type == 0) {
        this.form.date = 1
      }
      if (this.form1.type == 0) {
        this.form1.date = 1
      }
      _d[1] = this.form
      _d[2] = this.form1
      updateScheduledTasks(_d).then(res => {
        if (res.code == 0) {
          this.$notify({
            title: 'Success',
            message: '更新成功',
            type: 'success',
            duration: 1000
          })
          this.dialogFormVisible = false
          this.getTask()
        } else {
          this.$notify({
            title: 'Error',
            message: res.msg,
            type: 'warning',
            duration: 1000
          })
        }
        this.loading = false
        this.getList()
      })
    },
    getList() {
      this.listLoading = true
      getChannelData(this.listQuery).then(res => {
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
    }
  }
}
</script>
<style lang="scss">
.task-dialog .el-dialog {
  width: 80% !important;
}
.task-dialog .el-dialog__body {
  padding-top: 20px !important;
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
</style>
