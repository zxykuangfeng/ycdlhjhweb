<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="请输入项目名称"
        style="width: 200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-select v-model="listQuery.company_id" placeholder="请选择施工企业" class="filter-item" clearable>
        <el-option v-for="company in userList" :key="company.id" :label="company.remark" :value="company.id" />
      </el-select>
      <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>

    <el-table :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="项目名称" prop="name" min-width="150px" align="center" show-overflow-tooltip />
      <el-table-column label="施工方式" prop="constructionMethod" min-width="150px" align="center" />
      <el-table-column label="施工企业" prop="constructionUnitName" min-width="150px" align="center" />
      <el-table-column label="状态" prop="status_name" min-width="100px" align="center" />
      <el-table-column label="提交时间" prop="create_time" min-width="160px" align="center" />
      <el-table-column label="操作" align="center" width="200px">
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" @click="handleReview(row)">审核</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 审核对话框 -->
    <el-dialog title="竣工审核" :visible.sync="reviewDialogVisible" width="70%">
      <el-form ref="reviewForm" :model="reviewForm" label-width="120px">
        <el-divider content-position="center">项目信息</el-divider>
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目名称">
              <el-input v-model="reviewForm.name" disabled />
            </el-form-item>
            <el-form-item label="施工方式">
              <el-input v-model="reviewForm.constructionMethod" disabled />
            </el-form-item>
            <el-form-item label="建设单位">
              <el-input v-model="reviewForm.buildUnitName" disabled />
            </el-form-item>
            <el-form-item label="施工企业">
              <el-input v-model="reviewForm.constructionUnitName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="建设单位负责人">
              <el-input v-model="reviewForm.buildUnitLeader" disabled />
            </el-form-item>
            <el-form-item label="施工企业联系人">
              <el-input v-model="reviewForm.constructionUnitLeader" disabled />
            </el-form-item>
            <el-form-item label="施工位置">
              <el-input v-model="reviewForm.location" disabled />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="center">地理信息</el-divider>
        <el-row>
          <el-col :span="12">
            <el-form-item label="起点">
              <el-input v-model="reviewForm.spoint" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="终点">
              <el-input v-model="reviewForm.epoint" disabled />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="center">审批材料</el-divider>
        <el-row>
  <el-col :span="12" v-for="(files, key) in reviewFiles" :key="key">
    <el-form-item :label="fileLabels[key]">
      <div v-if="files.length">
        <el-button
          v-for="file in files"
          :key="file"
          type="text"
          @click="downloadFile(file)"
          style="display: block; margin-bottom: 5px; color: #409eff;"
        >
          {{ getFileName(file) }}
        </el-button>
      </div>
      <span v-else>无</span>
    </el-form-item>
  </el-col>
</el-row>
        <el-divider content-position="center">设施信息</el-divider>
        <el-table :data="reviewForm.facility" border fit highlight-current-row>
          <el-table-column label="描述" prop="description" align="center" />
          <el-table-column label="施工位置" prop="location" align="center" />
          <el-table-column label="施工前图片" align="center">
            <template slot-scope="{ row }">
              <img v-for="img in row.images" :key="img" :src="getFileUrl(img)" style="width: 100px; height: 100px" fit="cover" />
              <span v-if="!row.images || !row.images.length">无</span>
            </template>
          </el-table-column>

          <el-table-column label="施工后图片" align="center">
            <template slot-scope="{ row }">
              <img :src="getFileUrl(row.repair_imgs)" style="width: 100px; height: 100px" fit="cover" />
              <span v-if="!row.repair_imgs || !row.repair_imgs">无</span>
            </template>
          </el-table-column>
        </el-table>

        <el-divider content-position="center">审核意见</el-divider>
        <el-form-item label="审核意见">
          <el-input v-model="reviewForm.auditComment" type="textarea" placeholder="请输入审核意见" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="reviewDialogVisible = false">取消</el-button>
        <!-- <el-button type="danger" @click="rejectReview">驳回</el-button> -->
        <el-button type="success" @click="approveReview">通过</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { sgxmsList, sgxmsAudit, sgxmsYs, worksMember } from '@/api/road';
import Pagination from '@/components/Pagination';

export default {
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listQuery: { page: 1, limit: 20, name: '', company_id: null ,status:3},
      userList: [],
      reviewDialogVisible: false,
      reviewForm: {},
      reviewFiles: {},
      fileLabels: {
        trafficPlan: "交通设施方案",
        fencePlan: "围挡方案",
        constructionPlan: "施工方案",
        constructionDrawing: "施工图纸",
        safetyCommitment: "安全施工承诺书",
        securityPlan: "安保方案",
      },
    };
  },
  created() {
    this.fetchCompanies();
    this.getList();
  },
  methods: {
    fetchCompanies() {
      worksMember({}).then(res => {
        if (res.code === 0) this.userList = res.data;
      });
    },
    getList() {
      sgxmsList(this.listQuery).then(res => {
        if (res.code === 0) {
          this.list = res.data.data;
          this.total = res.data.total;
        }
      });
    },
    downloadFile(file) {
    const url = this.getFileUrl(file);
    const fileName = this.getFileName(file);
    // console.log('1111')
    // console.log(url)
    // 创建隐藏的 a 标签
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName; // 设置下载的文件名
    a.style.display = "none";
    
    document.body.appendChild(a);
    a.click(); // 触发下载
    document.body.removeChild(a);
  },
    handleReview(row) {
      this.reviewForm = { ...row, facility: row.facility || [] };

      // 确保所有文件字段都是数组（即使它们只有一个文件）
      this.reviewFiles = {};
      Object.keys(this.fileLabels).forEach(key => {
        const files = row[key];
        // console.log('files')
        // console.log(files)
        this.reviewFiles[key] = files ? (Array.isArray(files) ? files : [files]) : [];
      });
      console.log(this.reviewFiles)
      this.reviewDialogVisible = true;
    },
    getFileUrl(file) {
      const baseUrl = "http://roadserver.lysoo.com:8081"; // 你的服务器地址
      return file.startsWith("uploads/") ? `${baseUrl}/${file}` : file;
    },
    getFileName(file) {
      return file.split('/').pop(); // 只显示文件名
    },
    approveReview() {
      this.submitReview(1);
    },
    rejectReview() {
      this.submitReview(2);
    },
    submitReview(status) {
      sgxmsYs({ id: this.reviewForm.id,reason : this.reviewForm.auditComment }).then(() => {
        this.$message.success(status === 1 ? "审核通过" : "审核驳回");
        this.reviewDialogVisible = false;
        this.getList();
      });
    }
  }
};
</script>
