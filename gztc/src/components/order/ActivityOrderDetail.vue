<template>
  <div class="new-list-page">
    <!--头部-->
    <sub-header title="活动单详情"></sub-header>
    <div class="poa-c-base clearfix">
      <div class="poa-c-title">{{activity.actTitle}}</div>
      <div class="poa-c-item">门票：{{activity.cost}}元</div>
      <div class="poa-c-item">注：付费活动需完成在线支付后完成预约</div>
      <div class="poa-c-item">
        <img class="poa-c-item-icon" src="">
        <span>{{activity.actStartTime}} 至 {{activity.actEndTime}}</span>
      </div>
      <div class="poa-c-item">
        <img class="poa-c-item-icon" src="">
        <span>{{activity.actAddress}}</span>
      </div>
    </div>
    <div class="pod-c-info">
      <div class="poa-c-item clearfix">
        <span class="pod-cd-item-code">验证码：</span>
        <span class="pod-cd-item-code-num">{{activity.verifyCode}}</span>
        <span class="pod-cd-item-state" v-if="activity.codeStatus===0">未验证</span>
        <span class="pod-cd-item-state pod-cd-item-state-u" v-if="activity.codeStatus===1">已验证</span>
        <span class="pod-cd-item-state pod-cd-item-state-u" v-if="activity.codeStatus===2">已失效</span>
      </div>
      <div class="poa-c-item clearfix">
      </div>
      <div class="poa-c-item clearfix">
        提交时间：{{activity.createTime}}
      </div>
      <div class="poa-c-item clearfix">
        有效日期：{{activity.actEndTime}}
      </div>
      <div class="poa-c-item clearfix">
        预约人:{{activity.applyName}}
        <span class="pod-cd-item-r">手机：{{activity.contactPhone}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { List, Toast } from 'vant'
import SubHeader from '@/components/common/SubHeader'
export default {
  components: {
    [List.name]: List,
    [Toast.name]: Toast,
    SubHeader
  },
  data () {
    return {
      activity: {}, // 活动实体
      id: '',
      userInfo: {}
    }
  },
  created () {
    this.init()
    this.getActivityDetail()
    this.id = parseInt(this.$route.query.id)
  },
  methods: {
    init () {
      this.userInfo = this.$store.getters.getUserInfo
      this.id = this.$route.query.id
    },
    // 获取活动信息 POST /api/service/activityApplyDetail
    getActivityDetail () {
      var that = this
      var queryData = {
        orderId: that.id,
        pid: that.userInfo.selectParkId
      }
      this.$http.post('/api/service/activityApplyDetail', queryData).then(function (res) {
        if (res.data.result) {
          var activity = res.data.result
          activity.class = {}
          activity.actEndTime = activity.actEndTime.split(' ')[0]
          activity.actStartTime = activity.actStartTime.split(' ')[0]
          activity.class['i-activity-status'] = true
          switch (activity.actStatus) {
            case 0:
            case 1:
              activity.satus = '即将开始'
              break
            case 2:
              activity.satus = '进行中'
              break
            case 3:
            case 4:
            case 5:
            case 6:
              activity.satus = '已结束'
              activity.class['i-activity-end'] = true
              break
          }
          that.activity = activity
        }
      })
    }
  }
}
</script>
<style scoped>
</style>
