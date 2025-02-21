<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="请输入报告名称"
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
      >新增报告</el-button>
      <!-- <el-button class="filter-item" style="margin-left: auto;" type="success" icon="el-icon-download" @click="exportSelected">导出</el-button> -->

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
    > <el-table-column type="selection" width="55" />
      <el-table-column label="报告编号" prop="code" align="center" min-width="150px" />
      <el-table-column label="报告名称" prop="name" align="center" min-width="200px" />
      <el-table-column label="创建时间" prop="create_time" align="center" min-width="150px" />
      <el-table-column label="操作" align="center" width="400">
        <template #default="{ row }">
          <el-button size="mini" type="primary" @click="downloadReport(row.id)">导出</el-button>
          <el-button size="mini" type="primary" @click="viewReport(row)">查看详情</el-button>
          <el-button size="mini" type="info" @click="previewReport(row)">预览</el-button>
          <el-button size="mini" type="warning" @click="openEditDialog(row)">编辑</el-button>
          <!-- <el-button size="mini" type="success" @click="exportReport(row.id)">导出</el-button> -->
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
      ref="reportDialog"
      title="新增报告"
      :visible.sync="dialogFormVisible"
      @opened="handleOpened"
    >
      <el-form
        ref="dataForm"
        :model="temp"
        label-width="100px"
      >
        <el-form-item label="道路" prop="zid">
          <el-select v-model="temp.zid" placeholder="请选择道路">
            <el-option
              v-for="road in roadList"
              :key="road.id"
              :label="road.name"
              :value="road.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="报告名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="排查时间段" prop="dt">
          <el-date-picker
            v-model="temp.dt"
            type="date"
            placeholder="请选择时间"
            style="width: 100%;"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createReport">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog title="报告详情" :visible.sync="dialogVisible" width="50%">
      <el-form :model="selectedReport" label-width="100px" disabled>
        <el-form-item label="报告编号"><el-input v-model="selectedReport.code" /></el-form-item>
        <el-form-item label="报告名称"><el-input v-model="selectedReport.name" /></el-form-item>
        <el-form-item label="创建时间"><el-input v-model="selectedReport.create_time" /></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑报告" :visible.sync="editDialogVisible" width="50%">
      <el-form :model="selectedReport" label-width="100px">
        <el-form-item label="报告名称"><el-input v-model="selectedReport.name" /></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateReportData">确认</el-button>
      </span>
    </el-dialog>

    <el-dialog title="报告预览" :visible.sync="previewDialogVisible" width="50%">
      <h3>{{ previewData.name }}</h3>
      <div v-for="(item, index) in previewData.content" :key="index">
        <h4>{{ item[0] }}</h4>
        <p v-for="(detail, subIndex) in item.slice(1)" :key="subIndex">{{ detail }}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="previewDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getReportList, addReport, downloadReport, getRoadList,updateReport,seeReport} from '@/api/road';
import Pagination from '@/components/Pagination';

export default {
  name: 'PitfallReportManagement',
  components: { Pagination },
  data() {
    return {
      list: [],
      selectedReports: [],
      selectedReport: {},
      dialogVisible: false,
      editDialogVisible: false,
      previewDialogVisible: false,
      previewData: { name: '', content: '' },
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
        zid: null,
        name: '',
        dt: ''
      },
      dialogFormVisible: false,
      roadList: []
    };
  },
  created() {
    this.getList();
    this.fetchRoadList();
  },
  methods: {
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleCreate() {
      this.resetTemp();
      this.dialogFormVisible = true;
    },
    resetTemp() {
      this.temp = { zid: null, name: '', dt: '' };
    },
    getList() {
      this.listLoading = true;
      getReportList(this.listQuery).then(res => {
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
    fetchRoadList() {
      getRoadList().then(res => {
        if (res.code === 0) {
          this.roadList = res.data.data;
     
        }
      });
    },
    createReport() {
      if (this.temp.dt) {
        // 格式化日期为 YYYY-MM-DD 格式
        const date = new Date(this.temp.dt);
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        this.temp.dt = formattedDate;
      }

      addReport(this.temp).then(res => {
        if (res.code === 0) {
          this.$notify({ title: '成功', message: '报告创建成功', type: 'success' });
          this.dialogFormVisible = false;
          this.getList();
        } else {
          this.$notify({ title: '失败', message: res.msg, type: 'error' });
        }
      });
    },
    downloadReport(id) {
      console.log(id)
      window.location.href = "admin/pitfall/report/"+id
    },
    viewReport(row) {
      this.selectedReport = { ...row };

      console.log('selectedReport'+this.selectedReport)
      this.dialogVisible = true;
    },
    openEditDialog(row) {

      
      this.selectedReport = { ...row };
      this.editDialogVisible = true;
    },
    updateReportData() {
      updateReport(this.selectedReport).then(() => {
        this.$notify({ title: '成功', message: '报告已更新', type: 'success' });
        this.editDialogVisible = false;
        this.getList();
      });
    },
    exportReport(id) {
      exportReport(id).then(() => {
        this.$notify({ title: '成功', message: '报告导出成功', type: 'success' });
      });
    },
    exportSelected() {
      const ids = this.selectedReports.map(item => item.id);
      exportReport(ids).then(() => {
        this.$notify({ title: '成功', message: '选中报告导出成功', type: 'success' });
      });
    },
    previewReport(row) {
      seeReport(row.id).then(res => {
        if (res.code === 0) {
          this.previewData = { name: res.data[0].name, content: res.data[1].content };
          this.previewDialogVisible = true;
        } else {
          this.$notify({ title: '失败', message: res.msg, type: 'error' });
        }
      });
    }
  } 
};
</script>

<style scoped>
.filter-container {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}
</style>
