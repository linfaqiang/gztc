<template>
  <div class="house-order-list">
    <!--头部-->
    <sub-header title="看房单详情"></sub-header>
    <div class="hod-c-base clearfix">
      <div class="clearfix">
        <img class="hod-c-b-img" :src="houseOrderVo.mobileCover" @click="onPreviewImage(houseOrderVo)">
        <div class="hod-c-b-describe">
          <div class="hod-c-b-title">{{houseOrderVo.attractInvestmentName}}</div>
          <div class="hod-c-b-option">
            物业类型：<span v-if="houseOrderVo.attractType === 0">项目</span>
            <span v-if="houseOrderVo.attractType === 1">公寓</span>
            <span v-if="houseOrderVo.attractType === 2">众创空间</span>
            <span class="hod-c-b-option-r">建筑类型：{{houseOrderVo.buildingType}}</span>
          </div>
          <div class="hod-c-b-option">
            所属区域：{{houseOrderVo.codeText}}
            <span class="hod-c-b-option-r">容积率：{{houseOrderVo.plotRatio}}%</span>
          </div>
          <div class="hod-c-b-option">
            绿化率：{{houseOrderVo.greenRatio}}%
          </div>
        </div>
      </div>
      <div class="hod-c-b-project-t">项目描述：</div>
      <div class="hod-c-b-p-describe">{{houseOrderVo.introduce}}</div>
    </div>
    <div class="hod-c-info">
      <div class="hod-c-b-option">意向户型：{{houseOrderVo.houseType}}</div>
      <div class="hod-c-b-option">提交时间：{{houseOrderVo.createTime}}</div>
      <div class="hod-c-b-option">预约时间：{{houseOrderVo.bookingsTime}}</div>
      <div class="hod-c-b-option">预约人：{{houseOrderVo.linkman}}</div>
      <div class="hod-c-b-option">预约人手机：{{houseOrderVo.contactPhone}}</div>
    </div>
  </div>
</template>
<script>
import { Toast } from 'vant'
import SubHeader from '@/components/common/SubHeader'
import wx from 'weixin-js-sdk'
export default {
  components: {
    [Toast.name]: Toast,
    SubHeader
  },
  data () {
    return {
      order: {},
      userInfo: {},
      houseOrderVo: {},
      id: ''
    }
  },
  created () {
    this.userInfo = this.$store.getters.getUserInfo
    this.id = this.$route.query.id
    this.getOrder()
  },
  methods: {
    // 查询详情 POST /api/service/serviceOrderDetail
    getOrder () {
      var that = this
      var queryData = {
        'pid': that.userInfo.selectParkId,
        'orderId': that.id
      }
      that.$http.post('/api/service/getHouseOrderDetail', queryData).then(function (res) {
        console.log(res)
        if (res.data.success) {
          that.houseOrderVo = res.data.result.houseOrderVo
        }
      }).catch((err) => {
        Toast.fail(err.message)
      })
    },
    onPreviewImage (pic) {
      wx.ready(function () {
        wx.previewImage({
          current: pic.mobileCover, // 当前显示图片的http链接
          urls: [pic.mobileCover] // 需要预览的图片http链接列表
        })
      })
    }
  }
}
</script>
<style scoped>
</style>
