<template xmlns:el-col="http://www.w3.org/1999/html">
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片视图-->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible=true">添加角色</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!--    角色列表区域-->
    <el-table :data="rolesList" border stripe>
      <!--      展开列-->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row :class="['bdbottom',i1===0?'bdtop':'','vcenter']" v-for="(item1,i1) in scope.row.children"
                  :key="item1.id">
            <!--            渲染一级权限-->
            <el-col :span="5">
              <el-tag
                  closable
                  @close="removeRightById(scope.row,item1.id)"
              > {{item1.authName}}
              </el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!--            渲染二级权限和三级权限-->
            <el-col :span="19">
              <el-row :class="[i2===0?'':'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                <el-col :span="6">
                  <el-tag type="success"
                          closable
                          @close="removeRightById(scope.row,item2.id)"
                  > {{item2.authName}}
                  </el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag type="warning" v-for="(item3,i3) in item2.children"
                          :key="item3.id"
                          closable
                          @close="removeRightById(scope.row,item3.id)"
                  >{{item3.authName}}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <!--      索引列-->
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">修改</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeUserById(scope.row.id)">删除
          </el-button>
          <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--    分配权限-->
    <el-dialog
        title="分配权限"
        :visible.sync="setRightDialogVisible"
        width="50%"
        @close="setRightDialogClosed"
    >
      <!--      树形控件-->
      <el-tree :data="rightList"
               :props="treeProps"
               show-checkbox
               node-key="id"
               default-expand-all
               :default-checked-keys="defKeys"
               ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
    </el-dialog>
    <!--    添加用户的对话框-->
    <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="50%"
    >
      <el-form :model="addRolesFrom" :rules="addRolesRules" ref="addRolesRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesFrom.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesFrom.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRoles">确 定</el-button>
  </span>
    </el-dialog>
    <!--    修改用户的对话框-->
    <el-dialog
        title="提示"
        :visible.sync="editDialogVisible"
        width="50%"
    >
      <el-form :model="editRolesFrom" :rules="addRolesRules" ref="editRolesRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesFrom.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesFrom.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="modifyUser">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getRolesList,
    removeRightById,
    showSetRightDialog,
    allotRights,
    removeUserById,
    addRoles,
    showEditDialog,
    modifyUser
  } from "../../network/rights";
  import {delUser} from "../../network/users";

  export default {
    name: "Roles",
    data() {
      return {
        addRolesFrom: {
          roleName: '',
          roleDesc: ''
        },
        addRolesRules: {
          roleName: [{required: true, message: '请输入角色名称', trigger: 'blur'}],
          roleDesc: [{required: true, message: '请输入用角色描述', trigger: 'blur'},]
        },
        //获取角色列表
        rolesList: [],
        //展示分配权限的对话框
        setRightDialogVisible: false,
        addDialogVisible: false,
        //所有权限数据
        rightList: [],
        treeProps: {
          label: 'authName',
          children: 'children'
        },
        //默认选中的节点id值
        defKeys: [],
        //当前即将分配权限的角色id
        roleId: '',
        editRolesFrom: {},
        editDialogVisible: false
      }
    },
    methods: {
      //获取所有角色列表
      getRolesList() {
        getRolesList().then(res => {
          if (res.meta.status !== 200)
            return this.$message.error('获取角色列表失败')
          this.rolesList = res.data
        })
      },
      //弹窗提示用户是否删除
      removeRightById(role, rightId) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res => {
          removeRightById(role, rightId).then(res => {
            // console.log(res);
            if (res.meta.status !== 200) {
              return this.$message.error('获取角色权限失败')
            }
            this.$message.success('删除成功')
            role.children = res.data
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //展示分配权限的对话框
      showSetRightDialog(role) {
        //获取所有权限的数据
        showSetRightDialog(role).then(res => {
          if (res.meta.status !== 200)
            return this.$message.error('获取权限数据失败')
          this.roleId = role.id
          this.rightList = res.data
          this.getLeafKeys(role, this.defKeys)
          this.setRightDialogVisible = true
        })
      },
      //通过递归的形式，获取角色下三级权限的id
      getLeafKeys(node, arr) {
        if (!node.children) {
          return arr.push(node.id)
        }
        node.children.forEach(item => {
          this.getLeafKeys(item, arr)
        })
      },
      //监听分配权限对话框的关闭事件
      setRightDialogClosed() {
        this.defKeys = []
      },
      //点击分配权限
      allotRights() {
        const keys = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        const idStr = keys.join(',')
        allotRights(this.roleId, idStr).then(res => {
          // console.log(res);
          if (res.meta.status !== 200) {
            return this.$message.error('分配权限数据失败')
          }
          this.$message.success('分配权限数据成功')
          this.setRightDialogVisible = false
          this.getRolesList()
        })
      },
      removeUserById(id) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeUserById(id).then(res => {
            // console.log(res);
            if (res.meta.status !== 200) {
              return this.$message.error('删除用户失败！')
            }
            this.$message.success('删除用户成功！')
            this.getRolesList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //添加角色
      addRoles() {
        addRoles(this.addRolesFrom).then(res => {
          if (res.meta.status !== 201) {
            return this.$message.error('创建角色失败')
          }
          this.$message.success('创建角色成功')
          this.addDialogVisible = false
          this.getRolesList()
        })
      },
      //修改角色
      showEditDialog(id) {
        showEditDialog(id).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('修改用户信息失败！')
          }
          this.editRolesFrom = res.data
          this.editDialogVisible = true
        })
      },
      modifyUser() {
        modifyUser(this.editRolesFrom).then(res => {
          this.$refs.editRolesRef.validate(valid => {
            if (!valid) return
            modifyUser(this.editRolesFrom).then(res => {
              // console.log(res);
              if (res.meta.status !== 200) {
                return this.$message.error('更新用户信息失败！')
              }
              this.editDialogVisible = false
              this.getRolesList()
              return this.$message.success('更新用户信息成功！')
            })
          })
        })
      }
    },
    created() {
      this.getRolesList()
    }
  }
</script>

<style scoped>
  .el-tag {
    margin: 7px;
  }

  .bdtop {
    border-top: 1px solid #eeeeee;
  }

  .bdbottom {
    border-bottom: 1px solid #eeeeee;
  }

  .vcenter {
    display: flex;
    align-items: center;
  }
</style>