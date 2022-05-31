<template>
   <nav-bar class="nav-bar">
       <div slot="center">商品分类</div>
   </nav-bar>
</template>

<script>
import NavBar from '../../../components/common/navbar/NavBar.vue'
export default {
  components: { NavBar },
  name:'categoryNavBar',

}
</script>

<style socped>
  .nav-bar {
     background-color: var(--color-tint);
     color: #fff;
  }
</style>