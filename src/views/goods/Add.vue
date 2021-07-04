<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片视图-->
    <el-card>
      <!--    提示区域-->
      <el-alert
          title="添加商品信息"
          center
          :closable="false"
          show-icon
          type="info">
      </el-alert>
      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form ref="addFormRef" :model="addGoodsForm" :rules="addFormRules" label-width="80px" label-position="top">
        <el-tabs :tab-position="'left'" v-model="activeIndex" @tab-click="tabClick">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addGoodsForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addGoodsForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addGoodsForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                  :options="cateList"
                  :props="cateProps"
                  v-model="addGoodsForm.goods_cat"
                  @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTableDate" :key="item.attr_id">
              <!--              复选框组-->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableDate" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
                :action="uploadURL"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                list-type="picture"
                :headers="headerObj"
                :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addGoodsForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="addBtn" @click="addPro">添加按钮</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!--    图片预览-->
    <el-dialog
        title="图片预览"
        :visible.sync="handlePreviewViable"
        width="50%">
      <img :src="previewPath" alt="" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
  import _ from 'lodash'
  import {getCateList, tabClick, addPro} from "../../network/Add";

  export default {
    name: "Add",
    data() {
      return {
        activeIndex: '0',
        addGoodsForm: {
          goods_name: '',
          goods_price: 0,
          goods_number: 0,
          goods_weight: 0,
          goods_cat: [],
          pics: [],
          goods_introduce: '',
          attrs: []
        },
        cateList: [],
        manyTableDate: [],
        onlyTableDate: [],
        cateProps: {
          label: 'cat_name',
          value: 'cat_id',
          children: 'children'
        },
        activeName: {
          many: 'many',
          only: 'only'
        },
        uploadURL: 'http://timemeetyou.com:8889/api/private/v1/upload',
        previewPath: '',
        handlePreviewViable: false,
        headerObj: {
          Authorization: window.sessionStorage.getItem('token')
        },
        addFormRules: {
          goods_name: [
            {required: true, message: '请输入商品名称', trigger: 'blur'}
          ],
          goods_price: [
            {required: true, message: '请输入商品价格', trigger: 'blur'}
          ],
          goods_number: [
            {required: true, message: '请输入商品数量', trigger: 'blur'}
          ],
          goods_weight: [
            {required: true, message: '请输入商品重量', trigger: 'blur'}
          ],
          goods_cat: [
            {required: true, message: '请输入商品分类', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      getCateList() {
        getCateList().then(res => {
          // console.log(res);
          if (res.meta.status !== 200) return this.$message.error('获取列表失败')
          this.cateList = res.data
          // console.log(this.cateList);
        })
      },
      handleChange() {
        // console.log(this.addGoodsForm.goods_cat);
        if (this.addGoodsForm.goods_cat.length !== 3) {
          this.addGoodsForm.goods_cat = []
        }
      },
      tabClick() {
        // console.log(this.activeIndex);
        if (this.activeIndex === '1') {
          tabClick(this.cateId, this.activeName.many).then(res => {
            // console.log(res);
            if (res.meta.status !== 200) {
              return this.$message.error('请先选择商品分类')
            }
            res.data.forEach(item => {
              item.attr_vals =
                item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
            })
            this.manyTableDate = res.data
          })
        } else if (this.activeIndex === '2') {
          tabClick(this.cateId, this.activeName.only).then(res => {
            // console.log(res);
            if (res.meta.status !== 200) {
              return this.$message.error('请先选择商品分类')
            }
            this.onlyTableDate = res.data
            console.log(this.onlyTableDate);
          })

        }
      },
      //处理移除图片
      handleRemove(file) {
        const filePath = file.response.data.tmp_path
        const i = this.addGoodsForm.pics.findIndex(x =>
          x.pic === filePath
        )
        this.addGoodsForm.pics.splice(i, 1)
      },
      //处理图片预览效果
      handlePreview(file) {
        this.previewPath = file.response.data.url
        // console.log(this.previewPath);
        this.handlePreviewViable = true
      },
      handleSuccess(response) {
        const picInfo = {pic: response.data.tmp_path}
        this.addGoodsForm.pics.push(picInfo)
        // console.log(this.addGoodsForm);
      },
      addPro() {
        this.$refs.addFormRef.validate(valid => {
          if (!valid) {
            return this.$message.error('请填写必要的表单项目')
          }
          const from = _.cloneDeep(this.addGoodsForm)
          from.goods_cat = from.goods_cat.join(',')
          this.manyTableDate.forEach(item => {
            const firstInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(',')
            }
            this.addGoodsForm.attrs.push(firstInfo)
          })
          this.onlyTableDate.forEach(item => {
            const secondInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            }
            this.addGoodsForm.attrs.push(secondInfo)
          })
          from.attrs = this.addGoodsForm.attrs
          console.log(from);
        })
        addPro(this.from).then(res => {
          console.log(res);
          if (res.meta.status !== 201) {
            return this.$message.error('添加商品失败')
          }
          this.$message.error('添加商品成功')
          this.$router.push('/goods')
        })
      }
    },
    created() {
      this.getCateList()
    },
    computed: {
      cateId() {
        if (this.addGoodsForm.goods_cat.length === 3) {
          return this.addGoodsForm.goods_cat[2]
        }
        return null
      },
    }
  }
</script>

<style scoped>
  .el-checkbox {
    margin: 0 20px 0 0 !important;
  }

  .previewImg {
    width: 100%;
  }

  .addBtn {
    margin-top: 18px;
  }
</style>