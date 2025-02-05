<template>
  <div id="website-setting">
    <h3>站点设置</h3>
    <el-form ref="form" :model="form" label-width="200px" style="width: 800px;">
      <el-form-item label="站点标题">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="站点关键词">
        <el-input v-model="form.keywords" />
      </el-form-item>
      <el-form-item label="站点描述">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="6"
        />
      </el-form-item>
      <el-form-item label="默认开始收费章节">
        <el-input v-model="form.DefaultSell" />
      </el-form-item>
      <el-form-item label="付费章节价格(书券/千字)">
        <el-input v-model="form.SellGold" />
      </el-form-item>
      <el-form-item label="新用户赠送书券">
        <el-input v-model="form.NewGold" />
      </el-form-item>
      <el-form-item label="作者收益展示比率">
        <el-input v-model="form.ProfitRatio" />
      </el-form-item>
      <el-form-item label="书券/价格(元)比率">
        <el-input v-model="form.GoldAmount" />
      </el-form-item>
      <el-form-item label="监管模式">
        <el-radio-group v-model="form.SupervisionMode">
          <el-radio label="0">关闭</el-radio>
          <el-radio label="1">开启</el-radio>
        </el-radio-group>
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
import { getSite, updateSite } from '@/api/website'
export default {
  name: 'WebsiteSetting',
  components: {},
  props: {},
  data() {
    return {
      loading: false,
      form: {}
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
    update() {
      this.loading = true
      updateSite(this.form).then(res => {
        if (res.status == 'S') {
          this.$notify({
            title: 'Success',
            message: '更新成功',
            type: 'success',
            duration: 1000
          })
        } else {
          this.$notify({
            title: 'Error',
            message: res.message,
            type: 'warning',
            duration: 1000
          })
        }
        this.loading = false
        this.getList()
      })
    },
    getList() {
      getSite().then(res => {
        this.form = res.data
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
}
</style>
