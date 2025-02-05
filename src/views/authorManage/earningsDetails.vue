<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="{ row }">
          <span>{{ row.ID }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="小说名称">
        <template slot-scope="{ row }">
          <span>{{ row.Title }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="阅读收益">
        <template slot-scope="{ row }">
          <span class="link-type" @click="toWE(row)">{{ row.Profit }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="打赏收益">
        <template slot-scope="{ row }">
          <span class="link-type" @click="toRE(row)">{{ row.Reward }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="第三方收益">
        <template slot-scope="{ row }">
          <span class="link-type" @click="toOE(row)">{{
            row.third_party_profit
          }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="总计">
        <template slot-scope="{ row }">
          <span>{{ row.all_profit }}</span>
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
import { getAuthorBookData } from '@/api/author'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'InlineEditTable',
  filters: {},
  components: { Pagination },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        userId: ''
      }
    }
  },
  created() {
    const id = this.$route.query.id
    this.listQuery.userId = id
    this.getList()
  },
  methods: {
    toRE(row) {
      const query = {}
      query.id = row.ID
      this.$router.push({
        path: 'rewardEarnings',
        query
      })
    },
    toWE(row) {
      const query = {}
      query.id = row.ID
      this.$router.push({
        path: 'websiteEarnings',
        query
      })
    },
    toOE(row) {
      const query = {}
      query.id = row.ID
      this.$router.push({
        path: 'otherEarnings',
        query
      })
    },
    getList() {
      this.listLoading = true
      getAuthorBookData(this.listQuery).then(res => {
        if (res.code == 0) {
          this.list = res.data
          this.total = res.count
        } else {
          this.list = []
          this.total = 0
        }
        this.listLoading = false
      })
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
