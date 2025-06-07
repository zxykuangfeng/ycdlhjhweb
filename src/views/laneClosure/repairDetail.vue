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
      <el-table-column label="施工企业" prop="qyname" min-width="150px" align="center" />
      <el-table-column label="状态" prop="status_name" min-width="100px" align="center" />
      <el-table-column label="操作" align="center" width="200px">
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" @click="openApplicationDialog(row)" v-if="row.status_name === '待申请'">
            提交申请
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="提交施工申请" :visible.sync="applicationDialogVisible" width="600px">
      <el-form ref="applicationForm" :rules="rules" :model="applicationForm" label-width="100px">
        <el-form-item label="申请材料">
          <el-upload
            ref="upload"
            action="`${$uploadBaseUrl}/admin/fileUpload`"
            :file-list="fileList"
            :on-success="handleUploadSuccess"
            :on-remove="handleFileRemove"
            multiple>
            <el-button size="small" type="primary">上传文件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="施工前设施">
          <el-button type="primary" @click="addFacility">添加设施</el-button>
          <div v-for="(facility, index) in applicationForm.facilities" :key="index" class="facility-item">
            <el-select v-model="facility.type" placeholder="设施类型" class="facility-select">
              <el-option v-for="item in facilityTypeList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
            <el-upload
              action="`${$uploadBaseUrl}/admin/fileUpload`"
              :on-success="(response) => handleFacilityUpload(response, index)"
              :file-list="facility.fileList">
              <el-button size="small" type="primary">上传图片</el-button>
            </el-upload>
            <el-input v-model="facility.description" placeholder="设施描述" class="facility-input" />
            <el-button type="danger" icon="el-icon-delete" @click="removeFacility(index)"></el-button>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="applicationDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitApplication">申请</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { sgxmList, submitConstructionApplication,facilityType,applyAdd,sgxmAdd } from '@/api/road';

export default {
  data() {
    return {
      list: [],
      listQuery: { name: '', company_id: null },
      userList: [],
      applicationDialogVisible: false,
      applicationForm: { materials: [], facilities: [] },
      fileList: [],
      rules: {},
      facilityTypeList:{}
    };
  },
  created() {
    this.getList();
    this.facilityType();
  },
  methods: {
    getList() {
      sgxmList(this.listQuery).then(res => {
        if (res.code === 0) {
          this.list = res.data.data; // 确保数据正确匹配
        }
      });
    },
    facilityType() {
      facilityType().then(res => {
        if (res.code === 0 && res.data.data) {
          this.facilityTypeList = res.data.data; // 确保下拉框数据正确
        }
      }).catch(() => {
        this.$message.error('设施类型加载失败');
      });
    },
    handleFilter() {
      this.getList();
    },
    openApplicationDialog(row) {
      this.applicationForm = { id: row.id, materials: [], facilities: [] };
      this.fileList = [];
      this.applicationDialogVisible = true;
    },
    handleUploadSuccess(response, file) {
      this.applicationForm.materials.push({ name: file.name, url: response.url });
    },
    handleFileRemove(file) {
      this.applicationForm.materials = this.applicationForm.materials.filter(f => f.name !== file.name);
    },
    addFacility() {
      this.applicationForm.facilities.push({ type: '', fileList: [], description: '' });
    },
    removeFacility(index) {
      this.applicationForm.facilities.splice(index, 1);
    },
    handleFacilityUpload(response, index) {
  if (response.data && response.data.url) {
    if (!this.applicationForm.facilities[index].fileList) {
      this.$set(this.applicationForm.facilities[index], 'fileList', []);
    }
    this.applicationForm.facilities[index].fileList.push(response.data.url);
  } else {
    this.$message.error('文件上传失败');
  }
},
submitApplication() {
  this.$confirm('提交后不可修改，是否确认提交？', '提示', { type: 'warning' })
    .then(() => {
      console.log('applicationForm', this.applicationForm);

      // 确保 `sscl` 直接是数组，不包含 `name`
      const sscl = this.applicationForm.materials.map(material => material.url);

      // 格式化 `info`，确保 `imgs` 是单张图片
      const formattedFacilities = this.applicationForm.facilities.map(facility => ({
        fid: facility.type, // 设施类型 ID
        imgs: facility.fileList.length > 0 ? facility.fileList[0] : "", // 取第一张图片
        desc: facility.description // 设施描述
      }));

      // 构造提交数据
      const payload = {
        mid: this.applicationForm.id, // 项目 ID
        sscl, // 申请材料 (直接是数组)
        info: formattedFacilities // 设施信息 (imgs 确保是单个)
      };

      console.log('提交数据:', payload);

      applyAdd(payload).then(() => {
        this.$message.success('提交成功');
        this.applicationDialogVisible = false;
        this.getList();
      }).catch(() => {
        this.$message.error('提交失败，请重试');
      });
    });
}
  }
};
</script>

<style scoped>
.facility-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.facility-select {
  width: 120px;
  margin-right: 10px;
}
.facility-input {
  flex-grow: 1;
  margin-left: 10px;
}
</style>
