<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="请输入书名"
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
      >新增小说</el-button>
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
      <el-table-column label="小说名" min-swidth="200px" align="center">
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.Title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分类" min-width="120px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.Full | FullFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作者笔名" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.author_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.Dtime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        min-width="120"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            size="mini"
            type="primary"
            @click="handleUpdate(row)"
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
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      class="book-lists-dialog"
    >
      <el-form
        ref="dataForm"
        :model="temp"
        :rules="rules"
        label-position="left"
        label-width="100px"
        style="width: 90%; margin-left:50px;"
      >
        <el-row :gutter="40">
          <el-col :xs="7" :sm="7" :lg="7">
            <el-form-item label="小说名:" prop="Title">
              <el-input v-model="temp.Title" />
            </el-form-item>
            <el-form-item label="作者:" prop="Uid">
              <el-select
                v-model="temp.Uid"
                placeholder="选择作者"
                clearable
                class="filter-item"
                style="width: 120px"
                :filter-method="getAuthor"
                filterable
              >
                <el-option
                  v-for="(item, index) in authorLists"
                  :key="index"
                  :label="item.Penname"
                  :value="item.Uid"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="小说封面">
              <el-upload
                class="avatar-uploader"
                action="admin/uploadSmallImg"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img
                  v-if="temp.Coverimg"
                  :src="'http://' + $store.getters.domain + temp.Coverimg"
                  class="avatar"
                >
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
              <p>注：图片尺寸为600*800，不能超过10M.</p>
            </el-form-item>
          </el-col>
          <el-col :xs="7" :sm="7" :lg="7">
            <el-form-item label="类型:">
              <el-radio-group v-model="temp.Columnx">
                <el-radio :label="1">普通小说</el-radio>
                <el-radio :label="3">漫画</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="版权:">
              <el-radio-group v-model="temp.copyright">
                <el-radio :label="0">信息网络传播权</el-radio>
                <el-radio :label="1">其他</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="驻站:">
              <el-radio-group v-model="temp.Exclusive">
                <el-radio :label="0" :disabled="isDisabled">是</el-radio>
                <el-radio :label="1" :disabled="isDisabled">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="单本推送:">
              <el-radio-group v-model="temp.is_personal">
                <el-radio :label="0" :disabled="isDisabled">否</el-radio>
                <el-radio :label="1" :disabled="isDisabled">是</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="收费方式:">
              <el-radio-group v-model="temp.SellType">
                <el-radio :label="1" :disabled="isDisabled">按章</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="收费:">
              <el-radio-group v-model="temp.Sell">
                <el-radio :label="0" :disabled="isDisabled">是</el-radio>
                <el-radio :label="1" :disabled="isDisabled">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="完本:">
              <el-radio-group v-model="temp.Full">
                <el-radio :label="1" :disabled="isDisabled">是</el-radio>
                <el-radio :label="0" :disabled="isDisabled">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="频道:">
              <el-radio-group v-model="temp.Gender">
                <el-radio :label="1" @change="changeGender(1)">女频</el-radio>
                <el-radio :label="2" @change="changeGender(2)">男频</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="分类:">
              <el-select
                v-model="temp.Sid"
                placeholder="请选择分类"
                clearable
                class="filter-item"
                style="width: 200px"
              >
                <el-option
                  v-for="(item, index) in classLists"
                  :key="index"
                  :label="item.ClassName"
                  :value="item.ID"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="10" :sm="10" :lg="10">
            <el-form-item label="标签:">
              <el-checkbox-group v-model="temp.Tags">
                <el-checkbox
                  v-for="(item, index) in tagLists"
                  :key="index"
                  :label="item.ID"
                  name="type"
                >{{ item.ClassName }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="一句话描述:" prop="Brief">
              <el-input
                v-model="temp.Brief"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="详细描述:" prop="Description">
              <el-input
                v-model="temp.Description"
                type="textarea"
                :rows="4"
              />
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
        >确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAuditBook,
  updateAuditBook,
  getTag,
  addBook,
  delAuditBook,
  batchAudit
} from '@/api/book'
import { category } from '@/api/data'
import { getAuthor } from '@/api/author'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { loadavg } from 'os'

export default {
  name: 'BookAuditLists',
  components: { Pagination },
  directives: { waves },
  filters: {
    FullFilter(Full) {
      const FullMap = ['连载', '完本']
      return FullMap[Full]
    },
    SellFilter(Sell) {
      const SellMap = ['收费', '免费']
      return SellMap[Sell]
    }
  },
  data() {
    return {
      loading: false,
      isDisabled: false,
      classLists: [],
      authorLists: [],
      tagLists: [],
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
        Uid: '',
        copyright: 0,
        Sell: 0,
        Full: 1,
        Exclusive: 0,
        SellType: 1,
        Gender: 1,
        Exclusive: 0,
        Tags: [],
        Coverimg: '',
        Words: 0,
        Sid: '',
        Brief: '',
        Description: '',
        Columnx: 1,
        is_personal: 0
      },
      rules: {
        Title: [{ required: true, message: '请输入小说名', trigger: 'blur' }],
        Uid: [{ required: true, message: '请选择作者', trigger: 'blur' }],
        Description: [
          { required: true, message: '请输入一句话描述', trigger: 'blur' }
        ],
        Brief: [{ required: true, message: '请输入详细描述', trigger: 'blur' }]
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      downloadLoading: false,
      Sid: '',
      multipleSelection: [],
      ids: []
    }
  },
  watch: {
    temp: {
      handler(newValue) {
        if (newValue.copyright == 1) {
          this.isDisabled = true
        } else {
          this.isDisabled = false
        }
        if (this.dialogFormVisible) {
          if (newValue.Gender == 1) {
            this.Sid = 1
            this.getCategory()
          } else {
            this.Sid = 2
            this.getCategory()
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.getList()
    this.getTagLists()
    this.getAuthor()
    this.getCategory()
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
      this.$confirm('此操作审核所选择小说, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const _d = {}
          _d.ids = this.ids
          batchAudit(_d).then(res => {
            if (res.status == 'S') {
              this.$notify({
                title: 'Success',
                message: '审核成功',
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
            type: 'info',
            duration: 1000
          })
        })
    },
    changeGender(id) {
      this.Sid = id
      this.temp.Sid = ''
      this.getCategory()
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
          delAuditBook(_d).then(res => {
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
    getTagLists() {
      getTag({ limit: 100, page: 1 }).then(res => {
        this.tagLists = res.data
      })
    },
    getAuthor(val) {
      const _d = {}
      _d.Penname = val
      _d.limit = 1000
      _d.page = 1
      getAuthor(_d).then(res => {
        this.authorLists = res.data
      })
    },
    getCategory() {
      const _d = {}
      _d.limit = 100
      _d.page = 1
      _d.Sid = this.Sid
      category(_d).then(res => {
        this.classLists = res.data
      })
    },
    handleAvatarSuccess(res, file) {
      this.temp.Coverimg = res.url
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2

      // if (!isJPG) {
      //   this.$message.error("上传图片只能是 JPG 格式!");
      // }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    addChapter() {
      this.$router.push('addChapter')
    },
    editBook(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    getList() {
      this.listLoading = true
      getAuditBook(this.listQuery).then(res => {
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
        Uid: '',
        copyright: 0,
        Sell: 0,
        Full: 1,
        Exclusive: 0,
        SellType: 1,
        Gender: 1,
        Exclusive: 0,
        Tags: [],
        Coverimg: '',
        Words: 0,
        Sid: '',
        Brief: '',
        Description: '',
        Columnx: 1,
        is_personal: 0
      }
      this.Sid = 1
    },
    handleCreate() {
      this.resetTemp()
      this.getCategory()
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
          const tempData = Object.assign({}, this.temp)
          tempData.Tags = tempData.Tags.join(',')
          addBook(tempData).then(res => {
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      if (row.Gender == 1) {
        this.Sid = 1
        this.getCategory()
      } else {
        this.Sid = 2
        this.getCategory()
      }
      const tagsCopy = this.temp.Tags.split(',')
      this.temp.Tags = tagsCopy.map((value, index) => {
        const val = Number(value)
        return val
      })
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
          const tempData = Object.assign({}, this.temp)
          tempData.Tags = tempData.Tags.join(',')
          updateAuditBook(tempData).then(res => {
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
.book-lists-dialog .el-dialog {
  width: 80% !important;
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
