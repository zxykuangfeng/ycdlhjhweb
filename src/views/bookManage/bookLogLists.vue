<template>
  <div class="app-container">
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      />
      <el-table-column
        label="ID"
        prop="id"
        align="center"
        width="80"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="错误信息" min-swidth="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.msg }}</span>
        </template>
      </el-table-column>
      <el-table-column label="行号" min-swidth="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.line }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" min-width="120px" align="center">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.create_time }}</span>
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
import { getAuditLog } from '@/api/book'
import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'LogLists',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
    // typeFilter(type) {
    //   return calendarTypeKeyValue[type]
    // }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    toSort() {
      this.$router.push('sortLists')
    },
    toTag() {
      this.$router.push('tagLists')
    },
    getList() {
      this.listLoading = true
      getAuditLog(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.count

        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
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
</style>
