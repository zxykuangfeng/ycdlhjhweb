<template>
  <div class="big-screen">
    <header-component :headerImage="headerImage" :buttonImage="buttonImage" :selectedButtonImage="selectedButtonImage"
      :buttonCount="buttonCount" :initialSelectedButton="0" :buttonLabels="buttonLabels"
      @button-selected="handleButtonSelected" />
    <div class="content">
      <div id="map" class="map-container"></div>
    </div>
    <!-- 固定的左上角选择框 -->
    <!-- <div class="section-top" style="width: 443px;height: 40px;line-height: 40px;padding-left: 30px;margin-top: 20px;font-size: 16px;font-weight: 800;display: flex;align-items: center;">
     <img :src="right"> <div style="margin-left: 3px;">选择区划</div>
    </div>
  -->
    <div class="section-top" style="width: 443px;height: 40px;line-height: 40px;padding-left: 30px;margin-top: 20px;font-size: 16px;font-weight: 800;display: flex;align-items: center;">
     <img :src="right"> <div style="margin-left: 3px;">选择道路</div>
    </div>

    <div class="fixed-div" style="top:120px"> 
      <div >  <label class="label">行政 区划</label>
  <el-select
    v-model="selectedAid"
    placeholder="请选择行政区划"
    clearable
    style="width: 330px;"
    @change="fetchRoadList"
  >
    <el-option
      v-for="item in townList"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    />
  </el-select>
  <div style="margin-top: 20px;">
      <label for="road-select" class="label">道路 搜索</label>
      <el-select
      v-model="selectedRoadId"
      filterable         
      clearable        
      placeholder="请选择或输入搜索"
      @change="fetchRoadSections" 
      popper-class="my-custom-dropdown"
      style="width: 330px;"
    >
      <el-option
        v-for="road in roadList"
        :key="road.id"
        :label="road.name"
        :value="road.id"
      />
    </el-select>
  </div>
  </div>
  <div style="margin-top: 20px;">
  <label class="label">路段/路口</label>
  <!-- 使用 el-select 替换原生 select -->
  <el-select
    v-model="selectedSelectionRoadId"
    style="width: 330px;"
    @change="handleRoadSelection"
    placeholder="请选择路段或路口"
  >
    <!-- 用 el-option 渲染每个选项 -->
    <el-option
      v-for="road in roadRectionList"
      :key="road.id"
      :label="road.name"
      :value="road.id"
    />
  </el-select>
</div>
  </div>
  <!-- <div></div>
   
    </div>  -->
      <!-- <div><label for="road-select" class="label">道路 搜索</label> <input
        type="text"
        v-model="fakeSearch"
        placeholder="请输入道路名称"
        @input="filterRoadList"
        @focus="showDropdown = true"
        class="styled-select"
      /></div>
      <label for="road-select" class="label">道路 名称</label>
     
      <select id="road-select" v-model="selectedRoadId" @change="fetchRoadSections" class="styled-select" >
      <option v-for="road in filteredRoadList" :key="road.id" :value="road.id">{{ road.name }}</option>
    </select>

      <label for="road-select"   class="label">路段/路口</label>
      <select id="road-select" v-model="selectedSelectionRoadId" @change="handleRoadSelection" class="styled-select">
        <option v-for="road in roadRectionList" :key="road.id" :value="road.id">{{ road.name }}</option>
      </select>
    </div> -->
    <!-- 左侧新增统计框 -->
  
<div class="statistics-div">

  <h3 class="title" style="
      font-size: 16px;
      height: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 0 10px;
      background: linear-gradient(270deg, rgba(23, 54, 125, 0.4) 0%, #193D8C 50%, rgba(23, 54, 125, 0.4) 100%);
      border-radius: 5px;">
    <img :src="right" alt="右侧图片" style="width: 20px; height: 20px;"> 
    <div style="flex: 1; text-align: center; color: #FFFFFF;" class="mmfont">道路基础信息</div>
    <img :src="left" alt="左侧图片" style="width: 20px; height: 20px;">
 
  </h3>   
  <div v-if="road_name" style="font-size:14px;padding-left: 20px">道路名称:{{ road_name }} {{road_length}}km</div>
  <div v-if="town_name" style="font-size:14px;padding-left: 20px">所属行政区划:{{town_name}}</div>
  <h3 class="title" style="
      font-size: 16px;
      height: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 0 10px;
      background: linear-gradient(270deg, rgba(23, 54, 125, 0.4) 0%, #193D8C 50%, rgba(23, 54, 125, 0.4) 100%);
      border-radius: 5px;">
    <img :src="right" alt="右侧图片" style="width: 20px; height: 20px;"> 
    <div style="flex: 1; text-align: center; color: #FFFFFF;" class="mmfont">道路关联设施统计</div>
    <img :src="left" alt="左侧图片" style="width: 20px; height: 20px;">
  </h3>
  <div class="statistics-section">
  <h4 class="statistics-subtitle">交通标志</h4>
  <ul class="statistics-list">
    <li v-for="(count, type) in trafficSignCounts" :key="type">
      <div class="count">{{ count }}</div>
      <div class="type">{{ type }}</div>
    </li>
  </ul>
</div>

<div class="statistics-section">
  <h4 class="statistics-subtitle">路面标线</h4>
  <ul class="statistics-list">
    <li v-for="(count, type) in roadMarkCounts" :key="type">
      <div class="count">{{ count }}</div>
      <div class="type">{{ type }}</div>
    </li>
  </ul>
</div>
</div>

    <div class="custom-hazard-box">
      <h3 class="custom-box-title">道路资产</h3>
      <div class="custom-hazard-indicators">
        <div class="custom-hazard-item" 
            v-for="item in assetList" 
            :key="item.fid" 
            @click="handleAssetClick(item.fid)"
            :class="{ 'selected-asset': selectedAssetType === item.fid }">
          <img :src="item.image" :alt="item.label" />
          <span>{{ item.label }}</span>
        </div>
      </div>
    </div>
    <!-- <transition name="scale-popup"> -->
      <div v-if="popupVisible && !panoramaMode" class="popup">
      <div class="popup-background"></div>
      <h3 class="popup-title">
        <img :src="right" alt="右侧图片" />
        <div class="mmfont">路段信息</div>
        <img 
          :src="cha2Image" 
          alt="叉号" 
          style="width: 15px; height: 15px; cursor: pointer;" 
          @click="popupVisible = false"
        />

      </h3>
      <div class="road-info">
        <div>
          <strong>路段名称：</strong>
          <span>{{ selectedRoad.name }}</span>
        </div>
        <div>
          <strong>所属行政区划：</strong>
          <span>{{ selectedRoad.town_name }}</span>
        </div>
        <div>
          <strong>道路类别：</strong>
          <span>{{ selectedRoad.type_name }}
            <!-- <img
              v-if="selectedRoad.type_name === '高速道路'"
              style="width: 20px; height: 20px;"
              :src="require('@/assets/gs.png')"
              alt="高速道路"
            />
            <img
              v-else-if="selectedRoad.type_name === '国省道路'"
              style="width: 20px; height: 20px;"
              :src="require('@/assets/gsg.png')"
              alt="国省道路"
            />
            <img
              v-else-if="selectedRoad.type_name === '城市主干道'"
              style="width: 20px; height: 20px;"
              :src="require('@/assets/zg.png')"
              alt="城市主干道"
            />
            <img
              v-else-if="selectedRoad.type_name === '城市次干道'"
              style="width: 20px; height: 20px;"
              :src="require('@/assets/zcg.png')"
              alt="城市次干道"
            />
            <img
              v-else-if="selectedRoad.type_name === '县乡村道路'"
              style="width: 20px; height: 20px;"
              :src="require('@/assets/xc.png')"
              alt="县乡村道路"
            />
            <img
              v-else
              style="width: 20px; height: 20px;"
              :src="require('@/assets/wm.png')"
              alt="无名道路"
            /> -->
          </span>
        </div>
        <div>
          <strong>所属道路：</strong>
          <span>{{ selectedRoad.road_name }}</span>
        </div>
        <div>
          <strong>起点经纬度：</strong>
          <span>{{ formatCoordinates(selectedRoad.spoint) }}</span>
        </div>
        <div>
          <strong>终点经纬度：</strong> 
          <span>{{ formatCoordinates(selectedRoad.epoint) }}</span>
        </div>
      </div>
      <div class="separator"></div>
      <button @click="closePopup" class="popup-close-btn">关闭</button>
    </div>

    <div class="map-mode-switch">
  <button @click="switchToMapMode" class="switch-button">地图</button>
  <button @click="switchToSatelliteMode" class="switch-button">地球</button>
  <button @click="switchToPanoramaMode" class="switch-button">实景</button>
</div>
    <!-- </transition> -->
    <div v-if="panoramaVisible" class="panorama-popup">
  <div class="popup-background2"></div>
  <div class="panorama-content" style="display: flex;align-items: center;flex-direction: column;padding-top: 10px;">
    <h3 class="title" style="
      font-size: 16px;
      height: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 0 10px;
      background: linear-gradient(270deg, rgba(23, 54, 125, 0.4) 0%, #193D8C 50%, rgba(23, 54, 125, 0.4) 100%);
      border-radius: 5px;">
    <img :src="right" alt="右侧图片" style="width: 20px; height: 20px;"> 
    <div style="flex: 1; text-align: center; color: #FFFFFF;" class="mmfont">实景图</div>
    <!-- <img :src="left" alt="左侧图片" style="width: 20px; height: 20px;"> -->
    <img :src="cha2Image" alt="叉号"   style="width: 15px; height: 15px; cursor: pointer;"  @click="panoramaVisible = false">
    <!-- cha2 -->
  </h3>
  <img 
      :src="currentImage" 
      alt="实景图" 
      class="panorama-image"
      @click="openLargeImage(currentImage,true)"
    /> 
    <div>    
      <button 
      @click="prevImage" 
      class="image-nav-button" 
      > <img :src="leftImage" alt="" /></button>
    <button 
      @click="nextImage" 
      class="image-nav-button" 
      ><img :src="rightImage" alt="" /></button></div>

  </div>

 
</div>
 <div v-if="showLargeImagePopup" class="large-image-popup">
  <div class="popupbig-background"></div>
  <div class="popupbig-content">
     <div style="display: flex;align-items: center;">    
      <button 
        v-if="isPanoramaImg"
        @click="prevImage" 
        class="image-nav-button" 
        style="margin-right: 20px;background: transparent"
      ><img :src="leftImage" alt="" /></button>

    <img :src="largeImageSrc" alt="大图" class="large-image" />
    <!-- <img 
      :src="cha2Image" 
      alt="关闭" 
      class="close-icon" 
      @click="closeLargeImage"
    /> -->
   

    <button
        v-if="isPanoramaImg"
        @click="nextImage" 
        class="image-nav-button" 
        style="margin-left: 20px;background: transparent"
      ><img :src="rightImage" alt="" /></button></div>

    <div class="close-button" @click="closeLargeImage">×</div>

  </div>
</div>
</div>
</template>


<script>
import HeaderComponent from '@/components/Header/HeaderComponent';
import { getRoadSectionList,screenTownList,screenRoadList,screenRoadChildList,roadFacility,property,roadFacilityRoad,roadFacilityAll,jcvDetail,jcvOp } from '@/api/road';
export default {
  name: 'BigScreen2',
  components: {
    HeaderComponent,
  },
  data() {
    return {
      selectedAid: null,
      townList: [], 
      headerImage: require('@/assets/header-image.png'),
      buttonImage: require('@/assets/button.png'),
      selectedButtonImage: require('@/assets/button-selected.png'),
      stopImage: require('@/assets/stop.svg'),
      popbgImage: require('@/assets/popbg.png'),
      cha2Image: require('@/assets/cha2.png'),
      minorpitfallImage: require('@/assets/minorpitfall.png'),
      stopImage: require('@/assets/stop.png'), 
      tipsImage: require('@/assets/tips.png'),
      luzhifallImage: require('@/assets/luzhi.png'),
      dengImage: require('@/assets/deng.png'),
      sgaqImage: require('@/assets/sgaq.png'),
      chaImage: require('@/assets/cha.png'),
      leftImage: require('@/assets/lefticon.png'),
      rightImage: require('@/assets/righticon.png'),
      showLargeImagePopup: false, // 控制大图弹窗的显示
      largeImageSrc: '', // 当前大图的图片地址
      roadImgs: [require('@/assets/road1.jpg'), require('@/assets/road2.jpg'), require('@/assets/road3.jpg'), require('@/assets/road4.jpg'), require('@/assets/road5.jpg')],
      panoramaMode: false, // 是否处于全景模式
      panoramaCursor: require('@/assets/qj.png'), // 全景模式鼠标样式
      panoramaImage: '', // 模拟的实景图地址
      panoramaVisible: false, // 是否显示全景图片弹窗
      buttonCount: 4,
      buttonLabels: ['道路户籍化', '隐患画像', '安全评分','事故画像', '管理平台'],
      zoomLevel: 16, // 初始缩放等级
      map: null, // 保存地图实例
      roadRectionList: [], // 保存所有道路数据
      roadList: [], // 道路列表
      roadPolylines: [], // 保存所有道路的折线对象
      selectedRoadId: null, 
      selectedSelectionRoadId: null, // 当前选中的道路 ID
      selectedRoad: null, // 当前选中的道路数据
      popupVisible: false, // 弹框是否可见
      popupVisible2: false,
      right: require('@/assets/right.png'),
      left: require('@/assets/left.png'),
      trafficSignCounts: {}, // 交通标志统计数据
      roadMarkCounts: {}, // 路面标线统计数据
      allTrafficSignCounts: {}, // 全部道路的交通标志统计
      allRoadMarkCounts: {}, // 全部道路的路面标线统计
      town_name:null,
      road_length:null,
      road_name:null,
      selectedAssetType: null, // 选中的资产类型
      isOpeningPopup: false,
      points: [
  // {"lng": 120.15173, "lat": 33.38557, "type": 4},
  // {"lng": 120.1516, "lat": 33.38636, "type": 1},
  // {"lng": 120.15149, "lat": 33.38692, "type": 6},
  // {"lng": 120.15147, "lat": 33.38701, "type": 1},
  // {"lng": 120.15077, "lat": 33.38944, "type": 4},
  // {"lng": 120.15045, "lat": 33.3906, "type": 5},
  // {"lng": 120.15045, "lat": 33.3906, "type": 4},
  // {"lng": 120.15043, "lat": 33.39066, "type": 6},
  // {"lng": 120.15041, "lat": 33.39075, "type": 3},
  // {"lng": 120.1504, "lat": 33.39079, "type": 5},
  // {"lng": 120.15241, "lat": 33.37878, "type": 3},
  // {"lng": 120.15279, "lat": 33.37884, "type": 1},
  // {"lng": 120.1549, "lat": 33.37925, "type": 3},
  // {"lng": 120.1555, "lat": 33.37947, "type": 3},
  // {"lng": 120.1555, "lat": 33.37947, "type": 3},
  // {"lng": 120.15591, "lat": 33.37971, "type": 1},
  // {"lng": 120.15651, "lat": 33.38015, "type": 2},
  // {"lng": 120.15665, "lat": 33.38027, "type": 3},
  // {"lng": 120.1571, "lat": 33.38061, "type": 6},
  // {"lng": 120.15758, "lat": 33.38098, "type": 6},
  // {"lng": 120.13573, "lat": 33.38753, "type": 6},
  // {"lng": 120.13582, "lat": 33.38755, "type": 1},
  // {"lng": 120.13594, "lat": 33.38757, "type": 3},
  // {"lng": 120.13618, "lat": 33.38762, "type": 2},
  // {"lng": 120.13657, "lat": 33.3877, "type": 5},
  // {"lng": 120.13724, "lat": 33.38782, "type": 6},
  // {"lng": 120.13773, "lat": 33.38792, "type": 4},
  // {"lng": 120.13779, "lat": 33.38793, "type": 6},
  // {"lng": 120.13779, "lat": 33.38793, "type": 3},
  // {"lng": 120.13778, "lat": 33.38796, "type": 1}
],
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
    markerImages: [
      '',
      '',
      '',
      '',
      '',
      '',
      require('@/assets/minorpitfall.png'),
      require('@/assets/stop.png'),
      require('@/assets/tips.png'),
      require('@/assets/luzhi.png'),
      require('@/assets/deng.png'),
      require('@/assets/sgaq.png'),
    ],
    popupVisible: false, // 弹窗是否可见
    popupContent: {
      type: '',
      image: '',
    }, // 弹窗内容
    fakeSearch: "", // 搜索框内容
    filteredRoadList: [], // 筛选后的道路列表
    showDropdown: false, // 控制下拉框的显示
    currentImage:"",

    currentImageId:"",
    isPanoramaImg:false,
    assetList: [
      { fid: 7, image: require('@/assets/minorpitfall.png'), label: '警告标志' },
      { fid: 9, image: require('@/assets/tips.png'), label: '指示标志' },
      { fid: 10, image: require('@/assets/luzhi.png'), label: '指路标志' },
      { fid: 8, image: require('@/assets/stop.png'), label: '禁令限速标志' },
      { fid: 11, image: require('@/assets/deng.png'), label: '交通信号灯' },
      // { fid: 12, image: require('@/assets/deng.png'), label: '交通信号灯' }
    ]
    };

    
  },
  methods: {
      // 筛选道路列表
  filterRoadList() {
    const query = this.fakeSearch.trim().toLowerCase();
    this.filteredRoadList = this.roadList.filter((road) =>
      road.name.toLowerCase().includes(query)
    );
  },

  // 当用户选择道路时，同步搜索框内容
  fetchRoadSections() {
    const selectedRoad = this.roadList.find(
      (road) => road.id === this.selectedRoadId
    );
    this.fakeSearch = selectedRoad ? selectedRoad.name : ""; // 将选中道路的名称同步到搜索框
    console.log("选中的道路ID: ", this.selectedRoadId);
  },

  // 隐藏下拉框（延迟隐藏以避免直接点击关闭）
  hideDropdown() {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  },
  async drawPolygon(polygonData, safe_status) {
    if (!this.map) return;

    // 清除现有覆盖物
    this.map.getOverlays().forEach(overlay => {
      if (overlay instanceof BMap.Polygon) {
        this.map.removeOverlay(overlay);
      }
    });

    const colorMapping = {
      0: { strokeColor: 'blue', fillColor: '#87CEEB' },
      1: { strokeColor: '#70A45D', fillColor: 'rgba(50, 175, 6, 0.3)' },
      2: { strokeColor: '#A4865D', fillColor: 'rgba(175, 100, 6, 0.3)' },
      3: { strokeColor: '#A45D5D', fillColor: 'rgba(175, 6, 6, 0.3)' },
    };

    const { strokeColor, fillColor } = colorMapping[safe_status] || colorMapping[0];

    if (polygonData === 'all') {
      try {
        const boundaryService = new BMap.Boundary();
        boundaryService.get('亭湖区', result => {
          if (result.boundaries.length === 0) {
            console.error('Failed to get boundaries for 亭湖区');
            return;
          }

          const allPoints = [];
          result.boundaries.forEach(boundary => {
            const points = boundary
              .split(';')
              .map(coord => coord.split(',').map(Number))
              .map(([lng, lat]) => new BMap.Point(lng, lat));
            const polygon = new BMap.Polygon(points, {
              strokeColor,
              fillColor,
              strokeWeight: 1,
              strokeOpacity: 0.7,
              fillOpacity: 0.3,
            });
            this.map.addOverlay(polygon);
            allPoints.push(...points);
          });

          if (allPoints.length > 0) {
            this.map.setViewport(allPoints);
          }
        });
      } catch (error) {
        console.error('Error fetching boundary data:', error);
      }
      return;
    }

    const polygons = this.parsePolygon(polygonData);
    if (polygons.length === 0) {
      console.error('Polygon data is empty or invalid:', polygonData);
      return;
    }

    const allPoints = [];
    polygons.forEach(points => {
      const polygon = new BMap.Polygon(points, {
        strokeColor,
        fillColor,
        strokeWeight: 1,
        strokeOpacity: 0.7,
        fillOpacity: 0.3,
      });
      this.map.addOverlay(polygon);
      allPoints.push(...points);
    });

    if (allPoints.length > 0) {
      this.map.setViewport(allPoints);
    } else {
      console.warn('No valid points to set viewport.');
    }
  },
  parsePolygon(polygonData) {
    const polygons = [];
    if (polygonData.startsWith('MULTIPOLYGON')) {
      const matches = polygonData.match(/\(\(\((.*?)\)\)\)/g);
      if (matches) {
        matches.forEach(multi => {
          const cleanCoords = multi.replace(/\(\(\(/, '').replace(/\)\)\)/, '');
          const coords = cleanCoords.split(',').map(coord => {
            const [lng, lat] = coord.trim().split(' ').map(Number);
            return new BMap.Point(lng, lat);
          });
          polygons.push(coords);
        });
      }
    } else if (polygonData.startsWith('POLYGON')) {
      const cleanCoords = polygonData.replace(/POLYGON\(\(/, '').replace(/\)\)/, '');
      const coords = cleanCoords.split(',').map(coord => {
        const [lng, lat] = coord.trim().split(' ').map(Number);
        return new BMap.Point(lng, lat);
      });
      polygons.push(coords);
    }
    return polygons.filter(polygon => polygon.length > 0);
  },
    switchToMapMode() {
      if (this.map) {
        this.map.setMapType(BMAP_NORMAL_MAP); // 切换到普通地图模式
        this.exitPanoramaMode(); // 退出全景模式
      }
  },
  async fetchRoadList() {
    try {
      const res = await screenRoadList({ aid: this.selectedAid }); // 添加 aid 参数
      console.log('Road List API Response:', res);
      if (res.code === 0) {
        this.roadList = [{ id: null, name: '全部' }, ...res.data.road];

        this.filteredRoadList = this.roadList;
        this.selectedRoadId = null;
        this.fetchRoadSections();

        const selected = this.townList.find(item => item.id === this.selectedAid);
        if (selected) {
          this.drawPolygon(selected.polygon, selected.safe_status);
        } else {
          this.drawPolygon('all', 1);
        }
      } else {
        console.error('Failed to fetch road list:', res.msg);
      }
    } catch (error) {
      console.error('Error fetching road list:', error);
    }
  },

  async fetchProperty({ type, id, fid } = {}) {
  try {
    const res = await property({ type, id, fid, limit: 100 });
    console.log('Property List API Response:', res);
    
    if (res.code === 0 && res.data) {
      const points = res.data
        //  .slice(0, 100) // 确保只处理前100条
        .map((item) => {
          const [lng, lat] = item.point.split(',').map(Number);
          return {
            name: item.name || '未知标志',
            type: item.fid,
            lat,
            lng,
            fname: item.fname || '未知类型',
            imgs: item.imgs,
            road_name: item.road_name,
            address: item.address,
            create_time: item.create_time,
            section_name: item.section_name,
            direction:item.direction,
          };
        });

      this.points = points;
      // console.log('points', this.points);

      // 添加标注到地图
      this.addMarkersInView(); // 如果只标注 this.points，则这里不需要传参
    } else {
      console.error('Failed to fetch property data:', res.msg);
    }
  } catch (error) {
    console.error('Error fetching property data:', error);
  }
},
  //选中道路的方法
  async fetchRoadSections() {
    try {
      if (this.selectedRoadId === null) {
        // 如果选中“全部”，直接加载全部路段
        const res = await screenRoadChildList();
        if (res.code === 0) {
          const roads = res.data.section;
          this.roadRectionList = [{ id: null, name: '全部' }, ...roads];
          this.drawRoads(roads);
          await this.fetchProperty({ type: null, id: null }); // 传递参数 type 和 id
          console.log('fetchRoadSections')
          // this.updateStatistics();
        }
      } else {
        // 加载选中道路的路段
        const res = await screenRoadChildList(this.selectedRoadId);
        if (res.code === 0) {
          const roads = res.data.section;
          this.roadRectionList = [{ id: null, name: '全部' }, ...roads];
          this.drawRoads(roads);
          await this.fetchProperty({ type: 3, id: this.selectedRoadId }); // 传递参数 type 和 id
        }
        var road = {}
        road.id = this.selectedRoadId
        this.fetchRoadFacilities(this.selectedRoadId);
        // this.updateStatistics(road);
      }
    } catch (error) {
      console.error('Error fetching road sections:', error);
    }
  },
  switchToSatelliteMode() {
    if (this.map) {
      this.map.setMapType(BMAP_SATELLITE_MAP); // 切换到卫星地图模式
      this.exitPanoramaMode(); // 退出全景模式
    }
  },
  switchToPanoramaMode() {
  this.panoramaMode = true; // 标记进入全景模式
  this.map.setDefaultCursor(`url(${this.panoramaCursor}), auto`); // 设置全景鼠标样式

    // 禁用普通模式下的功能
    this.disableNormalModeInteractions();
  },
    handleButtonSelected(index) {
      const routes = ['/big-screen2', '/big-screen3', '/big-screen4', '/big-screen5', '/'];
      this.$router.push(routes[index]);
    },
    async initMap() {
      if (!this.map) {
        this.map = new BMap.Map("map", {
        minZoom: 15, // 最小缩放级别（例如县/市级）
        maxZoom: 18, // 最大缩放级别（例如街道/路段）
      });      
      }

      // console.log('Map instance:', this.map);
      if (!this.map) {
        // console.error('Map initialization failed.');
        return;
      }

      this.map.centerAndZoom(new BMap.Point(120.168, 33.355), this.zoomLevel);
      this.map.enableScrollWheelZoom(true);

      try {
        const response = await fetch('/custom_map_config.json');
        const mapStyle = await response.json();
        this.map.setMapStyleV2({ styleJson: mapStyle });
      } catch (error) {
        console.error('Failed to load custom map style:', error);
      }

      
      this.drawRoads([]);
   
    },

    addMarkers() {
  if (!this.map || !Array.isArray(this.points)) return;

  // 若正在打开弹窗，则跳过重绘，避免打点时清掉弹窗
  if (this.isOpeningPopup) {
    console.log('跳过 addMarkers，因为正在打开 InfoWindow');
    return;
  }

  const zoom = this.map.getZoom();
  if (zoom < 10) {
    this.clearMarkers();
    return;
  }

  const bounds = this.map.getBounds();
  const visiblePoints = this.points.filter(({ lng, lat }) => {
    const point = new BMap.Point(lng, lat);
    return bounds.containsPoint(point);
  });

  this.clearMarkers();

  visiblePoints.forEach(({ lng, lat, type, imgs, road_name, create_time, address }) => {
    if (typeof lng !== 'number' || typeof lat !== 'number') return;
    if (!this.markerImages[type - 1]) return;

    const point = new BMap.Point(lng, lat);
    const markerIcon = new BMap.Icon(this.markerImages[type - 1], new BMap.Size(30, 30));
    const marker = new BMap.Marker(point, { icon: markerIcon });

    const infoWindowContent = this.generateInfoWindowContent({
      road_name,
      type,
      address,
      create_time,
      imgs,
      lng,
      lat,
      section_name,direction
    });

    const infoWindow = new BMap.InfoWindow(infoWindowContent, {
      width: 530,
      height: 550,
      title: '',
      enableMessage: false,
    });

    // 🌟 防止弹窗因地图 panTo 触发 moveend 而被清掉
    marker.addEventListener('click', () => {
      this.isOpeningPopup = true; // 打点中

      this.map.removeEventListener('moveend', this.addMarkers);
      this.map.removeEventListener('zoomend', this.addMarkers);

      const zoomLevel = this.map.getZoom();
      const baseOffset = 0.002;
      const offsetFactor = Math.pow(2, 18 - zoomLevel);
      const adjustedOffset = baseOffset * offsetFactor;
      const offsetPoint = new BMap.Point(point.lng, point.lat + adjustedOffset);

      this.map.openInfoWindow(infoWindow, point);

      setTimeout(() => {
        this.map.panTo(offsetPoint);
      }, 100);

      // 恢复监听并结束标志位
      setTimeout(() => {
        this.map.addEventListener('moveend', this.addMarkers);
        this.map.addEventListener('zoomend', this.addMarkers);
        this.isOpeningPopup = false;
        this.setupImageClick(imgs); // 若你用于点击预览大图
      }, 1500);
    });

    this.map.addOverlay(marker);
  });
},

generateInfoWindowContent({ road_name, type, address, create_time, imgs, lng, lat, section_name, direction }) {
  
  // console.log('section_name'+section_name)
  // console.log('direction'+direction)
  const typeLabels = {
    3: '护栏',
    4: '避让学生标牌',
    5: '急弯识别标牌',
    6: '临水路段标识',
    7: '警告标志',
    8: '禁令限速标志',
    9: '指示标志',
    10: '指路标志',
    11: '交通信号灯',
    // 12: '交通信号灯'
  };

  const fullImageUrl = "http://roadserver.lysoo.com:8081/" + imgs;
  const displayAddress = (address && address.trim())
    ? address
    : "经度：" + parseFloat(lng).toFixed(4) + "，纬度：" + parseFloat(lat).toFixed(4);
  const displayDirection = this.directionMap[direction] || '方向未知';

  return (
    '<div style="width:100%;height:100%;padding:20px;box-sizing:border-box;background:url(' + this.popbgImage + ');background-size:cover;border-radius:10px;color:#fff;">' +
      '<h3 class="title" style="display:flex;justify-content:space-between;align-items:center;height:40px;background:linear-gradient(270deg,rgba(23,54,125,.4),#193D8C,rgba(23,54,125,0.4));border-radius:5px;">' +
        '<img src="' + this.right + '" style="width:20px;height:20px;">' +
        '<div style="flex:1;text-align:center;">' +
          (road_name || '') + ' ' + (section_name || '') + ' ' + (typeLabels[type] || '未知类型') +
        '</div>' +
        '<img src="' + this.left + '" style="width:20px;height:20px;">' +
      '</h3>' +

      '<div style="font-size:14px;margin-top:15px;">' + displayAddress + '</div>' +
      '<div style="font-size:14px;margin-top:15px;">方向：' + displayDirection + '</div>' +
      '<div style="font-size:14px;color:#617199;margin-top:10px;">巡检时间：' + (create_time || '未知') + '</div>' +

      '<div id="popupImageContainer" style="margin-top:15px;width:100%;height:350px;overflow:hidden;border-radius:5px;">' +
        '<img loading="lazy" src="' + fullImageUrl + '" style="width:100%;height:100%;object-fit:cover;" />' +
      '</div>' +
    '</div>'
  );
},

setupImageClick(imgs) {
  const imageContainer = document.getElementById('popupImageContainer');
  if (imageContainer) {
    imageContainer.onclick = () => {
      this.openLargeImage(`http://roadserver.lysoo.com:8081/${imgs}`);
    };
  }
},

  showMarkerPopup(type) {
  const typeLabels = ['警告标志', '禁令限速标志', '指示标志', '指路标志', '施工安全标志', '交通信号灯'];

  if (type >= 1 && type <= 6) {
    this.popupContent = {
      type: typeLabels[type - 1],
      image: this.markerImages[type - 1],
    };
    this.popupVisible2 = true;
  } else {
    console.error('无效的标志类型:', type);
  }
},
  closePopup() {
    this.popupVisible = false;
  },

  closePopup2(){
    this.popupVisible2 = false;
  },
  drawRoads(roads) {
  console.log('clearOverlays')
  this.map.clearOverlays();
  this.roadPolylines = [];

  roads.forEach((road) => {
    try {
      const waypoints = JSON.parse(road.waypoints || '[]');
      const points = waypoints.map((point) => new BMap.Point(point.lng, point.lat));
      points.unshift(new BMap.Point(...road.spoint.split(',').map(Number)));
      points.push(new BMap.Point(...road.epoint.split(',').map(Number)));

      const polyline = new BMap.Polyline(points, {
        strokeColor: 'rgba(56, 119, 242,1)',
        strokeWeight: 3,
        strokeOpacity: 0.8,
        zIndex: 2,
      });

      this.map.addOverlay(polyline);
      this.roadPolylines.push({ id: road.id, polyline, roadData: road });

      polyline.addEventListener('click', () => {
        this.selectedSelectionRoadId = road.id;
        this.handleRoadSelection();
      });
    } catch (e) {
      console.error('Invalid waypoints for road:', road, e);
    }
  });
},
//选中路段的方法
handleRoadSelection() {
  console.log('handleRoadSelection')
  // if (this.panoramaMode) return; // 全景模式下不执行
  // 清除所有道路高亮，设置为默认透明颜色
  this.roadPolylines.forEach(({ polyline }) => {
    polyline.setStrokeColor('rgba(56, 119, 242, 0.3)'); // 设置未选中颜色（降低透明度）
    polyline.setStrokeWeight(6); // 恢复默认宽度
  });

  // 高亮选中的道路
  const selected = this.roadPolylines.find((item) => item.id === this.selectedSelectionRoadId);
  if (selected) {
    selected.polyline.setStrokeColor('#3877F2'); // 设置选中颜色
    selected.polyline.setStrokeWeight(8); // 增加宽度

    // 自动居中到选中的道路
    this.map.setViewport(selected.polyline.getPath());

    // 弹出选中道路的信息
    
    this.updateStatistics(selected.roadData);
    console.log('selected.roadData')
    console.log(selected.roadData)
    if (this.panoramaMode) return; 

    

    this.showRoadPopup(selected.roadData);
  }
},

async fetchAllFacilities() {

 console.log(666666666666)
    try {
      const response = await roadFacilityAll();
      if (response && response.code === 0) {
        const data = response.data;

  
        
        // 解析交通标志数据
        const trafficSignData = data.find((item) => item.name === "交通标志");
        const trafficSignChild = trafficSignData ? trafficSignData.child : [];
        this.trafficSignCounts = trafficSignChild.reduce((acc, item) => {
          acc[item.name] = item.count || 0;
          return acc;
        }, {});
        
        // 解析路面标线数据
        const roadMarkData = data.find((item) => item.name === "路面标线");
        const roadMarkChild = roadMarkData ? roadMarkData.child : [];
        this.roadMarkCounts = roadMarkChild.reduce((acc, item) => {
          acc[item.name] = item.count || 0;
          return acc;
        }, {});
      } else {
        console.error("Failed to fetch all road facility data:", response.msg || "Unknown error");
      }
    } catch (error) {
      console.error("Error fetching all road facility data:", error);
    }
  },

  async fetchRoadFacilities(roadId) {
    try {
      const response = await roadFacilityRoad(roadId);
      if (response && response.code === 0) {
        const data = response.data;
              const other = response.other; console.log(666666666666)
  
        this.road_name = other.road.name;
        this.road_length = other.road.length;
        this.town_name = other.town;
        // 解析交通标志数据
        const trafficSignData = data.find((item) => item.name === "交通标志");
        const trafficSignChild = trafficSignData ? trafficSignData.child : [];
        this.trafficSignCounts = trafficSignChild.reduce((acc, item) => {
          acc[item.name] = item.count || 0;
          return acc;
        }, {});

        // 解析路面标线数据
        const roadMarkData = data.find((item) => item.name === "路面标线");
        const roadMarkChild = roadMarkData ? roadMarkData.child : [];
        this.roadMarkCounts = roadMarkChild.reduce((acc, item) => {
          acc[item.name] = item.count || 0;
          return acc;
        }, {});
      } else {
        console.error("Failed to fetch road facility data:", response.msg || "Unknown error");
      }
    } catch (error) {
      console.error("Error fetching road facility data:", error);
    }
  },

  async handleAssetClick(fid) {
      console.log(`选中资产类型: ${fid}`);

      try {
        // **只清空标注，不清空道路划线**
        this.selectedAssetType = fid; // 更新当前选中的类型

        this.clearMarkers();

        // 请求数据，只获取当前类型的标注
        await this.fetchProperty({ fid });

        // 重新在地图上添加新的标注
        this.addMarkersInView();
      } catch (error) {
        console.error('加载资产标注失败:', error);
      }
    },
    clearMarkers() {
  if (!this.map) return;

  const infoWindow = this.map.getInfoWindow && this.map.getInfoWindow();
  const infoPoint = (infoWindow && typeof infoWindow.getPosition === 'function')
    ? infoWindow.getPosition()
    : null;

  const overlays = this.map.getOverlays();
  overlays.forEach(overlay => {
    if (overlay instanceof BMap.Marker) {
      const markerPoint = overlay.getPosition();
      // 如果当前 marker 正在显示 InfoWindow，跳过
      if (
        infoPoint &&
        markerPoint &&
        infoPoint.lng === markerPoint.lng &&
        infoPoint.lat === markerPoint.lat
      ) {
        return;
      }
      this.map.removeOverlay(overlay);
    }
  });

  console.log("已清除所有标注（保留弹窗）");
},
async updateStatistics(road) {
  if (!road || !road.id) {
    console.error("Road ID is missing.");
    return;
  }

  try {
    // 调用接口获取数据
    const response = await roadFacility(road.id);

    if (response && response.code === 0) {
      const data = response.data;

      // 解析交通标志数据
      const trafficSignData = data.find((item) => item.name === "交通标志");
      const trafficSignChild = trafficSignData ? trafficSignData.child : [];
      this.trafficSignCounts = trafficSignChild.reduce((acc, item) => {
        acc[item.name] = item.count || 0;
        return acc;
      }, {});

      // 解析路面标线数据
      const roadMarkData = data.find((item) => item.name === "路面标线");
      const roadMarkChild = roadMarkData ? roadMarkData.child : [];
      this.roadMarkCounts = roadMarkChild.reduce((acc, item) => {
        acc[item.name] = item.count || 0;
        return acc;
      }, {});
    } else {
      console.error("Failed to fetch road facility data:", response.msg || "Unknown error");
    }
  } catch (error) {
    console.error("Error fetching road facility data:", error);
  }
},
    showRoadPopup(road) {
      this.selectedRoad = {
        id: road.id,
        name: road.name,
        length: road.length,
        road_name: road.road_name,
        town_name: road.town_name,
        type_name: road.type_name,
        spoint: road.spoint,
        epoint: road.epoint,
      };
      this.popupVisible = true;
    },

    formatCoordinates(coordinates) {
      if (!coordinates) return '暂无';
      const [lng, lat] = coordinates.split(',').map(coord => parseFloat(coord).toFixed(3));
      return `${lng}, ${lat}`;
    },
    closePopup() {
      this.popupVisible = false;
    },
    // closePopup() {
    //   this.popupVisible = false;
    // },
    exitPanoramaMode() {
      this.panoramaMode = false; // 标记退出全景模式
      this.map.setDefaultCursor('default'); // 恢复鼠标样式

      // 启用普通模式下的功能
      this.enableNormalModeInteractions();
    },
    disableNormalModeInteractions() {
  // 禁用道路信息弹窗逻辑
      this.roadPolylines.forEach(({ polyline }) => {
        polyline.removeEventListener('click', this.handleRoadSelection); // 确保移除事件
      });

      // 禁用标记点击事件
      this.map.getOverlays().forEach((overlay) => {
        if (overlay instanceof BMap.Marker) {
          overlay.removeEventListener('click'); // 移除所有点击事件
        }
      });
    },
    enableNormalModeInteractions() {
      this.roadPolylines.forEach(({ polyline }) => {
        polyline.addEventListener('click', () => {
          if (!this.panoramaMode) this.handleRoadSelection(); // 仅在普通模式下执行
        });
      });

      this.map.getOverlays().forEach((overlay) => {
        if (overlay instanceof BMap.Marker) {
          overlay.addEventListener('click', (e) => {
            if (!this.panoramaMode) {
              const point = e.point;
              console.log('Marker clicked at:', point);
              // 添加普通模式下的逻辑
            }
          });
        }
      });
    },
    addPanoramaClickListener() {
      this.map.addEventListener('click', async (e) => {
        if (!this.panoramaMode) return; // 普通模式下不执行

        const { lng, lat } = e.point;
        console.log(`全景模式点击点：经度 ${lng}, 纬度 ${lat}`);

        try {
          // 调用接口获取与点击位置相关的实景图数据
          const data = lng+','+lat
          const response = await jcvDetail({'point':data});
          if (response.code === 0) {

            const fullImageUrl = `http://roadserver.lysoo.com:8081/${response.data.path}`;
            this.currentImage = fullImageUrl; // 获取单张图片

            this.currentImageId = response.data.id;
            this.panoramaVisible = true; // 显示全景图片弹窗
          } else {
            console.error('获取实景图失败:', response.msg);
          }
        } catch (error) {
          console.error('调用获取实景图接口失败:', error);
        }
      });
    },
    async nextImage() {
      console.log('nextImage');
      try {
        // 调用接口获取下一张图片
        const response = await jcvOp({'direction':'next','id':this.currentImageId});

        if (response.code === 0) {
          const fullImageUrl = `http://roadserver.lysoo.com:8081/${response.data.path}`;
            this.currentImage = fullImageUrl; // 获取单张图片
            this.largeImageSrc = fullImageUrl;
            this.currentImageId = response.data.id;
        } else {
          console.error('获取下一张图片失败:', response.msg);
        }
      } catch (error) {
        console.error('获取下一张图片失败:', error);
      }
    },

    async prevImage() {
      try {
        // 调用接口获取上一张图片
        const response = await jcvOp({'direction':'prev','id':this.currentImageId});

        if (response.code === 0) {
          const fullImageUrl = `http://roadserver.lysoo.com:8081/${response.data.path}`;
            this.currentImage = fullImageUrl; // 获取单张图片
            this.largeImageSrc = fullImageUrl;
            this.currentImageId = response.data.id;
        } else {
          console.error('获取上一张图片失败:', response.msg);
        }
      } catch (error) {
        console.error('获取上一张图片失败:', error);
      }
    },
    handleKeyDown(event) {
      if (this.keyPressTimer) return; // 避免重复启动定时器

      if (event.key === 'ArrowRight') {
        this.nextImage(); // 先执行一次
        this.keyPressTimer = setInterval(this.nextImage, 300); // 持续触发
      } else if (event.key === 'ArrowLeft') {
        this.prevImage(); // 先执行一次
        this.keyPressTimer = setInterval(this.prevImage, 300); // 持续触发
      }
    },

    handleKeyUp() {
      if (this.keyPressTimer) {
        clearInterval(this.keyPressTimer);
        this.keyPressTimer = null;
      }
    },
  async getAdjacentImage(direction) {
    try {

      const response = await jcvOp({'direction':direction,'id':currentImageId});

      return response.data;
    } catch (error) {
      console.error('调用jcvOp接口失败:', error);
      throw error;
    }
  },
  addMarkersInView() {
  if (!this.map || !Array.isArray(this.points) || !this.markerImages) return;

  // 1. 获取当前地图的视野边界
  const bounds = this.map.getBounds();

  // 2. 只保留在视野范围内的点
  const visiblePoints = this.points.filter(({ lng, lat }) => {
    const point = new BMap.Point(lng, lat);
    return bounds.containsPoint(point);
  });

  // 3. 清除现有标注
  this.clearMarkers();

  // 4. 遍历添加可见标注
  visiblePoints.forEach(({ lng, lat, type, imgs, road_name, create_time, address ,section_name,direction}) => {
    if (typeof lng !== 'number' || typeof lat !== 'number') return;
    if (!this.markerImages[type - 1]) return;

    const point = new BMap.Point(lng, lat);
    const markerIcon = new BMap.Icon(this.markerImages[type - 1], new BMap.Size(30, 30));
    const marker = new BMap.Marker(point, { icon: markerIcon });

    const infoWindowContent = this.generateInfoWindowContent({
      road_name, type, address, create_time, imgs, lng, lat,section_name,direction
    });

    const infoWindow = new BMap.InfoWindow(infoWindowContent, {
      width: 530,
      height: 550,
      title: '',
      enableMessage: false,
    });

    marker.addEventListener('click', () => {
      const zoomLevel = this.map.getZoom();
      const baseOffset = 0.002;
      const offsetFactor = Math.pow(2, 18 - zoomLevel);
      const adjustedOffset = baseOffset * offsetFactor;
      const offsetPoint = new BMap.Point(point.lng, point.lat + adjustedOffset);

      this.map.openInfoWindow(infoWindow, point);
      setTimeout(() => this.setupImageClick(imgs), 300);
      setTimeout(() => this.map.panTo(offsetPoint), 300);
    });

    this.map.addOverlay(marker);
  });
},
    closePanoramaImage() {
      this.panoramaVisible = false;
    },
    enableNormalModeListeners() {
    // 启用道路信息弹窗
    // this.roadPolylines.forEach(({ polyline }) => {
    //   polyline.addEventListener('click', () => {
    //     this.handleRoadSelection();
    //   });
    // });
    // // 启用标记点击事件
    // this.map.getOverlays().forEach((overlay) => {
    //   if (overlay instanceof BMap.Marker) {
    //     overlay.enableClicking();
    //   }
    // });
  },
  openLargeImage(imageSrc,isPanoramaImg) {
    // console.log(222222222)

    if(isPanoramaImg){
      this.isPanoramaImg = true;
    }else{
      this.isPanoramaImg = false;
    }
    this.largeImageSrc = imageSrc; // 设置大图地址
    this.showLargeImagePopup = true; // 显示弹窗
    
    console.log(this.showLargeImagePopup)
  },
  closeLargeImage() {
    this.showLargeImagePopup = false; // 隐藏弹窗
    this.isPanoramaImg = false;
  },
  async fetchTownList() {
  try {
    const res = await screenTownList();
    if (res.code === 0) {
     this.townList = [{ id: null, name: '全部', polygon: 'all', safe_status: 1 }, ...res.data];
    } else {
      console.error("获取行政区划失败:", res.msg);
    }
  } catch (error) {
    console.error("请求行政区划出错:", error);
  }
}
  },
  mounted() {
    this.fetchTownList(); 
    this.fetchAllFacilities(); // 页面加载时请求所有道路数据
    this.fetchRoadList();
    this.initMap();
    this.fetchProperty({limit:100});
    this.addPanoramaClickListener(); // 实景地图监听
    this.enableNormalModeListeners(); // 初始化普通模式监听
    this.addMarkersInView();
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    this.map.addEventListener('moveend', this.addMarkersInView); // 拖动结束
  this.map.addEventListener('zoomend', this.addMarkersInView); // 缩放结束
    console.log('filteredRoadList',this.filteredRoadList)
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    this.map.removeEventListener('moveend', this.addMarkersInView);
  this.map.removeEventListener('zoomend', this.addMarkersInView);
    if (this.keyPressTimer) {
      clearInterval(this.keyPressTimer);
    }
  }
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
  /* top: 20px; */
  left: 10px;
  width: 446px;
  /* height: 136px; */
  background: linear-gradient(135deg, #1f2a51, #0b1224);
  border-radius: 8px;
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
  border-radius: 8px;
  border: 1px solid #3877F2;
  padding: 20px;
  z-index: 1000;
  color: white;
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

.statistics-list li {
  color: #cce4ff; /* 设置列表项文字颜色 */
  padding: 5px 0;
}

.statistics-list li:hover {
  color: #ffcc00; /* 悬停时的字体颜色 */
}
.section-top {
  background-image: url('../../assets/sidebarTitle.png');
  background-size: cover;
  background-position: center;
  color: white;
  position: absolute;
  top: 50px;
  left: 10px;
}
.title {
  width: 398px;
  height: 32px;
  background: linear-gradient(270deg, rgba(23, 54, 125, 0.4) 0%, #193D8C 50%, rgba(23, 54, 125, 0.4) 100%);

}

.popup {
  position: fixed;
  top: 50%;   /* 设置距离屏幕顶部50% */
  left: 50%;  /* 设置距离屏幕左侧50% */
  transform: translate(-50%, -50%); /* 中心对齐 */
  width: 400px;
  height: 540px;
  /* background-color: white; */
  /* border-radius: 10px; */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  z-index: 1001;
}


.custom-icon {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  background: transparent;
  border-radius: 50%;
  border: 2px solid #8A8A8A; /* 灰色描边 */
}

.custom-icon .icon {
  font-size: 24px;
  color: #FF0000; /* 图标颜色 */
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2); /* 为图标增加立体效果 */
}

.custom-hazard-box {
  position: fixed;
  left: 470px;
  background: rgba(4, 18, 50, 0.6);
  /* border: 1px solid #3877F2; */
  border-radius: 4px;
  padding: 15px;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  color: white;
  width: 156px;
  margin-top: 10px;
}

.custom-status-box {
  bottom: 280px;
}

.custom-hazard-box {
  bottom: 37px;
}

.custom-box-title {
  font-size: 12px;
  /* background: linear-gradient(270deg, rgba(23, 54, 125, 0.4) 0%, #193D8C 50%, rgba(23, 54, 125, 0.4) 100%); */
  color: #89C0FF;
  line-height: 17px;
}



.popup-close-btn {
  margin-top: 15px;
  padding: 8px 20px;
  background: #3877F2;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>

<style >

.custom-icon .icon {
  font-size: 24px;
  color: #FF0000; /* 图标颜色 */
}
</style>

<style scoped>
.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 10px;
  padding: 20px;
  color: white;
  z-index: 1001;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.popup-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('../../assets/popbg.png');
  background-size: cover;
  background-position: center;
  z-index: -1;
}
.popup {
  /* clip-path: polygon(0% 0%, 100% 0%, 100% 90%, 50% 100%, 0% 90%); */
  /* background: url('../../assets/popbg2.png') no-repeat center; */
  background-size: contain;
  background-color: transparent;
}
.popup-background2 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* background-image: url('../../assets/popbg2.png'); */
  background-size: cover;
  background-position: center;
  z-index: -1;
}
.popup-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(270deg, rgba(23, 54, 125, 0.4) 0%, #193D8C 50%, rgba(23, 54, 125, 0.4) 100%);
  padding: 10px;
  border-radius: 5px;
  font-size: 16px;
  margin-bottom: 20px;
}

.road-info {
  font-size: 14px;
  line-height: 1.8;
  margin-bottom: 10px;
  flex-direction: column
}

.separator {
  width: 100%;
  height: 1px;
  background-color: #3877F2;
  margin: 15px 0;
}

.popup-close-btn {
  display: block;
  margin: 0 auto;
  padding: 8px 20px;
  background: #3877F2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
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

.separator {
    width: 100%;
    height: 1px;
    border: 1px solid #3877F2;
    margin-top: 10px;
}

.statistics-list {
  margin: 0;
  padding: 0;
  list-style-type: none;
  display: flex;
  flex-wrap: wrap; /* 自动换行 */
  gap: 20px; /* 每个项目之间的间距 */
  justify-content: flex-start; /* 水平分布，保持均匀 */
}

.statistics-list li {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #cce4ff;
  width: calc(33.33% - 20px); /* 每个项目宽度占 1/3 减去间距 */
  box-sizing: border-box;
}

.statistics-list .count {
  font-size: 24px; /* 大字号 */
  font-weight: bold; /* 加粗 */
  color: #ffffff; /* 白色数值 */
}

.statistics-list .type {
  font-size: 14px; /* 常规字号 */
  color: #89C0FF; /* 常规文本颜色 */
}

.map-mode-switch {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1000;
}

.switch-button {
  width: 80px;
  height: 40px;
  background: linear-gradient(135deg, #1f2a51, #0b1224);
  color: white;
  font-size: 14px;
  font-weight: bold;
  border: 1px solid #3877F2;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  line-height: 40px;
  transition: all 0.3s ease;
}

.switch-button:hover {
  background: #3877F2;
  color: white;
}

.panorama-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* background: rgba(0, 0, 0, 0.8); */
  padding: 20px;
  border-radius: 10px;
  z-index: 1001;
  color: white;
  /* box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); */
  /* clip-path: polygon(0% 0%, 100% 0%, 100% 90%, 50% 100%, 0% 90%); */
  background: url('../../assets/popbg2.png') no-repeat center;
  background-size: contain;
  background-color: transparent;
}

.panorama-popup .popup-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

/* .panorama-popup .close-button {
  background: #3877F2;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
}
 */


.close-button {
  position: absolute;
  top: -40px;
  right: -60px;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.8);
  color: #000;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  z-index: 1001;
}

.close-button:hover {
  background: rgba(255, 255, 255, 1);
}
.panorama-popup .panorama-image {
  width: 500px;
  height: 230px;
  border-radius: 5px;
}


.panorama-content {
  /* display: flex; */
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.image-nav-button {
  background: #3877F2;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 15px;
  cursor: pointer;
  font-size: 14px;
}

.image-nav-button:disabled {
  background: #aaa; /* 禁用状态颜色 */
  cursor: not-allowed;
}

</style>
<style scoped>
.large-image-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.popupbig-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: -1;
}

.popupbig-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.large-image {
  /* max-width: 90%; */
  width: 1200px;
  /* max-height: 80%; */
  /* border-radius: 10px; */
}

.close-icon {
  position: absolute;
  top: -20px;
  right: -35px;
  width: 30px;
  height: 30px;
  cursor: pointer;
}

.search-input::placeholder {
  color: rgb(255, 255, 255)fff; /* 设置占位符的颜色 */
  font-style: italic; /* 可选：设置占位符的字体样式 */
}
</style>

<style scoped>
::v-deep .el-input__inner{
  background-color: #1a2d52!important;
  border: 1px solid #3877F2!important;
  color: #fff !important; /* 将选中文本改成白色 */

}

/* 2. 覆盖下拉菜单整体 */
::v-deep .el-select-dropdown {
  background-color: #1a2d52 !important; /* 下拉弹窗背景 */
  border: 1px solid #3877F2 !important;
  color: #fff !important;              /* 下拉内文本默认颜色 */
}

/* 3. 覆盖下拉菜单中每一项 */
::v-deep .el-select-dropdown__item {
  background-color: transparent; /* 或者你要的其他颜色 */
  color: #fff !important;        /* 文字颜色 */
}

/* 4. 悬停效果 */
::v-deep .el-select-dropdown__item:hover {
  background-color: #2c3e50 !important; /* hover时背景 */
  color: #fff !important;
}

/* 5. 选中项(在多选或hover中可能出现) */
::v-deep .el-select-dropdown__item.is-selected {
  background-color: #3877f2 !important;
  color: #fff !important;
}

.custom-hazard-item {
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.custom-hazard-item:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.selected-asset {
  border: 1px solid #3877F2;  /* 选中的高亮边框 */
  background-color: rgba(255, 255, 255, 0.3); /* 选中时的背景色 */
}
</style>
<!-- <style>
.el-select-dropdown {
  background-color: #1a2d52 !important; /* 下拉弹窗背景 */
  border: 1px solid #3877F2 !important;
  color: #fff !important;              /* 下拉内文本默认颜色 */
}

.el-select-dropdown__item {
  background-color: transparent; /* 或者你要的其他颜色 */
  color: #fff !important;        /* 文字颜色 */
}

.el-select-dropdown__item:hover {
  background-color: #2c3e50 !important; /* hover时背景 */
  color: #fff !important;
}

.el-select-dropdown__item.is-selected {
  background-color: #3877f2 !important;
  color: #fff !important;
}
</style> -->