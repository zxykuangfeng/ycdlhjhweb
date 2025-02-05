<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="请输入评分名称"
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
      <el-table-column label="ID" prop="id" align="center" width="80" />
      <el-table-column label="名称" prop="name" align="center" min-width="150px" />
      <el-table-column label="描述" prop="desc" align="center" min-width="200px" />
      <el-table-column label="分值" prop="score" align="center" min-width="100px" />
      <el-table-column label="标识" prop="code" align="center" min-width="100px" />
      <el-table-column label="类型" prop="type" align="center" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ typeMap[row.type] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="create_time" align="center" min-width="150px" />
      <el-table-column label="操作" align="center" width="300">
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" @click="handleUpdate(row)">编辑</el-button>
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
      ref="ratingDialog"
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      class="rating-dialog"
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
            <el-form-item label="名称:" prop="name">
              <el-input v-model="temp.name" />
            </el-form-item>
            <el-form-item label="描述:" prop="desc">
              <el-input v-model="temp.desc" type="textarea" />
            </el-form-item>
            <el-form-item label="分值:" prop="score">
              <el-input v-model="temp.score" />
            </el-form-item>
            <el-form-item label="标识:" prop="code">
              <el-input v-model="temp.code" />
            </el-form-item>
            <el-form-item label="类型:" prop="type">
              <el-select v-model="temp.type" placeholder="请选择类型">
                <el-option
                  v-for="(label, value) in typeMap"
                  :key="value"
                  :label="label"
                  :value="value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="安全规则:" prop="mid">
              <el-input v-model="temp.mid" />
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
  getSafetyRatingList,
  addSafetyRating,
  updateSafetyRating,
  deleteSafetyRating,
  getSafetyRatingDetail,
  getSafetyRatingTypes
} from '@/api/road';
import waves from '@/directive/waves';
import Pagination from '@/components/Pagination';
import moment from 'moment';

export default {
  name: 'SafetyRatingManagement',
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
        name: ''
      },
      temp: {
        name: '',
        desc: '',
        score: '',
        code: '',
        type: null,
        mid: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑安全评分',
        create: '新增安全评分'
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        desc: [{ required: true, message: '请输入描述', trigger: 'blur' }],
        score: [{ required: true, message: '请输入分值', trigger: 'blur' }],
        code: [{ required: true, message: '请输入标识', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'change' }],
        mid: [{ required: true, message: '请输入安全规则', trigger: 'blur' }]
      },
      ids: [],
      typeMap: {}
    };
  },
  created() {
    this.getList();
    this.fetchTypes();
  },
  methods: {
    handleOpened() {
      this.$refs.ratingDialog.$el.scrollTop = 0;
    },
    async fetchTypes() {
      try {
        const response = await getSafetyRatingTypes();
        if (response.code === 0) {
          this.typeMap = response.data;
        } else {
          this.$notify({ title: 'Error', message: response.msg, type: 'warning' });
        }
      } catch (error) {
        this.$notify({ title: 'Error', message: '获取类型失败', type: 'error' });
      }
    },
    handleSelectionChange(val) {
      this.ids = val.map(item => item.id);
    },
    getList() {
      this.listLoading = true;
      getSafetyRatingList(this.listQuery).then(res => {
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
          addSafetyRating(this.temp).then(res => {
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
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.loading = true;
          updateSafetyRating(this.temp).then(res => {
            if (res.code === 0) {
              this.$notify({
                title: 'Success',
                message: '编辑成功',
                type: 'success'
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
    },
    toDel(item) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSafetyRating(item.id).then(res => {
          if (res.code === 0) {
            this.$notify({
              title: 'Success',
              message: '删除成功',
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
      }).catch(() => {
        this.$notify({
          title: 'Info',
          message: '已取消删除',
          type: 'info'
        });
      });
    },
    resetTemp() {
      this.temp = { name: '', desc: '', score: '', code: '', type: null, mid: '' };
    }
  }
};
</script>

<style lang="scss">
.app-container {
  padding: 20px;
}
.rating-dialog .el-dialog {
  width: 80% !important;
  margin-top: 10vh !important;
}
</style>
