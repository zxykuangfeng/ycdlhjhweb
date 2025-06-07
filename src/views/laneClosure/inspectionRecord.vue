<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.mid" placeholder="请选择项目" style="width: 200px;" clearable filterable>
        <el-option v-for="project in projectList" :key="project.id" :label="project.name" :value="project.id" />
      </el-select>
      <el-button type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="handleCreate">新增排查记录</el-button>
    </div>

    <el-table :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="ID" prop="id" width="80" align="center" />
      <el-table-column label="项目名称" prop="mid" width="180" align="center">
        <template slot-scope="{ row }">
          {{ getProjectName(row.mid) }}
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" min-width="200" />
      <el-table-column label="图片" align="center" width="200">
        <template slot-scope="{ row }">
          <img v-for="img in row.imgs" :key="img" :src="getFileUrl(img)" style="width: 50px; height: 50px; margin-right: 5px;" fit="cover" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="create_time" width="180" align="center" />
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%">
      <el-form ref="form" :model="formData" label-width="120px">
        <el-form-item label="项目" prop="mid">
          <el-select v-model="formData.mid" placeholder="请选择项目" filterable>
            <el-option v-for="project in projectList" :key="project.id" :label="project.name" :value="project.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注信息" />
        </el-form-item>
        <el-form-item label="图片">
          <el-upload  :action="`${$uploadBaseUrl}/admin/fileUpload`"list-type="text" :on-success="handleFileUpload">
            <el-button type="primary">上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="success" @click="submitForm">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addResult, editResult, getResultList, getResultDetail, deleteResult, sgxmsAllList } from '@/api/road';
import Pagination from '@/components/Pagination';

export default {
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listQuery: { page: 1, limit: 20, mid: '' },
      projectList: [], // 存储所有项目
      dialogVisible: false,
      dialogTitle: '新增排查记录',
      formData: { id: null, mid: '', imgs: [], remark: '' },
    };
  },
  created() {
    this.getList();
    this.fetchProjects(); // 获取项目列表
  },
  methods: {
    getList() {
      getResultList(this.listQuery).then(res => {
        if (res.code === 0) {
          this.list = res.data.data;
          this.total = res.data.total;
        }
      });
    },
    fetchProjects() {
      sgxmsAllList().then(res => {
        if (res.code === 0) {
          this.projectList = res.data;
        }
      });
    },
    getProjectName(mid) {
      const project = this.projectList.find(p => p.id === mid);
      return project ? project.name : '未知项目';
    },
    handleCreate() {
      this.dialogTitle = '新增排查记录';
      this.formData = { id: null, mid: '', imgs: [], remark: '' };
      this.dialogVisible = true;
    },
    handleEdit(row) {
      getResultDetail(row.id).then(res => {
        if (res.code === 0) {
          this.dialogTitle = '编辑排查记录';
          this.formData = res.data;
          this.dialogVisible = true;
        }
      });
    },
    handleDelete(id) {
      this.$confirm('确认删除该排查记录？', '提示', { type: 'warning' }).then(() => {
        deleteResult(id).then(() => this.getList());
      });
    },
    handleFileUpload(response) {
      if (response.code === 0) {
        this.formData.imgs.push(response.data.url);
      }
    },
    submitForm() {
      const api = this.formData.id ? editResult : addResult;
      api(this.formData).then(res => {
        if (res.code === 0) {
          this.$message.success('操作成功');
          this.dialogVisible = false;
          this.getList();
        }
      });
    },
    getFileUrl(file) {
      return file.startsWith('uploads/') ? `http://roadserver.lysoo.com:8081/${file}` : file;
    }
  }
};
</script>
