<template>
  <div class="lease-page">
    <!--头部-->
    <sub-header :title="servicelevel.name"></sub-header>
    <!--大图-->
    <div class="lease-img">
      <img :src="servicelevel.mobileCover" alt="">
    </div>
    <!--导航列表-->
    <div class="navbar-list">
      <ul>
        <li v-for="service in servicelevel.serviceVos" :key="service.id" @click="toLink(service)">
          <div class="icon-item"><img :src="service.icon" alt=""></div>
          <p>{{service.name}}</p>
        </li>
      </ul>
    </div>
    <!--内容列表-->
    <div class="content-list" v-html="servicelevel.cateDescribe"></div>
  </div>
</template>
<script>
import { Toast } from 'vant'
import { getServicelevel2 } from '@/api/index'
import SubHeader from '@/components/common/SubHeader'
import { mapGetters } from 'vuex'
export default {
  name: 'SubLease',
  data () {
    return {
      servicelevel: {},
      levelId: 0
    }
  },
  components: {
    [Toast.name]: Toast,
    SubHeader
  },
  computed: {
    ...mapGetters(['getUserInfo'])
  },
  created () {
    this.levelId = this.$route.query.id
    getServicelevel2({
      parkId: this.getUserInfo.selectParkId,
      ServiceCateId: this.levelId
    }).then((res) => {
      if (res.data.success) {
        this.servicelevel = res.data.result
      }
    }).catch((err) => {
      Toast.fail(err.message)
    })
  },
  methods: {
    toLink (service) {
      switch (service.type) {
        case 0: // 预约服务
          this.$router.push({path: 'AppointmentDetails', query: {id: service.id}})
          break
        case 1: // 付费服务
          this.$router.push({path: 'ServiceRepair', query: {id: service.id, type: service.type, name: service.name}})
          break
        case 2: // 系统服务
          this.$router.push({path: service.url, query: {id: service.id}})
          break
      }
    }
  }
}
</script>
<style scoped>
img {
  max-width: 100%;
}
.navbar-list {
  margin-bottom: .203704rem;
  padding: 0 .259259rem;
  background-color: #fff;
}

.navbar-list ul {
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
  flex-wrap: wrap;
  -webkit-flex-wrap: wrap;
}

.navbar-list ul li {
  width: 25%;
  padding: .685185rem 0 .555556rem 0;
  text-align: center;
}
.navbar-list ul li .icon-item {
  width: .925926rem;
  height: .898148rem;
  margin: 0 auto;
  text-align: center;
}
.navbar-list ul li .icon-item img{
  width: 100%;
  height: 100%;
}
.navbar-list ul li p {
  color: #3d3d3d;
  font-size: .333333rem;
  text-align: center;
  padding-top: .277778rem;
}
.content-list{
  color: #2e2e2e;
  font-size: .333333rem;
  text-align: left;
  padding: 0 .509259rem;
  background-color: #fff;
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
</style>
