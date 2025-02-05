<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog'
export default {
  name: 'App',
  directives: { elDragDialog }
}
</script>
<style lang="scss">
.el-table__header-wrapper .cell {
  font-weight: 500;
  color: #444;
}
.el-form-item__label {
  text-align: right!important;
}
body .el-table th.gutter {
  display: table-cell!important;
}
.fright {
  float: right;
}
@font-face {
  font-family: 'MyFont';
  src: url('./assets/fonts/almmsht.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: "iconfont"; /* Project id 4722439 */
  src: url('./assets/fonts/iconfont.woff2?t=1733903442451') format('woff2'),
       url('./assets/fonts/iconfont.woff?t=1733903442451') format('woff'),
       url('./assets/fonts/iconfont.ttf?t=1733903442451') format('truetype');
}
.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.mmfont{
  font-family: 'MyFont', sans-serif;
}
</style>
