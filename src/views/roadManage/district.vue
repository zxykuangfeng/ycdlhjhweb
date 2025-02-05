<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="请输入行政区划名"
        style="width: 200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.id"
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
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >新增</el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item fright"
        type="primary"
        icon="el-icon-download"
        plain
        @click="handleDownload"
      >导出</el-button>
      <el-button
        v-if="listQuery.pid !== 0"
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-arrow-left"
        @click="goBack"
      >返回上级</el-button>
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
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="行政区划名"
        min-width="200px"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span class="link-type" @click="toNextLevel(scope.row)">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="行政编码"
        min-width="120px"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          <span>{{ row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.create_time }}</span>
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
            class="super-mini"
            @click="handleUpdate(row)"
          >编辑</el-button>
          <!-- <el-button
            size="mini"
            type="primary"
            class="super-mini"
            plain
            @click="exportOne(row)"
          >
            导出</el-button> -->
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
      ref="townDialog"
      v-el-drag-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      class="town-lists-dialog"
      @opened="handleOpened"
    >
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 90%; margin-left:50px;"
      >
        <el-row :gutter="40">
          <el-col :xs="7" :sm="7" :lg="7">
            <el-form-item label="行政区划名:" prop="name">
              <el-input v-model="temp.name" />
            </el-form-item>
            <el-form-item label="行政编码:" prop="code">
              <el-input v-model="temp.code" />
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
  </div>
</template>
<script>
import {
  getTownList,
  addTown,
  updateTown,
  deleteTown
} from '@/api/road'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import moment from 'moment'
export default {
  name: 'TownLists',
  components: { Pagination },
  directives: { waves },
  filters: {
    timeFilter(time) {
      var timeFilter =  time * 1000
      return moment(timeFilter).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  data() {
    return {
      listdata: [],
      loading: false,
      isDisabled: false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: '',
        id: '',
        pid: 0 // 新增 pid 查询条件
      },
      temp: {
        name: '',
        code: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑行政区划',
        create: '新增行政区划'
      },
      downloadLoading: false,
      ids: [],
      parentIds: [] // 用于记录上一级的 pid
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleOpened() {
      this.$refs.townDialog.$el.scrollTop = 0
    },
    exportOne(row) {
      window.location.href =
        'http://' +
        this.$store.getters.domainExport +
        `/admin/town/exportOne?town_id=${row.id}`
    },
    toTownDetails(row) {
      window.open(
        'http://www.example.com' + `/#/TownDetails?townId=${row.id}`,
        '_blank'
      )
    },
    handleDownload() {
      this.downloadLoading = true
      window.location.href =
        'http://' +
        this.$store.getters.domainExport +
        `/admin/town/export?name=${this.listQuery.name || ''}&id=${this.listQuery.id || ''}&ids=${this.ids.join(',')}`
      this.downloadLoading = false
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      const ids = []
      this.multipleSelection.map(item => {
        ids.push(item.id)
      })
      this.ids = ids
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
          deleteTown(_d).then(res => {
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
    toDel(item) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteTown(item.id).then(res => {
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
      getTownList(this.listQuery).then(res => {
        if (res.code == 0) {
          this.list = res.data.data
          console.log(this.list)
          this.total = res.data.count
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
        name: '',
        code: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.loading = true
          addTown(this.temp).then(res => {
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
          updateTown(this.temp).then(res => {
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
    toNextLevel(row) {
      this.parentIds.push(this.listQuery.pid) // 记录当前 pid
      this.listQuery.pid = row.id
      this.getList()
    },
    goBack() {
      if (this.parentIds.length > 0) {
        this.listQuery.pid = this.parentIds.pop() // 返回上一级 pid
        this.getList()
      }
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
.town-lists-dialog .el-dialog {
  width: 80% !important;
  margin-top: 10vh !important;
}
.el-col {
  border-left: 1px solid #eee;
  &:nth-of-type(1) {
    border-left: none;
  }
}
.super-mini {
  padding: 4px 0px !important;
  width: 40px !important;
}
</style>
