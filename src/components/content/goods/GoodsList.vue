<template>
  <div class="goods">
    <goods-list-item
    v-for="(item,index) in goods" :key="index"
    :goodsItem="item"></goods-list-item>
  </div>
</template>

<script>
  import GoodsListItem from './GoodsListItem.vue'

  export default {
    name:'GoodsList',
    components: {
      GoodsListItem
    },
    props:{
      goods:{
        type:Array,
        dafault(){
          return []
        }
      }
      //从home接受到商品数据
    }
  }
</script>

<style scoped>
  .goods{
    display:flex;
    flex-wrap: wrap;
    justify-content: space-around;

    padding: 2px;
  }

</style>