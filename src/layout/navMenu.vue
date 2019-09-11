<template>
  <el-menu
    :default-active="this.$route.name | routerName"
    class="el-menu-vertical-demo"
    style="border: none;"
    :collapse="isCollapse"
    :collapse-transition="false"
  >
    <el-menu-item style="height: 100px; line-height: 100px;">
      <i>
        <a href="/" id="logo">
          <svg width="28" height="28" class="tanuki-logo" viewBox="0 0 36 36">
            <path
              class="tanuki-shape tanuki-left-ear"
              fill="#e24329"
              d="M2 14l9.38 9v-9l-4-12.28c-.205-.632-1.176-.632-1.38 0z"
            />
            <path
              class="tanuki-shape tanuki-right-ear"
              fill="#e24329"
              d="M34 14l-9.38 9v-9l4-12.28c.205-.632 1.176-.632 1.38 0z"
            />
            <path class="tanuki-shape tanuki-nose" fill="#e24329" d="M18,34.38 3,14 33,14 Z" />
            <path
              class="tanuki-shape tanuki-left-eye"
              fill="#fc6d26"
              d="M18,34.38 11.38,14 2,14 6,25Z"
            />
            <path
              class="tanuki-shape tanuki-right-eye"
              fill="#fc6d26"
              d="M18,34.38 24.62,14 34,14 30,25Z"
            />
            <path
              class="tanuki-shape tanuki-left-cheek"
              fill="#fca326"
              d="M2 14L.1 20.16c-.18.565 0 1.2.5 1.56l17.42 12.66z"
            />
            <path
              class="tanuki-shape tanuki-right-cheek"
              fill="#fca326"
              d="M34 14l1.9 6.16c.18.565 0 1.2-.5 1.56L18 34.38z"
            />
          </svg>
        </a>
      </i>
      <template slot="title">
        <span style="margin-left: 10px;color: #f55d54;font-size: 18px;">汇道商管理平台</span>
      </template>
    </el-menu-item>
    <el-submenu index="1">
      <template slot="title">
        <i class="el-icon-pie-chart"></i>
        <span>统计</span>
      </template>
      <router-link tag="li" :to="{ name: 'userAnalyze' }">
        <el-menu-item index="userAnalyze">用户分析</el-menu-item>
      </router-link>
      <router-link tag="li" :to="{ name: 'orderAnalyze' }">
        <el-menu-item index="orderAnalyze">订单分析</el-menu-item>
      </router-link>
    </el-submenu>
    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-folder"></i>
        <span>用户管理</span>
      </template>
      <router-link tag="li" :to="{ name: 'clientManage' }">
        <el-menu-item index="clientManage">客户管理</el-menu-item>
      </router-link>
      <router-link tag="li" :to="{ name: 'cardManage' }">
        <el-menu-item index="cardManage">卡券管理</el-menu-item>
      </router-link>
      <router-link tag="li" :to="{ name: 'activityManage' }">
        <el-menu-item index="activityManage">活动管理</el-menu-item>
      </router-link>
    </el-submenu>
    <el-submenu index="3">
      <template slot="title">
        <i class="el-icon-folder"></i>
        <span>商品管理</span>
      </template>
      <router-link tag="li" :to="{ name: 'commodityManage' }">
        <el-menu-item index="commodityManage">商品管理</el-menu-item>
      </router-link>
      <router-link tag="li" :to="{ name: 'sortManage' }">
        <el-menu-item index="sortManage">分类管理</el-menu-item>
      </router-link>
    </el-submenu>
    <el-submenu index="4">
      <template slot="title">
        <i class="el-icon-folder"></i>
        <span>订单管理</span>
      </template>
      <router-link tag="li" :to="{ name: 'orderManage' }">
        <el-menu-item index="orderManage">订单管理</el-menu-item>
      </router-link>
    </el-submenu>
    <el-submenu index="5" :disabled="$store.state.authority | authority">
      <template slot="title">
        <i class="el-icon-setting"></i>
        <span>设置</span>
      </template>
      <router-link tag="li" :to="{ name: 'account' }">
        <el-menu-item index="account">账户管理</el-menu-item>
      </router-link>
      <router-link tag="li" :to="{ name: 'permission' }">
        <el-menu-item index="permission">权限管理</el-menu-item>
      </router-link>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  props: {
    isCollapse: {
      type: Boolean,
      default: false
    }
  },
  filters: {
    // 进入子路由依然选中navMenu
    routerName (value) {
      // role: 所有子路由的后缀加在这个数组中，且name必须由父路由和后缀组成
      const arr = [
        'Add',
        'Update',
        'Info',
        'Edit',
        'NewCardCustomer',
        'UserOrder'
      ]
      for (let i = 0; i < arr.length; i++) {
        if (value.indexOf(arr[i]) !== -1) {
          return value.replace(arr[i], '')
        }
      }
      return value
    },
    authority (value) {
      if (value && value.indexOf('SettingPermissions') !== -1) {
        return false
      }
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.navLeft {
  overflow: hidden;
}
.is-active {
  color: #f55d54 !important;
}
.el-menu-vertical-demo .el-menu-item {
  min-width: 0;
}
</style>
