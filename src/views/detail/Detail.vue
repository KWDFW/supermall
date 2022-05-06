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
      BackTop
    },
    data(){
      return {
        iid:null,
        topImages:null,
        goods:{},
        shop:{},
        detailInfo:{},
        paramInfo:{},
        commentInfo:{},
        recommends:[],
        themeTopYs:[],
        currentIndex:0,
        isShowBackTop:false,
      }
    },
    created () {
      this.iid=this.$route.params.iid

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

      getRecommend().then(res=>{
        this.recommends=res.data.list
      })

    },
    mouned () {//初始时默认点击一下商品
      this.titleClick(0)
    },
    methods: {
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
      },

      contentScroll(position){
        const positionY=-position.y
        for(let i=0;i<this.themeTopYs.length-1;i++){
          //if中条件是为了处理边界条件
          if(this.currentIndex!==i&&positionY>=this.themeTopYs[i]
          &&positionY<this.themeTopYs[i+1]){
            this.currentIndex=i
            //currentIndex是为了减少判断次数
            this.$refs.nav.currentIndex=this.currentIndex
          }
        }

        this.isShowBackTop=(-position.y)>1000
        
      },

      backClick(){
        this.$refs.scroll.scrollTo(0,0)
      },

      addToCart(){
        const product={}
        product.image=this.topImages[0]
        product.title=this.goods.title
        product.desc=this.goods.desc
        product.price=this.goods.realPrice
        product.iid=this.iid

        // this.$store.commit('addCart',product)
      }
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