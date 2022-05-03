<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav"></detail-nav-bar>
    <scroll class="content" ref="scroll">
      <detail-swiper :topImages="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo"></detail-goods-info>
      <detail-param-info :param-info="paramInfo"></detail-param-info>
      <detail-comment-info :comment-info="commentInfo"></detail-comment-info>
    </scroll>
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

  import Scroll from '../../components/common/scroll/Scroll.vue'

  import {getDetail,Goods,Shop,GoodsParam} from '../../network/detail.js'

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
      Scroll
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
    },
    activated () {
      // this.iid=this.$route.params.iid
    },
    methods: {
      imageLoad(){
        this.$refs.scroll.refresh()
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
    height: calc(100% - 44px);
  }
</style>