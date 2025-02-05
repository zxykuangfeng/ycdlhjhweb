<template>
  <div class="app-container">
    <!-- 过滤器 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="请输入巡查车名"
        style="width: 200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >新增巡查车</el-button>
    </div>

    <!-- 巡查车展示 -->
    <div class="car-display-container">
      <img :src="carBgImage" alt="巡查车" class="car-image" />
      <div class="info-wrapper">
        <div class="device-info" :style="{ backgroundImage: `url(${carBg2Image})` }">
          <p class="vehicle-info-item" v-for="device in carDevices" :key="device">
            <span></span>
            <strong>设备:</strong> {{ device }}
          </p>
        </div>
        <div class="car-info" :style="{ backgroundImage: `url(${carBg2Image})` }">
          <p class="vehicle-info-item">
            <span></span>
            <strong>类型:</strong> {{ carInfo.type }}
          </p>
          <p class="vehicle-info-item">
            <span></span>
            <strong>巡查车名:</strong> {{ carInfo.name }}
          </p>
          <p class="vehicle-info-item">
            <span></span>
            <strong>巡查车牌:</strong> {{ carInfo.plate }}
          </p>
          <p class="vehicle-info-item">
            <span></span>
            <strong>巡查部门:</strong> {{ carInfo.department }}
          </p>
          <el-button type="success" @click="handleUpdate(carInfo)" class="switch-car-button">修改信息</el-button>
          <el-button type="primary" @click="nextCar" class="switch-car-button">下一辆</el-button>
          
        </div>
      </div>
    </div>

    <!-- 弹框: 新增/修改巡查车 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-form :model="carForm" label-width="100px" :rules="rules" ref="carFormRef">
        <el-form-item label="巡查车编号" prop="code">
          <el-input v-model="carForm.code"></el-input>
        </el-form-item>
        <el-form-item label="巡查车名" prop="name">
          <el-input v-model="carForm.name"></el-input>
        </el-form-item>
        <el-form-item label="巡查车牌" prop="plate">
          <el-input v-model="carForm.plate"></el-input>
        </el-form-item>
        <el-form-item label="所属部门" prop="department">
          <el-select v-model="carForm.department" placeholder="请选择所属部门">
            <el-option
            v-for="(value, key) in userList"
              :key="key"
              :label="value.remark"
              :value="value.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="carForm.remark" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves';
import { getUser } from '@/api/user'; // 引入获取部门接口

export default {
  name: 'InspectionCarManagement',
  directives: { waves },
  data() {
    return {
      listQuery: {
        name: ''
      },
      carBgImage: require('@/assets/car.jpg'),
      carBg2Image: require('@/assets/car2.png'),
      carIndex: 0,
      carInfoList: [
        {
          type: '四轮机动车',
          name: '01',
          plate: '10',
          department: '盐城市政'
        }
      ],
      carDevicesList: [
        ['高精度摄像头', '灵境AI算法边缘主机', '实时数据采集器']
      ],
      // 弹框数据
      dialogVisible: false,
      dialogTitle: '新增巡查车',
      carForm: {
        code: '',
        name: '',
        plate: '',
        department: '',
        remark: ''
      },
      userList: [], // 部门列表
      rules: {
        code: [{ required: true, message: '请输入巡查车编号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入巡查车名', trigger: 'blur' }],
        plate: [{ required: true, message: '请输入巡查车牌', trigger: 'blur' }],
        department: [{ required: true, message: '请选择所属部门', trigger: 'change' }]
      }
    };
  },
  computed: {
    carInfo() {
      return this.carInfoList[this.carIndex];
    },
    carDevices() {
      return this.carDevicesList[this.carIndex];
    }
  },
  methods: {
    handleFilter() {
      console.log('Filter:', this.listQuery.name);
    },
    handleCreate() {
      this.dialogTitle = '新增巡查车';
      this.dialogVisible = true;
      this.carForm = { code: '', name: '', plate: '', department: '', remark: '' };
      this.getDepartmentList();
    },
    handleUpdate(car) {
      this.dialogTitle = '修改巡查车';
      this.dialogVisible = true;
      this.carForm = { ...car };
      this.getDepartmentList();
    },
    submitForm() {
      this.$refs.carFormRef.validate((valid) => {
        if (valid) {
          console.log('提交数据:', this.carForm);
          // 提交接口逻辑
          this.dialogVisible = false;
          this.$message.success('提交成功');
        }
      });
    },
    getDepartmentList() {
      getUser(this.listQuery).then((res) => {
        if (res.status === 'S') {
          this.userList = res.data.data;
        } else {
          this.userList = [];
        }
      });
    },
    nextCar() {
      this.carIndex = (this.carIndex + 1) % this.carInfoList.length;
    }
  }
};
</script>

<style scoped>
/* 通用容器 */
.app-container {
  padding: 20px;
  background-color: #f7f8fc;
  min-height: 100vh;
  box-sizing: border-box;
}

/* 过滤器容器 */
.filter-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;
}

.filter-container .filter-item {
  margin-right: 10px;
}

.filter-container .el-button {
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.filter-container .el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.15);
}

/* 巡查车展示容器 */
.car-display-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-top: 30px;
  gap: 20px;
}

/* 巡查车图片 */
.car-image {
  width: 45%;
  height: auto;
  border-radius: 15px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.car-image:hover {
  transform: scale(1.05);
}

/* 信息展示容器 */
.info-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 45%;
  gap: 20px;
}

.device-info,
.car-info {
  padding: 20px;
  background-size: cover;
  background-position: center;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  color: #333;
  background-color: #ffffff;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.device-info:hover,
.car-info:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  transform: translateY(-5px);
}

/* 信息项 */
.car-info p,
.device-info p {
  margin: 10px 0;
  font-size: 16px;
  line-height: 1.6;
  position: relative;
  padding-left: 20px;
}

.vehicle-info-item span {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 50%;
  width: 8px;
  height: 8px;
  background-color: #4a9bff;
  border: 2px solid #3887fc;
  z-index: 1;
  box-sizing: content-box;
}

/* 按钮样式 */
.switch-car-button {
  margin-top: 20px;
  width: 100%;
  padding: 10px;
  font-size: 14px;
  font-weight: bold;
  color: #ffffff;
  border-radius: 8px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.switch-car-button[type="primary"] {
  background-color: #409eff;
  border: 1px solid #3a8ee6;
}

.switch-car-button[type="primary"]:hover {
  background-color: #66b1ff;
}

/* .switch-car-button[type="success"] {
  background-color: #67c23a;
  border: 1px solid #5cad33;
}

.switch-car-button[type="success"]:hover {
  background-color: #85d472;
} */

/* 弹框样式 */
.el-dialog {
  border-radius: 15px;
  box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.2);
}

.el-dialog__header {
  background-color: #f5f5f5;
  font-weight: bold;
  font-size: 18px;
  color: #333;
  border-bottom: 1px solid #ebebeb;
  padding: 15px 20px;
}

.el-dialog__body {
  padding: 20px;
}

.el-dialog__footer {
  background-color: #f5f5f5;
  padding: 15px 20px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #ebebeb;
}

/* 表单样式 */
.el-form-item__label {
  color: #333;
  font-weight: bold;
  font-size: 14px;
}

.el-form-item .el-input__inner {
  border-radius: 8px;
}

.el-form-item .el-select {
  border-radius: 8px;
}

/* 悬停和焦点样式 */
.el-form-item .el-input__inner:hover,
.el-form-item .el-input__inner:focus {
  border-color: #409eff;
  box-shadow: 0 0 5px rgba(64, 158, 255, 0.5);
}

.el-form-item .el-select:hover,
.el-form-item .el-select:focus {
  border-color: #409eff;
  box-shadow: 0 0 5px rgba(64, 158, 255, 0.5);
}

/* 弹框按钮 */
.dialog-footer .el-button {
  border-radius: 8px;
  padding: 8px 20px;
  font-size: 14px;
}

.dialog-footer .el-button--primary {
  background-color: #409eff;
  border-color: #409eff;
  color: #fff;
}

.dialog-footer .el-button--primary:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

.dialog-footer .el-button--default {
  background-color: #f5f5f5;
  border-color: #ebebeb;
  color: #333;
}

.dialog-footer .el-button--default:hover {
  background-color: #ebebeb;
  border-color: #dcdcdc;
}
</style>
<style scoped>
.device-info,
.car-info {
  padding: 20px 25px;
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.15);
  border-left: 5px solid #409eff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.device-info:hover,
.car-info:hover {
  transform: translateY(-10px);
  box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.2);
}

.device-info {
  background: linear-gradient(135deg, #f3faff, #eaf6ff);
}

.car-info {
  background: linear-gradient(135deg, #ffffff, #f8f8f8);
}

/* 信息项 */
.car-info p,
.device-info p {
  margin: 12px 0;
  font-size: 16px;
  line-height: 1.6;
  position: relative;
  padding-left: 20px;
  color: #333333;
  transition: all 0.2s ease;
}

.vehicle-info-item span {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #409eff;
  box-shadow: 0px 0px 8px rgba(64, 158, 255, 0.5);
}

.vehicle-info-item:hover {
  color: #409eff;
}

/* 按钮样式 */
.switch-car-button {
  margin-top: 20px;
  width: 100%;
  padding: 12px 20px;
  font-size: 15px;
  font-weight: bold;
  color: #ffffff;
  border-radius: 10px;
  background: linear-gradient(135deg, #409eff, #66b1ff);
  box-shadow: 0px 5px 12px rgba(64, 158, 255, 0.3);
  transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
  margin-left: 0!important;
}

.switch-car-button:hover {
  background: linear-gradient(135deg, #66b1ff, #409eff);
  transform: translateY(-5px);
  box-shadow: 0px 8px 18px rgba(64, 158, 255, 0.5);
}

.switch-car-button[type="success"] {
  background: linear-gradient(135deg, #67c23a, #85d472);
}

.switch-car-button[type="success"]:hover {
  background: linear-gradient(135deg, #85d472, #67c23a);
}
</style>