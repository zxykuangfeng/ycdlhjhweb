<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="请输入修复单位名称"
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
      >新增修复</el-button>
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
      <el-table-column label="ID" prop="id" align="center" width="80" />
      <el-table-column label="隐患名称" prop="name" align="center" min-width="150px" />
      <el-table-column label="修复单位" prop="repair_company" align="center" min-width="150px" />
      <el-table-column label="开始时间" prop="stime" align="center" min-width="150px" />
      <el-table-column label="结束时间" prop="etime" align="center" min-width="150px" />
      <el-table-column label="修复状态" prop="status" align="center" min-width="120px">
        <template slot-scope="{ row }">
          <span>{{ repairStatusMap[row.status] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300">
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" @click="handleUpdate(row)">编辑</el-button>
          <el-button size="mini" type="success" v-if="row.status === 0" @click="approveRepair(row.id)">通过</el-button>
          <el-button size="mini" type="danger" v-if="row.status === 0" @click="openRejectDialog(row.id)">驳回</el-button>
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
      ref="repairDialog"
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      class="repair-dialog"
      @opened="handleOpened"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 90%; margin-left: 50px;"
      >
        <el-row :gutter="40">
          <el-col :xs="7" :sm="7" :lg="7">
            <el-form-item label="隐患名称:" prop="mid">
              <el-input v-model="temp.mid" />
            </el-form-item>
            <el-form-item label="修复单位:" prop="repair_company">
              <el-input v-model="temp.repair_company" />
            </el-form-item>
            <el-form-item label="开始时间:" prop="stime">
              <el-date-picker
                v-model="temp.stime"
                type="date"
                placeholder="选择开始日期"
                style="width: 100%;"
              />
            </el-form-item>
            <el-form-item label="结束时间:" prop="etime">
              <el-date-picker
                v-model="temp.etime"
                type="date"
                placeholder="选择结束日期"
                style="width: 100%;"
              />
            </el-form-item>
            <el-form-item label="描述:" prop="desc">
              <el-input v-model="temp.desc" type="textarea" />
            </el-form-item>
            <el-form-item label="修复照:" prop="imgs">
              <el-upload
                action="/admin/fileUpload"
                list-type="picture-card"
                :file-list="temp.imgs"
                :on-success="handleUploadSuccess"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
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

    <el-dialog
      title="驳回理由"
      :visible.sync="rejectDialogVisible"
      width="30%"
    >
      <el-input
        type="textarea"
        v-model="rejectReason"
        placeholder="请输入驳回理由"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="rejectDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="rejectRepair">驳回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRepairList,
  addRepair,
  approveRepair,
  rejectRepair
} from '@/api/road';
import waves from '@/directive/waves';
import Pagination from '@/components/Pagination';
import moment from 'moment';

export default {
  name: 'RepairManagement',
  components: { Pagination },
  directives: { waves },
  filters: {
    timeFilter(time) {
      return moment(time * 1000).format('YYYY-MM-DD');
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
        name: ''
      },
      temp: {
        mid: '',
        repair_company: '',
        stime: '',
        etime: '',
        desc: '',
        imgs: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑修复',
        create: '新增修复'
      },
      rules: {
        mid: [{ required: true, message: '隐患信息必填', trigger: 'blur' }],
        repair_company: [{ required: true, message: '修复单位必填', trigger: 'blur' }],
        stime: [{ required: true, message: '开始时间必填', trigger: 'blur' }],
        etime: [{ required: true, message: '结束时间必填', trigger: 'blur' }]
      },
      repairStatusMap: {
        0: '待审核',
        1: '已审核',
        2: '已驳回'
      },
      ids: [],
      rejectDialogVisible: false,
      rejectReason: '',
      currentRejectId: null
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleOpened() {
      this.$refs.repairDialog.$el.scrollTop = 0;
    },
    handleSelectionChange(val) {
      this.ids = val.map(item => item.id);
    },
    getList() {
      this.listLoading = true;
      getRepairList(this.listQuery).then(res => {
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
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    handleUpdate(row) {
      this.temp = { ...row };
      this.dialogStatus = 'update';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.loading = true;
          addRepair(this.temp).then(res => {
            if (res.code === 0) {
              this.$notify({
                title: 'Success',
                message: '新增成功',
                type: 'success'
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
    approveRepair(id) {
      this.$confirm('确定通过此修复申请?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        approveRepair(id).then(res => {
          if (res.code === 0) {
            this.$notify({
              title: 'Success',
              message: '审核通过',
              type: 'success'
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
      });
    },
    openRejectDialog(id) {
      this.rejectDialogVisible = true;
      this.currentRejectId = id;
    },
    rejectRepair() {
      if (!this.rejectReason) {
        this.$notify({
          title: 'Error',
          message: '请输入驳回理由',
          type: 'warning'
        });
        return;
      }
      rejectRepair({ id: this.currentRejectId, reason: this.rejectReason }).then(res => {
        if (res.code === 0) {
          this.$notify({
            title: 'Success',
            message: '驳回成功',
            type: 'success'
          });
          this.rejectDialogVisible = false;
          this.getList();
        } else {
          this.$notify({
            title: 'Error',
            message: res.msg,
            type: 'warning'
          });
        }
      });
    },
    handleUploadSuccess(response, file, fileList) {
      this.temp.imgs = fileList.map(file => file.response.url);
    },
    resetTemp() {
      this.temp = { mid: '', repair_company: '', stime: '', etime: '', desc: '', imgs: [] };
    }
  }
};
</script>

<style lang="scss">
.app-container {
  padding: 20px;
}
.repair-dialog .el-dialog {
  width: 80% !important;
  margin-top: 10vh !important;
}
</style>
