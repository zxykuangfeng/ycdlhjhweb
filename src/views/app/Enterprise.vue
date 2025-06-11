<template>
    <div class="submit-page" :style="{ backgroundImage: `url(${bgImage})` }">

        <div class="left-banner animate-fade-in">
      盐城市道路户籍化系统<br />施工企业提交审核
    </div>
      <div class="form-wrapper">
        <!-- 使用说明 -->
        <el-card class="usage-card">
          <div slot="header" class="card-header">
            使用说明
          </div>
          <div class="usage-text">
            请施工企业如实填写以下信息并上传审批材料。<br />
            材料需加盖单位公章，格式为 PDF 或清晰图片。
          </div>
        </el-card>
  
        <!-- 填写注意事项 -->
        <el-card class="hint-card">
          <div class="hint-title">填写注意事项</div>
          <ul class="hint-list">
            <li>所有信息需与营业执照信息一致。</li>
            <li>联系方式应为负责人真实有效手机号。</li>
            <li>上传材料需为一页或多页合并后的 PDF 或图片。</li>
          </ul>
        </el-card>
  
        <!-- 提交表单 -->
        <el-card class="form-card">
          <div slot="header" class="card-header">
            <img :src="rightIcon" class="icon" />
            企业提交材料
            <img :src="leftIcon" class="icon" />
          </div>
  
          <el-form :model="form" label-width="100px" class="form-body">
            <el-form-item label="企业名称">
              <el-input v-model="form.enterpriseName" placeholder="请输入企业名称" />
            </el-form-item>
  
            <el-form-item label="联系人">
              <el-input v-model="form.contactPerson" placeholder="请输入联系人" />
            </el-form-item>
  
            <el-form-item label="负责人">
              <el-input v-model="form.manager" placeholder="请输入负责人" />
            </el-form-item>
  
            <el-form-item label="联系方式">
              <el-input v-model="form.phone" placeholder="请输入联系电话" />
            </el-form-item>
  
            <el-form-item label="审批材料">
              <el-upload
                :limit="1"
                :show-file-list="false"
                :before-upload="beforeUpload"
                action="#"
                :http-request="handleFileUpload"
              >
                <el-button type="primary" size="mini">点击上传</el-button>
                <span class="file-name" v-if="fileName">已选择：{{ fileName }}</span>
              </el-upload>
            </el-form-item>
  
            <el-form-item>
              <el-button type="success" @click="submitForm">提交审核</el-button>
            </el-form-item>
          </el-form>
        </el-card>
  
        <!-- 审核流程提示 -->
        <el-card class="flow-card">
          <div class="flow-title">提交后审核流程：</div>
          <div class="flow-steps">
            提交 → 系统初审 → 管理员复核 → 审核结果短信通知
          </div>
        </el-card>
      </div>
  
      <!-- 右侧标语 -->
     
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        bgImage: require('@/assets/bg.png'),
        rightIcon: require('@/assets/right.png'),
        leftIcon: require('@/assets/left.png'),
        fileName: '',
        fileData: null,
        form: {
          enterpriseName: '',
          contactPerson: '',
          manager: '',
          phone: '',
        }
      };
    },
    methods: {
      beforeUpload(file) {
        // 阻止自动上传
        return false;
      },
      handleFileUpload(param) {
        this.fileName = param.file.name;
        this.fileData = param.file;
      },
      async submitForm() {
        if (!this.form.enterpriseName || !this.form.phone || !this.fileData) {
          this.$message.error('请完整填写信息并上传材料');
          return;
        }
  
        const formData = new FormData();
        Object.entries(this.form).forEach(([k, v]) => formData.append(k, v));
        formData.append('material', this.fileData);
  
        try {
          const res = await this.$axios.post('/api/submitCompanyMaterial', formData);
          if (res.data.code === 0) {
            this.$message.success('提交成功，等待审核');
          } else {
            this.$message.error(res.data.msg || '提交失败');
          }
        } catch (e) {
          console.error('提交出错', e);
          this.$message.error('提交过程中出现错误');
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .submit-page {
  width: 100%;
  height: 100vh;
  
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  backdrop-filter: blur(2px);
   display: flex;
   flex-direction: row;           /* ✅ 正常从左到右排列 */
  justify-content: space-between; /* 或者用 space-around / flex-start 都可 */
  padding: 60px 300px;
  padding-right: 640px;
  color: white;
  font-family: "Microsoft YaHei", sans-serif;
  position: relative;
}

.form-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 520px;
  margin-left: auto;  /* 自动推到右侧 */
  margin-right: 80px;
}

/* 卡片通用 */
.usage-card,
.form-card,
.hint-card,
.flow-card {
  background: rgba(15, 32, 66, 0.85);
  border: 1px solid #3877f2;
  border-radius: 10px;
  color: white;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
  color: #89c0ff;
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon, .tip-icon {
  width: 20px;
  height: 20px;
}

/* 使用说明文字 */
.usage-text {
  font-size: 14px;
  color: #d0d8f3;
  line-height: 1.6;
}

/* 注意事项 */
.hint-title {
  font-weight: bold;
  color: #ffc107;
  font-size: 16px;
  margin-bottom: 5px;
}
.hint-list {
  padding-left: 20px;
  font-size: 13px;
  color: #ffd700;
  line-height: 1.8;
}

/* 审核流程提示 */
.flow-title {
  font-weight: bold;
  font-size: 16px;
  color: #42b983;
  margin-bottom: 8px;
}
.flow-steps {
  font-size: 14px;
  color: #a8d4f9;
}

/* el-input 背景色优化 */
.form-body >>> .el-input__inner {
  background-color: #2A3A65;
  color: white;
  border: none;
}

.file-name {
  margin-left: 10px;
  color: #ccc;
  font-size: 13px;
}

/* 右侧标语 */
.right-banner {
  position: absolute;
  right: 100px;
  top: 120px;
  font-size: 28px;
  font-weight: bold;
  text-align: right;
  line-height: 1.6;
  background: linear-gradient(to right, #6ab3f0, #ffffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.4);
}

.animate-fade-in {
  animation: fadeIn 1.2s ease-in-out forwards;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.left-banner {
  width: 300px;
  margin-right: 80px;
  margin-top: 40px;
  font-size: 28px;
  font-weight: bold;
  text-align: left;
  line-height: 1.6;
  background: linear-gradient(to right, #6ab3f0, #ffffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.4);
}
@media (max-width: 768px) {
  .submit-page {
    flex-direction: column;
    padding: 20px;
    align-items: center;
    height: auto;
  }

  .left-banner {
    width: 100%;
    margin: 0 0 20px 0;
    font-size: 20px;
    text-align: center;
    background: none;
    -webkit-text-fill-color: white;
    text-shadow: none;
  }

  .form-wrapper {
    width: 100%;
    margin: 0;
    padding: 10px;
  }

  .card-header {
    font-size: 16px;
  }

  .icon, .tip-icon {
    width: 16px;
    height: 16px;
  }

  .usage-text,
  .hint-list,
  .flow-steps {
    font-size: 13px;
  }

  .form-body >>> .el-input__inner {
    font-size: 14px;
  }

  .file-name {
    font-size: 12px;
  }
}
  </style>
  