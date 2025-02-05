<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.book_name"
        placeholder="请输入小说名"
        style="width: 200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
      <!-- <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="allAudit"
        disabled
        >全站审核</el-button
      > -->
    </div>

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
      <el-table-column label="ID" prop="id" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.ID }}</span>
        </template>
      </el-table-column>
      <el-table-column label="小说名" min-swidth="200px" align="center">
        <template slot-scope="scope">
          <span class="link-type" @click="toLists(scope.row)">{{
            scope.row.book_name
          }}</span>
        </template>
      </el-table-column>

      <el-table-column label="新增时间" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.Ptime }}</span>
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
import { getChapterAll, toAuditChapter } from '@/api/book'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {},
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    allAudit() {
      const _d = {}
      _d.type = 'all'
      toAuditChapter(_d).then(res => {
        if (res.code == 0) {
          this.$notify({
            title: 'Success',
            message: '审核成功',
            type: 'success',
            duration: 1000
          })
        } else {
          this.$notify({
            title: 'Error',
            message: res.msg,
            type: 'warning',
            duration: 2000
          })
          return
        }
        this.getList()
      })
    },
    toLists(row) {
      const query = {}
      query.id = row.Bookid
      query.Columnx = row.book.Columnx
      query.bookName = row.book_name
      this.$router.push({
        path: 'chapterAuditLists',
        query
      })
    },
    getList() {
      this.listLoading = true
      getChapterAll(this.listQuery).then(res => {
        if (res.code == 0) {
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
