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
      <!-- <el-button
        v-waves
        class="filter-item"
        type="danger"
        icon="el-icon-delete"
        @click="handleFilter"
        >批量删除</el-button
      > -->
    </div>

    <el-table
      ref="multipleTable"
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      highlight-current-row
      style="width: 100%;"
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
      <el-table-column label="用户名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" min-width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.role_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updated_at }}</span>
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
            v-if="row.id != 1"
            size="mini"
            type="primary"
            @click="handleUpdate(row)"
          >编辑</el-button>
          <el-button
            v-if="row.id != 1"
            size="mini"
            type="danger"
            @click="toDelUser(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="count > 0"
      :total="count"
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
        label-width="70px"
        style="width: 80%; margin-left:50px;"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password" />
        </el-form-item>
        <el-form-item label="备注名" prop="remark">
          <el-input v-model="temp.remark" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select
            v-model="temp.role_id"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.role_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          :loading="downloadLoading"
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUser, addUser, updateUser, delUser } from '@/api/user'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'User',
  components: { Pagination },
  directives: { waves },
  filters: {},
  data() {
    return {
      roles: [],
      tableKey: 0,
      list: null,
      count: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      temp: {
        role_id: 1,
        username: '',
        password: '',
        remark:''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑用户',
        create: '新增用户'
      },
      downloadLoading: false,
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  created() {},
  mounted() {
    this.getList()
  },
  methods: {
    // handleSelectionChange(val) {
    //   this.multipleSelection = val;
    // },
    getList() {
      this.listLoading = true
      getUser(this.listQuery).then(response => {
        this.list = response.data.data
        this.count = response.data.count
        this.roles = response.data.roles
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    toDelUser(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const _d = {}
          _d.user_id = row.id
          delUser(_d).then(res => {
            if (res.status == 'S') {
              this.$notify({
                title: 'Success',
                message: '删除成功',
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
            this.getList()
          })
        })
        .catch(() => {
          this.$notify({
            title: 'Info',
            message: '已取消删除',
            type: 'success',
            duration: 1000
          })
        })
    },
    // 重置表单
    resetTemp() {
      this.temp = {
        role_id: 1,
        username: '',
        password: ''
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
      console.log('add:',333333333333333333);
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.downloadLoading = true

          console.log('add:',this.temp)
          addUser(this.temp).then(res => {
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
            this.downloadLoading = false
            this.getList()
            this.dialogFormVisible = false
          })
        }
      })
    },
    // 编辑按钮
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
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
          this.downloadLoading = true
          const tempData = {}
          tempData.user_id = this.temp.id
          tempData.username = this.temp.username
          tempData.password = this.temp.password
          tempData.role_id = this.temp.role_id
          tempData.remark = this.temp.remark
          updateUser(tempData).then(res => {
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
            this.downloadLoading = false
            this.getList()
            this.dialogFormVisible = false
          })
        }
      })
    }
  }
}
</script>
