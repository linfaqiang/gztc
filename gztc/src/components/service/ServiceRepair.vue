<template>
  <div class="repair-page">
    <!--头部-->
    <sub-header :title="serviceName"></sub-header>
        <!--详情内容-->
    <div class="details-content">
      <div class="img-item">
        <img :src="pankService.mobileCover" alt="">
      </div>
      <div class="content-item">
        <h4>{{pankService.introduction}}：</h4>
        <table>
          <thead>
            <tr>
              <th width="33%">服务名称</th>
              <th width="27%">费用:元</th>
              <th width="40%">服务范围</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="service in serviceItem" :key="service.id">
              <td>{{service.name}}</td>
              <td>{{service.price | formatPrice}}</td>
              <td>
                <span>{{service.itemExplain}}</span>
              </td>
            </tr>
          </tbody>
        </table>
        <p class="explain">具体费用由技术人员上门评估后给出具体价格。</p>
        <p class="remarks">备注：</p>
        <p class="remarks-text" v-html="pankService.serviceDescribe"></p>
      </div>
      <div class="footer-item">
        <button type="button" @click="toAppointment()">预&nbsp;&nbsp;约</button>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from 'vant'
import SubHeader from '@/components/common/SubHeader'
import { getService, getServiceItem } from '@/api/index'
export default {
  name: 'ServiceRepair',
  data () {
    return {
      pankService: {},
      serviceItem: [],
      serviceName: '',
      sid: 0 // 服务id
    }
  },
  components: {
    [Toast.name]: Toast,
    SubHeader
  },
  filters: {
    formatPrice (price) {
      return price.toFixed(2)
    }
  },
  created () {
    this.id = this.$route.query.id
    this.serviceName = this.$route.query.name
    getService({sid: this.id}).then((res) => {
      this.pankService = res.data.result
    }).catch((err) => {
      Toast.fail(err.message)
    })
    // 服务项目
    getServiceItem({sid: this.id}).then((res) => {
      this.serviceItem = res.data.result
    }).catch((err) => {
      Toast.fail(err.message)
    })
  },
  methods: {
    toAppointment () {
      this.$router.push({
        path: 'Appointment',
        query: {
          id: this.pankService.id
        }
      })
    }
  }
}
</script>
<style scoped>
img {
  max-width: 100%;
}
.repair-page  .content-item{
  color: #4e4e4e;
  font-size: .333333rem;
  text-align: left;
  padding: 0 .37037rem;
  padding-bottom: 1.296296rem;
  background-color: #fff;
}
.content-item > h4{
  color: #202020;
  padding: .277778rem 0;
  line-height: .592593rem;
}
.content-item > table{
  width: 100%;
  margin: 0 auto;
  border-collapse: collapse;
}
.content-item > table th,
.content-item > table td{
  text-align: center;
  border: 1px solid #dbdbdb;
}
.content-item > table th{
  padding: .185185rem 0;
  background-color: #f9f9f9;
}
.content-item > table td{
  padding: .138889rem;
}
.content-item > table td span{
  display: block;
  text-align: center;
  line-height: .444444rem;
}
.content-item > .explain{
  color: #919191;
  font-size: .314815rem;
  padding: .277778rem 0;
}
.content-item > .remarks{
  padding-bottom: .222222rem;
}
.content-item > .remarks-text{
  line-height: .444444rem;
  padding-bottom: .740741rem;
  text-align: left;
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
  background-color: #fdcc07;
}
.supplement-item{
  display: block;
  margin-left: .462963rem;
}
</style>
