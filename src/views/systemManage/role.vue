<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">新增角色</el-button>

    <el-table :data="list" style="width: 100%;margin-top:30px;" border>
      <el-table-column label="ID" prop="id" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色名" width="220">
        <template slot-scope="scope">{{ scope.row.role_name }}</template>
      </el-table-column>
      <el-table-column align="center" label="角色描述">
        <template slot-scope="scope">{{ scope.row.role_describe }}</template>
      </el-table-column>
      <el-table-column align="center" label="创建日期">
        <template slot-scope="scope">{{ scope.row.created_at }}</template>
      </el-table-column>
      <el-table-column align="center" label="更新日期">
        <template slot-scope="scope">{{ scope.row.updated_at }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.id != 1"
            type="primary"
            size="small"
            @click="handleEdit(scope)"
          >编辑</el-button>
          <el-button
            v-if="scope.row.id != 1"
            type="danger"
            size="small"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-el-drag-dialog
      :visible.sync="dialogVisible"
      :title="dialogType === 'edit' ? '编辑角色' : '新增角色'"
    >
      <el-form
        :model="role"
        label-width="80px"
        label-position="left"
        :rules="rules"
      >
        <el-form-item label="角色名称" prop="role_name">
          <el-input v-model="role.role_name" placeholder="请填写角色名称" />
        </el-form-item>
        <el-form-item label="角色描述" prop="role_describe">
          <el-input
            v-model="role.role_describe"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="请填写角色描述"
          />
        </el-form-item>
        <el-form-item label="角色权限" prop="role_describe">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            show-checkbox
            node-key="name"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible = false">取消</el-button>
        <el-button
          :loading="downloadLoading"
          type="primary"
          @click="confirmRole"
        >确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { getRole, addRole, updateRole, delRole } from '@/api/user'
import { asyncRoutes, constantRoutes } from '@/router'
const defaultRole = {
  key: '',
  name: '',
  description: ''
}

export default {
  name: 'Role',
  data() {
    return {
      count: '',
      list: [],
      listQuery: {
        page: 1,
        limit: 20
      },
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      downloadLoading: false,
      rules: {
        role_name: [
          { required: true, message: '请输入角色名', trigger: 'blur' }
        ],
        role_describe: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ],
        checkStrictly: [
          { required: true, message: '请选择角色权限', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    this.getRoutes()
    this.getList()
  },
  methods: {
    filterServeAsyncRoutes(routes, permissionsList) {
      const res = []

      routes.forEach(route => {
        const tmp = { ...route }
        if (this.hasServePermission(permissionsList, tmp)) {
          if (tmp.children) {
            tmp.children = this.filterServeAsyncRoutes(
              tmp.children,
              permissionsList
            )
          }
          res.push(tmp)
        }
      })

      return res
    },
    hasServePermission(permissionsList, route) {
      if (route.hidden) {
        return true
      } else if (route.name) {
        return permissionsList.includes(route.name)
      } else {
        return true
      }
    },
    getRoutes() {
      this.routes = this.generateRoutes(asyncRoutes)
    },
    getList() {
      this.listLoading = true
      console.log(666666666)
      getRole(this.listQuery).then(response => {
        this.list = response.data.data
        this.count = response.data.count
        this.roles = response.data.roles
        this.listLoading = false
      })
    },
    generateRoutes(routes, basePath = '/') {
      const res = []

      for (let route of routes) {
        // skip some route
        if (route.hidden) {
          continue
        }

        const onlyOneShowingChild = this.onlyOneShowingChild(
          route.children,
          route
        )

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }

        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title,
          name: route.name
        }

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },
    generateArr(routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    handleAddRole() {
      this.role = {}
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(scope.row)
      console.log(222222222222)
      console.log(this.role)
      const permissionsList = this.role.role_auth
      const routes_copy = this.filterServeAsyncRoutes(
        this.routes,
        permissionsList
      )
      this.$nextTick(() => {
        const routes = this.generateRoutes(routes_copy)
        this.$refs.tree.setCheckedNodes(this.generateArr(routes))
        // set checked state of a node not affects its father and child nodes
        this.checkStrictly = false
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const _d = {}
          _d.role_id = row.id
          delRole(_d).then(res => {
            if (res.status == 'S') {
              this.$notify({
                title: 'Success',
                message: '删除成功',
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
    generateTree(routes, basePath = '/', checkedKeys) {
      const res = []

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(
            route.children,
            routePath,
            checkedKeys
          )
        }

        if (
          checkedKeys.includes(routePath) ||
          (route.children && route.children.length >= 1)
        ) {
          res.push(route)
        }
      }
      return res
    },
    confirmRole() {
      this.downloadLoading = true
      const isEdit = this.dialogType === 'edit'
      // const checkedKeys = this.$refs.tree.getCheckedKeys();
      const checkedKeys = this.$refs.tree.getHalfCheckedKeys().concat(this.$refs.tree.getCheckedKeys())

      // this.$refs.tree.getHalfCheckedKeys().concat(this.$refs.tree.getCheckedKeys())
      if (isEdit) {
        this.role.role_auth = checkedKeys
        const _d = {}
        _d.role_id = this.role.id
        _d.role_name = this.role.role_name
        _d.role_describe = this.role.role_describe
        _d.role_auth = this.role.role_auth
        updateRole(_d).then(res => {
          if (res.status == 'S') {
            this.$notify({
              title: 'Success',
              message: '编辑成功',
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
          this.downloadLoading = false
          this.getList()
          this.role = {}
          this.dialogVisible = false
        })
      } else {
        this.role.role_auth = checkedKeys
        addRole(this.role).then(res => {
          if (res.status == 'S') {
            this.$notify({
              title: 'Success',
              message: '添加成功',
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
          this.downloadLoading = false
          this.getList()
          this.role = {}
          this.dialogVisible = false
        })
      }
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
