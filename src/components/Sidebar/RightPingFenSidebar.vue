<template>
    <div >
      <div class="right-sidebar" v-if="selectedType !== 'all'">

      <!-- 标题 -->
      <div class="header">
        <img :src="rightIcon" alt="right" class="header-icon" />
        <span class="header-title">道路安全评分详情</span>
        <img :src="leftIcon" alt="left" class="header-icon" />
      </div>

      <!-- 基本信息 -->
      <div class="basic-info">
        <div class="road-name">{{ roadData.name || '无' }} {{ selectedType || '无' }}</div>
        <div class="score-update">
          <span style="color: #89C0FF;">评分更新记录</span>
          <span class="score">{{ roadData.score || '暂无评分' }}</span>
          <span class="score-tag" :class="getScoreTagClass(roadData.score)">{{ getScoreTagText(roadData.score) }}</span>
        </div>
      </div>

      <!-- 道路详细统计 -->
      <div class="road-stats">
        <div class="stats-row">
          <span style="color: #617199;">道路类型</span><span>{{ roadData.type_name || '无' }}</span>
        </div>
        <div class="stats-row">
          <span style="color: #617199;">隐患总量</span><span>{{ roadData.yh_count || 0 }}个</span>
        </div>
        <div class="stats-row">
          <span style="color: #617199;">道路长度</span><span>{{ roadData.length || '无' }}km</span>
        </div>
      </div>

      <!-- 隐患等级 -->
      <div class="hazard-levels">
        <div v-for="(level, index) in hazardLevels" :key="index" class="hazard-card" :class="getHazardCardClass(level.id)">
          <span>{{ level.name }}</span>
          <span>{{ level.count }}处</span>
        </div>
      </div>

      <div class="scoring-details">
        <div class="section-header">
          <span>扣分细则</span>
        </div>

        <!-- 遍历展示多个 section -->
        <div v-for="(section, index) in scoringDetails" :key="index">
          <div class="section-title" @click="toggleSection(index)">
            <img :src="rightIcon" alt="right" class="header-icon" />
            {{ section.name }}
            <span class="score-tag">{{ section.child.length }}处隐患</span>
            <img
              style="width: 12px; height: 12px"
              :src="xiaIcon"
              :class="{ rotated: !expandedSections[index] }"
              alt="toggle"
              class="header-icon"
            />
          </div>

          <!-- 可折叠内容 -->
          <transition name="expand">
            <div v-show="expandedSections[index]" class="section-content">
              <div class="section-table-title" style="display: flex;">
                <div>隐患类别</div><div>隐患等级</div><div>扣分</div>
              </div>
              <div
                v-for="(item, i) in section.child"
                :key="i"
                class="section-table-list"
                :class="{ 'row-alternate': i % 2 === 1 }"
                @click="handleItemClick(item)"
              >
                <div>{{ item.yhlb_name }}</div>
                <div>{{ item.yhdj_name }}</div>
                <div>{{ item.score }}</div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
    <div class="right-sidebar-buttom">
    <div class="corner left-bottom"></div>
  <div class="corner right-top"></div>
    <div style="color: white;font-size: 14px;">道路安全状态</div>
    <div style="color: #3877F2;font-size: 14px;margin-left: 5px;">|</div>
    <div style="display: flex;margin-left: 5px;">
      <div style="width: 80px;">
        <div style="background-color: #32AF06;" class="rectangle"></div>
         <div style="color: #32AF06;font-size: 14px;">良好</div> 
      </div>
      <div style="width: 80px;">
        <div style="background-color: #EFCA15;"  class="rectangle"></div>
         <div  style="color: #EFCA15;font-size: 14px;">轻量隐患</div> 
      </div>
      <div style="width: 80px;">
        <div style="background-color: #D30C0F;" class="rectangle"></div>
         <div style="color: #D30C0F;font-size: 14px;">严重隐患</div> 
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import { Fragment } from 'vue-fragment';
import { safeRoadScore,safeRoadChild } from '@/api/road';

export default {
  name: 'RightPingFenSidebar',
  components: { Fragment },
  props: {
  selectedType: {
    type: String,
    default: null
  },
  selectedData: {
    type: Object,
    default: null,
  },
  selectedIds: {
    type: Array,
    default: () => [],
  }
},
  data() {
    return {
      rightIcon: require('@/assets/right.png'),
      leftIcon: require('@/assets/left.png'),
      xiaIcon: require('@/assets/toxia.png'),
      roadData: {}, // 道路基本信息
      hazardLevels: [], // 隐患等级统计
      scoringDetails: [], // 扣分细则
      expandedSections: [], // 控制每个 section-content 的展开/收起状态
    };
  },
  watch: {
  selectedData: {
    immediate: true,
    handler() {
      console.log('watch selectedData:', this.selectedData)
      this.checkAndFetch();
    }
  },
  selectedIds: {
    immediate: true,
    handler() {
      console.log('watch selectedIds:', this.selectedIds)
      this.checkAndFetch();
    }
  }
},
  methods: {
    async fetchRoadData() {
      try {
        if (!(this.selectedData && this.selectedData.id && this.selectedType)) {
          console.warn('未提供选中的道路数据或类型');
          return;
        }
        console.log('111',this.selectedType)

        
        const typeMapping = {
          '路段': 1,
          '路口': 2,
          '道路': 3,
        };

        const typeValue = typeMapping[this.selectedType] || 1; 
        const params = { id: this.selectedData.id, type: typeValue };
        const res = await safeRoadScore(params);

        if (res.code === 0) {
          this.roadData = res.data.data || {};
          this.hazardLevels = res.data.yhdj || [];
          this.scoringDetails = res.data.yhjcx || [];
          this.expandedSections = new Array(this.scoringDetails.length).fill(false);
        } else {
          console.error('获取道路评分详情失败:', res.msg);
        }
      } catch (error) {
        console.error('请求道路评分详情接口时出错:', error);
      }
    },
    checkAndFetch() {
      console.log('checkAndFetch 中 selectedIds:', this.selectedIds);
  console.log('checkAndFetch 中 selectedData:', this.selectedData);

  if (this.selectedIds && this.selectedIds.length > 1) {
    console.log('🔵 进入多选 fetchMultipleRoadData');
    this.fetchMultipleRoadData();
  } else if (this.selectedData && this.selectedData.id) {
    console.log('🟢 进入单选 fetchSingleRoadData');
    console.log(this.selectedType);
    this.fetchSingleRoadData();
    } else {
      // 清空展示数据
      this.roadDataList = [];
      this.roadData = {};
      this.hazardLevels = [];
      this.scoringDetails = [];
    }
  },
  async fetchSingleRoadData() {
    try {
      const typeMap = { '路段': 1, '路口': 2, '道路': 3 };
      const typeValue = typeMap[this.selectedType] || 1;

      const res = await safeRoadScore({ id: this.selectedData.id, type: typeValue });
      if (res.code === 0) {
        this.roadData = res.data.data || {};
        this.hazardLevels = res.data.yhdj || [];
        this.scoringDetails = res.data.yhjcx || [];
        this.expandedSections = new Array(this.scoringDetails.length).fill(false);
      }
    } catch (e) {
      console.error('获取单个道路评分出错', e);
    }
  },
  async fetchMultipleRoadData() {
    try {
      const typeMap = { '路段': 1, '路口': 2, '道路': 3 };
      const typeValue = typeMap[this.selectedType] || 1;

      const res = await safeRoadScore({
        ids: this.selectedIds.join(','),
        type: typeValue
      });

      if (res.code === 0) {
        this.roadDataList = res.data.list || [];
        // 合并展示内容：
        this.aggregateHazardLevels();
        this.aggregateScoringDetails();
      }
    } catch (e) {
      console.error('获取多个道路评分出错', e);
    }
  },
    toggleSection(index) {
      this.$set(this.expandedSections, index, !this.expandedSections[index]);
    },
    handleItemClick(item) {
      this.$emit('item-selected', item); // 触发父组件事件并传递选中的值
    },
    getHazardCardClass(id) {
      switch (id) {
        case 13: return 'red';
        case 12: return 'orange';
        case 11: return 'yellow';
        case 10: return 'blue';
        default: return '';
      }
    },
    getScoreTagClass(score) {
      if (score >= 80) return 'good';
      if (score >= 60) return 'average';
      return 'poor';
    },
    getScoreTagText(score) {
      if (score >= 80) return '良好';
      if (score >= 60) return '一般';
      return '较差';
    },
  },
};
</script>
<style scoped>
.right-sidebar {
  position: fixed;
  right: 0;
  top: 120px;
  width: 446px;
  height: 81%;
  background: linear-gradient(135deg, #1f2a51, #0b1224);
  border: 1px solid #3877f2;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-shadow: -4px 0 8px rgba(0, 0, 0, 0.5);
  border-radius: 4px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(270deg, rgba(23, 54, 125, 0.4), #193d8c);
  padding: 8px 0;
  margin-bottom: 10px;
  border-radius: 4px;
}

.header-icon {
  width: 20px;
  height: 20px;
}

.header-title {
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
}

.basic-info {
  display: flex;
  flex-direction: column;
  padding: 10px 0;
  border-bottom: 1px solid #3877f2;
}

.road-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}

.score-update {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.score {
  color: #ff5656;
  font-weight: bold;
}

.score-tag {
  background: #d40000;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
}

.road-stats {
  margin-top: 10px;
}

.stats-row {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  font-size: 14px;
}

.hazard-levels {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}

.hazard-card {
  width: 100px;
  padding: 8px;
  text-align: center;
  color: white;
  font-size: 14px;
  border-radius: 4px;
  margin-right: 8px;
}

.hazard-card.red {
  background: #d40000;
}

.hazard-card.orange {
  background: #d46500;
}

.hazard-card.yellow {
  background: #d49000;
}

.hazard-card.blue {
  background: #0063d4;
}

.scoring-details {
  margin-top: 10px;
}

.section-header {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #3877f2;
}

.scoring-row {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  border-bottom: 1px solid #2a3a65;
  font-size: 14px;
}

.general-hazard {
  color: #d46500;
  font-weight: bold;
}
</style>
<style scoped>
.section-title {
  background: linear-gradient(270deg, rgba(23, 54, 125, 0.4) 0%, #193D8C 100%);
  color: #ffffff;
  padding: 8px 12px;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  margin-bottom: 10px;
}

.section-content {
  /* background: rgba(17, 37, 82, 0.8); */
  /* padding: 10px; */
  border-radius: 4px;
}

/* .section-content > div {
  margin-bottom: 5px;
} */

.section-content div span {
  /* display: block; */
  color: rgb(97, 113, 153);
  font-size: 14px;
  margin-bottom: 5px;
}

.section-table-title {
  display: flex;
  background-color: #1D3877;
  color: #89C0FF;
  padding: 8px;
  font-weight: bold;
  border-radius: 4px;
  margin-top: 10px;
}

.section-table-title div {
  flex: 1;
  text-align: left;
  font-size: 14px;
}

.section-table-list {
  display: flex;
  padding: 8px;
  color: #FFFFFF;
}

.section-table-list:nth-child(odd) {
  background-color: transparent;
}

.section-table-list:nth-child(even) {
  background-color: #2A3A65;
}

.section-table-list div {
  flex: 1;
  text-align: left;
  font-size: 14px;
}
</style>
<style scoped>
.right-sidebar {
  position: fixed;
  right: 5px;
  top: 120px;
  width: 446px;
  background: linear-gradient(135deg, #1f2a51, #0b1224);
  color: white;
  padding: 20px;
  box-shadow: -4px 0 8px rgba(0, 0, 0, 0.5);
  border-radius: 4px;
}

.section-title {
  background: linear-gradient(270deg, rgba(23, 54, 125, 0.4) 0%, #193D8C 100%);
  color: #ffffff;
  padding: 8px 12px;
  /* font-size: 14px; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* border-radius: 4px; */
  /* margin-bottom: 10px; */
  cursor: pointer;
}

.header-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.header-icon.rotated {
  transform: rotate(180deg);
}

.section-content {
  margin-bottom: 10px;
}

.section-table-title {
  background-color: #1D3877;
  color: #89C0FF;
  padding: 8px;
  font-weight: bold;
}

.section-table-list {
  display: flex;
  padding: 8px;
  color: #FFFFFF;
}

.section-table-list.row-alternate {
  background-color: #2A3A65;
}

.section-table-list div {
  flex: 1;
  text-align: left;
}

.expand-enter-active, .expand-leave-active {
  transition: all 0.3s ease;
  max-height: 500px; /* 最大展开高度 */
}

.expand-enter, .expand-leave-to {
  max-height: 0;
  opacity: 0;
}


.right-sidebar-buttom{
  position: absolute;
  display: flex;
  align-items: center;
  background-color: #112552;
  /* width: 248px; */
  /* height: 20px; */
  bottom: 6px;
  right: 89px;
  padding:10px;
  padding-left: 13px;
}

.rectangle{
  height: 12px;
  width: 70px;
  font-size: 12px;
}


.right-sidebar-buttom::before,
.right-sidebar-buttom::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none; /* 防止伪元素干扰点击事件 */
}

/* 左上和右下角 */
.right-sidebar-buttom::before {
  border-top: 2px solid #3877f2; /* 左上角 */
  border-left: 2px solid #3877f2;
  top: 0;
  left: 0;
  width: 10px;
  height: 10px;
}

/* 右上和左下角 */
.right-sidebar-buttom::after {
  border-bottom: 2px solid #3877f2; /* 左下角 */
  border-right: 2px solid #3877f2;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
}

/* 新增左下和右上角伪元素 */
.right-sidebar-buttom .corner {
  position: absolute;
  pointer-events: none;
}

.right-sidebar-buttom .corner.left-bottom {
  border-left: 2px solid #3877f2;
  border-bottom: 2px solid #3877f2;
  width: 10px;
  height: 10px;
  left: 0;
  bottom: 0;
}

.right-sidebar-buttom .corner.right-top {
  border-right: 2px solid #3877f2;
  border-top: 2px solid #3877f2;
  width: 10px;
  height: 10px;
  top: 0;
  right: 0;
}


.score-tag.good {
  background: #32AF06; /* 绿色 */
  color: white;
}

.score-tag.average {
  background: #EFCA15; /* 黄色 */
  color: white;
}

.score-tag.poor {
  background: #D30C0F; /* 红色 */
  color: white;
}

.section-content {
  max-height: 300px; /* 限制高度，超出部分滚动 */
  overflow-y: auto;  /* 启用滚动条 */
  /* border: 1px solid #ddd; */
  padding: 8px;
}

/* 自定义滚动条样式 */
.section-content::-webkit-scrollbar {
  width: 6px;
}

.section-content::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.section-content::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}
</style>
