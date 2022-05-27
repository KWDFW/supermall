<template>
  <div id="app">
    <keep-alive exclude="Detail">
      <router-view></router-view>
      <!-- 根据路由信息，跳转到不同的页面 -->
    </keep-alive>
    <!-- keep-alive:使页面跳转后仍保持原来的状态 -->
    <main-tab-bar></main-tab-bar>
  </div>
</template>

<script>
  import MainTabBar from './components/content/mainTabbar/MainTabBar.vue'

  export default {
    name: 'App',
    components: {
      MainTabBar
    }
  }
</script>

<style scoped>
  @import "./assets/css/base.css";
</style>