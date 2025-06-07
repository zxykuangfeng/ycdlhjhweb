<template>
  <div class="app-container">
    <!-- 顶部容器 -->
    <div class="top-container">
      <!-- 基本信息卡片 -->
      <el-card class="info-card">
        <div class="header-container">
          <div>
            <span class="label-title">隐患编号：</span>
            <span class="value-id">{{ detailData.id || '暂无' }}</span>
          </div>
          <el-tag type="success" class="status-tag">{{ detailData.status }}</el-tag>
        </div>
        <el-row :gutter="20" class="info-row">
          <el-col :span="12" class="info-item"><strong>隐患场景：</strong> {{ detailData.scene }}</el-col>
          <el-col :span="12" class="info-item"><strong>隐患类别：</strong> {{ detailData.type }}</el-col>
          <el-col :span="12" class="info-item"><strong>检查项：</strong> {{ detailData.checkItem }}</el-col>
          <el-col :span="12" class="info-item"><strong>安全评分：</strong> <span class="safety-score">{{ detailData.safetyScore }}</span></el-col>
          <el-col :span="12" class="info-item"><strong>道路名称：</strong> {{ detailData.roadName }}</el-col>
          <el-col :span="12" class="info-item"><strong>道路等级：</strong> {{ detailData.roadLevel }}</el-col>
          <el-col :span="12" class="info-item"><strong>上报时间：</strong> {{ detailData.reportTime }}</el-col>
          <el-col :span="12" class="info-item"><strong>上报方式：</strong> {{ detailData.reportMethod }}</el-col>
        </el-row>
        <div class="description">
          <strong>隐患描述：</strong> {{ detailData.description }}
        </div>
        <div class="strategy-section">
  <h4 class="section-title">规范和治理对策</h4>

  <div class="strategy-item">
    <span class="strategy-label">检测标准：</span>
    <span class="strategy-text">{{ detailData.standard }}</span>
    <img
      v-if="detailData.testing_image"
      :src="detailData.testing_image"
      alt="检测标准图"
      class="strategy-image"
      @click="handlePreview(detailData.testing_image)"
    />
  </div>

  <div class="strategy-item">
    <span class="strategy-label">治理对策：</span>
    <span class="strategy-text">{{ detailData.strategy }}</span>
    <img
      v-if="detailData.counter_image"
      :src="detailData.counter_image"
      alt="治理对策图"
      class="strategy-image"
      @click="handlePreview(detailData.counter_image)"
    />
  </div>
</div>

      </el-card>
      
      <!-- 地图展示 -->
      <el-card class="map-card">
        <h4 class="section-title">隐患位置</h4>
        <div id="baiduMap" class="map-container"></div>
      </el-card>
    </div>
    
    <!-- 底部容器 -->
    <div class="bottom-container">
      <!-- 修复前后对比 -->
      <el-card class="comparison-card">
        <h4 class="section-title">修复前后对比</h4>
        <el-row :gutter="20">
          <el-col :span="12" class="comparison-item">
            <div class="comparison-header" style="height: 30px;background-color: #E4E6E3;line-height: 30px;">修复前</div>
            <img :src="detailData.beforeImage" alt="修复前" class="comparison-image" />
          </el-col>
          <el-col :span="12" class="comparison-item">
            <div class="comparison-header" style="height: 30px;background-color: #D6ECDC;line-height: 30px;">修复后</div>
            <div v-if="detailData.afterImage.length">
              <img :src="detailData.afterImage" alt="修复前" class="comparison-image" />

            </div>
            <div v-else class="no-image">暂无图片</div>
          </el-col>
        </el-row>
      </el-card>
      
      <!-- 审批流程 -->
      <el-card class="approval-card">
      <h4 class="section-title">审批流程</h4>
      <el-timeline>
        <el-timeline-item
  v-for="(step, index) in approvalSteps"
  :key="index"
  :timestamp="step.time"
  placement="top"
  class="approval-step"
>
  <p><strong>{{ step.status }}:{{ step.touname }}</strong></p>
  <p>审核人：{{ step.person }}</p>
  <p>意见：{{ step.comment }}</p>
</el-timeline-item>
      </el-timeline>
    </el-card>
    </div>

    <el-dialog
  :visible.sync="previewVisible"
  width="60%"
  top="10vh"
  :append-to-body="true"
  class="image-preview-dialog"
>
  <img :src="previewImage" alt="预览图" style="width: 100%" />
</el-dialog>
  </div>
</template>

<script>
import { pitfallDetail } from "@/api/road"; // 确保接口路径正确
export default {
  name: "LibraryDetail",
  data() {
    return {
      detailData: {
        id: null,
        scene: "",
        type: "",
        checkItem: "",
        safetyScore: "",
        roadName: "",
        roadLevel: "",
        reportTime: "",
        reportMethod: "",
        description: "",
        beforeImage: "",
        afterImage: "",
        standard: "",
        strategy: "",
        status: "",
        yhdj: null,
        status_name:"",
        location: { lng: 0, lat: 0 },
      },
      previewVisible: false,
    previewImage: '',
      map: null,
      marker: null,
      approvalSteps: [
        // { status: "待审核", person: "张三", comment: "提交初步审核", time: "2025-02-10 10:00" },
        { status: "待派发", person: "支队用户", comment: "审核通过，派发施工", time: "2025-02-11 14:30" },
        // { status: "已驳回", person: "王五", comment: "信息有误，需补充材料", time: "2025-02-12 09:45" },
        { status: "待施工", person: "大队用户", comment: "施工队已接单，准备施工", time: "2025-02-13 16:20" },
        { status: "已修复", person: "施工单位", comment: "施工完成，验收通过", time: "2025-02-14 18:00" }
      ]
    };
  },
  async mounted() {
    await this.fetchDetailData();
    this.initMap();
  },
  methods: {
    handlePreview(imgUrl) {
    this.previewImage = imgUrl
    this.previewVisible = true
  },
    async fetchDetailData() {
  const id = this.$route.query.id;
  if (!id) {
    this.$notify.error({ title: "错误", message: "缺少隐患 ID 参数" });
    return;
  }

  try {
    const response = await pitfallDetail(id);
    if (response.code === 0) {
      const data = response.data;

      // 处理审批流程数据
      const approvalSteps = data.op.map(item => ({
        status: item.act_name || "未知状态",
        person: item.uname || "未知审核人",
        comment: item.cont || "无备注",
        time: item.create_time || "未知时间"
      }));

      // 映射接口数据到 detailData
      this.detailData = {
        id: data.id,
        scene: data.yhcj_name || "未知场景",
        type: data.yhlb_name || "未知类别",
        checkItem: data.yhjcx_name || "未知检查项",
        safetyScore: data.score || "0",
        roadName: data.roadName || "未知道路",
        roadLevel: data.rtype_name || "未知等级",
        reportTime: data.create_time || "未知时间",
        reportMethod: data.yhly_name || "未知来源",
        description: data.yhdesc || "暂无描述",
        beforeImage: data.imgs ? `http://localhost:8081/${data.imgs}` : "",
        afterImage: data.repairImg ? JSON.parse(data.repairImg).map(img => `http://localhost:8081/${img}`) : [],
        testing_image: data.testing_image ? `${data.testing_image}` : '',
        counter_image: data.counter_image ? `${data.counter_image}` : '',
        standard: data.testing_standards || "暂无标准",
        strategy: data.countermeasures || "暂无对策",
        status: data.status_name,
        yhdj: data.yhdj,
        location: {
          lng: parseFloat(data.point.split(",")[0]) || 0,
          lat: parseFloat(data.point.split(",")[1]) || 0,
        },
      };

      // 更新审批流程
      this.approvalSteps = approvalSteps;
    } else {
      this.$notify.error({ title: "错误", message: response.msg || "获取数据失败" });
    }
  } catch (error) {
    console.error("获取隐患详情失败:", error);
    this.$notify.error({ title: "错误", message: "获取隐患详情失败" });
  }
},

    initMap() {
      if (!this.map) {
        this.map = new BMap.Map("baiduMap");
      }

      const { lng, lat } = this.detailData.location;
      if (!lng || !lat) {
        this.$notify.error({ title: "错误", message: "隐患位置信息缺失" });
        return;
      }

      const point = new BMap.Point(lng, lat);
      this.map.centerAndZoom(point, 15);
      this.map.enableScrollWheelZoom(true);

      // 根据隐患等级设置不同的图标
      let iconSrc;
      switch (this.detailData.yhdj) {
        case 1:
          iconSrc = require('@/assets/minorpitfall.png'); // 替换路径
          break;
        case 2:
          iconSrc = require('@/assets/generalpitfall.png'); // 替换路径
          break;
        case 3:
          iconSrc = require('@/assets/seriouspitfall.png'); // 替换路径
          break;
        case 4:
          iconSrc = require('@/assets/majorpitfall.png'); // 替换路径
          break;
        default:
          iconSrc = require('@/assets/pitfall.png'); // 替换路径
          break;
      }

      const icon = new BMap.Icon(iconSrc, new BMap.Size(40, 40), {
        anchor: new BMap.Size(20, 40),
        imageSize: new BMap.Size(20, 20),
      });

      this.marker = new BMap.Marker(point, { icon });
      this.map.addOverlay(this.marker);
    },
  },
};
</script>
<style scoped>
.app-container {
  padding: 20px;
  background-color: #f8f9fa;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.label-title {
  font-size: 18px;
  font-weight: bold;
  color: #666;
}

.value-id {
  font-size: 18px;
  font-weight: bold;
  color: #409EFF;
}

.status-tag {
  font-size: 14px;
  padding: 5px 10px;
  line-height: 18px;
}

.info-card,
.map-card,
.comparison-card,
.strategy-card {
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #ebeef5;
  border-radius: 8px;
}

.info-row {
  margin-bottom: 10px;
}

.info-item {
  font-size: 14px;
  color: #606266;
}

.safety-score {
  color: red;
  font-weight: bold;
}

.description {
  margin-top: 15px;
  font-size: 14px;
  color: #606266;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
}

.map-container {
  width: 100%;
  height: 400px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.comparison-item {
  text-align: center;
}

.comparison-header {
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: bold;
}

.comparison-image {
  width: 100%;
  height: auto;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.strategy-item {
  margin-bottom: 10px;
  font-size: 14px;
  color: #606266;
}
</style>
<style scoped>
.app-container {
  padding: 20px;
  background-color: #f8f9fa;
}

.top-container {
  display: flex;
  gap: 20px;
}

.info-card, .map-card {
  flex: 1;
}

.bottom-container {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.comparison-card, .approval-card {
  flex: 1;
}

.strategy-section {
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid #ddd;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.map-container {
  width: 100%;
  height: 400px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.comparison-image {
  width: 100%;
  height: auto;
  border-radius: 4px;
}
</style>

<style scoped>
.app-container {
  padding: 20px;
  background-color: #f8f9fa;
}

.top-container, .bottom-container {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.info-card, .map-card, .comparison-card, .approval-card {
  flex: 1;
  /* border-radius: 10px; */
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.comparison-image {
  width: 100%;
  height: auto;
  /* border-radius: 6px; */
}

.no-image {
  text-align: center;
  color: #999;
  font-style: italic;
}

.strategy-label {
  color: #409EFF;
  font-weight: 500;
  font-size: 15px;
  margin-right: 5px;
}

.strategy-text {
  font-family: "Microsoft YaHei", sans-serif;
  font-size: 14px;
  color: #333;
}

.strategy-image {
  display: block;
  margin-top: 8px;
  max-width: 100%;
  height: auto;
  border-radius: 6px;
  border: 1px solid #dcdfe6;
}


.approval-step {
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  padding: 10px;
  border-radius: 6px;
}

.approval-step:hover {
  background-color: #f0f9ff;
  box-shadow: 0 0 6px rgba(64, 158, 255, 0.4);
}

.approval-step:hover strong,
.approval-step:hover p {
  color: #409EFF;
}


.image-preview-dialog .el-dialog__body {
  padding: 0;
  text-align: center;
}
.strategy-image {
  cursor: pointer;
  transition: transform 0.3s ease;
}
.strategy-image:hover {
  transform: scale(1.05);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
}

</style>
