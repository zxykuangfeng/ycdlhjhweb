<template>
  <div class="big-screen">
    <header-component :headerImage="headerImage" :buttonImage="buttonImage" :selectedButtonImage="selectedButtonImage"
      :buttonCount="buttonCount" :initialSelectedButton="3" :buttonLabels="buttonLabels"
      @button-selected="handleButtonSelected" />

    <div class="content">
      <div id="map" class="map-container"></div>
    </div>

    <div class="section-top">事故画像</div>

    <div class="fixed-div">
      <label class="label">行政区划:</label>
      <el-select v-model="selectedAid" placeholder="选择行政区划" class="styled-select" @change="fetchAccidentData">
  <el-option
    v-for="item in townList"
    :key="item.id"
    :label="item.name"
    :value="item.id"
  />
</el-select>
      <label class="label">时间范围:</label>
      <el-date-picker
  v-model="dateRange"
  type="daterange"
  start-placeholder="开始日期"
  end-placeholder="结束日期"
  format="yyyy-MM-dd"
  value-format="yyyy-MM-dd"
  class="styled-datepicker"
/>
      <el-button type="primary" @click="fetchAccidentData" style="margin-top:10px;">查询</el-button>
    </div>
    <div class="summary-box">
  <div
    class="summary-item"
    v-for="item in accidentStats"
    :key="item.name"
  >
    <img
      class="summary-icon"
      :src="getStatIcon(item.name)"
      alt="icon"
    />
    <div class="summary-text">
      <div class="summary-name">{{ item.name }}</div>
      <div class="summary-count">{{ item.count }}</div>
    </div>
  </div>
</div>
    <div class="statistics-div">
      <div class="statistics-header">
        <div class="statistics-cell">序号</div>
        <div class="statistics-cell name-column">事故编号</div>
        <div class="statistics-cell name-column">事故时间</div>
        <div class="statistics-cell address-column">事故地点</div>
      </div>
      <div class="statistics-row" v-for="(item, index) in accidentList" :key="item.id" @click="selectAccident(item)">
        <div class="statistics-cell">{{ index + 1 }}</div>
        <div class="statistics-cell name-column">{{ item.case_number }}</div>
        <div class="statistics-cell name-column">{{ item.accident_time }}</div>
        <div class="statistics-cell address-column" :title="item.location">{{ item.location }}</div>
      </div>
    </div>

    <div class="hazard-info" v-if="selectedAccident">
      <div class="hazard-header">
        <div>事故详情</div>
        <button class="close-btn" @click="selectedAccident = null">×</button>
      </div>
      <p><strong>事故编号:</strong> {{ selectedAccident.case_number }}</p>
      <p><strong>时间:</strong> {{ selectedAccident.accident_time }}</p>
      <p><strong>地点:</strong> {{ selectedAccident.location }}</p>
      <p><strong>死亡人数:</strong> {{ selectedAccident.death_count }}</p>
      <p><strong>受伤人数:</strong> {{ selectedAccident.injury_count }}</p>
      <p><strong>原因:</strong> {{ selectedAccident.reason }}</p>
    </div>
    <div class="map-mode-switch">
  <button @click="panoramaMode = !panoramaMode">
    {{ panoramaMode ? '退出实景' : '进入实景' }}
  </button>
</div>
<AccidentDetailSidebar
  :selectedAccidentList="selectedAccidentList"
  @close-sidebar="selectedAccidentList = []"
/>
<!-- <div v-if="panoramaVisible" class="panorama-popup">
  <div class="popup-background2"></div>
  <div class="panorama-content">
    <h3 class="title">实景图</h3>
    <img :src="currentImage" class="panorama-image" alt="实景图" />
    <button @click="panoramaVisible = false" class="popup-close-btn">关闭</button>
  </div>
</div> -->


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
import { screenAccidentList,screenAccidentCount,jcvDetail,accidentRecord,screenTownList } from '@/api/road';
import AccidentDetailSidebar from '@/components/Sidebar/AccidentDetailSidebar'
export default {
  name: 'AccidentVisualization',
  components: { HeaderComponent ,AccidentDetailSidebar},
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
      accidentList: [],
      selectedAccident: null,
      startDate: '',
      endDate: '',
      map: null,
      markers: [],
      dateRange: ['2024-12-01', '2024-12-31'],
      accidentStats: [],
      panoramaMode: false,
      panoramaVisible: false,
      currentImage: '',
      currentImageId: '',
      leftImage: require('@/assets/lefticon.png'),
      rightImage: require('@/assets/righticon.png'),
      right: require('@/assets/right.png'),
      left: require('@/assets/left.png'),
      cha2Image: require('@/assets/cha2.png'),
      showLargeImagePopup: false,
      selectedAccidentList: [], 
      townList: [],      // 行政区划列表
    selectedAid: '',   // 当前选中 aid
    };
  },
  mounted() {
    this.initMap();
    this.fetchAccidentData();
    this.addPanoramaClickListener();
    this.loadTownList(); // 👈 加载行政区划
  },
  methods: {
    async loadTownList() {
    try {
      const res = await screenTownList();
      if (res.code === 0) {
        this.townList = res.data || [];
      }
    } catch (e) {
      console.error('获取行政区划失败:', e);
    }
  },
    async initMap() {
      this.map = new BMap.Map('map');
      this.map.centerAndZoom(new BMap.Point(120.168, 33.355), 12);
      this.map.enableScrollWheelZoom(true);
      try {
      const response = await fetch('/custom_map_config.json');
      const mapStyle = await response.json();
      this.map.setMapStyleV2({ styleJson: mapStyle });
    } catch (error) {
      console.error('Failed to load custom map style:', error);
    }
    },
    async fetchAccidentData() {
      try {
        const [startDate, endDate] = this.dateRange;
        const params = {
          stime: startDate,
          etime: endDate,
          aid: this.selectedAid || undefined // 👈 加入选中的行政区划
        };
        const res = await screenAccidentList(params);
        if (res.code === 0) {
          this.accidentList = res.data || [];
          this.drawAccidents();
        } else {
          this.$message.error(res.msg || '获取事故数据失败');
        }
        await this.fetchAccidentCount(); // 👈 新增：统计联动
      } catch (err) {
        console.error('获取事故数据失败:', err);
      }
    },
    async fetchAccidentCount() {
  try {
    const [startDate, endDate] = this.dateRange;
    const params = {
      stime: startDate,
      etime: endDate
    };
    const res = await screenAccidentCount(params);
    if (res.code === 0) {
      this.accidentStats = res.data || [];
    } else {
      this.$message.error(res.msg || '获取事故统计失败');
    }
  } catch (err) {
    console.error('获取事故统计失败:', err);
  }
},
    drawAccidents() {
  // 清除旧标注
  this.markers.forEach(marker => this.map.removeOverlay(marker));
  this.markers = [];

  this.accidentList.forEach(item => {
    if (item.position) {
      const [lng, lat] = item.position.split(',').map(Number);
      const point = new BMap.Point(lng, lat);

      // 选择图标
      let iconPath = '';
      switch (item.accident_type) {
        case 0:
          iconPath = require('@/assets/sr.png');
          break;
        case 1:
          iconPath = require('@/assets/sw.png');
          break;
        case 2:
          iconPath = require('@/assets/ccss.png');
          break;
        default:
          iconPath = require('@/assets/sr.png'); 
      }

      // 创建自定义图标
      const myIcon = new BMap.Icon(iconPath, new BMap.Size(30, 30)); // 可以根据需要调整大小
      const marker = new BMap.Marker(point, { icon: myIcon });

      // 绑定点击事件
      marker.addEventListener('click', () => {
        this.selectAccident(item); 
        this.map.panTo(point);
      });

      this.map.addOverlay(marker);
      this.markers.push(marker);
    }
  });
},
addPanoramaClickListener() {
  this.map.addEventListener('click', async (e) => {
    if (!this.panoramaMode) return; // 仅实景模式下触发

    const { lng, lat } = e.point;
    console.log(`实景模式点击点：经度 ${lng}, 纬度 ${lat}`);

    try {
      const data = `${lng},${lat}`;
      const response = await jcvDetail({ point: data });

      if (response.code === 0) {
        const fullImageUrl = `http://roadserver.lysoo.com:8081/${response.data.path}`;
        this.currentImage = fullImageUrl;
        this.currentImageId = response.data.id;
        this.panoramaVisible = true;
      } else {
        console.error('获取实景图失败:', response.msg);
      }
    } catch (error) {
      console.error('调用获取实景图接口失败:', error);
    }
  });
},

handleButtonSelected(index) {
      const routes = ['/big-screen2', '/big-screen3', '/big-screen4', '/big-screen5', '/'];
      this.$router.push(routes[index]);
    },
    

    async selectAccident(item) {
  try {
    const res = await accidentRecord(item.case_number);
    if (res.code === 0) {
      this.selectedAccidentList = res.data || [];
      const pointStr = res.data && res.data[0] && res.data[0].position;
if (pointStr) {
  const point = pointStr.split(',').map(Number);
  if (point.length === 2) {
    this.map.panTo(new BMap.Point(point[0], point[1]));
  }
}
    } else {
      this.$message.error(res.msg || '获取事故详情失败');
    }
  } catch (e) {
    this.$message.error('请求失败');
  }
},
getStatIcon(name) {
  if (name.includes('伤人')) {
    return require('@/assets/sr.png');
  } else if (name.includes('死亡')) {
    return require('@/assets/sw.png');
  } else if (name.includes('财产')) {
    return require('@/assets/ccss.png');
  } else {
    return require('@/assets/sr.png');
  }
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
  }
};
</script>

<style scoped>
/* 可复用前面页面的样式 */
.big-screen { position: relative; height: 100vh; }
.map-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
.fixed-div { width: 480px; position: absolute; top: 130px; left: 10px; background: #1f2a51; padding: 15px; border-radius: 4px; border: 1px solid #3877F2; color: white; z-index: 1000; }
.label { margin-bottom: 5px; display: block; font-weight: 500; }
.styled-select { width: 180px; margin-bottom: 5px; background: #1a2d52; color: white; border: 1px solid #3877F2; border-radius: 4px; padding: 4px; }
.statistics-div { position: absolute; bottom: 50px; left: 10px; width: 546px; max-height: 400px; overflow-y: auto; background: #0b1224; border: 1px solid #3877F2; border-radius: 4px; color: white; }
.statistics-header, .statistics-row { display: flex; }
.statistics-cell { flex: 1; padding: 4px; border-bottom: 1px solid #2a3a65; text-align: center; }
.name-column { flex: 1.5; }
.address-column { flex: 5; }
.hazard-info { position: absolute; top: 120px; left: 480px; background: #0b1224; padding: 10px; border: 1px solid #3877F2; color: white; border-radius: 4px; z-index: 1000; width: 300px; }
.hazard-header { display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 10px; }
.close-btn { background: transparent; border: none; color: white; font-size: 18px; cursor: pointer; }
.statistics-div {
  position: absolute;
  bottom: 50px;
  left: 10px;
  width: 646px;
  max-height: 400px;
  overflow-y: auto;
  background: #0b1224;
  border: 1px solid #3877F2;
  border-radius: 4px;
  color: white;
  font-size: 12px;  /* 字体更小 */
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.statistics-header {
  display: flex;
  background: #1D3877;
  color: #89C0FF;
  font-weight: bold;
  height: 28px;
  line-height: 28px;
  border-radius: 4px 4px 0 0;
  text-align: center;
}

.statistics-row {
  display: flex;
  height: 26px;
  line-height: 26px;
  text-align: center;
  border-bottom: 1px solid #2a3a65;
  cursor: pointer;
}

.statistics-row:nth-child(even) {
  background: #1a2a4d;
}

.statistics-row:hover {
  background: #2a3a65;
}

.statistics-cell {
  padding: 0 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  justify-content: center;
  align-items: center;
}

.name-column {
  flex: 2;
}

::v-deep .styled-datepicker .el-input__inner {
  background-color: #1a2d52 !important;
  color: white !important;
  border: 1px solid #3877F2 !important;
  border-radius: 6px;
  height: 32px;
  line-height: 32px;
}

::v-deep .styled-datepicker .el-input__inner::placeholder {
  color: #cccccc !important;
}

::v-deep .styled-datepicker .el-input__prefix,
::v-deep .styled-datepicker .el-input__suffix {
  color: white !important;
}
.summary-box {
  position: absolute;
  top: 330px;
  left: 10px;
  display: flex;
  background: #1a2d52;
  border: 1px solid #3877F2;
  border-radius: 4px;
  color: white;
  padding: 10px;
  z-index: 1000;
  gap: 10px;
}

.summary-item {
  display: flex;
  align-items: center;
  background: #0b1224;
  border: 1px solid #3877F2;
  border-radius: 4px;
  padding: 10px 14px;
  min-width: 140px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
}

.summary-icon {
  width: 32px;
  height: 32px;
  margin-right: 10px;
}

.summary-text {
  display: flex;
  flex-direction: column;
}

.summary-name {
  font-size: 14px;
  margin-bottom: 4px;
  color: #89C0FF;
}

.summary-count {
  font-size: 20px;
  font-weight: bold;
}

.map-mode-switch {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1100;
}

.map-mode-switch button {
  background: linear-gradient(135deg, #1f2a51, #0b1224);
  border: 1px solid #3877F2;
  border-radius: 6px;
  color: #fff;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.map-mode-switch button:hover {
  background: #3877F2;
  color: #ffffff;
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
  background-image: url('~@/assets/popbg2.png');
background-repeat: no-repeat;
background-position: center;
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
  color: rgb(255, 255, 255); /* 设置占位符的颜色 */
  font-style: italic; /* 可选：设置占位符的字体样式 */
}
</style>
