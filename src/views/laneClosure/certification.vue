<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>企业信息</span>
        <el-button style="float: right;" type="primary" @click="editCompanyInfo">修改</el-button>
      </div>
      <el-form ref="companyForm" :model="company" label-width="120px">
        <el-form-item label="企业名称">
          <el-input v-model="company.name" :disabled="!isEditing" />
        </el-form-item>
        <el-form-item label="负责人">
          <el-input v-model="company.fzr" :disabled="!isEditing" />
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="company.tel" :disabled="!isEditing" />
        </el-form-item>

        <el-form-item label="备案材料">
          <el-table :data="fileList" border style="width: 100%">
            <el-table-column prop="name" label="文件名">
              <template slot-scope="scope">
                <el-link :href="scope.row.url" target="_blank" download>{{ scope.row.name }}</el-link>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" v-if="isEditing">
              <template slot-scope="scope">
                <el-button type="text" @click="handleFileRemove(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-upload
            ref="upload"
            action="`${$uploadBaseUrl}/admin/fileUpload`"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :on-remove="handleFileRemove"
            multiple>
            <el-button size="small" type="primary" :disabled="!isEditing">上传文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>

      <div v-if="isEditing" class="form-footer">
        <el-button @click="cancelEdit">取消</el-button>
        <el-button type="primary" @click="saveCompanyInfo">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getCompanyInfo, addCompanyInfo } from '@/api/road';

export default {
  data() {
    return {
      company: {
        id: null,
        uid: null,
        name: '',
        fzr: '',
        tel: '',
        imgs: []
      },
      fileList: [],
      isEditing: false
    };
  },
  created() {
    this.fetchCompanyInfo();
  },
  methods: {
    async fetchCompanyInfo() {
  try {
    const res = await getCompanyInfo();
    if (res.code === 0) {
      if (Array.isArray(res.data) && res.data.length === 0) {
        // res.data 是空数组时，不赋值 this.company
        return;
      }

      // res.data 是对象时，正常赋值
      if (typeof res.data === 'object' && !Array.isArray(res.data)) {
        this.company = res.data;
      }

      // 确保 imgs 存在，避免报错
      this.company.imgs = this.company.imgs || [];

      // 处理企业图片列表
      this.fileList = this.company.imgs.map(img => ({
        name: img,
        url: `/uploads/${img}`
      }));
    }

  } catch (error) {
    console.error("获取企业信息失败:", error);
  }
},


    editCompanyInfo() {
      this.isEditing = true;
    },
    cancelEdit() {
      this.isEditing = false;
      this.fetchCompanyInfo();
    },
    async saveCompanyInfo() {

      console.log(this.company)
        const res = await addCompanyInfo(this.company);
        if (res.code === 0) {
          this.isEditing = false;
          this.fetchCompanyInfo();
          this.$message.success('成功');
        }else{
          this.$message.success('失败');
        }
    },
    handleUploadSuccess(response, file) {
      const newFile = { name: file.name, url: response.data.url};
      this.fileList.push(newFile);
      this.company.imgs.push(response.data.url); // 添加到 `imgs` 数组
      console.log(33333333333)
      console.log(this.company)
    },
    handleFileRemove(file) {
      this.fileList = this.fileList.filter(f => f.name !== file.name);
      this.company.imgs = this.company.imgs.filter(img => img !== file.name);
    }
  }
};
</script>

<style>
.box-card {
  margin: 0 auto;
}
.form-footer {
  text-align: right;
}
</style>
