<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.Title"
        placeholder="请输入书名"
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
      <!-- <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="success"
        @click="handleCreate"
        >全局任务</el-button
      > -->
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="warning"
        plain
        @click="toChannelTask"
      >渠道任务</el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="success"
        plain
        @click="handleCreate1"
      >单本任务</el-button>
      <el-button
        v-waves
        class="filter-item"
        type="danger"
        @click="batchRemove"
      >批量删除</el-button>
      <!-- <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
        plain
        >导出</el-button
      > -->
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
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form
            v-for="(item, index) in props.row.book_task"
            :key="index"
            label-position="left"
            inline
            class="demo-table-expand"
          >
            <el-form-item label="渠道名：">
              <span>{{ item.push_name }}</span>
            </el-form-item>
            <el-form-item label="周期：">
              <span>{{ item.time_type | typeFilter }}</span>
            </el-form-item>
            <el-form-item label="时间：">
              <span>{{ item.datetime }}</span>
            </el-form-item>
            <el-form-item label="章数：">
              <span>{{ item.task_num }}</span>
            </el-form-item>
            <el-form-item label="">
              <span
                style="color:#46a6ff;font-size:14px;cursor: pointer;margin-right:10px"
                @click="editChannel(item)"
              ><i class="el-icon-edit" /></span>
              <span
                style="color:#ff4949;font-size:14px;cursor: pointer;"
                @click="delChannel(item.id)"
              ><i class="el-icon-delete" /></span>
            </el-form-item>
          </el-form>
          <!-- <span>{{props}}</span> -->
        </template>
      </el-table-column>

      <el-table-column label="ID" prop="id" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.ID }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="小说名"
        min-swidth="200px"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span class="link-type" @click="toBookDetails(scope.row)">{{
            scope.row.Title
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="章节" min-width="120px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.Chapter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="网易云阅读" align="center">
        <template slot-scope="{ row }">
          <span
            :class="row.API003 == 0 ? 'el-icon-check' : 'el-icon-close'"
          />
        </template>
      </el-table-column>
      <el-table-column label="书海" align="center">
        <template slot-scope="{ row }">
          <span
            :class="row.API011 == 0 ? 'el-icon-check' : 'el-icon-close'"
          />
        </template>
      </el-table-column>
      <el-table-column label="书旗" align="center">
        <template slot-scope="{ row }">
          <span
            :class="row.API012 == 0 ? 'el-icon-check' : 'el-icon-close'"
          />
        </template>
      </el-table-column>
      <el-table-column label="手百" align="center">
        <template slot-scope="{ row }">
          <span
            :class="row.API013 == 0 ? 'el-icon-check' : 'el-icon-close'"
          />
        </template>
      </el-table-column>
      <el-table-column label="点众" align="center">
        <template slot-scope="{ row }">
          <span
            :class="row.API014 == 0 ? 'el-icon-check' : 'el-icon-close'"
          />
        </template>
      </el-table-column>
      <el-table-column label="淘阅" align="center">
        <template slot-scope="{ row }">
          <span
            :class="row.API015 == 0 ? 'el-icon-check' : 'el-icon-close'"
          />
        </template>
      </el-table-column>
      <el-table-column label="悠书阁" align="center">
        <template slot-scope="{ row }">
          <span
            :class="row.API016 == 0 ? 'el-icon-check' : 'el-icon-close'"
          />
        </template>
      </el-table-column>
      <el-table-column label="怡阅" align="center">
        <template slot-scope="{ row }">
          <span
            :class="row.API017 == 0 ? 'el-icon-check' : 'el-icon-close'"
          />
        </template>
      </el-table-column>
      <el-table-column label="掌阅" align="center">
        <template slot-scope="{ row }">
          <span
            :class="row.API018 == 0 ? 'el-icon-check' : 'el-icon-close'"
          />
        </template>
      </el-table-column>
      <el-table-column label="品书" align="center">
        <template slot-scope="{ row }">
          <span
            :class="row.API019 == 0 ? 'el-icon-check' : 'el-icon-close'"
          />
        </template>
      </el-table-column>
      <!-- <el-table-column label="灵游" align="center">
        <template slot-scope="{ row }">
          <span
            :class="row.API020 == 0 ? 'el-icon-check' : 'el-icon-close'"

          ></span>
        </template>
      </el-table-column> -->
      <el-table-column label="鲸鱼阅读" align="center">
        <template slot-scope="{ row }">
          <span
            :class="row.API021 == 0 ? 'el-icon-check' : 'el-icon-close'"
          />
        </template>
      </el-table-column>
      <el-table-column label="嗨小说" align="center">
        <template slot-scope="{ row }">
          <span
            :class="row.API022 == 0 ? 'el-icon-check' : 'el-icon-close'"
          />
        </template>
      </el-table-column>
      <el-table-column label="书香" align="center">
        <template slot-scope="{ row }">
          <span
            :class="row.API023 == 0 ? 'el-icon-check' : 'el-icon-close'"
          />
        </template>
      </el-table-column>
      <el-table-column label="微阅云" align="center">
        <template slot-scope="{ row }">
          <span
            :class="row.API024 == 0 ? 'el-icon-check' : 'el-icon-close'"
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
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <el-dialog
      v-el-drag-dialog
      title="全局任务设置"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        label-position="left"
        label-width="100px"
        style="width: 80%; margin-left:50px;"
      >
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="update"
        >确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-el-drag-dialog
      title="手动任务设置"
      :visible.sync="dialogFormVisible1"
    >
      <el-form
        label-position="left"
        label-width="100px"
        style="width: 80%; margin-left:50px;"
      >
        <el-form-item label="选择小说">
          <el-select
            v-model="form2.book_id"
            placeholder="请选择"
            :filter-method="getBook"
            filterable
            clearable
          >
            <el-option
              v-for="item in bookLists"
              :key="item.ID"
              :label="item.Title"
              :value="item.ID"
              :disabled="dialogStatus == 'update'"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="选择渠道">
          <el-select v-model="form2.push_id" placeholder="请选择">
            <el-option
              v-for="item in channelLists"
              :key="item.ID"
              :label="item.Name"
              :value="item.ID"
              :disabled="dialogStatus == 'update'"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="渠道定时推送" />
        <el-form-item label="选择周期:">
          <el-radio-group v-model="form2.time_type">
            <el-radio :label="0">每天</el-radio>
            <el-radio :label="1">每周</el-radio>
            <el-radio :label="2">每月</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form2.time_type == 1" label="选择日期:">
          <el-select v-model="form2.date" placeholder="请选择">
            <el-option
              v-for="item in weekLists"
              :key="item.id"
              :label="item.week"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form2.time_type == 2" label="选择日期:">
          <el-select v-model="form2.date" placeholder="请选择">
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
            v-model="form2.datetime"
            :picker-options="{
              selectableRange: '00:00:00 - 23:59:59'
            }"
            placeholder="请选择时间"
            format="HH:mm"
            value-format="HH:mm"
          />
        </el-form-item>
        <el-form-item label="选择章数:">
          <el-input v-model="form2.task_num" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="(dialogFormVisible1 = false), (loading = false)"
        >取消</el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="dialogStatus === 'create' ? updateHandle() : editHandle()"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getScheduledTasksData, updateScheduledTasks } from '@/api/website'
import {
  getPushdata,
  doPush,
  channelExport,
  addBookChannelTask,
  getChannelData,
  delBookChannelTask,
  updateBookChannelTask,
  getTaskBookList,
  delBookTask
} from '@/api/channel'
import { category } from '@/api/data'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ChannelLists',
  components: { Pagination },
  directives: { waves },
  filters: {
    typeFilter(type) {
      const typeMap = ['每天', '每周', '每月']
      return typeMap[type]
    }
  },
  data() {
    return {
      channelLists: [],
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
        { id: 1, month: '1号' },
        { id: 2, month: '2号' },
        { id: 3, month: '3号' },
        { id: 4, month: '4号' },
        { id: 5, month: '5号' },
        { id: 6, month: '6号' },
        { id: 7, month: '7号' },
        { id: 8, month: '8号' },
        { id: 9, month: '9号' },
        { id: 10, month: '10号' },
        { id: 11, month: '11号' },
        { id: 12, month: '12号' },
        { id: 13, month: '13号' },
        { id: 14, month: '14号' },
        { id: 15, month: '15号' },
        { id: 16, month: '16号' },
        { id: 17, month: '17号' },
        { id: 18, month: '18号' },
        { id: 19, month: '19号' },
        { id: 20, month: '20号' },
        { id: 21, month: '21号' },
        { id: 22, month: '22号' },
        { id: 23, month: '23号' },
        { id: 24, month: '24号' },
        { id: 25, month: '25号' },
        { id: 26, month: '26号' },
        { id: 27, month: '27号' },
        { id: 28, month: '28号' },
        { id: 29, month: '29号' },
        { id: 30, month: '30号' },
        { id: 31, month: '31号' }
      ],
      loading: false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        is_personal: 1
      },
      classLists: [],
      temp: {},
      dialogFormVisible: false,
      dialogFormVisible1: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      channelMap: {
        update: 'Edit',
        create: 'Create'
      },
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
      downloadLoading: false,
      ids: [],
      form: {},
      form1: {},
      form2: {
        datetime: 0,
        time_type: 1,
        date: 1
      },
      bookLists: [],
      multipleSelection: []
    }
  },
  created() {
    this.getList()
    // this.getCategory();
    this.getTask()
    this.getBook()
  },
  methods: {
    batchRemove() {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const _d = {}
          _d.ids = this.ids
          delBookTask(_d).then(res => {
            if (res.code == 0) {
              this.$notify({
                title: 'Success',
                message: '删除成功',
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
        })
        .catch(() => {
          this.$notify({
            title: 'Info',
            message: '已取消删除',
            type: 'info',
            duration: 1000
          })
        })
    },
    getBook(val) {
      const _d = {}
      _d.title = val
      getTaskBookList(_d).then(res => {
        this.bookLists = res.data
      })
    },
    toChannelTask() {
      this.$router.push('timedTask')
    },
    editChannel(item) {
      this.dialogStatus = 'update'
      this.form2 = item
      this.dialogFormVisible1 = true
    },
    editHandle() {
      this.loading = true
      const _d = Object.assign({}, this.form2)
      updateBookChannelTask(_d).then(res => {
        if (res.code == 0) {
          this.$notify({
            title: 'Success',
            message: '编辑成功',
            type: 'success',
            duration: 1000
          })
          this.dialogFormVisible1 = false
          this.getList()
        } else {
          this.$notify({
            title: 'Error',
            message: res.msg,
            type: 'warning',
            duration: 1000
          })
        }
        this.loading = false
      })
    },
    delChannel(id) {
      const _d = {}
      _d.id = id
      delBookChannelTask(_d).then(res => {
        if (res.code == 0) {
          this.$notify({
            title: 'Success',
            message: '更新成功',
            type: 'success',
            duration: 1000
          })
          this.getList()
        } else {
          this.$notify({
            title: 'Error',
            message: res.msg,
            type: 'warning',
            duration: 1000
          })
        }
      })
    },
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
          this.dialogFormVisible = false
          this.getTask()
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
    updateHandle() {
      this.loading = true
      const _d = Object.assign({}, this.form2)
      addBookChannelTask(_d).then(res => {
        if (res.code == 0) {
          this.$notify({
            title: 'Success',
            message: '更新成功',
            type: 'success',
            duration: 1000
          })
          this.dialogFormVisible1 = false
          this.getList()
        } else {
          this.$notify({
            title: 'Error',
            message: res.msg,
            type: 'warning',
            duration: 1000
          })
        }
        this.loading = false
      })
    },
    handleCreate() {
      this.dialogFormVisible = true
    },
    handleCreate1() {
      this.dialogStatus = 'create'
      this.dialogFormVisible1 = true
    },
    getTask() {
      getScheduledTasksData().then(res => {
        this.form = res.data[0]
        this.form1 = res.data[1]
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      const ids = []
      this.multipleSelection.map(item => {
        ids.push(item.ID)
      })
      this.ids = ids
    },
    // /admin/pushExport
    handleDownload() {
      this.downloadLoading = true
      window.location.href =
        'http://' +
        this.$store.getters.domainExport +
        `/admin/pushExport?Title=${this.listQuery.Title || ''}&ID=${this
          .listQuery.ID || ''}&class_id=${this.listQuery.class_id ||
          ''}&ids=${this.ids.join(',')}`
      this.downloadLoading = false
    },
    getCategory() {
      category().then(res => {
        this.classLists = res.data
      })
    },
    toBook() {
      this.$router.push('bookLists')
    },
    toBookDetails(row) {
      window.open(
        'http://www.ziycw.com' + `/#/BookDetails?bookId=${row.ID}`,
        '_blank'
      )
    },
    // push(row, API) {
    //   this.listLoading = true;
    //   let _d = {};
    //   _d.book_id = row.ID;
    //   _d.field = API;
    //   if (API == "API003") {
    //     _d.grab = 1;
    //   } else {
    //     _d.grab = 0;
    //   }
    //   doPush(_d).then(res => {
    //     if (res.code == 0) {
    //       this.$notify({
    //         title: "Success",
    //         message: res.msg,
    //         type: "success",
    //         duration: 1000
    //       });
    //     } else {
    //       this.$notify({
    //         title: "Error",
    //         message: res.msg,
    //         type: "warning",
    //         duration: 1000
    //       });
    //     }
    //     this.listLoading = false;
    //     this.getList();
    //   });
    // },
    toChapterPush(row) {
      this.$router.push({
        path: 'chapterPushLists?id=' + row.ID
      })
    },
    getList() {
      this.listLoading = true
      getPushdata(this.listQuery).then(res => {
        if (res.code == 0) {
          this.list = res.data
          this.total = res.count
        } else {
          this.list = []
          this.total = 0
        }

        this.listLoading = false
      })
      getChannelData(this.listQuery).then(res => {
        if (res.code == 0) {
          this.channelLists = res.data
        } else {
          this.channelLists = []
        }
      })
    },
    search() {
      this.listQuery.page = 1
      this.getList()
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
  font-size: 18px;
  // cursor: pointer;
}
.el-icon-check {
  color: rgb(82, 168, 82);
  font-size: 18px;
  // cursor: pointer;
}
.demo-table-expand {
  font-size: 14px;
  border-bottom: 1px solid #eee;
  padding: 2px 20px;
}
.demo-table-expand:last-child {
  border-bottom: none;
}
.el-table__expanded-cell[class*="cell"] {
  padding: 0px 0px;
}
.demo-table-expand label {
  width: 100px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item__content {
  width: 140px;
}
.demo-table-expand .el-form-item__label {
  font-size: 12px;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
}
</style>
