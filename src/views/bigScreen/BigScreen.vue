<template>
  <div class="big-screen">
    <div id="map" class="map-container"></div>
    <div class="overlay">
      <div class="header">
        <div class="title">盐城市道路户籍化管理系统</div>
        <div class="buttons">
          <el-button type="primary" @click="showDialog('roadInfo')">道路信息</el-button>
          <el-button type="primary" @click="showDialog('hazard')">打开隐患</el-button>
        </div>
      </div>
      <button class="manage-center-btn" @click="goToManageCenter">管理中心</button>
    </div>
    <div class="info-panel2" v-if="selectedDistrict">
      <h3>当前选中行政区划信息</h3>
      <el-form :model="selectedDistrict">
        <el-form-item label="名称">
          <el-input v-model="selectedDistrict.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="区域">
          <el-input v-model="selectedDistrict.area" disabled></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="info-panel">
      <div class="form-section">
        <h3>当前选中道路信息</h3>
        <el-form :model="selectedRoad">
          <el-form-item label="名称">
            <el-input v-model="selectedRoad.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="区域">
            <el-input v-model="selectedRoad.area" disabled></el-input>
          </el-form-item>
          <el-form-item label="道路等级">
            <el-input v-model="selectedRoad.roadLevel" disabled></el-input>
          </el-form-item>
          <el-form-item label="安全等级">
            <el-input v-model="selectedRoad.safetyLevel" disabled></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="table-section">
        <h3>路段</h3>
        <el-table :data="roadSegments">
          <el-table-column prop="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="name" label="道路名称"></el-table-column>
          <el-table-column prop="safetyScore" label="安全评分"></el-table-column>
          <el-table-column prop="safetyLevel" label="安全等级"></el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" width="30%" :before-close="handleClose"
      custom-class="custom-dialog">
      <p>{{ dialogContent }}</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <div class="zoom-controls">
      <el-button @click="zoomIn">+</el-button>
      <el-button @click="zoomOut">-</el-button>
      <div>当前缩放等级: {{ zoomLevel }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BigScreen',
  data() {
    return {
      dialogVisible: false,
      dialogTitle: '',
      dialogContent: '',
      selectedRoad: {
        name: '',
        area: '',
        roadLevel: '',
        safetyLevel: ''
      },
      selectedDistrict: {
        name: '盐城市亭湖区',
        area: '盐城市亭湖区'
      },
      roadSegments: [
        { index: 1, name: '路段1', safetyScore: 85, safetyLevel: 'A' },
        { index: 2, name: '路段2', safetyScore: 78, safetyLevel: 'B' },
        { index: 3, name: '路段3', safetyScore: 92, safetyLevel: 'A' }
      ],
      zoomLevel: 14, // 初始缩放等级
      markers: [] // 存储标注
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    async initMap() {
      // 百度地图API功能
      var map = new BMap.Map("map");
      map.centerAndZoom(new BMap.Point(120.168, 33.355), this.zoomLevel);
      map.enableScrollWheelZoom(true);

      // 从本地加载自定义样式文件
      const response = await fetch('/custom_map_config.json');
      const mapStyle = await response.json();
      map.setMapStyleV2({ styleJson: mapStyle });

      map.addEventListener("tilesloaded", function () {
        const logo = document.querySelector('.anchorBL');
        if (logo) {
          logo.style.display = 'none';
        }
      });

      // 更新缩放等级
      map.addEventListener("zoomend", () => {
        this.zoomLevel = map.getZoom();
        this.updateMarkersVisibility();
      });

      // 绘制多边形
      var boundary = new BMap.Boundary();
      boundary.get('盐城市亭湖区', (rs) => {
        var count = rs.boundaries.length;
        if (count === 0) {
          alert('未能获取当前输入行政区域');
          return;
        }
        var pointArray = [];
        for (var i = 0; i < count; i++) {
          var ply = new BMap.Polygon(rs.boundaries[i], {
            strokeWeight: 2,
            strokeColor: "#ff0000",
            fillColor: "black",
            fillOpacity: 0.5,
            zIndex: 1
          });
          map.addOverlay(ply);
          pointArray = pointArray.concat(ply.getPath());
        }
        map.setViewport(pointArray);

        // 添加标注
        this.addMarkers(map);
      });

      // 示例道路数据
      var roadSegments = [
        {
          name: "道路1",
          points: [
            new BMap.Point(120.168, 33.355),
            new BMap.Point(120.178, 33.365)
          ]
        },
        {
          name: "道路2",
          points: [
            new BMap.Point(120.178, 33.365),
            new BMap.Point(120.188, 33.375)
          ]
        }
      ];

      // 绘制道路路段
      roadSegments.forEach((segment) => {
        var polyline = new BMap.Polyline(segment.points, {
          strokeColor: "blue",
          strokeWeight: 10,
          strokeOpacity: 0.7,
          zIndex: 2 // 设置较大的 zIndex 值
        });
        map.addOverlay(polyline);

        // 添加点击事件
        polyline.addEventListener("click", () => {
          this.dialogTitle = '道路信息';
          this.dialogContent = `道路名称: ${segment.name}`;
          this.dialogVisible = true;
          this.selectedRoad.name = segment.name;
          this.selectedRoad.area = '盐城市'; // 示例数据
          this.selectedRoad.roadLevel = '一级'; // 示例数据
          this.selectedRoad.safetyLevel = 'A'; // 示例数据
        });
      });

      this.map = map; // 保存地图实例
    },
    addMarkers(map) {
      const markerPoints = [
        new BMap.Point(120.168, 33.355),
        new BMap.Point(120.170, 33.357),
        new BMap.Point(120.172, 33.359),
        new BMap.Point(120.174, 33.361),
        new BMap.Point(120.176, 33.363)
      ];

      markerPoints.forEach((point, index) => {
        const marker = new BMap.Marker(point, {
          icon: new BMap.Icon('https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2.png', new BMap.Size(27, 43))
        });
        map.addOverlay(marker);
        marker.hide(); // 初始隐藏标注
        this.markers.push(marker);

        marker.addEventListener("click", () => {
          this.dialogTitle = `隐患${index + 1}`;
          this.dialogContent = `原因: 示例原因\n修复建议: 示例修复建议`;
          this.dialogVisible = true;
        });
      });
    },
    updateMarkersVisibility() {
      if (this.zoomLevel > 12) {
        this.markers.forEach(marker => marker.show());
      } else {
        this.markers.forEach(marker => marker.hide());
      }
    },
    showDialog(type) {
      this.dialogVisible = true;
      if (type === 'roadInfo') {
        this.dialogTitle = '道路信息';
        this.dialogContent = '这里是道路信息的内容。';
      } else if (type === 'hazard') {
        this.dialogTitle = '打开隐患';
        this.dialogContent = '这里是隐患信息的内容。';
      }
    },
    handleClose(done) {
      this.dialogVisible = false;
      done();
    },
    goToManageCenter() {
      this.$router.push('/dashboard'); // 假设后台管理页面的路径是 /dashboard
    },
    zoomIn() {
      this.map.zoomIn();
    },
    zoomOut() {
      this.map.zoomOut();
    }
  }
}
</script>

<style scoped>
.big-screen {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.map-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.header {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
}

.title {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 18px;
  font-weight: bold;
  color: #249894;
  margin-right: 20px;
}

.buttons {
  display: flex;
  align-items: center;
}

.buttons .el-button {
  margin-right: 10px;
  background-color: #249894;
  border-color: #249894;
  color: white;
}

.buttons .el-button:hover {
  background-color: #1e7a6a;
  border-color: #1e7a6a;
}

.manage-center-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #249894;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.manage-center-btn:hover {
  background-color: #1e7a6a;
}

.overlay {
  position: absolute;
  left: 0;
  width: 100%;
  height: 80px;
  /* Adjust this value based on your needs */
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.info-panel {
  position: absolute;
  top: 100px;
  left: 5px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  z-index: 2;
}

.info-panel2 {
  position: absolute;
  top: 100px;
  right: 5px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  z-index: 2;
}

.info-panel h3 {
  margin-top: 0;
  color: #249894;
}

.form-section {
  margin-bottom: 20px;
}

.table-section {
  max-height: 400px;
  overflow-y: auto;
}


/* 隐藏百度地图的 logo */
.anchorBL {
  display: none !important;
}

.BMap_cpyCtrl {
  display: none !important;
}

.zoom-controls {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px;
  border-radius: 5px;
  z-index: 3;
}

.zoom-controls .el-button {
  margin-right: 5px;
  background-color: #249894;
  border-color: #249894;
  color: white;
}

.zoom-controls .el-button:hover {
  background-color: #1e7a6a;
  border-color: #1e7a6a;
}
</style>


<style scoped>
/* 使用深度选择器覆盖 Element UI 的样式 */
::v-deep .el-dialog {
  background: linear-gradient(135deg, #249894, #091220);
  color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  outline: 1px solid #249894;
}

::v-deep .el-dialog__header {
  background: rgba(9, 18, 32, 0.9) !important;
  color: #ffffff !important;
}

::v-deep .el-dialog__body {
  background: rgba(9, 18, 32, 0.9);
  color: #ffffff;
}

::v-deep .el-dialog__footer {
  background: rgba(9, 18, 32, 0.9);
}

::v-deep .el-button--primary {
  background-color: #249894;
  border-color: #249894;
  color: white;
}

::v-deep .el-button--primary:hover {
  background-color: #1e7a6a;
  border-color: #1e7a6a;
}

::v-deep .el-dialog__title {
  color: white;
}
</style>