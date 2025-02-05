<template>
  <div class="app-container">
    <!--    TODO 后端部分待处理-->
    <el-button
      v-waves
      :loading="downloadLoading"
      class="filter-item fright"
      type="primary"
      icon="el-icon-download"
      plain
      style="margin-bottom: 20px"
      @click="handleDownload"
    >导出数据</el-button>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" prop="id" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.ID }}</span>
        </template>
      </el-table-column>
      <el-table-column label="小说名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作者" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Penname }}</span>
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
import { getChannelBook } from '@/api/channel'
import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Channeltask',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const StatusMap = ['未处理', '已处理']
      return StatusMap[status]
    }
  },
  data() {
    return {
      dialogFormVisible1: false,
      loading: false,
      multipleSelection: [],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        field: ''
      },
      dialogFormVisible: false,
      url: '',
      fileList: [],
      temp1: {
        fileList: []
      },
      hasErr: false,
      listdata: [],
      push_id: '',
      downloadLoading: false
    }
  },
  created() {
    this.listQuery.field = this.$route.query.field
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getChannelBook(this.listQuery).then(res => {
        if (res.code === 0) {
          this.list = res.data
          this.total = res.count
        } else {
          this.list = []
          this.total = 0
        }

        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      window.location.href =
        'http://' +
        this.$store.getters.domainExport +
        `/admin/exportChannelData?field=${this.listQuery.field}`
      this.downloadLoading = false
    }
  }
}
</script>
<style lang="scss">
.task-dialog .el-dialog {
  width: 80% !important;
}

.task-dialog .el-dialog__body {
  padding-top: 20px !important;
}

.guide {
  color: #304156;
  padding-left: 20px;
  margin-bottom: 20px;

  h4 {
    font-size: 18px;
  }

  p {
    font-size: 16px;
    padding-left: 20px;
  }

  .exp {
    font-size: 14px;
    color: #376daf;
    padding-left: 20px;
  }
}
</style>
