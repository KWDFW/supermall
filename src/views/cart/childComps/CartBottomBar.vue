<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button :isChecked="isSelectAll" 
        class="check-botton"
        @click.native="checkClick"></check-button>
      <span>全选</span>
    </div>

    <div class="price">
      合计：{{totalPrice}}
    </div>

    <div class="calculate" @click="calcClick">
      去结算({{checkLength}})
    </div>
  </div>
</template>

<script>
  import CheckButton from '../../../components/content/checkButton/CheckButton.vue'

  import { mapGetters } from 'vuex' 

  export default {
    name:"CartBottomBar",
    components: {
      CheckButton
    },
    computed: {
      ...mapGetters(['cartList']),
      totalPrice(){
        return '￥'+this.cartList.filter(item=>{
          return item.checked//只返回选中的
        }).reduce((preValue,item)=>{
          return preValue+item.price*item.count
        },0)
      },
      checkLength(){
        return this.cartList.filter(item=>item.checked).length
      },
      isSelectAll(){
        if(this.cartList.length===0) return false
        return !(this.cartList.find(item=>!item.checked))
        //如果查到checked的false存在，就返回false
      }
    },
    methods: {
      checkClick(){
        if(this.isSelectAll){
          this.cartList.forEach(item=>item.checked=false)
        }
        else{
          this.cartList.forEach(item=>item.checked=true)
        }
      },
      calcClick(){
        if(!this.cartList.find((item) => item.checked)){
          this.$toast.show('请选择购买的商品',1000)
        }
        //如果未选中商品，则弹出提示框
      }
    }
  }
</script>

<style scoped>
  .bottom-bar{
    position: relative;
    display: flex;
    
    height: 40px;
    line-height: 40px;

    background-color: #eee;

    font-size: 14px;
  }

  .check-content{
    display: flex;
    align-items: center;
    margin-left: 10px;
    width:60px
  }

  .check-botton{
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 5px;
  }

  .price{
    margin-left: 20px;
    flex: 1;
  }

  .calculate{
    width: 90px;
    background-color: red;
    color:#fff;
    text-align: center;
  }
</style>