<template>
  <div class="left-sidebar" style="height: 90%;">
    <div class="section top" style="width: 443px;height: 40px;line-height: 40px;padding-left: 30px;margin-top: 20px;font-size: 16px;font-weight: 800;display: flex;align-items: center;">
     <img :src="right"> <div style="margin-left: 3px;">选择行政区划</div>
    </div>
    <div class="section mid">
      <div class="dropdowns">
        <div style="width: 350px;display: flex;align-items: center;justify-content: space-between;color: #E5EAF3;font-size: 14px;">
        <div>区   域:
          <select v-model="selectedDistrict" @change="fetchStreets" class="styled-select">
            <option v-for="district in districts" :key="district" :value="district">{{ district }}</option>
          </select></div>
          <div>  街   道:
            <select v-model="selectedStreet" @change="onStreetChange" class="styled-select">
              <option value="全部">全部</option>
              <option v-for="street in streets" :key="street.name" :value="street.name">
                {{ street.name }}
              </option>
            </select>                
        </div>        
        </div>      
      </div>
    </div>
    <div class="section buttom">
      <h3 class="title" style="display: flex;">    <img :src="right">  <div class="mmfont">安全隐患等级分布</div>  <img :src="left"></h3>
      <div class="title-content">
        <div class="hazard-item" v-for="(hazard, index) in hazardSummary" :key="index">
          <img :src="hazard.imgSrc">
          <div class="hazard-text">
            <div style="font-size: 12px;">{{ hazard.level }}</div>
            <div style="font-size: 18px;">{{ hazard.count }}处</div>
          </div>
        </div>
      </div>
      <h3 class="title" style="display: flex;"><img :src="right">  <div class="mmfont">管辖区道路隐患</div>  <img :src="left"></h3>
      <div ref="pieChart" class="chart"></div>
      <h3 class="title" style="display: flex;"><img :src="right">  <div class="mmfont">管辖区道路隐患Top5</div>  <img :src="left"></h3>
      <div ref="barChart" class="chart2" style="padding-left: 10px;height: 150px;"></div>
      <div class="buttom-content"></div>
    </div>
    <div style="display: flex; gap: 10px;">
    <!-- 当前层级显示 -->
    <div class="mmfont" style="width: 40px; height: 40px; background: rgba(4,18,50,0.8); border-radius: 4px; display: flex; align-items: center; justify-content: center;">
      <span style="color: white; font-size: 14px;">{{ currentZoom }}</span>
    </div>
    <!-- 提高层级 -->
    <div 
      style="width: 40px; height: 40px; background: rgba(4,18,50,0.8); border-radius: 4px; display: flex; align-items: center; justify-content: center; cursor: pointer;"
      @click="increaseZoom">
      <img :src="jia" style="max-width: 20px; max-height: 20px;" />
    </div>
    <!-- 减少层级 -->
    <div 
      style="width: 40px; height: 40px; background: rgba(4,18,50,0.8); border-radius: 4px; display: flex; align-items: center; justify-content: center; cursor: pointer;"
      @click="decreaseZoom">
      <img :src="jian" style="max-width: 20px; max-height: 20px;" />
    </div>
    <!-- 恢复初始层级 -->
    <div 
      style="width: 40px; height: 40px; background: rgba(4,18,50,0.8); border-radius: 4px; display: flex; align-items: center; justify-content: center; cursor: pointer;"
      @click="resetZoom">
      <img :src="shuaxin" style="max-width: 20px; max-height: 20px;" />
    </div>
  </div>
    <button @click="hideSidebar">隐藏</button>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { screenTownList } from "@/api/road"; // 确保接口路径正确
export default {
  props: {
    map: Object // 接收父组件传递的地图实例
  },
  name: 'LeftSidebar',
  data() {
    return {
      districts: ['亭湖区'], // 可动态获取行政区划的名字
      streets: [],
      roads: [],
      selectedDistrict: '亭湖区',
      selectedStreet: '全部',
      right: require('../../assets/right.png'),
      left: require('../../assets/left.png'),
      jia: require('../../assets/jia.png'),
      jian: require('../../assets/jian.png'),
      shuaxin: require('../../assets/shuaxin.png'),
      currentZoom: 15, // 当前地图层级
      initialZoom: 15, // 初始层级
      pieChart: null,
      barChart: null,
      legends: [
        { label: '特大隐患', color: '#D30C0F' },
        { label: '重大隐患', color: '#FF8442' },
        { label: '一般隐患', color: '#FFAE59' },
        { label: '轻微隐患', color: '#FFE774' }
      ]
    };
  },
  computed: {
    hazardSummary() {
      // const dataSource = this.roads.length > 0 ? this.roads : this.streets;

        let dataSource = [];
      if (this.selectedStreet === '全部') {
        // 如果当前下拉选的是“全部”，就汇总街道数据
        dataSource = this.streets;
      } else {
        // 如果选了具体街道，则汇总当前 street 的 roads
        dataSource = this.roads;   
        }
      const summary = { critical: 0, major: 0, minor: 0, trivial: 0 };

      dataSource.forEach(item => {
        summary.critical += (item.hazards && item.hazards.critical) || 0;
        summary.major += (item.hazards && item.hazards.major) || 0;
        summary.minor += (item.hazards && item.hazards.minor) || 0;
        summary.trivial += (item.hazards && item.hazards.trivial) || 0;
      });

      return [
        { imgSrc: require('../../assets/data4.png'), level: '特大隐患', count: summary.critical },
        { imgSrc: require('../../assets/data3.png'), level: '重大隐患', count: summary.major },
        { imgSrc: require('../../assets/data2.png'), level: '一般隐患', count: summary.minor },
        { imgSrc: require('../../assets/data.png'), level: '轻微隐患', count: summary.trivial }
      ];
    }
  },
  methods: {
    increaseZoom() {
      if (this.map && this.currentZoom < 18) {
        this.currentZoom++;
        this.map.setZoom(this.currentZoom);
      }
    },
    decreaseZoom() {
      if (this.map && this.currentZoom > 3) {
        this.currentZoom--;
        this.map.setZoom(this.currentZoom);
      }
    },
    resetZoom() {
      if (this.map) {
        this.currentZoom = this.initialZoom;
        this.map.setZoom(this.currentZoom);
      }
    },
    async fetchStreets(mid = null) {
  try {
    console.log('Fetching streets with mid:', mid); // 调试信息
    const res = mid ? await screenTownList(mid) : await screenTownList();

    if (res.code === 0) {
      console.log('Fetched streets data:', res.data); // 检查返回的数据
      this.streets = res.data.map(item => ({
        name: item.name,
        length:item.length,
        polygon: item.polygon,
        hazards: item.hazards || { critical: 0, major: 0, minor: 0, trivial: 0 },
        id:item.id,
        road:item.road,
        road_type:item.road_type, 
        safe_status:item.safe_status, 
      }));
      var all = {name:'亭湖区'};
      this.$emit("selected-street-change", all);
      this.updateCharts(); // 更新图表
    } else {
      console.error("获取数据失败:", res.msg);
    }
  } catch (error) {
    console.error("请求数据时出错:", error);
  }
}
,


async onStreetChange() {
  console.log('Street changed:', this.selectedStreet);
  if (this.selectedStreet === "全部") {
    console.log('Selected all streets');
    this.roads = []; // 清空道路数据
    this.$emit("clear-polygon");
    this.updateCharts(); // 更新图表，仅显示街道数据

    var all = {name:'亭湖区'};
    console.log(2222222222222222);
    this.$emit("selected-street-change", all);
    this.$emit("draw-polygon",'all',1);
  } else {
    const selected = this.streets.find(street => street.name === this.selectedStreet);
    console.log('Selected street data:', selected);
    if (selected) {
      try {
        const res = await screenTownList(selected.id); // 获取道路数据
        if (res.code === 0) {
          console.log('Fetched roads data:', res.data);
          this.roads = res.data.map(road => ({
            name: road.name,
            hazards: road.hazards || { critical: 0, major: 0, minor: 0, trivial: 0 }
          }));
          this.updateCharts(); // 更新图表，显示道路数据
        } else {
          console.error("获取道路数据失败:", res.msg);
        }
      } catch (error) {
        console.error("请求道路数据时出错:", error);
      }
      if (selected.polygon) {
        this.$emit("draw-polygon",selected.polygon,selected.safe_status);
        this.$emit("selected-street-change", selected);
      }
    }
  }
},

    hideSidebar() {
      this.$emit('hide-sidebar');
    },
    updateCharts() {
      console.log('Updating charts with data...');
      let chartData = [];

      // 1) 如果选择了“全部”，chartData = streets
      if (this.selectedStreet === "全部") {
        chartData = this.streets || [];
      } else {
        // 2) 如果选了具体街道，就用 roads
        chartData = this.roads || [];
      }

      // 3) 如果最终没有数据，则显示“暂无数据”
      if (!chartData.length) {
        this.showNoDataPie();
        this.showNoDataBar();
        return;
      }

      // 4) 如果有数据，调用现有的 updatePieChart / updateBarChart
      this.updatePieChart(chartData);
      this.updateBarChart(chartData);
    },


    showNoDataPie() {
      // 清空之前的配置
      this.pieChart.clear();
      this.pieChart.setOption({
        title: {
          text: '暂无数据',
          left: 'center',
          top: 'middle',
          textStyle: {
            color: '#fff',
            fontSize: 16
          }
        }
      });
    },

    showNoDataBar() {
      this.barChart.clear();
      this.barChart.setOption({
        title: {
          text: '暂无数据',
          left: 'center',
          top: 'middle',
          textStyle: {
            color: '#fff',
            fontSize: 16
          }
        }
      });
    },

updatePieChart(data) {
  this.pieChart.clear();
  const sortedData = data
    .map(item => ({
      name: item.name,
      value: Object.values(item.hazards || {}).reduce((a, b) => a + b, 0)
    }))
    .sort((a, b) => b.value - a.value);

  const top10 = sortedData.slice(0, 10);
  const otherTotal = sortedData.slice(10).reduce((sum, item) => sum + item.value, 0);

  const pieData = [...top10];
  if (otherTotal > 0) {
    pieData.push({ name: "其他", value: otherTotal });
  }

  // Define a bright rainbow color scheme
  const colors = [
    "#FF0000", "#FF7F00", "#FFFF00", "#7FFF00", "#00FF00", 
    "#00FF7F", "#00FFFF", "#007FFF", "#0000FF", "#7F00FF", 
    "#FF00FF"
  ];

  this.pieChart.setOption({
    tooltip: { trigger: "item", formatter: "{a} <br/>{b}: {c} ({d}%)" },
    series: [
      {
        name: "隐患分布",
        type: "pie",
        radius: ["40%", "60%"],  // Narrower width by reducing the outer radius
        data: pieData,
        label: {
          formatter: "{b|{b}}\n{c|{c}} ({d}%)",
          rich: {
            b: { fontSize: 12, color: "#89C0FF" }, // 修改名称颜色
            c: { fontSize: 14, color: "#ffffff", fontWeight: "bold" }
          }
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        },
        itemStyle: {
          color: (params) => colors[params.dataIndex % colors.length], // Cycle through rainbow colors
        }
      }
    ]
  });
},
updateBarChart(data) {
  this.barChart.clear(); 
  const barData = data
    .map(item => ({
      name: item.name,
      critical: (item.hazards && item.hazards.critical) || 0,
      major: (item.hazards && item.hazards.major) || 0,
      minor: (item.hazards && item.hazards.minor) || 0,
      trivial: (item.hazards && item.hazards.trivial) || 0,
      total: Object.values(item.hazards || {}).reduce((a, b) => a + b, 0)
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  this.barChart.setOption({
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    grid: { top: "10%", bottom: "10%", left: "15%", right: "5%" },
    yAxis: {
      type: "category",
      data: barData.map(item => item.name),
      axisLabel: { color: "#FFFFFF" }
    },
    xAxis: {
      type: "value",
      axisLabel: { color: "#FFFFFF" }
    },
    series: [
      { name: "特大隐患", type: "bar", stack: "总量", data: barData.map(item => item.critical), barWidth: 20, itemStyle: { color: "#D30C0F" } },
      { name: "重大隐患", type: "bar", stack: "总量", data: barData.map(item => item.major), barWidth: 20, itemStyle: { color: "#FF8442" } },
      { name: "一般隐患", type: "bar", stack: "总量", data: barData.map(item => item.minor), barWidth: 20, itemStyle: { color: "#FFAE59" } },
      { name: "轻微隐患", type: "bar", stack: "总量", data: barData.map(item => item.trivial), barWidth: 20, itemStyle: { color: "#FFE774" } }
    ]
  });
}

  },
  mounted() {
    this.pieChart = echarts.init(this.$refs.pieChart);
    this.barChart = echarts.init(this.$refs.barChart);
    this.fetchStreets();
  }
};
</script>


<style scoped>
.left-sidebar {
  position: fixed;
  left: 0;
  top: 2%;
  width: 300px;
  height: 100%;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.section {
  margin-bottom: 5px;
}

.top {
  background-image: url('../../assets/sidebarTitle.png');
  background-size: cover;
  background-position: center;
  color: white;
}

.mid {
  width: 446px;
  background: rgba(17, 37, 82, 0.9);
  border-radius: 4px;
  border: 1px solid #3877F2;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.dropdowns {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.buttom {
  width: 446px;
  height: 92%;
  background: rgba(17, 37, 82, 0.9);
  border-radius: 4px;
  border: 1px solid #3877F2;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title-content {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.hazard-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.hazard-text {
  text-align: center;
  position: absolute;
  top: 27px;
}

button {
  display: block;
  margin-top: 20px;
}

.title {
  width: 398px;
  height: 32px;
  background: linear-gradient(270deg, rgba(23, 54, 125, 0.4) 0%, #193D8C 50%, rgba(23, 54, 125, 0.4) 100%);

}

.chart {
  width: 100%;
  height: 300px;
}
.chart2{
  width: 100%;
  height: 300px;
}
.legend {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-bottom: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
}

.legend-color {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}

.title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 15px;
            width: 408px;
            height: 32px;
            line-height: 30px;
        }
        .title div {
            flex-grow: 1;
            text-align: center;
        }
        .title img {
            width: 20px; /* 根据需要调整图片大小 */
            height: 20px; /* 根据需要调整图片大小 */
        }
        .styled-select {
          background: #081941;
          border-radius: 4px;
          border: 1px solid #293D64;
          color: white;
          width: 100px; /* 增加宽度 */
          padding: 5px;
          margin: 5px 0;
        }

        
</style>
<style>
.anchorBL{
        display: none;  
        }

        .styled-select {
        background: #081941;
        border-radius: 4px;
        border: 1px solid #293D64;
        color: white;
        width: 100px;
        padding: 5px;
        margin: 5px 0;
        outline: none; /* 移除默认的边框轮廓 */
      }

      .styled-select:focus {
        outline: none; /* 防止选中时出现白色边框 */
        border-color: #3877F2; /* 可选：选中时修改边框颜色 */
        box-shadow: 0 0 5px #3877F2; /* 可选：增加选中时的效果 */
      }
</style>
