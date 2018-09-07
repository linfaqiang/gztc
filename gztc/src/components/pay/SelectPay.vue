<template>
  <div class="pay-select">
    <!--头部-->
    <sub-header title="选择支付"></sub-header>
    <!--新闻列表-->
    <div class="ps-pay-box">
      <div class="ps-p-for">{{payOptionName}}</div>
      <div class="ps-p-money">需支付：<span class="ps-p-m-num">{{money}}</span>元</div>
      <div class="ps-p-online-btn" @click="onLinePay">在线支付</div>
      <div class="ps-p-underline-btn" @click="underLinePay">线下支付</div>
    </div>
  </div>
</template>
<script>
import SubHeader from '@/components/common/SubHeader'
import { Dialog, Toast } from 'vant'
export default {
  name: 'ParkSelect',
  components: {
    SubHeader,
    [Toast.name]: Toast
  },
  data () {
    return {
      redirectUrl: '',
      id: '',
      money: 0,
      timeShow: false,
      payOptionName: ''
    }
  },
  created () {
    this.redirectUrl = this.$route.query.redirectUrl
    this.payOptionName = this.$route.query.payOptionName
    this.id = this.$route.query.orderId
    this.money = this.$route.query.money
  },
  methods: {
    // 在线支付 POST /h5/pay/pay.html
    onLinePay () {
      Dialog.alert({
        title: '提示',
        message: '在线支付申请开通中'
      }).then(() => {
        // on close
      })
      /*
      var that = this
      that.$http.post('/api/h5/pay/pay.html', {
        money: that.$route.query.money,
        orderNo: that.$route.query.orderNo,
        orderId: that.$route.query.orderId,
        orderType: that.$route.query.orderType
      }).then(function (res) {
        var result = res.data.result
        if (res.data.success) {
          that.onBridgeReady(result.appid, result.timeStamp, result.nonceStr, result.package, result.sign)
        } else {
          Toast.fail(res.data.message)
        }
      })
      */
    },
    underLinePay () {
      var that = this
      Dialog.confirm({
        title: '提示',
        message: '选择线下支付后，支付方式不可修改',
        confirmButtonText: '确定'
      }).then(() => {
        that.$http.post('/api/h5/pay/updatePayInfo', {
          money: that.$route.query.money,
          orderNo: that.$route.query.orderNo,
          orderId: that.$route.query.orderId,
          orderType: that.$route.query.orderType,
          payType: '0' // 0为线下支付
        }).then(function (res) {
          if (res.data.success) {
            that.$router.push({
              name: that.redirectUrl,
              query: {
                id: that.id
              }
            })
          } else {
            Toast.fail(res.data.message)
          }
        })
      })
    },
    onBridgeReady (_appid, _timeStamp, _nonceStr, _package, _sign) {
      // var that = this
      // WeixinJSBridge.invoke(
      //   'getBrandWCPayRequest', {
      //     appId: _appid, // 公众号名称，由商户传入
      //     timeStamp: _timeStamp, // 时间戳，自1970年以来的秒数
      //     nonceStr: _nonceStr, // 随机串
      //     package: _package,
      //     signType: 'MD5', // 微信签名方式
      //     paySign: _sign // 微信签名
      //   },
      //   function (res) {
      //     if (res.err_msg === 'get_brand_wcpay_request:ok') {
      //       that.$router.push({
      //         name: 'HadPay',
      //         query: {
      //           id: that.id,
      //           redirectUrl: that.redirectUrl
      //         }
      //       })
      //     }
      //   }
      // )
    }
  }
}
</script>
<style>
.clearfix {
  zoom: 1;
  *zoom: 1;
}

.clearfix:after {
  content: ".";
  display: block;
  font-size: 0;
  height: 0;
  clear: both;
  visibility: hidden
}
.ps-p-for {
  margin-top: 20%;
}
.ps-p-money {
  margin-top: ;
}
.ps-p-m-num {
  color: #ff0000;
}
</style>
