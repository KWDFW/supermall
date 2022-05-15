<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick"
    ref="nav"></detail-nav-bar>
    <scroll class="content" ref="scroll" @scroll="contentScroll"
    :probeType="3">
      <detail-swiper :topImages="topImages"></detail-swiper>

      <detail-base-info :goods="goods"></detail-base-info>

      <detail-shop-info :shop="shop"></detail-shop-info>

      <detail-goods-info :detail-info="detailInfo"
      @imageLoad="imageLoad"></detail-goods-info>

      <detail-param-info :param-info="paramInfo"
      ref="params"></detail-param-info>

      <detail-comment-info :comment-info="commentInfo"
      ref="comment"></detail-comment-info>

      <goods-list :goods="recommends"
      ref="recommend"></goods-list>
    </scroll>
    <detail-bottom-bar @addToCart="addToCart"></detail-bottom-bar>

    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>

    <!-- <toast :message="message" :show="show"></toast> -->
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar.vue'
  import DetailSwiper from './childComps/DetailSwiper.vue'
  import DetailBaseInfo from './childComps/DetailBaseInfo.vue'
  import DetailShopInfo from './childComps/DetailShopInfo.vue'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo.vue'
  import DetailParamInfo from './childComps/DetailParamInfo.vue'
  import DetailCommentInfo from './childComps/DetailCommentInfo.vue'
  import DetailBottomBar from './childComps/DetailBottomBar.vue'

  import Scroll from '../../components/common/scroll/Scroll.vue'
  import GoodsList from '../../components/content/goods/GoodsList.vue'
  import BackTop from '../../components/content/backTop/BackTop.vue'

  import {getDetail,Goods,Shop,GoodsParam,getRecommend} from '../../network/detail.js'
  //引用包含商品信息的

  import { mapActions } from 'vuex'

  // import Toast from '../../components/common/toast/toast.vue'

  export default {
    name:'Detail',
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,
      Scroll,
      GoodsList,
      BackTop,
      // Toast
    },
    data(){
      return {
        iid:null,//记录该商品的iid
        topImages:null,//轮播图的图片
        goods:{},//商品基本信息
        shop:{},//商家信息
        detailInfo:{},//商品详细信息
        paramInfo:{},//商品参数
        commentInfo:{},//商品评论信息
        recommends:[],//商品相关推荐
        themeTopYs:[],//记录四个标题到顶点的位置
        currentIndex:0,//记录当前标题的下标值
        isShowBackTop:false,//控制是否显示返回顶部的按钮
        // message:'',
        // show:false
      }
    },
    created () {
      this.iid=this.$route.params.iid
      //获取商品的iid

      getDetail(this.iid).then(res=>{
        const data=res.result
        this.topImages=data.itemInfo.topImages

        this.goods=new Goods(data.itemInfo,data.columns,data.shopInfo.services)

        this.shop=new Shop(data.shopInfo)

        this.detailInfo=data.detailInfo

        this.paramInfo=new GoodsParam(data.itemParams.info,data.itemParams.rule)

        if(data.rate.cRate!==0){//有评论就取出来
          this.commentInfo=data.rate.list[0]
        }

      })
      //获取商品的信息

      getRecommend().then(res=>{
        this.recommends=res.data.list
      })

    },
    mouned () {//初始时默认点击一下商品
      this.titleClick(0)
    },
    methods: {
      ...mapActions(['addCart']),
      //映射函数
      imageLoad(){
        this.$refs.scroll.refresh()
      },

      titleClick(index){
        this.themeTopYs=[]
          
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        this.themeTopYs.push(Number.MAX_VALUE)
        //加入最大值是为了之后的if判断用

        this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],200)
        //间隔200ms之后滚动到相应位置
      },
      //标题被点击之后，实现页面的自动滚动

      contentScroll(position){
        const positionY=-position.y
        for(let i=0;i<this.themeTopYs.length-1;i++){
          //if中条件是为了处理边界条件
          if(this.currentIndex!==i&&positionY>=this.themeTopYs[i]
          &&positionY<this.themeTopYs[i+1]){
            this.currentIndex=i
            //currentIndex是为了减少判断次数
            this.$refs.nav.currentIndex=this.currentIndex
            //父组件访问子组件，改变子组件中的下标值
          }
        }
        //随着页面滚动，改变当前的标题下标

        this.isShowBackTop=(-position.y)>1000
        //显示回到顶部按钮
      },
      //页面发生滚动时，调用该函数

      backClick(){
        this.$refs.scroll.scrollTo(0,0)
      },
      //点击后回到顶部

      addToCart(){
        const product={}
        product.image=this.topImages[0]
        product.title=this.goods.title
        product.desc=this.goods.desc
        product.price=this.goods.realPrice
        product.iid=this.iid
        

        this.addCart(product).then(res=>{
          // this.show=true
          // this.message=res

          // setTimeout(() => {
          //   this.show=false
          //   this.message=''
          // },1500);

          this.$toast.show(res,1000)
        })
        //点击添加购物车时，显示提示信息

        // this.$store.dispatch('addCart',product).then(res=>{
        //   console.log(res);
        // })
        //利用vuex把信息存储在product里面
      }
      //点击后添加商品到购物车
    }
  }
</script>

<style scoped>
  #detail{
    position:relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav{
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content{
    height: calc(100% - 44px - 49px);
  }
</style>