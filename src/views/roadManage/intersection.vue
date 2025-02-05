<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="请输入路口名称"
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
      <el-table-column label="ID" prop="id" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="路口名称" min-width="100px" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="link-type" @click="toCrossingDetails(scope.row)">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="安全评分" prop="score" align="center" min-width="120px">
        <template slot-scope="{ row }">
          <span :class="getScoreClass(row.score)">{{ row.score }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属区域" prop="aid" align="center" min-width="120px" />
      <el-table-column label="所属主道路" prop="mid" align="center" min-width="120px" />
      <el-table-column label="点位经纬度" prop="point" align="center" min-width="150px" />
      <el-table-column label="负责单位" prop="cid" align="center" min-width="120px" />
      <el-table-column label="创建时间" prop="create_time" align="center" min-width="150px" />
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" class="super-mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button size="mini" type="danger" class="super-mini" @click="toDel(row)">删除</el-button>
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
      ref="crossingDialog"
      v-el-drag-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      class="road-crossing-dialog"
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
            <el-form-item label="路口名称:" prop="name">
              <el-input v-model="temp.name" />
            </el-form-item>
            <el-form-item label="所属区域:" prop="aid">
              <el-select v-model="temp.aid" placeholder="请选择所属区域">
                <el-option
                  v-for="area in areas"
                  :key="area.id"
                  :label="area.name"
                  :value="area.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="所属主道路:" prop="mid">
              <el-select v-model="temp.mid" placeholder="请选择所属主道路">
                <el-option
                  v-for="road in roads"
                  :key="road.id"
                  :label="road.name"
                  :value="road.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="选择点位:" prop="mapPoint">
              <el-button type="primary" @click="openMapDialog">选择点位</el-button>
            </el-form-item>
            <el-form-item label="点位经纬度:" prop="point">
              <el-input v-model="temp.point" readonly />
            </el-form-item>
            <el-form-item label="负责单位:" prop="cid">
              <el-select v-model="temp.cid" placeholder="请选择负责单位">
                <el-option label="交警支队" :value="0" />
                <el-option label="其他" :value="1" />
              </el-select>
            </el-form-item>

          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          :loading="loading"
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >确认</el-button>
      </div>
    </el-dialog>

    <!-- 百度地图弹窗 -->
    <el-dialog
      title="选择点位"
      :visible.sync="mapDialogVisible"
      width="80%"
      @opened="initMap"
    >
      <div id="baiduMap" style="width: 100%; height: 400px;"></div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="mapDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmMapPoint">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoadCrossingList,
  addRoadCrossing,
  updateRoadCrossing,
  deleteRoadCrossing,
  getRoadCrossingDetail,
  getTownList,
  getRoadList
} from '@/api/road';
import waves from '@/directive/waves';
import Pagination from '@/components/Pagination';
import moment from 'moment';

export default {
  name: 'RoadCrossingManagement',
  components: { Pagination },
  directives: { waves },
  filters: {
    timeFilter(time) {
      return moment(time * 1000).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      tableKey: 0,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: ''
      },
      temp: {
        name: '',
        aid: null,
        mid: null,
        point: '',
        cid: null
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑路口',
        create: '新增路口'
      },
      rules: {
        name: [{ required: true, message: '请输入路口名称', trigger: 'blur' }],
        aid: [{ required: true, message: '请选择所属区域', trigger: 'change' }],
        mid: [{ required: true, message: '请选择所属主道路', trigger: 'change' }],
        point: [{ required: true, message: '请选择点位', trigger: 'blur' }],
        cid: [{ required: true, message: '请选择负责单位', trigger: 'change' }]
      },
      ids: [],
      areas: [],
      roads: [],
      mapDialogVisible: false,
      map: null,
      pointMarker: null
    };
  },
  created() {
    this.getList();
    this.fetchAreasAndRoads();
  },
  methods: {
    handleOpened() {
      this.$refs.crossingDialog.$el.scrollTop = 0;
    },
    async fetchAreasAndRoads() {
      try {
        const townResponse = await getTownList();
        if (townResponse.code === 0) {
          this.areas = townResponse.data.data;
        } else {
          this.$notify({ title: 'Error', message: townResponse.msg, type: 'warning' });
        }

        const roadResponse = await getRoadList();
        if (roadResponse.code === 0) {
          this.roads = roadResponse.data.data;
        } else {
          this.$notify({ title: 'Error', message: roadResponse.msg, type: 'warning' });
        }
      } catch (error) {
        this.$notify({ title: 'Error', message: '请求数据失败', type: 'error' });
      }
    },
    openMapDialog() {
      this.mapDialogVisible = true;
    },
    initMap() {
  if (!this.map) {
    this.map = new BMap.Map("baiduMap"); // 初始化地图
     this.map.centerAndZoom(new BMap.Point(120.15, 33.38), 16);
    this.map.enableScrollWheelZoom(true); // 启用滚轮缩放功能

    // 添加点击事件监听器
    this.map.addEventListener("click", e => {
      const lng = e.point.lng.toFixed(5); // 保留5位小数
      const lat = e.point.lat.toFixed(5); // 保留5位小数
      this.temp.point = `${lng}, ${lat}`; // 设置选中的点位

      // 清除之前的标记
      if (this.pointMarker) {
        this.map.removeOverlay(this.pointMarker);
      }

      // 添加新的标记
      this.pointMarker = new BMap.Marker(new BMap.Point(lng, lat));
      this.map.addOverlay(this.pointMarker);

      // 提示用户点位已选择
      this.$notify({
        title: '点位设置',
        message: `已选择点位: ${lng}, ${lat}`,
        type: 'success'
      });
    });
  }
},
    confirmMapPoint() {
      this.mapDialogVisible = false;
    },
    toCrossingDetails(row) {
      getRoadCrossingDetail(row.id).then(res => {
        if (res.code === 0) {
          this.$notify({
            title: 'Success',
            message: '获取详情成功',
            type: 'success',
            duration: 1000
          });
        } else {
          this.$notify({
            title: 'Error',
            message: res.msg,
            type: 'warning',
            duration: 1000
          });
        }
      });
    },
    handleSelectionChange(val) {
      this.ids = val.map(item => item.id);
    },
    batchRemove() {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRoadCrossing(this.ids).then(res => {
          if (res.code === 0) {
            this.$notify({
              title: 'Success',
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
            this.getList();
          } else {
            this.$notify({
              title: 'Error',
              message: res.msg,
              type: 'warning'
            });
          }
        });
      }).catch(() => {
        this.$notify({
          title: 'Info',
          message: '已取消删除',
          type: 'info'
        });
      });
    },
    toDel(item) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRoadCrossing(item.id).then(res => {
          if (res.code === 0) {
            this.$notify({
              title: 'Success',
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
            this.getList();
          } else {
            this.$notify({
              title: 'Error',
              message: res.msg,
              type: 'warning'
            });
          }
        });
      }).catch(() => {
        this.$notify({
          title: 'Info',
          message: '已取消删除',
          type: 'info'
        });
      });
    },
    getList() {
      this.listLoading = true;
      getRoadCrossingList(this.listQuery).then(res => {
        if (res.code === 0) {
          this.list = res.data.data;
          this.total = res.data.total;
        } else {
          this.list = [];
          this.total = 0;
        }
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    resetTemp() {
      this.temp = { name: '', aid: null, mid: null, point: '', cid: null };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.loading = true;
          addRoadCrossing(this.temp).then(res => {
            if (res.code === 0) {
              this.$notify({
                title: 'Success',
                message: '新增成功',
                type: 'success',
                duration: 1000
              });
              this.dialogFormVisible = false;
              this.getList();
            } else {
              this.$notify({
                title: 'Error',
                message: res.msg,
                type: 'warning'
              });
            }
            this.loading = false;
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = { ...row };
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
          this.loading = true;
          updateRoadCrossing(this.temp).then(res => {
            if (res.code === 0) {
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
    }
  }
};
</script>

<style lang="scss">
.el-icon-close {
  color: rgb(221, 74, 74);
}
.el-icon-check {
  color: rgb(82, 168, 82);
}
.road-crossing-dialog .el-dialog {
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
</style>
