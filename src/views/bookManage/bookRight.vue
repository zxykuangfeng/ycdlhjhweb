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
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
      <!-- <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
        >新增小说</el-button
      > -->
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
        :loading="downloadLoading"
        class="filter-item fright"
        type="primary"
        icon="el-icon-upload2"
        plain
        @click="handleImport"
      >导入</el-button>
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
      <el-table-column label="授权权利" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.copyright_type | copyrightFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="授权开始时间" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.copyright_time | timeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="授权结束时间" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.copyright_finish_time | timeFilter }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="入库->更新" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.Ptime | timeFilter }}</span
          ><span style="font-weight:800;color:#337ab7">-></span
          ><span>{{ row.Ltime | timeFilter }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            size="mini"
            type="primary"
            @click="handleUpdate(row)"
          >编辑</el-button>
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
      v-el-drag-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="140px"
        style="width: 90%; margin-left:50px;"
      >
        <el-form-item label="小说名:">
          <el-input v-model="temp.Title" readonly />
        </el-form-item>
        <el-form-item label="授权权利:">
          <el-radio-group v-model="temp.copyright_type">
            <el-radio :label="0">可转授</el-radio>
            <el-radio :label="1">不可转授</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="授权开始时间" prop="copyright_time">
          <el-date-picker
            v-model="temp.copyright_time"
            type="date"
            placeholder="选择开始日期"
            clearable
            class="filter-item"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="授权结束时间" prop="copyright_finish_time">
          <el-date-picker
            v-model="temp.copyright_finish_time"
            type="date"
            placeholder="选择结束日期"
            clearable
            class="filter-item"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          :loading="loading"
          type="primary"
          @click="updateData"
        >确认</el-button>
      </div>
    </el-dialog>

    <el-dialog
      v-el-drag-dialog
      :visible.sync="dialogimportVisible"
      title="小说权利导入"
    >
      <el-form
        ref="dataFormImport"
        :model="importTemp"
        label-position="left"
        label-width="100px"
        style="width: 90%; margin-left:50px;"
      >
        <el-form-item label="导入:">
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
              type="primary"
              icon="el-icon-upload2"
              plain
            >点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogimportVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="sureExport"
        >确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCopyright, updateCopyright, importDoCopyright } from '@/api/book'
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
      return moment(time).format('YYYY-MM-DD')
    },
    FullFilter(Full) {
      const FullMap = ['连载', '完本']
      return FullMap[Full]
    },
    copyrightFilter(c) {
      const CMap = ['可转授', '不可转授']
      return CMap[c]
    }
  },
  data() {
    return {
      loading: false,
      fileList: [],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      temp: {
        Title: '',
        copyright_type: 0,
        copyright_time: '',
        copyright_finish_time: ''
      },
      importTemp: {
        url: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑小说权利'
      },
      dialogimportVisible: false,
      rules: {
        Title: [{ required: true, message: '请输入小说名', trigger: 'blur' }],
        copyright: [
          { required: true, message: '请选择授权权利', trigger: 'blur' }
        ],
        copyright_time: [
          { required: true, message: '请选择授权开始时间', trigger: 'blur' }
        ],
        copyright_finish_time: [
          { required: true, message: '请选择授权结束时间', trigger: 'blur' }
        ]
      },
      downloadLoading: false,
      Sid: 0,
      ids: []
    }
  },
  watch: {
  },
  created() {
    this.getList()
  },
  methods: {
    handleImport() {
      this.dialogimportVisible = true
    },
    handleDownload() {
      this.downloadLoading = true
      window.location.href =
        'http://' +
        this.$store.getters.domainExport +
        `/admin/bookCopyright/template`
      this.downloadLoading = false
    },
    toBookDetails(row) {
      window.open(
        'http://www.ziycw.com' + `/#/BookDetails?bookId=${row.ID}`,
        '_blank'
      )
    },
    download(url) {
      var iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      iframe.src = url
      document.body.appendChild(iframe)
    },
    sureExport() {
      this.loading = true
      importDoCopyright(this.importTemp).then(res => {
        if (res.status == 'S') {
          this.$notify({
            title: 'Success',
            message: '导入成功',
            type: 'success',
            duration: 1000
          })
          this.getList()
          this.fileList = []
          this.dialogimportVisible = false
        } else {
          this.$notify({
            title: 'Error',
            message: res.message,
            type: 'warning',
            duration: 2000
          })
        }
        this.loading = false
      })
    },
    beforeAvatarUpload(file, fileList) {
      const str = file.name
      const xls = str.indexOf('xls') != -1
      const xlsx = str.indexOf('xlsx') != -1
      if (!xls && !xlsx) {
        this.$message.error('上传图片只能是 xls/xlsx 格式!')
      }
      return xls
    },
    handleSuccess(file, fileList) {
      if (file.code == 0) {
        this.importTemp.url = file.url
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
    getList() {
      this.listLoading = true
      getCopyright(this.listQuery).then(res => {
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
    resetTemp() {
      this.temp = {
        Title: '',
        copyright: 0,
        copyright_time: '',
        copyright_finish_time: ''
      }
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.id = row.ID
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.loading = true
          const tempData = {}
          tempData.id = this.temp.ID
          tempData.copyright_type = this.temp.copyright_type
          tempData.copyright_time = this.temp.copyright_time
          tempData.copyright_finish_time = this.temp.copyright_finish_time

          updateCopyright(tempData).then(res => {
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
</style>
