<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.yhcj" placeholder="隐患场景" class="filter-item" clearable>
        <el-option
          v-for="(label, value) in yhcjOptions"
          :key="value"
          :label="label"
          :value="value"
        />
      </el-select>
      <el-date-picker
  v-model="listQuery.dateRange"
  type="daterange"
  range-separator="至"
  start-placeholder="开始日期"
  end-placeholder="结束日期"
  class="filter-item"
  value-format="yyyy-MM-dd"
/>
      <el-select v-model="listQuery.yhjcx" placeholder="隐患检查项" class="filter-item" clearable>
        <el-option
          v-for="(label, value) in yhjcxOptions"
          :key="value"
          :label="label"
          :value="value"
        />
      </el-select>
      <el-select v-model="listQuery.yhdj" placeholder="隐患等级" class="filter-item" clearable>
        <el-option
          v-for="(label, value) in yhdjOptions"
          :key="value"
          :label="label"
          :value="value"
        />
      </el-select>
      <el-select v-model="listQuery.yhly" placeholder="隐患来源" class="filter-item" clearable>
        <el-option
          v-for="(label, value) in yhlyOptions"
          :key="value"
          :label="label"
          :value="value"
        />
      </el-select>

      <el-select v-model="listQuery.status" placeholder="状态" class="filter-item" clearable>
        <el-option
          v-for="(label, value) in statusOptions"
          :key="value"
          :label="label"
          :value="value"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
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
      <el-table-column label="ID" prop="id" align="center" width="80" />
      <el-table-column label="隐患名称" prop="yhlb_name" align="center" min-width="150px" />
      <el-table-column label="道路名称" prop="road_name" align="center" min-width="150px" />
      <el-table-column label="缩略图" align="center" width="120">
        <template slot-scope="{ row }">
          <img
            v-if="row.imgs"
            :src="`http://roadserver.lysoo.com:8081/${row.imgs}`"
            alt="缩略图"
            @click="openLargeImage(row.imgs)"
            style="width: 80px; height: 50px; object-fit: cover; border-radius: 4px;"
          />
          <span v-else>暂无图片</span>
        </template>
      </el-table-column>
      <el-table-column label="隐患位置" prop="address" align="center" min-width="120px" />
      <el-table-column label="隐患类别" prop="yhlb_name" align="center" min-width="120px" />
      <el-table-column label="隐患检查项" prop="yhjcx_name" align="center" min-width="120px" />
      <el-table-column label="隐患等级" prop="yhdj_name" align="center" min-width="100px" />
      <el-table-column label="隐患来源" prop="yhly_name" align="center" min-width="100px" />
      <el-table-column label="状态" prop="status_name" align="center" min-width="100px" />
      <el-table-column label="创建时间" prop="create_time" align="center" min-width="150px" />
      <el-table-column label="操作" align="center" width="300">
        <template slot-scope="{ row }">
          <el-button
            v-if="row.status_name === '已驳回'"
            size="mini"
            type="primary"
            @click="showRejectReason(row.id)"
          >
            查看原因
          </el-button>
          <el-button v-if="row.status_name === '待审核'" size="mini" type="primary" @click="approve(row.id)">审核通过</el-button>
          <el-button v-if="row.status_name === '待审核'" size="mini" type="danger" @click="reject(row.id)">驳回</el-button>
          <el-button v-if="row.status_name === '待派发'" size="mini" type="success" @click="dispatch(row)">派发</el-button>
          <el-button  size="mini" @click="goToDetail(row.id)">详情</el-button>
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
  :visible.sync="reasonDialogVisible"
  title="驳回原因"
  width="600px"
  :close-on-click-modal="false"
  class="reject-dialog"
>
  <div v-if="rejectReason" class="reject-content">
    <div class="reject-item">
      <span class="label">ID：</span>
      <span>{{ rejectReason.id }}</span>
    </div>
    <div class="reject-item">
      <span class="label">创建时间：</span>
      <span>{{ rejectReason.create_time }}</span>
    </div>
    <div class="reject-item">
      <span class="label">驳回人：</span>
      <span>{{ rejectReason.uname || '未知用户' }}</span>
    </div>
    <div class="reject-item">
      <span class="label">原因内容：</span>
      <p class="reason-content">{{ rejectReason.cont }}</p>
    </div>
  </div>
  <div v-else class="no-reason">
    <p>暂无驳回原因信息</p>
  </div>
  <div slot="footer" class="dialog-footer">
    <el-button @click="reasonDialogVisible = false">关闭</el-button>
  </div>
</el-dialog>
    <el-dialog :visible.sync="dialogVisible" title="隐患详情" width="1000px" :close-on-click-modal="false">
      <div v-if="selectedPitfall && selectedPitfall.imgs" style="text-align: center; margin-bottom: 20px;">
        <img :src="'http://roadserver.lysoo.com:8081/' + selectedPitfall.imgs" alt="隐患图片" style="width: 100%;" />
      </div>
      <div>
        <p><strong>隐患名称：</strong>{{ selectedPitfall && selectedPitfall.name ? selectedPitfall.name : '暂无' }}</p>
        <p><strong>道路名称：</strong>{{ selectedPitfall && selectedPitfall.roadName ? selectedPitfall.roadName : '暂无' }}</p>
        <p><strong>隐患类型：</strong>{{ selectedPitfall && selectedPitfall.yhdesc ? selectedPitfall.yhdesc : '暂无' }}</p>
        <p><strong>巡查时间：</strong>{{ selectedPitfall && selectedPitfall.create_time ? selectedPitfall.create_time : '暂无' }}</p>
      </div>
      <div v-if="isDispatch" style="margin-top: 20px; display: flex; align-items: center;">
        <el-select v-model="selectedTeam" placeholder="请选择维修团队" style="flex: 1;">
        <el-option
          v-for="(value, key) in userList"
          :key="key"
          :label="value.remark"
          :value="value.id"
        />
      </el-select>
      <el-button type="danger" @click="removePitfall">移除</el-button>


        <el-button type="primary" style="margin-left: 10px;" @click="assignTeam">确认派发</el-button>
      </div>
    </el-dialog>
    <el-dialog
  title="确认删除"
  :visible.sync="removeDialogVisible"
  width="400px"
  :close-on-click-modal="false"
>
  <p style="text-align: center; font-size: 16px;">确定要移除该隐患吗？此操作不可恢复！</p>
  <span slot="footer" class="dialog-footer">
    <el-button @click="removeDialogVisible = false">取消</el-button>
    <el-button type="danger" @click="removePitfall">确认</el-button>
  </span>
</el-dialog>

<div v-if="showLargeImagePopup" class="large-image-popup">
  <div class="popupbig-background"></div>
  <div class="popupbig-content">
     <div style="display: flex;align-items: center;">    
      <!-- <button 
      @click="prevImage" 
      class="image-nav-button" 
      style="margin-right: 20px;background: transparent"
      > <img :src="leftImage" alt="" /></button> -->

    <img :src="largeImageSrc" alt="大图" class="large-image" />
    <!-- <img 
      :src="cha2Image" 
      alt="关闭" 
      class="close-icon" 
      @click="closeLargeImage"
    /> -->
   
<!-- 
    <button 
      @click="nextImage" 
      class="image-nav-button" 
      style="margin-left: 20px;background: transparent"
      ><img :src="rightImage" alt="" /></button> -->
</div>
    <div class="close-button" style="  top: -40px; right: -55px;" @click="closeLargeImage">×</div>

  </div>
</div>
  </div>
  
</template>

<script>
import { getPitfallList, approvePitfall, rejectPitfall, getPitfallDetail, assignRepairTeam,worksMember,worksReason,deletePitfall} from '@/api/road';
import { getUser } from '@/api/user'
import waves from '@/directive/waves';
import Pagination from '@/components/Pagination';

export default {
  name: 'PitfallManagement',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: [],
      loading: false,
      tableKey: 0,
      total: 0,
      listLoading: true,
      dialogVisible: false,
      selectedPitfall: {},
      selectedTeam: '',
      isDispatch: false, // 控制是否显示派发功能
      userList:[],
      userTotal:0,
      listQuery: {
        page: 1,
        limit: 20,
        yhcj: '',
        yhlb: '',
        yhjcx: '',
        yhdj: '',
        yhly: '',
        status:'',
        dateRange: [] // 新增：时间段
      },
      yhcjOptions: {
        1: '普通路段',
        2: '临水路段',
        3: '学校路段',
        4: '路口',
      },
      yhdjOptions: {
        10: '轻微隐患',
        11: '一般隐患',
        12: '重大隐患',
        13: '特大隐患',
      },
      yhlyOptions: {
        14: '自动识别',
        15: '大队上报',
        16: '支队上报',
      },
      yhjcxOptions: {
        5: '平面线型',
        6: '曲面半径',
        7: '道路标牌',
        8: '路面标线',
        9: '路口视距',
        23: '学校路段',
        24: '临水路段',
        25: '急弯路段',
        26: '交叉口',
        27: '地面设施',
        28: '交安设施',
        29: '行车视距',
      },
      statusOptions:{
        1: '待审核',
        2: '待派发',
        3: '已驳回',
        4: '待施工',
        5: '已修复',
      },

      reasonDialogVisible: false,
      rejectReason: null,
      removeDialogVisible: false, // 控制移除弹窗
      largeImageSrc:'',
      showLargeImagePopup:false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleSelectionChange(val) {
      this.ids = val.map(item => item.id);
    },
    getList() {
      this.listLoading = true;
      const [start, end] = this.listQuery.dateRange || [];

getPitfallList({
  ...this.listQuery,
  start_time: start || '',
  end_time: end || ''
}).then(res => {
  if (res.code === 0) {
    this.list = res.data.data;
    this.total = res.data.total;
  } else {
    this.list = [];
    this.total = 0;
  }
  this.listLoading = false;
});


      worksMember(this.listQuery).then(res => {
        console.log('this.userList',this.userList)
        if (res.code === 0) {
          this.userList = res.data;
        } else {
          this.userList = [];
          this.userTotal = 0;
        }
        this.listLoading = false;
      });
    },
    confirmRemove() {
      if (!this.selectedPitfall.id) {
        this.$message.warning('请选择要移除的隐患');
        return;
      }
      this.removeDialogVisible = true;
    },
    openLargeImage(imageSrc) {
      console.log(222222222)
      const fullImageUrl = `http://roadserver.lysoo.com:8081/${imageSrc}`;
      this.largeImageSrc = fullImageUrl; // 设置大图地址
      this.showLargeImagePopup = true; // 显示弹窗

      console.log(this.showLargeImagePopup)
    },
    closeLargeImage() {
    this.showLargeImagePopup = false; // 隐藏弹窗
  },
    // 确认删除
    removePitfall() {
      if (!this.selectedPitfall.id) {
        this.$message.warning('隐患 ID 为空');
        return;
      }

      this.$confirm('此操作将永久删除该隐患, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePitfall(this.selectedPitfall.id).then(res => {
          if (res.code === 0) {
            this.$message.success('移除成功');
            this.dialogVisible = false; // 关闭详情窗口
            this.removeDialogVisible = false; // 关闭删除确认窗口
            this.getList(); // 重新获取列表
          } else {
            this.$message.error(res.msg || '移除失败');
          }
        }).catch(error => {
          this.$message.error(error.message || '请求失败');
        });
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    approve(id) {
      approvePitfall(id).then(res => {
        if (res.code === 0) {
          this.$notify({ title: 'Success', message: '审核通过', type: 'success' });
          this.getList();
        } else {
          this.$notify({ title: 'Error', message: res.msg, type: 'warning' });
        }
      });
    },


    showRejectReason(id) {
      worksReason({ type: 1, id }).then((res) => {
        if (res.code === 0) {
          this.rejectReason = res.data;
          this.reasonDialogVisible = true;
        } else {
          this.$notify({ title: 'Error', message: res.msg, type: 'warning' });
        }
      });
    },
    reject(id) {
      this.$prompt('请输入驳回原因', '驳回', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea'
      }).then(({ value }) => {
        rejectPitfall({ id, reason: value }).then(res => {
          if (res.code === 0) {
            this.$notify({ title: 'Success', message: '驳回成功', type: 'success' });
            this.getList();
          } else {
            this.$notify({ title: 'Error', message: res.msg, type: 'warning' });
          }
        });
      });
    },
    viewDetails(row) {
      this.isDispatch = false; // 详情时不显示派发功能
      this.selectedPitfall = row;
      this.dialogVisible = true;
    },
    goToDetail(id) {
    this.$router.push({
      path: '/hazardManage/libraryDetail',
      query: { id } // 通过 query 传递参数
    });
  },
    dispatch(row) {
      this.isDispatch = true; // 派发时显示派发功能
      this.selectedPitfall = row;
      this.dialogVisible = true;
    },
    assignTeam() {
      if (!this.selectedTeam) {
        this.$message.warning('请选择维修团队');
        return;
      }
      assignRepairTeam({ mid: this.selectedPitfall.id, uid: this.selectedTeam }).then(res => {
        if (res.code === 0) {
          this.$notify({ title: 'Success', message: '派发成功', type: 'success' });
          this.getList();
          this.dialogVisible = false;
        } else {
          this.$notify({ title: 'Error', message: res.msg, type: 'warning' });
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
.app-container {
  padding: 20px;
}

.reject-dialog {
  .reject-content {
    padding: 10px;
    .reject-item {
      margin-bottom: 10px;
      .label {
        font-weight: bold;
        color: #333;
        margin-right: 5px;
      }
      .reason-content {
        /* background: #f5f7fa; */
        padding: 10px;
        border-radius: 5px;
        /* border: 1px solid #dcdfe6; */
        margin-top: 5px;
        color: #606266;
        line-height: 1.5;
        word-break: break-word;
      }
    }
  }
  .no-reason {
    text-align: center;
    color: #909399;
    font-size: 14px;
    padding: 20px 0;
  }
  .dialog-footer {
    text-align: right;
    padding-top: 10px;
  }
}

</style>
<style scoped>
.large-image-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.popupbig-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: -1;
}

.popupbig-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.large-image {
  /* max-width: 90%; */
  width: 1200px;
  /* max-height: 80%; */
  /* border-radius: 10px; */
}

.close-icon {
  position: absolute;
  top: -40px;
  right: -55px;
  width: 30px;
  height: 30px;
  cursor: pointer;
}

.search-input::placeholder {
  color: rgb(255, 255, 255)fff; /* 设置占位符的颜色 */
  font-style: italic; /* 可选：设置占位符的字体样式 */
}
</style>