<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="请输入隐患名称"
        style="width: 200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-select
  v-model="listQuery.scene"
  placeholder="选择场景"
  clearable
  class="filter-item"
  style="width: 150px;"
>
  <el-option label="普通路段" :value="1" />
  <el-option label="临水路段" :value="2" />
  <el-option label="学校路段" :value="3" />
  <el-option label="路口" :value="4" />
  <el-option label="急弯路段" :value="30" />
</el-select>

<el-select
  v-model="listQuery.yhjcx"
  placeholder="检查项"
  clearable
  class="filter-item"
  style="width: 150px;"
>
  <el-option label="平面线型" :value="5" />
  <el-option label="曲面半径" :value="6" />
  <el-option label="道路标牌" :value="7" />
  <el-option label="路面标线" :value="8" />
  <el-option label="路口视距" :value="9" />
</el-select>

<el-select
  v-model="listQuery.yhdj"
  placeholder="隐患等级"
  clearable
  class="filter-item"
  style="width: 150px;"
>
  <el-option label="轻微隐患" :value="10" />
  <el-option label="一般隐患" :value="11" />
  <el-option label="重大隐患" :value="12" />
  <el-option label="特大隐患" :value="13" />
</el-select>
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
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" prop="id" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="隐患名称" prop="name" align="center" min-width="150px" />
      <el-table-column label="描述" prop="desc" align="center" min-width="200px" />
      <el-table-column label="分值" prop="score" align="center" min-width="100px" />
      <el-table-column label="标识" prop="code" align="center" min-width="100px" />
      <el-table-column label="场景" prop="scene" align="center" min-width="150px">
        <template slot-scope="scope">
          <span>{{ sceneMap[scope.row.scene] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="create_time" align="center" min-width="150px" />
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
          <el-button size="mini"  type="primary"  @click="handleUpdate(row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="toDel(row)">删除</el-button>
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
      ref="pitfallDialog"
      v-el-drag-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      class="pitfall-lib-dialog"
      @opened="handleOpened"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 90%; margin-left:50px;"
      >
        <el-row :gutter="40">
          <el-col :xs="7" :sm="7" :lg="7">
            <el-form-item label="隐患名称:" prop="name">
              <el-input v-model="temp.name" />
            </el-form-item>
            <el-form-item label="描述:" prop="desc">
              <el-input v-model="temp.desc" type="textarea" />
            </el-form-item>
            <el-form-item label="分值:" prop="score">
              <el-input v-model="temp.score" type="number" />
            </el-form-item>
            <el-form-item label="标识:" prop="code">
              <el-input v-model="temp.code" />
            </el-form-item>
            <el-form-item label="检测标准:" prop="testing_standards">
            <el-input v-model="temp.testing_standards" type="textarea" />
          </el-form-item>
          <el-form-item label="检测标准图片:">
          <el-upload
            class="avatar-uploader"
            :action="`${$uploadBaseUrl}/admin/fileUpload`"
            :show-file-list="false"
            :on-success="(res) => handleSingleUploadSuccess(res, 'testing_image')"
          >
            <img v-if="temp.testing_image" :src="temp.testing_image" class="uploaded-image" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

          <el-form-item label="治理对策:" prop="countermeasures">
            <el-input v-model="temp.countermeasures" type="textarea" />
          </el-form-item>
          <el-form-item label="治理对策图片:">
          <el-upload
            class="avatar-uploader"
            :action="`${$uploadBaseUrl}/admin/fileUpload`"
            :show-file-list="false"
            :on-success="(res) => handleSingleUploadSuccess(res, 'counter_image')"
          >
            <img v-if="temp.counter_image" :src="temp.counter_image" class="uploaded-image" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
            <el-form-item label="场景:" prop="scene">
              <el-select v-model="temp.scene" placeholder="请选择场景">
                <el-option label="普通路段" :value="1" />
                <el-option label="临水路段" :value="2" />
                <el-option label="学校路段" :value="3" />
                <el-option label="路口" :value="4" />
                <el-option label="急弯路段" :value="30" />
              </el-select>
            </el-form-item>


            <el-form-item label="隐患检查项:" prop="yhjcx">
              <el-select v-model="temp.yhjcx" placeholder="请选择隐患检查项">
                <el-option label="平面线型" :value="5" />
                <el-option label="曲面半径" :value="6" />
                <el-option label="道路标牌" :value="7" />
                <el-option label="路面标线" :value="8" />
                <el-option label="路口视距" :value="9" />
              </el-select>
            </el-form-item>


            
            <el-form-item label="等级:" prop="yhdj">
              <el-select v-model="temp.yhdj" placeholder="请选择隐患等级">
                <el-option label="轻微隐患" :value="10" />
                <el-option label="一般隐患" :value="11" />
                <el-option label="重大隐患" :value="12" />
                <el-option label="特大隐患" :value="13" />
              </el-select>
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
  getPitfallLibList,
  addPitfallLib,
  updatePitfallLib,
  deletePitfallLib
} from '@/api/road';
import waves from '@/directive/waves';
import Pagination from '@/components/Pagination';
import moment from 'moment';

export default {
  name: 'PitfallLibManagement',
  components: { Pagination },
  directives: { waves },
  filters: {
    timeFilter(time) {
      return moment(time * 1000).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      tableKey: 0,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: '',
        scene: null,
        yhjcx: null,
        yhdj: null
      },
      temp: {
        name: '',
        desc: '',
        score: '',
        code: '',
        scene: null,
        yhjcx:null,
        yhdj:null,
        testing_standards: '',  // 修改字段名
        countermeasures: '', 
        testing_image: '',   // 检测标准图片（单图）
  counter_image: ''    // 治理对策图片（单图）
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑隐患',
        create: '新增隐患'
      },
      rules: {
        name: [{ required: true, message: '请输入隐患名称', trigger: 'blur' }],
        desc: [{ required: true, message: '请输入描述', trigger: 'blur' }],
        score: [{ required: true, message: '请输入分值', trigger: 'blur' }],
        code: [{ required: true, message: '请输入标识', trigger: 'blur' }],
        testing_standards: [{ required: true, message: '请输入检测标准', trigger: 'blur' }],
  countermeasures: [{ required: true, message: '请输入治理对策', trigger: 'blur' }],
        yhjcx: [{ required: true, message: '请选择隐患检查项', trigger: 'change' }],
        yhdj: [{ required: true, message: '请选择隐患等级', trigger: 'change' }],
        scene: [{ required: true, message: '请选择场景', trigger: 'change' }]
      },
      sceneMap: {
        1: '普通路段',
        2: '临水路段',
        3: '学校路段',
        4: '路口',
        30: '急弯路段',
      },
      ids: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleOpened() {
      this.$refs.pitfallDialog.$el.scrollTop = 0;
    },
    handleSelectionChange(val) {
      this.ids = val.map(item => item.id);
    },
    batchRemove() {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePitfallLib({ ids: this.ids }).then(res => {
          if (res.code === 0) {
            this.$notify({
              title: 'Success',
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
            this.getList();
          } else {
            this.$notify({
              title: 'Error',
              message: res.msg,
              type: 'warning'
            });
          }
        });
      }).catch(() => {
        this.$notify({
          title: 'Info',
          message: '已取消删除',
          type: 'info'
        });
      });
    },
    toDel(item) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePitfallLib(item.id).then(res => {
          if (res.code === 0) {
            this.$notify({
              title: 'Success',
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
            this.getList();
          } else {
            this.$notify({
              title: 'Error',
              message: res.msg,
              type: 'warning'
            });
          }
        });
      }).catch(() => {
        this.$notify({
          title: 'Info',
          message: '已取消删除',
          type: 'info'
        });
      });
    },
    getList() {
      this.listLoading = true;
      getPitfallLibList(this.listQuery).then(res => {
        if (res.code === 0) {
          this.list = res.data.data;
          this.total = res.data.total;
        } else {
          this.list = [];
          this.total = 0;
        }
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    resetTemp() {
      this.temp = { name: '', desc: '', score: '', code: '', yhjcx:null,scene: null };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.loading = true;
          addPitfallLib(this.temp).then(res => {
            if (res.code === 0) {
              this.$notify({
                title: 'Success',
                message: '新增成功',
                type: 'success',
                duration: 1000
              });
              this.dialogFormVisible = false;
              this.getList();
            } else {
              this.$notify({
                title: 'Error',
                message: res.msg,
                type: 'warning'
              });
            }
            this.loading = false;
          });
        }
      });
    },
    handleUploadSuccess(res, file, fileList, field) {
    // 假设上传接口返回图片 URL 为 res.url
    this.temp[field] = fileList.map(f => ({
      name: f.name,
      url: f.response && f.response.url ? f.response.url : f.url
    }));
  },
  handleSingleUploadSuccess(res, field) {
  if (res.code === 0 && res.data && res.data.url) {
    const fullUrl = 'http://localhost:8081/' + res.data.url; // 替换成你项目的前缀
    console.log(`${field} 上传成功:`, fullUrl); // 👈 重点调试
    this.temp[field] = fullUrl;
    this.$forceUpdate();
  } else {
    this.$message.error('图片上传失败');
  }
},
    handleUpdate(row) {
      this.temp = { ...row };
      this.dialogStatus = 'update';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.loading = true;
          updatePitfallLib(this.temp).then(res => {
            if (res.code === 0) {
              this.$notify({
                title: 'Success',
                message: '编辑成功',
                type: 'success',
                duration: 1000
              });
              this.dialogFormVisible = false;
              this.getList();
            } else {
              this.$notify({
                title: 'Error',
                message: res.message,
                type: 'warning'
              });
            }
            this.loading = false;
          });
        }
      });
    }
  }
};
</script>

<style lang="scss">
.el-icon-close {
  color: rgb(221, 74, 74);
}
.el-icon-check {
  color: rgb(82, 168, 82);
}
.pitfall-lib-dialog .el-dialog {
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
.avatar-uploader {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  overflow: hidden;
  position: relative;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}

.uploaded-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
