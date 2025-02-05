<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select 
        v-model="selectedRoad" 
        placeholder="请选择路段" 
        style="width: 200px;" 
        class="filter-item"
      >
        <el-option 
          v-for="road in roadList" 
          :key="road.id" 
          :label="road.name" 
          :value="road.id"
        />
      </el-select>

      <el-date-picker 
        v-model="inspectionDate" 
        type="date" 
        placeholder="选择巡检日期" 
        style="width: 200px;" 
        class="filter-item"
      />

      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-plus"
        @click="handleAddPlan"
      >添加巡检规划</el-button>
    </div>

    <el-table :data="inspectionPlans" border style="width: 100%; margin-top: 20px;">
      <el-table-column prop="roadName" label="路段" width="150" />
      <el-table-column prop="date" label="巡检日期" width="150" />
      <el-table-column prop="status" label="状态" width="150">
        <template #default="{ row }">
          <el-tag :type="row.status === 0 ? 'info' : 'success'">
            {{ row.status === 0 ? '待巡检' : '已完成' }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  getRoadSectionList,
  addRoadSection,
  updateRoadSection,
  deleteRoadSection,
  getRoadSectionDetail,
  getTownList,
  getRoadList
} from '@/api/road';
export default {
  name: 'InspectionPlan',
  data() {
    return {
      selectedRoad: null,
      inspectionDate: '',
      roadList: [],
      inspectionPlans: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      getRoadSectionList(this.listQuery).then(res => {
        if (res.code === 0) {
          this.roadList = res.data.data;
          this.total = res.data.total;
        } else {
          this.list = [];
          this.total = 0;
        }
        this.listLoading = false;
      });
    },
    handleAddPlan() {
      if (!this.selectedRoad || !this.inspectionDate) {
        this.$message.warning('请选择路段并输入巡检日期！');
        return;
      }

      let roadName = '';
      const selectedRoadData = this.roadList.find(road => road.id === this.selectedRoad);
      if (selectedRoadData) {
        roadName = selectedRoadData.name;
      }

      this.inspectionPlans.push({
        roadName,
        date: this.inspectionDate,
        status: 0
      });

      this.selectedRoad = null;
      this.inspectionDate = '';
      this.$message.success('巡检规划添加成功！');
    }
  }
};
</script>

<style scoped>
.filter-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
</style>
