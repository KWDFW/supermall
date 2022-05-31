<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name:'Scroll',
    props:{
      probeType:{
        type:Number,
        default:0
      },
      pullUpLoad:{
        type:Boolean,
        default:false
      }
    },
    data(){
      return {
        scroll:null
      }
    },
    mounted () {
      this.scroll=new BScroll(this.$refs.wrapper,{
        click:true,
        probeType:this.probeType,
        pullUpLoad:this.pullUpLoad,
        observeDOM: true,
      })

      if(this.probeType===2||this.probeType===3){
        this.scroll.on('scroll',(position)=>{
          // console.log(position)
          this.$emit('scroll',position)
        })
      }
      //用户滚动时，把scroll和position都发给home

      if(this.pullUpLoad){
        this.scroll.on('pullingUp',()=>{
          this.$emit('pullingUp')
        })
      }
      //当用户上拉时，把pullingUp发给home
    },
    updated () {
      // this.scroll=new BScroll(this.$refs.wrapper,{
      //   click:true
      // })
    },
    methods: {
      scrollTo(x,y,time=300){
        this.scroll.scrollTo(x,y,time)
      },
      //让屏幕指向指定位置

      finishPullUp(){
        this.scroll && this.scroll.finishPullUp()
      },
      //结束上拉事件，使可以多次进行上拉

      refresh(){
        this.scroll && this.scroll.refresh()
        // console.log('aaa');
      },
      //刷新滚轮页面

      getScrollY(){
        return this.scroll ? this.scroll.y : 0
      }
      //获取滚轮的Y的值
    }
  }
</script>
<style scoped>

</style>