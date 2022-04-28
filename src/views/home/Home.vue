<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>

    <scroll class="content" 
      ref="scroll" 
      :probe-type="3" 
      @scroll="contentScroll"
      :pull-up-load="true"
      @pullingUp="loadMore">
      <home-swiper :banners="banners"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control class="tab-control" 
        :titles="['流行','新款','精选']"
        @tabClick="tabClick"></tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>

    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
  import HomeSwiper from './childComps/HomeSwiper.vue'
  import RecommendView from '@/views/home/childComps/RecommendView.vue'
  import FeatureView from '@/views/home/childComps/FeatureView.vue'

  import NavBar from '../../components/common/navbar/NavBar.vue'
  import TabControl from '../../components/content/tabControl/TabControl.vue'
  import GoodsList from '../../components/content/goods/GoodsList.vue'
  import Scroll from '../../components/common/scroll/Scroll.vue'
  import BackTop from '../../components/content/backTop/BackTop.vue'

  import {
    getHomeMultidata,
    getHomeGoods
    } from '../../network/home.js'


  export default {
    name:'Home',
    components: {
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },
    data(){
      return{
        banners:[],
        recommends:[],
        goods:{
          'pop':{page:0,list:[]},
          'new':{page:0,list:[]},
          'sell':{page:0,list:[]},
        },
        currentType:'pop',
        isShowBackTop:false,
      }
    },
    computed: {
      showGoods(){
        return this.goods[this.currentType].list
      }
    },
    created () {
      this.getHomeMultidata()
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
    },
    methods: {
      //事件监听相关的方法
      tabClick(index){
        switch(index){
          case 0:
            this.currentType='pop'
            break
          case 1:
            this.currentType='new'
            break
          case 2:
            this.currentType='sell'
        }
      },

      backClick(){
        this.$refs.scroll.scrollTo(0,0)
        // console.log(this.$refs.scroll.scroll.scrollTo(0,0,500))
      },

      contentScroll(position){
        this.isShowBackTop=(-position.y)>1000
      },

      loadMore(){
        this.getHomeGoods(this.currentType)
      },

      //网络请求相关的方法
      getHomeMultidata(){
        getHomeMultidata().then(res=>{
          this.banners=res.data.banner.list
          this.recommends=res.data.recommend.list
        })
      },
      getHomeGoods(type){
        const page=this.goods[type].page+1   
        getHomeGoods(type,page).then(res=>{
          this.goods[type].list.push(...res.data.list)
          //...可以把一个数组展开成一串数，push可以推入一串数
          this.goods[type].page++

          this.$refs.scroll.finishPullUp()
        })
      },

    }
  }
</script>

<style scoped>
  #home{
    /* padding-top: 44px; */
    height:100vh;
    position: relative;
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
    /* position: sticky; */
    top:44px;
    z-index:9;
    /* background-color: white; */
  }

  .content{
    /* height:5355px; */
    overflow: hidden;
    /* margin-top: 44px; */

    position: absolute;
    top:44px;
    bottom: 49px;
    left:0;
    right:0;
    /* height:10000px;*/

    /* height: calc(100% - 93px);
    overflow: hidden;
    margin-top: 44px; */
  }

  
</style>