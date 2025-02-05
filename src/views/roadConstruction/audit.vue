<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="请输入申请企业名称"
        style="width: 200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
    </div>

    <el-table
  :data="list"
  border
  fit
  highlight-current-row
  style="width: 100%;"
>
  <el-table-column label="申请企业" prop="uname" align="center" min-width="150" />
  <el-table-column label="隐患类型" prop="yhlb_name" align="center" min-width="150" />
  <el-table-column label="项目名称" prop="name" align="center" min-width="150" />
  <el-table-column label="施工方式" prop="construction_method" align="center" min-width="150" />
  <el-table-column label="建设单位" prop="build_unit_name" align="center" min-width="150" />
  <el-table-column label="建设单位负责人联系方式" prop="build_unit_contact" align="center" min-width="200" />
  <el-table-column label="施工单位" prop="construction_unit_name" align="center" min-width="150" />
  <el-table-column label="施工单位负责人联系方式" prop="construction_unit_contact" align="center" min-width="200" />
  <el-table-column label="操作" align="center" width="300">
    <template slot-scope="{ row }">
      <el-button-group>
        <el-button size="mini" type="primary" @click="viewMaterials(row)">申请材料</el-button>
        <el-button size="mini" type="info" @click="viewHazardDetails(row)">隐患详情</el-button>
        <el-button size="mini" type="success" @click="approveOccupation(row.work_id)">通过</el-button>
        <el-button size="mini" type="danger" @click="openRejectDialog(row.work_id)">拒绝</el-button>
      </el-button-group>
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

    <!-- 拒绝对话框 -->
    <el-dialog title="驳回申请" :visible.sync="rejectDialogVisible" width="30%">
      <el-input
        type="textarea"
        v-model="rejectReason"
        placeholder="请输入驳回理由"
        rows="5"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="rejectDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="rejectOccupation">确认驳回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getWorksList, approveWorks, rejectWorks,seeRepairWork,seeWorks } from '@/api/road';
import Pagination from '@/components/Pagination';

export default {
  components: { Pagination },
  data() {
    return {
      list: [],
      listLoading: true,
      total: 0,
      listQuery: { page: 1, limit: 20, name: '' ,status:1},
      tableKey: 0,
      rejectDialogVisible: false,
      rejectReason: '',
      currentRejectId: null,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      this.listLoading = true;
      try {
        const res = await getWorksList(this.listQuery);
        if (res.code === 0) {
          // 扁平化处理嵌套字段
          this.list = res.data.data.map((item) => {
            return {
              ...item,
              ...item.supplement, // 将 supplement 中的数据展开到主对象中
            };
          });
          this.total = res.data.total;
        } else {
          this.$message.error("获取列表失败");
        }
      } catch (error) {
        console.error("Error fetching list:", error);
      } finally {
        this.listLoading = false;
      }
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    viewMaterials(row) {
      console.log('查看申请材料:', row);
      console.log('查看申请材料详情:', row);
      // 在这里实现查看隐患详情的逻辑，例如跳转到详情页
      var id = row.work_id
      this.$router.push({
      path: '/roadConstruction/libraryDetail',
      query: { id } // 通过 query 传递参数
      });
    },
    viewHazardDetails(row) {
      console.log('查看申请材料详情:', row);
      // 在这里实现查看隐患详情的逻辑，例如跳转到详情页
      var id = row.id
      this.$router.push({
      path: '/hazardManage/libraryDetail',
      query: { id } // 通过 query 传递参数
    });
    },
    approveOccupation(id) {
      this.$confirm('确定通过该施工申请?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success',
      }).then(() => {
        approveWorks({id:id, reason:'同意'}).then(res => {
          if (res.code === 0) {
            this.$notify({ title: 'Success', message: '审核通过', type: 'success' });
            this.getList();
          } else {
            this.$notify({ title: 'Error', message: res.msg, type: 'error' });
          }
        });
      });
    },
    openRejectDialog(id) {
      this.rejectDialogVisible = true;
      this.currentRejectId = id;
    },
    rejectOccupation() {
      if (!this.rejectReason) {
        this.$notify({ title: 'Error', message: '请输入驳回理由', type: 'warning' });
        return;
      }
      rejectWorks({ id: this.currentRejectId, reason: this.rejectReason }).then(res => {
        if (res.code === 0) {
          this.$notify({ title: 'Success', message: '驳回成功', type: 'success' });
          this.rejectDialogVisible = false;
          this.getList();
        } else {
          this.$notify({ title: 'Error', message: res.msg, type: 'error' });
        }
      });
    },
  },
};
</script>

<style scoped>
.app-container {
  padding: 20px;
}

.filter-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.filter-item {
  margin-right: 10px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding: 10px 20px;
}
</style>
