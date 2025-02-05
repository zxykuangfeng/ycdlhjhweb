<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.Penname"
        placeholder="请输入作者名"
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
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="search"
      >搜索</el-button>
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
      <el-table-column label="作者笔名" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Penname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作者实名" min-width="200px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.Truename }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作品数量" min-width="100" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.book_count }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        min-width="80"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            size="small"
            type="primary"
            @click="toDetails(row)"
          >查看收益</el-button>
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
import {
  getAuthor,
  updateAuthor,
  addAuthorAudit,
  authordel
} from '@/api/author'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'AuthorLists',
  components: { Pagination },
  directives: { waves },
  filters: {
    SignedFilter(Signed) {
      const SignedMap = ['未签约', '已签约']
      return SignedMap[Signed]
    }
  },
  data() {
    return {
      loading: false,
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
    getList() {
      this.listLoading = true
      getAuthor(this.listQuery).then(res => {
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
    search() {
      this.listQuery.page = 1
      this.getList()
    },
    toDetails(row) {
      const query = {}
      query.id = row.Uid
      this.$router.push({
        path: 'earningsDetails',
        query
      })
    }
  }
}
</script>
