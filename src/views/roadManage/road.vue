<template>
  <div class="app-container">
    <!-- Filter and Action Buttons -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="请输入道路名称"
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
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >新增</el-button>
      <el-button
        v-waves
        class="filter-item"
        type="danger"
        icon="el-icon-delete"
        @click="batchRemove"
      >批量删除</el-button>
    </div>

    <!-- Road List Table -->
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
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" prop="id" align="center" width="80" />
      <el-table-column label="道路名称" prop="name" align="center" min-width="120" />
      <el-table-column
        label="道路类型"
        min-width="120px"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          <span>{{ roadTypeMap[row.type] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="道路宽度 (米)" prop="width" align="center" min-width="100" />
      <el-table-column label="道路形状" prop="shape_name" align="center" min-width="120" />
      <el-table-column label="通行方向" prop="direction_name" align="center" min-width="120" />
      <el-table-column label="通行状态" prop="status_name" align="center" min-width="120" />
      <el-table-column label="限速 (km/h)" prop="speed_limit" align="center" min-width="100" />
      <el-table-column label="是否有非机动车道" prop="has_bike_lane_name" align="center" min-width="120" />
      <el-table-column label="是否有人行道" prop="has_sidewalk_name" align="center" min-width="120" />
      <el-table-column
        label="操作"
        align="center"
        width="300"
        class-name="small-padding fixed-width"
      >
        <template #default="{ row }">
          <el-button size="mini" type="info" @click="viewFacilities(row)">关联设施</el-button>
          <el-button size="mini" type="primary" @click="handleUpdate(row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="toDel(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
  title="关联设施统计"
  :visible.sync="facilitiesDialogVisible"
  width="50%"
  class="custom-dialog"
  @close="closeFacilitiesDialog"
>
<el-table
  :data="facilityList"
  border
  stripe
  style="width: 100%;"
>
  <!-- 类型列 -->
  <el-table-column
    label="设施类型"
    align="left"
    min-width="150"
  >
    <template #default="{ row }">
      <span
        v-if="!row.isSubCategory"
        style="font-weight: bold; color: #333;"
      >
        {{ row.type }}
      </span>
      <span
        v-else
        style="margin-left: 20px; color: #666;"
      >
        {{ row.type }}
      </span>
    </template>
  </el-table-column>

  <!-- 数量列 -->
  <el-table-column
    label="数量"
    align="center"
    width="100"
    prop="count"
  >
    <template #default="{ row }">
      <span>{{ row.count }}</span>
    </template>
  </el-table-column>
</el-table>

  <div slot="footer" class="dialog-footer">
    <el-button @click="facilitiesDialogVisible = false">关闭</el-button>
  </div>
</el-dialog>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!-- Road Dialog -->
    <el-dialog
      ref="roadDialog"
      v-el-drag-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      class="road-lists-dialog"
      @opened="handleOpened"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 90%; margin-left:50px;"
      >
        <el-row :gutter="40">
          <el-col :xs="7" :sm="7" :lg="7">
            <el-form-item label="道路名称" prop="name">
              <el-input v-model="temp.name" />
            </el-form-item>
            <el-form-item label="道路类型:" prop="type">
              <el-select v-model="temp.type" placeholder="请选择道路类型">
                <el-option
                  v-for="item in roadTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="Number(item.value)" 
                />
              </el-select>
            </el-form-item>
            <el-form-item label="道路长度km" prop="length">
              <el-input v-model="temp.length" type="number" min="0" />
            </el-form-item>
            <el-form-item label="道路宽度 (米)" prop="width">
              <el-input v-model="temp.width" type="number" min="0" />
            </el-form-item>
            <el-form-item label="道路形状" prop="shape">
              <el-select v-model="temp.shape" placeholder="请选择道路形状">
                <el-option label="直线" :value="0" />
                <el-option label="曲线" :value="1" />
                <el-option label="环形" :value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="通行方向" prop="direction">
              <el-select v-model="temp.direction" placeholder="请选择通行方向">
                <el-option label="单向" :value="0" />
                <el-option label="双向" :value="1"/>
                <el-option label="环形" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="7" :sm="7" :lg="7">
            <el-form-item label="通行状态" prop="status">
              <el-select v-model="temp.status" placeholder="请选择通行状态">
                <el-option label="正常" :value="0" />
                <el-option label="封闭" :value="1"/>
                <el-option label="限行" :value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="限速 (km/h)" prop="speed_limit">
              <el-input v-model="temp.speed_limit" type="number" min="0" />
            </el-form-item>
            <el-form-item label="是否有非机动车道" prop="has_bike_lane">
              <el-switch v-model="temp.has_bike_lane" />
            </el-form-item>
            <el-form-item label="是否有人行道" prop="has_sidewalk">
              <el-switch v-model="temp.has_sidewalk" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoadList,
  addRoad,
  updateRoad,
  deleteRoad,
  getRoadDetail,
  getFacilityCount
} from '@/api/road'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import moment from 'moment'
export default {
  name: 'RoadManagement',
  components: { Pagination },
  directives: { waves },
  filters: {
    timeFilter(time) {
      var timeFilter =  time * 1000
      return moment(timeFilter).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  data() {
    return {
      listdata: [],
      loading: false,
      isDisabled: false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: ''
      },
      temp: {
        name: "",
        width: null,
        length:0,
        shape: "",
        direction: "",
        status: "",
        speed_limit: null,
        has_bike_lane: false,
        has_sidewalk: false,
      },
      rules: {
        name: [{ required: true, message: "请输入道路名称", trigger: "blur" }],
        width: [
          { required: true, message: "请输入道路宽度", trigger: "blur" }
        ],
        shape: [{ required: true, message: "请选择道路形状", trigger: "change" }],
        direction: [{ required: true, message: "请选择通行方向", trigger: "change" }],
        status: [{ required: true, message: "请选择通行状态", trigger: "change" }],
        speed_limit: [
          { required: true, message: "请输入限速", trigger: "blur" }
        ],
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑道路',
        create: '新增道路'
      },
      downloadLoading: false,
      ids: [],
      roadTypes: [
        { value: 1, label: '城市主干道' },
        { value: 2, label: '城市次干道' },
        { value: 3, label: '县乡村道路' },
        { value: 4, label: '无名路' },
        { value: 5, label: '高速道路' },
        { value: 6, label: '国省道路' }
      ],
      roadTypeMap: {
        1: '城市主干道',
        2: '城市次干道',
        3: '县乡村道路',
        4: '无名路',
        5: '高速道路',
        6: '国省道路'
      },
      facilitiesDialogVisible: false,
    facilityList: [
      { type: "交通标志", count: 45, isSubCategory: false },
      { type: "警告标志", count: 10, isSubCategory: true },
      { type: "禁令标志", count: 12, isSubCategory: true },
      { type: "指示标志", count: 8, isSubCategory: true },
      { type: "指路标志", count: 6, isSubCategory: true },
      { type: "旅游区标志", count: 5, isSubCategory: true },
      { type: "道路施工安全标志", count: 4, isSubCategory: true },
      { type: "路面标线", count: 20, isSubCategory: false },
      { type: "减速带", count: 5, isSubCategory: true },
      { type: "斑马线", count: 10, isSubCategory: true },
      { type: "人行横道", count: 5, isSubCategory: true },
      { type: "护栏", count: 8, isSubCategory: false },
      { type: "避让学生标牌", count: 5, isSubCategory: false },
      { type: "急弯识别标牌", count: 3, isSubCategory: false },
      { type: "临水路段标识", count: 7, isSubCategory: false },
    ],
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleOpened() {
      this.$refs.roadDialog.$el.scrollTop = 0
    },
    toRoadDetails(row) {
      getRoadDetail(row.id).then(res => {
        if (res.code == 0) {
          this.$notify({
            title: 'Success',
            message: '获取详情成功',
            type: 'success',
            duration: 1000
          })
          // 这里可以根据需要展示详情信息
          console.log(res.data)
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
    handleSelectionChange(val) {
      this.multipleSelection = val
      const ids = []
      this.multipleSelection.map(item => {
        ids.push(item.id)
      })
      this.ids = ids
    },
    batchRemove() {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const _d = {}
          _d.ids = this.ids
          deleteRoad(_d).then(res => {
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
    toDel(item) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // alert(item.id)
          deleteRoad(item.id).then(res => {
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
    viewFacilities(row) {
  // 调用接口，传入道路ID
  getFacilityCount(row.id).then((res) => {
    if (res.code === 0) {
      const rawData = res.data; // 接口返回的数据
      console.log('rawData',rawData)
      // 格式化数据，处理父级和子级数据
      const formattedData = [];
      rawData.forEach((item) => {
        // 添加父级
        formattedData.push({
          type: item.name,
          count: item.count,
          isSubCategory: false,
        });

        // 添加子级
        if (item.child && item.child.length > 0) {
          item.child.forEach((child) => {
            formattedData.push({
              type: child.name,
              count: child.count,
              isSubCategory: true,
            });
          });
        }
      });

      this.facilityList = formattedData;
      this.facilitiesDialogVisible = true; // 打开弹窗
    } else {
      this.$notify({
        title: "Error",
        message: res.msg || "获取设施数据失败",
        type: "warning",
      });
    }
  }).catch((error) => {
    console.error("获取设施数据失败：", error);
    this.$notify({
      title: "Error",
      message: "请求失败，请稍后重试",
      type: "error",
    });
  });
},

    closeFacilitiesDialog() {
      this.facilitiesDialogVisible = false;
    },
    getList() {
      this.listLoading = true
      getRoadList(this.listQuery).then(res => {
        if (res.code == 0) {
          this.list = res.data.data
          this.total = res.data.total
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
    resetTemp() {
      this.temp = {
        name: '',
        type: null
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.loading = true

          const payload = {
        ...this.temp,
        has_bike_lane: this.temp.has_bike_lane ? 1 : 0,
        has_sidewalk: this.temp.has_sidewalk ? 1 : 0,
      };
          addRoad(payload).then(res => {
            if (res.code == 0) {
              this.$notify({
                title: 'Success',
                message: '新增成功',
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
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleUpdate(row) {
  this.temp = Object.assign({}, row, {
    has_bike_lane: Boolean(row.has_bike_lane),
    has_sidewalk: Boolean(row.has_sidewalk),
  });

  console.log('temp', this.temp);
  this.dialogStatus = 'update';
  this.dialogFormVisible = true;
  this.$nextTick(() => {
    this.$refs['dataForm'].clearValidate();
  });
},
    getScoreClass(score) {
      if (score >= 90) return 'score-high';
      if (score >= 70) return 'score-medium';
      return 'score-low';
    },
    updateData() {
  this.$refs['dataForm'].validate(valid => {
    if (valid) {
      const payload = {
        ...this.temp,
        has_bike_lane: this.temp.has_bike_lane ? 1 : 0,
        has_sidewalk: this.temp.has_sidewalk ? 1 : 0,
      };
      this.loading = true;
      updateRoad(payload).then(res => {
        if (res.code == 0) {
          this.$notify({
            title: 'Success',
            message: '编辑成功',
            type: 'success',
            duration: 1000
          });
          this.dialogFormVisible = false;
          this.getList();
        } else {
          this.$notify({
            title: 'Error',
            message: res.message,
            type: 'warning'
          });
        }
        this.loading = false;
      });
    }
  });
},
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
.road-lists-dialog .el-dialog {
  width: 80% !important;
  margin-top: 10vh !important;
}
.el-col {
  border-left: 1px solid #eee;
  &:nth-of-type(1) {
    border-left: none;
  }
}
.super-mini {
  padding: 4px 0px !important;
  width: 40px !important;
}
</style>
<style scoped>
.score-high {
  color: green;
  font-weight: bold;
}
.score-medium {
  color: orange;
  font-weight: bold;
}
.score-low {
  color: red;
  font-weight: bold;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding: 10px 20px;
  background-color: #f3f6fb;
  border-top: 1px solid #ebeef5;
}

.el-dialog {
  border-radius: 8px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
}

.el-dialog__header {
  font-size: 18px;
  font-weight: bold;
  background-color: #f3f6fb;
  border-bottom: 1px solid #ebeef5;
}

.el-table {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.el-table th {
  background-color: #f5f7fa;
  font-weight: bold;
  color: #333;
}

.el-table td {
  font-size: 14px;
  color: #555;
}

.el-table td:first-of-type {
  padding-left: 20px;
}

.el-table .el-table__row {
  &:nth-of-type(odd) {
    background-color: #f9f9f9;
  }
}

.el-table td span {
  display: inline-block;
  line-height: 22px;
}

.el-table td span[style*="margin-left: 20px"] {
  margin-left: 30px;
  font-size: 13px;
  color: #666;
}


</style>
<style>
.el-dialog {
  margin-top: 3vh!important; /* 将弹窗距离页面顶部调整为 5vh */
}
</style>