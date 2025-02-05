<template>
  <div class="app-container">
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">总点击量</div>
            <count-to
              :start-val="0"
              :end-val="Number(countData.Hits)"
              :duration="2000"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="shopping" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">总访问用户数</div>
            <count-to
              :start-val="0"
              :end-val="Number(countData.reading_user_count)"
              :duration="2000"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="money" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">付费用户数</div>
            <count-to
              :start-val="0"
              :end-val="Number(countData.paying_user_count)"
              :duration="2000"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-shopping">
            <svg-icon icon-class="message" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">总信息费</div>
            <count-to
              :start-val="0"
              :end-val="Number(countData.order_count)"
              :duration="2000"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="filter-container">
      <el-input
        v-model="listQuery.Title"
        placeholder="请输入小说名/作者名/ID"
        style="width: 200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="search"
      />
      <el-select
        v-model="listQuery.select_type"
        placeholder="选择类型"
        clearable
        class="filter-item"
        style="width: 120px"
        filterable
        @keyup.enter.native="search"
      >
        <el-option
          v-for="item in typeLists"
          :key="item.id"
          :label="item.author_name"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="listQuery.source"
        placeholder="选择来源"
        clearable
        class="filter-item"
        style="width: 120px"
        @keyup.enter.native="search"
      >
        <el-option
          v-for="item in sourceLists"
          :key="item.id"
          :label="item.source_name"
          :value="item.id"
          clearable
        />
      </el-select>
      <el-select
        v-model="listQuery.class_id"
        placeholder="选择分类"
        clearable
        class="filter-item"
        style="width: 120px"
        @keyup.enter.native="search"
      >
        <el-option
          v-for="item in classLists"
          :key="item.ID"
          :label="item.ClassName"
          :value="item.ID"
        />
      </el-select>
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
      <el-table-column label="小说名" min-swidth="200px" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.Title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" min-swidth="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.class_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作者" min-swidth="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="点击量" min-width="120px" align="center">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.Hits }}</span>
        </template>
      </el-table-column>
      <el-table-column label="访问用户数" align="center">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.access_user_count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="阅读用户数" align="center">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.reading_user_count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="付费用户数" align="center">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.paying_user_count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总信息费" align="center">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.all_count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="阅读转化率" align="center">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.reading_conversion }}</span>
        </template>
      </el-table-column>
      <el-table-column label="付费转化率" align="center">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.paying_conversion }}</span>
        </template>
      </el-table-column>
      <el-table-column label="arpu" align="center">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.grup }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { statisticsData, category, statisticsExport } from '@/api/data'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import CountTo from 'vue-count-to'

export default {
  name: 'WebsiteData',
  components: { Pagination, CountTo },
  directives: { waves },
  filters: {},
  data() {
    return {
      countData: {
        Hits: 0,
        order_count: 0,
        paying_user_count: 0,
        reading_user_count: 0
      },
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      classLists: [],
      typeLists: [
        { id: 1, author_name: '书名' },
        { id: 2, author_name: '书号' },
        { id: 3, author_name: '作者' }
      ],
      sourceLists: [
        { id: 1, source_name: '全部' },
        { id: 2, source_name: 'PC端' },
        { id: 4, source_name: 'H5端' }
      ],
      downloadLoading: false,
      ids: []
    }
  },
  created() {
    this.getList()
    this.getCategory()
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
    getCategory() {
      category().then(res => {
        this.classLists = res.data
      })
    },
    getList() {
      this.listLoading = true
      statisticsData(this.listQuery).then(res => {
        if (res.code == 0) {
          this.list = res.data
          this.total = res.count
          this.countData = res.countData
        } else {
          this.list = []
          this.total = 0
          this.countData = {
            Hits: 0,
            order_count: 0,
            paying_user_count: 0,
            reading_user_count: 0
          }
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
      window.location.href = 'http://' + this.$store.getters.domainExport + `/admin/statisticsExport?Title=${this
        .listQuery.Title || ''}&select_type=${this.listQuery.select_type ||
        ''}&class_id=${this.listQuery.class_id || ''}&source=${this.listQuery
        .source || ''}&start_time=${this.listQuery.start_time ||
        ''}&end_time=${this.listQuery.end_time || ''}&ids=${this.ids.join(',')}`
      this.downloadLoading = false
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
