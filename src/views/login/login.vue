<template>
  <div class="login">
    <div class="login_box">
      <!--      头像区域-->
      <div class="avatar_box">
        <img src="../../assets/icon/cygn_ xstx.svg" alt="">
      </div>
      <!--      登录表单区域-->
      <el-form class="login_from" :model="form" :rules="rules" ref="loginFromRef">
        <!--        用户-->
        <el-form-item class="from_user" prop="username">
          <el-input prefix-icon="iconfont icon-yonghu"
                    v-model="form.username"
          ></el-input>
        </el-form-item>
        <!--        密码-->
        <el-form-item class="from_password" prop="password">
          <el-input prefix-icon="iconfont icon-mimabeifen"
                    v-model="form.password"
                    type="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="button">
          <el-button type="primary" plain @click="login">登录</el-button>
          <el-button type="info" plain @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {Login} from "../../network/login";

  export default {
    name: "login",
    data() {
      return {
        form: {
          username: 'admin',
          password: '123456',
        },
        rules: {
          username: [
            {required: true, message: '请输入用户名称', trigger: 'blur'},
            {min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入用户密码', trigger: 'blur'},
            {min: 6, max: 15, message: '长度在 6 到 15个字符', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      reset() {
        this.$refs.loginFromRef.resetFields();
      },
      login() {
        Login(this.form).then(res => {
          // console.log(res);
          if (res.meta.status !== 200) return this.$message.error('登陆失败')
          this.$message.success('登陆成功!')
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
        })
      }
    }
  }
</script>

<style scoped>
  .login {
    height: 100%;
    background-color: #2b4b6b;
  }

  .login_box {
    width: 666px;
    height: 450px;
    background-color: white;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .avatar_box {
    width: 100px;
    height: 100px;
    border: 1px solid #eeeeee;
    border-radius: 50%;
    padding: 8px;
    box-shadow: 0 0 10px lightgray;
    position: absolute;
    left: 50%;
    transform: translate(-50%);
  }

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eeeeee;
  }

  .login_from {
    position: absolute;
    bottom: 10%;
    width: 100%;
    padding: 0 40px;
    box-sizing: border-box;
  }

  .from_user {
    padding-bottom: 30px;
  }

  .button {
    display: flex;
    justify-content: flex-end;
    padding-top: 10px;
  }

</style>