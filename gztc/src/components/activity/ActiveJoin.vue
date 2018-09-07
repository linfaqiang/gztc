<template>
  <div class="aj-box">
    <!--头部-->
    <sub-header title="参加活动"></sub-header>
    <div class="aj-container">
      <div class="aj-container-title">
        {{activity.actTitle}}
      </div>
      <div class="aj-container-item">
        <div class="aj-activity-cost" v-if="activity.cost > 0">
          门票：
          <span class="aj-activity-cost-num">{{activity.cost}}</span>
          元
        </div>
        <span class="aj-activity-cost"  v-if="activity.cost === 0">
          免费
        </span>
      </div>
      <div class="aj-container-item aj-remine-info">
        注：暂时没有该数据信息
      </div>
      <div class="aj-container-item">
        <span class="ad-c-i-icon">
          <img src="../../assets/ad-address.png">
        </span>
        <span>{{activity.actAddress}}</span>
      </div>
      <div class="aj-container-item">
        <span class="ad-c-i-icon">
          <img src="../../assets/ad-time.png">
        </span>
        <span>{{activity.actStartTime}}至{{activity.actEndTime}}</span>
      </div>
    </div>
    <div class="com-form com-form-top">
      <dl>
        <dd>
          <label>
            <span>*</span>
            联系人:
          </label>
          <input class="com-text-left" type="text" name="" v-model="userName" @input="nameInput">
        </dd>
        <dd>
          <label>
            <span>*</span>
            手&nbsp;&nbsp;&nbsp;&nbsp;机:
          </label>
          <input type="text" v-model="mobile" name="">
        </dd>
      </dl>
    </div>
    <div class="aj-btn-box">
      <div :class="btnJoinEnable" @click="joinActivitySubmit">提&nbsp;&nbsp;交</div>
    </div>
    <!--提交加载Loading-->
    <div class="loading-spinner-item" v-show="showLoadding">
      <van-loading color="white" />
    </div>
  </div>
</template>
<script>
import { Toast, Loading } from 'vant'
import SubHeader from '@/components/common/SubHeader'
export default {
  components: {
    [Toast.name]: Toast,
    [Loading.name]: Loading,
    SubHeader
  },
  data () {
    return {
      activity: {}, // 活动实体
      mobile: '',
      showLoadding: false,
      userName: '',
      userInfo: {},
      btnJoinEnable: {
        'ad-btn': true,
        'ja-btn-disable': false
      }
    }
  },
  created () {
    this.init()
    this.getActivityDetail()
  },
  methods: {
    init () {
      var user = this.$store.getters.getUserInfo
      this.userInfo = user
      this.mobile = user.mobile
      this.userName = user.nickname
      this.id = parseInt(this.$route.query.id)
    },
    // 获取活动信息
    getActivityDetail () {
      var that = this
      var queryData = {
        id: this.id
      }
      this.$http.post('/api/activity/activityDetails', queryData).then(function (res) {
        if (res.data.result) {
          var activity = res.data.result
          activity.actEndTime = activity.actEndTime.split(' ')[0]
          activity.actStartTime = activity.actStartTime.split(' ')[0]
          that.activity = activity
        }
      })
    },
    nameInput () {
      if (this.isPhone(this.mobile) && this.isEmpty(this.userName)) {
        this.btnJoinEnable['ja-btn-disable'] = true
      } else {
        this.btnJoinEnable['ja-btn-disable'] = false
      }
    },
    phoneInput () {
      if (this.isPhone(this.mobile) && this.isEmpty(this.userName)) {
        this.btnJoinEnable['ja-btn-disable'] = true
      } else {
        this.btnJoinEnable['ja-btn-disable'] = false
      }
    },
    // 判断是否为空
    isEmpty (str) {
      return str.trim().length === 0
    },
    // 手机号码校验
    isPhone (mobile) {
      var phoneReg = /^[1][3,5,7,8][0-9]{9}$/
      return phoneReg.test(mobile)
    },
    // 参加活动页面
    joinActivitySubmit () {
      var that = this
      var queryData = {
        activityId: this.id,
        parkId: this.userInfo.selectParkId,
        name: this.userName,
        phone: this.mobile,
        cost: this.activity.cost
      }
      if (this.btnJoinEnable['ja-btn-disable']) {
        return
      }
      that.showLoadding = true
      that.$http.post('/api/activity/join', queryData).then(function (res) {
        that.showLoadding = false
        var result = res.data.result
        if (res.data.success) {
          if (result.cost > 0) {
            that.$router.push({
              name: 'SelectPay',
              query: {
                money: result.cost,
                orderNo: result.orderNo,
                orderId: result.id,
                orderType: '4',
                payOptionName: that.activity.actTitle + '(参加活动)',
                redirectUrl: 'ActivityOrderDetail'
              }
            })
          } else {
            that.$router.push({
              name: 'ActivityOrderDetail',
              query: {
                id: result.id
              }
            })
          }
        } else {
          Toast.fail(res.data.message)
        }
      })
    }
  }
}
</script>
<style scoped>
/* 参加活动 */
.aj-box {
  width: 100%;
  margin-bottom: 1.574074rem;
}
.aj-container {
  width: 100%;
  background: #fff;
  text-align: left;
  padding: 0.555556rem 0.462963rem;
  border-bottom: 1px solid #dbdbdb;
}
.aj-activity-cost-num {
  color: #ed0000;
  font-size: 0.314815rem;
}
.aj-activity-cost {
  font-size: 0.314815rem;
  color: #000;
}
.aj-container-title {
  font-size: 0.444444rem;
  color: #000;
  line-height: 1.4;
}
.aj-container-item {
  margin-top: 0.185185rem;
}
.aj-remine-info {
  font-size: 0.277778rem;
  color: #474747;
}

.aj-btn-box {
  position: fixed;
  width: 100%;
  height: 1.435185rem;
  bottom: 0;
  background: #f9f9f9;
}
.ad-btn {
  width: 8.148148rem;
  height: 0.925926rem;
  line-height: 0.925926rem;
  margin: 0 auto;
  background: #fdcc07;
  font-size: 0.37037rem;
  margin-top: 0.222222rem;
     -moz-border-radius: 0.074074rem;
       -o-border-radius: 0.074074rem;
  -webkit-border-radius: 0.074074rem;
          border-radius: 0.074074rem;
}
.ad-c-i-icon img{
  width: 0.314815rem;
  height: 0.314815rem;
}
.ja-btn-disable {
  background: #ccc;
  color: #fff;
}
</style>
