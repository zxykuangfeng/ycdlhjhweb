<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="请输入施工单位名称"
        style="width: 200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
      <!-- <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="openEntryDialog"
      >项目录入</el-button> -->
    </div>

    <el-table
      ref="multipleTable"
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" prop="id" align="center" width="80" />
      <el-table-column label="隐患类型" prop="yhlb_name" align="center" min-width="150px" />
      <el-table-column label="隐患来源" prop="yhly_name" align="center" min-width="150px" />
      <el-table-column label="隐患坐标" prop="point" align="center" min-width="150px" />
      <el-table-column label="状态" prop="works_status_name" align="center" min-width="120px">
        <!-- <template slot-scope="{ row }">
          <span>{{ statusMap[row.status] }}</span>
        </template> -->
      </el-table-column>
      <el-table-column label="操作" align="center" width="300">
        <template slot-scope="{ row }">
          <el-button
        size="mini"
        type="primary"
        v-if="row.works_status === 0"
        @click="openEntryDialog(row)"
      >
        提交资料
      </el-button>
      <!-- <el-button
        size="mini"
        type="primary"
        v-if="row.works_status === 0"
        @click="goToDetail(row.id)"
      >
        查看详情
      </el-button> -->
      <el-button
        size="mini"
        type="primary"
        v-if="row.works_status === 2"
        @click="openEntryDialog(row)"
      >
        重新提交材料
      </el-button>
      <el-button
        size="mini"
        type="success"
        v-if="row.works_status === 3"
        @click="openRepairDialog(row)"
      >
        确认修复
      </el-button>
      <el-button
        size="mini"
        type="success"
        v-if="row.works_status === 5"
        @click="openRepairDialog(row)"
      >
        重新提交修复申请
      </el-button>
      <el-button
        size="mini"
        type="primary"
      
        @click="goToDetail(row.id)"
      >
        查看详情
      </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="确认修复"
      :visible.sync="repairDialogVisible"
      width="50%"
    >
      <el-form ref="repairForm" :model="repairForm" :rules="repairRules" label-width="100px">
        <el-form-item label="修复描述" prop="desc">
          <el-input v-model="repairForm.desc" type="textarea" placeholder="请输入修复描述"></el-input>
        </el-form-item>
        <el-form-item label="修复图片" prop="imgs">
          <el-upload
            action="`${$uploadBaseUrl}/admin/fileUpload`"
            list-type="picture-card"
            :on-success="handleFileUpload"
            :on-remove="handleFileRemove"
            :file-list="repairForm.imgs"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="repairDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitRepair">确认</el-button>
      </div>
    </el-dialog>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

 
    <el-dialog
  title="项目录入"
  :visible.sync="entryDialogVisible"
  width="80%"
>
  <el-steps :active="currentStep" finish-status="success" align-center>
    <el-step title="项目基础信息"></el-step>
    <!-- <el-step title="项目位置信息"></el-step> -->
    <el-step title="其他材料"></el-step>
  </el-steps>

  <div v-show="currentStep === 1" style="margin-top: 20px;">
    <el-form ref="elForm1" :model="entryForm" :rules="entryRules1" label-width="120px">
      <el-row>
        <el-col :span="24">
          <h4>项目基本信息</h4>
          <el-form-item label="项目名称" prop="name">
            <el-input v-model="entryForm.name"></el-input>
          </el-form-item>
          <el-form-item label="施工方式" prop="constructionMethod">
            <el-input v-model="entryForm.constructionMethod"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" style="padding-right: 10px;">
          <h4>建设单位信息</h4>
          <el-form-item label="单位名称" prop="buildUnitName">
            <el-input v-model="entryForm.buildUnitName"></el-input>
          </el-form-item>
          <el-form-item label="项目负责人" prop="buildUnitLeader">
            <el-input v-model="entryForm.buildUnitLeader"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="buildUnitContact">
            <el-input v-model="entryForm.buildUnitContact"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" style="padding-left: 10px;">
          <h4>施工单位信息</h4>
          <el-form-item label="单位名称" prop="constructionUnitName">
            <el-input v-model="entryForm.constructionUnitName"></el-input>
          </el-form-item>
          <el-form-item label="项目负责人" prop="constructionUnitLeader">
            <el-input v-model="entryForm.constructionUnitLeader"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="constructionUnitContact">
            <el-input v-model="entryForm.constructionUnitContact"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>

  <!-- <div v-show="currentStep === 2" style="margin-top: 20px;">
    <h4>项目位置信息</h4>
    <el-form ref="elForm2" :model="entryForm" :rules="entryRules2" label-width="120px">
      <el-form-item label="坐标" prop="point">
        <el-input v-model="entryForm.point" placeholder="点击按钮获取坐标" readonly></el-input>
        <el-button type="primary" @click="openMapDialog">选择坐标</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
          title="选择坐标"
          :visible.sync="mapDialogVisible"
          width="80%"
          @opened="initMap"
          :modal="false" 
        >
          <div id="baiduMap" style="width: 100%; height: 400px;"></div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="mapDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="confirmMapPoint">确认</el-button>
          </div>
        </el-dialog>
  </div> -->

  <div v-show="currentStep === 2" style="margin-top: 20px;">
    <h4>其他材料</h4>
    <el-form ref="elForm3" :model="entryForm" :rules="entryRules3" label-width="120px">
      <el-form-item label="交通设施方案" prop="trafficPlan">
        <el-upload
    action="`${$uploadBaseUrl}/admin/fileUpload`"
    list-type="text"
    :on-success="(res, file, fileList) => handleFileUpload('trafficPlan', res, file, fileList)"
    :on-remove="(file, fileList) => handleFileRemove('trafficPlan', file, fileList)"
    :file-list="entryForm.trafficPlan.map(url => ({ name: url.split('/').pop(), url }))"
  >
    <el-button type="primary">上传文件</el-button>
  </el-upload>
      </el-form-item>
      <el-form-item label="围挡方案" prop="fencePlan">
        <el-upload
    action="`${$uploadBaseUrl}/admin/fileUpload`"
    list-type="text"
    :on-success="(res, file, fileList) => handleFileUpload('fencePlan', res, file, fileList)"
    :on-remove="(file, fileList) => handleFileRemove('fencePlan', file, fileList)"
    :file-list="entryForm.fencePlan.map(url => ({ name: url.split('/').pop(), url }))"
  >
    <el-button type="primary">上传文件</el-button>
  </el-upload>
          </el-form-item>
          <el-form-item label="施工方案" prop="constructionPlan">
            <el-upload
    action="`${$uploadBaseUrl}/admin/fileUpload`"
    list-type="text"
    :on-success="(res, file, fileList) => handleFileUpload('constructionPlan', res, file, fileList)"
    :on-remove="(file, fileList) => handleFileRemove('constructionPlan', file, fileList)"
    :file-list="entryForm.constructionPlan.map(url => ({ name: url.split('/').pop(), url }))"
  >
    <el-button type="primary">上传文件</el-button>
  </el-upload>
          </el-form-item>
          <el-form-item label="施工图纸" prop="constructionDrawing">
            <el-upload
    action="`${$uploadBaseUrl}/admin/fileUpload`"
    list-type="text"
    :on-success="(res, file, fileList) => handleFileUpload('constructionDrawing', res, file, fileList)"
    :on-remove="(file, fileList) => handleFileRemove('constructionDrawing', file, fileList)"
    :file-list="entryForm.constructionDrawing.map(url => ({ name: url.split('/').pop(), url }))"
  >
    <el-button type="primary">上传文件</el-button>
  </el-upload>
          </el-form-item>
          <el-form-item label="安全施工承诺书" prop="safetyCommitment">
            <el-upload
    action="`${$uploadBaseUrl}/admin/fileUpload`"
    list-type="text"
    :on-success="(res, file, fileList) => handleFileUpload('safetyCommitment', res, file, fileList)"
    :on-remove="(file, fileList) => handleFileRemove('safetyCommitment', file, fileList)"
    :file-list="entryForm.safetyCommitment.map(url => ({ name: url.split('/').pop(), url }))"
  >
    <el-button type="primary">上传文件</el-button>
  </el-upload>
          </el-form-item>
          <el-form-item label="导改方案" prop="changePlan">
            <el-upload
    action="`${$uploadBaseUrl}/admin/fileUpload`"
    list-type="text"
    :on-success="(res, file, fileList) => handleFileUpload('changePlan', res, file, fileList)"
    :on-remove="(file, fileList) => handleFileRemove('changePlan', file, fileList)"
    :file-list="entryForm.changePlan.map(url => ({ name: url.split('/').pop(), url }))"
  >
    <el-button type="primary">上传文件</el-button>
  </el-upload>
          </el-form-item>
          <el-form-item label="施工申请单" prop="applicationForm">
            <el-upload
    action="`${$uploadBaseUrl}/admin/fileUpload`"
    list-type="text"
    :on-success="(res, file, fileList) => handleFileUpload('applicationForm', res, file, fileList)"
    :on-remove="(file, fileList) => handleFileRemove('applicationForm', file, fileList)"
    :file-list="entryForm.applicationForm.map(url => ({ name: url.split('/').pop(), url }))"
  >
    <el-button type="primary">上传文件</el-button>
  </el-upload>
          </el-form-item>
          <el-form-item label="安保方案" prop="securityPlan">
            <el-upload
    action="`${$uploadBaseUrl}/admin/fileUpload`"
    list-type="text"
    :on-success="(res, file, fileList) => handleFileUpload('securityPlan', res, file, fileList)"
    :on-remove="(file, fileList) => handleFileRemove('securityPlan', file, fileList)"
    :file-list="entryForm.securityPlan.map(url => ({ name: url.split('/').pop(), url }))"
  >
    <el-button type="primary">上传文件</el-button>
  </el-upload>
          </el-form-item>
    </el-form>
  </div>

  <div slot="footer" class="dialog-footer">
    <!-- <el-button v-if="currentStep > 1" @click="prevStep">上一步</el-button> -->
    <el-button v-if="currentStep == 1" type="primary" @click="nextStep">下一步</el-button>
    <el-button v-if="currentStep === 2" type="success" @click="submitEntry">提交</el-button>
  </div>
</el-dialog>
<el-dialog title="确认修复" :visible.sync="repairDialogVisible" width="50%">
      <el-form ref="repairForm" :model="repairForm" label-width="100px">
        <el-form-item label="修复时间" prop="repairDate">
          <el-date-picker
            v-model="repairForm.repairDate"
            type="date"
            placeholder="选择修复日期"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="修复备注" prop="desc">
          <el-input
            v-model="repairForm.desc"
            type="textarea"
            placeholder="请输入修复备注"
          ></el-input>
        </el-form-item>
        <el-form-item label="修复图片" prop="imgs">
          <el-upload
            action="`${$uploadBaseUrl}/admin/fileUpload`"
            list-type="picture-card"
            :on-success="handleFileUpload2"
            :on-remove="handleFileRemove"
            :file-list="repairForm.imgs"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="repairDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitRepair">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { getWorksList, approveRoadOccupation, rejectRoadOccupation, getRoadOccupationDetail, supplementWorks,worksRepair } from '@/api/road';
import Pagination from '@/components/Pagination';
import { camelToSnakeCase } from "@/utils"; // 根据路径调整
export default {
  components: {
    Pagination,
  },
  data() {     
    return {     
      list: [],
      listLoading: true,
      total: 0,
      listQuery: { page: 1, limit: 20, name: '' },
      tableKey: 0,
      repairDialogVisible: false,
      detail: {},
      entryDialogVisible: false,
      entryRules1: {
        name: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
          { min: 2, max: 50, message: '项目名称长度需在2到50个字符之间', trigger: 'blur' }
        ],
        constructionMethod: [
          { required: true, message: '请输入施工方式', trigger: 'blur' },
          { min: 2, max: 20, message: '施工方式长度需在2到20个字符之间', trigger: 'blur' }
        ],
        buildUnitName: [
          { required: true, message: '请输入建设单位名称', trigger: 'blur' },
          { min: 2, max: 50, message: '建设单位名称长度需在2到50个字符之间', trigger: 'blur' }
        ],
        buildUnitLeader: [
          { required: true, message: '请输入建设单位负责人', trigger: 'blur' },
          { min: 2, max: 20, message: '负责人名称长度需在2到20个字符之间', trigger: 'blur' }
        ],
        buildUnitContact: [
          { required: true, message: '请输入建设单位联系方式', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        constructionUnitName: [
          { required: true, message: '请输入施工单位名称', trigger: 'blur' },
          { min: 2, max: 50, message: '施工单位名称长度需在2到50个字符之间', trigger: 'blur' }
        ],
        constructionUnitLeader: [
          { required: true, message: '请输入施工单位负责人', trigger: 'blur' },
          { min: 2, max: 20, message: '负责人名称长度需在2到20个字符之间', trigger: 'blur' }
        ],
        constructionUnitContact: [
          { required: true, message: '请输入施工单位联系方式', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ]
      },
      entryRules2: {
        point: [{ required: true, message: '请选择项目坐标', trigger: 'blur' }],
      },
      entryRules3: {
        trafficPlan: [],
        enclosurePlan: [],
        constructionPlan: [],
        constructionDrawing: [],
        safetyCommitment: [],
        reroutingPlan: [],
        applicationForm: [],
        securityPlan: []
      },
      rejectDialogVisible: false,
      rejectReason: '',
      currentRejectId: null,
      statusMap: {
        0: "待申请",
        1: "已申请",
        2: "待修复",
        3: "已修复",
        4: "被驳回",
      },
      typeMap: { 1: '施工类型1', 2: '施工类型2' },
      repairRules: {
        desc: [{ required: true, message: "请输入修复描述", trigger: "blur" }],
        imgs: [{ required: true, message: "请上传修复图片", trigger: "change" }]
      },
      map: null, // 百度地图实例
      marker: null, // 地图上的标记
      tempPoint: '', // 临时存储选择的坐标
      mapDialogVisible: false, // 控制地图弹窗显示
      temp: {
        point: '' // 坐标
      },
      repairForm: {
        desc: "",
        imgs: []
      },
      entryForm: {
        name: '',
        constructionMethod: '',
        buildUnitName: '',
        buildUnitLeader: '',
        buildUnitContact: '',
        constructionUnitName: '',
        constructionUnitLeader: '',
        constructionUnitContact: '',
        point: '',
        trafficPlan: [], // 初始化为空数组
        fencePlan: [],
        constructionPlan: [],
        constructionDrawing: [],
        safetyCommitment: [],
        changePlan: [],
        applicationForm: [],
        securityPlan: []
      },
      currentStep: 1,
      map: null,
      marker: null,
      tempPoint: '',
      repairDialogVisible: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      getWorksList(this.listQuery).then(res => {
        if (res.code === 0) {
          this.list = res.data.data;
          this.total = res.data.total;
        }
        this.listLoading = false;
      });
    },
    openMapDialog() {
      this.mapDialogVisible = true;
      this.$nextTick(() => {
        if (!this.map) {
          this.initMap(); // 初始化地图
        }
      });
    },
    nextStep() {
  const currentFormRef = `elForm${this.currentStep}`;
  this.$refs[currentFormRef].validate((valid) => {
    if (valid) {
      if (this.currentStep === 1) {
        this.currentStep = 2; // 跳过第二步
      }
    } else {
      this.$notify({
        title: 'Error',
        message: '请完善当前步骤的信息',
        type: 'error',
      });
    }
  });
},
goToDetail(id) {
    this.$router.push({
      path: '/hazardManage/libraryDetail',
      query: { id } // 通过 query 传递参数
    });
  },
    openEntryDialog(row) {
      console.log('Row Data:', row); // 检查 row 的数据结构
      this.entryDialogVisible = true;
      this.entryForm = {
        ...this.entryForm,
        ...row
      };
      console.log('Updated entryForm:', this.entryForm); // 确认赋值后的 entryForm 是否完整
    },
    openRepairDialog(row) {
      this.currentRepairId = row.id;
      this.repairForm = { repairDate: '', desc: '', imgs: [] }; // 重置修复表单
      this.repairDialogVisible = true;
    },
prevStep() {
  if (this.currentStep > 1) {
    this.currentStep--;
  }
},
handleUploadSuccess(response, file, fileList) {
  this.entryForm.files = fileList.map((file) => file.response.url);
},
initMap() {
    const defaultPoint = new BMap.Point(120.15, 30.28); // 默认中心点
    this.map = new BMap.Map("baiduMap"); // 创建地图实例
    this.map.centerAndZoom(defaultPoint, 12); // 设置中心点和缩放级别
    this.map.enableScrollWheelZoom(true); // 启用滚轮缩放

    // 添加点击事件获取坐标
    this.map.addEventListener("click", (e) => {
      const point = e.point;
      if (this.marker) {
        this.map.removeOverlay(this.marker);
      }
      this.marker = new BMap.Marker(point); // 创建标记
      this.map.addOverlay(this.marker);
      this.tempPoint = `${point.lng}, ${point.lat}`;
    });
  },
  confirmMapPoint() {
  if (!this.tempPoint) {
    this.$notify({ title: "Error", message: "请点击地图选择坐标", type: "warning" });
    return;
  }

  // 分割坐标并限制到小数点后两位
  const [lng, lat] = this.tempPoint.split(',').map(coord => {
    return parseFloat(coord).toFixed(2); // 保留两位小数
  });

  this.entryForm.point = `${lng}, ${lat}`; // 格式化后的坐标赋值给表单
  this.mapDialogVisible = false; // 关闭地图弹窗
},
handleFileUpload(field, response, file, fileList) {
  // 只将当前上传成功的文件路径添加到对应字段
  console.log(111111111)
  console.log(response)
  if (response.code === 0 && response.data.url) {
    this.entryForm[field].push(response.data.url);
  } else {
    this.$notify({
      title: 'Error',
      message: '文件上传失败，请重试',
      type: 'error'
    });
  }
},

handleFileUpload2(field, response, file, fileList) {
  // 只将当前上传成功的文件路径添加到对应字段
  console.log(111111111)
  console.log(response)
  if (response.response.code === 0 && response.response.data.url) {
    this.repairForm['imgs'].push(response.response.data.url);
  } else {
    this.$notify({
      title: 'Error',
      message: '文件上传失败，请重试',
      type: 'error'
    });
  }
},
handleFileRemove(field, file, fileList) {
  // 在删除文件时，更新对应字段的文件路径列表
  this.entryForm[field] = fileList.map(item => item.url || (item.response && item.response.data.url));
},
  handleSelectionChange(val) {
      this.selectedItems = val; // 将选中的行存储到 selectedItems
      console.log('选中的行:', this.selectedItems); // 打印选中的行
    },
  // submitEntry() {
  //   addRoadOccupation(this.entryForm).then((res) => {
  //       if (res.code === 0) {
  //         this.entryDialogVisible = false;
  //         this.$message.success("录入成功");
  //       }
  //     });
  //   },
    formatTime(timestamp) {
    if (!timestamp) return '-';
      const date = new Date(timestamp * 1000); // 转换为毫秒
      const Y = date.getFullYear();
      const M = String(date.getMonth() + 1).padStart(2, '0');
      const D = String(date.getDate()).padStart(2, '0');
      const h = String(date.getHours()).padStart(2, '0');
      const m = String(date.getMinutes()).padStart(2, '0');
      const s = String(date.getSeconds()).padStart(2, '0');
      return `${Y}-${M}-${D} ${h}:${m}:${s}`;
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    submitRepair() {
      this.$refs.repairForm.validate((valid) => {
        if (valid) {
          const params = {
            mid: this.currentRepairId,
            desc: this.repairForm.desc,
            imgs: JSON.stringify(this.repairForm.imgs)
          };
          worksRepair(params).then((res) => {
            if (res.code === 0) {
              this.$notify({
                title: "Success",
                message: "修复确认成功",
                type: "success"
              });
              this.repairDialogVisible = false;
              this.getList();
            } else {
              this.$notify({
                title: "Error",
                message: res.msg,
                type: "error"
              });
            }
          });
        }
      });
    },
    viewDetails(row) {
      getRoadOccupationDetail(row.id).then(res => {
        if (res.code === 0) {
          this.detail = res.data;
          this.detail.imgs = this.detail.imgs ? JSON.parse(this.detail.imgs) : [];
          this.detailDialogVisible = true;
        }
      });
    },
    // openEntryDialog() {
    //   this.entryDialogVisible = true;
    // },
    submitEntry() {

      console.log('entryForm',this.entryForm)
      const formData = {
        ...camelToSnakeCase(this.entryForm),
        mid: this.entryForm.work_id, // 使用 entryForm 中的 id 作为 mid 参数
        trafficPlan: JSON.stringify(this.entryForm.trafficPlan || []),
        fencePlan: JSON.stringify(this.entryForm.fencePlan || []),
        constructionPlan: JSON.stringify(this.entryForm.constructionPlan || []),
        constructionDrawing: JSON.stringify(this.entryForm.constructionDrawing || []),
        safetyCommitment: JSON.stringify(this.entryForm.safetyCommitment || []),
        changePlan: JSON.stringify(this.entryForm.changePlan || []),
        applicationForm: JSON.stringify(this.entryForm.applicationForm || []),
        securityPlan: JSON.stringify(this.entryForm.securityPlan || [])
      };
      console.log(formData)
      supplementWorks(formData).then(res => {
        if (res.code === 0) {
          this.$notify({
            title: 'Success',
            message: '录入成功',
            type: 'success'
          });
          this.entryDialogVisible = false;
          this.getList();
        } else {
          this.$notify({
            title: 'Error',
            message: res.msg,
            type: 'error'
          });
        }
      });
    },
    approveOccupation(id) {
      this.$confirm('确定通过该施工申请?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        approveRoadOccupation(id).then(res => {
          if (res.code === 0) {
            this.$notify({ title: 'Success', message: '审核通过', type: 'success' });
            this.getList();
          } else {
            this.$notify({ title: 'Error', message: res.msg, type: 'warning' });
          }
        });
      });
    },
    openRepairDialog(row) {
      this.currentRepairId = row.work_id;
      this.repairForm = { repairDate: "", desc: "", imgs: [] }; // 重置表单
      this.repairDialogVisible = true;
    },
    openRejectDialog(id) {
      this.rejectDialogVisible = true;
      this.currentRejectId = id;
    },
    rejectOccupation() {
      if (!this.rejectReason) {
        this.$notify({ title: 'Error', message: '请输入驳回理由', type: 'warning' });
        return;
      }
      rejectRoadOccupation({ id: this.currentRejectId, reason: this.rejectReason }).then(res => {
        if (res.code === 0) {
          this.$notify({ title: 'Success', message: '驳回成功', type: 'success' });
          this.rejectDialogVisible = false;
          this.getList();
        } else {
          this.$notify({ title: 'Error', message: res.msg, type: 'warning' });
        }
      });
    },
    handleUploadSuccess(response, file, fileList) {
      this.entryForm.imgs = fileList.map(file => file.response.url);
    }
  }
};
</script>

<style scoped>
.app-container {
  padding: 20px;
}
#baiduMap {
  width: 100%;
  height: 400px;
}
</style>
<style scoped>
.app-container {
  padding: 20px;
}

.filter-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.filter-item {
  margin-right: 10px;
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
}

#baiduMap {
  width: 100%;
  height: 400px;
  border: 1px solid #e4e7ed;
  border-radius: 5px;
  overflow: hidden;
}

.el-form {
  background-color: #f9f9f9;
  border: 1px solid #ebeef5;
  border-radius: 5px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.el-form h4 {
  color: #333;
  font-weight: bold;
  margin-bottom: 10px;
}

.el-col {
  margin-bottom: 20px;
}

.el-steps {
  margin-bottom: 20px;
}

.el-step__title {
  font-weight: bold;
  color: #409eff;
}

.el-dialog {
  border-radius: 8px;
}

.el-dialog__header {
  background-color: #f5f7fa;
  color: #333;
  font-weight: bold;
  padding: 10px 20px;
  border-bottom: 1px solid #ebeef5;
}

.el-dialog__body {
  padding: 20px;
}

.el-button {
  border-radius: 5px;
  font-size: 14px;
}

.el-upload {
  width: 100%;
  margin-bottom: 20px;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-form-item__label {
  font-weight: bold;
  color: #666;
}

.el-input,
.el-select {
  width: 100%;
}

.dialog-footer .el-button {
  min-width: 100px;
}

.el-button--primary {
  background-color: #409eff;
  border-color: #409eff;
}

.el-button--success {
  background-color: #67c23a;
  border-color: #67c23a;
}

.el-button--danger {
  background-color: #f56c6c;
  border-color: #f56c6c;
}

.el-button:hover {
  opacity: 0.9;
}
</style>
@/utils