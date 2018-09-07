<template>
  <div class="service-ticket-details">
    <!--头部-->
    <sub-header title="服务单详情"></sub-header>
    <!--内容-->
    <div class="ticket-details-content">
      <div class="content-top">
        <ul>
          <li>
            <h4>{{order.serviceName}}&nbsp;&nbsp;<span>{{order.itemName}}</span></h4>
            <h5>收费：<strong>{{order.price}}</strong>元&nbsp;&nbsp;(实际收费根据维修人员上门评估为准)</h5>
            <h6>服务范围：</h6>
            <p>{{order.itemExplain}}</p>
          </li>
        </ul>
      </div>
      <div class="content-mid">
        <div class="datetime-item">
          <p>
            <span>提交时间：{{order.cerateTime}}</span>
          </p>
          <p>
            <span style="width: 50%">预约日期：{{order.bookingDate}}</span>
            <span style="width: 50%">预约时间：{{order.bookingTime}}</span>
          </p>
          <div class="tag-tem">{{order.statusName}}</div>
        </div>
        <div class="info-item">
          <p>
            <span>企业信息：{{order.contactCompany}}</span>
          </p>
          <p>
            <span>预约人：{{order.linkman}}</span>
            <span>手机：{{order.contactPhone}}</span>
          </p>
          <p>
            <span>备注：{{order.remark}}</span>
          </p>
        </div>
      </div>
      <div class="content-mid">
        <div class="datetime-item">
          <p>
            <span>服务人员上门评估</span>
          </p>
          <div class="tag-tem unpay" v-if="order.payStatusName">{{order.payStatusName}}</div>
        </div>
        <div class="info-item">
          <p>
            <span>服务费：<span v-if="order.payAmount"><strong>{{order.payAmount}}</strong>元</span></span>
          </p>
          <p>
            <span>备注：<span v-if="order.serviceRemark">{{order.serviceRemark}}</span></span>
          </p>
        </div>
      </div>
    </div>
    <div class="cod-pay-box">
      <div :class="order.class" @click="orderAction">
        {{btnText}}
      </div>
    </div>
  </div>
</template>
<script>
import SubHeader from '@/components/common/SubHeader'
import { Toast } from 'vant'
export default {
  data () {
    return {
      order: {
        class: {
          'cod-pay-btn': true,
          'cod-pay-btn-d': true
        }
      },
      id: '',
      userInfo: {},
      btnText: '支付',
      isComplement: true
    }
  },
  components: {
    SubHeader,
    [Toast.name]: Toast
  },
  created () {
    this.init()
    this.getOrder()
  },
  methods: {
    init () {
      this.userInfo = this.$store.getters.getUserInfo
      this.id = this.$route.query.id
    },
    // 底部按钮操作
    orderAction () {
      var that = this
      // that.order.status = 3 已接单状态
      if (that.order.status === 3) {
        that.$router.push({
          name: 'SelectPay',
          query: {
            money: that.order.payAmount,
            orderNo: that.order.serviceNo,
            orderId: that.order.id,
            orderType: '1', // 付费服务
            payOptionName: that.order.itemName + '(' + that.order.serviceName + ')',
            redirectUrl: 'ChargeOrderDetail'
          }
        })
      }
      // that.order.status = 6 以服务状态
      if (that.order.status === 6) {
        that.$router.push({
          name: 'ChargeOrderComment',
          query: {
            id: that.order.id
          }
        })
      }
    },
    toComment () {
      console.log('去评分')
    },
    // 查询付费服务详情 POST /api/service/serviceOrderDetail
    getOrder () {
      var that = this
      var queryData = {
        pid: that.userInfo.selectParkId,
        orderId: that.id
      }
      that.$http.post('/api/service/serviceOrderDetail', queryData).then(function (res) {
        if (res.data.success && res.data.result) {
          var orderObj = res.data.result
          orderObj.class = {
            'cod-pay-btn': true,
            'cod-pay-btn-d': true
          }
          orderObj.cerateTime = orderObj.cerateTime.substring(0, orderObj.cerateTime.lastIndexOf(':'))
          orderObj.bookingDate = orderObj.bookingsTime.split(' ')[0]
          var timeTemp = orderObj.bookingsTime.split(' ')[1]
          orderObj.bookingTime = timeTemp.substring(0, timeTemp.lastIndexOf(':'))
          orderObj.itemExplain = orderObj.itemExplain.replace(/,/g, '/')
          // 0： 未支付 1：已支付
          // 0：服务申请、1：已派单、2：已接单、3：已报价、4：已支付、5：服务中、6：已服务、7：已完成、8：已取消
          switch (orderObj.status) {
            case 0:
              orderObj.statusName = '未验证'
              break
            case 1:
              orderObj.statusName = '已派单'
              break
            case 2:
              orderObj.statusName = '已接单'
              break
            case 3:
              orderObj.statusName = '已接单'
              orderObj.payStatusName = '已报价'
              orderObj.class['cod-pay-btn-d'] = false
              break
            case 4:
            case 5:
              orderObj.statusName = '已接单'
              orderObj.payStatusName = '已支付'
              that.btnText = '已支付'
              break
            case 6:
              orderObj.statusName = '已服务'
              orderObj.payStatusName = '已支付'
              that.btnText = '服务评分'
              orderObj.class['cod-pay-btn-d'] = false
              break
            case 7:
              orderObj.statusName = '已完成'
              orderObj.payStatusName = '已支付'
              that.btnText = '已完成'
              that.isComplement = false
              break
            case 8:
              orderObj.statusName = '已取消'
              break
          }
          that.order = orderObj
        } else {
          Toast.fail(res.data.message)
        }
      })
    }
  }
}
</script>
<style>
img{
  max-width: 100%;
}
.ticket-details-content{
  color: #0f0f0f;
  font-size: .314815rem;
  text-align: left;
}
.content-top{
  padding: 0 .277778rem;
  margin-top: .277778rem;
  background-color: #fff;
  border-bottom: 1px solid #dbdbdb;
}
.content-top ul{
  padding: 0 .37037rem;
}
.content-top ul li{
  position: relative;
  text-align: left;
  padding: .203704rem 0 .388889rem 0;
}
.content-top ul li h4{
  position: relative;
  padding: .305556rem 0;
  font-size: .388889rem;
}
.content-top ul li h4 span{
  font-size: .314815rem;
}
.content-top ul li h5 strong{
  color: #f6372c;
}
.content-top ul li h6{
  padding: .222222rem 0;
}
.content-top ul li p{
  color: #616161;
  line-height: .518519rem;
}
.content-mid{
  position: relative;
  padding: 0 .277778rem;
  margin-top: .277778rem;
  background-color: #fff;
  border-top: 1px solid #dbdbdb;
  border-bottom: 1px solid #dbdbdb;
}
.content-mid .datetime-item{
  position: relative;
  padding: .333333rem 0;
  margin: 0 .37037rem;
  border-bottom: 1px solid #eee;
}
.content-mid p{
  line-height: .518519rem;
}
.content-mid .info-item{
  padding: .222222rem .37037rem;
}
.content-mid .info-item p{
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
  justify-content: space-between;
  -webkit-justify-content: space-between;
}
.content-mid .info-item p strong{
  color: #f6372c;
}
.content-mid .tag-tem{
  position: absolute;
  right: 0;
  top: .462963rem;
  width: .981481rem;
  height: .37037rem;
  line-height: .37037rem;
  text-align: center;
  background-color: #fecd05;
}
.content-mid .unpay{
  color: #f6372c;
  background-color: #e4e4e4;
}
.cod-pay-box {
  position: fixed;
  width: 100%;
  height: 1.435185rem;
  bottom: 0;
  background: #fff;
}
.cod-pay-btn {
  width: 8.148148rem;
  height: 0.925926rem;
  line-height: 0.925926rem;
  margin: 0 auto;
  background: #fdcc07;
  font-size: 0.37037rem;
  margin-top: 0.222222rem;
     -moz-border-radius: 0.074074rem;
       -o-border-radius: 0.074074rem;
  -webkit-border-radius: 0.074074rem;
          border-radius: 0.074074rem;
}
.cod-pay-btn-d {
  background: #b9b9bb;
  color: #000;
}
</style>
