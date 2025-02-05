<template>
  <div id="website-setting">
    <h3>任务设置</h3>
    <el-form ref="form" :model="form" label-width="200px" style="width: 600px;">
      <el-form-item label="小说定时上传" />
      <el-form-item label="选择周期:">
        <el-radio-group v-model="form.time_type">
          <el-radio :label="0">每天</el-radio>
          <el-radio :label="1">每周</el-radio>
          <el-radio :label="2">每月</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.time_type == 1" label="选择日期:">
        <el-select v-model="form.date" placeholder="请选择">
          <el-option
            v-for="item in weekLists"
            :key="item.id"
            :label="item.week"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.time_type == 2" label="选择日期:">
        <el-select v-model="form1.date" placeholder="请选择">
          <el-option
            v-for="item in monthLists"
            :key="item.id"
            :label="item.week"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="选择时间:">
        <el-time-picker
          v-model="form.datetime"
          :picker-options="{
            selectableRange: '00:00:00 - 23:59:59'
          }"
          placeholder="请选择时间"
          format="HH:mm"
          value-format="HH:mm"
        />
      </el-form-item>
      <el-form-item label="选择章数:">
        <el-input v-model="form.task_num" />
      </el-form-item>
      <el-form-item label="渠道定时推送" />

      <el-form-item label="选择周期:">
        <el-radio-group v-model="form1.time_type">
          <el-radio :label="0">每天</el-radio>
          <el-radio :label="1">每周</el-radio>
          <el-radio :label="2">每月</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form1.time_type == 1" label="选择日期:">
        <el-select v-model="form1.date" placeholder="请选择">
          <el-option
            v-for="item in weekLists"
            :key="item.id"
            :label="item.week"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form1.time_type == 2" label="选择日期:">
        <el-select v-model="form1.date" placeholder="请选择">
          <el-option
            v-for="item in monthLists"
            :key="item.id"
            :label="item.week"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="选择时间:">
        <el-time-picker
          v-model="form1.datetime"
          :picker-options="{
            selectableRange: '00:00:00 - 23:59:59'
          }"
          placeholder="请选择时间"
          format="HH:mm"
          value-format="HH:mm"
        />
      </el-form-item>
      <el-form-item label="选择章数:">
        <el-input v-model="form1.task_num" />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="loading"
          @click="update"
        >确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getScheduledTasksData, updateScheduledTasks } from '@/api/website'
export default {
  name: 'WebsiteSetting',
  components: {},
  props: {},
  data() {
    return {
      weekLists: [
        { id: 1, week: '周一' },
        { id: 2, week: '周二' },
        { id: 3, week: '周三' },
        { id: 4, week: '周四' },
        { id: 5, week: '周五' },
        { id: 6, week: '周六' },
        { id: 7, week: '周七' }
      ],
      monthLists: [
        { id: 1, month: '1' },
        { id: 2, month: '2' },
        { id: 3, month: '3' },
        { id: 4, month: '4' },
        { id: 5, month: '5' },
        { id: 6, month: '6' },
        { id: 7, month: '7' },
        { id: 8, month: '8' },
        { id: 9, month: '9' },
        { id: 10, month: '10' },
        { id: 11, month: '11' },
        { id: 12, month: '12' },
        { id: 13, month: '13' },
        { id: 14, month: '14' },
        { id: 15, month: '15' },
        { id: 16, month: '16' },
        { id: 17, month: '17' },
        { id: 18, month: '18' },
        { id: 19, month: '19' },
        { id: 20, month: '20' },
        { id: 21, month: '21' },
        { id: 22, month: '22' },
        { id: 23, month: '23' },
        { id: 24, month: '24' },
        { id: 25, month: '25' },
        { id: 26, month: '26' },
        { id: 27, month: '27' },
        { id: 28, month: '28' },
        { id: 29, month: '29' },
        { id: 30, month: '30' },
        { id: 31, month: '31' }
      ],
      loading: false,
      form: {},
      form1: {}
    }
  },
  computed: {},
  watch: {},
  created() {
    this.$nextTick(() => {
      this.getList()
    })
  },
  mounted() {},
  methods: {
    StrToGMT(time) {
      const GMT = new Date(time)
      return GMT
    },
    update() {
      this.loading = true
      const _d = {}

      if (this.form.type == 0) {
        this.form.date = 1
      }
      if (this.form1.type == 0) {
        this.form1.date = 1
      }
      _d[1] = this.form
      _d[2] = this.form1
      updateScheduledTasks(_d).then(res => {
        if (res.code == 0) {
          this.$notify({
            title: 'Success',
            message: '更新成功',
            type: 'success',
            duration: 1000
          })
        } else {
          this.$notify({
            title: 'Error',
            message: res.msg,
            type: 'warning',
            duration: 1000
          })
        }
        this.loading = false
        this.getList()
      })
    },
    getList() {
      getScheduledTasksData().then(res => {
        this.form = res.data[0]
        this.form1 = res.data[1]
      })
    },
    onSubmit() {
      console.log('submit!')
    }
  }
}
</script>

<style lang="scss">
#website-setting {
  width: 100%;
  padding: 20px;
  h3 {
    color: #304156;
    padding: 20px 0 40px 20px;
    border-bottom: 1px solid #eee;
    margin: 0;
    margin-bottom: 40px;
    font-size: 24px;
  }
  .plan-time {
    padding-left: 20px;
    font-size: 16px;
    color: #555;
  }
}
</style>
