<template>
  <div class="header">
    <div class="right">
      <span class="name">{{ name }}</span>
      <i class="el-icon-switch-button" style="color: rgba(255, 87, 34, 1);"></i>
      <span class="close" @click="logoutAdmin">退出</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'heade',
  props: {
    name: {
      type: String,
      required: true
    }
  },
  methods: {
    // 退出
    logoutAdmin () {
      this.$emit('logoOut')
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  box-sizing: border-box;
  border: 1px solid rgb(224, 224, 224);
  border-left: none;
   background: white;
  height: 100px;
  line-height: 100px;
  margin-bottom: 20px;
  .right {
    float: right;
    margin-right: 40px;
    > i {
      font-weight: 700;
      font-size: 22px;
      margin-right: 5px;
    }
    .name {
      font-size: 22px;
      margin-right: 40px;
    }
    .close {
      color: rgba(255, 87, 34, 1);
      cursor: pointer;
    }
  }
}
</style>
