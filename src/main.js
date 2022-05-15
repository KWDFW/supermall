import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import toast from 'components/common/toast'
// 导出index.js下的插件

Vue.config.productionTip = false

Vue.prototype.$bus=new Vue()
// 定义一个事件总线

Vue.use(toast)
//安装toast插件

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
