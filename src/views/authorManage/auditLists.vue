<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.Penname"
        placeholder="请输入作者名"
        style="width: 200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="search"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="search"
      >搜索</el-button>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-delete"
        plain
        @click="batchRemove"
      >批量审核</el-button>
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
      <el-table-column label="作者笔名" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Penname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作者实名" min-width="200px" align="center">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.Truename }}</span>
        </template>
      </el-table-column>
      <el-table-column label="签约状态" min-width="100" align="center">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.Signed | SignedFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" min-width="100" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.Dtime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        min-width="140"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            size="mini"
            type="primary"
            @click="toAudit(row)"
          >审核</el-button>
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
      v-el-drag-dialog
      title="作者信息"
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
        <el-form-item label="笔名" prop="Penname">
          <el-input v-model="temp.Penname" placeholder="请输入作者笔名" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="Truename">
          <el-input v-model="temp.Truename" placeholder="请输入作者真实姓名" />
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="temp.Sex">
            <el-radio :label="2">保密</el-radio>
            <el-radio :label="0">女</el-radio>
            <el-radio :label="1">男</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否签约">
          <el-radio-group v-model="temp.Signed">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="身份证号码">
          <el-input v-model="temp.Postid" placeholder="请输入作者身份证号码" />
        </el-form-item>
        <!-- <el-form-item label="通讯地址">
          <el-input v-model="temp.author" placeholder="请输入作者通讯地址" />
        </el-form-item>-->
        <el-form-item label="手机号">
          <el-input v-model="temp.Mobile" placeholder="请输入作者手机号" />
        </el-form-item>
        <el-form-item label="QQ">
          <el-input v-model="temp.Im" placeholder="请输入作者QQ" />
        </el-form-item>
        <el-form-item label="作者介绍">
          <el-input
            v-model="temp.Description"
            type="textarea"
            placeholder="请输入作者介绍"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="accessAudit()"
        >通过</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAuthorAudit,
  auditAuthor,
  addAuthorAudit,
  authorauditdel,
  doAuthorAuditAll
} from '@/api/author'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'AuditLists',
  components: { Pagination },
  directives: { waves },
  filters: {
    SignedFilter(Signed) {
      const SignedMap = ['未签约', '已签约']
      return SignedMap[Signed]
    }
  },
  data() {
    return {
      loading: false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        Penname: ''
      },
      temp: {
        Penname: '',
        Truename: '',
        Sex: 2,
        Address: '',
        Postid: '',
        Mobile: '',
        Im: '',
        Description: '大家好，我是萌新作者，很高兴认识大家！',
        Signed: 1
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        Penname: [{ required: true, message: '请输入笔名', trigger: 'blur' }],
        Truename: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' }
        ]
      },
      downloadLoading: false,
      multipleSelection: [],
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
        ids.push(item.ID)
      })
      this.ids = ids
    },
    // batchRemove
    batchRemove() {
      this.$confirm('此操作审核所选择作者, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const _d = {}
          _d.ids = this.ids
          doAuthorAuditAll(_d).then(res => {
            if (res.code == 0) {
              this.$notify({
                title: 'Success',
                message: '审核成功',
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
          authorauditdel(_d).then(res => {
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
      getAuthorAudit(this.listQuery).then(res => {
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
    search() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        Penname: '',
        Truename: '',
        Sex: 2,
        Address: '',
        Postid: '',
        Mobile: '',
        Im: '',
        Description: '',
        Signed: 1
      }
    },
    toAudit(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.ID = row.ID
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    accessAudit() {
      this.loading = true
      const _d = {}
      const tempData = Object.assign({}, this.temp)
      auditAuthor(tempData).then(res => {
        if (res.code == 0) {
          this.$notify({
            title: 'Success',
            message: '审核成功',
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
  }
}
</script>
s
