<template>
  <div class="app-container">
    <el-row :gutter="40" class="panel-group">
      <!-- <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            总充值金额
          </div>
          <count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            总充值书券
          </div>
          <count-to :start-val="0" :end-val="81212" :duration="3000" class="card-panel-num" />
        </div>
      </div>
      </el-col>-->
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('purchases')">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="money" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">总充值金额</div>
            <count-to
              :start-val="0"
              :end-val="countData.Money"
              :duration="2000"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('shoppings')">
          <div class="card-panel-icon-wrapper icon-shopping">
            <svg-icon icon-class="shopping" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">总充值书券</div>
            <count-to
              :start-val="0"
              :end-val="Number(countData.Gold)"
              :duration="2000"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="filter-container">
      <el-input
        v-model="listQuery.Nickname"
        placeholder="请输入用户名"
        style="width: 200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="search"
      />
      <el-input
        v-model="listQuery.ID"
        placeholder="请输入ID"
        style="width: 200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="search"
      />
      <el-date-picker
        v-model="listQuery.start_time"
        type="date"
        placeholder="选择开始日期"
        clearable
        class="filter-item"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd HH:mm:ss"
        style="width: 160px"
      />
      <el-date-picker
        v-model="listQuery.end_time"
        type="date"
        placeholder="选择结束日期"
        clearable
        class="filter-item"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd HH:mm:ss"
        style="width: 160px"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="search"
      >搜索</el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item fright"
        type="primary"
        icon="el-icon-download"
        plain
        @click="handleDownload"
      >导出</el-button>
    </div>

    <el-table
      ref="multipleTable"
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      />
      <el-table-column label="ID" prop="id" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.ID }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" min-swidth="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="充值金额" min-width="120px" align="center">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.Money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="充值书券" align="center">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.Gold }}</span>
        </template>
      </el-table-column>
      <el-table-column label="充值时间" align="center">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.Dtime }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 10"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { dataorderdata, dataorderexport } from '@/api/data'
import waves from '@/directive/waves' // waves directive
// import { parseTime } from "@/utils";
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import CountTo from 'vue-count-to'

export default {
  name: 'PayStatistics',
  components: { Pagination, CountTo },
  directives: { waves },
  filters: {},
  data() {
    return {
      countData: { Money: 0, Gold: 0 },
      Time: '',
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      downloadLoading: false,
      ids: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
      const ids = []
      this.multipleSelection.map(item => {
        ids.push(item.ID)
      })
      this.ids = ids
    },
    getList() {
      this.listLoading = true
      dataorderdata(this.listQuery).then(res => {
        if (res.code === 0) {
          this.list = res.data
          this.total = res.count
          this.countData = res.countData
        } else {
          this.list = []
          this.total = 0
          this.countData = { Money: 0, Gold: 0 }
        }
        this.listLoading = false
      })
    },
    search() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      const _d = {}
      _d.Nickname = this.listQuery.Nickname
      _d.ID = this.listQuery.ID
      _d.start_time = this.listQuery.start_time
      _d.end_time = this.listQuery.end_time
      _d.ids = this.ids.join(',')
      dataorderexport(_d).then(res => {
        console.log('dataorderexport-s')
        console.log(res)
        console.log('dataorderexport-e')
        this.download(res.url)
        this.downloadLoading = false
      })
    },
    download(url) {
      var iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      iframe.src = url
      document.body.appendChild(iframe)
    }
  }
}
</script>
<style lang="scss">
.el-icon-close {
  color: rgb(221, 74, 74);
}
.el-icon-check {
  color: rgb(82, 168, 82);
}
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3;
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
