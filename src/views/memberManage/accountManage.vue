<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.Nickname"
        placeholder="请输入昵称"
        style="width: 200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.Username"
        placeholder="请输入用户名"
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
      <el-button
        v-waves
        class="filter-item"
        type="success"
        icon="el-icon-plus"
        plain
        @click="dialogFormVisible = true"
      >充值</el-button>
      <el-button
        v-waves
        class="filter-item"
        type="warning"
        icon="el-icon-setting"
        plain
        @click="OptRecord"
      >操作记录</el-button>
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
      <el-table-column label="昵称" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Nickname }}</span>
        </template>
      </el-table-column>

      <el-table-column label="用户名" min-width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Username }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="累计充值（书券）"
        min-width="200px"
        align="center"
      >
        <template slot-scope="{ row }">
          <span class="link-type" @click="toRechargeD(row)">{{
            row.Summary
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="累计充值（金额）"
        min-width="200px"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.Summary }}</span>
        </template>
      </el-table-column>
      <el-table-column label="剩余书券" min-width="100" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.Gold }}</span>
        </template>
      </el-table-column>
      <el-table-column label="来源" min-width="100" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.From | typeFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column label="更新时间" align="center" min-width="140">
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
            type="danger"
            @click="toDel(row)"
          >删除</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="toReset(row)"
          >重置</el-button>
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
    <el-dialog v-el-drag-dialog title="充值" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 80%; margin-left:50px;"
      >
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="temp.userId" @blur="getUsername" />
        </el-form-item>
        <el-form-item v-if="temp.userName" label="用户名" prop="userName">
          <el-input v-model="temp.userName" readonly />
        </el-form-item>
        <el-form-item label="书券数量" prop="gold">
          <el-input v-model="temp.gold" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="temp.remark" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="recharge"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getMember,
  delMember,
  exportMember,
  resetMember,
  addUserGold,
  getUserNameByID
} from '@/api/member'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'AccountManage',
  components: { Pagination },
  directives: { waves },
  filters: {
    typeFilter(type) {
      const typeMap = { self: '网站注册', wx: '微信', qq: 'QQ', author: '网站注册-作者' }
      return typeMap[type]
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
        userName: '',
        userId: '',
        remark: '',
        gold: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        userId: [{ required: true, message: '请输入用户ID', trigger: 'blur' }],
        gold: [{ required: true, message: '请输入充值数量', trigger: 'blur' }]
      },
      downloadLoading: false,
      ids: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    OptRecord() {
      this.$router.push({
        path: 'handleRechargeRecord'
      })
    },
    toRechargeD(row) {
      const query = {}
      query.id = row.ID
      this.$router.push({
        path: 'rechargeRecord',
        query
      })
    },
    getUsername() {
      const _d = {}
      _d.user_id = this.temp.userId
      getUserNameByID(_d).then(res => {
        if (res.code == 0) {
          this.temp.userName = res.data
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
    recharge() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.loading = true
          const _d = {}
          _d.user_id = this.temp.userId
          _d.gold = this.temp.gold
          _d.remark = this.temp.remark
          addUserGold(_d).then(res => {
            if (res.code == 0) {
              this.$notify({
                title: 'Success',
                message: '充值成功',
                type: 'success',
                duration: 1000
              })
              this.dialogFormVisible = false
              this.getList()
            } else {
              this.$notify({
                title: 'Error',
                message: res.msg,
                type: 'warning',
                duration: 1000
              })
            }
            this.loading = false
          })
        }
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
    toDel(item) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const _d = {}
          _d.ids = [item.ID]
          delMember(_d).then(res => {
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
    toReset(item) {
      const _d = {}
      _d.id = item.ID
      resetMember(_d).then(res => {
        if (res.status == 'S') {
          this.$notify({
            title: 'Success',
            message: '重置成功',
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
      })
    },
    getList() {
      this.listLoading = true
      getMember(this.listQuery).then(res => {
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
    handleDownload() {
      this.downloadLoading = true
      const _d = {}
      _d.Nickname = this.listQuery.Nickname
      _d.ID = this.listQuery.ID
      _d.ids = this.ids
      exportMember(_d).then(res => {
        this.download(res.url)
        this.downloadLoading = false
      })
    },
    download(url) {
      var iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      iframe.src = url
      document.body.appendChild(iframe)
    }
  }
}
</script>
