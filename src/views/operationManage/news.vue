<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="标题"
        style="width: 200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-date-picker
        v-model="listQuery.start_time"
        type="date"
        placeholder="选择开始日期"
        clearable
        class="filter-item"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd HH:mm:ss"
        style="width: 160px"
        @keyup.enter.native="handleFilter"
      />
      <el-date-picker
        v-model="listQuery.end_time"
        type="date"
        placeholder="选择结束日期"
        clearable
        class="filter-item"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd HH:mm:ss"
        style="width: 160px"
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
      >新增消息</el-button>
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
      <el-table-column label="标题" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column label="内容" min-width="200px" align="center">
        <template slot-scope="{ row }">
          <span class="link-type" @click="checkConetnt(row)">{{
            row.content
          }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" class-name="status-col" align="center">
        <template slot-scope="{ row }">{{
          row.status | StatusFilter
        }}</template>
      </el-table-column>
      <el-table-column label="接受群体" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type | TypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="200" align="center">
        <template slot-scope="scope">
          <span>{{
            scope.row.created_at | parseTime("{y}-{m}-{d} {h}:{i}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="240"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            v-if="row.status == 0"
            type="primary"
            size="mini"
            @click="handleUpdate(row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="toDel(row)"
          >删除</el-button>
          <el-button
            v-if="row.status == 0"
            size="mini"
            type="warning"
            @click="send(row)"
          >发送</el-button>
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
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 80%; margin-left:50px;"
      >
        <el-form-item label="标题：" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="内容：" prop="content">
          <el-input v-model="temp.content" type="textarea" :rows="8" />
        </el-form-item>
        <el-form-item label="接收群体：" prop="type">
          <el-radio-group v-model="temp.type">
            <el-radio :label="0">全部</el-radio>
            <el-radio :label="1">仅作者</el-radio>
            <el-radio :label="2">仅用户</el-radio>
          </el-radio-group>
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
    <el-dialog
      v-el-drag-dialog
      title="查看消息"
      :visible.sync="dialogFormVisible1"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 80%; margin-left:50px;"
      >
        <el-form-item label="标题：">
          <el-input v-model="temp.title" disabled class="check-form" />
        </el-form-item>
        <el-form-item label="内容：" prop="title">
          <el-input
            v-model="temp.content"
            type="textarea"
            :rows="10"
            disabled
            class="check-form"
          />
        </el-form-item>
        <el-form-item label="接收群体">
          <el-radio-group v-model="temp.type" disabled class="check-form">
            <el-radio :label="0">全部</el-radio>
            <el-radio :label="1">仅作者</el-radio>
            <el-radio :label="2">仅用户</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">关闭</el-button>
        <!-- <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getMessage,
  addMessage,
  updateMessage,
  delMessage,
  sendMessage
} from '@/api/news'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
const TypeMap = ['全部', '仅作者', '仅用户']
//  import elDragDialog from "@/directive/el-drag-dialog";
export default {
  name: 'News',
  components: { Pagination },
  directives: { waves },
  filters: {
    TypeFilter(type) {
      return TypeMap[type]
    },
    StatusFilter(status) {
      const StatusMap = ['未发送', '已发送']
      return StatusMap[status]
    }
  },
  data() {
    return {
      loading: false,
      multipleSelection: [],
      searchTime: '',
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      temp: {
        title: '',
        content: '',
        type: 0
      },
      dialogFormVisible: false,
      dialogFormVisible1: false,
      dialogStatus: '',
      textMap: {
        update: '编辑消息',
        create: '新增消息'
      },
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        type: [{ required: true, message: '请选择接收群体', trigger: 'blur' }]
      },
      ids: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
      const ids = []
      this.multipleSelection.map(item => {
        ids.push(item.id)
      })
      this.ids = ids
    },
    send(row) {
      this.$confirm(
        `此操作的接受群体为 ${TypeMap[row.type]} , 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          const _d = {}
          _d.ids = row.id
          sendMessage(_d).then(res => {
            if (res.code == 0) {
              this.$notify({
                title: 'Success',
                message: '发送成功',
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
    // list
    getList() {
      this.listLoading = true
      getMessage(this.listQuery).then(res => {
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
    // search
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
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
          delMessage(_d).then(res => {
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
          _d.ids = item.id
          delMessage(_d).then(res => {
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
    // reset
    resetTemp() {
      this.temp = {
        title: '',
        content: '',
        type: 0
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
          addMessage(this.temp).then(res => {
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
    checkConetnt(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogFormVisible1 = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.id = row.id
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
          tempData.title = this.temp.title
          tempData.content = this.temp.content
          tempData.type = this.temp.type
          tempData.id = this.temp.id
          updateMessage(tempData).then(res => {
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
.check-form {
  .el-input__inner {
    background-color: #fff !important;
    border-color: #dfe4ed !important;
    color: #555 !important;
  }
  .el-textarea__inner {
    background-color: #fff !important;
    border-color: #dfe4ed !important;
    color: #555 !important;
  }
}
.check-form {
  .is-checked .el-radio__inner {
    border-color: #1890ff !important;
    background: #1890ff !important;
  }
  .el-radio__label {
    color: #555 !important;
  }
}
</style>
