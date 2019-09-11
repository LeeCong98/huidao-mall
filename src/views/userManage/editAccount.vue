<template>
  <div class="root-container addNewCard-container">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      class="addNewCard-form"
      label-position="left"
      :show-message="true"
    >
      <el-form-item label="头像" prop="avatar" :hide-required-asterisk="true">
        <el-upload
          class="avatar-uploader"
          :action="$store.state.singleUpload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          style="border-radius: 50%;"
          :limit="1"
        >
          <img v-if="ruleForm.avatar" :src="ruleForm.avatar" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="客户名" prop="userName" :hide-required-asterisk="true">
        <el-input v-model="ruleForm.userName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="客户昵称" prop="nickName" :hide-required-asterisk="true">
        <el-input v-model="ruleForm.nickName" placeholder="请输入用户昵称"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile" :hide-required-asterisk="true">
        <el-input placeholder="手机号不建议修改" v-model="ruleForm.mobile"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email" :hide-required-asterisk="true">
        <el-input placeholder="邮箱不建议修改" v-model="ruleForm.email"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex" :hide-required-asterisk="true">
        <el-radio v-model="ruleForm.sex" :label="1">男</el-radio>
        <el-radio v-model="ruleForm.sex" :label="2">女</el-radio>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">更新</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button @click="backManage">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { examineItem, alertInfo } from '../../assets/js/common'
import ClientModel from './../../Http/userManage/clientManage/clientManage'
/**
 * 数据分配
 */
function assignValue (data) {
  // 数据返现
  for (var key in this.ruleForm) {
    if (key !== 'userName' || key !== 'avatar' || key !== 'sex') {
      this.ruleForm[key] = data[key]
    }
  }
  this.ruleForm.sex = data.sex === '男' ? 1 : 0
  this.ruleForm.userName = data.cLoginName
  this.ruleForm.avatar = data.img
}
const clientModel = new ClientModel()
export default {
  name: 'addNewCard',
  data () {
    return {
      ruleForm: {
        nickName: '',
        mobile: '',
        sex: [],
        avatar: '',
        email: null
      },
      rules: {
        userName: [{ message: '请输入客户名', trigger: 'blur' }],
        nickName: [
          { required: true, message: '请输入客户昵称', trigger: 'blur' },
          {
            min: 2,
            max: 8,
            message: '请输入符合规则的昵称，最大6个字符，最小两个字符',
            trigger: 'blur'
          }
        ],
        avatar: [
          {
            required: true,
            min: 5,
            max: 100,
            message: '头像不能为空',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入符合规范的手机号',
            trigger: 'blur'
          },
          {
            min: 11,
            max: 11,
            message: '请输入符合规范的手机号',
            trigger: 'blur'
          }
        ],
        sex: [
          {
            required: true,
            type: 'number',
            message: '请选择性别',
            trigger: 'change'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  methods: {
    handleAvatarSuccess (file) {
      if (file.data !== undefined) {
        this.ruleForm.avatar = file.data
      } else {
        alertInfo.call(this, {
          type: 'error',
          cont: '文件上传失败！'
        })
      }
    },
    backManage () {
      // 返回路由
      this.$confirm('你确定放弃编辑吗', '警告', {
        confirmButtonText: '返回用户页面',
        cancelButtonText: '继续编辑',
        type: 'warning',
        lockScroll: false
      })
        .then(() => {
          // 返回管理页
          this.$router.back(-1)
        })
        .catch(() => {})
    },
    // 表单数据效验
    formInfoVerify () {
      // 对应的错误信息表
      for (var key in this.rules) {
        if (examineItem.call(this['ruleForm'], key)) {
          alertInfo.call(this, {
            type: 'error',
            cont: this.rules[key][0].message
          })
          return false
        }
      }
      return true
    },
    // 组织个人信息
    assignSendInfo () {
      return {
        nickName: this.ruleForm.nickName,
        mobile: this.ruleForm.mobile,
        sex: this.ruleForm.sex === 1 ? '男' : '女',
        img: this.ruleForm.avatar,
        email: this.ruleForm.email,
        cId: this.$route.query.id
      }
    },
    // 编辑成功
    updatePrompt (text) {
      this.$confirm(text, '提示', {
        confirmButtonText: '返回用户管理页',
        cancelButtonText: '继续编辑',
        type: 'success',
        lockScroll: false
      })
        .then(() => {
          this.$router.go(-1)
        })
        .catch(() => {})
    },
    // 表单提交验证
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.formInfoVerify()) {
            return false
          }
          let newInfo = this.assignSendInfo()
          clientModel.updateUserInfo(
            newInfo,
            ({ data: { data, message } }) => {
              assignValue.call(this, data)
              this.updatePrompt('修改成功')
            },
            () => {
              alertInfo.call(this, {
                type: 'error',
                cont: '更新失败'
              })
            }
          )
          // 调用接口更新数据
        } else {
          return false
        }
      })
      // 执行添加操作
    },
    // 重置表单
    resetForm (formName) {
      for (var key in this[formName]) {
        if (key !== 'userName') {
          this[formName][key] = ''
        }
      }
    },
    // 获取返原数据
    getOriginalInfo (id) {
      clientModel.getUserInfoById(
        {
          id: id
        },
        ({ data: { message, data } }) => {
          if (message === '成功') {
            assignValue.call(this, data)
          } else {
            alertInfo.call(this, {
              type: 'error',
              cont: '获取数据失败！'
            })
          }
        },
        () => {
          alertInfo.call(this, {
            type: 'error',
            cont: '获取数据失败！'
          })
        }
      )
    }
  },
  created () {
    // 数据复现
    if (this.$route.query.id !== undefined) {
      this.getOriginalInfo(this.$route.query.id)
    } else {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.addNewCard-container {
  padding: 50px 0;
  padding-left: 30px;
  background-color: white;
  .addNewCard-form {
    width: 50%;
    margin: 0px auto;
    border: 1px solid #ebeef5;
    padding: 40px;
    .avatar-uploader {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background-color: rgb(240, 240, 242);
      position: relative;

      .avatar-uploader-icon,
      .avatar {
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        position: absolute;
        display: block;
      }
      .avatar {
        border-radius: 50%;
      }
      .avatar-uploader-icon::before {
        left: 50%;
        top: 50%;
        display: block;
        position: absolute;
        transform: translate(-50%, -50%);
      }
    }
  }
}
</style>
