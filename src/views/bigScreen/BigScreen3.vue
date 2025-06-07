<template>
  <div class="big-screen">
    <header-component :headerImage="headerImage" :buttonImage="buttonImage" :selectedButtonImage="selectedButtonImage"
      :buttonCount="buttonCount" :initialSelectedButton="1" :buttonLabels="buttonLabels"
      @button-selected="handleButtonSelected" />
    <div class="content">
      <div id="map" class="map-container"></div>
    </div>
    <div class="dlqh" @click="showPopup('dlqh')" :style="{ backgroundImage: `url(${qhdlImage})` }"></div>
    <!-- <div class="tckz" @click="showPopup('tckz')" :style="{ backgroundImage: `url(${tckzImage})` }"></div> -->
    <transition name="scale-popup">
    <div 
      v-if="popupVisible" 
      class="popup" 
      :style="{ backgroundImage: `url(${popbgImage})` }">
      <h3 class="title" style="
          font-size: 16px;
          height: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 0 10px;
          background: linear-gradient(270deg, rgba(23, 54, 125, 0.4) 0%, #193D8C 50%, rgba(23, 54, 125, 0.4) 100%);
          border-radius: 5px;
        ">
        <img :src="right" alt="右侧图片" style="width: 20px; height: 20px;"> 
          <div style="flex: 1; text-align: center; color: #FFFFFF;">区划道路统计</div>
           <img :src="left" alt="左侧图片" style="width: 20px; height: 20px;">
        </h3>
        <div style="font-size: 16px;font-weight: 600;">{{ selectedStreetData.name }}</div>
        <div style="display: flex;justify-content: space-between;width: 335px;margin-top: 10px;">
        <div><span class="popup-title">道路总里程</span><span class="popup-value" style="margin-left: 10px;">{{ selectedStreetData.length || 0}}km</span></div>
        <div><span class="popup-title">道路数量</span><span  class="popup-value" style="margin-left: 10px;">{{ selectedStreetData.road || 0 }}条</span></div>
      </div>
      <div style="width: 100%;
        height: 1px;
        border: 1px solid #3877F2;margin-top: 10px;"></div>
      <div v-for="(row, rowIndex) in chunkArray(selectedStreetData.road_type, 2)" :key="rowIndex" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;margin-top: 10px;">
        <div v-for="(type, index) in row" :key="index" class="popup-item" style="display: flex; align-items: center; flex: 1; padding-right: 10px;">
          <img :src="getRoadIcon(type.name)" alt="道路类型图标" style="width: 20px; height: 20px;" />
          <div class="popup-title" style="margin-left: 5px; width: 80px;">{{ type.name }}</div>
          <div class="popup-value" style="margin-left: 15px;">{{ type.length || 0 }} km</div>
        </div>
      </div>
   
    </div>  </transition>
    <div class="custom-status-box">
      <h3 class="custom-box-title">区域安全状态</h3>
      <div class="custom-status-indicators">
        <div class="custom-status-item">
          <div class="custom-status-icon none"></div>
          <span>未采集</span>
        </div>
        <div class="custom-status-item">
          <div class="custom-status-icon excellent"></div>
          <span>优秀</span>
        </div>
        <div class="custom-status-item">
          <div class="custom-status-icon average"></div>
          <span>一般</span>
        </div>
        <div class="custom-status-item">
          <div class="custom-status-icon poor"></div>
          <span>差</span>
        </div>
      </div>
    </div>
    <div class="custom-hazard-box">
      <h3 class="custom-box-title">隐患等级</h3>
      <div class="custom-hazard-indicators">
        <div class="custom-hazard-item" :class="{ selected: currentYhdj === 10 }"  @click="filterPitfalls(10)">
          <img :src="require('@/assets/minorpitfall.png')" alt="轻微隐患" />
          <span>轻微隐患</span>
        </div>
        <div class="custom-hazard-item" :class="{ selected: currentYhdj === 11 }"  @click="filterPitfalls(11)">
          <img :src="require('@/assets/generalpitfall.png')" alt="一般隐患" />
          <span>一般隐患</span>
        </div>
        <div class="custom-hazard-item"         :class="{ selected: currentYhdj === 12 }" 
 @click="filterPitfalls(12)">
          <img :src="require('@/assets/seriouspitfall.png')" alt="重大隐患" />
          <span>重大隐患</span>
        </div>
        <div class="custom-hazard-item"         :class="{ selected: currentYhdj === 13 }" 
 @click="filterPitfalls(13)">
          <img :src="require('@/assets/majorpitfall.png')" alt="特大隐患" />
          <span>特大隐患</span>
        </div>
      </div>
    </div>
    <div v-if="showFullImage" class="full-image-overlay">
      <div class="close-button" @click="closeFullImage">×</div>
      <img :src="fullImageSrc" alt="隐患大图" class="full-image" />
    </div>
    <left-sidebar v-if="showLeftSidebar" @hide-sidebar="showLeftSidebar = false" :map="map"
    @selected-street-change="handleStreetChange"
      @draw-polygon="drawPolygon"
      @hazard-click="filterPitfalls"
      :currentZoom.sync="zoomLevel"
      />
      <right-sidebar :selected-street-data="selectedStreetData" @hazard-clicked="handleHazardClick"/>
  </div>
</template>

<script>
import HeaderComponent from '@/components/Header/HeaderComponent'
import LeftSidebar from '@/components/Sidebar/LeftSidebar'
import RightSidebar from '@/components/Sidebar/RightSidebar'
import {
  getRoadSectionList,
  getPitfallList
} from '@/api/road';
export default {
  name: 'BigScreen3',
  components: {
    HeaderComponent,
    LeftSidebar,
    RightSidebar
  },
  data() {
    return {
      headerImage: require('@/assets/header-image.png'),
      buttonImage: require('@/assets/button.png'),
      selectedButtonImage: require('@/assets/button-selected.png'),
      popbgImage: require('@/assets/popbg.png'),
      qhdlImage: require('@/assets/qhdl.png'),
      tckzImage: require('@/assets/tckz.png'),
      dingweiImage: require('@/assets/dingwei.png'),
      timeImage: require('@/assets/time.png'),
      popupVisible: false, // 控制弹窗显示
      popupContent: '', // 弹窗内容
      buttonCount: 4, // Number of buttons
      buttonLabels: ['道路户籍化', '隐患画像', '安全评分','事故画像', '管理平台'], // Button labels
      zoomLevel: 15, // 初始缩放等级
      map: null, // 保存地图实例
      dialogTitle: '',
      dialogContent: '',
      dialogVisible: false,
      selectedRoad: {
        name: '',
        area: '',
        roadLevel: '',
        safetyLevel: ''
      },
      right: require('@/assets/right.png'),
      left: require('@/assets/left.png'),
      yinhuan: require('@/assets/yinhuan.jpg'),
      showLeftSidebar: true, // 控制左侧固定框的显示和隐藏
      pitfallList: [],
      pitfallTotal: 0,
      cluster: null, // 保存点聚合实例
      points: [
        [120.15173, 33.38557],
        [120.15160, 33.38636],
        [120.15149, 33.38692],
        [120.15147, 33.38701],
        [120.15077, 33.38944],
        [120.15045, 33.39060],
        [120.15045, 33.39060],
        [120.15043, 33.39066],
        [120.15041, 33.39075],
        [120.15040, 33.39079]
      ],
      pitfallImg: {
        imgSrc: require('@/assets/pitfall.png'), // 图片路径
        level: '特大隐患', // 等级信息
      },
      showFullImage: false, // 控制大图显示
      fullImageSrc: '', // 存储大图的路径
      selectedStreetData: null, // 存储当前选中的街道数据
      currentYhdj:null,
      currentYhlb:null,
      currentTwonId:null,
    }
  },
  methods: {

    async drawPolygon(polygonData, safe_status) {
  if (!this.map) return;

  // console.log('1111111111111111');
  // console.log(polygonData);
  // console.log('safe_status:', safe_status);

  // 清除现有覆盖物
  this.map.getOverlays().forEach(overlay => {
    if (overlay instanceof BMap.Polygon) {
      this.map.removeOverlay(overlay);
    }
  });

  // 定义颜色映射
  const colorMapping = {
    0: { strokeColor: 'blue', fillColor: '#87CEEB' },
    1: { strokeColor: '#70A45D', fillColor: 'rgba(50, 175, 6, 0.3)' },
    2: { strokeColor: '#A4865D', fillColor: 'rgba(175, 100, 6, 0.3)' },
    3: { strokeColor: '#A45D5D', fillColor: 'rgba(175, 6, 6, 0.3)' },
  };

  const { strokeColor, fillColor } = colorMapping[safe_status] || colorMapping[0];

  // 判断是否需要绘制整个亭湖区
  if (polygonData === "all") {
    try {
      // 请求百度地图行政区边界数据
      const boundaryService = new BMap.Boundary();
      boundaryService.get("亭湖区", result => {
        if (result.boundaries.length === 0) {
          console.error("Failed to get boundaries for 亭湖区");
          return;
        }

        const allPoints = []; // 用于存储所有点以设置视野

        // 绘制每个边界
        result.boundaries.forEach(boundary => {
          const points = boundary
            .split(";")
            .map(coord => coord.split(",").map(Number))
            .map(([lng, lat]) => new BMap.Point(lng, lat));
          const polygon = new BMap.Polygon(points, {
            strokeColor: strokeColor,
            fillColor: fillColor,
            strokeWeight: 1, // 边框宽度
            strokeOpacity: 0.7,
            fillOpacity: 0.3,
          });
          this.map.addOverlay(polygon);
          allPoints.push(...points);
        });

        // 调整视野到边界范围
        if (allPoints.length > 0) {
          this.map.setViewport(allPoints);
        }
      });
    } catch (error) {
      console.error("Error fetching boundary data:", error);
    }
    return;
  }

  // 解析普通的 polygonData 并绘制多边形
  const polygons = this.parsePolygon(polygonData);
  if (polygons.length === 0) {
    console.error('Polygon data is empty or invalid:', polygonData);
    return;
  }

  const allPoints = []; // 用于存储所有点以设置视野

  // 绘制每个多边形
  polygons.forEach(points => {
    const polygon = new BMap.Polygon(points, {
      strokeColor: strokeColor,
      fillColor: fillColor,
      strokeWeight: 1, // 边框宽度
      strokeOpacity: 0.7,
      fillOpacity: 0.3,
    });
    this.map.addOverlay(polygon);
    allPoints.push(...points);
  });

  // 调整视野到所有多边形的范围
  if (allPoints.length > 0) {
    this.map.setViewport(allPoints);
  } else {
    console.warn('No valid points to set viewport.');
  }
    },
    handleHazardClick(item) {
      console.log("Clicked Hazard:", item);
      // 在这里调用父组件的方法，比如更新地图标注
      this.highlightHazardOnMap(item);
    },
    highlightHazardOnMap(item) {

      this.currentYhlb = item.yhlb;

       this.loadPitfalls();
    },
    parsePolygon(polygonData) {
      const polygons = [];
      if (polygonData.startsWith('MULTIPOLYGON')) {
        // 解析 MULTIPOLYGON
        const matches = polygonData.match(/\(\(\((.*?)\)\)\)/g); // 匹配每个多边形的坐标数据
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
        // 解析单个 POLYGON
        const cleanCoords = polygonData.replace(/POLYGON\(\(/, '').replace(/\)\)/, '');
        const coords = cleanCoords.split(',').map(coord => {
          const [lng, lat] = coord.trim().split(' ').map(Number);
          return new BMap.Point(lng, lat);
        });
        polygons.push(coords);
      }
      return polygons.filter(polygon => polygon.length > 0); // 过滤空多边形
    },
    handleButtonSelected(index) {
      const routes = ['/big-screen2', '/big-screen3', '/big-screen4', '/big-screen5', '/'];
      this.$router.push(routes[index]);
    },
    chunkArray(array, chunkSize) {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  },
    getRoadIcon(name) {
      const icons = {
        "高速道路": require('@/assets/gs.png'),
        "国省道路": require('@/assets/gsg.png'),
        "城市主干道": require('@/assets/zg.png'),
        "城市次干道": require('@/assets/zcg.png'),
        "县乡村道路": require('@/assets/xc.png'),
        "无名路": require('@/assets/wm.png'),
      };
      return icons[name]; 
    },
    getList() {
      this.listLoading = true;
      // getRoadSectionList(this.listQuery).then(res => {
      //   if (res.code === 0) {
      //     this.list = res.data.data;
      //     this.total = res.data.total;
      //   } else {
      //     this.list = [];
      //     this.total = 0;
      //   }
      //   this.listLoading = false;
      // });

      getPitfallList(this.listQuery).then(res => {
        if (res.code === 0) {
          this.pitfallList = res.data.data;
          this.pitfallTotal = res.data.total;
        } else {
          this.pitfallList = [];
          this.pitfallTotal = 0;
        }
        this.listLoading = false;
      });
    },
    async initMap() {
      if (!this.map) {
        this.map = new BMap.Map("map");
      }

      // 设置中心点和缩放级别
      this.map.centerAndZoom(new BMap.Point(120.168, 33.355), this.zoomLevel);
      this.map.enableScrollWheelZoom(true);

        // 添加地图加载完成的事件监听
      this.map.addEventListener("tilesloaded", () => {
        // 隐藏百度地图的版权信息 DOM 元素
        const unauthorizedText = document.querySelector(".anchorBL");
        if (unauthorizedText) {
          unauthorizedText.style.display = "none";
        }
      });
      // 应用地图样式
      try {
        const response = await fetch('/custom_map_config.json');
        const mapStyle = await response.json();
        this.map.setMapStyleV2({ styleJson: mapStyle });
      } catch (error) {
        console.error('Failed to load custom map style:', error);
      }

      // 确保地图其他功能继续生效
      this.map.addEventListener("tilesloaded", () => {
        const logo = document.querySelector('.anchorBL');
        if (logo) logo.style.display = 'none';
      });


      // 道路绘制功能
      await this.drawRoads();
      // 隐患标注
      await this.loadPitfalls();
      console.log('地图初始化完成');
      this.map.addEventListener('zoomend', this.updateMarkersVisibility);

      this.map.addEventListener('zoomend', () => {
        this.$emit('update:currentZoom', this.map.getZoom());
      });
    },
    //道路划线
    async drawRoads() {
      try {
        const res = await getRoadSectionList({limit:500});
        if (res.code === 0) {
          const roads = res.data.data;
          roads.forEach(road => {
            const waypoints = JSON.parse(road.waypoints);
            const points = waypoints.map(point => new BMap.Point(point.lng, point.lat));
            points.unshift(new BMap.Point(...road.spoint.split(',').map(Number)));
            points.push(new BMap.Point(...road.epoint.split(',').map(Number)));

            const polyline = new BMap.Polyline(points, {
              strokeColor: '#3877F2',
              strokeWeight: 3,
              strokeOpacity: 0.8,
              zIndex: 2
            });

            this.map.addOverlay(polyline);

            // 点击展示信息
            polyline.addEventListener("click", () => {
              this.dialogTitle = '道路信息';
              this.dialogContent = `道路名称: ${road.name}`;
              this.dialogVisible = true;
            });
          });
        } else {
          console.error('Failed to fetch road data:', res.msg);
        }
      } catch (error) {
        console.error('Error fetching road data:', error);
      }
    },
    //隐患标注
    async loadPitfalls() {
      console.log('loadPitfallsstart')
      try {
        const query = { limit: 1000 };
        if (this.currentYhdj) query.yhdj = this.currentYhdj;
        if (this.currentYhlb) query.yhlb = this.currentYhlb;
        if (this.currentTwonId) query.yhTwon = this.currentTwonId;
        const res = await getPitfallList(query);
        if (res.code === 0) {
          this.pitfallList = res.data.data;

          const markers = this.pitfallList.map((item) => {

            // console.log('item',item)
            const [lng, lat] = item.point.split(',').map(Number); // 解析 point 字段
            const point = new BMap.Point(lng, lat); // 创建地图点

            // 根据 yhcj 字段值选择不同的图片
            let iconSrc = '';
            let level = '';
            const fullImageUrl = `http://roadserver.lysoo.com:8081/${item.imgs}`;
            switch (item.yhdj) {
              case 10:
                iconSrc = require('@/assets/minorpitfall.png'); // 轻微隐患
                level = '轻微隐患';
                break;
              case 11:
                iconSrc = require('@/assets/generalpitfall.png'); // 一般隐患
                level = '一般隐患';
                break;
              case 12:
                iconSrc = require('@/assets/seriouspitfall.png'); // 重大隐患
                level = '重大隐患';
                break;
              case 13:
                iconSrc = require('@/assets/majorpitfall.png'); // 特大隐患
                level = '特大隐患';
                break;
              default:
                iconSrc = require('@/assets/pitfall.png'); // 默认图片
                level = '未知隐患';
                break;
            }

            const myIcon = new BMap.Icon(iconSrc, new BMap.Size(30, 30), {
              anchor: new BMap.Size(15, 15), // 图标定位到中心
            });

            const marker = new BMap.Marker(point, { icon: myIcon }); // 创建标注
            marker.addEventListener('click', () => {

              console.log(`Clicked marker with name: ${item.name}`); // 输出被点击标记的名称

              // 根据隐患等级设置背景颜色和文字
              let levelText = '';
              let backgroundColor = '';
              const offsetY = 200; // 向上移动的像素值，可根据需要调整
              const adjustedPoint = new BMap.Point(point.lng, point.lat); // 复制原始点
              const pixelPoint = this.map.pointToPixel(adjustedPoint); // 获取屏幕像素坐标
              const adjustedPixelPoint = new BMap.Pixel(pixelPoint.x, pixelPoint.y + offsetY); // 调整像素坐标的 Y 值
              const adjustedMapPoint = this.map.pixelToPoint(adjustedPixelPoint); // 转换回地图坐标

              
              switch (item.yhdj) {
                case 10:
                  levelText = '轻微隐患';
                  backgroundColor = '#f4ea2a'; // 黄色
                  break;
                case 11:
                  levelText = '一般隐患';
                  backgroundColor = '#efb336'; // 橙色
                  break;
                case 12:
                  levelText = '重大隐患';
                  backgroundColor = '#e16531'; // 深橙色
                  break;
                case 13:
                  levelText = '特大隐患';
                  backgroundColor = '#d81e06'; // 红色
                  break;
                default:
                  levelText = '未知隐患';
                  backgroundColor = '#666'; // 默认灰色
                  break;
              }
              const displayAddress = (item.address && typeof item.address === 'string' && item.address.trim())
  ? item.address.trim()
  : `经度：${lng.toFixed(4)}，纬度：${lat.toFixed(4)}`;
              const infoWindowContent = `
    <div style="
      position: relative;
      width: 530px;
      height: 550px;
      background: url(${this.popbgImage});
      background-repeat: no-repeat; 
      background-size: 100% 100%; /* 确保背景图片完全填充容器 */
      color: white; 
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: left;
      border-radius: 10px;
      box-sizing: border-box; /* 确保 padding 不会影响容器大小 */
    ">
      <div style="
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 20px;
        box-sizing: border-box; /* 确保 padding 不会溢出容器 */
      ">
        <!-- 标题部分 -->
        <h3 class="title" style="
          font-size: 16px;
          height: 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 0 10px;
          margin-bottom: 15px;
          background: linear-gradient(270deg, rgba(23, 54, 125, 0.4) 0%, #193D8C 50%, rgba(23, 54, 125, 0.4) 100%);
          border-radius: 5px;
        ">
          <img src="${this.right}" alt="右侧图片" style="width: 20px; height: 20px;">
          <div style="flex: 1; text-align: center; color: #FFFFFF;">
  ${item.yhlb_name}
  <span style="display: none;">${item.id}</span>
</div>
          <img src="${this.left}" alt="左侧图片" style="width: 20px; height: 20px;">
        </h3>

        <!-- 信息行 -->
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 15px;">
          <div style="font-size: 14px; color: #89C0FF;">城市主干道</div>
          <div style="
            width: 80px;
            height: 25px;
            background: ${backgroundColor}; /* 动态背景颜色 */
            color: #FFFFFF;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 4px;
            font-size: 12px;
          ">${levelText}</div>
        </div>

        <!-- 其他内容 -->
        <div style="
          width: 100%;
          padding: 10px;
          background: rgba(255, 84, 85, 0.3);
          border-radius: 5px;
          margin-bottom: 15px;
          display: flex;
        ">
          <div style="flex: 1; font-size: 14px; color: #FFFFFF;">隐患描述</div>
          <div style="flex: 2; font-size: 14px; color: #FFFFFF;">
            ${item.testing_standards.length > 80 ? item.testing_standards.substring(0, 98) + '...' : item.testing_standards}

          </div>
        </div>

        <!-- 分割线 -->
        <div style="width: 100%; height: 1px; background: #3877F2; margin-bottom: 15px;"></div>

        <!-- 地址 -->
        <div style="
          font-size: 14px; 
          color: #89C0FF; 
          margin-bottom: 10px;
          display:flex;
          align-items: center;
        ">
        <img src="${this.dingweiImage}"  alt="隐患图片" style="width: 20px; height: auto; object-fit: cover; cursor: pointer;" />
          <span style="margin-left:10px;">${displayAddress}</span>
        </div>

        <!-- 排查时间 -->
        <div style="
          font-size: 14px; 
          color: #617199; 
          margin-bottom: 20px;
          display:flex;
          align-items: center;
        ">
        <img  src="${this.timeImage}" alt="隐患图片" style="width: 20px; height: auto; object-fit: cover; cursor: pointer;" />
          <span style="margin-left:10px;">排查时间：${item.create_time}</span>
        </div>
        <!-- 图片展示 -->
        <div style="width: 100%; height: 350px; border-radius: 5px; overflow: hidden;">
    <img id="pitfall-image" src="${fullImageUrl}" alt="隐患图片" style="width: 100%; height: auto; object-fit: cover; cursor: pointer;" />
  </div>
      </div>
    </div>
  `;

              const infoWindow = new BMap.InfoWindow(infoWindowContent, {
                width: 530,
                height: 550,
                title: '',
                enableMessage: false,
              });
              const zoomLevel = this.map.getZoom(); // 获取当前地图缩放等级
              console.log('zoomLevel:', zoomLevel);
              // 根据缩放等级计算动态偏移量
              const baseOffset = 0.002; // 基础偏移量（适用于 zoomLevel = 18）
              const offsetFactor = Math.pow(2, 18 - zoomLevel); // 动态调整偏移比例
              const adjustedOffset = baseOffset * offsetFactor;
              // 计算偏移点
              const offsetPoint = new BMap.Point(adjustedMapPoint.lng, adjustedMapPoint.lat + adjustedOffset);
              this.map.openInfoWindow(infoWindow, adjustedMapPoint); 
              
              setTimeout(() => {
                const imageElement = document.getElementById('pitfall-image');
                //  
                if (imageElement) {
                  imageElement.addEventListener('click', () => {
                    
                    // alert(111111)
                    this.openFullImage(fullImageUrl); // 使用 Vue 方法打开大图
                  });
                }
              }, 600);
                setTimeout(() => {
                  this.map.panTo(offsetPoint);
                }, 300); // 延迟 300ms
            });

            return marker;
          });
          // 初始化点聚合
          if (this.markerClusterer) {
        this.markerClusterer.clearMarkers();
        this.markerClusterer.addMarkers(markers);
          } else {
            this.markerClusterer = new BMapLib.MarkerClusterer(this.map, { markers });
          }

          // 更新地图视野，使所有标记可见
          // if (markers.length > 0) {
          //   this.map.setViewport(markers.map(m => m.getPosition()));
          // }
        } else {
          console.error('Failed to fetch pitfall data:', res.msg);
        }
      } catch (error) {
        console.error('Error fetching pitfall data:', error);
      }
    },

    // 更新标注的可见性
    updateMarkersVisibility() {
      const zoom = this.map.getZoom();
      if (zoom > 15) {
        this.cluster.setMaxZoom(15); // 停止聚合，显示单独的标记
      } else {
        this.cluster.setMaxZoom(0); // 启用聚合
      }
    },
    addMarkers(map) {
      // 示例标注数据
      var markers = [
        {
          position: new BMap.Point(120.168, 33.355),
          label: '标注1'
        },
        {
          position: new BMap.Point(120.178, 33.365),
          label: '标注2'
        }
      ];

      markers.forEach((markerData) => {
        var marker = new BMap.Marker(markerData.position);
        var label = new BMap.Label(markerData.label, { offset: new BMap.Size(20, -10) });
        marker.setLabel(label);
        map.addOverlay(marker);
      });
    },
    updateMarkersVisibility() {
      // 更新标注的可见性
      // 这里可以根据缩放等级来控制标注的显示和隐藏
    },
    openFullImage(imageSrc) {
      console.log(22222222)
      this.fullImageSrc = imageSrc;
      this.showFullImage = true;
    },
    // 关闭大图的方法
    closeFullImage() {
      this.showFullImage = false;
      this.fullImageSrc = '';
    },
    showPopup(type) {
      // 显示弹窗并设置对应内容
      if (this.popupVisible === true) {
        this.popupVisible = false; // 如果弹窗已打开，则关闭
      } else {
        this.popupVisible = true; // 打开指定类型的弹窗
      }
      if (type === 'dlqh') {
        this.popupContent = '这是地理区划的详细信息';
      } else if (type === 'tckz') {
        this.popupContent = '这是图层控制的详细信息';
      }
    },
    closePopup() {
      // 关闭弹窗
      this.popupVisible = false;
    },
     handleStreetChange(streetData) {
      this.selectedStreetData = { ...streetData };
      console.log('父组件更新 selectedStreetData:', this.selectedStreetData);
      let selectedStreetData = this.selectedStreetData;
      this.currentTwonId = selectedStreetData.id;
      this.loadPitfalls();
    },
    async filterPitfalls(yhdj) {
      this.currentYhdj = yhdj;
      await this.loadPitfalls();
    },
    updateMapMarkers() {
      if (this.markerClusterer) {
        this.markerClusterer.clearMarkers();
      }
      const markers = this.pitfallList.map(item => {
        const [lng, lat] = item.point.split(',').map(Number);
        const point = new BMap.Point(lng, lat);
        const iconSrc = require(`@/assets/${this.getPitfallIcon(item.yhdj)}`);
        const myIcon = new BMap.Icon(iconSrc, new BMap.Size(30, 30));
        return new BMap.Marker(point, { icon: myIcon });
      });
      this.markerClusterer = new BMapLib.MarkerClusterer(this.map, { markers });
    },
    getPitfallIcon(yhdj) {
      const icons = {
        10: 'minorpitfall.png',
        11: 'generalpitfall.png',
        12: 'seriouspitfall.png',
        13: 'majorpitfall.png'
      };
      return icons[yhdj] || 'pitfall.png';
    }

  },
  mounted() {
    this.initMap();
    const map = new BMap.Map("map");
    map.centerAndZoom(new BMap.Point(120.168, 33.355), 12);
    map.enableScrollWheelZoom(true);
    this.map = map;

    map.addEventListener("tilesloaded", () => {
    const unauthorizedText = document.querySelector(".anchorBL");
        if (unauthorizedText) {
          unauthorizedText.style.display = "none";
        }
      });
  },

}
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

.BMap_bubble_max_content {
  display: none;
}

.BMap_top {
  display: none;
}
</style>
<style>
.BMap_top {
  visibility: hidden;
}

.BMap_pop>div:first-child {
  visibility: hidden;
}

.BMap_pop>div:nth-child(3) {
  visibility: hidden;
}

.BMap_center {
  visibility: hidden;
}

.BMap_pop>div:nth-child(4) {
  visibility: hidden;
}

.BMap_pop>div:nth-child(5) {
  visibility: hidden;
}

.BMap_pop>div:nth-child(6) {
  visibility: hidden;
}

.BMap_pop>div:nth-child(7) {
  visibility: hidden;
}

.BMap_pop>div:nth-child(8) {
  visibility: hidden;
}

.custom-status-box,
.custom-hazard-box {
  position: fixed;
  right: 455px;
  background: rgba(4, 18, 50, 0.6);
  /* border: 1px solid #3877F2; */
  border-radius: 4px;
  padding: 15px;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  color: white;
  width: 116px;
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

.custom-status-indicators,
.custom-hazard-indicators {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 10px;
}

.custom-status-item {
  padding: 10px;
  border-radius: 5px;
  color: white;
  font-size: 12px;
}

.custom-hazard-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  margin-bottom: 10px;
  padding: 2px;
}

.custom-hazard-item img {
  width: 20px;
  height: 20px;
}


.custom-status-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
}

.custom-status-icon {
  width: 20px;
  height: 10px;
  border-radius: 2px;
}

.custom-status-icon.excellent {
  background: rgba(50, 175, 6, 0.3);
  border-radius: 2px;
  width: 20px;
  height: 10px;
  border: 1px solid #70A45D;
}

.custom-status-icon.average {
  background: rgba(175, 100, 6, 0.3);
  border-radius: 2px;
  width: 20px;
  height: 10px;
  border: 1px solid #A4865D;
}

.custom-status-icon.poor {
  background: rgba(175, 6, 6, 0.3);
  border-radius: 2px;
  width: 20px;
  height: 10px;
  border: 1px solid #A45D5D;
}
.custom-status-icon.none {
  background: rgba(17, 37, 82, 0.9);
  border-radius: 2px;
  width: 20px;
  height: 10px;
  border: 1px solid #3877F2;
}

.full-image-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.full-image {
  max-width: 90%;
  max-height: 90%;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.close-button {
  position: absolute;
  top: 20px;
  right: 20px;
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



.dlqh, .tckz {
  width: 56px; /* 根据需要调整 */
  height: 56px; /* 根据需要调整 */
  background-size: cover;
  background-position: center;
  cursor: pointer;
  margin-bottom: 10px;
  z-index: 1;
  position: absolute; 
   top:100px;
  left: 1400px;

}

.dlqh{
  top: 100px;
  left: 500px;
}

/* 弹窗样式 */
.popup {
  position: absolute;
  width: 430px; /* 弹窗宽度 */
  height: 240px; /* 弹窗高度 */
  background-size: 100% 200%;
  background-position: top;
  background-repeat: no-repeat;
  top: 160px; /* 弹窗底部位置 */
  left: 37%; /* 使用百分比定位 */
  transform: translateX(-50%); /* 水平居中 */
  display: flex;
  flex-direction: column;
  color: white;
  border-radius: 8px;
  padding: 10px;
  padding-left: 15px;
  padding-right: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.popup-content {
  text-align: left;
}

.popup button {
  margin-top: 10px;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.8);
  color: #000;
}
.popup-title{
  font-size: 14px;
  color: #617199;
  line-height: 20px;
}

.popup-value{
  font-size: 14px;
  color: #FFFFFF;
  line-height: 20px;
}

.scale-popup-enter-active, .scale-popup-leave-active {
  transition: opacity 0.3s ease-out, transform 0.3s ease-out;
}

.scale-popup-enter-from, .scale-popup-leave-to {
  opacity: 0;
  transform: scale(0.8) translateX(-50%);
}

.scale-popup-enter-to, .scale-popup-leave-from {
  opacity: 1;
  transform: scale(1) translateX(-50%);
}

.custom-hazard-item.selected {
  background-color: rgba(56, 119, 242, 0.3);
  color: #ffffff;
  border: 1px solid #3877F2;
  padding:2px;
}
</style>