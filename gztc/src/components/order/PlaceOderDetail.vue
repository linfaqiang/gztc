<template>
  <div class="place-order-list">
    <!--头部-->
    <sub-header title="预约单详情"></sub-header>
    <div class="pod-c-base clearfix">
      <div class="pod-cb-info clearfix">
        <img class="pod-c-img" :src="order.mobileCover">
        <div class="pod-c-describe">
          <div class="pod-cd-name">{{order.placeInfoName}}</div>
          <div class="pod-cd-option">楼层：{{order.floor}}</div>
          <div class="pod-cd-option">
            收费类型:
            <span v-if="order.cost > 0">收费</span>
            <span v-if="order.cost === 0">免费</span>
            <span class="pod-cd-option-r">{{order.cost}}元/小时</span>
          </div>
          <div class="pod-cd-option">容纳人数：{{order.capacity}}</div>
        </div>
      </div>
      <div class="pod-cd-item">
        开放时间：
        <span>{{order.selectedStartTime}}&nbsp;至&nbsp;{{order.selectedEndTime}}</span>
      </div>
      <div class="pod-cd-item">提示：{{order.remind}}</div>
    </div>
    <div class="pod-status-info">
      <div class="pod-cd-item clearfix">
        <span class="pod-cd-item-code">验证码：</span>
        <div class="pod-cd-item-img" v-if="isMeetingroom" @click="showBig">
          <div id="qrcode"></div>
        </div>
        <span class="pod-cd-item-code-num" v-if="isPlace">{{order.code}}</span>
        <span class="pod-cd-item-state" v-if="order.codeStatus===0">未验证</span>
        <div class="pod-cd-item-state pol-statu-tip-u-e" v-if="order.codeStatus===1">已验证</div>
        <div class="pod-cd-item-state pol-statu-tip-u-e" v-if="order.codeStatus===2">已失效</div>
      </div>
      <div class="pod-cd-item">提交时间： {{order.createTime}}</div>
      <div class="pod-cd-item">
        预约日期： {{order.bookingsDate}}
        <span class="pod-cd-item-r">服务类型：
          <span v-if="isPlace">场地预定</span>
          <span v-if="isMeetingroom">会议室预定</span>
        </span>
      </div>
      <div class="pod-cd-item">
        使用时间： {{order.bookingsStartTime}} 至 {{order.bookingsEndTime}}
        <span class="pod-cd-item-r">共 {{order.hours}} 小时</span>
      </div>
      <div class="pod-cd-item pod-cd-pay-state">
        实收费用：{{order.payMoney}}元
        <span class="pod-cd-item-r" v-if="order.payStatus===1">
          已经支付
        </span>
        <span class="pod-cd-item-r" v-if="order.payStatus===0">
          未支付
        </span>
      </div>
      <div class="pod-cd-item">企业信息：{{order.company}}</div>
      <div class="pod-cd-item">
        预&nbsp;&nbsp;约&nbsp;&nbsp;人：{{order.linkman}}
        <span class="pod-cd-item-r">手机：{{order.contactPhone}}</span>
      </div>
      <div class="pod-cd-item">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注&nbsp;&nbsp;：</div>
      <div class="pod-cd-item">
        {{order.remark}}
      </div>
    </div>
    <div class="pod-big-code" v-bind:style="padding" v-if="qrcodeGigShow" @click="hideBig">
      <div id="qrcodeBig" v-if="qrcodeGigShow" @click="hideBig">
        <div class="pod-code-tip">失效时间： {{order.bookingsDate}}&nbsp;&nbsp;{{order.bookingsEndTime}}</div>
        <div class="pod-code-tip">温馨提醒： 请将二维码对准门禁设备摄像头</div>
      </div>
    </div>
  </div>
</template>
<script>
import SubHeader from '@/components/common/SubHeader'
import { List } from 'vant'
import QRCode from 'qrcodejs2'
export default {
  data () {
    return {
      userInfo: {},
      id: '',
      order: {},
      width: 0,
      qrcode: null,
      qrcodeBig: null,
      isPlace: false,
      qrcodeGigShow: false,
      isMeetingroom: false,
      padding: {
        padding: 0
      }
    }
  },
  components: {
    SubHeader,
    [List.name]: List,
    QRCode
  },
  computed: {
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.userInfo = this.$store.getters.getUserInfo
      this.id = this.$route.query.id
      this.getOrder()
    },
    // 生成二维码
    qrcodeOn (str) {
      var clientWidth = document.documentElement.clientWidth
      this.qrcode = new QRCode('qrcode', {
        width: clientWidth / 10 * 1.574074,
        height: clientWidth / 10 * 1.574074,
        text: str
      })
    },
    // 生成大二维码
    qrcodeBigOn (str) {
      var clientWidth = document.documentElement.clientWidth
      var clientclientHeight = document.documentElement.clientHeight

      if (clientWidth > clientclientHeight) {
        this.width = clientclientHeight
        document.getElementById('qrcodeBig').style.left = (clientclientHeight - 256) / 2 + 'px'
        document.getElementById('qrcodeBig').style.top = (clientWidth - 256) / 2 - 80 + 'px'
      } else {
        this.width = clientWidth
        document.getElementById('qrcodeBig').style.top = (clientclientHeight - 256) / 2 - 80 + 'px'
        document.getElementById('qrcodeBig').style.left = (clientWidth - 256) / 2 + 'px'
      }
      this.qrcodeBig = new QRCode('qrcodeBig', {
        width: 256,
        height: 256,
        text: str
      })
    },
    showBig () {
      if (this.order.qrcode === '' || this.order.qrcode === null) {
        return
      }
      this.qrcodeGigShow = true
      this.$nextTick(function () {
        this.qrcodeBigOn(this.order.qrcode)
      })
    },
    hideBig () {
      this.qrcodeGigShow = false
    },
    // 详情查询 POST /api/service/placeOrderDetail
    getOrder () {
      var that = this
      var queryData = {
        id: that.id
      }
      this.$http.post('/api/service/placeOrderDetail', queryData).then(function (res) {
        var order = res.data.result
        var start = new Date('2018/07/10 ' + order.bookingsStartTime).getTime()
        if (order.placeInfoType === '2') {
          that.isPlace = true
        } else {
          that.isMeetingroom = true
          that.$nextTick(function () {
            this.qrcodeOn(order.qrcode)
          })
        }
        order.createTime = order.createTime.substring(0, order.createTime.lastIndexOf(':'))
        var end = new Date('2018/07/10 ' + order.bookingsEndTime).getTime()
        order.hours = (end - start) / 60 / 60 / 1000
        order.bookingsDate = order.bookingsDate.split(' ')[0]
        that.order = order
      })
    }
  }
}
</script>
<style>
.pod-big-code {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 999;
  top: 0;
  left: 0;
  background: #fff;
}

#qrcodeBig {
  position: absolute;
}

.pol-statu-tip-u-e {
  background: #9c9c9c;
  color: #fff;
}
.pod-code-tip {
  margin-bottom: 20px;
}
</style>
