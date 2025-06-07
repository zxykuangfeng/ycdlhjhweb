<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="请输入路段名称"
        style="width: 200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-select
  v-model="listQuery.segment_type"
  placeholder="选择路段类型"
  clearable
  style="width: 160px; margin-left: 10px;"
  class="filter-item"
>
  <el-option label="普通路段" :value="1" />
  <el-option label="临水路段" :value="2" />
  <el-option label="学校路段" :value="3" />
  <el-option label="急弯路段" :value="30" />
</el-select>
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
      >新增</el-button>
      <el-button
        v-waves
        class="filter-item"
        type="danger"
        icon="el-icon-delete"
        @click="batchRemove"
      >批量删除</el-button>
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
      <el-table-column label="ID" prop="id" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="路段名称" min-width="100px" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="link-type" @click="toSectionDetails(scope.row)">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="安全评分" prop="score" align="center" min-width="120px">
        <template slot-scope="{ row }">
          <span :class="getScoreClass(row.score)">{{ row.score }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属区域" prop="town_name" align="center" min-width="120px" />
      <el-table-column label="所属道路" prop="road_name" align="center" min-width="120px" />
      <el-table-column label="道路类型" prop="type_name" align="center" min-width="120px" />
      <el-table-column label="起点经纬度" prop="spoint" align="center" min-width="150px" />
      <el-table-column label="终点经纬度" prop="epoint" align="center" min-width="150px" />
      <el-table-column label="道路长度 (km)" prop="length" align="center" min-width="120px" />
      <el-table-column label="路段类型" prop="segment_type" align="center" min-width="120px">
  <template slot-scope="{ row }">
    <span>{{ segmentTypeMap[row.segment_type] || '未知类型' }}</span>
  </template>
</el-table-column>

<el-table-column label="路段朝向" prop="direction" align="center" min-width="120px">
  <template slot-scope="{ row }">
    <span>{{ directionMap[row.direction] || '未知方向' }}</span>
  </template>
</el-table-column>
 
      <el-table-column label="创建时间" prop="create_time" align="center" min-width="150px" />
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" class="super-mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button size="mini" type="danger" class="super-mini" @click="toDel(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog
      ref="sectionDialog"
      v-el-drag-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      class="road-section-dialog"
      @opened="handleOpened"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 90%; margin-left:50px;"
      >
        <el-row :gutter="40">
          <el-col :xs="7" :sm="7" :lg="7">
            <el-form-item label="路段名称:" prop="name">
              <el-input v-model="temp.name" />
            </el-form-item>
            <el-form-item label="所属区域:" prop="aid">
              <el-select v-model="temp.aid" placeholder="请选择所属区域">
                <el-option
                  v-for="area in areas"
                  :key="area.id"
                  :label="area.name"
                  :value="area.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="所属道路:" prop="mid">
              <el-select v-model="temp.mid" placeholder="请选择所属道路">
                <el-option
                  v-for="road in roads"
                  :key="road.id"
                  :label="road.name"
                  :value="road.id"
                />
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="所属单位:" prop="cid">
              <el-select v-model="temp.cid" placeholder="请选择所属单位">
                <el-option label="交警支队" :value="0" />
                <el-option label="其他" :value="1" />
              </el-select>
            </el-form-item> -->
            <el-form-item label="起点和终点选择:" prop="mapPoints">
              <el-button type="primary" @click="openMapDialog">选择起点和终点</el-button>
            </el-form-item>
            <el-form-item label="起点经纬度:" prop="spoint">
              <el-input v-model="temp.spoint" readonly />
            </el-form-item>
            <el-form-item label="终点经纬度:" prop="epoint">
              <el-input v-model="temp.epoint" readonly />
            </el-form-item>
            <el-form-item label="道路长度 (km):" prop="length">
              <el-input v-model="temp.length" readonly />
            </el-form-item>
            <el-form-item label="道路类型:" prop="type">
              <el-select v-model="temp.type" placeholder="请选择道路类型">
                <el-option
                  v-for="item in sectionTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="路段类型:" prop="segment_type">
            <el-select v-model="temp.segment_type" placeholder="请选择路段类型">
              <el-option label="普通路段" :value="1" />
              <el-option label="临水路段" :value="2" />
              <el-option label="学校路段" :value="3" />
              <el-option label="急弯路段" :value="30" />
            </el-select>
          </el-form-item>

          <el-form-item label="路段朝向:" prop="direction">
  <el-select v-model="temp.direction" placeholder="请选择路段朝向">
    <el-option label="东 → 西" :value="1" />
    <el-option label="西 → 东" :value="2" />
    <el-option label="南 → 北" :value="3" />
    <el-option label="北 → 南" :value="4" />
    <el-option label="东南 → 西北" :value="5" />
    <el-option label="西北 → 东南" :value="6" />
    <el-option label="东北 → 西南" :value="7" />
    <el-option label="西南 → 东北" :value="8" />
  </el-select>
</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          :loading="loading"
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >确认</el-button>
        
      </div>
    </el-dialog>

    <!-- 百度地图弹窗 -->
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
      :disabled="!temp.spoint || !temp.epoint"
    >确认</el-button>
  </div>
</el-dialog>
<el-dialog
  title="路段标注查看"
  :visible.sync="viewDialogVisible"
  width="80%"
>
  <div id="viewMap" style="width: 100%; height: 400px;"></div>
  <div slot="footer" class="dialog-footer">
    <el-button @click="viewDialogVisible = false">关闭</el-button>
  </div>
</el-dialog>
  </div>
</template>

<script>
import {
  getRoadSectionList,
  addRoadSection,
  updateRoadSection,
  deleteRoadSection,
  getRoadSectionDetail,
  getTownList,
  getRoadList
} from '@/api/road';
import waves from '@/directive/waves';
import Pagination from '@/components/Pagination';
import moment from 'moment';

export default {
  name: 'RoadSectionManagement',
  components: { Pagination },
  directives: { waves },
  filters: {
    timeFilter(time) {
      return moment(time * 1000).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      tableKey: 0,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: '',
        segment_type: null
      },
      mapMode: null, // 当前模式：'start' 设置起点，'end' 设置终点
      temp: {
        name: '',
        aid: null,
        mid: null,
        spoint: '',
        epoint: '',
        length: '',
        cid: null,
        type: null,
        direction: '',
        segment_type: null,
        waypoints: [], // 路径点
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑路段',
        create: '新增路段'
      },
      rules: {
        name: [{ required: true, message: '请输入路段名称', trigger: 'blur' }],
        aid: [{ required: true, message: '请选择所属区域', trigger: 'change' }],
        mid: [{ required: true, message: '请选择所属道路', trigger: 'change' }],
        cid: [{ required: true, message: '请选择所属单位', trigger: 'change' }],
        length: [{ required: true, message: '请输入道路长度', trigger: 'blur' }],
        spoint: [{ required: true, message: '请选择起点', trigger: 'blur' }],
        epoint: [{ required: true, message: '请选择终点', trigger: 'blur' }],
        type: [{ required: true, message: '请选择道路类型', trigger: 'change' }]
      },
      ids: [],
      areas: [],
      roads: [],
      sectionTypes: [
        { value: 1, label: '城市主干道' },
        { value: 2, label: '城市次干道' },
        { value: 3, label: '县乡村道路' },
        { value: 4, label: '无名路' },
        { value: 5, label: '高速道路' },
        { value: 6, label: '国省道路' }
      ],
      segmentTypeMap: {
        1: '普通路段',
        2: '临水路段',
        3: '学校路段',
        30: '急弯路段'
      },
      sectionTypeMap: {
        1: '城市主干道',
        2: '城市次干道',
        3: '县乡村道路',
        4: '无名路',
        5: '高速道路',
        6: '国省道路'
      },
      directionMap: {
  1: '东 → 西',
  2: '西 → 东',
  3: '南 → 北',
  4: '北 → 南',
  5: '东南 → 西北',
  6: '西北 → 东南',
  7: '东北 → 西南',
  8: '西南 → 东北'
},
      mapDialogVisible: false,
      startPoint: null,
      endPoint: null,
      map: null,
      startMarker: null,
      endMarker: null,
      route: null, // 保存路线实例
      highlightedRoute: null, // 保存高亮线路
      viewDialogVisible: false, // 查看弹窗控制
      viewMap: null,            // 查看用地图实例
      viewHighlightedRoute: null, // 路线高亮
      viewStartMarker: null,
      viewEndMarker: null,

    };
  },
  created() {
    this.getList();
    this.fetchAreasAndRoads();
  },
  methods: {
    handleOpened() {
      this.$refs.sectionDialog.$el.scrollTop = 0;
    },
    async fetchAreasAndRoads() {
      try {
        const townResponse = await getTownList();
        if (townResponse.code === 0) {
          this.areas = townResponse.data.data;
        } else {
          this.$notify({ title: 'Error', message: townResponse.msg, type: 'warning' });
        }

        const roadResponse = await getRoadList({ limit: 999 });
        if (roadResponse.code === 0) {
          this.roads = roadResponse.data.data;
        } else {
          this.$notify({ title: 'Error', message: roadResponse.msg, type: 'warning' });
        }
      } catch (error) {
        this.$notify({ title: 'Error', message: '请求数据失败', type: 'error' });
      }
    },
    openMapDialog() {
      this.mapDialogVisible = true;
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

  // 设置起点
  setStartPoint(point) {
    const lng = point.lng.toFixed(12);
    const lat = point.lat.toFixed(12);
    this.temp.spoint = `${lng},${lat}`;
    if (this.startMarker) {
      this.map.removeOverlay(this.startMarker);
    }
    this.startMarker = new BMap.Marker(point);
    const label = new BMap.Label("起点", { offset: new BMap.Size(20, -10) });
    this.startMarker.setLabel(label);
    this.map.addOverlay(this.startMarker);
    this.$notify({ title: "起点设置", message: `已设置起点: ${lng}, ${lat}`, type: "success" });
    // 检查是否可以绘制导航线路
    if (this.temp.spoint && this.temp.epoint) {
      this.drawRoute();
    }
  },
  // 设置终点
  setEndPoint(point) {
    const lng = point.lng.toFixed(12);
    const lat = point.lat.toFixed(12);
    this.temp.epoint = `${lng},${lat}`;
    if (this.endMarker) {
      this.map.removeOverlay(this.endMarker);
    }
    this.endMarker = new BMap.Marker(point);
    const label = new BMap.Label("终点", { offset: new BMap.Size(20, -10) });
    this.endMarker.setLabel(label);
    this.map.addOverlay(this.endMarker);
    this.$notify({ title: "终点设置", message: `已设置终点: ${lng}, ${lat}`, type: "success" });

    // 检查是否可以绘制导航线路
    if (this.temp.spoint && this.temp.epoint) {
      this.drawRoute();
    }
  },
  async toSectionDetails(row) {
  try {
    const res = await getRoadSectionDetail(row.id);
    if (res.code === 0) {
      const detail = res.data;
      const waypoints = JSON.parse(detail.waypoints || '[]');

      // 打开弹窗并初始化地图
      this.viewDialogVisible = true;
      this.$nextTick(() => {
        this.initViewMap(waypoints);
      });
    } else {
      this.$notify({ title: 'Error', message: res.msg, type: 'warning' });
    }
  } catch (error) {
    this.$notify({ title: 'Error', message: '获取详情失败', type: 'error' });
  }
},
initViewMap(waypoints) {
  if (!this.viewMap) {
    this.viewMap = new BMap.Map("viewMap");
    this.viewMap.enableScrollWheelZoom(true);
  } else {
    this.viewMap.clearOverlays();
  }

  if (!waypoints.length) return;

  const points = waypoints.map(wp => new BMap.Point(parseFloat(wp.lng), parseFloat(wp.lat)));

  const polyline = new BMap.Polyline(points, {
    strokeColor: "blue",
    strokeWeight: 5,
    strokeOpacity: 0.8,
  });
  this.viewMap.addOverlay(polyline);

  const start = points[0];
  const startMarker = new BMap.Marker(start);
  startMarker.setLabel(new BMap.Label("起点", { offset: new BMap.Size(20, -10) }));
  this.viewMap.addOverlay(startMarker);

  const end = points[points.length - 1];
  const endMarker = new BMap.Marker(end);
  endMarker.setLabel(new BMap.Label("终点", { offset: new BMap.Size(20, -10) }));
  this.viewMap.addOverlay(endMarker);

  // 重点：延时触发 setViewport，确保弹窗渲染完成后执行
  setTimeout(() => {
    this.viewMap.setViewport(points); // 自动调整地图视图以适配所有点
  }, 300);
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
    // renderOptions: { map: this.map, autoViewport: true },
    // policy: BMAP_DRIVING_POLICY_LEAST_DISTANCE, // 设置策略为最短距离


    renderOptions: { map: this.map, autoViewport: true ,drivingPolicy:'BMAP_DRIVING_POLICY_LEAST_DISTANCE'},
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
    // toSectionDetails(row) {
    //   getRoadSectionDetail(row.id).then(res => {
    //     if (res.code === 0) {
    //       this.$notify({
    //         title: 'Success',
    //         message: '获取详情成功',
    //         type: 'success',
    //         duration: 1000
    //       });
    //     } else {
    //       this.$notify({
    //         title: 'Error',
    //         message: res.msg,
    //         type: 'warning',
    //         duration: 1000
    //       });
    //     }
    //   });
    // },
    handleSelectionChange(val) {
      this.ids = val.map(item => item.id);
    },
    batchRemove() {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRoadSection(this.ids).then(res => {
          if (res.code === 0) {
            this.$notify({
              title: 'Success',
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
            this.getList();
          } else {
            this.$notify({
              title: 'Error',
              message: res.msg,
              type: 'warning'
            });
          }
        });
      }).catch(() => {
        this.$notify({
          title: 'Info',
          message: '已取消删除',
          type: 'info'
        });
      });
    },
    toDel(item) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRoadSection(item.id).then(res => {
          if (res.code === 0) {
            this.$notify({
              title: 'Success',
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
            this.getList();
          } else {
            this.$notify({
              title: 'Error',
              message: res.msg,
              type: 'warning'
            });
          }
        });
      }).catch(() => {
        this.$notify({
          title: 'Info',
          message: '已取消删除',
          type: 'info'
        });
      });
    },
    getList() {
      this.listLoading = true;
      getRoadSectionList(this.listQuery).then(res => {
        if (res.code === 0) {
          this.list = res.data.data;
          this.total = res.data.total;
        } else {
          this.list = [];
          this.total = 0;
        }
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    resetTemp() {
      this.temp = { name: '', aid: null, mid: null, spoint: '', epoint: '', length: '', cid: null, type: null };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.loading = true;
          const payload = {
          ...this.temp,
            waypoints: JSON.stringify(this.temp.waypoints), // 序列化途径点
          };
          addRoadSection(payload).then(res => {
            if (res.code === 0) {
              this.resetMap();
              this.$notify({
                title: 'Success',
                message: '新增成功',
                type: 'success',
                duration: 1000
              });
              this.dialogFormVisible = false;
              this.getList();
            } else {
              this.$notify({
                title: 'Error',
                message: res.msg,
                type: 'warning'
              });
            }
            this.loading = false;
          });
        }
      });
    },
    renderWaypointsOnMap() {
  if (!this.map || !this.temp.waypoints.length) return;

  // 清理地图
  this.resetMap();

  const points = this.temp.waypoints.map(wp => new BMap.Point(parseFloat(wp.lng), parseFloat(wp.lat)));

  // 绘制路线
  this.highlightedRoute = new BMap.Polyline(points, {
    strokeColor: "blue",
    strokeWeight: 5,
    strokeOpacity: 0.8,
  });
  this.map.addOverlay(this.highlightedRoute);

  // 设置起点、终点
  const start = points[0];
  const end = points[points.length - 1];

  this.setStartPoint(start);
  this.setEndPoint(end);

  // 地图视角适配路线
  this.map.setViewport(points);
},

    handleUpdate(row) {
      this.temp = { ...row };
      this.dialogStatus = 'update';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    getScoreClass(score) {
      if (score >= 90) return 'score-high';
      if (score >= 70) return 'score-medium';
      return 'score-low';
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.loading = true;
          updateRoadSection(this.temp).then(res => {
            if (res.code === 0) {
              this.$notify({
                title: 'Success',
                message: '编辑成功',
                type: 'success',
                duration: 1000
              });
              this.dialogFormVisible = false;
              this.getList();
            } else {
              this.$notify({
                title: 'Error',
                message: res.message,
                type: 'warning'
              });
            }
            this.loading = false;
          });
        }
      });
    }
  }
};
</script>

<style lang="scss">
.el-icon-close {
  color: rgb(221, 74, 74);
}
.el-icon-check {
  color: rgb(82, 168, 82);
}
.road-section-dialog .el-dialog {
  width: 80% !important;
  margin-top: 10vh !important;
}
.el-col {
  border-left: 1px solid #eee;
  &:nth-of-type(1) {
    border-left: none;
  }
}
.super-mini {
  padding: 4px 0px !important;
  width: 40px !important;
}
</style>
<style scoped>
.score-high {
  color: green;
  font-weight: bold;
}
.score-medium {
  color: orange;
  font-weight: bold;
}
.score-low {
  color: red;
  font-weight: bold;
}
</style>