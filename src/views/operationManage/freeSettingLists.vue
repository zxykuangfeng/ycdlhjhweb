<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >新增</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="success"
        icon="el-icon-download"
        plain
        @click="importTemplate"
      >下载导入模版</el-button>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-upload"
        plain
        @click="bulkImport"
      >批量导入</el-button>
      <el-button
        v-waves
        class="filter-item"
        type="danger"
        icon="el-icon-delete"
        @click="batchRemove"
      >批量删除</el-button>
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
      <el-table-column label="ID" prop="id" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.ID }}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动名称" align="center">
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.time_free_remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="小说ID" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.book_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="小说名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="封面" align="center">
        <template slot-scope="scope">
          <img
            :src="'http://' + $store.getters.domain + scope.row.Coverimg"
            style="width:60px;height:80px"
          >
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Sortid }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <!-- <el-button size="mini" type="primary" @click="handleUpdate(row)"
            >编辑</el-button
          > -->
          <el-button
            size="mini"
            type="danger"
            @click="toDel(row)"
          >删除</el-button>
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
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :model="temp"
        :rules="rules"
        label-position="left"
        label-width="120px"
        style="width: 80%; margin-left:50px;"
      >
        <!-- <el-form-item label="所属分类" prop="type">
          <el-input v-model="temp.author" />
        </el-form-item>-->
        <el-row :gutter="40">
          <el-col :xs="12" :sm="12" :lg="12">
            <el-form-item label="小说ID" prop="ID">
              <el-input v-model="temp.ID" @blur="getBookD" />
            </el-form-item>
            <el-form-item label="小说名">
              <el-input v-model="temp.Title" readonly />
            </el-form-item>
            <el-form-item label="作品描述">
              <el-input v-model="temp.Description" readonly />
            </el-form-item>
            <el-form-item label="作品地址">
              <el-input v-model="temp.ClassUrl" readonly />
            </el-form-item>
            <el-form-item label="作者">
              <el-input v-model="temp.Penname" readonly />
            </el-form-item>
            <el-form-item label="分类">
              <el-input v-model="temp.ClassName" readonly />
            </el-form-item>
            <el-form-item label="排序">
              <el-input v-model="temp.Sortid" readonly />
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="12">
            <el-form-item label="小说封面">
              <img
                :src="'http://' + $store.getters.domain + temp.Coverimg"
                alt
                style="width:160px;height:200px"
                @error="handleError"
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-el-drag-dialog
      title="导入活动小说"
      :visible.sync="dialogFormVisible1"
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
            style="margin-top: 10px;"
            type="primary"
            icon="el-icon-upload2"
            plain
          >点击上传</el-button>
        </el-upload>
      </el-form>
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
import {
  getTimefreeD,
  addTimefreeD,
  updateTimefreeD,
  delTimefreeD,
  timeFreeTemplate,
  doTimeFreeImport
} from '@/api/operation'
import { getBookById } from '@/api/common'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'FreeSettingLists',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
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
      importanceOptions: [1, 2, 3],
      statusOptions: ['超级管理员', '管理员'],
      showReviewer: false,
      temp: {
        Bookid: '',
        Title: '',
        Description: '',
        ClassUrl: '',
        Penname: '',
        ClassName: '',
        Sortid: ''
      },
      dialogFormVisible: false,
      dialogFormVisible1: false,
      dialogStatus: '',
      textMap: {
        update: '编辑限免作品',
        create: '新增限免作品'
      },
      rules: {
        ID: [{ required: true, message: '请输入小说ID', trigger: 'blur' }]
      },
      downloadLoading: false,
      ids: [],
      fileList: [],
      temp1: {
        fileList: []
      }
    }
  },
  created() {
    this.listQuery.timeFreeId = this.$route.query.id
    this.getList()
  },
  methods: {
    importTemplate() {
      this.downloadLoading = true
      timeFreeTemplate().then(res => {
        window.location.href = res.url
      })

      this.downloadLoading = false
    },
    sureExport() {
      this.loading = true
      const _d = {}
      _d.url = this.url
      doTimeFreeImport(_d).then(res => {
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
        this.url = file.url
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
    bulkImport() {
      this.resetTemp()
      this.dialogFormVisible1 = true
      this.$nextTick(() => {
        this.$refs['dataForm1'].clearValidate()
      })
    },
    handleError(e) {
      e.target.src =
        'http://' + this.$store.getters.domain + '/upload/m_zanwu.jpg' // 当然如果项目配置了transformToRequire,参考上面 27.2
    },
    getBookD() {
      const _d = {}
      _d.Bookid = this.temp.ID
      getBookById(_d).then(res => {
        if (res.code == 0) {
          this.temp = res.data
        } else {
          this.$notify({
            title: 'Error',
            message: '暂无该书号',
            type: 'warning',
            duration: 1000
          })
        }
      })
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
          delTimefreeD(_d).then(res => {
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
          delTimefreeD(_d).then(res => {
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
    getList() {
      this.listLoading = true
      getTimefreeD(this.listQuery).then(res => {
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
    // 重置表单
    resetTemp() {
      this.temp = {
        Bookid: '',
        Title: '',
        Description: '',
        ClassUrl: '',
        Penname: '',
        ClassName: '',
        Sortid: ''
      }
    },
    // 新增用户
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 新建用户
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.loading = true
          const tempData = {}
          tempData.timeFreeId = this.listQuery.timeFreeId
          tempData.Bookid = this.temp.ID
          tempData.Title = this.temp.Title
          tempData.Coverimg = this.temp.Coverimg
          tempData.Description = this.temp.Description
          tempData.ClassUrl = this.temp.ClassUrl
          tempData.Penname = this.temp.Penname
          tempData.ClassName = this.temp.ClassName
          tempData.Sortid = this.temp.Sortid
          addTimefreeD(tempData).then(res => {
            if (res.code == 0) {
              this.$notify({
                title: 'Success',
                message: '新增成功',
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
