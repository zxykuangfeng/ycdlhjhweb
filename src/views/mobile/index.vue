<template>
  <div class="collect-page">
    <!-- 页面标题 -->
    <h1>隐患采集</h1>

    <!-- 采集按钮 -->
    <div class="start-box">
      <button @click="startCollection" v-if="!isCapturing">开始采集</button>
    </div>

    <!-- 视频与拍照功能 -->
    <div class="camera-box" v-if="isCapturing">
      <video ref="video" width="100%" height="auto" autoplay></video>
      <canvas ref="canvas" style="display: none;"></canvas>
      <button @click="capturePhoto">拍照</button>
    </div>

    <!-- 表单部分 -->
    <div class="form-box" v-if="capturedImage">
      <!-- 显示拍照后的图片 -->
      <div class="photo-preview">
        <h3>拍摄照片</h3>
        <img :src="capturedImage" alt="Captured" width="100%" />
      </div>

      <!-- 身份选择 -->
      <el-form :model="formData" label-width="100px">
        <el-form-item label="身份选择">
          <el-select v-model="formData.identity" placeholder="请选择身份">
            <el-option label="交警大队" value="交警大队"></el-option>
            <el-option label="交警支队" value="交警支队"></el-option>
            <el-option label="普通采集" value="普通采集"></el-option>
          </el-select>
        </el-form-item>

        <!-- 地址 -->
        <el-form-item label="地址">
          <el-input v-model="formData.address" placeholder="请输入地址"></el-input>
        </el-form-item>

        <!-- 分类选择 -->
        <el-form-item label="分类选择">
          <el-select v-model="formData.category" placeholder="请选择分类">
            <el-option label="隐患" value="0"></el-option>
            <el-option label="设施" value="1"></el-option>
          </el-select>
        </el-form-item>

        <!-- 备注 -->
        <el-form-item label="备注">
          <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注"></el-input>
        </el-form-item>

        <!-- 提交按钮 -->
        <el-form-item>
          <el-button type="primary" @click="submitData">确认提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CollectPage',
  data() {
    return {
      isCapturing: false, // 是否开始采集
      capturedImage: null, // 拍摄的照片
      latitude: null, // 纬度
      longitude: null, // 经度
      formData: {
        identity: '',
        address: '',
        category: '',
        remark: '',
      },
    };
  },
  methods: {
    // 开始采集
    startCollection() {
      this.isCapturing = true;
      this.startCamera();
    },

    // 启动摄像头
    startCamera() {
      const constraints = { video: { facingMode: 'environment' } }; // 使用后置摄像头
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          this.$refs.video.srcObject = stream;
        })
        .catch((err) => {
          console.error('Error accessing the camera: ', err);
        });
    },

    // 拍照并显示图像
    capturePhoto() {
      const video = this.$refs.video;
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext('2d');

      // 设置 canvas 尺寸
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // 绘制视频当前帧到 canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // 转换为图片 URL
      this.capturedImage = canvas.toDataURL('image/png');
    },

    // 获取当前位置
    getLocation() {
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              this.latitude = position.coords.latitude;
              this.longitude = position.coords.longitude;
              resolve({
                latitude: this.latitude,
                longitude: this.longitude,
              });
            },
            (error) => {
              console.error('Error getting location:', error);
              reject(error);
            }
          );
        } else {
          console.error('Geolocation is not supported by this browser.');
          reject('Geolocation not supported');
        }
      });
    },

    // 提交数据
    async submitData() {
      try {
        // 获取当前位置
        const position = await this.getLocation();

        // 提交到服务端
        const payload = {
          photo: this.capturedImage, // 图像 base64 数据
          identity: this.formData.identity,
          address: this.formData.address,
          category: this.formData.category,
          remark: this.formData.remark,
          latitude: position.latitude,
          longitude: position.longitude,
        };

        console.log('提交数据:', payload);

        // 示例请求：将数据发送到服务端（替换为实际 API）
        const response = await fetch('/api/hazard-collection', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const result = await response.json();
        if (result.success) {
          this.$message.success('数据提交成功');
          this.resetForm();
        } else {
          this.$message.error('数据提交失败，请重试');
        }
      } catch (error) {
        console.error('提交失败:', error);
        this.$message.error('获取位置或提交失败，请检查网络');
      }
    },

    // 重置表单
    resetForm() {
      this.isCapturing = false;
      this.capturedImage = null;
      this.formData = {
        identity: '',
        address: '',
        category: '',
        remark: '',
      };
    },
  },
};
</script>

<style scoped>
.collect-page {
  padding: 20px;
  text-align: center;
}

.start-box button,
button {
  padding: 10px 20px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #66b1ff;
}

.camera-box video {
  border: 2px solid #ccc;
  margin-top: 10px;
}

.photo-preview img {
  margin-top: 10px;
  border: 1px solid #ddd;
}

.form-box {
  margin-top: 20px;
  text-align: left;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}
</style>
