<!-- src/components/HollowPieChart.vue -->
<template>
    <div :id="id" :class="className" :style="{height:height,width:width}" />
  </template>
  
  <script>
  import echarts from 'echarts'
  import resize from './mixins/resize'
  
  export default {
    mixins: [resize],
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      id: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '400px'
      },
      height: {
        type: String,
        default: '400px'
      }
    },
    data() {
      return {
        chart: null
      }
    },
    mounted() {
      this.initChart()
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    methods: {
      initChart() {
        this.chart = echarts.init(document.getElementById(this.id))
  
        const data = [
          { value: 335, name: '便仓街道' },
          { value: 310, name: '环保产业园' },
          { value: 234, name: '五星街道' },
          { value: 135, name: '毓龙街道' },
          { value: 1548, name: '新城街道' },
          { value: 548, name: '洋河街道' },
          { value: 148, name: '大洋街道' },
          { value: 248, name: '新兴镇' },
          { value: 548, name: '其他' }
        ]
  
        this.chart.setOption({
          backgroundColor: '#2c343c',
          title: {
            text: '隐患数量分布',
            left: 'center',
            top: 20,
            textStyle: {
              color: '#ccc'
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: data.map(item => item.name),
            textStyle: {
              color: '#ccc'
            }
          },
          series: [
            {
              name: '隐患数量',
              type: 'pie',
              radius: ['40%', '70%'],
              center: ['50%', '50%'],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: data
            }
          ]
        })
      }
    }
  }
  </script>
  
  <style scoped>
  .chart {
    width: 100%;
    height: 100%;
  }
  </style>
  