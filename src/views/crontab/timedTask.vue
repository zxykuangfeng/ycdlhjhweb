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
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.Name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="周期" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.task_type | typeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日期" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.task_type == 0">/</span>
          <span v-if="scope.row.task_type == 1">{{
            weekLists[scope.row.task_date - 1].week
          }}</span>
          <span v-if="scope.row.task_type == 2">{{ scope.row.task_date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.task_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="章数" align="center">
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.task_num }}</span>
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
            @click="handleUpdate(row)"
          >编辑</el-button>
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
      title="渠道定时推送"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :model="form"
        label-position="left"
        label-width="100px"
        style="width: 80%; margin-left:50px;"
      >
        <el-form-item label="选择周期:">
          <el-radio-group v-model="form.task_type">
            <el-radio :label="0">每天</el-radio>
            <el-radio :label="1">每周</el-radio>
            <el-radio :label="2">每月</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.task_type == 1" label="选择日期:">
          <el-select v-model="form.task_date" placeholder="请选择">
            <el-option
              v-for="item in weekLists"
              :key="item.id"
              :label="item.week"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.task_type == 2" label="选择日期:">
          <el-select v-model="form.task_date" placeholder="请选择">
            <el-option
              v-for="item in monthLists"
              :key="item.id"
              :label="item.week"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="选择时间:">
          <el-time-picker
            v-model="form.task_time"
            :picker-options="{
              selectableRange: '00:00:00 - 23:59:59'
            }"
            placeholder="请选择时间"
            format="HH:mm"
            value-format="HH:mm"
          />
        </el-form-item>
        <el-form-item label="选择章数:">
          <el-input v-model="form.task_num" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="updateData"
        >确定</el-button>
      </div>
    </el-dialog>

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
          <span
            class="exp"
          >(例子: 1小说名 2周期 3日期 4时间 5章数)</span>
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
        <el-table-column label="周期" prop="id" align="center">
          <template slot-scope="{ row }">
            <template v-if="row.edit">
              <el-input v-model="row.time_type" size="small" />
            </template>
            <span v-else>{{ row.time_type }}</span>
          </template>
        </el-table-column>
        <el-table-column label="日期" prop="id" align="center">
          <template slot-scope="{ row }">
            <template v-if="row.edit">
              <el-input v-model="row.date" size="small" />
            </template>
            <span v-else>{{ row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column label="时间" prop="id" align="center">
          <template slot-scope="{ row }">
            <template v-if="row.edit">
              <el-input v-model="row.datetime" size="small" />
            </template>
            <span v-else>{{ row.datetime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="章数" prop="id" align="center">
          <template slot-scope="{ row }">
            <template v-if="row.edit">
              <el-input v-model="row.task_num" size="small" />
            </template>
            <span v-else>{{ row.task_num }}</span>
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
import { getChannelData, editChannel, doTaskImport } from '@/api/channel'
import { testingExcel, addExcelError } from '@/api/export'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Timetask',
  components: { Pagination },
  directives: { waves },
  filters: {
    typeFilter(type) {
      const typeMap = ['每天', '每周', '每月']
      return typeMap[type]
    },
    statusFilter(status) {
      const StatusMap = ['未处理', '已处理']
      return StatusMap[status]
    }
  },
  data() {
    return {
      dialogFormVisible1: false,
      weekLists: [
        { id: 1, week: '周一' },
        { id: 2, week: '周二' },
        { id: 3, week: '周三' },
        { id: 4, week: '周四' },
        { id: 5, week: '周五' },
        { id: 6, week: '周六' },
        { id: 7, week: '周七' }
      ],
      monthLists: [
        { id: 1, month: '1号' },
        { id: 2, month: '2号' },
        { id: 3, month: '3号' },
        { id: 4, month: '4号' },
        { id: 5, month: '5号' },
        { id: 6, month: '6号' },
        { id: 7, month: '7号' },
        { id: 8, month: '8号' },
        { id: 9, month: '9号' },
        { id: 10, month: '10号' },
        { id: 11, month: '11号' },
        { id: 12, month: '12号' },
        { id: 13, month: '13号' },
        { id: 14, month: '14号' },
        { id: 15, month: '15号' },
        { id: 16, month: '16号' },
        { id: 17, month: '17号' },
        { id: 18, month: '18号' },
        { id: 19, month: '19号' },
        { id: 20, month: '20号' },
        { id: 21, month: '21号' },
        { id: 22, month: '22号' },
        { id: 23, month: '23号' },
        { id: 24, month: '24号' },
        { id: 25, month: '25号' },
        { id: 26, month: '26号' },
        { id: 27, month: '27号' },
        { id: 28, month: '28号' },
        { id: 29, month: '29号' },
        { id: 30, month: '30号' },
        { id: 31, month: '31号' }
      ],
      form: {
        task_type: 0,
        task_date: 1,
        task_time: 1
      },
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
      temp: {
        ClassName: '',
        Minimum: 0
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
    cancelEdit(row) {
      row.Title = row.originalTitle
      // row.book_id = row.originalBookId;
      row.time_type = row.originalTimeType
      row.date = row.originalDate
      row.datetime = row.originalDateTime
      row.task_num = row.originalTaskNum
      row.edit = false
    },
    upload(row) {
      const _d = {}
      _d.data = {}
      _d.data.Title = row.Title
      // _d.data.book_id = row.book_id;
      _d.data.time_type = row.time_type
      _d.data.date = row.date
      _d.data.datetime = row.datetime
      _d.data.task_num = row.task_num
      _d.line = row.line
      _d.url = this.url
      _d.type = 'task'
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
        'http://blockchainadmin.me/' + '/admin/prop/popsTemplate'
      this.downloadLoading = false
    },
    sureExport() {
      this.loading = true
      const _d = {}
      _d.push_id = this.push_id
      _d.url = this.url
      doTaskImport(_d).then(res => {
        if (res.status == 'S') {
          this.$notify({
            title: 'Success',
            message: '导入成功',
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
        _d.type = 'task'
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
              v.originalTimeType = v.time_type
              v.originalDate = v.date
              v.originalDateTime = v.datetime
              v.originalTaskNum = v.task_num
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
    // 批量导入
    bulkImport(row) {
      // this.resetTemp();
      this.push_id = row.ID
      this.dialogFormVisible1 = true
      this.$nextTick(() => {
        this.$refs['dataForm1'].clearValidate()
      })
    },
    StrToGMT(time) {
      const GMT = new Date(time)
      return GMT
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
    },
    // 编辑
    handleUpdate(row) {
      this.form = Object.assign({}, row)
      this.form.id = row.ID
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 更新
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.loading = true
          const tempData = Object.assign({}, this.form)
          editChannel(tempData).then(res => {
            if (res.code == 0) {
              this.$notify({
                title: 'Success',
                message: '编辑成功',
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
