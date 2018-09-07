<template>
  <div class="person-page">
    <!--头部-->
    <sub-header title="个人中心"></sub-header>
    <!--头像-->
    <div class="person-img">
      <img src="static/img/center/center_bj.jpg" alt="">
      <div class="content">
        <div class="head-img">
          <img :src="userInfo.memberLogo" alt="">
        </div>
        <p>{{userInfo.nickname}}</p>
      </div>
    </div>
    <!--预定列表-->
    <div class="person-list">
      <ul>
        <li class="conference-appoint">
          <router-link to="/PlaceOrderList">
            会议室预定
            <span>（{{placeCount}}）</span>
          </router-link>
        </li>
        <li class="watch-appoint">
          <router-link to="/HouseOrderList">
            预约看房单
            <span>（{{houseCount}}）</span>
          </router-link>
        </li>
        <li class="application-appoint">
          <router-link to="/ServiceOrderList">
            预约申请单
            <span>（{{applyCount}}）</span>
          </router-link>
        </li>
        <li class="pay-application">
          <router-link to="/ChargeOrderList">
            付费申请单
            <span>（{{payCount}}）</span>
          </router-link>
        </li>
        <li class="active-reports">
          <router-link to="/ActivityOrderList">
            活动报名单
            <span>（{{activeCount}}）</span>
          </router-link>
        </li>
        <li class="my-questionnaire">
          <router-link to="/MyQuestionnaireList">
            我的问卷
            <span>（{{questionCount}}）</span>
          </router-link>
        </li>
        <li class="my-recommendation">
          <router-link to="/MyRecommend">
            我的推荐
            <span>（0）</span>
          </router-link>
        </li>
      </ul>
    </div>
    <!--设置列表-->
    <div class="setting-list">
      <ul>
        <li>
          <router-link to="/AccountSetting">
            <div class="icon-item"><img src="static/img/center/setting.png" alt=""></div>
            <p>账户设置</p>
          </router-link>
        </li>
        <li>
          <router-link :to="{path: 'Questionnaire', query: {id: this.getUserInfo.selectParkId}}">
            <div class="icon-item"><img src="static/img/center/record.png" alt=""></div>
            <p>调查问卷</p>
          </router-link>
        </li>
        <li>
          <router-link :to="{path: 'Feedback', query: {id: this.getUserInfo.selectParkId}}">
            <div class="icon-item"><img src="static/img/center/question.png" alt=""></div>
            <p>意见反馈</p>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { Toast } from 'vant'
import { getPlaceMessageCount, getSeeHouseMessageCount, activityApplyCount, serviceOrderCount, myQuestionCount } from '@/api/index'
import SubHeader from '@/components/common/SubHeader'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      placeCount: 0,
      houseCount: 0,
      activeCount: 0,
      applyCount: 0,
      payCount: 0,
      questionCount: 0,
      userInfo: {}
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
    this.userInfo = this.getUserInfo
    getPlaceMessageCount().then((res) => {
      if (res.data.success) {
        this.placeCount = res.data.result
      }
    }).catch((err) => {
      Toast.fail(err.message)
    })

    activityApplyCount({parkId: this.userInfo.selectParkId}).then((res) => {
      if (res.data.success) {
        this.activeCount = res.data.result
      }
    }).catch((err) => {
      Toast.fail(err.message)
    })

    getSeeHouseMessageCount({parkId: this.userInfo.selectParkId}).then((res) => {
      if (res.data.success) {
        this.houseCount = res.data.result
      }
    }).catch((err) => {
      Toast.fail(err.message)
    })

    myQuestionCount({}).then((res) => {
      if (res.data.success) {
        this.questionCount = res.data.result
      }
    }).catch((err) => {
      Toast.fail(err.message)
    })

    this.getServiceOrderCount(0)

    this.getServiceOrderCount(1)
  },
  methods: {
    getServiceOrderCount (type, count) {
      serviceOrderCount({parkId: this.userInfo.selectParkId, type: type}).then((res) => {
        if (res.data.success) {
          if (type === 0) {
            this.applyCount = res.data.result
          } else {
            this.payCount = res.data.result
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
img {
  max-width: 100%;
}
.person-page .person-img {
  position: relative;
}
.person-img .content {
  position: absolute;
  left: 50%;
  top: 50%;
  text-align: center;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
}
.person-img .head-img {
  width: 1.425926rem;
  height: 1.425926rem;
  padding: .037037rem;
  border-radius: 50%;
  margin: 0 auto;
  overflow: hidden;
  background-color: #fff;
}
.person-img p {
  color: #fff;
  font-size: .333333rem;
  margin-top: .222222rem;
}
.person-img .head-img img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.person-list {
  padding: .092593rem .259259rem 0 .259259rem;
  background-color: #fff;
}
.person-list ul li {
  position: relative;
  height: 1.240741rem;
  line-height: 1.240741rem;
  padding-left: 1.388889rem;
  border-bottom: 1px solid #d0d0d0;
  text-align: left;
}
.person-list ul li a{
  display: block;
  color: #2d2d2d;
}
.person-list ul li:last-child {
  border: 0;
}
.person-list ul li:after {
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
.person-list ul li:before {
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
.person-list ul .conference-appoint:before {
  background-image: url(../../../static/img/center/icon1.png);
}
.person-list ul .watch-appoint:before {
  background-image: url(../../../static/img/center/icon2.png);
}
.person-list ul .application-appoint:before {
  background-image: url(../../../static/img/center/icon3.png);
}
.person-list ul .pay-application:before {
  background-image: url(../../../static/img/center/icon4.png);
}
.person-list ul .active-reports:before {
  background-image: url(../../../static/img/center/icon5.png);
}
.person-list ul .my-recommendation:before {
  background-image: url(../../../static/img/center/icon6.png);
}
.person-list ul .my-questionnaire:before {
  background-image: url(../../../static/img/center/questionnaire.png);
}
.person-list ul li span {
  color: #fb1010;
}
.setting-list {
  padding: .388889rem .259259rem;
}
.setting-list ul {
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
  justify-content: space-around;
  -webkit-justify-content: space-around;
}
.setting-list ul li {
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
  align-items: center;
  -webkit-box-align: center;
  -webkit-align-items: center;
  justify-content: center;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  flex-direction: column;
  -webkit-box-orient: vertical;
  -webkit-flex-direction: column;
  width: 2.574074rem;
  height: 3.194444rem;
  text-align: center;
  border: 1px solid #dcdcdc;
  background-color: #fff;
}
.setting-list ul li .icon-item {
  width: .953704rem;
  height: .953704rem;
  margin: 0 auto;
  text-align: center;
}
.setting-list ul li p {
  color: #404040;
  font-size: .333333rem;
  text-align: center;
  padding-top: .425926rem;
}
</style>
