<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              总隐患数
            </div>
            <count-to
              :start-val="0"
              :end-val="133"
              :duration="2600"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="message" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              已经修复的隐患数
            </div>
            <count-to
              :start-val="0"
              :end-val="113"
              :duration="3000"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="money" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              待修复的隐患数
            </div>
            <count-to
              :start-val="0"
              :end-val="20"
              :duration="3200"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-shopping">
            <svg-icon icon-class="shopping" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              累计修复的隐患数
            </div>
            <count-to
              :start-val="0"
              :end-val="500"
              :duration="3600"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <router-link to="/hazardManage/pendingApproval">
          <div class="pan-btn pink-btn">
            待审批隐患
            <span
              class="num"
            >(
              <count-to
                :start-val="0"
                :end-val="10"
                :duration="3200"
                class="card-panel-num"
              />)</span>
          </div></router-link>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <router-link to="/constructionManage/pendingApproval">
          <div class="pan-btn green-btn">
            待审批占道施工
            <span
              class="num"
            >( {{ 5 }} )</span>
          </div></router-link>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <router-link to="/hazardManage/pendingFix">
          <div class="pan-btn yellow-btn">
            待修复隐患
            <span
              class="num"
            >( {{ 20 }} )</span>
          </div></router-link>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <router-link to="/safetyScore">
          <div class="pan-btn tiffany-btn">
            安全评分库
            <span class="num">( {{ 90 }} )</span>
          </div></router-link>
      </el-col>
    </el-row>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <bar-chart :chart-data="chartData" />
    </el-row>
    <el-row :gutter="24">
      <el-col
        :xs="{ span: 24 }"
        :sm="{ span: 24 }"
        :md="{ span: 24 }"
        :lg="{ span: 24 }"
        :xl="{ span: 24 }"
        style="margin-bottom:30px;"
      >
        <div style="padding-top:35px;" class="progress-item">
          <span>季度隐患较上期增长</span>
          <el-progress
            :text-inside="true"
            :stroke-width="20"
            :percentage="70"
            style="margin:10px 0;"
          />
        </div>
        <div class="progress-item">
          <span>季度评分较上期增长</span>
          <el-progress
            :text-inside="true"
            :stroke-width="20"
            :percentage="90"
            status="success"
            style="margin:10px 0;"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import BarChart from './components/BarChart'
import CountTo from 'vue-count-to'

export default {
  name: 'DashboardAdmin',
  components: {
    BarChart,
    CountTo
  },
  data() {
    return {
      chartData: {
        totalHazards: [
          133, 233, 123, 123, 234, 452, 543, 345, 632, 345, 435, 234
        ],
        fixedHazards: [
          113, 213, 123, 124, 235, 456, 543, 345, 635, 344, 443, 213
        ]
      },
      countData: {
        totalHazards: 133,
        fixedHazards: 113,
        pendingHazards: 20,
        totalFixedHazards: 500,
        pendingApprovalHazards: 10,
        pendingApprovalConstruction: 5,
        pendingFixHazards: 20,
        safetyScore: 90
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  height: 100%;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
.card-panel {
  height: 108px;
  cursor: pointer;
  font-size: 12px;
  position: relative;
  overflow: hidden;
  color: #666;
  background: #fff;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.05);

  &:hover {
    .card-panel-icon-wrapper {
      color: #fff;
    }

    .icon-people {
      background: #40c9c6;
    }

    .icon-message {
      background: #36a3f7;
    }

    .icon-money {
      background: #f4516c;
    }

    .icon-shopping {
      background: #34bfa3;
    }
  }

  .icon-people {
    color: #40c9c6;
  }

  .icon-message {
    color: #36a3f7;
  }

  .icon-money {
    color: #f4516c;
  }

  .icon-shopping {
    color: #34bfa3;
  }

  .card-panel-icon-wrapper {
    float: left;
    margin: 14px 0 0 14px;
    padding: 16px;
    transition: all 0.38s ease-out;
    border-radius: 6px;
  }

  .card-panel-icon {
    float: left;
    font-size: 48px;
  }

  .card-panel-description {
    float: right;
    font-weight: bold;
    margin: 26px;
    margin-left: 0px;

    .card-panel-text {
      line-height: 18px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 16px;
      margin-bottom: 12px;
    }

    .card-panel-num {
      font-size: 20px;
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
.num {
  font-size: 18px;
}
.pan-btn {
  width: 100%;
  font-size: 14px;
  cursor: pointer;
  margin: 20px 0;
  padding-top: 20px;
  padding-bottom: 20px;
}
</style>
