<template>
  <div class="cart">
    <nav-bar class="nav-nar">
      <div slot="center">购物车({{length}})</div>
    </nav-bar>

    <cart-list></cart-list>

    <cart-bottom-bar></cart-bottom-bar>
  </div>
</template>

<script>
  import NavBar from '../../components/common/navbar/NavBar.vue'
  import CartList from '../cart/childComps/CartList.vue'
  import CartBottomBar from '../cart/childComps/CartBottomBar.vue'

  import {mapGetters} from 'vuex'

  export default {
    name:'Cart',
    components: {
      NavBar,
      CartList,
      CartBottomBar
    },
    computed: {
      ...mapGetters({
        length:'cartLength',
        list:'cartList'
      })
      //获取getters中的所有计算属性
    }
  }
</script>

<style scoped>
  .cart{
    height: 100vh;
  }

  .nav-bar{
    background-color: var(--color-tint);
    color: #fff;
  }
</style>