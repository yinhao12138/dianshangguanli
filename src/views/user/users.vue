<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片区域-->
    <el-card>
      <!--      添加搜索区域-->
      <el-row :gutter="30">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUser">
            <el-button slot="append" icon="el-icon-search" @click="getUser"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!--用户列表区域-->
      <el-table :data="userlist" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
                v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">修改
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"
                       @click="removeUserById(scope.row.id)">删除
            </el-button>
            <el-tooltip
                class="item"
                effect="dark"
                content="分配角色"
                placement="top"
                :enterable="false"
            >
              <el-button
                  type="warning"
                  icon="el-icon-setting"
                  size="mini"
                  @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--      分页区域-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>
    <!--    添加用户的对话框-->
    <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClose"
    >
      <el-form :model="addFrom" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addFrom.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addFrom.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addFrom.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible= false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
    </el-dialog>
    <!--    修改用户的对话框-->
    <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClose"
    >
      <el-form :model="editFrom" :rules="addFormRules" ref="editFromRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editFrom.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editFrom.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible=false">取 消</el-button>
    <el-button type="primary" @click="modifyUser">确 定</el-button>
  </span>
    </el-dialog>
    <!--    分配角色的对话框-->
    <el-dialog
        title="分配角色"
        :visible.sync="setRoleDialogVisible"
        width="50%"
        @close="setRoleDialogClosed"
    >
      <div>
        <p>当前用户:{{userInfo.username}}</p>
        <p>当前角色:{{userInfo.role_name}}</p>
        <p>分配新角色:
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
                v-for="item in rolesList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="savaRoleInfo">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import {User, status, addUser, deleteUser, modifyUser, delUser, setRole, savaRoleInfo} from "../../network/users";

  export default {
    name: "users",
    data() {
      var checkEmail = (rule, value, callback) => {
        const regEmail = /^\w+@\w+(\.\w+)+$/
        if (regEmail.test(value)) {
          // 合法邮箱
          return callback()
        }
        callback(new Error('请输入合法邮箱'))
      }
      const checkMobile = (rule, value, callback) => {
        const regMobile = /^1[34578]\d{9}$/
        if (regMobile.test(value)) {
          return callback()
        }
        // 返回一个错误提示
        callback(new Error('请输入合法的手机号码'))
      }
      return {
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 5
        },
        userlist: [],
        total: 0,
        //对话框的隐藏
        addDialogVisible: false,
        editDialogVisible: false,
        //添加用户表单数据
        addFrom: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        //控制分配角色的显示与隐藏
        setRoleDialogVisible: false,
        userInfo: {},
        rolesList: [],
        editFrom: {},
        selectedRoleId: '',
        //添加用户的验证规则对象
        addFormRules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入用户密码', trigger: 'blur'},
            {min: 6, max: 15, message: '长度在 6 到 15个字符', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入用户邮箱', trigger: 'blur'},
            {validator: checkEmail, trigger: 'blur'}
          ],
          mobile: [
            {required: true, message: '请输入用户手机', trigger: 'blur'},
            {validator: checkMobile, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      //根据id删除对应的用户信息
      removeUserById(id) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delUser(id).then(res => {
            // console.log(res);
            if (res.meta.status !== 200) {
              return this.$message.error('删除用户失败！')
            }
            this.$message.success('删除用户成功！')
            this.getUser()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
      ,
      //监听修改用户对话框的关闭事件
      editDialogClose() {
        this.$refs.editFromRef.resetFields();
      }
      ,
      //监听添加用户对话框的关闭事件
      addDialogClose() {
        this.$refs.addFormRef.resetFields();
      }
      ,
      //监听pagesize的改变事件
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getUser()
      }
      ,
      //监听 页面值 改变值
      handleCurrentChange(newPag) {
        this.queryInfo.pagenum = newPag
        this.getUser()
      }
      ,
      // 请求
      getUser() {
        User(this.queryInfo).then(res => {
          // console.log(res);
          if (res.meta.status !== 200) {
            return this.$message.error('获取参数失败！')
          }
          this.userlist = res.data.users
          this.total = res.data.total
        })
      }
      ,
      //监听wiitch开关状态的改变
      userStateChange(userInfo) {
        status(userInfo).then(res => {
          if (res.meta.status !== 200) {
            userInfo.mg_sate = !userInfo.mg_sate
            return this.$message.error('更新用户失败！')
          }
          this.$message.success('更新用户成功')
        })
      }
      ,
      //点击 添加新用户请求
      addUser() {
        this.$refs.addFormRef.validate(valid => {
          if (!valid) return
          addUser(this.addFrom).then(res => {
            console.log(res);
            if (res.meta.status !== 201) {
              return this.$message.error('添加用户失败！')
            }
            this.$message.success('添加用户成功')
            //隐藏对话框
            this.addDialogVisible = false
            this.getUser()
          })
        })
      }
      ,
      //修改用户的对话框
      showEditDialog(id) {
        deleteUser(id).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('修改用户信息失败！')
          }
          this.editFrom = res.data
        })
        this.editDialogVisible = true
      }
      ,
      //修改用户信息并请求
      modifyUser() {
        this.$refs.editFromRef.validate(valid => {
          if (!valid) return
          modifyUser(this.editFrom).then(res => {
            // console.log(res);
            if (res.meta.status !== 200) {
              return this.$message.error('更新用户信息失败！')
            }
            this.editDialogVisible = false
            this.getUser()
            return this.$message.success('更新用户信息成功！')
          })
        })
      },
      //展示分配角色的对话框
      setRole(userInfo) {
        this.userInfo = userInfo
        //再展示对话框之前，获取所有角色列表
        setRole().then(res => {
          if (res.meta.status !== 200)
            return this.$message.error('获取角色列表失败！')
          this.rolesList = res.data
        })
        this.setRoleDialogVisible = true
      },
      savaRoleInfo() {
        if (!this.selectedRoleId) {
          return this.$message.error('更新角色失败')
        }
        savaRoleInfo(this.userInfo, this.selectedRoleId).then(res => {
          this.$message.success('更新角色成功')
          this.getUser()
          this.setRoleDialogVisible = false
        })
      },
      setRoleDialogClosed() {
        this.selectedRoleId = ''
        this.userInfo = {}
      }
    },

    created() {
      this.getUser()
    }
  }
</script>

<style scoped>
</style>