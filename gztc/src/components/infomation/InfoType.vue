<template>
  <div class="infomation-list">
    <!--头部-->
    <sub-header title="消息中心"></sub-header>
    <!--分类列表-->
    <div class="infomation-type-list">
      <ul>
        <li v-for="(info, index) in infomation" :key="index" :class="info.classText">
            <router-link :to="{path: 'InfomationList', query: {id: info.id, type: info.type}}">
              {{info.text}}
              <span>（{{info.count}}）</span>
            </router-link>
        </li>
      </ul>
    </div>
    <!--列表内容-->
    <div class="info-type-content" v-if="latestTwo.length > 0">
      <h2>最新消息</h2>
      <div class="type-item" v-for="latest in latestTwo" :key="latest.id">
        <h3 v-if="latest.type === 0">预约看房消息</h3>
        <h3 v-if="latest.type === 1">预约申请消息</h3>
        <h3 v-if="latest.type === 2">会议室/场地消息</h3>
        <h3 v-if="latest.type === 3">付费服务消息</h3>
        <h3 v-if="latest.type === 4">活动报名消息</h3>
        <h3 v-if="latest.type === 5">平台消息</h3>
        <ul>
          <li>
            <router-link :to="{path: 'InfomationDetails', query: {id: latest.id}}">
              <h4>
                {{latest.title}}&nbsp;
                <strong v-if="latest.status === 0">未读</strong>
                <strong v-if="latest.status === 1" class="end">已读</strong>
                <span>{{latest.createTime}}</span>
              </h4>
              <p v-html="latest.content"></p>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from 'vant'
import { latestTwo, messageCount } from '@/api/index'
import SubHeader from '@/components/common/SubHeader'
import { mapGetters } from 'vuex'
export default {
  name: 'InfomationList',
  data () {
    return {
      latestTwo: [],
      infomation: [
        {text: '预约看房消息', classText: 'conference-appoint', count: 0, type: 0},
        {text: '预约申请消息', classText: 'watch-appoint'},
        {text: '场地、会议室消息', classText: 'application-appoint', count: 0, type: 0},
        {text: '付费服务消息', classText: 'pay-application', count: 0, type: 0},
        {text: '活动报名消息', classText: 'active-reports', count: 0, type: 0},
        {text: '平台信息', classText: 'my-recommendation', count: 0, type: 0}
      ],
      msgCount: 0
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
    getMessageCount () {
      for (let i = 0; i < 6; i++) {
        messageCount({id: this.getUserInfo.id, type: i}).then((res) => {
          if (res.data.success) {
            this.infomation[i].count = res.data.result
            this.infomation[i].type = i
            this.msgCount += res.data.result
            this.$store.dispatch('commitMessageCount', this.msgCount)
          }
        }).catch((err) => {
          console.log(err.message)
        })
      }
    }
  },
  created () {
    this.getMessageCount()
    latestTwo({id: this.getUserInfo.id}).then((res) => {
      if (res.data.success) {
        this.latestTwo = res.data.result
      }
    }).catch((err) => {
      Toast.fail(err.message)
    })
  }
}
</script>
<style scoped>
img {
  max-width: 100%;
}
.infomation-type-list {
  margin-bottom: .37037rem;
  padding: .092593rem .259259rem 0 .259259rem;
  border-bottom: 1px solid #dcdcdc;
  background-color: #fff;
}
.infomation-type-list ul li {
  position: relative;
  height: 1.240741rem;
  line-height: 1.240741rem;
  padding-left: 1.388889rem;
  border-bottom: 1px solid #d0d0d0;
  text-align: left;
}
.infomation-type-list ul li a{
  display: block;
  color: #2d2d2d;
}
.infomation-type-list ul li:last-child {
  border: 0;
}
.infomation-type-list ul li:after {
  content: "";
  position: absolute;
  right: .481481rem;
  top: 0;
  width: .194444rem;
  height: 100%;
  background-image: url(../../../static/img/center/arrow-rt.png);
  background-position: left center;
  background-repeat: no-repeat;
  background-size: 100%;
}
.infomation-type-list ul li:before {
  content: "";
  position: absolute;
  left: .416667rem;
  top: 0;
  width: .62963rem;
  height: 100%;
  background-position: left center;
  background-repeat: no-repeat;
  background-size: 100%;
}
.infomation-type-list ul .conference-appoint:before {
  background-image: url(../../../static/img/center/icon1.png);
}
.infomation-type-list ul .watch-appoint:before {
  background-image: url(../../../static/img/center/icon2.png);
}
.infomation-type-list ul .application-appoint:before {
  background-image: url(../../../static/img/center/icon3.png);
}
.infomation-type-list ul .pay-application:before {
  background-image: url(../../../static/img/center/icon4.png);
}
.infomation-type-list ul .active-reports:before {
  background-image: url(../../../static/img/center/icon5.png);
}
.infomation-type-list ul .my-recommendation:before {
  background-image: url(../../../static/img/center/icon6.png);
}
.infomation-type-list ul li span {
  color: #fb1010;
}
.info-type-content{
  text-align: left;
  padding: .185185rem .277778rem 0 .277778rem;
  font-size: .314815rem;
  background-color: #fff;
}
.info-type-content > h2{
  color: #1a1a1a;
  text-align: center;
  font-size: .444444rem;
  padding-bottom: .185185rem;
}
.info-type-content .type-item{
  padding-bottom: .185185rem;
}
.info-type-content .type-item > h3{
  color: #303030;
  font-size: .37037rem;
  padding: .185185rem 0;
}
.info-type-content li{
  padding: .111111rem .37037rem .277778rem .37037rem;
  border: .018519rem solid #f2f2f2;
  background-color: #f9f9fb;
}
.info-type-content li a{
  display: block;
  color: #2d2d2d;
}
.info-type-content li h4{
  position: relative;
  padding: .185185rem 0;
  font-size: .333333rem;
}
.info-type-content li h4 strong{
  display: inline-block;
  vertical-align: middle;
  padding: .027778rem .138889rem;
  border-radius: .037037rem;
  font-size: .277778rem;
  font-weight: normal;
  text-align: center;
  background-color: #fecd05;
}
.info-type-content li h4 strong.end{
  color: #fff;
  background-color: #b7b7b7;
}
.info-type-content li h4 span{
  position: absolute;
  right: 0;
  top: 50%;
  font-size: .277778rem;
  transform: translate(0, -50%);
  -webkit-transform: translate(0, -50%)
}
.info-type-content li p{
  font-size: .314815rem;
  line-height: .555556rem;
}
</style>
