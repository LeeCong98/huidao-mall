<template>
  <div class="login">
    <div class="container-sill">
      <div class="head">渠道商管理平台</div>
      <el-tabs
        v-model="activeName"
        :stretch="true"
        class="tabs-container"
        @tab-click="enterRegister"
      >
        <el-tab-pane label="登陆" name="login">
          <el-form :model="loginForm" status-icon :rules="loginRules" ref="loginForm" class="form">
            <el-form-item prop="name" :hide-required-asterisk="true">
              <el-input placeholder="账号" v-model.trim="loginForm.name"></el-input>
            </el-form-item>
            <el-form-item prop="pass" :hide-required-asterisk="true">
              <el-input
                type="password"
                placeholder="密码"
                v-model.trim="loginForm.pass"
                autocomplete="off"
                @keydown.enter.native="login('loginForm')"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                style="width: 100%;backgroundColor: #F55D54;border: none;"
                size="medium"
                @click="login('loginForm')"
              >登陆</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="注册" name="register">
          <el-form
            :model="registerForm"
            status-icon
            :rules="registerRules"
            ref="registerForm"
            class="form"
          >
            <el-form-item prop="name" :hide-required-asterisk="true">
              <el-input placeholder="用户名" v-model.trim="registerForm.name"></el-input>
            </el-form-item>
            <el-form-item prop="phone" :hide-required-asterisk="true">
              <el-input
                type="text"
                placeholder="电话号码"
                v-model.number.trim="registerForm.phone"
                :minlength="11"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item prop="rule" :hide-required-asterisk="true">
              <el-select v-model="registerForm.rule" style="width: 100%" placeholder="请选择身份">
                <el-option
                  v-for="item in roleList"
                  :key="item.sysRoleName"
                  :label="item.sysRoleNickname"
                  :value="item.sysRoleId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="pass" :hide-required-asterisk="true">
              <el-input
                type="password"
                placeholder="密码"
                v-model.trim="registerForm.pass"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item prop="checkPass" :hide-required-asterisk="true">
              <el-input
                type="password"
                placeholder="确认密码"
                v-model.trim="registerForm.checkPass"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item prop="validateCode" :hide-required-asterisk="true">
              <el-input
                type="text"
                placeholder="邀请码"
                v-model.trim="registerForm.validateCode"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                style="width: 48%;backgroundColor: #F55D54;border: none;"
                @click="submitForm('registerForm')"
              >注册</el-button>
              <el-button style="width: 48%;" @click="registerHandler('registerForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import account from './../Http/loginRegister'
import { alertInfo } from './../assets/js/common.js'
export default {
  name: 'login',
  // 注册 | 登录 模块值效验，具有复用
  data () {
    var validateName = (rule, value, callback) => {
      if (this.valueExamine(value)) {
        callback(new Error('请输入账号'))
      }
      callback()
    }
    var validatePass = (rule, value, callback) => {
      if (this.valueExamine(value)) {
        callback(new Error('请输入密码'))
      } else {
        if (this.registerForm.checkPass.trim() !== '') {
          this.$refs.registerForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (this.valueExamine(value)) {
        callback(new Error('请再次输入密码'))
      } else if (this.registerForm.pass !== value) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var vaildateRole = function (rule, value, callback) {
      if (typeof value === 'undefined' || value === null) {
        callback(new Error('请选择分类'))
      } else {
        callback()
      }
    }
    const vaildatePhone = function (rule, value, callback) {
      if (typeof value === 'undefined' || value === null) {
        callback(new Error('请输入手机号码'))
      } else if (!/^\d{11}$/g.test(value)) {
        callback(new Error('手机号码不符合格式'))
      } else {
        callback()
      }
    }
    const validateFuncs = function (rule, value, callback) {
      if (typeof value !== 'string') {
        callback(new Error('请输入邀请码进行注册！'))
      } else if (value.length === 0) {
        callback(new Error('请输入邀请码进行注册！'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        name: '',
        pass: ''
      },
      registerForm: {
        name: '',
        phone: null,
        pass: '',
        rule: null,
        checkPass: '',
        validateCode: null
      },
      loginRules: {
        name: [{ validator: validateName, trigger: 'blur' }],
        pass: [{ validator: validatePass, trigger: 'blur' }]
      },
      registerRules: {
        name: [{ validator: validateName, trigger: 'blur' }],
        pass: [{ validator: validatePass, trigger: 'blur' }],
        phone: [{ validator: vaildatePhone, trigger: 'blur' }],
        rule: [{ validator: vaildateRole, trigger: 'blur' }],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }],
        validateCode: [{ validator: validateFuncs, trigger: 'blur' }]
      },
      activeName: 'login',
      roleList: [],
      registerTimer: null,
      loginTimer: null
    }
  },
  methods: {
    // 注册函数
    enterRegister (tabs, event) {
      if (tabs.name === 'register' && this.roleList.length === 0) {
        account.register.getRoleAll(this)
      }
    },
    // 登录函数 以及反馈
    login (formName) {
      if (this.loginTimer !== null) return alertInfo.apply(this, ['loading'])
      this.$refs[formName].validate(valid => {
        if (valid) {
          account.login(
            {
              username: this.loginForm.name,
              password: this.loginForm.pass
            },
            ({ data: { data } }) => {
              // 存入locastorage中
              this.$util.setLocal('token', data.token)
              this.$util.setLocal('tokenHeader', data.tokenHead)
              // 将权限信息出传递到Home中，由Home来决定渲染列表
              alertInfo.call(this, 'loginSuccess')
              this.loginTimer = setTimeout(() => {
                this.$router.push({
                  path: 'home'
                })
                /**
                 * 提交负载将用户名和权限提交到Vuex
                 *
                 */
                this.$store.commit('setUserName', {
                  username: data.sysUserName
                })
                this.$store.commit('setUserAuthority', {
                  authority: data.authorization
                })
              }, 1000)
            },
            () => {
              alertInfo.call(this, 'loginFaild')
            }
          )
        } else {
          return alertInfo.call(this, {
            type: 'error',
            cont: '信息验证失败！'
          })
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    registerHandler (formName) {
      this.$refs[formName].resetFields()
    },
    // 注册效验，结果反馈
    submitForm (formName) {
      this.$refs[formName].validate(vaild => {
        if (vaild && this.registerTimer === null) {
          this.registerTimer = 1
          account.register(
            {
              roleIds: [this.registerForm.rule],
              sysUser: {
                userName: this.registerForm.name,
                userPassword: this.registerForm.checkPass,
                phone: this.registerForm.phone
              },
              code: this.registerForm.validateCode
            },
            ({ data: { data } }) => {
              this.$confirm('注册成功，是否登录', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                lockScroll: false
              })
                .then(() => {
                  this.activeName = 'login'
                })
                .catch(() => {})
              this.registerTimer = null
              this.$refs[formName].resetFields()
            },
            ({ data: { message = '注册失败' } }) => {
              this.registerTimer = null
              alertInfo.call(this, {
                cont: message,
                type: 'error'
              })
            }
          )
        } else {
          alertInfo.call(this, 'registerError')
          return false
        }
      })
    },
    valueExamine (value) {
      if (typeof value === 'string' && value.trim() === '') {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="scss">
.login {
  height: 100%;
  .container-sill {
    text-align: center;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  .head {
    position: relative;
    width: 100%;
    margin-top: 200px;
    font-size: 30px;
    line-height: 44px;
    flex-wrap: wrap;
  }
  .tabs-container {
    margin-top: 30px;
  }
  .el-tabs__active-bar {
    background-color: #8a7e7d;
  }
  .is-active {
    color: #f55d54;
  }
  .form {
    width: 300px;
  }
}
</style>
