<template>
  <div class="panel">
    <div class="head">
      <div class="title">
        <i class="el-icon-tickets"></i>
        {{title}}
      </div>
      <div v-if="icon" class="el-icon-info right"></div>
      <el-button v-if="btn" type="text" class="btn">打印表格</el-button>
    </div>
    <slot />
  </div>
</template>

<script>
/**
 * 卡片头公用组件
 *
 * title: panel容器的标题
 * icon: 是否需要右侧的小图标
 * btn: 是否需要打印表格的按钮
 */
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    icon: {
      type: Boolean,
      default: false
    },
    btn: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.panel {
  overflow: hidden;
  .head {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid rgba(224, 224, 224, 1);
    .title {
      float: left;
      margin-left: 20px;
      font-size: 16px;
      i {
        font-size: 18px;
      }
    }
    .right {
      float: right;
      height: 100%;
      margin-right: 43px;
      margin-top: 30px;
      font-size: 14px;
    }
    .btn {
      float: right;
      color: blue;
      margin-right: 60px;
      margin-top: 20px;
      font-size: 18px;
    }
  }
}
</style>
