<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <home-swiper :banners="banners"></home-swiper>
    <recommend-view :recommends="recommends"></recommend-view>
    <feature-view></feature-view>
    <tab-control class="tab-control" :titles="['流行','新款','精选']"></tab-control>
  </div>
</template>

<script>
  import HomeSwiper from './childComps/HomeSwiper.vue'
  import RecommendView from '@/views/home/childComps/RecommendView.vue'
  import FeatureView from '@/views/home/childComps/FeatureView.vue'

  import NavBar from '../../components/common/navbar/NavBar.vue'
  import TabControl from '../../components/content/tabControl/TabControl.vue'


  import {getHomeMultidata} from '../../network/home.js'

  export default {
    name:'Home',
    components: {
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabControl
    },
    data(){
      return{
        banners:[],
        recommends:[]
      }
    },
    created () {
      getHomeMultidata().then(res=>{
        this.banners=res.data.banner.list
        this.recommends=res.data.recommend.list
      })
    }
  }
</script>

<style>
  #home{
    padding-top: 44px;
    padding-bottom: 4000px;
    /* 暂时显示滚动条 */
  }

  .home-nav{
   background-color: var(--color-tint); 
   color:white;

   position: fixed;
   left:0;
   right: 0;
   top: 0;
   z-index: 9;
  }

  .tab-control{
    position: sticky;
    top:44px;
  }
</style>