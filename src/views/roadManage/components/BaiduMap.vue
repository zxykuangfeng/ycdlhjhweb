<template>
    <div class="baidu-map-container">
      <div id="baidu-map" class="map"></div>
      <div class="location-buttons">
        <el-button @click="setStartPoint" type="primary">设置起点</el-button>
        <el-button @click="setEndPoint" type="success">设置终点</el-button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'BaiduMap',
    props: {
      onLocationChange: {
        type: Function,
        required: true
      }
    },
    data() {
      return {
        map: null,
        startPointMarker: null,
        endPointMarker: null
      };
    },
    mounted() {
      this.initializeMap();
    },
    methods: {
      initializeMap() {
        this.map = new BMap.Map('baidu-map');
        const centerPoint = new BMap.Point(120.139998, 33.377631); // 默认中心点，需根据实际位置调整
        this.map.centerAndZoom(centerPoint, 14);
        this.map.enableScrollWheelZoom(true);
      },
      setStartPoint() {
        this.map.addEventListener('click', e => {
          const point = new BMap.Point(e.point.lng, e.point.lat);
          if (this.startPointMarker) {
            this.map.removeOverlay(this.startPointMarker);
          }
          this.startPointMarker = new BMap.Marker(point);
          this.map.addOverlay(this.startPointMarker);
          this.onLocationChange({ type: 'start', point });
        });
      },
      setEndPoint() {
        this.map.addEventListener('click', e => {
          const point = new BMap.Point(e.point.lng, e.point.lat);
          if (this.endPointMarker) {
            this.map.removeOverlay(this.endPointMarker);
          }
          this.endPointMarker = new BMap.Marker(point);
          this.map.addOverlay(this.endPointMarker);
          this.onLocationChange({ type: 'end', point });
        });
      }
    }
  };
  </script>
  
  <style scoped>
  .baidu-map-container {
    width: 100%;
    height: 400px;
    position: relative;
  }
  .map {
    width: 100%;
    height: 100%;
  }
  .location-buttons {
    position: absolute;
    top: 10px;
    left: 10px;
  }
  </style>
  