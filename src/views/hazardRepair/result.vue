<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="filterParams.name"
        placeholder="请输入道路名称"
        clearable
        class="filter-item"
        style="width: 200px;"
        @keyup.enter.native="getRepairList"
      />
      <el-button
        type="primary"
        class="filter-item"
        @click="getRepairList"
        icon="el-icon-search"
      >
        搜索
      </el-button>
      <el-button
        type="primary"
        class="filter-item"
        @click="openAddDialog"
        icon="el-icon-plus"
      >
        添加修复
      </el-button>
    </div>

    <el-table
      :data="repairList"
      border
      v-loading="listLoading"
      style="width: 100%;"
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column label="道路名称" prop="name" align="center" />
      <el-table-column label="状态" prop="status_name" align="center" />
      <el-table-column label="操作" align="center" width="220">
        <template #default="{ row }">
          <el-button
            size="mini"
            type="primary"
            @click="viewRepairDetails(row)"
          >
            详情
          </el-button>
          <el-button
            v-if="row.status_name === '待审核'"
            size="mini"
            type="success"
            @click="approveRepair(row.id)"
          >
            审核通过
          </el-button>
          <el-button
            v-if="row.status_name === '待审核'"
            size="mini"
            type="danger"
            @click="openRejectDialog(row.id)"
          >
            驳回
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="filterParams.page"
      :limit.sync="filterParams.limit"
      @pagination="getRepairList"
    />

    <!-- 添加修复对话框 -->
    <el-dialog
      title="添加隐患修复"
      :visible.sync="addDialogVisible"
      width="50%"
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-width="120px">
        <el-form-item label="隐患ID" prop="mid">
          <el-input v-model="addForm.mid" />
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="addForm.desc" type="textarea" rows="4" />
        </el-form-item>
        <el-form-item label="修复图片" prop="imgs">
          <el-upload
            action="/api/upload"
            list-type="picture-card"
            :on-success="handleUploadSuccess"
            :file-list="addForm.imgs"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAddForm">提交</el-button>
      </div>
    </el-dialog>

    <!-- 驳回对话框 -->
    <el-dialog
      title="驳回理由"
      :visible.sync="rejectDialogVisible"
      width="40%"
    >
      <el-input
        v-model="rejectReason"
        type="textarea"
        placeholder="请输入驳回理由"
        rows="5"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="rejectDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="submitReject">确认驳回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRepairList, addRepair, approveRepair, rejectRepair } from "@/api/road";
import Pagination from "@/components/Pagination";

export default {
  components: { Pagination },
  data() {
    return {
      repairList: [],
      listLoading: false,
      total: 0,
      filterParams: {
        name: "",
        page: 1,
        limit: 20,
      },
      addDialogVisible: false,
      rejectDialogVisible: false,
      rejectReason: "",
      selectedId: null,
      addForm: {
        mid: "",
        desc: "",
        imgs: [],
      },
      addFormRules: {
        mid: [{ required: true, message: "隐患ID不能为空", trigger: "blur" }],
        desc: [{ required: true, message: "描述不能为空", trigger: "blur" }],
        imgs: [{ required: true, message: "请上传修复图片", trigger: "change" }],
      },
    };
  },
  methods: {
    getRepairList() {
      this.listLoading = true;
      getRepairList(this.filterParams).then((response) => {
        if (response.code === 1) {
          this.repairList = response.data.data;
          this.total = response.data.total;
        }
        this.listLoading = false;
      });
    },
    openAddDialog() {
      this.addDialogVisible = true;
      this.addForm = { mid: "", desc: "", imgs: [] };
    },
    submitAddForm() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          addRepair(this.addForm).then((response) => {
            if (response.code === 1) {
              this.$message.success("修复添加成功");
              this.addDialogVisible = false;
              this.getRepairList();
            }
          });
        }
      });
    },
    approveRepair(id) {
      approveRepair(id).then((response) => {
        if (response.code === 1) {
          this.$message.success("审核通过");
          this.getRepairList();
        }
      });
    },
    openRejectDialog(id) {
      this.rejectDialogVisible = true;
      this.selectedId = id;
    },
    submitReject() {
      if (!this.rejectReason) {
        this.$message.error("请输入驳回理由");
        return;
      }
      rejectRepair({ id: this.selectedId, reason: this.rejectReason }).then((response) => {
        if (response.code === 1) {
          this.$message.success("驳回成功");
          this.rejectDialogVisible = false;
          this.getRepairList();
        }
      });
    },
    handleUploadSuccess(response, file, fileList) {
      this.addForm.imgs = fileList.map((file) => file.response.url);
    },
  },
  created() {
    this.getRepairList();
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
</style>
