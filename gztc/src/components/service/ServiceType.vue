<template>
  <div class="service-type-page">
    <!--头部-->
    <sub-header title="服务分类"></sub-header>
    <!--头部-->
    <div class="navbar-list">
      <div class="item" v-for="service in serviceList" :key="service.id">
        <h3 v-if="service.serviceVos.length > 0">
          <span>{{service.name}}</span>
        </h3>
        <ul>
          <li v-for="subService in service.serviceVos" :key="subService.id" @click="toLink(subService)">
            <div class="icon-item">
              <img :src="subService.icon" alt="">
            </div>
            <p>{{subService.name}}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from 'vant'
import { getMoreServiceCate } from '@/api/index'
import SubHeader from '@/components/common/SubHeader'
import { mapGetters } from 'vuex'
export default {
  name: 'ServiceType',
  data () {
    return {
      serviceList: []
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
    getMoreServiceCate({parkId: this.getUserInfo.selectParkId}).then((res) => {
      if (res.data.result) {
        this.serviceList = res.data.result
      }
    }).catch((err) => {
      console.log(err.message)
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
<style>
img {
  max-width: 100%;
}
.navbar-list {
  margin-bottom: .203704rem;
  padding: 0 .259259rem;
  padding-top: .416667rem;
  background-color: #fff;
}
.navbar-list h3{
  position: relative;
  color: #3b3b3b;
  font-size: .37037rem;
  text-align: left;
  line-height: .444444rem;
}
.navbar-list h3 span{
  position: relative;
  display: inline-block;
  padding-right: .166667rem;
  background-color: #fff;
  z-index: 10;
}
.navbar-list h3::before{
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  height: 1px;
  background-color: #dcdcdc;
  z-index: 0;
}
.navbar-list ul {
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
  flex-wrap:wrap;
  flex-wrap:-webkit-wrap;
  padding: .324074rem;
}

.navbar-list ul li {
  width: 25%;
  padding: .324074rem 0 .324074rem 0;
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
  padding-top: .509259rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
