<template>
  <div class="app-container">
    <!-- 顶部：隐患编号与状态 -->
    <div class="header-container">
      <div>
        <span class="label-title">隐患编号：</span>
        <span class="value-id">{{ detailData.id || '暂无' }}</span>
      </div>
      <el-tag type="success" class="status-tag" >{{ detailData.status }}</el-tag>
    </div>

    <!-- 基本信息卡片 -->
    <el-card class="info-card">
      <el-row :gutter="20" class="info-row">
        <el-col :span="8" class="info-item"><strong>隐患场景：</strong> {{ detailData.scene }}</el-col>
        <el-col :span="8" class="info-item"><strong>隐患类别：</strong> {{ detailData.type }}</el-col>
        <el-col :span="8" class="info-item"><strong>检查项：</strong> {{ detailData.checkItem }}</el-col>
        <el-col :span="8" class="info-item"><strong>安全评分：</strong> <span class="safety-score">{{ detailData.safetyScore }}</span></el-col>
        <el-col :span="8" class="info-item"><strong>道路名称：</strong> {{ detailData.roadName }}</el-col>
        <el-col :span="8" class="info-item"><strong>道路等级：</strong> {{ detailData.roadLevel }}</el-col>
        <el-col :span="8" class="info-item"><strong>上报时间：</strong> {{ detailData.reportTime }}</el-col>
        <el-col :span="8" class="info-item"><strong>上报方式：</strong> {{ detailData.reportMethod }}</el-col>
      </el-row>
      <div class="description">
        <strong>隐患描述：</strong> {{ detailData.description }}
      </div>
    </el-card>

    <!-- 地图展示 -->
    <el-card class="map-card">
      <h4 class="section-title">隐患位置</h4>
      <div id="baiduMap" class="map-container"></div>
    </el-card>

    <!-- 修复前后对比 -->
    <el-card class="comparison-card">
      <h4 class="section-title">修复前后对比</h4>
      <el-row :gutter="20">
        <el-col :span="12" class="comparison-item">
          <div class="comparison-header">修复前</div>
          <img :src="detailData.beforeImage" alt="修复前" class="comparison-image" />
        </el-col>
        <el-col :span="12" class="comparison-item">
          <div class="comparison-header">修复后</div>
          <img :src="detailData.afterImage" alt="修复后" class="comparison-image" />
        </el-col>
      </el-row>
    </el-card>

    <!-- 规范和治理对策 -->
    <el-card class="strategy-card">
      <h4 class="section-title">规范和治理对策</h4>
      <p class="strategy-item">
        <strong>检测标准：</strong> {{ detailData.standard }}
      </p>
      <p class="strategy-item">
        <strong>治理对策：</strong> {{ detailData.strategy }}
      </p>
    </el-card>
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
      map: null,
      marker: null,
    };
  },
  async mounted() {
    await this.fetchDetailData();
    this.initMap();
  },
  methods: {
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
            beforeImage: data.imgs ? `http://localhost:9527/${data.imgs}` : "", // 替换真实路径
            afterImage: data.repairImg ? `http://localhost:9527/${data.repairImg}` : "", // 替换真实路径
            standard: data.testing_standards || "暂无标准",
            strategy: data.countermeasures || "暂无对策",
            status: data.status_name,
            yhdj: data.yhdj,
            location: {
              lng: parseFloat(data.point.split(",")[0]) || 0,
              lat: parseFloat(data.point.split(",")[1]) || 0,
            },
          };
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
