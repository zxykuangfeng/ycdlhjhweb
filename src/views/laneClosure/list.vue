<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="请输入项目名称"
        style="width: 200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-select v-model="listQuery.company_id" placeholder="请选择施工企业" class="filter-item" clearable>
        <el-option v-for="company in userList" :key="company.id" :label="company.remark" :value="company.id" />
      </el-select>
      <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button type="primary" icon="el-icon-edit" @click="handleCreate">项目录入</el-button>
    </div>

    <el-table :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="项目名称" prop="name" min-width="150px" align="center" show-overflow-tooltip />
      <el-table-column label="施工方式" prop="constructionMethod" min-width="150px" align="center" />
      <el-table-column label="封闭路段起点" prop="start_point" min-width="150px" align="center" />
      <el-table-column label="封闭路段终点" prop="end_point" min-width="150px" align="center" />
      <el-table-column label="施工企业" prop="constructionUnitName" min-width="150px" align="center" />
      <el-table-column label="施工企业联系人" prop="constructionUnitLeader" min-width="150px" align="center" />
      <el-table-column label="状态" prop="status_name" min-width="100px" align="center" />
      <el-table-column label="操作" align="center" width="200px">
        <template slot-scope="{ row }">
          <el-button
  v-if="row.status_name === '待施工'" 
  size="mini"
  type="success"
  @click="handleCompletion(row)"
>
  竣工
</el-button>
          <!-- <el-button size="mini" type="primary" @click="handleUpdate(row)" :disabled="row.status_name === '待审核'">编辑</el-button> -->
          <!-- <el-button size="mini" type="success" @click="sgxmApply(row)" v-if="row.status !== '审核中'">提交审核</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    
    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    
      <el-dialog title="项目录入" :visible.sync="dialogFormVisible" width="80%">
  <el-steps :active="currentStep" finish-status="success" align-center>
    <el-step title="项目申请说明"></el-step>
    <el-step title="项目基础信息"></el-step>
    <el-step title="项目位置信息"></el-step>
    <el-step title="项目设施信息"></el-step>
    <el-step title="其他材料"></el-step>
  </el-steps>

  <!-- **第一步：项目申请说明** -->
  <div v-show="currentStep === 1" class="step-container">
    <h3>请按照以下要求填写项目申请资料：</h3>
    <p class="desc">
      1. **填写基本信息**（项目名称、施工方式、建设单位、施工单位）<br>
      2. **设置项目位置**（在地图上选择起点和终点）<br>
      3. **上传相关材料**（如交通设施方案、施工图纸等）
    </p>
    <h4>需要上传的材料：</h4>
    <ul class="material-list">
      <li>✅ 交通设施方案</li>
      <li>✅ 围挡方案</li>
      <li>✅ 施工方案</li>
      <li>✅ 施工图纸</li>
      <li>✅ 安全施工承诺书</li>
      <li>✅ 导改方案</li>
      <li>✅ 施工申请单</li>
      <li>✅ 安保方案</li>
    </ul>
  </div>

  <!-- **第二步：项目基础信息** -->
  <div v-show="currentStep === 2" class="step-container">
    <el-form ref="elForm1" :model="entryForm" :rules="entryRules1" label-width="120px">
      <el-row>
        <el-col :span="24">
          <h3>项目基本信息</h3>
          <el-form-item label="项目名称" prop="name">
            <el-input v-model="entryForm.name"></el-input>
          </el-form-item>
          <el-form-item label="施工方式" prop="constructionMethod">
            <el-input v-model="entryForm.constructionMethod"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <h3>建设单位信息</h3>
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
        <el-col :span="12">
          <h3>施工单位信息</h3>
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

  <!-- **第三步：项目位置信息（地图选择）** -->
  <div v-show="currentStep === 3" class="step-container">
    <el-form ref="elForm2" :model="entryForm" :rules="entryRules2" label-width="120px">
      <h3>项目位置信息</h3>
      <el-form-item label="项目位置" prop="location">
        <el-input v-model="entryForm.location"></el-input>
      </el-form-item>
      <el-form-item label="封闭路段">
        <el-button type="primary" @click="openMapDialog">选择起点和终点</el-button>
      </el-form-item>
      <el-form-item label="起点经纬度" prop="spoint">
        <el-input v-model="entryForm.spoint" readonly />
      </el-form-item>
      <el-form-item label="终点经纬度" prop="epoint">
        <el-input v-model="entryForm.epoint" readonly />
      </el-form-item>
    </el-form>
  </div>
  <div v-show="currentStep === 4" class="step-container">
  <h3>项目设施信息</h3>
  <el-button type="primary" @click="addFacility">添加设施</el-button>
  <div v-for="(facility, index) in entryForm.facilities" :key="index" class="facility-item">
    <el-form label-width="120px">
      <el-form-item label="设施描述">
        <el-input v-model="facility.description" placeholder="请输入设施描述"></el-input>
      </el-form-item>
      <el-form-item label="设施位置">
        <el-input v-model="facility.location" placeholder="请输入设施位置"></el-input>
      </el-form-item>
      <el-form-item label="施工前图片">
        <el-upload  :action="`${$uploadBaseUrl}/admin/fileUpload`"list-type="text" 
          :on-success="(res, file, fileList) => handleFileUploadFacilities(index, res, file, fileList)">
          <el-button type="primary">上传图片</el-button>
        </el-upload>
      </el-form-item>
      <el-button type="danger" @click="removeFacility(index)">删除设施</el-button>
    </el-form>
  </div>
</div>
  <!-- **第四步：其他材料（优化成两列）** -->
  <div v-show="currentStep === 5" class="step-container">
    <h3>其他材料</h3>
    <el-form ref="elForm3" :model="entryForm" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="交通设施方案">
            <el-upload  :action="`${$uploadBaseUrl}/admin/fileUpload`" list-type="text"
              :on-success="(res, file, fileList) => handleFileUpload('trafficPlan', res, file, fileList)">
              <el-button type="primary">上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="围挡方案">
            <el-upload  :action="`${$uploadBaseUrl}/admin/fileUpload`"list-type="text"
              :on-success="(res, file, fileList) => handleFileUpload('fencePlan', res, file, fileList)">
              <el-button type="primary">上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="施工方案">
            <el-upload  :action="`${$uploadBaseUrl}/admin/fileUpload`"list-type="text"
              :on-success="(res, file, fileList) => handleFileUpload('constructionPlan', res, file, fileList)">
              <el-button type="primary">上传</el-button>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="施工图纸">
            <el-upload  :action="`${$uploadBaseUrl}/admin/fileUpload`"list-type="text"
              :on-success="(res, file, fileList) => handleFileUpload('constructionDrawing', res, file, fileList)">
              <el-button type="primary">上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="安全施工承诺书">
            <el-upload  :action="`${$uploadBaseUrl}/admin/fileUpload`"list-type="text"
              :on-success="(res, file, fileList) => handleFileUpload('safetyCommitment', res, file, fileList)">
              <el-button type="primary">上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="安保方案">
            <el-upload  :action="`${$uploadBaseUrl}/admin/fileUpload`"list-type="text"
              :on-success="(res, file, fileList) => handleFileUpload('securityPlan', res, file, fileList)">
              <el-button type="primary">上传</el-button>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>

  <div slot="footer" class="dialog-footer">
    <el-button v-if="currentStep > 1" @click="prevStep">上一步</el-button>
    <el-button v-if="currentStep < 5" type="primary" @click="nextStep">下一步</el-button>
    <el-button v-if="currentStep === 5" type="success" @click="submitEntry">提交</el-button>
  </div>
</el-dialog>


    <el-dialog
  title="选择起点和终点"
  :visible.sync="mapDialogVisible"
  width="80%"
  @opened="initMap"
>
  <div style="text-align: center; margin-bottom: 10px;">
    <el-button
      type="primary"
      :disabled="mapMode === 'start'"
      @click="setMapMode('start')"
    >设置起点</el-button>
    <el-button
      type="primary"
      :disabled="mapMode === 'end'"
      @click="setMapMode('end')"
    >设置终点</el-button>
    <el-button type="warning" @click="resetMap">重置</el-button>
  </div>
  <div id="baiduMap" style="width: 100%; height: 400px;"></div>
  <div slot="footer" class="dialog-footer">
    <el-button @click="mapDialogVisible = false">取消</el-button>
    <el-button
      type="primary"
      @click="confirmMapPoints"
    >确认</el-button>
   
  </div>
</el-dialog>

<el-dialog title="竣工申请" :visible.sync="completionDialogVisible" width="70%">
      <el-form ref="completionForm" :model="completionForm" label-width="120px">
        
        <el-divider content-position="center">设施信息（施工前后对比）</el-divider>
        <el-table style="margin-top: 20px;margin-bottom:20px" :data="completionForm.facility" border fit highlight-current-row>
  <el-table-column label="描述" prop="description" align="center" />
  <el-table-column label="施工位置" prop="location" align="center" />
  
  <!-- 施工前图片 -->
  <el-table-column label="施工前图片" align="center">
    <template slot-scope="{ row }">
      <img v-for="img in row.images" :key="img" :src="getFileUrl(img)" 
        style="width: 100px; height: 100px" fit="cover" />
      <span v-if="!row.images.length">无</span>
    </template>
  </el-table-column>

  <!-- 施工后图片 -->
  <el-table-column label="施工后图片" align="center">
    <template slot-scope="{ row, $index }">
      <el-upload
        action="`${$uploadBaseUrl}/admin/fileUpload`"
        :on-success="(res, file, fileList) => handleCompletionFileUpload($index, res, file, fileList)"
        list-type="text"
      >
        <el-button type="primary">上传</el-button>
      </el-upload>
      <el-image v-for="img in row.repair_imgs" :key="img" :src="getFileUrl(img)" 
        style="width: 100px; height: 100px" fit="cover" />
      <span v-if="!row.repair_imgs.length">无</span>
    </template>
  </el-table-column>
</el-table>
        <el-divider content-position="center" >竣工申请材料</el-divider>
        <el-form-item label="竣工报告">
          <el-upload  :action="`${$uploadBaseUrl}/admin/fileUpload`"list-type="text"
            :on-success="(res, file, fileList) => handleCompletionFileUpload('completionReport', res, file, fileList)">
            <el-button type="primary">上传</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item label="竣工备注">
          <el-input v-model="completionForm.remark" type="textarea" placeholder="请输入竣工备注" />
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="completionDialogVisible = false">取消</el-button>
        <el-button type="success" @click="submitCompletion">提交竣工申请</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { sgxmsList, sgxmAdd, sgxmEdit, sgxmApply, worksMember,sgxmsAdd,sgxmsSg } from '@/api/road';
import Pagination from '@/components/Pagination';

export default {
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listQuery: { page: 1, limit: 20, name: '', company_id: null,type:"create"},
      userList: [],
      temp: { name: '', location: '', start_point: '', end_point: '', company_id: '', desc:'',imgs: [],approval_files: '',  spoint: '',
        epoint: '', waypoints: []},
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: { create: '新增项目', update: '编辑项目' },
      rules: { name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }] },
      mapDialogVisible: false,
      fileList: [],
      mapMode:'',
      entryDialogVisible: false,
      currentStep: 1,
      entryForm: {
        name: '',
        constructionMethod: '',
        buildUnitName: '',
        buildUnitLeader: '',
        buildUnitContact: '',
        constructionUnitName: '',
        constructionUnitLeader: '',
        constructionUnitContact: '',
        location: '',
        spoint: '',
        epoint: '',
        facilities: [], 
        trafficPlan: [], 
        fencePlan: [],
        constructionPlan: [],
        constructionDrawing: [],
        safetyCommitment: [],
        changePlan: [],
        applicationForm: [],
        securityPlan: []
      },
      entryRules1: {
        name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        constructionMethod: [{ required: true, message: '请输入施工方式', trigger: 'blur' }],
        buildUnitName: [{ required: true, message: '请输入建设单位名称', trigger: 'blur' }],
        buildUnitLeader: [{ required: true, message: '请输入建设单位负责人', trigger: 'blur' }],
        buildUnitContact: [{ required: true, message: '请输入建设单位联系方式', trigger: 'blur' }],
        constructionUnitName: [{ required: true, message: '请输入施工单位名称', trigger: 'blur' }],
        constructionUnitLeader: [{ required: true, message: '请输入施工单位负责人', trigger: 'blur' }],
        constructionUnitContact: [{ required: true, message: '请输入施工单位联系方式', trigger: 'blur' }]
      },
      entryRules2: { location: [{ required: true, message: '请输入项目位置', trigger: 'blur' }] },
      entryRules3: {},
      completionDialogVisible: false,
      completionForm: {
        id: null,
        facility: [],
        completionReport: [],
        remark: ""
      }
    };
  },
  created() {
    this.fetchCompanies();
    this.getList();
    
  },
  methods: {
    fetchCompanies() {
      worksMember({}).then(res => {
        if (res.code === 0) this.userList = res.data;
      });
    },
    initMap() {
      if (!this.map) {
        this.map = new BMap.Map("baiduMap");
        this.map.centerAndZoom(new BMap.Point(120.15, 33.38), 16);
        this.map.enableScrollWheelZoom(true);

        this.map.addEventListener("click", (e) => {
          if (this.mapMode === "start") {
            this.setStartPoint(e.point);
          } else if (this.mapMode === "end") {
            this.setEndPoint(e.point);
          }
        });
      }
    },
    addFacility() {
    this.entryForm.facilities.push({
      description: '',
      location: '',
      images: []
    });
  },
  removeFacility(index) {
    this.entryForm.facilities.splice(index, 1);
  },
    // 设置起点
    setStartPoint(point) {
      const lng = point.lng.toFixed(12);
      const lat = point.lat.toFixed(12);
      this.entryForm.spoint = `${lng},${lat}`;
      this.temp.spoint = `${lng},${lat}`;
      if (this.startMarker) {
        this.map.removeOverlay(this.startMarker);
      }
      this.startMarker = new BMap.Marker(point);
      this.startMarker.setLabel(new BMap.Label("起点", { offset: new BMap.Size(20, -10) }));
      this.map.addOverlay(this.startMarker);

      this.$notify({ title: "起点设置", message: `已设置起点: ${lng}, ${lat}`, type: "success" });

      if (this.entryForm.spoint && this.entryForm.epoint) {
        this.drawClosedRoute();
      }
    },
    handleFileUploadFacilities(index, response, file, fileList) {
  if (response.code === 0 && response.data.url) {
    // 确保对应的设施项存在
    if (this.entryForm.facilities[index]) {
      this.entryForm.facilities[index].images.push(response.data.url);
    } else {
      this.$notify({
        title: '错误',
        message: '设施索引无效，请重试',
        type: 'error'
      });
    }
  } else {
    this.$notify({
      title: '上传失败',
      message: '文件上传失败，请重试',
      type: 'error'
    });
  }
},

    setEndPoint(point) {
      const lng = point.lng.toFixed(12);
      const lat = point.lat.toFixed(12);
      this.entryForm.epoint = `${lng},${lat}`;
      this.temp.epoint = `${lng},${lat}`;
      if (this.endMarker) {
        this.map.removeOverlay(this.endMarker);
      }
      this.endMarker = new BMap.Marker(point);
      this.endMarker.setLabel(new BMap.Label("终点", { offset: new BMap.Size(20, -10) }));
      this.map.addOverlay(this.endMarker);

      this.$notify({ title: "终点设置", message: `已设置终点: ${lng}, ${lat}`, type: "success" });

      if (this.entryForm.spoint && this.entryForm.epoint) {
        this.drawClosedRoute();
      }
    },
    drawClosedRoute() {
  if (!this.entryForm.spoint || !this.entryForm.epoint) return;

  const [startLng, startLat] = this.entryForm.spoint.split(',').map(Number);
  const [endLng, endLat] = this.entryForm.epoint.split(',').map(Number);

  const start = new BMap.Point(startLng, startLat);
  const end = new BMap.Point(endLng, endLat);

  const driving = new BMap.DrivingRoute(this.map, {
    renderOptions: { map: this.map, autoViewport: true },
    policy: 'BMAP_DRIVING_POLICY_LEAST_DISTANCE'
  });

  driving.search(start, end);
  driving.setSearchCompleteCallback(() => {
    if (driving.getStatus() === BMAP_STATUS_SUCCESS) {
      const plan = driving.getResults().getPlan(0);
      const route = plan.getRoute(0);
      let path = route.getPath();

      // **绘制封闭区域**
      this.drawPolygon(path);
    }
  });
},

drawPolygon(path) {
  if (this.closedArea) {
    this.map.removeOverlay(this.closedArea);
  }

  this.closedArea = new BMap.Polygon(path, {
    strokeColor: "red",
    strokeWeight: 4,
    strokeOpacity: 0.8,
    fillColor: "rgba(255,0,0,0.3)"
  });

  this.map.addOverlay(this.closedArea);
},
  // 切换地图模式
  setMapMode(mode) {
    this.mapMode = mode;
    this.$notify({ title: "模式切换", message: `当前模式: 设置${mode === "start" ? "起点" : "终点"}`, type: "info" });
  },

  resetMap() {
  // 清空起点和终点经纬度
  this.temp.spoint = "";
  this.temp.epoint = "";
  this.temp.waypoints = [];
  this.temp.length = "";

  // 移除起点和终点标记
  if (this.startMarker) {
    this.map.removeOverlay(this.startMarker);
    this.startMarker = null;
  }
  if (this.endMarker) {
    this.map.removeOverlay(this.endMarker);
    this.endMarker = null;
  }

  // 移除导航线路高亮
  if (this.highlightedRoute) {
    this.map.removeOverlay(this.highlightedRoute);
    this.highlightedRoute = null;
  }

  // 如果 `DrivingRoute` 实例存在，销毁它
  if (this.route) {
    this.route.clearResults(); // 清空搜索结果
    this.route = null; // 重置实例
  }

  this.$notify({ title: "地图重置", message: "已清空所有选择", type: "warning" });
},
  // 确认选择
  confirmMapPoints() {
  if (this.temp.spoint && this.temp.epoint) {
    this.mapDialogVisible = false;
  } else {
    this.$notify({ title: "Error", message: "请先选择起点和终点", type: "error" });
  }
},

  // 绘制路线
  

    addMarker(point, label) {
      const marker = new BMap.Marker(point);
      const markerLabel = new BMap.Label(label, { offset: new BMap.Size(20, -10) });
      marker.setLabel(markerLabel);
      this.map.addOverlay(marker);

      if (label === '起点') {
        this.startMarker = marker;
      } else {
        this.endMarker = marker;
      }
    },
    drawRoute() {
  if (!this.temp.spoint || !this.temp.epoint) return;

  const [startLng, startLat] = this.temp.spoint.split(',').map(Number);
  const [endLng, endLat] = this.temp.epoint.split(',').map(Number);

  const start = new BMap.Point(startLng, startLat);
  const end = new BMap.Point(endLng, endLat);

  const driving = new BMap.DrivingRoute(this.map, {
    renderOptions: { map: this.map, autoViewport: true },
    policy:  'BMAP_DRIVING_POLICY_LEAST_DISTANCE', // 设置策略为最短距离
    onSearchComplete: (results) => {
      if (driving.getStatus() === BMAP_STATUS_SUCCESS) {
        const plan = results.getPlan(0);
        const route = plan.getRoute(0);
        let path = route.getPath(); // 获取原始路径点
        
        // 路径简化
        path = this.simplifyPath(path, 0.0001);

        // 绘制高亮路线
        this.updateMapPath(path);

        // 更新路段长度
        this.temp.length = (plan.getDistance(false) / 1000).toFixed(2);

        // 保存途径点
        this.temp.waypoints = path.map((point) => ({
          lng: point.lng.toFixed(12),
          lat: point.lat.toFixed(12),
        }));
      }
    },
  });

  driving.search(start, end); // 发起导航搜索
},

simplifyPath(points, tolerance) {
  const sqTolerance = tolerance * tolerance;

  function getSquareDistance(p1, p2) {
    const dx = p1.lng - p2.lng;
    const dy = p1.lat - p2.lat;
    return dx * dx + dy * dy;
  }

  function simplifyRadialDistance(points, sqTolerance) {
    const prevPoint = points[0];
    const newPoints = [prevPoint];

    for (let i = 1; i < points.length; i++) {
      if (getSquareDistance(points[i], prevPoint) > sqTolerance) {
        newPoints.push(points[i]);
      }
    }

    if (newPoints[newPoints.length - 1] !== points[points.length - 1]) {
      newPoints.push(points[points.length - 1]);
    }

    return newPoints;
  }

  return simplifyRadialDistance(points, sqTolerance);
},
updateMapPath(path) {
  if (this.highlightedRoute) {
    this.map.removeOverlay(this.highlightedRoute);
  }
  this.highlightedRoute = new BMap.Polyline(path, {
    strokeColor: "blue",
    strokeWeight: 5,
    strokeOpacity: 0.8,
  });
  this.map.addOverlay(this.highlightedRoute);
},

resetMap() {
  // 清空起点和终点经纬度
  this.temp.spoint = "";
  this.temp.epoint = "";
  this.temp.waypoints = [];
  this.temp.length = "";

  // 移除起点和终点标记
  if (this.startMarker) {
    this.map.removeOverlay(this.startMarker);
    this.startMarker = null;
  }
  if (this.endMarker) {
    this.map.removeOverlay(this.endMarker);
    this.endMarker = null;
  }

  // 移除导航线路高亮
  if (this.highlightedRoute) {
    this.map.removeOverlay(this.highlightedRoute);
    this.highlightedRoute = null;
  }

  // 如果 `DrivingRoute` 或其他导航实例存在，清除结果并销毁它
  if (this.route) {
    this.route.clearResults(); // 清空搜索结果
    this.route = null; // 销毁实例
  }

  // 清除地图上所有覆盖物（保险机制）
  this.map.clearOverlays();

  this.$notify({ title: "地图重置", message: "已清空所有选择", type: "warning" });
},
getList() {
    sgxmsList(this.listQuery).then(res => {
      if (res.code === 0) {
        this.list = res.data.data.map(item => ({
          id: item.id,
          name: item.name,
          constructionMethod: item.constructionMethod,
          buildUnitName: item.buildUnitName,
          buildUnitLeader: item.buildUnitLeader,
          buildUnitContact: item.buildUnitContact,
          constructionUnitName: item.constructionUnitName,
          constructionUnitLeader: item.constructionUnitLeader,
          constructionUnitContact: item.constructionUnitContact,
          location: item.location,
          start_point: item.spoint,
          end_point: item.epoint,
          company_name: item.qyname,
          approval_files: item.imgs ? item.imgs.join(', ') : '无',
          imgs: item.imgs ? item.imgs.join(', ') : '无',
          status_name: item.status_name,
          status: item.status,

          // **处理 facility 确保格式正确**
          facility: Array.isArray(item.facility) ? item.facility.map(fac => ({
            description: fac.description || fac.desc || "无描述",
            location: fac.location || "无",
            images: Array.isArray(fac.images) ? fac.images : (fac.imgs ? [fac.imgs] : []),
            repair_imgs: Array.isArray(fac.repair_imgs) ? fac.repair_imgs : (fac.repair_imgs ? [fac.repair_imgs] : [])
          })) : []
        }));

        this.total = res.data.total;
      }
    });
},
  formatStatus(row) {
    return row.status; // 直接返回 status_name
  },
    handleFilter() {
      this.getList();
    },
    handleCreate() {
      this.temp = { name: '', location: '', start_point: '', end_point: '', company_id: '', approval_files: '' };
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
    },
    handleUpdate(row) {
      console.log('row11111111')
      console.log(row)
      this.temp = {
        id: row.id || null,
        name: row.name || '',
        location: row.location || '',
        start_point: row.start_point || '',
        end_point: row.end_point || '',
        spoint: row.start_point || '',  // 兼容数据格式
        epoint: row.end_point || '',
        desc: row.location || '',  // 可能 `desc` 是 `location`
        qyid: row.qyid ? String(row.qyid) : '', // **确保 qyid 是字符串**
 // 施工企业ID
        approval_files: row.imgs || '',
        imgs: row.imgs ? row.imgs.split(',').map(item => item.trim()) : [],  // **字符串转数组**
        waypoints: row.waypoints || [],
      };
      this.dialogStatus = 'update';
      this.dialogFormVisible = true;
    },
    createData() {
      this.fileList = [];
      sgxmsAdd(this.temp).then(res => {
        if (res.code === 0) {
          this.$message.success('添加成功');
          this.dialogFormVisible = false;
          this.getList();
        }else{
          this.$message.error(res.msg);
        }
      });
    },
    updateData() {
      this.fileList = [];
      sgxmEdit(this.temp).then(res => {
        if (res.code === 0) {
          this.$message.success('修改成功');
          this.dialogFormVisible = false;
          this.getList();
        }else{
          this.$message.error(res.msg);
        }
      });
    },
    openMapDialog() {
      this.mapDialogVisible = true;
    },
    sgxmApply(row) {
      this.$confirm('确认提交审核？', '提示', { type: 'warning' }).then(() => {
        sgxmApply(row.id).then(() => this.getList());
      });
    },
    // formatStatus(row) {
    //   return row.status === '审核中' ? '审核中' : '未提交';
    // },
    // handleUploadSuccess(response, file) {
    //   this.fileList.push({ name: file.name, url: response.data.url });

    //   if (!Array.isArray(this.temp.imgs)) {
    //     this.temp.imgs = [];  // 确保 imgs 是数组
    //   }
    //   this.temp.imgs.push(response.data.url);
    // },

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

    // handleFileRemove(file) {
    //   this.fileList = this.fileList.filter(f => f.name !== file.name);
    //   if (Array.isArray(this.temp.imgs)) {
    //     this.temp.imgs = this.temp.imgs.filter(img => img !== file.url);
    //   }
    // },

    handleFileRemove(field, file, fileList) {
  // 在删除文件时，更新对应字段的文件路径列表
  this.entryForm[field] = fileList.map(item => item.url || (item.response && item.response.data.url));
},
    handleCancel() {
      this.dialogFormVisible = false;
      this.fileList = [];
      this.$refs.upload && this.$refs.upload.clearFiles();
    },
    openEntryDialog() {
      this.currentStep = 1;
      this.entryDialogVisible = true;
    },
    nextStep() {
  if (this.currentStep === 1) {
    // 第一步（项目申请说明）直接跳过验证，进入第二步
    this.currentStep++;
  } else if (this.currentStep === 2) {
    // this.$refs.elForm1.validate(valid => {
    //   if (valid) {
        this.currentStep++;
      // } else {
      //   this.$message.error("请填写完整的项目信息！");
      // }
    // });
  } else if (this.currentStep === 3) {
    // this.$refs.elForm2.validate(valid => {
    //   if (valid) {
        this.currentStep++;
      // } else {
    //     this.$message.error("请填写完整的位置信息！");
    //   }
    // });
  } else {
    this.currentStep++;
  }
},

    prevStep() {
      this.currentStep--;
    },
    submitEntry() {
      console.log(this.entryForm);
      const payload = {
        name: this.entryForm.name,
        constructionMethod: this.entryForm.constructionMethod,
        buildUnitName: this.entryForm.buildUnitName,
        buildUnitLeader: this.entryForm.buildUnitLeader,
        buildUnitContact: this.entryForm.buildUnitContact,
        constructionUnitName: this.entryForm.constructionUnitName,
        constructionUnitLeader: this.entryForm.constructionUnitLeader,
        constructionUnitContact: this.entryForm.constructionUnitContact,
        location: this.entryForm.location,
        spoint: this.entryForm.spoint,
        epoint: this.entryForm.epoint,
        waypoints: this.temp.waypoints, 
        facility: this.entryForm.facilities,
        fencePlan: this.entryForm.fencePlan, 
        trafficPlan: this.entryForm.trafficPlan,
        constructionPlan: this.entryForm.constructionPlan,
        constructionDrawing: this.entryForm.constructionDrawing,
        safetyCommitment: this.entryForm.safetyCommitment,
        changePlan: this.entryForm.changePlan,
        applicationForm: this.entryForm.applicationForm,
        securityPlan: this.entryForm.securityPlan
      };

      sgxmsAdd(payload)
        .then(res => {
          if (res.code === 0) {
            this.$message.success('提交成功');
            this.dialogFormVisible = false;
            this.getList();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(error => {
          console.error('提交失败', error);
          this.$message.error('提交失败，请检查网络或稍后重试');
        });
      // this.$message.success('提交成功1');
      this.entryDialogVisible = false;
    },
    handleCompletion(row) {
      this.completionForm = {
        id: row.id,
        facility: row.facility || [],
        completionReport: [],
        remark: ""
      };
      this.completionDialogVisible = true;
    },
    handleCompletionFileUpload(field, response, file, fileList) {
      if (response.code === 0 && response.data.url) {
        if (typeof field === "number") {
          this.completionForm.facility[field].repair_imgs = response.data.url;
        } else {
          this.completionForm[field].push(response.data.url);
        }
      } else {
        this.$notify({
          title: "上传失败",
          message: "文件上传失败，请重试",
          type: "error"
        });
      }
    },
    submitCompletion() {
      sgxmsSg({
        id: this.completionForm.id,
        facility: this.completionForm.facility,
        completionReport: this.completionForm.completionReport,
        remark: this.completionForm.remark
      }).then(res => {
        if (res.code === 0) {
          this.$message.success("竣工申请提交成功");
          this.completionDialogVisible = false;
          this.getList();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    getFileUrl(file) {
      const baseUrl = "http://roadserver.lysoo.com:8081";
      return file.startsWith("uploads/") ? `${baseUrl}/${file}` : file;
    }
//     handleFileUpload(field, response, file, fileList) {

//   if (response.code === 0 && response.data.url) {
//     this.entryForm[field].push(response.data.url);
//   } else {
//     this.$notify({
//       title: 'Error',
//       message: '文件上传失败，请重试',
//       type: 'error'
//     });
//   }
// },
    // createData() {
    //   this.dialogFormVisible = false;
    //   this.fileList = [];
    // },
    // updateData() {
    //   this.dialogFormVisible = false;
    //   this.fileList = [];
    // }
  },
};
</script>

<style scoped>
/* 弹窗整体优化 */
.el-dialog {
  border-radius: 12px;
  padding: 20px;
  background: #f9f9f9;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* 标题优化 */
.el-dialog__title {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
}

/* 步骤条优化 */
.el-steps {
  margin-bottom: 20px;
}

.el-step__title {
  font-size: 16px;
  font-weight: 600;
  color: #409eff;
}

.step-container {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

/* 说明文字优化 */
.desc {
  font-size: 14px;
  color: #666;
  line-height: 1.8;
  background: #f0f8ff;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 15px;
}

/* 材料列表优化 */
.material-list {
  padding: 10px;
  background: #fff8e1;
  border-radius: 6px;
}

.material-list li {
  font-size: 14px;
  line-height: 2;
}

/* 表单输入框优化 */
.el-input,
.el-select,
.el-textarea {
  border-radius: 6px;
  height: 40px;
}

/* 地图选择按钮优化 */
/* .el-button {
  border-radius: 6px;
  font-size: 14px;
  padding: 8px 16px;
}

.el-button--primary {
  background: #409eff;
  border-color: #409eff;
} */

.el-button--warning {
  background: #e6a23c;
  border-color: #e6a23c;
}

/* 上传组件优化 */
.el-upload {
  display: block;
  text-align: center;
  margin: 5px 0;
}

.el-upload__tip {
  font-size: 12px;
  color: #909399;
}

/* 上传区域优化 */
.el-form-item {
  margin-bottom: 16px;
}

.el-row {
  display: flex;
  flex-wrap: wrap;
}

.el-col {
  padding: 8px;
}

/* 对话框底部优化 */
.dialog-footer {
  text-align: right;
  padding: 15px;
  border-top: 1px solid #ebeef5;
}
</style>

