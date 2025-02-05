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
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        plain
        @click="handleCreate"
      >新增作品</el-button>
      <el-button
        v-waves
        class="filter-item"
        type="danger"
        icon="el-icon-delete"
        @click="batchRemove"
      >批量删除</el-button>
    </div>
    <div class="filter-container">
      <el-button
        v-for="(item, index) in btnGroup"
        :key="index"
        v-waves
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        :plain="item.id != currentMenu"
        @click="changeCurrentMenu(item.id)"
      >{{ item.btn_name }}</el-button>
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
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="小说名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.book.Title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="小说ID" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.book.ID }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="作者" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.book.Tiltle }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="所属分类ID" align="center">
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.ClassID }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="分类" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ClassName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="章节" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ClassName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否完本" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ClassName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否收费" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ClassName }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="小说ID" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Bookid }}</span>
        </template>
      </el-table-column> -->

      <!-- <el-table-column label="图片" align="center" class-name="p0">
        <template slot-scope="scope">
          <img
            :src="'http://' + $store.getters.domain + scope.row.Coverimg"
            style="width:45px;height:60px"
          />
        </template>
      </el-table-column> -->
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="120"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
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
      class="pc-dialog"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 90%; margin-left:50px;"
      >
        <!-- <el-form-item label="所属分类" prop="type">
          <el-input v-model="temp.author" />
        </el-form-item>-->
        <el-row :gutter="40">
          <el-col :xs="14" :sm="14" :lg="14">
            <el-form-item label="当前分类">
              <el-select
                v-model="temp.black_type"
                placeholder="选择类型"
                class="filter-item"
                filterable
                @keyup.enter.native="search"
                @change="changeCurrentMenu"
              >
                <el-option
                  v-for="item in btnGroup"
                  :key="item.id"
                  :label="item.btn_name"
                  :value="item.id"
                >{{ item.btn_name }}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="小说ID" prop="Bookid">
              <el-input v-model="temp.Bookid" @blur="getBookD" />
            </el-form-item>
            <el-form-item label="小说名">
              <el-input v-model="temp.Title" readonly />
            </el-form-item>
            <el-form-item label="作品描述">
              <el-input
                v-model="temp.Description"
                readonly
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <!-- <el-form-item label="作品地址">
              <el-input v-model="temp.Url" readonly />
            </el-form-item> -->
            <el-form-item label="作者">
              <el-input v-model="temp.Penname" readonly />
            </el-form-item>
            <el-form-item label="分类">
              <el-input v-model="temp.ClassName" readonly />
            </el-form-item>
          </el-col>
          <el-col :xs="10" :sm="10" :lg="10">
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
          @click="createData"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getBookBlackList,
  addBookBlackList,
  delBookBlackList
} from '@/api/book'
import { getBookById } from '@/api/common'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'PcSettingLists',
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
      currentMenu: 0,
      btnGroup: [
        { id: 0, btn_name: '涉黄涉政' },
        { id: 1, btn_name: '合约解除' }
      ],
      multipleSelection: [],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        black_type: 0
      },
      temp: {
        black_type: 0,
        Bookid: '',
        Title: '',
        Description: '',
        ClassUrl: '',
        Penname: '',
        ClassName: '',
        Sortid: '',
        Coverimg: ''
      },
      dialogFormVisible: false,
      dialogFormVisible1: false,
      dialogStatus: '',
      textMap: {
        update: '编辑作品',
        create: '新增作品'
      },
      rules: {
        Bookid: [{ required: true, message: '请输入小说ID', trigger: 'blur' }]
      },
      downloadLoading: false,
      ids: [],
      editId: '',
      url: '',
      fileList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
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
          delBookBlackList(_d).then(res => {
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
          _d.ids = [item.id]
          delBookBlackList(_d).then(res => {
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
    getBookD() {
      const _d = {}
      _d.Bookid = this.temp.Bookid
      getBookById(_d).then(res => {
        if (res.code == 0) {
          this.temp = res.data
          this.temp.black_type = this.listQuery.black_type
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
    handleError(e) {
      e.target.src =
        'http://' + this.$store.getters.domain + '/upload/m_zanwu.jpg' // 当然如果项目配置了transformToRequire,参考上面 27.2
    },
    changeCurrentMenu(id) {
      this.currentMenu = id
      this.listQuery.black_type = id
      this.handleFilter()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      const ids = []
      this.multipleSelection.map(item => {
        ids.push(item.id)
      })
      this.ids = ids
    },
    getList() {
      this.listLoading = true
      getBookBlackList(this.listQuery).then(res => {
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
        black_type: this.currentMenu,
        Bookid: '',
        Title: '',
        Description: '',
        ClassUrl: '',
        Penname: '',
        ClassName: '',
        Sortid: '',
        Coverimg: ''
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
          tempData.black_type = this.listQuery.black_type
          tempData.book_id = this.temp.Bookid
          addBookBlackList(tempData).then(res => {
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
.pc-dialog .el-dialog {
  margin-top: 20vh !important;
}
</style>
