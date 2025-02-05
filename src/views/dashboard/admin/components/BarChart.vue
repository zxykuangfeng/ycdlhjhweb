<template>
    <div :class="className" :style="{height: height, width: width}" />
  </template>
  
  <script>
  import echarts from 'echarts'
  require('echarts/theme/macarons') // echarts theme
  import resize from './mixins/resize'
  
  export default {
    mixins: [resize],
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '350px'
      },
      autoResize: {
        type: Boolean,
        default: true
      },
      chartData: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        chart: null,
        chartData: {
          totalHazards: [
            133, 233, 123, 123, 234, 452, 543, 345, 632, 345, 435, 234
          ],
          fixedHazards: [
            113, 213, 123, 124, 235, 456, 543, 345, 635, 344, 443, 213
          ]
        }
      }
    },
    watch: {
      chartData: {
        deep: true,
        handler(val) {
          this.setOptions(val)
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.initChart()
      })
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
        this.chart = echarts.init(this.$el, 'macarons')
        this.setOptions(this.chartData)
      },
      setOptions({ totalHazards, fixedHazards } = {}) {
        this.chart.setOption({
          xAxis: {
            data: [
              '一季度', '二季度', '三季度', '四季度'
            ],
            axisTick: {
              show: false
            }
          },
          grid: {
            left: 10,
            right: 10,
            bottom: 20,
            top: 30,
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            padding: [5, 10]
          },
          yAxis: {
            axisTick: {
              show: false
            }
          },
          legend: {
            data: ['总隐患数', '已修复隐患数']
          },
          series: [
            {
              name: '总隐患数',
              type: 'bar',
              data: totalHazards,
              itemStyle: {
                normal: {
                  color: '#FF005A'
                }
              },
              animationDuration: 2800,
              animationEasing: 'cubicInOut'
            },
            {
              name: '已修复隐患数',
              type: 'bar',
              data: fixedHazards,
              itemStyle: {
                normal: {
                  color: '#3888fa'
                }
              },
              animationDuration: 2800,
              animationEasing: 'quadraticOut'
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
  