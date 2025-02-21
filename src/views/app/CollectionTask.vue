<template>
  <div class="app-container">
    <el-table :data="inspectionPlans" border style="width: 100%; margin-top: 20px;">
      <el-table-column prop="inspection_date" label="巡检日期" width="150" />
      <el-table-column prop="section_name" label="路段" />
      <el-table-column prop="crossing_name" label="路口" />
      <el-table-column prop="status" label="状态" width="150">
        <template #default="{ row }">
          <el-tag :type="row.status === 0 ? 'info' : 'success'">
            {{ row.status === 0 ? '待巡检' : '已完成' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button 
            v-if="row.status === 0" 
            type="primary" 
            @click="confirmCompletion(row.id)">
            确认完成
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="确认完成" :visible.sync="confirmDialogVisible" width="400px">
      <p>是否确认此巡检规划已完成？</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmCompletion">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { inspectionPlanList, inspectionPlanChange } from '@/api/road';

export default {
  name: 'AppInspectionPage',
  data() {
    return {
      inspectionPlans: [],
      confirmDialogVisible: false,
      currentPlanId: null,
    };
  },
  created() {
    this.fetchInspectionPlans();
  },
  methods: {
    fetchInspectionPlans() {
      inspectionPlanList().then(res => {
        if (res.code === 0) {
          this.inspectionPlans = res.data;
        }
      });
    },
    confirmCompletion(id) {
      this.currentPlanId = id;
      this.confirmDialogVisible = true;
    },
    async handleConfirmCompletion() {
      if (!this.currentPlanId) return;
      try {
        const res = await inspectionPlanChange(this.currentPlanId);
        if (res.code === 0) {
          this.$message.success('巡检规划已完成！');
          this.fetchInspectionPlans();
          this.confirmDialogVisible = false;
        } else {
          this.$message.error('更新状态失败');
        }
      } catch (error) {
        this.$message.error('请求失败，请检查网络或联系管理员');
      }
    },
  }
};
</script>

<style scoped>
.app-container {
  padding: 20px;
}
</style>
