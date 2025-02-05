<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="请输入申请企业名称"
        style="width: 200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
    </div>

    <el-table
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="修复企业" prop="repair.uname" align="center" min-width="150" />
      <el-table-column label="隐患编号" prop="id" align="center" min-width="100" />
      <el-table-column label="修复前图片" align="center" min-width="200">
      <template #default="{ row }">
        <el-button
          type="text"
          @click="viewImage(row.imgs, 0)"
        >查看</el-button>
      </template>
    </el-table-column>
      <el-table-column label="修复描述" prop="repair.desc" align="center" min-width="200" />
      <el-table-column label="修复后图片" align="center" min-width="200">
      <template #default="{ row }">
        <el-button
          type="text"
          @click="viewImage(row.repair.imgs, 0)"
        >查看</el-button>
      </template>
    </el-table-column>
      <el-table-column label="操作" align="center" width="300">
        <template #default="{ row }">
          <el-button-group>
            <el-button size="mini" type="success" @click="approveRepair(row.id)">通过</el-button>
            <el-button size="mini" type="danger" @click="openRejectDialog(row.id)">拒绝</el-button>
          </el-button-group>
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

    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="imagePreviewVisible" width="60%">
      <el-carousel height="400px" trigger="click">
        <el-carousel-item v-for="(img, index) in currentPreviewImages" :key="index">
          {{ img }}
          <img :src="getFullImagePath(img)" style="width: 100%; height: 100%; object-fit: contain;" />
        </el-carousel-item>
      </el-carousel>
    </el-dialog>

    <!-- 拒绝对话框 -->
    <el-dialog title="驳回申请" :visible.sync="rejectDialogVisible" width="30%">
      <el-input
        type="textarea"
        v-model="rejectReason"
        placeholder="请输入驳回理由"
        rows="5"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="rejectDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="rejectRepair">确认驳回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { worksRepairAuditList, approveRepair, rejectRepair,rejectWorksRepair,approveWorksRepair } from '@/api/road';
import Pagination from '@/components/Pagination';

export default {
  components: { Pagination },
  data() {
    return {
      list: [],
      listLoading: true,
      total: 0,
      listQuery: { page: 1, limit: 20, name: '' },
      imagePreviewVisible: false,
      currentPreviewImages: [],
      rejectDialogVisible: false,
      rejectReason: '',
      currentRejectId: null,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      this.listLoading = true;
      try {
        const res = await worksRepairAuditList(this.listQuery);
        if (res.code === 0) {
          // 处理图片字段
          this.list = res.data.map(item => {
            // 处理修复前的图片
            item.imgs = this.normalizeImages(item.imgs);
            // 处理修复后的图片
            if (item.repair && item.repair.imgs) {
              item.repair.imgs = this.normalizeImages(item.repair.imgs);
            }
            return item;
          });
          this.total = this.list.length; // 根据数据长度设置总数
        } else {
          this.$message.error("获取列表失败");
        }
      } catch (error) {
        console.error("Error fetching list:", error);
      } finally {
        this.listLoading = false;
      }
    },
    normalizeImages(imgs) {
      if (!imgs) return [];
      try {
        // 如果是 JSON 数组字符串，解析为数组
        if (imgs.startsWith('[') && imgs.endsWith(']')) {
          return JSON.parse(imgs);
        }
      } catch (e) {
        console.error("Error parsing images:", e);
      }
      // 如果是单图片字符串，直接返回数组
      return [imgs];
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    getFullImagePath(path) {
    return `http://roadserver.lysoo.com:8081/${path}`;
  },
    viewImage(images, index) {
      this.currentPreviewImages = images;
      this.imagePreviewVisible = true;
    },
    approveRepair(id) {
      this.$confirm('确定通过该修复申请?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success',
      }).then(() => {
        approveWorksRepair({ id: id, reason:'同意' }).then(res => {
          if (res.code === 0) {
            this.$notify({ title: 'Success', message: '审核通过', type: 'success' });
            this.getList();
          } else {
            this.$notify({ title: 'Error', message: res.msg, type: 'error' });
          }
        });
      });
    },
    openRejectDialog(id) {
      this.rejectDialogVisible = true;
      this.currentRejectId = id;
    },
    rejectRepair() {
      if (!this.rejectReason) {
        this.$notify({ title: 'Error', message: '请输入驳回理由', type: 'warning' });
        return;
      }
      rejectWorksRepair({ id: this.currentRejectId, reason: this.rejectReason }).then(res => {
        if (res.code === 0) {
          this.$notify({ title: 'Success', message: '驳回成功', type: 'success' });
          this.rejectDialogVisible = false;
          this.getList();
        } else {
          this.$notify({ title: 'Error', message: res.msg, type: 'error' });
        }
      });
    },
  },
};
</script>

<style scoped>
.app-container {
  padding: 20px;
}

.filter-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.filter-item {
  margin-right: 10px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding: 10px 20px;
}
</style>
