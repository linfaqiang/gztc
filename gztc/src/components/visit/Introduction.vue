<template>
  <div class="introduction-page">
    <!--头部-->
    <sub-header title="园区详情"></sub-header>
    <!--内容列表-->
    <div class="introduction-content">
      <h3>{{project.vpTitle}}</h3>
      <div class="cost-item">参观费用：{{ project.vpChargeType === 0 ? '免费' : '收费'}}</div>
      <div class="content-list" v-html="project.vpDescription"></div>
    </div>
    <div class="footer-item">
      <button type="button" @click="toAppointment()">申请参观</button>
    </div>
  </div>
</template>
<script>
import { Toast } from 'vant'
import SubHeader from '@/components/common/SubHeader'
import { getVisitProject } from '@/api/index'
import { mapGetters } from 'vuex'
export default {
  name: 'Introduction',
  data () {
    return {
      project: {},
      proId: -1 // 参观项目ID
    }
  },
  components: {
    [Toast.name]: Toast,
    SubHeader
  },
  computed: {
    ...mapGetters(['getUserInfo'])
  },
  methods: {
    toAppointment () {
      this.$router.push({
        path: 'VisitAppointment',
        query: {
          proId: this.project.id,
          vpTitle: this.project.vpTitle,
          vpChargeType: this.project.vpChargeType,
          cost: this.project.cost
        }
      })
    }
  },
  created () {
    getVisitProject({parkId: this.getUserInfo.selectParkId}).then((res) => {
      if (res.data.success) {
        this.project = res.data.result
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
