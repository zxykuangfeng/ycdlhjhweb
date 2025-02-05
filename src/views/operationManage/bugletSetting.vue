<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >新增小喇叭作品</el-button>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        plain
        @click="handleCreateCopy"
      >新增小喇叭公告</el-button>
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
      <!-- <el-table-column label="分类ID" align="center">
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.ClassID }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="所属分类" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.SidName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="小说ID" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Bookid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="小说名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标语" align="center" width="400px">
        <template slot-scope="scope">
          <span>{{ scope.row.Slogan }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Sortid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Dtime }}</span>
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
            v-if="row.Bookid != 0"
            size="mini"
            type="primary"
            @click="handleUpdate(row)"
          >编辑</el-button>
          <el-button
            v-if="row.Bookid == 0"
            size="mini"
            type="primary"
            @click="handleUpdateCopy(row)"
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
      class="buglet-dialog"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="width: 80%; margin-left:50px;"
      >
        <!-- <el-form-item label="所属分类" prop="type">
          <el-input v-model="temp.author" />
        </el-form-item>-->
        <el-row :gutter="40">
          <el-col :xs="12" :sm="12" :lg="12">
            <el-form-item label="小说ID" prop="Bookid">
              <el-input v-model="temp.Bookid" @blur="getBookD" />
            </el-form-item>
            <el-form-item label="小说名">
              <el-input v-model="temp.Title" readonly />
            </el-form-item>
            <!-- <el-form-item label="作品描述">
              <el-input v-model="temp.Description" />
            </el-form-item> -->
            <el-form-item label="作品地址">
              <el-input v-model="temp.Url" readonly />
            </el-form-item>
            <el-form-item label="作者">
              <el-input v-model="temp.Penname" readonly />
            </el-form-item>
            <el-form-item label="分类">
              <el-input v-model="temp.ClassName" readonly />
            </el-form-item>
            <!-- <el-form-item label="排序">
              <el-input v-model="temp.Sortid" readonly />
            </el-form-item> -->
          </el-col>
          <el-col :xs="12" :sm="12" :lg="12">
            <el-form-item label="小说封面">
              <img
                :src="'http://' + this.$store.getters.domain + temp.Coverimg"
                alt
                style="width:160px;height:200px"
                @error="handleError"
              >
            </el-form-item>
            <el-form-item label="标语">
              <el-input v-model="temp.Slogan" type="textarea" :rows="4" />
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
      :title="textMapCopy[dialogStatus]"
      :visible.sync="dialogFormCopyVisible"
      class="buglet-dialog"
    >
      <el-form
        ref="dataForm"
        :rules="rulesCopy"
        :model="tempcopy"
        label-position="left"
        label-width="120px"
        style="width: 600px; margin-left:50px;"
      >
        <!-- <el-form-item label="所属分类" prop="type">
          <el-input v-model="temp.author" />
        </el-form-item>-->

        <el-form-item label="标语">
          <el-input v-model="tempcopy.Slogan" />
        </el-form-item>
        <!-- <el-form-item label="排序">
          <el-input v-model="tempcopy.Sortid" />
        </el-form-item> -->
        <el-form-item label="内容图" prop="Url">
          <el-upload
            class="avatar-uploader"
            action="admin/uploadImg"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="tempcopy.Url"
              :src="'http://' + $store.getters.domain + tempcopy.Url"
              class="avatar"
            >
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormCopyVisible = false">取消</el-button>
        <el-button
          :loading="loading"
          type="primary"
          @click="
            dialogStatus === 'create' ? createDataCopy() : updateDataCopy()
          "
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getSmallhorn,
  updateSmallHornImg,
  updateSmallHorn
} from '@/api/operation'
import {
  operateDetailData,
  getBookById,
  addoperate,
  operateupdate,
  spreadDestroy,
  addoperateimg
} from '@/api/common'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'BugletSetting',
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
        limit: 20,
        Sid: 401
      },
      temp: {
        Bookid: '',
        Title: '',
        Description: '',
        ClassUrl: '',
        Penname: '',
        Classname: '',
        Sortid: '',
        Slogan: ''
      },
      tempcopy: {
        Url: '',
        Slogan: '',
        Sortid: ''
      },
      dialogFormVisible: false,
      dialogFormCopyVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑小喇叭作品',
        create: '新增小喇叭作品'
      },
      textMapCopy: {
        update: '编辑小喇叭公告',
        create: '新增小喇叭公告'
      },
      rules: {
        Bookid: [{ required: true, message: '请输入小说ID', trigger: 'blur' }]
      },
      rulesCopy: {
        Url: [{ required: true, message: '请上传内容图', trigger: 'blur' }]
      },
      downloadLoading: false,
      ids: [],
      editId: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleError(e) {
      e.target.src =
        'http://' + this.$store.getters.domain + '/upload/m_zanwu.jpg' // 当然如果项目配置了transformToRequire,参考上面 27.2
    },
    handleAvatarSuccess(res, file) {
      this.tempcopy.Url = res.url
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    getBookD() {
      const _d = {}
      _d.Bookid = this.temp.Bookid
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
          spreadDestroy(_d).then(res => {
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
          spreadDestroy(_d).then(res => {
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
      operateDetailData(this.listQuery).then(res => {
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
      this.tempcopy = {
        Url: '',
        Slogan: '',
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
    handleCreateCopy() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormCopyVisible = true
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
          tempData.Sid = this.listQuery.Sid
          tempData.Bookid = this.temp.Bookid
          tempData.Title = this.temp.Title
          tempData.Coverimg = this.temp.Coverimg
          tempData.Description = this.temp.Description
          tempData.Url = this.temp.Url
          tempData.Penname = this.temp.Penname
          tempData.ClassName = this.temp.ClassName
          tempData.Sortid = this.temp.Sortid
          tempData.Slogan = this.temp.Slogan
          addoperate(tempData).then(res => {
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
    createDataCopy() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.loading = true
          const tempData = {}
          tempData.Sid = this.listQuery.Sid
          tempData.Url = this.tempcopy.Url
          tempData.Sortid = this.tempcopy.Sortid
          tempData.Slogan = this.tempcopy.Slogan
          addoperateimg(tempData).then(res => {
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
            this.dialogFormCopyVisible = false
          })
        }
      })
    },
    // 编辑按钮
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.editId = row.ID
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdateCopy(row) {
      this.tempcopy = Object.assign({}, row) // copy obj
      this.editId = row.ID
      this.dialogStatus = 'update'
      this.dialogFormCopyVisible = true
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
          tempData.id = this.editId
          tempData.Sid = this.listQuery.Sid
          tempData.Bookid = this.temp.Bookid
          tempData.Title = this.temp.Title
          tempData.Coverimg = this.temp.Coverimg
          tempData.Description = this.temp.Description
          tempData.Url = this.temp.Url
          tempData.Penname = this.temp.Penname
          tempData.ClassName = this.temp.ClassName
          tempData.Sortid = this.temp.Sortid
          tempData.Slogan = this.temp.Slogan
          updateSmallHorn(tempData).then(res => {
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
              return
            }
            this.loading = false
            this.getList()
            this.dialogFormVisible = false
          })
        }
      })
    },
    updateDataCopy() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.loading = true
          const tempData = {}
          tempData.id = this.editId
          tempData.Sid = this.listQuery.Sid
          tempData.Url = this.tempcopy.Url
          tempData.Sortid = this.tempcopy.Sortid
          tempData.Slogan = this.tempcopy.Slogan
          updateSmallHornImg(tempData).then(res => {
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
            this.dialogFormCopyVisible = false
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
.p0 {
  padding: 0 !important;
  .cell {
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      margin: 4px 0;
    }
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
  width: 178px;
  height: 240px;
  line-height: 240px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 240px;
  display: block;
}
.buglet-dialog .el-dialog {
  margin-top: 20vh;
}
</style>
