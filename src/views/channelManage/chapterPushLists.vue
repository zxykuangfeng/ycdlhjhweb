<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input
        v-model="listQuery.title"
        placeholder="请输入书名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="search"
      />
      <el-input
        v-model="listQuery.title"
        placeholder="请输入ID"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="search"
      /> -->
      <!-- <el-select
        v-model="listQuery.type"
        placeholder="请选择分类"
        clearable
        class="filter-item"
        style="width: 200px"
      >
        <el-option
          v-for="item in classLists"
          :key="item.id"
          :label="item.display_name"
          :value="item.id"
        />
      </el-select> -->
      <!-- <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="search">搜索</el-button> -->
      <!-- <el-button
        v-waves
        class="filter-item"
        type="danger"
        icon="el-icon-delete"
        @click="batchRemove"
      >批量删除</el-button> -->
      <!-- <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
        plain
      >导出</el-button> -->
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
          <span class="link-type">{{ scope.row.book_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="章节名" min-width="120px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.Title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="网易云阅读" align="center">
        <template slot-scope="{ row }">
          <span
            :class="row.API003 == 0 ? 'el-icon-check' : 'el-icon-close'"
            @click="push(row, 'API003')"
          />
        </template>
      </el-table-column>
      <el-table-column label="书海" align="center">
        <template slot-scope="{ row }">
          <span
            :class="row.API011 == 0 ? 'el-icon-check' : 'el-icon-close'"
            @click="push(row, 'API011')"
          />
        </template>
      </el-table-column>
      <el-table-column label="书旗" align="center">
        <template slot-scope="{ row }">
          <span
            :class="row.API012 == 0 ? 'el-icon-check' : 'el-icon-close'"
            @click="push(row, 'API012')"
          />
        </template>
      </el-table-column>
      <el-table-column label="手百" align="center">
        <template slot-scope="{ row }">
          <span
            :class="row.API013 == 0 ? 'el-icon-check' : 'el-icon-close'"
            @click="push(row, 'API013')"
          />
        </template>
      </el-table-column>
      <el-table-column label="点众" align="center">
        <template slot-scope="{ row }">
          <span
            :class="row.API014 == 0 ? 'el-icon-check' : 'el-icon-close'"
            @click="push(row, 'API014')"
          />
        </template>
      </el-table-column>
      <el-table-column label="淘阅" align="center">
        <template slot-scope="{ row }">
          <span
            :class="row.API015 == 0 ? 'el-icon-check' : 'el-icon-close'"
            @click="push(row, 'API015')"
          />
        </template>
      </el-table-column>
      <el-table-column label="悠书阁" align="center">
        <template slot-scope="{ row }">
          <span
            :class="row.API016 == 0 ? 'el-icon-check' : 'el-icon-close'"
            @click="push(row, 'API016')"
          />
        </template>
      </el-table-column>
      <el-table-column label="怡阅" align="center">
        <template slot-scope="{ row }">
          <span
            :class="row.API017 == 0 ? 'el-icon-check' : 'el-icon-close'"
            @click="push(row, 'API017')"
          />
        </template>
      </el-table-column>
      <el-table-column label="掌阅" align="center">
        <template slot-scope="{ row }">
          <span
            :class="row.API018 == 0 ? 'el-icon-check' : 'el-icon-close'"
            @click="push(row, 'API018')"
          />
        </template>
      </el-table-column>
      <el-table-column label="品书" align="center">
        <template slot-scope="{ row }">
          <span
            :class="row.API019 == 0 ? 'el-icon-check' : 'el-icon-close'"
            @click="push(row, 'API019')"
          />
        </template>
      </el-table-column>
      <!-- <el-table-column label="灵游" align="center">
        <template slot-scope="{ row }">
          <span
            :class="row.API020 == 0 ? 'el-icon-check' : 'el-icon-close'"
            @click="push(row, 'API020')"
          ></span>
        </template>
      </el-table-column> -->
      <el-table-column label="鲸鱼阅读" align="center">
        <template slot-scope="{ row }">
          <span
            :class="row.API021 == 0 ? 'el-icon-check' : 'el-icon-close'"
            @click="push(row, 'API021')"
          />
        </template>
      </el-table-column>
      <el-table-column label="嗨小说" align="center">
        <template slot-scope="{ row }">
          <span
            :class="row.API022 == 0 ? 'el-icon-check' : 'el-icon-close'"
            @click="push(row, 'API022')"
          />
        </template>
      </el-table-column>
      <el-table-column label="书香" align="center">
        <template slot-scope="{ row }">
          <span
            :class="row.API023 == 0 ? 'el-icon-check' : 'el-icon-close'"
            @click="push(row, 'API023')"
          />
        </template>
      </el-table-column>
      <el-table-column label="微阅云" align="center">
        <template slot-scope="{ row }">
          <span
            :class="row.API024 == 0 ? 'el-icon-check' : 'el-icon-close'"
            @click="push(row, 'API024')"
          />
        </template>
      </el-table-column>
      <el-table-column label="宜搜" align="center">
        <template slot-scope="{ row }">
          <span
            :class="row.API025 == 0 ? 'el-icon-check' : 'el-icon-close'"
            @click="push(row, 'API025')"
          />
        </template>
      </el-table-column>
      <el-table-column label="厦门1819" align="center">
        <template slot-scope="{ row }">
          <span
            :class="row.API001 == 0 ? 'el-icon-check' : 'el-icon-close'"
            @click="push(row, 'API001')"
          />
        </template>
      </el-table-column>
      <el-table-column label="立音" align="center">
        <template slot-scope="{ row }">
          <span
            :class="row.API008 == 0 ? 'el-icon-check' : 'el-icon-close'"
            @click="push(row, 'API008')"
          />
        </template>
      </el-table-column>
      <el-table-column label="陕西数字" align="center">
        <template slot-scope="{ row }">
          <span
            :class="row.API009 == 0 ? 'el-icon-check' : 'el-icon-close'"
            @click="push(row, 'API009')"
          />
        </template>
      </el-table-column>
      <el-table-column label="南泽" align="center">
        <template slot-scope="{ row }">
          <span
            :class="row.API026 == 0 ? 'el-icon-check' : 'el-icon-close'"
            @click="push(row, 'API026')"
          />
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
import { pushchapterdata, dopushchapter } from '@/api/channel'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ChapterPushLists',
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
      },
      classLists: [],
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [
          { required: true, message: 'type is required', trigger: 'change' }
        ],
        timestamp: [
          {
            type: 'date',
            required: true,
            message: 'timestamp is required',
            trigger: 'change'
          }
        ],
        title: [
          { required: true, message: 'title is required', trigger: 'blur' }
        ]
      },
      downloadLoading: false
    }
  },
  created() {
    this.listQuery.id = this.$route.query.id
    this.getList()
  },
  methods: {
    push(row, API) {
      const _d = {}
      _d.chapter_id = row.ID
      _d.field = API
      if (API == 'API003') {
        _d.grab = 1
      } else {
        _d.grab = 0
      }
      dopushchapter(_d).then(res => {
        if (res.code == 0) {
          this.$notify({
            title: 'Success',
            message: '推送成功',
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
        this.getList()
      })
    },
    getList() {
      this.listLoading = true
      pushchapterdata(this.listQuery).then(res => {
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
    }
  }
}
</script>
<style lang="scss">
.el-icon-close {
  color: rgb(221, 74, 74);
  cursor: pointer;
}
.el-icon-check {
  color: rgb(82, 168, 82);
  cursor: pointer;
}
</style>
