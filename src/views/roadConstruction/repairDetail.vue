<template>
  <div class="app-container">
    <!-- 顶部信息 -->
    <div class="header-container">
      <div class="header-item">
        <span class="label-title">申请编号：</span>
        <span class="value">{{ materialData.id || '暂无' }}</span>
      </div>
      <div class="header-item">
        <span class="label-title">创建时间：</span>
        <span class="value">{{ formatTimestamp(materialData.create_time) }}</span>
      </div>
    </div>

    <!-- 基本信息卡片 -->
    <el-card class="info-card">
      <h3 class="card-title">基本信息</h3>
      <el-row :gutter="20" class="info-row">
        <el-col :span="8" class="info-item">
          <strong>项目名称：</strong>{{ materialData.name || '暂无' }}
        </el-col>
        <el-col :span="8" class="info-item">
          <strong>施工方式：</strong>{{ materialData.construction_method || '暂无' }}
        </el-col>
      </el-row>

      <h3 class="card-title">建设单位</h3>
      <el-row :gutter="20" class="info-row">
        <el-col :span="8" class="info-item">
          <strong>单位名称：</strong>{{ materialData.build_unit_name || '暂无' }}
        </el-col>
        <el-col :span="8" class="info-item">
          <strong>负责人：</strong>{{ materialData.build_unit_leader || '暂无' }}
        </el-col>
        <el-col :span="8" class="info-item">
          <strong>联系方式：</strong>{{ materialData.build_unit_contact || '暂无' }}
        </el-col>
      </el-row>

      <h3 class="card-title">施工单位</h3>
      <el-row :gutter="20" class="info-row">
        <el-col :span="8" class="info-item">
          <strong>单位名称：</strong>{{ materialData.construction_unit_name || '暂无' }}
        </el-col>
        <el-col :span="8" class="info-item">
          <strong>负责人：</strong>{{ materialData.construction_unit_leader || '暂无' }}
        </el-col>
        <el-col :span="8" class="info-item">
          <strong>联系方式：</strong>{{ materialData.construction_unit_contact || '暂无' }}
        </el-col>
      </el-row>
    </el-card>

    <!-- 上传材料 -->
    <el-card class="materials-card">
      <h3 class="card-title">上传材料</h3>
      <el-row :gutter="20" class="materials-row">
        <el-col :span="24" v-for="(files, key) in materialFiles" :key="key" class="material-section">
          <div class="material-title">{{ fileLabels[key] }}</div>
          <ul class="material-list">
            <li v-for="(file, index) in files" :key="index">
              <a :href="getFileUrl(file)" :download="file" class="file-link">{{ file }}</a>
            </li>
          </ul>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { seeWorks } from '@/api/road';

export default {
  name: 'ViewMaterials',
  data() {
    return {
      materialData: {},
      fileLabels: {
        traffic_plan: '交通设施方案',
        fence_plan: '围挡方案',
        construction_plan: '施工方案',
        construction_drawing: '施工图纸',
        safety_commitment: '安全施工承诺书',
        change_plan: '导改方案',
        application_form: '施工申请单',
        security_plan: '安保方案'
      }
    };
  },
  computed: {
    materialFiles() {
      return Object.keys(this.fileLabels).reduce((files, key) => {
        if (this.materialData[key] && Array.isArray(this.materialData[key])) {
          files[key] = this.materialData[key];
        }
        return files;
      }, {});
    }
  },
  methods: {
    async fetchMaterialData() {
      const id = this.$route.query.id;
      if (!id) {
        this.$message.error('缺少申请编号');
        return;
      }
      try {
        const response = await seeWorks(id);
        if (response.code === 0) {
          this.materialData = response.data;
        } else {
          this.$message.error('获取申请材料失败');
        }
      } catch (error) {
        console.error('Error fetching material data:', error);
      }
    },
    formatTimestamp(timestamp) {
      if (!timestamp) return '暂无';
      const date = new Date(timestamp * 1000);
      return date.toLocaleString();
    },
    getFileUrl(fileName) {
      return `http://roadserver.lysoo.com:8081/${fileName}`;
    }
  },
  created() {
    this.fetchMaterialData();
  }
};
</script>

<style scoped>
.app-container {
  padding: 20px;
  background-color: #f5f5f5;
}

.header-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 10px 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.header-item {
  font-size: 14px;
}

.label-title {
  font-weight: bold;
  color: #333;
}

.value {
  color: #409EFF;
}

.info-card,
.materials-card {
  margin-bottom: 20px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 20px;
}

.info-row {
  margin-bottom: 15px;
}

.info-item {
  font-size: 14px;
  color: #606266;
}

.material-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.material-list {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.material-list li {
  margin-bottom: 5px;
}

.file-link {
  color: #409EFF;
  text-decoration: underline;
}

.file-link:hover {
  color: #66b1ff;
}
</style>
