<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>

    <tab-control 
        ref="tabControl1"
        :titles="['流行','新款','精选']"
        @tabClick="tabClick"
        class="tab-control"
        v-show="isTabFixed"></tab-control>

    <scroll class="content" 
      ref="scroll" 
      :probe-type="3" 
      @scroll="contentScroll"
      :pull-up-load="true"
      @pullingUp="loadMore">

      <home-swiper :banners="banners"
      @swiperImageLoad="swiperImageLoad"></home-swiper>

      <recommend-view :recommends="recommends"></recommend-view>

      <feature-view></feature-view>

      <tab-control 
        ref="tabControl2"
        :titles="['流行','新款','精选']"
        @tabClick="tabClick"></tab-control>

      <goods-list :goods="showGoods"></goods-list>
      <!-- 展示商品列表 -->

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

  import {debounce} from '@/common/ultils.js'


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
        isTabFixed:false,
        tabOffsetTop:0,
        //tabControl距离顶端的距离
        saveY:0
        //当切换路由时，保存当前的Y值
      }
    },
    computed: {
      showGoods(){
        return this.goods[this.currentType].list
      }
      //返回应该展示的商品列表
    },
    created () {
      this.getHomeMultidata()
      //创建home时获取数据

      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
      //创建home时获取商品数据

      
    },
    mounted () {
      const refresh=debounce(this.$refs.scroll.refresh,500)
      //封装一个防抖函数

      this.$bus.$on('itemImageLoad',()=>{
        refresh()
      })
      //当图片加载完成之后，通过刷新来确定窗口的高度

    },
    activated () {
      //当前路由处于激活状态时，回到之前保存的位置
      this.$refs.scroll.refresh()
      this.$refs.scroll.scrollTo(0,this.saveY,0)
    },
    deactivated () {
      // 当前路由失去激活状态时，记录当前的位置
      this.saveY=this.$refs.scroll.getScrollY()
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
        this.$refs.tabControl1.currentIndex=index
        this.$refs.tabControl2.currentIndex=index
      },
      //实现tabControl中的切换页面功能

      backClick(){
        this.$refs.scroll.scrollTo(0,0)
      },
      //调用scroll中的scrollTo方法

      contentScroll(position){
        this.isShowBackTop=(-position.y)>1000
        //是否展示返回顶部按钮
        this.isTabFixed=(-position.y)>this.tabOffsetTop
        //是否要固定tab
      },
      //根据position判断是否展示某些元素

      loadMore(){
        this.getHomeGoods(this.currentType)
      },
      //加载更多的页面

      swiperImageLoad(){
        this.tabOffsetTop=this.$refs.tabControl2.$el.offsetTop
        //$el:获取组件中的元素
        //元素中自带属性:offsetTop
      },
      //swiper的图片加载完成后，获取tabControl距顶部的值


      //网络请求相关的方法


      getHomeMultidata(){
        getHomeMultidata().then(res=>{
          this.banners=res.data.banner.list
          this.recommends=res.data.recommend.list
        })
      },
      //获取页面的数据

      getHomeGoods(type){
        const page=this.goods[type].page+1
        getHomeGoods(type,page).then(res=>{
          this.goods[type].list.push(...res.data.list)
          //...可以把一个数组展开成一串数，push可以推入一串数
          this.goods[type].page++

          this.$refs.scroll.finishPullUp()
          //调用结束下拉事件的函数
        })
        //调用网络请求的函数
      },
      //获取新商品列表的数据

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

  /* position: fixed;
   left:0;
   right: 0;
   top: 0;
   z-index: 9; */
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

  .tab-control{
    background-color: #fff;
    position: relative;
    z-index: 9;
  }
</style>