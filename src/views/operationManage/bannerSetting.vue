<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >新增作品</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreateCopy"
      >新增内容</el-button>
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
          <span>{{ scope.row.ID }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属分类ID" align="center">
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.ClassID }}</span>
        </template>
      </el-table-column>
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
      <el-table-column label="小说名(备注)" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="banner封面图片" align="center" min-width="160px">
        <template slot-scope="scope">
          <img
            :src="'http://' + $store.getters.domain + scope.row.BannerImage"
            style="width:90%;height:60px"
          >
        </template>
      </el-table-column>
      <el-table-column label="内容图片" align="center">
        <template slot-scope="scope">
          <img
            v-if="scope.row.Bookid != 0"
            :src="'http://' + $store.getters.domain + scope.row.Coverimg"
            style="width:60px;height:80px"
          >
          <img
            v-if="scope.row.Bookid == 0"
            :src="'http://' + $store.getters.domain + scope.row.Url"
            style="width:60px;height:80px"
          >
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
      class="banner-lists-dialog"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="width: 90%; margin-left:50px;"
      >
        <!-- <el-form-item label="所属分类" >
          <el-input v-model="temp.author" />
        </el-form-item>-->
        <el-row :gutter="40">
          <el-col :xs="12" :sm="12" :lg="12">
            <el-form-item label="当前分类">
              <el-select
                v-model="temp.Sid"
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
              <el-input v-model="temp.Description" treadonly />
            </el-form-item>
            <el-form-item label="作品地址">
              <el-input v-model="temp.Url" readonly />
            </el-form-item>
            <el-form-item label="作者">
              <el-input v-model="temp.Penname" readonly />
            </el-form-item>
            <el-form-item label="分类">
              <el-input v-model="temp.ClassName" readonly />
            </el-form-item>
            <el-form-item label="排序">
              <el-input v-model="temp.Sortid" readonly />
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="12">
            <el-form-item label="小说封面">
              <img
                :src="'http://' + $store.getters.domain + temp.Coverimg"
                alt
                style="width:160px;height:200px"
                @error="handleError"
              >
            </el-form-item>
            <el-form-item label="banner图片">
              <el-upload
                class="avatar-uploader"
                action="admin/uploadImg"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img
                  v-if="BannerImage"
                  :src="'http://' + $store.getters.domain + temp.BannerImage"
                  :class="
                    currentMenu == 306
                      ? 'avatar size-h5'
                      : currentMenu == 302
                        ? 'avatar size-pc'
                        : currentMenu == 304
                          ? 'avatar size-pc'
                          : 'avatar size-pc-small'
                  "
                >
                <i
                  v-else
                  :class="
                    currentMenu == 306
                      ? 'el-icon-plus avatar-uploader-icon size-h5'
                      : currentMenu == 302
                        ? 'el-icon-plus avatar-uploader-icon size-pc'
                        : currentMenu == 304
                          ? 'el-icon-plus avatar-uploader-icon size-pc'
                          : 'el-icon-plus avatar-uploader-icon size-pc-small'
                  "
                />
              </el-upload>
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
      class="banner-lists-dialog"
    >
      <el-form
        ref="dataForm1"
        :rules="rulesCopy"
        :model="tempcopy"
        label-position="left"
        label-width="120px"
        style="width: 90%; margin-left:50px;"
      >
        <el-row :gutter="40">
          <el-col :xs="12" :sm="12" :lg="12">
            <el-form-item label="当前分类">
              <el-select
                v-model="tempcopy.Sid"
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
            <el-form-item label="备注">
              <el-input v-model="tempcopy.Title" />
            </el-form-item>
            <el-form-item label="排序">
              <el-input v-model="tempcopy.Sortid" />
            </el-form-item>
            <el-form-item label="banner图片" prop="BannerImage">
              <el-upload
                class="avatar-uploader"
                action="admin/uploadImg"
                :show-file-list="false"
                :on-success="handleAvatarSuccess1"
                :before-upload="beforeAvatarUpload"
              >
                <img
                  v-if="tempcopy.BannerImage"
                  :src="
                    'http://' + $store.getters.domain + tempcopy.BannerImage
                  "
                  :class="
                    currentMenu == 306
                      ? 'avatar size-h5'
                      : currentMenu == 302
                        ? 'avatar size-pc'
                        : currentMenu == 304
                          ? 'avatar size-pc'
                          : 'avatar size-pc-small'
                  "
                >
                <i
                  v-else
                  :class="
                    currentMenu == 306
                      ? 'el-icon-plus avatar-uploader-icon size-h5'
                      : currentMenu == 302
                        ? 'el-icon-plus avatar-uploader-icon size-pc'
                        : currentMenu == 304
                          ? 'el-icon-plus avatar-uploader-icon size-pc'
                          : 'el-icon-plus avatar-uploader-icon size-pc-small'
                  "
                />
              </el-upload>
            </el-form-item>
            <el-form-item>
              <p>
                注：图片大小不能超过10M，H5首页:690*340，PC首页/版权(大):1920*384，PC首页(小):1120*344，H5内容/PC内容:宽高不限
              </p>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="12">
            <el-form-item label="内容图片" prop="Url">
              <el-upload
                class="avatar-uploader"
                action="admin/uploadImg"
                :show-file-list="false"
                :on-success="handleAvatarSuccess2"
                :before-upload="beforeAvatarUpload"
              >
                <img
                  v-if="tempcopy.Url"
                  :src="'http://' + $store.getters.domain + tempcopy.Url"
                  :class="
                    currentMenu == 306
                      ? 'avatar size-note-h5'
                      : currentMenu == 302
                        ? 'avatar size-note-pc'
                        : currentMenu == 304
                          ? 'avatar size-note-pc'
                          : 'avatar size-pc-note-small'
                  "
                >
                <i
                  v-else
                  :class="
                    currentMenu == 0
                      ? 'el-icon-plus avatar-uploader-icon size-note-h5'
                      : 'el-icon-plus avatar-uploader-icon size-note-pc'
                  "
                />
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
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
  operateDetailData,
  getBookById,
  addoperate,
  operateupdate,
  spreadDestroy,
  doOperateImport,
  addBannerImg,
  bannerupdate
} from '@/api/common'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'BannerSettingLists',
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
      currentMenu: 306,
      btnGroup: [
        { id: 306, btn_name: 'H5首页banner' },
        { id: 302, btn_name: 'PC首页大banner' },
        { id: 303, btn_name: 'PC首页小banner' },
        { id: 304, btn_name: 'PC版权大banner' }
      ],
      multipleSelection: [],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        Sid: 306
      },
      importanceOptions: [1, 2, 3],
      statusOptions: ['超级管理员', '管理员'],
      showReviewer: false,
      temp: {
        Bookid: '',
        Title: '',
        Description: '',
        Url: '',
        Penname: '',
        ClassName: '',
        Sortid: '',
        Coverimg: '',
        BannerImage: ''
      },
      tempcopy: {
        Url: '',
        Sortid: 0,
        BannerImage: '',
        Title: '内容'
      },
      dialogFormVisible: false,
      dialogFormCopyVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑banner作品',
        create: '新增banner作品'
      },
      textMapCopy: {
        update: '编辑banner内容',
        create: '新增banner内容'
      },
      rules: {
        Bookid: [{ required: true, message: '请输入小说ID', trigger: 'blur' }],
        BannerImage: [{ required: true, message: '请上传banner图片' }]
      },
      rulesCopy: {
        Url: [{ required: true, message: '请上传内容图片' }],
        BannerImage: [{ required: true, message: '请上传banner图片' }]
      },
      downloadLoading: false,
      ids: [],
      editId: '',
      url: '',
      fileList: [],
      BannerImage: false
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
    handleError(e) {
      e.target.src =
        'http://' + this.$store.getters.domain + '/upload/m_zanwu.jpg' // 当然如果项目配置了transformToRequire,参考上面 27.2
    },
    getBookD() {
      const _d = {}
      _d.Bookid = this.temp.Bookid
      getBookById(_d).then(res => {
        if (res.code == 0) {
          this.temp = res.data
          this.temp.Sid = this.listQuery.Sid
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
    handleAvatarSuccess(res, file) {
      this.BannerImage = true
      this.temp.BannerImage = res.url
    },
    handleAvatarSuccess1(res, file) {
      this.tempcopy.BannerImage = res.url
    },
    handleAvatarSuccess2(res, file) {
      this.tempcopy.Url = res.url
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 10

      // if (!isJPG) {
      //   this.$message.error("上传图片只能是 JPG 格式!");
      // }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 10MB!')
      }
      return isLt2M
    },
    chaneMenu(id) {
      this.currentMenu = id
    },
    changeCurrentMenu(id) {
      this.currentMenu = id
      this.listQuery.Sid = id
      this.handleFilter()
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
        Sid: this.currentMenu,
        Bookid: '',
        Title: '',
        Description: '',
        Url: '',
        Penname: '',
        ClassName: '',
        Sortid: '',
        Coverimg: '',
        BannerImage: ''
      }
      this.tempcopy = {
        Sid: this.currentMenu,
        Url: '',
        Sortid: 0,
        BannerImage: '',
        Title: '内容'
      }
      this.BannerImage = false
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
        this.$refs['dataForm1'].clearValidate()
      })
    },
    // 新建用户
    createData() {
      if (!this.temp.BannerImage) {
        this.$notify({
          title: 'Error',
          message: 'banner图片不能为空',
          type: 'warning',
          duration: 1000
        })
        return false
      }
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.loading = true
          const tempData = {}
          tempData.Sid = this.listQuery.Sid
          tempData.Bookid = this.temp.Bookid
          tempData.Title = this.temp.Title
          tempData.Coverimg = this.temp.Coverimg || '/upload/m_zanwu.jpg'
          tempData.Description = this.temp.Description
          tempData.Url = this.temp.Url
          tempData.Penname = this.temp.Penname
          tempData.ClassName = this.temp.ClassName
          tempData.Sortid = this.temp.Sortid
          tempData.BannerImage = this.temp.BannerImage
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
      this.$refs['dataForm1'].validate(valid => {
        if (valid) {
          this.loading = true
          const tempData = {}
          tempData.Sid = this.listQuery.Sid
          tempData.Url = this.tempcopy.Url
          tempData.Sortid = this.tempcopy.Sortid
          tempData.BannerImage = this.tempcopy.BannerImage
          tempData.Title = this.tempcopy.Title
          addBannerImg(tempData).then(res => {
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
        this.$refs['dataForm1'].clearValidate()
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
          tempData.Coverimg = this.temp.Coverimg || '/upload/m_zanwu.jpg'
          tempData.Description = this.temp.Description
          tempData.Url = this.temp.Url
          tempData.Penname = this.temp.Penname
          tempData.ClassName = this.temp.ClassName
          tempData.Sortid = this.temp.Sortid
          tempData.BannerImage = this.temp.BannerImage
          operateupdate(tempData).then(res => {
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
      this.$refs['dataForm1'].validate(valid => {
        if (valid) {
          this.loading = true
          const tempData = {}
          tempData.id = this.editId
          tempData.Sid = this.listQuery.Sid
          tempData.Title = this.tempcopy.Title
          tempData.Url = this.tempcopy.Url
          tempData.Sortid = this.tempcopy.Sortid
          tempData.BannerImage = this.tempcopy.BannerImage
          bannerupdate(tempData).then(res => {
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
.banner-lists-dialog .el-dialog {
  width: 70% !important;
  min-width: 1000px !important;
  margin-top: 20vh !important;
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

  text-align: center;
}
.avatar {
  display: block;
}
.size-h5 {
  width: 300px;
  height: 150px;
  line-height: 150px;
}
.size-pc {
  width: 400px;
  height: 140px;
  line-height: 140px;
}
.size-pc-small {
  width: 320px;
  height: 120px;
  line-height: 120px;
}
.size-note-h5 {
  width: 150px;
  height: 300px;
  line-height: 300px;
}
.size-note-pc {
  width: 200px;
  height: 300px;
  line-height: 300px;
}
</style>
