<template>
  <div class="home" ref="home">
    <div class="left">
      <NavMenu :isCollapse="isCollapse"></NavMenu>
    </div>
    <div class="right">
      <el-button
        type="text"
        :class="['btn',isCollapse?'el-icon-s-unfold':'el-icon-s-fold']"
        @click="handleClick"
      ></el-button>
      <Heade @logoOut="backSystem" :name="$store.state.username?$store.state.username:''"></Heade>
      <div class="content">
        <transition
          mode="out-in"
          enter-active-class="animated slideInRight"
          leave-active-class="animated slideOutRight"
          :duration="{ enter: 1000, leave: 100 }"
        >
          <router-view style="overflow: hidden;"></router-view>
        </transition>
      </div>
    </div>
    <next-cmp>
      <a href="#">adasdsad</a>
      <button>zhshi1</button>
    </next-cmp>
  </div>
</template>

<script>
import Heade from '../layout/heade.vue'
import NavMenu from '../layout/navMenu.vue'
import account from './../Http/loginRegister'
import { alertInfo } from './../assets/js/common.js'
export default {
  name: 'home',
  components: {
    Heade,
    NavMenu,
    'next-cmp': {
      render (craeteElement) {
        return craeteElement('div', {}, ['div'])
      }
    }
  },
  data () {
    return {
      isCollapse: false
    }
  },
  methods: {
    handleClick () {
      this.isCollapse = !this.isCollapse
    },
    backSystem () {
      // 清除token
      this.$util.removeLocal('token')
      this.$util.removeLocal('tokenHeader')
      // 检查
      if (!this.$util.getLocal('token')) {
        this.$router.push({
          name: 'login'
        })
      } else {
        // 原生删除
        window.localStorage.removeItem('token')
        window.localStorage.removeItem('tokenHeader')
        this.$router.push({
          name: 'login'
        })
      }
    },
    getUserInfo () {
      account.checkoutLoginStatus.call(
        this,
        { token: this.$util.getLocal('token') },
        alertInfo
      )
    }
  },
  created () {
    this.getUserInfo()
    window.addEventListener('scroll', this.navbarFix)
  },
  mounted () {},
  befroeDestroy () {
    window.removeEventListener('scroll', this.navbarFix)
  }
}
</script>

<style lang="scss">
.home {
  height: 100%;
  width: 100%;
  overflow: hidden;
  .left {
    float: left;
    height: 100%;
    box-sizing: border-box;
    border-right: 1px solid rgb(224, 224, 224);
  }
  .right {
    height: 100%;
    .btn {
      position: absolute;
      top: 30px;
      margin-left: 10px;
      font-size: 30px;
    }
    .content {
      width: 100%;
      padding: 0 10px;
      box-sizing: border-box;
      height: 87%;
      overflow-y: scroll;
    }
    overflow: hidden;
    box-sizing: border-box;
  }
}
</style>
