<template>
  <div class="service-ticket-details">
    <!--头部-->
    <enterprise-header title="服务单详情"></enterprise-header>
    <!--内容-->
    <div class="ticket-details-content">
      <div class="content-top">
        <ul>
          <li>
            <h4>{{serviceOrder.serviceName}}&nbsp;&nbsp;<span>{{serviceOrder.serviceName}}</span></h4>
            <h5>收费：<strong>{{serviceOrder.price}}</strong>元&nbsp;&nbsp;(实际收费根据维修人员上门评估为准)</h5>
            <h6>服务范围：</h6>
            <p v-html="serviceOrder.itemExplain"></p>
          </li>
        </ul>
      </div>
      <div class="content-mid">
        <div class="datetime-item">
          <p>
            <span>提交时间：{{serviceOrder.cerateTime }}</span>
          </p>
          <p>
            <span>预约日期：{{serviceOrder.bookingsTime | formatDate}}</span>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;预约时间：{{serviceOrder.bookingsTime | formatTime}} </span>
          </p>
          <div v-if="serviceOrder.status === 1" class="tag-tem">已派单</div>
          <div v-if="serviceOrder.status === 2" class="tag-tem">已接单</div>
          <div v-if="serviceOrder.status === 3 || serviceOrder.status === 4" class="tag-tem">已报价</div>
          <div v-if="serviceOrder.status === 5" class="tag-tem">服务中</div>
          <div v-if="serviceOrder.status === 6" class="tag-tem">已服务</div>
          <div v-if="serviceOrder.status === 7" class="tag-tem">已完成</div>
        </div>
        <div class="info-item">
          <p>
            <span>企业信息：{{serviceOrder.contactCompany}}</span>
          </p>
          <p>
            <span>预约人：{{serviceOrder.linkman}}</span>
            <span>手机：{{serviceOrder.contactPhone}}</span>
          </p>
          <p>
            <span>备注：<b v-html="serviceOrder.remark"></b></span>
          </p>
        </div>
      </div>
      <div class="content-mid form-mid" v-if="serviceOrder.status === 2">
        <div class="datetime-item">
          <p>
            <span>服务人员上门评估</span>
          </p>
        </div>
        <div class="form-item">
          <label>服务费：</label>
          <input type="number" v-model="serviceCost">&nbsp;&nbsp;元
        </div>
        <div class="form-item">
          <label>备&nbsp;&nbsp;注：</label>
          <textarea v-model="serviceRemark" maxlength="200"></textarea>
        </div>
      </div>
      <div class="content-mid" v-if="serviceOrder.status === 3 || serviceOrder.status === 4 || serviceOrder.status === 5 || serviceOrder.status === 6 || serviceOrder.status === 7">
        <div class="datetime-item">
          <p>
            <span>服务人员上门评估</span>
          </p>
          <div class="tag-tem unpay" v-if="serviceOrder.status === 3">未支付</div>
          <div class="tag-tem unpay" v-if="serviceOrder.status === 4 || serviceOrder.status === 5 || serviceOrder.status === 6 || serviceOrder.status === 7">已支付</div>
        </div>
        <div class="info-item">
          <p>
            <span>服务费：<strong>{{serviceOrder.payAmount}}</strong>元</span>
          </p>
          <p>
            <span>备注：{{serviceOrder.serviceRemark}}</span>
          </p>
        </div>
      </div>
      <div class="evaluate-item" v-if="serviceOrder.status === 7">
          <p>
            评分：
            <ul>
              <li v-for="(evaluate, index) in evaluates" :class="{active: evaluate}" :key="index"></li>
            </ul>
          </p>
          <p>
            <span>评论：{{serviceOrder.completeRemark }}</span>
          </p>
      </div>
    </div>
    <div class="footer-item" v-if="serviceOrder.status === 1">
      <button type="button" @click="receiptOn()">接&nbsp;&nbsp;单</button>
    </div>
    <div class="footer-item" v-if="serviceOrder.status === 2">
      <button type="button" @click="quoteOn()">报&nbsp;&nbsp;价</button>
    </div>
    <div class="footer-item" v-if="serviceOrder.status === 4">
      <button type="button" @click="inServiceOn()">服&nbsp;&nbsp;务</button>
    </div>
    <div class="footer-item" v-if="serviceOrder.status === 5">
      <button type="button" @click="finishServiceOn()">服务完成</button>
    </div>
  </div>
</template>
<script>
import { Toast } from 'vant'
import { getServiceOrderDetails, updateOrderStatus, quotedPrice } from '@/api/enterprise'
import enterpriseHeader from '@/components/enterprisePage/Header'
export default {
  data () {
    return {
      orderId: -1,
      serviceCost: '',
      serviceRemark: '',
      serviceOrder: {},
      evaluates: [false, false, false, false, false]
    }
  },
  components: {
    [Toast.name]: Toast,
    enterpriseHeader
  },
  inject: ['reload'],
  filters: {
    formatDate (date) {
      return (date || '').split(' ')[0]
    },
    formatTime (date) {
      return (date || '').split(' ')[1]
    }
  },
  created () {
    this.orderId = this.$route.query.id
    getServiceOrderDetails({orderId: this.orderId}).then((res) => {
      if (res.data.success) {
        this.serviceOrder = res.data.result
        for (let i = 0; i < Number(this.serviceOrder.score); i++) {
          this.evaluates[i] = true
        }
      }
    }).catch((err) => {
      Toast.fail(err.message)
    })
  },
  methods: {
    // 接单
    receiptOn () {
      updateOrderStatus({orderId: this.orderId}).then((res) => {
        if (res.data.success) {
          if (res.data.result === 0) {
            Toast.success('接单成功')
            this.reload()
          } else {
            Toast.fail('接单失败')
          }
        }
      }).catch((err) => {
        Toast.fail(err.message)
      })
    },
    // 报价
    quoteOn () {
      if (this.serviceCost === '') {
        Toast('请输入服务费')
      } else if (this.serviceRemark === '') {
        Toast('请输入备注内容')
      } else {
        quotedPrice({
          orderId: this.orderId,
          price: this.serviceCost,
          remark: this.serviceRemark
        }).then((res) => {
          if (res.data.success) {
            if (res.data.result === 0) {
              Toast.success('提交成功')
              this.reload()
            } else {
              Toast.fail('提交失败')
            }
          }
        }).catch((err) => {
          Toast.fail(err.message)
        })
      }
    },
    // 服务中
    inServiceOn () {
      updateOrderStatus({orderId: this.orderId}).then((res) => {
        if (res.data.success) {
          if (res.data.result === 0) {
            Toast.success('开始服务')
            this.reload()
          }
        }
      }).catch((err) => {
        Toast.fail(err.message)
      })
    },
    finishServiceOn () {
      updateOrderStatus({orderId: this.orderId}).then((res) => {
        if (res.data.success) {
          if (res.data.result === 0) {
            Toast.success('服务完成')
            this.reload()
          }
        }
      }).catch((err) => {
        Toast.fail(err.message)
      })
    }
  }
}
</script>
<style scoped>
img{
  max-width: 100%;
}
.ticket-details-content{
  color: #0f0f0f;
  font-size: .314815rem;
  text-align: left;
  padding-bottom: 1.296296rem;
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
.form-mid{
  padding-bottom: .185185rem;
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
.content-mid .info-item p span > b{
  font-weight: normal;
}
.content-mid .form-item{
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
  padding-top: .185185rem;
}
.content-mid .form-item label{
  display: block;
  width: 1.481481rem;
  padding-right: .185185rem;
  text-align: right;
}
.content-mid .form-item input{
  display: block;
  height: .537037rem;
  padding: .092593rem;
}
.content-mid .form-item textarea{
  display: block;
  width: 7.037037rem;
  height: 1.388889rem;
  padding: .138889rem;
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
.footer-item{
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #dbdbdb;
  padding: .185185rem 1.018519rem;
  background-color: #fff;
  z-index: 999;
}
.footer-item > button{
  border: 0;
  outline: none;
  display: block;
  width: 100%;
  height: .916667rem;
  border-radius: .037037rem;
  font-size: .37037rem;
  background-color: #fdcc07;
}
.evaluate-item{
  margin-top: .333333rem;
  padding: .509259rem .722222rem .740741rem .722222rem;
  border-bottom: 1px solid #dbdbdb;
  background-color: #fff;
}
.evaluate-item ul{
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
}
.evaluate-item > p{
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
  padding: .185185rem;
}
.evaluate-item ul li{
  width: .555556rem;
  height: .518519rem;
  margin: 0 .185185rem;
  background-image: url(../../../static/img/enterprise/icon.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
}
.evaluate-item ul li.active{
  background-image: url(../../../static/img/enterprise/icon-selected.png);
}
</style>
