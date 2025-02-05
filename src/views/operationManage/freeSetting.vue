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
          <span class="link-type" @click="toDetails(scope.row)">{{
            scope.row.remark
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time }}</span>
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
            type="danger"
            @click="toDel(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 15"
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
        label-width="120px"
        style="width: 80%; margin-left:50px;"
      >
        <el-form-item label="活动名称" prop="remark">
          <el-input v-model="temp.remark" />
        </el-form-item>
        <el-form-item label="活动开始时间" prop="start_time">
          <el-date-picker
            v-model="temp.start_time"
            type="datetime"
            placeholder="选择开始日期"
            clearable
            class="filter-item"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="活动结束时间" prop="finish_time">
          <el-date-picker
            v-model="temp.finish_time"
            type="datetime"
            placeholder="选择结束日期"
            clearable
            class="filter-item"
            format="yyyy-MM-dd HH:mm:sss"
            value-format="yyyy-MM-dd HH:mm:sss"
          />
        </el-form-item>
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
  </div>
</template>

<script>
import {
  getTimefree,
  addTimefree,
  updateTimefree,
  delTimefree
} from '@/api/operation'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'FreeSetting',
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
      temp: {
        remark: '',
        start_time: '',
        finish_time: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑限免活动',
        create: '新增限免活动'
      },
      rules: {
        remark: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        start_time: [
          { required: true, message: '请输入活动开始时间', trigger: 'blur' }
        ],
        finish_time: [
          { required: true, message: '请输入活动结束时间', trigger: 'blur' }
        ]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    StrToGMT(time) {
      const GMT = new Date(time)
      return GMT
    },
    toDetails(row) {
      this.$router.push({
        path: 'freeSettinglists?id=' + row.ID
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
          delTimefree(_d).then(res => {
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
          delTimefree(_d).then(res => {
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
      getTimefree(this.listQuery).then(res => {
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
        remark: '',
        start_time: '',
        finish_time: ''
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
          addTimefree(this.temp).then(res => {
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
    },
    // 编辑按钮
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.start_time = this.StrToGMT(row.start_time)
      this.temp.finish_time = this.StrToGMT(row.finish_time)
      this.temp.id = row.ID
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 更新用户
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.loading = true
          const tempData = {}
          tempData.id = this.temp.id
          tempData.remark = this.temp.remark
          tempData.start_time = this.temp.start_time
          tempData.finish_time = this.temp.finish_time
          updateTimefree(tempData).then(res => {
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
