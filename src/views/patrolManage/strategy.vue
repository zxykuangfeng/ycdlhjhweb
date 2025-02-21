<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-plus"
        @click="openDialog"
      >添加巡检规划</el-button>
    </div>

    <!-- 巡检规划列表 -->
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
    </el-table>

    <!-- 添加巡检规划弹窗 -->
    <el-dialog title="添加巡检规划" :visible.sync="dialogVisible" width="500px">
      <el-form label-width="80px">
        <el-form-item label="巡检日期">
          <el-date-picker 
            v-model="inspectionDate" 
            type="date" 
            placeholder="选择巡检日期" 
            style="width: 100%;"
          />
        </el-form-item>

        <el-form-item label="路段">
          <el-select 
            v-model="selectedRoads" 
            multiple
            placeholder="请选择路段"
            style="width: 100%;"
          >
            <el-option 
              v-for="road in roadList" 
              :key="road.id" 
              :label="road.name" 
              :value="road.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="路口">
          <el-select 
            v-model="selectedCrossings" 
            multiple
            placeholder="请选择路口"
            style="width: 100%;"
          >
            <el-option 
              v-for="crossing in crossingList" 
              :key="crossing.id" 
              :label="crossing.name" 
              :value="crossing.id"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRoadSectionList, getRoadCrossingList, addInspectionPlan, inspectionPlanList, inspectionPlanDetail, inspectionPlanChange } from '@/api/road';

export default {
  name: 'InspectionPlan',
  data() {
    return {
      dialogVisible: false, // 控制弹窗显示
      inspectionDate: '', // 巡检日期
      roadList: [], // 路段数据
      crossingList: [], // 路口数据
      selectedRoads: [], // 选中的路段
      selectedCrossings: [], // 选中的路口
      inspectionPlans: [], // 巡检规划列表
    };
  },
  created() {
    this.fetchRoadsAndCrossings();
    this.fetchInspectionPlans(); // 调用获取巡检规划列表
  },
  methods: {
    // 获取路段和路口数据
    fetchRoadsAndCrossings() {
      getRoadSectionList().then(res => {
        if (res.code === 0) {
          this.roadList = res.data.data;
        }
      });

      getRoadCrossingList().then(res => {
        if (res.code === 0) {
          this.crossingList = res.data.data;
        }
      });
    },

    // 获取巡检规划列表
    fetchInspectionPlans() {
      inspectionPlanList().then(res => {
        if (res.code === 0) {
          this.inspectionPlans = res.data; // 更新巡检规划列表
        }
      });
    },

    // 查看巡检规划详情
    viewInspectionPlanDetail(id) {
      inspectionPlanDetail(id).then(res => {
        if (res.code === 0) {
          const plan = res.data;
          // 弹窗或其他形式展示巡检规划详情
          console.log('巡检规划详情:', plan);
        } else {
          this.$message.error('获取巡检规划详情失败');
        }
      });
    },

    // 修改巡检规划状态
    changeInspectionPlanStatus(id, newStatus) {
      inspectionPlanChange(id, { status: newStatus }).then(res => {
        if (res.code === 0) {
          this.$message.success('巡检规划状态更新成功');
          this.fetchInspectionPlans(); // 更新列表
        } else {
          this.$message.error('修改巡检规划状态失败');
        }
      });
    },

    // 打开弹窗
    openDialog() {
      this.dialogVisible = true;
    },

    // 确定添加巡检规划
    async handleSubmit() {
      if (!this.inspectionDate || this.selectedRoads.length === 0) {
        this.$message.warning('请选择巡检日期并至少选择一个路段！');
        return;
      }

      // 格式化日期为 'YYYY-MM-DD'
      const formattedDate = new Date(this.inspectionDate).toLocaleDateString('en-CA'); // en-CA 会自动格式化为 YYYY-MM-DD

      // 获取路段和路口名称
      const roadNames = this.selectedRoads.map(id => {
        const road = this.roadList.find(r => r.id === id);
        return road ? road.name : '未知路段';
      }).join(', ');

      const crossingNames = this.selectedCrossings.map(id => {
        const crossing = this.crossingList.find(c => c.id === id);
        return crossing ? crossing.name : '未知路口';
      }).join(', ');

      // 组织请求参数
      const requestData = {
        inspection_date: formattedDate,  // 使用格式化后的日期字符串
        section: this.selectedRoads, // 传递选中的路段 ID 数组
        crossing: this.selectedCrossings, // 传递选中的路口 ID 数组
      };

      // 调用 addInspectionPlan 接口
      try {
        const response = await addInspectionPlan(requestData);
        if (response.code === 0) {
          this.$message.success('巡检规划添加成功！');
          
          // 更新本地数据（也可以选择重新拉取列表）
          this.inspectionPlans.push({
            date: formattedDate,  // 使用格式化后的日期字符串
            roadNames,
            crossingNames,
            status: 0 // 默认待巡检
          });

          // 关闭弹窗并清空选择项
          this.dialogVisible = false;
          this.inspectionDate = '';
          this.selectedRoads = [];
          this.selectedCrossings = [];
        } else {
          this.$message.error(response.msg || '添加失败');
        }
      } catch (error) {
        console.error('提交巡检规划失败:', error);
        this.$message.error('请求失败，请检查网络或联系管理员');
      }
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