<template>
  <div class="menu-list">
    <scroll ref="scroll" class="content">
      <div class="menu-list-item"
        :class="{active: index === currentIndex}"
        v-for="(item,index) in categories" :key="index"
        @click="itemClick(index)">
        {{item.title}}
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from "../../../components/common/scroll/Scroll.vue";

export default {
  name: "TabMenu",
  components: {
    Scroll,
  },
  props: {
    categories: Array,
  },
  data() {
    return {
      currentIndex: 0,
    };
  },
  activated() {
    this.$refs.scroll.refresh();
  },
  methods: {
    itemClick(index) {
      this.currentIndex = index;
      this.$emit('selectItem', index);
    },
  },
};
</script>

<style scoped>
  .content {
    background-color: #f6f6f6;
    height: 100%;
    width: 100px;
    box-sizing: border-box;
    position: absolute;
    top:44px;
    bottom: 49px;
    left:0;
    right:0;

    overflow: hidden;
  }

  
  .menu-list-item {
    height: 45px;
    line-height: 45px;
    text-align: center;
    font-size: 14px;
  }

  .menu-list-item.active {
    font-weight: 700;
    color: var(--color-high-text);
    background-color: #fff;
    border-left: 3px solid var(--color-high-text);
  }

  .menu-list {
    height: calc(100% - 44px - 49px - 40px);
  }
</style>