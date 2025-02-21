<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="请输入施工企业名称"
        style="width: 200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>

    <el-table :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="施工企业名称" prop="name" min-width="200px" align="center" show-overflow-tooltip />
      <el-table-column label="负责人" prop="fzr" min-width="150px" align="center" />
      <el-table-column label="联系方式" prop="tel" min-width="200px" align="center" />
      <el-table-column label="操作" align="center" width="150px">
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" @click="handleViewDetails(row)">查看备案材料</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    
    <el-dialog title="施工企业备案材料" :visible.sync="detailDialogVisible" width="600px">
      <el-table :data="recordFiles" border fit highlight-current-row style="width: 100%;">
        <el-table-column label="备案材料名称" prop="name" min-width="250px" align="center" />
        <el-table-column label="操作" align="center" width="100px">
          <template slot-scope="{ row }">
            <el-button size="mini" type="success" @click="downloadFile(row.url)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { sgqyList, sgqyDetail } from '@/api/road';

export default {
  data() {
    return {
      list: [],
      total: 0,
      listQuery: { page: 1, limit: 20, name: '' },
      detailDialogVisible: false,
      recordFiles: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // Fetch list of companies
    getList() {
      sgqyList(this.listQuery).then(res => {
        if (res.code === 0) {
          this.list = res.data;
          this.total = res.data.length; // Set total to the length of the data
        }
      });
    },

    // Handle filtering the list of companies
    handleFilter() {
      this.getList();
    },

    // Fetch and display details for a specific company
    handleViewDetails(row) {
      sgqyDetail(row.id ).then(res => {
        if (res.code === 0) {
          // Assuming 'imgs' contains the file names or URLs for the materials
          this.recordFiles = res.data.imgs.map(img => ({ name: img, url: `http://roadserver.lysoo.com:8081/${img}` }));
          this.detailDialogVisible = true;
        }
      });
    },

    // Handle file download
    downloadFile(url) {
      window.open(url, '_blank');
    }
  }
};
</script>
