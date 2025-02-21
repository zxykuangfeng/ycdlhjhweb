<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="drag" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">总隐患数</div>
            <count-to :start-val="0" :end-val="countData.totalHazards" :duration="2600" class="card-panel-num" />
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="link" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">规划查询里程数</div>
            <count-to :start-val="0" :end-val="countData.plannedMileage" :duration="3000" class="card-panel-num" />
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="guide" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">实际查询里程数</div>
            <count-to :start-val="0" :end-val="countData.actualMileage" :duration="3200" class="card-panel-num" />
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-shopping">
            <svg-icon icon-class="user" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">巡查车数</div>
            <count-to :start-val="0" :end-val="countData.inspectionCars" :duration="3600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 新增：ECharts 柱状图 -->
    <el-row style="background:#fff;padding:16px;margin-bottom:32px;margin-top: 30px;">
      <!-- <h3 style="text-align: center;">隐患场景统计</h3> -->
      <div id="hazardStatsChart" style="width: 100%; height: 400px;"></div>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import CountTo from 'vue-count-to'
import { adminCount } from "@/api/road"

export default {
  name: 'DashboardAdmin',
  components: {
    CountTo
  },
  data() {
    return {
      countData: {
        totalHazards: 0, // 隐患数（val1）
        plannedMileage: 0, // 规划查询里程数（val2）
        actualMileage: 0, // 实际查询里程数（val3）
        inspectionCars: 0 // 巡查车数（val4）
      },
      hazardCategories: [], // 场景类别（X 轴）
      hazardValues: [] // 隐患数量（Y 轴）
    }
  },
  mounted() {
    this.fetchAdminCount()
  },
  methods: {
    async fetchAdminCount() {
      try {
        const response = await adminCount()
        if (response.code === 0 && response.data) {
          this.countData.totalHazards = response.data.val1 || 0
          this.countData.plannedMileage = response.data.val2 || 0
          this.countData.actualMileage = response.data.val3 || 0
          this.countData.inspectionCars = response.data.val4 || 0

          if (response.data.val5 && response.data.val5.length === 2) {
            this.hazardCategories = response.data.val5[0] || []  // X 轴：场景类别
            this.hazardValues = response.data.val5[1] || [] // Y 轴：对应数量
          }

          this.initHazardChart() // 初始化柱状图
        } else {
          console.error("获取 adminCount 失败:", response.msg)
        }
      } catch (error) {
        console.error("adminCount 接口请求错误:", error)
      }
    },

    initHazardChart() {
      const chartDom = document.getElementById('hazardStatsChart')
      if (!chartDom) return

      const myChart = echarts.init(chartDom)

      const option = {
        title: {
          text: '不同场景的隐患数量统计',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: this.hazardCategories, // 使用 val5[0] 作为 X 轴
          axisLabel: {
            rotate: 30,
            interval: 0
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '隐患数量',
            type: 'bar',
            data: this.hazardValues, // 使用 val5[1] 作为 Y 轴
            barWidth: '50%',
            itemStyle: {
              color: '#409EFF'
            }
          }
        ]
      }

      myChart.setOption(option)
      window.addEventListener('resize', () => myChart.resize())
    }
  }
}
</script>




<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  height: 100%;
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  position: relative;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.panel-group {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.card-panel {
  height: 130px;
  width: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #ffffff, #f3f6fb);
  border-radius: 15px;
  box-shadow: 4px 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
}

.card-panel:hover {
  transform: scale(1.08);
  box-shadow: 6px 6px 25px rgba(0, 0, 0, 0.15);
}

.card-panel-icon-wrapper {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-left: 20px;
  background: rgba(0, 162, 255, 0.1);
}

.card-panel-description {
  flex-grow: 1;
  text-align: center;
  font-weight: bold;
  color: #37474f;
}

.card-panel-text {
  font-size: 18px;
  color: #455a64;
  margin-bottom: 10px;
}

.card-panel-num {
  font-size: 22px;
  color: #0277bd;
}

.chart-container {
  background: #ffffff;
  padding: 20px;
  margin-top: 25px;
  border-radius: 15px;
  box-shadow: 3px 3px 15px rgba(0, 0, 0, 0.1);
}

.chart-title {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: #37474f;
  margin-bottom: 15px;
}

.chart-box {
  width: 100%;
  height: 400px;
  border-radius: 10px;
}
</style>