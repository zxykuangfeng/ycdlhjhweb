console.log("typeof window:", typeof window); // 检查是否有 `window` 对象
console.log("typeof document:", typeof document); 
console.log("Element:", Element); // 应输出函数或对象

console.log("Element.prototype:", Element.prototype);
// console.log("Element.prototype.attachShadow:", Element.prototype.attachShadow);

// let originShadow = Element.prototype.attachShadow;
// Element.prototype.attachShadow = function (...args) {
//   const shadowRoot = originShadow.call(this, ...args);
//   let style = document.createElement("style");
//   style.innerHTML = "div { display: none !important; }"; // 隐藏所有 div 元素
//   shadowRoot.appendChild(style);
//   return shadowRoot;
// };


import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
// import { mockXHR } from '../mock'

import uploader from 'vue-simple-uploader'
Vue.use(uploader)
// if (process.env.NODE_ENV === 'production') {
//   mockXHR()
// }

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})
import elDragDialog from '@/directive/el-drag-dialog'
Vue.use(elDragDialog)
// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
