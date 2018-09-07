<template>
  <div class="introduction-page">
    <!--头部-->
    <sub-header title="预约服务详情"></sub-header>
    <!--内容列表-->
    <div class="introduction-content">
      <h3>{{serviceDetails.name}}</h3>
      <div class="cost-item">预约费用：免费</div>
      <div class="content-list" v-html="serviceDetails.serviceDescribe"></div>
    </div>
    <div class="footer-item">
      <button type="button" @click="toLink()">预&nbsp;&nbsp;约</button>
    </div>
  </div>
</template>
<script>
import { Toast } from 'vant'
import SubHeader from '@/components/common/SubHeader'
import { getService } from '@/api/index'
export default {
  name: 'Introduction',
  data () {
    return {
      appointName: '',
      serviceDetails: {},
      sid: -1 // 参观项目ID
    }
  },
  components: {
    [Toast.name]: Toast,
    SubHeader
  },
  methods: {
    toLink () {
      this.$router.push({
        path: 'AppointmentService',
        query: {
          id: this.serviceDetails.id
        }
      })
    }
  },
  created () {
    this.sid = this.$route.query.id
    getService({sid: this.sid}).then((res) => {
      if (res.data.success) {
        this.serviceDetails = res.data.result
      }
    }).catch((err) => {
      Toast.fail(err.message)
    })
  }
}
</script>
<style>
img {
  max-width: 100%;
}
.introduction-content{
  padding: 0 .509259rem 1.296296rem .509259rem;
  text-align: left;
  background-color: #fff;
}
.introduction-content > h3{
  font-size: .444444rem;
  padding-top: .601852rem;
}
.introduction-content .cost-item{
  color: #636363;
  font-size: .296296rem;
  padding: .277778rem 0;
  margin-bottom: .555556rem;
  border-bottom: 1px solid #dbdbdb;
}
.content-list{
  color: #2e2e2e;
  font-size: .333333rem;
  text-align: left;
}
.content-list h3{
  font-size: .444444rem;
}
.content-list h4{
  font-weight: 500;
  line-height: .5rem;
}
.content-list p{
  line-height: .5rem;
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
</style>
