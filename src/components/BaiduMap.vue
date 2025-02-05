。<template>
    <div class="baidu-map-container">
      <div ref="map" class="map"></div>
      <div class="map-footer">
        <el-button type="primary" @click="confirmCoordinates">确定</el-button>
        <el-button @click="closeMap">取消</el-button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "BaiduMap",
    props: {
      ak: {
        type: String,
        default: "qrsnnCASAzgBkhKPAAFbl3iDAtVCXNM1", // 你的百度地图AK
      },
    },
    data() {
      return {
        map: null,
        marker: null,
        coordinates: "",
      };
    },
    mounted() {
      this.loadBaiduMapScript().then(() => {
        this.initMap();
      });
    },
    methods: {
      loadBaiduMapScript() {
        return new Promise((resolve) => {
          if (typeof BMap !== "undefined") {
            resolve();
            return;
          }
          const script = document.createElement("script");
          script.src = `https://api.map.baidu.com/api?v=3.0&ak=${this.ak}`;
          script.onload = resolve;
          document.head.appendChild(script);
        });
      },
      initMap() {
        this.map = new BMap.Map(this.$refs.map);
        const point = new BMap.Point(120.139998, 33.377631); // 初始中心点，可自行修改
        this.map.centerAndZoom(point, 14);
        this.map.enableScrollWheelZoom();
  
        // 添加点击事件监听
        this.map.addEventListener("click", (e) => {
          const { lng, lat } = e.point;
          this.coordinates = `${lng},${lat}`;
          this.addMarker(e.point);
        });
      },
      addMarker(point) {
        if (this.marker) {
          this.map.removeOverlay(this.marker);
        }
        this.marker = new BMap.Marker(point);
        this.map.addOverlay(this.marker);
      },
      confirmCoordinates() {
        this.$emit("confirm", this.coordinates);
      },
      closeMap() {
        this.$emit("close");
      },
    },
  };
  </script>
  
  <style scoped>
  .baidu-map-container {
    width: 100%;
    height: 500px;
    position: relative;
  }
  .map {
    width: 100%;
    height: 100%;
  }
  .map-footer {
    position: absolute;
    bottom: 10px;
    right: 10px;
    display: flex;
    gap: 10px;
  }
  </style>
  