<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片视图-->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!--    表格-->
      <tree-table
          :data="cateList"
          :columns="columns"
          :selection-type="false"
          :expand-type="false"
          show-index
          index-text="#"
          border
          :show-row-hover="false"
      >
        <template slot="isok" slot-scope="scope" class="treeTable">
          <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color: lightgreen"></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!--        排序-->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!--    分类区域-->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.cat_id)">编辑
          </el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeCateById(scope.row.cat_id)">删除
          </el-button>
        </template>

      </tree-table>
      <!--    分页区域-->
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
    <!--    添加分类的对话框-->
    <el-dialog
        title="添加分类"
        :visible.sync="addCatDialogVisible"
        width="50%"
        @close="addCateDialogClosed"
    >
      <!--      添加分类-->
      <el-form :model="addCateFrom" :rules="addCateFromRules" ref="addCateFromRef" label-width="100px">
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateFrom.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:" prop="cat_pid">
          <el-cascader
              v-model="selectedKeys"
              :options="parentCateList"
              :props="cascaderProps"
              chang-on-select
              @change="parentCateChanged">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addCatDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCat">确 定</el-button>
  </span>
    </el-dialog>
    <!--    修改商品的对话框-->
    <el-dialog
        title="修改商品"
        :visible.sync="cateDialogVisible"
        width="50%"
        @close="editDialogClose"
    >
      <el-form :model="goodCateFrom" :rules="goodCateFormRules" ref="goodCateFromRef" label-width="70px">
        <el-form-item label="商品名" prop="cat_name">
          <el-input v-model="goodCateFrom.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="cateDialogVisible=false">取 消</el-button>
    <el-button type="primary" @click="modifyCate">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import {getCateList, getParentCatList, addCat, removeCateById, showEditDialog, modifyCate} from "../../network/cate";
  import {modifyUser} from "../../network/users";

  export default {
    name: "Cate",
    data() {
      return {
        //查询条件
        queryInfo: {
          type: 3,
          pagenum: 1,
          pagesize: 5
        },
        cateList: [],
        goodCateFrom: {},
        cateDialogVisible: false,
        total: 0,
        columns: [{
          label: '分类名称',
          prop: 'cat_name'
        },
          {
            label: '是否有效',
            type: 'template',
            template: 'isok'
          },
          {
            label: '排序',
            type: 'template',
            template: 'order'
          },
          {
            label: '操作',
            type: 'template',
            template: 'opt'
          }
        ],
        addCatDialogVisible: false,
        addCateFrom: {
          cat_name: '',
          cat_pid: 0,
          cat_level: 0
        },
        addCateFromRules: {
          cat_name: [{required: true, message: '请输入分类名称', trigger: 'blur'}],
        },
        parentCateList: [],
        cascaderProps: {
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        },
        selectedKeys: [],
        goodCateFormRules: {
          cat_name: [{required: true, message: '请输入商品名', trigger: 'blur'},]
        }
      }
    },
    methods: {
      getCateList() {
        getCateList(this.queryInfo).then(res => {
          if (res.meta.status !== 200) return this.$message.error(this.meta.msg)
          this.cateList = res.data.result
          this.total = res.data.total
        })
      },
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getCateList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getCateList()
      },
      showAddCateDialog() {
        this.getParentCatList()
        this.addCatDialogVisible = true
      },
      //获取父级分类列表
      getParentCatList() {
        getParentCatList(this.queryInfo).then(res => {
          if (res.meta.status !== 200) return this.$message.error(this.meta.msg)
          this.parentCateList = res.data
        })
      },
      //选择项发生变化触发这个函数
      parentCateChanged() {
        if (this.selectedKeys.length > 0) {
          this.addCateFrom.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
            ]
          this.addCateFrom.cat_level = this.selectedKeys.length
          return
        } else {
          this.addCateFrom.cat_pid = 0
          this.addCateFrom.cat_level = 0
        }
      },
      //点击 添加新的按钮
      addCat() {
        this.$refs.addCateFromRef.validate(valid => {
          if (!valid) return
          addCat(this.addCateFrom).then(res => {
            // console.log(res);
            if (res.meta.status !== 201) {
              return this.$message.error('添加分类失败')
            }
            this.$message.success('添加分类成功')
            this.getCateList()
            this.addCatDialogVisible = false
          })
        })
      },
      addCateDialogClosed() {
        this.$refs.addCateFromRef.resetFields()
        this.selectedKeys = []
        this.addCateFrom.cat_level = 0
        this.addCateFrom.cat_pid = 0
      },
      removeCateById(id) {
        this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeCateById(id).then(res => {
            // console.log(res);
            if (res.meta.status !== 200) {
              return this.$message.error('删除商品失败！')
            }
            this.$message.success('删除商品成功！')
            this.getCateList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //获取用户的对话框
      showEditDialog(id) {
        showEditDialog(id).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('修改用户信息失败！')
          }
          this.goodCateFrom = res.data
        })
        this.cateDialogVisible = true
      },
      editDialogClose() {
        this.$refs.goodCateFromRef.resetFields()
      },
      modifyCate() {
        this.$refs.goodCateFromRef.validate(valid => {
          if (!valid) return
          modifyCate(this.goodCateFrom).then(res => {
            // console.log(res);
            if (res.meta.status !== 200) {
              return this.$message.error('更新用户信息失败！')
            }
            this.cateDialogVisible = false
            this.getCateList()
            return this.$message.success('更新用户信息成功！')
          })
        })
      }
    },
    created() {
      this.getCateList()
    }
  }
</script>

<style scoped>
  .treeTable {
    margin-top: 15px;
  }

  .el-cascader {
    width: 100%;
  }
</style>