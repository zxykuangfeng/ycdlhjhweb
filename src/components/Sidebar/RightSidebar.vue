<template>
  <div class="right-sidebar">
    <!-- 隐患空间分布 -->
    <div class="section top">
      <h3 class="title">
        <img :src="right" alt="左侧图标">
        <div class="mmfont">隐患空间分布</div>
        <img :src="left" alt="右侧图标">
      </h3>
      <div ref="spaceChart" class="chart"></div>
    </div>

    <!-- 隐患数量 Top 5 -->
    <div class="section mid">
      <h3 class="title">
        <img :src="right" alt="左侧图标">
        <div class="mmfont">隐患数量 Top 5</div>
        <img :src="left" alt="右侧图标">
      </h3>

      <div style="display: flex; gap: 20px; align-items: center; margin-bottom: 10px;">
    <div>
      <label style="color: #E5EAF3; font-size: 14px;">场景:</label>
      <select v-model="selectedScenario" @change="onScenarioChange" class="styled-select" style="width: 110px;font-size: 14px;">
        <option v-for="scenario in scenarioList" :key="scenario" :value="scenario">
          {{ scenario }}
        </option>
      </select>
    </div>
    <div>
      <label style="color: #E5EAF3; font-size: 14px;">道路等级:</label>
      <select v-model="selectedRoadLevel" @change="onRoadLevelChange" class="styled-select" style="width: 110px;font-size: 14px;">
        <option v-for="level in roadLevelList" :key="level" :value="level">
          {{ level }}
        </option>
      </select>
    </div>
  </div>
      <ul class="top-list">
        <li v-for="(item, index) in top5Hazards" :key="index" class="list-item" style="display: flex;">
          
          <div
              class="bg"
              :style="{
                background: bgColors[index],
              }"
            ><div
            class="rank"
            :style="{
              background: '#041232',
              boxShadow: rankBoxShadows[index],
              borderColor: rankBorderColors[index],
              borderWidth: '2px',
              borderStyle: 'solid'
            }"
          >
            Top {{ index + 1 }}
          </div>
            <div class="desc">{{ item.description }}</div>
            <div class="count">{{ item.count }}处</div>
          </div>
        </li>
      </ul>
    </div>

    <!-- 涉及隐患场景的道路数据统计 -->
    <div class="section bottom">
    <h3 class="title">
      <img :src="right" alt="左侧图标">
      <div class="mmfont">涉及隐患场景的道路数据统计</div>
      <img :src="left" alt="右侧图标">
    </h3>
    <div class="scene-stats">
      <div 
        class="scene-item" 
        v-for="(scene, index) in sceneData" 
        :key="index"
        @mouseover="hoverIndex = index"
        @mouseleave="hoverIndex = null"
        :style="{ backgroundImage: `url(${hoverIndex === index ? yhtjbj1 : yhtjbj2})` }"
      >
        <div class="scene-name">{{ scene.name }}</div>
        <div class="scene-count" style="display: flex;align-items: center;width: 60px;justify-content: space-between;"><div>{{ scene.count }}</div><div style="color: white;font-size: 15px;">条</div></div>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { yhCount } from "@/api/road";

export default {
  name: 'RightSidebar',
  props: {
    selectedStreetData: {
      type: Object,
      default: () => null
    }
  },
  watch: {
    selectedStreetData: {
      handler(newVal) {
        console.log('selectedStreetData 更新:', newVal);
        if (newVal && newVal.id) {
          this.fetchYhCount(newVal.id); // 调用接口请求数据
        }else{
          this.fetchYhCount(); // 调用接口请求数据
        }
      },
      immediate: true, // 初始化时立即触发
      deep: true, // 深度监听
    }
  },
  data() {
    return {
      right: require('../../assets/right.png'),
      left: require('../../assets/left.png'),
      yhtjbj2: require('../../assets/yhtjbj2.png'),
      yhtjbj1: require('../../assets/yhtjbj1.png'),
      top5Hazards: [], // 隐患数量 Top 5 数据
      sceneData: [], // 涉及隐患场景的数据
      spaceChart: null, // ECharts 图表实例
      hoverIndex: null,
      rankBorderColors: ['#D40000', '#D46500', '#D49000', '#0063D4', '#0063D4'],
      rankBoxShadows: [
        'inset 0px 1px 12px 0px rgba(212, 0, 0, 0.62)',
        'inset 0px 1px 12px 0px rgba(212, 101, 0, 0.62)',
        'inset 0px 1px 12px 0px rgba(212, 144, 0, 0.62)',
        'inset 0px 1px 12px 0px rgba(0, 99, 212, 0.62)',
        'inset 0px 1px 12px 0px rgba(0, 99, 212, 0.62)'
      ],
      bgColors: [
        'linear-gradient(270deg, rgba(57,115,250,0.2) 0%, rgba(211,12,15,0.3) 100%)',
        'linear-gradient(270deg, rgba(57,115,250,0.2) 0%, rgba(191,94,56,0.3) 100%)',
        'linear-gradient(270deg, rgba(57,115,250,0.2) 0%, rgba(191,178,56,0.3) 100%)',
        'linear-gradient(270deg, rgba(57,115,250,0.2) 0%, rgba(56,119,242,0.3) 100%)',
        'linear-gradient(270deg, rgba(57,115,250,0.2) 0%, rgba(56,119,242,0.3) 100%)'
      ],
      scenarioList: ['全场景', '轻微隐患', '一般隐患', '重大隐患', '特大隐患'],
    selectedScenario: '全场景',
    scenarioMap: {
      全场景: null, // 全场景传 null 或不传
      轻微隐患: 10,
      一般隐患: 11,
      重大隐患: 12,
      特大隐患: 13
    },
    // 道路等级下拉列表
    roadLevelList: [
      '全道路等级','城市主干道','城市次干道','县乡村道路','无名路','高速道路','国省道路',      
    ],
    roadLevelMap: {
      全道路等级: null, // 全道路等级传 null 或不传
      国省道路: 17,
      高速道路: 18,
      无名路: 19,
      县乡村道路: 20,
      城市次干道: 21,
      城市主干道: 22
    },
    selectedRoadLevel: '全道路等级',
    };
  },
  methods: {
    // 初始化隐患空间分布图表
    initSpaceChart(spaceData = []) {
      if (!this.spaceChart) {
        this.spaceChart = echarts.init(this.$refs.spaceChart);
      }

      const categories = spaceData.map((item) => item.name);
      const counts = spaceData.map((item) => item.count);

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '5%',
          right: '10%',
          top: '5%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
          axisLabel: {
            color: '#FFFFFF'
          }
        },
        yAxis: {
          type: 'category',
          data: categories,
          axisLabel: {
            color: '#FFFFFF'
          },
          axisTick: {
            show: false
          }
        },
        series: [
          {
            name: '隐患数量',
            type: 'bar',
            data: counts,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  { offset: 0, color: '#8FCFFD' },
                  { offset: 1, color: '#3973FA' }
                ]
              }
            },
            barWidth: 20,
          }
        ]
      };

      this.spaceChart.setOption(option);
    },

    onScenarioChange() {
    this.requestTop5Again();
  },

  // 当道路等级下拉发生变化
  onRoadLevelChange() {
    this.requestTop5Again();
  },

  requestTop5Again() {
    // 重新调用 fetchYhCount，带上当前 streetId / scenario / roadLevel
    // 这里 streetId 如果在 selectedStreetData 里
    var streetId = (this.selectedStreetData && this.selectedStreetData.id)
    ? this.selectedStreetData.id
    : null;

    this.fetchYhCount(streetId);
  },
    // 请求隐患统计接口
    async fetchYhCount(streetId) {
      try {
        const params = {
          mid: streetId,
          // 将场景和道路等级转换为对应的数字
          scenario: this.scenarioMap[this.selectedScenario],
          roadLevel: this.roadLevelMap[this.selectedRoadLevel]
        };
        const response = await yhCount(params);
        console.log('隐患统计数据:', response);

        if (response.code === 0) {
          const data = response.data;

          // 更新隐患空间分布图表
          this.initSpaceChart(data.space);

          // 更新隐患数量 Top 5
          this.top5Hazards = data.number.map((item) => ({
            description: item.name,
            count: item.count,
          }));
          console.log(1111111111111)
          console.log(this.top5Hazards)
          // 更新涉及隐患场景的道路数据统计
          this.sceneData = data.cj.map((item) => ({
            name: item.name,
            count: item.count,
          }));

          console.log(222222222222)
          console.log(this.sceneData)
        } else {
          console.error('获取隐患统计数据失败:', response.msg);
        }
      } catch (error) {
        console.error('请求隐患统计接口失败:', error);
      }
    }
  },
  mounted() {
    console.log('接收到的街道数据:', this.selectedStreetData);
    if (this.selectedStreetData && this.selectedStreetData.id) {
      this.fetchYhCount(this.selectedStreetData.id); // 初始化时请求
    }
  }
};
</script>
<style scoped>
.right-sidebar {
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  right: 0;
  top: 10%;
  width: 446px;
  height: 92%;
  border: 1px solid #3877F2;
  color: white;
  border-radius: 4px;
  background: rgba(17, 37, 82, 0.9);
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 10;
  padding-left: 20px;
  padding-right: 20px;
}

.section {
  /* margin-bottom: 5px; */
}

.top-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 14px;
}

.rank {
  /* color: #FFFFFF; */
  font-weight: bold;
  width: 67px;
  height: 30px;
  background: #041232;
  box-shadow: inset 0px 1px 12px 0px rgba(212,0,0,0.62);
  line-height: 30px;
  /* padding-left: 10px; */
  border-radius: 16px; 
  /* border-image: linear-gradient(222deg, rgba(255, 125, 125, 1), rgba(226, 13, 13, 1)) 1 1; */
}
.bg{
  width: 398px;
  height: 30px;
  background: linear-gradient( 270deg, rgba(57,115,250,0.2) 0%, rgba(211,12,15,0.3) 100%);
  border-radius: 100px 0px 0px 100px;
  line-height: 30px;
  
}
.desc {
  flex: 1;
  margin-left: 10px;
  color: #E5EAF3;
}

.count {
  color: #89C0FF;
  font-weight: 700;
}

.scene-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.scene-item {
  background: rgba(17, 37, 82, 0.9);
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  color: #FFFFFF;
  font-size: 14px;
}

.chart {
  width: 100%;
  height: 220px;
  margin-right: 50px;
}

.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  width: 100%;
  height: 50px;
  line-height: 30px;
}
.title {
  width: 398px;
  height: 32px;
  background: linear-gradient(270deg, rgba(23, 54, 125, 0.4) 0%, #193D8C 50%, rgba(23, 54, 125, 0.4) 100%);

}
.title div {
  flex-grow: 1;
  text-align: center;
}

.title img {
  width: 20px;
  height: 20px;
}

.rank {
  width: 67px;
  height: 30px;
  line-height: 30px;
  /* padding-left: 10px; */
  border-radius: 16px;
  padding-bottom: 2px;
  color: white;
  text-align: center;
}

.bg {
  flex: 1;
  height: 30px;
  border-radius: 100px 0px 0px 100px;
  line-height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 10px;
  /* padding: 0 10px; */
}



</style>
<style scoped>
.scene-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.scene-item {
  background-size: contain; /* 确保图片完全显示 */
  background-position: center;
  background-repeat: no-repeat;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  color: #FFFFFF;
  font-size: 14px;
  height: 88px; /* Adjust height as needed */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: background-image 0.3s ease; /* Smooth background transition */
}

.scene-name {
  font-weight: bold;
  font-size: 12px;
  color: #89C0FF;
}

.scene-count {
  margin-top: 10px;
  font-size: 16px;
  color: #FF585A;
  font-weight: 700;
}

</style>