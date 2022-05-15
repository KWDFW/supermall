//定义toast插件
import Toast from './Toast'

const obj={}

obj.install=function(Vue){
  //创建组件构造器
  const toastContrustor=Vue.extend(Toast)

  //创建一个组件对象
  const toast =new toastContrustor()

  //将组件对象挂载到某一个元素上
  toast.$mount(document.createElement('div'))

  //toast.$el对应的是div
  document.body.appendChild(toast.$el)

  Vue.prototype.$toast=toast
}

export default obj