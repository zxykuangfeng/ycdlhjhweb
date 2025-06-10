<template>
  <div class="big-screen">
    <header-component :headerImage="headerImage" :buttonImage="buttonImage" :selectedButtonImage="selectedButtonImage"
      :buttonCount="buttonCount" :initialSelectedButton="2" :buttonLabels="buttonLabels"
      @button-selected="handleButtonSelected" />
    <div class="content">
      <div id="map" class="map-container"></div>
    </div>
    <!-- 固定的左上角选择框 -->

    <div class="section-top" style="width: 443px;height: 40px;line-height: 40px;padding-left: 30px;margin-top: 20px;font-size: 16px;font-weight: 800;display: flex;align-items: center;">
     <img :src="right"> <div style="margin-left: 3px;">选择道路</div>
    </div>
    <div class="fixed-div">
      <label for="town-select" class="label">行政区划:</label>
<select id="town-select" v-model="selectedAid" @change="handleTownChange" class="styled-select">
  <option value="">全部</option>
  <option v-for="town in townList" :key="town.id" :value="town.id">{{ town.name }}</option>
</select>
      <label for="road-select" class="label">道路名称:</label>
      <select id="road-select" v-model="selectedRoadId" @change="handleRoadSelectionByRoad" class="styled-select">
        <option v-for="road in roadList" :key="road.id" :value="road.id">{{ road.name }}</option>
      </select>

      <label for="safety-select" class="label">安全等级:</label>
      <select id="safety-select" v-model="selectedSafetyLevel" @change="handleRoadSelectionByRoad" class="styled-select">
        <option value="">全部</option>
        <option value="1">良好</option>
        <option value="2">轻微隐患</option>
        <option value="3">严重隐患</option>
      </select>
    </div>
<!-- 
    <div class="fixed-div">
 
    </div> -->
    <!-- 左侧新增统计框 -->      
    <div class="section-mid">
      <div class="tab-container">
        <div
          class="tab-item"
          :class="{ active: selectedTab === '路段' }"
          @click="selectTab('路段')"
        >
          路段
        </div>
        <div class="separator">|</div>
        <div
          class="tab-item"
          :class="{ active: selectedTab === '路口' }"
          @click="selectTab('路口')"
        >
          路口
        </div>
      </div>
    </div>
       <!-- 路段内容 -->
       <div class="statistics-div" v-if="selectedTab === '路段'">
      <div class="statistics-header">
        <div class="statistics-cell">
          <input type="checkbox" @change="toggleSelectAll('road', $event); highlightSelectedRoads()" />
  </div>
        <div class="statistics-cell name-column">道路名称</div>
        <div class="statistics-cell">安全评分</div>
        <div class="statistics-cell">安全等级</div>
      </div>
      <div 
        class="statistics-row" 
        v-for="(item, index) in roadScores" 
        :key="index"
        :class="{ 'row-alternate': index % 2 === 1 }"
        @click="handleRoadSelection(item)"
      >
      <div class="statistics-cell">
        <input type="checkbox" v-model="selectedRoadIds" :value="item.id" @change="highlightSelectedRoads()" />
  </div>
        <div class="statistics-cell name-column" :title="item.name">{{ item.name }}</div>
        <div class="statistics-cell">{{ item.score }}</div>
        <div class="statistics-cell">
          <span
            class="safety-level"
            :style="{ backgroundColor: getSafetyLevel(item.score).color }"
          ></span>
          {{ getSafetyLevel(item.score).text }}
        </div>
      </div>
      <!-- <div class="pagination">
        <button :disabled="roadCurrentPage === 1" @click="changeRoadPage(roadCurrentPage - 1)">
          <i class="el-icon-arrow-left"></i>
        </button>
        <span v-for="page in totalRoadPages" :key="page">
          <button
            :class="{ active: roadCurrentPage === page }"
            @click="changeRoadPage(page)"
          >
            {{ page }}
          </button>
        </span>
        <button :disabled="roadCurrentPage === totalRoadPages" @click="changeRoadPage(roadCurrentPage + 1)">
          <i class="el-icon-arrow-right"></i>
        </button>
      </div> -->
    </div>

    <!-- 路口内容 -->
    <div class="statistics-div" v-if="selectedTab === '路口'">
      <div class="statistics-header">
        <div class="statistics-cell">
    <input type="checkbox" @change="toggleSelectAll('intersection', $event)" />
  </div>
        <div class="statistics-cell name-column">路口名称</div>
        <div class="statistics-cell">安全评分</div>
        <div class="statistics-cell">安全等级</div>
      </div>
      <div 
        class="statistics-row" 
        v-for="(item, index) in intersectionScores" 
        :key="index"
        :class="{ 'row-alternate': index % 2 === 1 }"
        @click="handleIntersectionSelection(item)"
      >
      <div class="statistics-cell">
    <input type="checkbox" v-model="selectedIntersectionIds" :value="item.id" />
  </div>        <div class="statistics-cell name-column">{{ item.name }}</div>
        <div class="statistics-cell">{{ item.score }}</div>
        <div class="statistics-cell">
          <span
            class="safety-level"
            :style="{ backgroundColor: getSafetyLevel(item.score).color }"
          ></span>
          {{ getSafetyLevel(item.score).text }}
        </div>
      </div>
    </div>
    <right-ping-fen-sidebar 
      :selectedData="selectedData"
      :selectedIds="selectedRoadIds"
      :selectedType="selectedType"
      @item-selected="handleItemSelection"
    />
    <div class="hazard-info" v-if="selectedItem">
    <div class="hazard-header">
      <div style="margin-bottom: 10px;font-weight: 300;">隐患详情</div>
      <button style="margin-bottom: 10px" class="close-btn" @click="selectedItem = null">×</button>
    </div>
    <p><strong>类别:</strong> {{ selectedItem.yhlb_name }}</p>
    <p><strong>安全标准:</strong> {{ selectedItem.testing_standards }}</p>
    <p><strong>隐患描述:</strong> <span class="hazard-desc">{{ selectedItem.yhdesc }}</span></p>
    <p><strong>排查时间:</strong> {{ selectedItem.ctime }}</p>
    <p><strong>位置:</strong> {{ selectedItem.address || '未知' }}</p>
    <div class="hazard-image-container">
      <img :src="'http://roadserver.lysoo.com:8081/' + selectedItem.imgs" alt="隐患图片">
    </div>
  </div>
  </div>
</template>
<script>
import HeaderComponent from '@/components/Header/HeaderComponent';
import { getRoadSectionList,getRoadCrossingList,screenRoadChildList,safeRoadChild,screenRoadList,screenTownList  } from '@/api/road';
import RightPingFenSidebar from '@/components/Sidebar/RightPingFenSidebar'
export default {
  name: 'BigScreen4',
  components: {
    HeaderComponent,
    RightPingFenSidebar,
  },
  data() {
    return {
      headerImage: require('@/assets/header-image.png'),
      buttonImage: require('@/assets/button.png'),
      selectedButtonImage: require('@/assets/button-selected.png'),
      stopImage: require('@/assets/stop.svg'),
      popbgImage: require('@/assets/popbg.png'),      
      minorpitfallImage: require('@/assets/minorpitfall.png'),
      stopImage: require('@/assets/stop.png'), 
      tipsImage: require('@/assets/tips.png'),
      luzhifallImage: require('@/assets/luzhi.png'),
      dengImage: require('@/assets/deng.png'),
      sgaqImage: require('@/assets/sgaq.png'),
      lukoImage: require('@/assets/luko.png'),
      buttonCount: 4,
      buttonLabels: ['道路户籍化', '隐患画像', '安全评分','事故画像', '管理平台'], // Button labels
      zoomLevel: 12, // 初始缩放等级
      map: null, // 保存地图实例
      markers: [], // 存储路口标注
      circles: [], // 存储蓝色透明圆圈
      roadPolylines: [], // 保存所有道路的折线对象
      selectedRoad: null, // 当前选中的道路数据
      right: require('@/assets/right.png'),
      left: require('@/assets/left.png'),
      trafficSignCounts: {}, // 交通标志统计数据
      roadMarkCounts: {}, // 路面标线统计数
      popupContent: {
        type: '',
        image: '',
      }, // 弹窗内容
      currentPage: 1,
      itemsPerPage: 12,
      selectedTab: '路段',
      itemsPerPage: 12,
      roadCurrentPage: 1,
      intersectionCurrentPage: 1,
      roadList: [], // 保存道路下拉框的数据
      roadScores: [], // 路段数据
      intersectionScores: [], // 路口数据
      selectedRoadId: null, // 当前选中的道路ID
      selectedType: null,
      selectedData: null, // 当前选中的数据
      selectedSafetyLevel: "", // 存储当前选中的安全等级
      selectedHazard: null,
      selectedItem: null,
      infoWindow: null,
      townList: [], // 行政区划列表
       selectedAid: '', // 选中的行政区划ID
       selectedRoadIds: [],
    selectedIntersectionIds: [],
    };  
  },
  methods: {
    handleTownChange() {
  this.fetchRoadList(this.selectedAid); // 根据选中的区划重新获取道路
},
highlightSelectedRoads() {
  this.roadPolylines.forEach(({ polyline, id, roadData }) => {
    if (this.selectedRoadIds.includes(id)) {
      const safetyLevel = this.getSafetyLevel(roadData.score);
      polyline.setStrokeColor(safetyLevel.color);
      polyline.setStrokeWeight(3);
      polyline.setStrokeOpacity(1);
    } else {
      polyline.setStrokeWeight(3);
      polyline.setStrokeOpacity(0.2);
    }
  });

  // 清除其他标注（如果需要）
  this.markers.forEach(marker => this.map.removeOverlay(marker));
  this.circles.forEach(circle => this.map.removeOverlay(circle));
  this.markers = [];
  this.circles = [];
},
    async fetchTownList() {
  try {
    const res = await screenTownList();
    if (res.code === 0) {
      this.townList = res.data || [];
    } else {
      console.error("行政区划获取失败", res.msg);
    }
  } catch (err) {
    console.error("获取行政区划列表错误", err);
  }
},
  getSafetyLevel(score) {
    if (score >= 90) {
      return { text: '良好', color: '#32AF06' }; // 绿色
    } else if (score >= 60) {
      return { text: '轻微隐患', color: '#EFCA15' }; // 黄色
    } else {
      return { text: '严重隐患', color: '#D30C0F' }; // 红色
    }
  },
  handleItemSelection(item) { 
    console.log('父组件接收到的选中值:', item);

    // 在这里处理选中的值，例如更新某个状态
    this.selectedItem = item;

    // 解析经纬度，确保 point 是 BMap.Point
    const [lng, lat] = item.point.split(',').map(Number);
    const point = new BMap.Point(lng, lat);

    let iconSrc = ''; 
    let level = ''; 

    switch (item.yhdj_name) { 
      case '轻微隐患': 
        iconSrc = require('@/assets/minorpitfall.png'); 
        level = '轻微隐患'; 
        break; 
      case '一般隐患': 
        iconSrc = require('@/assets/generalpitfall.png'); 
        level = '一般隐患'; 
        break; 
      case '重大隐患': 
        iconSrc = require('@/assets/seriouspitfall.png'); 
        level = '重大隐患'; 
        break; 
      case '特大隐患': 
        iconSrc = require('@/assets/majorpitfall.png'); 
        level = '特大隐患'; 
        break; 
      default: 
        iconSrc = require('@/assets/pitfall.png'); 
        level = '未知隐患'; 
        break; 
    }

    // 创建百度地图图标
    const myIcon = new BMap.Icon(iconSrc, new BMap.Size(30, 30)); 
    const marker = new BMap.Marker(point, { icon: myIcon }); 
     // 只移除标注，不影响道路划线
    this.map.getOverlays().forEach(overlay => {
      if (overlay instanceof BMap.Marker) {
        this.map.removeOverlay(overlay);
      }
    });
    // 先移除已有的标注（如果需要）
    // this.map.clearOverlays();

    // 添加新标注
    this.map.addOverlay(marker); 
    console.log("标注已添加:", marker);

    // 调整地图视角
    this.map.panTo(point); 
    console.log("地图视角已调整:", point);


  },
  toggleSelectAll(type, event) {
    const checked = event.target.checked;
    if (type === 'road') {
      this.selectedRoadIds = checked ? this.roadScores.map(item => item.id) : [];
    } else if (type === 'intersection') {
      this.selectedIntersectionIds = checked ? this.intersectionScores.map(item => item.id) : [];
    }
  },
  handleIntersectionSelection(intersection) {
    this.selectedType = "路口";
      this.selectedData = intersection;
  // 清除所有路口标注和圆圈
  this.markers.forEach(marker => this.map.removeOverlay(marker));
  this.circles.forEach(circle => this.map.removeOverlay(circle));
  this.markers = [];
  this.circles = [];

  // 添加新标注逻辑
  const [lng, lat] = intersection.point.split(',').map(Number);
  const point = new BMap.Point(lng, lat);

  // 自定义标注图标
  const icon = new BMap.Icon(this.lukoImage, new BMap.Size(20, 20)); // 设置图标大小
  const marker = new BMap.Marker(point, { icon });

  // 确保标注添加成功
  this.map.addOverlay(marker);
  this.markers.push(marker); // 存储新标注

  // 添加蓝色透明圆圈
  const circle = new BMap.Circle(point, 100, {
    strokeColor: '#3877F2',
    strokeWeight: 2,
    strokeOpacity: 0.8,
    fillColor: '#3877F2',
    fillOpacity: 0.3, // 设置透明度
  });
  this.map.addOverlay(circle);
  this.circles.push(circle); // 存储新圆圈

  // 增大地图缩放等级
  const targetZoomLevel = 18; // 目标缩放等级
  this.map.setZoom(targetZoomLevel);

  // 将视图居中到新标注位置
  this.map.setCenter(point);

  console.log('New marker, circle added, and zoom level set to:', targetZoomLevel);
},
  async handleRoadSelectionByRoad() {
    console.log(111111111111111111)
    console.log(this.selectedRoadId)
    console.log(this.selectedRoadIds)
  try {

    const params = { 
      id: this.selectedRoadIds.length ? this.selectedRoadIds.join(',') : this.selectedRoadId,
      yhdj: this.selectedSafetyLevel || undefined, // 传入选中的安全等级，默认不传
      aid: this.selectedAid || undefined // ✅ 关键点：加上这行

    };
    // 如果选中“全部”，不传递道路ID
    const res = await safeRoadChild(params);
    if(this.selectedRoadId === null){
      this.selectedType = 'all'
    }
    // con
    if (res.code === 0) {
      this.roadScores = res.data.section || []; // 更新路段数据
      this.intersectionScores = res.data.crossing || []; // 更新路口数据
      // console.log( 11111)
      // console.log( this.roadScores)
      // console.log( this.intersectionScores)
      // 绘制地图上的所有路段
      this.drawRoads(this.roadScores);
      //清空路口
      this.markers.forEach(marker => this.map.removeOverlay(marker));
      this.circles.forEach(circle => this.map.removeOverlay(circle));
      this.markers = [];
      this.circles = [];
      // 如果是“全部”，清空选中道路
      if (this.selectedRoadId === null) {
        this.selectedRoad = null;
        this.selectedData = null;
      } else {
        // 设置选中的道路
        const selectedRoad = this.roadList.find(road => road.id === this.selectedRoadId);
        this.selectedRoad = selectedRoad || null;
        this.selectedType = "道路";
        // this.selectedTab = "道路";
        this.selectedData = selectedRoad || null;
      }
    } else {
      console.error("Failed to fetch road data:", res.msg);
    }
  } catch (error) {
    console.error("Error fetching road data:", error);
  }
},
async fetchRoadList(aid = '') {
  try {
    const res = await screenRoadList({ aid });
    if (res.code === 0) {
      this.roadList = [{ id: null, name: '全部' }, ...res.data.road];
      this.selectedRoadId = null;
      this.handleRoadSelectionByRoad(); // ⚠️ aid 需一并用于数据加载
    } else {
      console.error("Failed to fetch road list:", res.msg);
    }
  } catch (error) {
    console.error("Error fetching road list:", error);
  }
},
    handleButtonSelected(index) {
      const routes = ['/big-screen2', '/big-screen3', '/big-screen4', '/big-screen5', '/'];
      this.$router.push(routes[index]);
    },
    
    async fetchRoadScores(roadId) {
      console.log('roadId'+roadId)

      const params = { 
        id: roadId, 
      };
      const response = await safeRoadChild(params);
      if (response.code === 0) {
        this.roadScores = response.data.section;
      }
    },
    async fetchIntersectionScores(roadId) {
      console.log('roadId2'+roadId)
      const params = { 
        id: roadId, 
      };
      const response = await safeRoadChild(params);
      if (response.code === 0) {
        this.intersectionScores = response.data.crossing;
      }
    },

    async fetchRoadAndIntersectionScores() {
  try {
    const res = await safeRoadChild(this.selectedRoadId); // 根据选中的 ID 调用接口
    if (res.code === 0) {
      this.roadScores = res.data.section || []; // 更新路段数据
      this.intersectionScores = res.data.crossing || []; // 更新路口数据
    } else {
      console.error("Failed to fetch road and intersection scores:", res.msg);
    }
  } catch (error) {
    console.error("Error fetching road and intersection scores:", error);
  }
},
selectTab(tab) {
  this.selectedTab = tab;

  // 根据选中的 Tab 调用接口
  if (tab === '路段') {
    this.fetchRoadScores(this.selectedRoadId); // 传递选中的道路 ID
  } else if (tab === '路口') {
    this.fetchIntersectionScores(this.selectedRoadId); // 传递选中的道路 ID
  }
},
async initMap() {
    if (!this.map) {
      this.map = new BMap.Map('map');
    }
    // 设置中心点和缩放级别
    this.map.centerAndZoom(new BMap.Point(120.168, 33.355), this.zoomLevel);
    this.map.enableScrollWheelZoom(true);
    
    // 应用地图样式
    try {
      const response = await fetch('/custom_map_config.json');
      const mapStyle = await response.json();
      this.map.setMapStyleV2({ styleJson: mapStyle });
    } catch (error) {
      console.error('Failed to load custom map style:', error);
    }
    // 加载道路数据
    await this.drawRoads();
  },

  async drawRoads(roadScores) {
  // 移除已有的路段折线（仅清除路段，不影响其他标注）

  console.log("Drawing roads...");
  this.roadPolylines.forEach(({ polyline }) => {
    this.map.removeOverlay(polyline);
  });
  this.roadPolylines = [];

  roadScores.forEach((road) => {
    try {
      const waypoints = JSON.parse(road.waypoints || '[]');
      const points = waypoints.map(point => new BMap.Point(point.lng, point.lat));
      // points.unshift(new BMap.Point(...road.spoint.split(',').map(Number)));
      // points.push(new BMap.Point(...road.epoint.split(',').map(Number)));
      const safetyLevel = this.getSafetyLevel(road.score);
      const strokeColor = safetyLevel.color; // 获取颜色
      const polyline = new BMap.Polyline(points, {
        strokeColor: strokeColor, // 默认透明蓝色
        strokeWeight: 3,
        strokeOpacity: 0.8,
        zIndex: 2,
      });

      this.map.addOverlay(polyline);
      this.roadPolylines.push({ id: road.id, polyline, roadData: road });
    } catch (error) {
      console.error('Invalid waypoints for road:', road, error);
    }
  });
},

  handleRoadSelection(road) {
  // 遍历所有路段
  console.log(2222222222)
  console.log(road)
  this.selectedType = "路段";
      this.selectedData = road;
  this.roadPolylines.forEach(({ polyline, id }) => {
    if (id === road.id) {
      const safetyLevel = this.getSafetyLevel(road.score); // 根据评分获取颜色
      polyline.setStrokeColor(safetyLevel.color); 
      polyline.setStrokeWeight(3); 
      polyline.setStrokeOpacity(1); // 不透明
    } else {
      // const safetyLevel = this.getSafetyLevel(road.score); // 根据评分获取颜色
      // polyline.setStrokeColor(safetyLevel.color); 
      polyline.setStrokeWeight(3); 
      polyline.setStrokeOpacity(0.2); // 设置透明度
    }
  });

  // 更新选中的路段信息
  const selected = this.roadPolylines.find(item => item.id === road.id);
  if (selected) {
    this.selectedRoad = { ...selected.roadData };
    console.log('selectedRoad',this.selectedRoad)
    // 自动居中到选中的路段
    this.map.setViewport(selected.polyline.getPath());
  }

  this.markers.forEach(marker => this.map.removeOverlay(marker));
  this.circles.forEach(circle => this.map.removeOverlay(circle));
  this.markers = [];
  this.circles = [];
},

  changePage(page) {
      this.currentPage = page;
    },

},
computed: {
    totalRoadPages() {
      return Math.ceil(this.roadScores.length / this.itemsPerPage);
    },
    paginatedRoadData() {
      const start = (this.roadCurrentPage - 1) * this.itemsPerPage;
      return this.roadScores.slice(start, start + this.itemsPerPage);
    },
    totalIntersectionPages() {
      return Math.ceil(this.intersectionScores.length / this.itemsPerPage);
    },
    paginatedIntersectionData() {
      const start = (this.intersectionCurrentPage - 1) * this.itemsPerPage;
      return this.intersectionScores.slice(start, start + this.itemsPerPage);
    },
  },
  mounted() {
    this.initMap();
    this.fetchTownList();
    this.fetchRoadList(); // 获取道路下拉框数据并初始化列表框
    this.fetchRoadAndIntersectionScores(); // 加载初始路段和路口数据（无参数）
  },
};
</script>
<style scoped>
.big-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
}

.map-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.fixed-div {
  position: absolute;
  top: 120px;
  left: 10px;
  width: 446px;
  /* height: 136px; */
  background: linear-gradient(135deg, #1f2a51, #0b1224);
  border-radius: 4px;
  border: 1px solid #3877F2;
  padding: 20px;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3); /* 添加阴影 */
}

.label {
  color: white;
  margin-bottom: 10px;
  font-size: 14px; /* 增大字体 */
  font-weight: 500;
}

.styled-select {
  width: 330px;
  height: 38px;
  background: #1a2d52; /* 修改背景色为深色 */
  border-radius: 6px;
  border: 1px solid #3877F2;
  color: white;
  padding: 8px;
  font-size: 16px; /* 增大字体，增加可读性 */
  transition: all 0.3s ease;
}

.styled-select:focus {
  border-color: #6a9fff; /* 聚焦时边框高亮 */
  outline: none;
  box-shadow: 0 0 8px rgba(56, 119, 242, 0.8);
}

</style>
<style scoped>
.statistics-div {
  position: absolute;
  bottom: 50px;
  left: 10px;
  width: 446px;
  background: linear-gradient(135deg, #1f2a51, #0b1224);
  border-radius: 4px;
  border: 1px solid #3877F2;
  padding: 10px;
  z-index: 1000;
  color: white;
  height: 510px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); /* 添加阴影 */
}

.statistics-title {
  font-size: 18px; /* 增大字体 */
  font-weight: 600;
  margin-bottom: 10px;
  text-align: center; /* 居中 */
  color: #ffcc00; /* 统计框标题颜色 */
}

.statistics-subtitle {
  font-size: 16px; /* 增大副标题字体 */
  font-weight: 500;
  margin-bottom: 10px;
  color: #5c9fff; /* 副标题颜色 */
}

.statistics-list {
  margin: 0;
  padding: 0;
  list-style-type: none;
  font-size: 14px;
  line-height: 1.8; /* 增加行间距，避免文字过于拥挤 */
}


</style>

<style scoped>
.popup {
    position: absolute;
    overflow: hidden;
    padding: 20px;
    border-radius: 5px;
    background-color: transparent; /* 确保背景色是透明的 */
    width: 300px;
    height: 600px;
}

.popup-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image:url('../../assets/popbg.png');;
    background-size: contain; /* 确保背景图片完整显示 */
    background-repeat: no-repeat;
    background-position: center;
    z-index: -1; /* 确保背景在内容后面 */
}

.popup-title {
    font-size: 16px;
    height: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0 10px;
    margin-top: 120px;
    background: linear-gradient(270deg, rgba(23, 54, 125, 0.4) 0%, #193D8C 50%, rgba(23, 54, 125, 0.4) 100%);
    border-radius: 5px;
}

.title img {
    width: 20px;
    height: 20px;
}

.mmfont {
    flex: 1;
    text-align: center;
    color: #FFFFFF;
}

.road-info {
    display: flex;
    justify-content: space-between;
    width: 335px;
    margin-top: 10px;
}
</style>
<style scoped>
/* .statistics-div {
  position: absolute;
  bottom: 50px;
  left: 10px;
  width: 446px;
  background: linear-gradient(135deg, #1f2a51, #0b1224);
  border-radius: 8px;
  border: 1px solid #3877F2;
  padding: 20px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
} */

.statistics-header {
  display: flex;
  background: #1D3877;
  color: #89C0FF;
  height: 32px;
  line-height: 32px;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  border-radius: 4px;
}

.statistics-row {
  display: flex;
  height: 32px;
  line-height: 32px;
  font-size: 14px;
  color: #FFFFFF;
  text-align: center;
  /* background: #112552; */
  border-radius: 4px;
}

.statistics-row.row-alternate {
  background: #2A3A65;
}

.statistics-cell {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 5px;
  white-space: nowrap; /* 禁止换行 */
  overflow: hidden; /* 隐藏溢出内容 */
  text-overflow: ellipsis; /* 添加省略号 */
}

.statistics-cell.name-column {
  flex: none; /* 禁用弹性布局 */
  width: 100px; /* 固定宽度 */
  white-space: nowrap; /* 禁止换行 */
  overflow: hidden; /* 隐藏溢出内容 */
  text-overflow: ellipsis; /* 添加省略号 */
}
</style>
<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  font-size: 14px;
}

.pagination button {
  background-color: #3877F2;
  color: white;
  border: 1px solid #3877F2;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin: 0 5px;
  transition: all 0.3s ease;
}

.pagination button:hover {
  background-color: #6a9fff;
  border-color: #6a9fff;
}

.pagination button:disabled {
  background-color: #f2f2f2;
  color: #ccc;
  border-color: #ddd;
  cursor: not-allowed;
}

.pagination span {
  color: #333;
  font-size: 14px;
  margin: 0 10px;
}

.pagination .active {
  background-color: #fff;
  color: #3877F2;
  border: 1px solid #3877F2;
  font-weight: bold;
}


.section-mid {
  position: absolute;
  top: 310px;
  left: 10px;
  width: 446px;
  height: 40px;
  background-image: url('../../assets/sidebarTitle.png');
  background-size: cover;
  background-position: center;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tab-container {
  display: flex;
  justify-content: space-between;
  width: 65%;
  padding: 0 20px;
}

.tab-item {
  color: #89C0FF;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-item.active {
  color: #FFFFFF;
  text-shadow: 0 0 8px rgba(56, 119, 242, 0.8);
  box-shadow: 0 0 12px rgba(56, 119, 242, 0.6);
  border-radius: 4px;
  /* padding: 2px 8px; */
}

.separator {
  color: #89C0FF;
  font-size: 16px;
  font-weight: bold;
}
.safety-level {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
  vertical-align: middle;
}

</style>
<style>
.hazard-info {
  position: absolute;
  top: 120px;
  left: 480px;
  background:linear-gradient(135deg, #1f2a51, #0b1224);
  border: 1px solid #3877F2;
  color: white;
  padding: 15px;
  border-radius: 5px;
  width: 320px;
  z-index: 1000;
  font-size: 14px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  font-family: Arial, sans-serif;
}
.hazard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 2px solid #1E4E8C;
  /* padding-bottom: 5px;
  margin-bottom: 10px; */
}
.close-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
}
.hazard-desc {
  color: #F7C948;
}
.hazard-image-container {
  margin-top: 10px;
  text-align: center;
}
.hazard-image-container img {
  max-width: 100%;
  border-radius: 5px;
}


.statistics-div {
  max-height: 630px; /* 你可以根据需求调整高度 */
  overflow-y: auto;  /* 允许垂直滚动 */
}


/* 滚动条整体区域 */
.statistics-div::-webkit-scrollbar {
  width: 10px; /* 滚动条宽度 */
}

/* 滚动条轨道 */
.statistics-div::-webkit-scrollbar-track {
  background: linear-gradient(135deg, #1f2a51, #0b1224); /* 轨道背景 */
  border-radius: 5px;
  border: 1px solid #3877F2; /* 轨道边框 */
}

/* 滚动条滑块 */
.statistics-div::-webkit-scrollbar-thumb {
  background: #3877F2; /* 滑块颜色 */
  border-radius: 5px;
  border: 2px solid #1f2a51; /* 滑块边框 */
}

/* 鼠标悬停时的滚动条滑块 */
.statistics-div::-webkit-scrollbar-thumb:hover {
  background: #5a8df8; /* 悬停时的颜色 */
}

/* Firefox 支持 */
.statistics-div {
  scrollbar-color: #3877F2 #1f2a51;
  scrollbar-width: thin; /* 滚动条宽度变细 */
}

</style>
