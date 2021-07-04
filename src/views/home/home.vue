<template>
  <el-container class="home-container">
    <!--      头部-->
    <el-header style="height: 75px">
      <div>
        <img src="../../assets/icon/guard.png" alt="">
        <span>电商管理系统</span>
      </div>
      <el-button type="info" @click="signout">退出</el-button>
    </el-header>
    <el-container>
      <!--        左侧侧边栏-->
      <el-aside :width="isCollaps?'64px':'250px'" class="aside">
        <!--        菜单栏-->
        <div class="toggle-button" @click="toggle">|||</div>
        <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="blue"
            unique-opened
            :collapse="isCollaps"
            :collapse-transition="false"
            router
            :default-active="activePath"
        >
          <!--          一级菜单-->
          <el-submenu :index="item.id+''" v-for="item in meunlist" :key="item.id">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!--          二级菜单-->
            <el-menu-item
                :index="'/'+subitem.path"
                v-for="subitem in item.children"
                :key="subitem.id"
                @click="savaNavState('/'+subitem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subitem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--        右侧主题栏-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import {Menus} from "../../network/home";

  export default {
    name: "home",
    data() {
      return {
        meunlist: [],
        iconObj: {
          '125': 'iconfont icon-users',
          '103': 'iconfont icon-tijikongjian',
          '101': 'iconfont icon-3702mima',
          '102': 'iconfont icon-danju-tianchong',
          '145': 'iconfont icon-baobiao'
        },
        isCollaps: false,
        activePath: ''
      }
    },
    components: {},
    methods: {
      savaNavState(activePath) {
        window.sessionStorage.setItem('activePath', activePath)
        this.activePath = activePath
      },
      toggle() {
        this.isCollaps = !this.isCollaps
      },
      signout() {
        window.sessionStorage.clear()
        this.$router.push('/login ')
      },
      getMenuList() {
        Menus().then(res => {
          if (res.meta.status !== 200) return this.$message.error(this.meta.msg)
          this.meunlist = res.data
          // console.log(this.meunlist);
        })
      }
    },
    created() {
      this.getMenuList()
      this.activePath = window.sessionStorage.getItem('activePath')
    }
  }
</script>

<style>
  .home-container {
    height: 100%;
  }

  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #eeeeee;
    font-size: 20px;
    background-color: #373d41
  }

  .el-header > div {
    display: flex;
    align-items: center;
  }

  .el-header > div > span {
    margin-left: 15px;
  }

  .el-header img {
    width: 115px;
    height: 135px;
  }

  .toggle-button {
    background-color: #4a5074;
    cursor: pointer;
    color: white;
    letter-spacing: 3px;
    text-align: center;
    line-height: 20px;
    font-size: 10px;
  }

  .el-aside {
    width: 300px;
    background-color: #333744
  }

  .el-menu {
    border: none;
  }

  .el-menu-item {
    font-size: 16px;
  }

  .el-main {
    background-color: #eaedf1
  }

  .iconfont {
    margin-right: 13px;
  }

  .el-submenu__title {
    font-size: 16px !important;
  }
</style>