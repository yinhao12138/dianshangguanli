<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">订单管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片区域-->
    <el-card>
      <!--      添加搜索区域-->
      <el-row :gutter="30">
        <el-col :span="10">
          <el-input placeholder="请输入内容" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!--    表格-->
      <el-table :data="orderlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格(元)" prop="order_price" width="120px"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status" width="145px">
          <template slot-scope="scope">
            <el-tag type="success">已付款</el-tag>
            <el-tag type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="120px"></el-table-column>
        <el-table-column label="下单时间" prop="create_time" width="200px">
          <template slot-scope="scope">
            {{scope.row.create_time | dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showBox"></el-button>
            <el-button size="mini" type="success" icon="el-icon-location" @click="showProgressBox">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--    分页区域-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[10, 15, 20,25]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
      >
      </el-pagination>
    </el-card>
    <!--    修改地址对话框-->
    <el-dialog
        title="修改地址"
        :visible.sync="addressVisible"
        width="50%"
        @close="addressVisibleClosed">
      <!--      添加参数的对话框-->
      <el-form :model="addressForm" :rules="addressRules" ref="addressRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="citydata" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addressVisible = false">取 消</el-button>
    <el-button type="primary" @click="addressVisible=false">确 定</el-button>
  </span>
    </el-dialog>
    <!--物流进度对话框-->
    <el-dialog
        title="物流进度"
        :visible.sync="progressVisible"
        width="50%"
    >
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
  </span>
    </el-dialog>

  </div>
</template>

<script>
  import citydata from "./citydata";
  import {getOrderList, showProgressBox} from "../../network/order";

  export default {
    name: "Order",
    data() {
      return {
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 10
        },
        orderlist: [],
        total: 0,
        addressVisible: false,
        progressVisible: false,
        addressForm: {
          address1: [],
          address2: ''
        },
        addressRules: {
          address1: [{required: true, message: '请选择省市区', trigger: 'blur'}],
          address2: [{required: true, message: '请填写详细地址', trigger: 'blur'}]
        },
        citydata,
        progressInfo: []
      }
    },
    methods: {
      getOrderList() {
        getOrderList(this.queryInfo).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('获取订单失败！')
          }
          this.orderlist = res.data.goods
          this.total = res.data.total
        })
      },
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getOrderList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getOrderList()
      },
      showBox() {
        this.addressVisible = true
      },
      addressVisibleClosed() {
        this.$refs.addressRef.resetFields()
      },
      showProgressBox() {
        this.$message.error('获取订单失败！')
      }
    },
    created() {
      this.getOrderList()
    }
  }
</script>

<style scoped>
  .el-cascader {
    width: 100%;
  }
</style>