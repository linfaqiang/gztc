<template>
  <div class="new-list-page">
    <!--头部-->
    <sub-header title="活动详情"></sub-header>
    <div class="ad-container-box">
      <div class="ad-box">
        <div class="ad-container">
          <div class="ad-container-title">
            {{activity.actTitle}}
          </div>
          <div class="ad-container-item clearfix">
            <span class="base-info">发布时间： {{activity.publishTime}}</span>
            <span class="base-info">评论： {{commentCount}}</span>
            <span :class="activity.class">{{activity.satus}}</span>
          </div>
          <div class="ad-container-item">
            <span>{{activity.classifyName}}</span>
            <span class="i-activity-cost" v-if="activity.cost > 0">
              门票：
              <span class="i-activity-cost-num">{{activity.cost}}</span>
              元
            </span>
            <span class="i-activity-cost"  v-if="activity.cost === 0">
              免费
            </span>
          </div>
          <div class="ad-container-item">
            <span class="ad-c-i-icon">
              <img src="../../assets/ad-address.png">
            </span>
            <span>{{activity.actAddress}}</span>
          </div>
          <div class="ad-container-item">
            <span class="ad-c-i-icon">
              <img src="../../assets/ad-time.png">
            </span>
            <span>{{activity.actStartTime}} 至 {{activity.actEndTime}}</span>
          </div>
          <div v-html="activity.actDescription" class="ad-content">
          </div>
        </div>

        <div class="ad-comment">
          <div class="ad-comment-title">评论<span class="ad-comment-count">（{{commentCount}}）</span></div>
          <div class="ad-comment-box" v-if="commontList.length > 0 || userInfo.isLogin">
            <div v-if="userInfo.isLogin">
              <textarea v-model="comment" class="ad-comment-input" placeholder="请输入"></textarea>
              <div class="submit-comment-btn" @click="submitCommentAction">提交评论</div>
            </div>
            <div class="comment-list-box">
              <van-list v-model="loading" :finished="finished" @load="onLoad" >
                <div v-for="(comment, index) in commontList" :key="index" class="clearfix ad-comment-item">
                  <img class="comment-item-img" :src="comment.memberLogo">
                  <div class="ad-comment-item-describe">
                    <div class="clearfix">
                      <span class="ad-comment-item-user">
                        {{comment.nickname}}
                      </span>
                      <span class="ad-comment-item-time">
                        {{comment.commentTime}}
                      </span>
                    </div>
                    <p class="ad-comment-content">
                      {{comment.commentContent}}
                    </p>
                  </div>
                </div>
              </van-list>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="ad-btn-box">
      <div :class="btnJoinEnable" @click="joinActivity">{{btnText}}</div>
    </div>
    <!--提交加载Loading-->
    <div class="loading-spinner-item" v-show="showLoadding">
      <van-loading color="white" />
    </div>
  </div>
</template>
<script>
import { List, Toast, Loading } from 'vant'
import SubHeader from '@/components/common/SubHeader'
export default {
  components: {
    [List.name]: List,
    [Toast.name]: Toast,
    [Loading.name]: Loading,
    SubHeader
  },
  data () {
    return {
      activity: {}, // 活动实体
      comment: '', // 评论内容
      commontList: [], // 评论列表
      loading: false,
      finished: false,
      pageNum: 1, // 评论分页
      pageSize: 6, // 每页容量
      id: '',
      commentCount: 0,
      userInfo: {},
      showLoadding: false,
      btnText: '参加活动',
      btnJoinEnable: {
        'ad-btn': true,
        'ad-join-btn-disable': false
      }
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
    },
    // 获取活动信息
    getActivityDetail () {
      var that = this
      var queryData = {
        id: this.$route.query.id
      }
      that.showLoadding = true
      this.$http.post('/api/activity/activityDetails', queryData).then(function (res) {
        that.showLoadding = false
        if (res.data.result) {
          var activity = res.data.result
          activity.class = {}
          activity.actEndTime = activity.actEndTime.split(' ')[0]
          activity.actStartTime = activity.actStartTime.split(' ')[0]
          if (activity.publishTime) {
            activity.publishTime = activity.publishTime.split(' ')[0]
          }
          activity.class['i-activity-status'] = true
          switch (activity.actStatus) {
            case 0:
            case 1:
              activity.satus = '即将开始'
              break
            case 2:
              activity.satus = '进行中'
              that.btnText = '活动已开始'
              that.btnJoinEnable['ad-join-btn-disable'] = true
              break
            case 3:
            case 4:
            case 5:
            case 6:
              activity.satus = '已结束'
              that.btnText = '活动已结束'
              activity.class['i-activity-end'] = true
              that.btnJoinEnable['ad-join-btn-disable'] = true
              break
          }
          if (!activity.class['i-activity-end']) {
            if (new Date(activity.applyEndTime.replace(/-/g, '/')).getTime() < new Date().getTime()) {
              that.btnText = '报名截止'
              that.btnJoinEnable['ad-join-btn-disable'] = true
            }
            if (activity.applyStatus) {
              if (that.btnText === '参加活动') {
                that.btnText = '已报名'
                that.btnJoinEnable['ad-join-btn-disable'] = true
              }
            }
          }
          that.activity = activity
        }
      })
    },
    // 判断是否为空
    isEmpty (str) {
      return str.trim().length === 0
    },
    // 提交评论
    submitCommentAction () {
      var that = this
      var queryData = {
        actId: this.id,
        content: this.comment
      }
      if (this.isEmpty(this.comment)) {
        Toast('评论内容不能为空')
        return
      }
      this.$http.post('/api/activity/comment', queryData).then(function (res) {
        if (res.data.success) {
          that.pageNum = 1
          that.comment = ''
          that.onLoad()
        } else {
          Toast(res.data.message)
        }
      })
    },
    onLoad () {
      var that = this
      var queryData = {
        id: that.id,
        pageNum: that.pageNum,
        pageSize: that.pageSize
      }
      this.$http.post('/api/activity/commentList', queryData).then(function (res) {
        that.loading = false
        if (res.data.result.length > 0) {
          if (that.pageNum === 1) {
            that.commontList = []
          }
          that.commentCount = res.data.result[0].count
          that.pageNum += 1
          that.commontList = that.commontList.concat(res.data.result)
        } else {
          that.finished = true
        }
      }).catch(function (err) {
        Toast.fail(err.message)
      })
    },
    // 参加活动页面
    joinActivity () {
      var that = this
      if (this.btnJoinEnable['ad-join-btn-disable']) {
        Toast(that.btnText)
        return
      }
      this.$router.push({
        name: 'ActiveJoin',
        query: {
          id: this.id
        }
      })
    }
  }
}
</script>
<style scoped>
.ad-container-box {
  width: 100%;
  background: #fff;
  position: absolute;
  min-height: 100%;
}
.ad-box {
  margin-bottom: 1.435185rem;
}
.ad-btn-box {
  position: fixed;
  width: 100%;
  height: 1.435185rem;
  bottom: 0;
  background: #fff;
  border: 1px solid #dbdbdb;
}

.ad-container {
  padding: 0.555556rem 0.462963rem;
  text-align: left;
  line-height: 1.5;
}
.ad-container-title {
  font-size: 0.444444rem;
}
.ad-container-item {
  margin-top: 0.37037rem;
  line-height: 1;
  font-size: 0.314815rem;
}
.ad-c-i-icon img{
  width: 0.314815rem;
  height: 0.314815rem;
}
.base-info {
  font-size: 0.296296rem;
  color: #878787;
  margin-right: 0.740741rem;
}
.i-activity-status {
  float: right;
  padding: 0.037037rem 0.094074rem;
  text-align: center;
  font-size: 0.259259rem;
  color: #1a1a1a;
  background: #fecd05;
  line-height: 1;
     -moz-border-radius: 0.034074rem;
       -o-border-radius: 0.034074rem;
  -webkit-border-radius: 0.034074rem;
          border-radius: 0.034074rem;
}
.i-activity-end {
  color: #fff;
  background: #c1c1c1;
}
.i-activity-cost {
  float: right;
  color: #878787;
  font-size: 0.314815rem;
}
.i-activity-cost-num {
  color: #ed0000;
  font-size: 0.314815rem;
}

.ad-img-box {
  width: 8.842593rem;
  height: auto;
  margin: 0 auto;
  margin-top: 0.648148rem;
  margin-bottom: 0.925926rem;
}
.ad-content {
  margin-top: 0.462963rem;
  word-break:break-all;
  word-wrap:break-word;
}

.ad-comment {
  text-align: left;
}
.ad-comment-title{
  font-size: 0.444444rem;
  padding: 0 0.462963rem;;
}
.ad-comment-count {
  font-size: 0.296296rem;
  color: #878787;

}

.ad-comment-box {
  width: 95%;
  overflow-x: hidden;
  margin: 0 auto;
  margin-top: 0.277778rem;
  border: 1px solid #e4e4e4;
  padding: 0.277778rem;
  background: #f9f9f9;
}
.ad-comment-input {
  width: 100%;
  max-width: 100%;
  min-height: 1.666667rem;
  padding: 0.185185rem;
  font-size: 0.296296rem;
  border: 1px solid #e4e4e4;
}
.submit-comment-btn {
  width: 2.777778rem;
  height: 0.703704rem;
  line-height: 0.703704rem;
  text-align: center;
  background: #fdcc07;
  font-size: 0.333333rem;
  margin-top: 0.222222rem;
     -moz-border-radius: 0.037037rem;
       -o-border-radius: 0.037037rem;
  -webkit-border-radius: 0.037037rem;
          border-radius: 0.037037rem;
}
.comment-list-box {
  width: 100%;
}
.ad-comment-item {
  width: 100%;
  border-bottom: 1px solid #dbdbdb;
  margin-top: 0.462963rem;
  padding-bottom: 0.462963rem;
}
.comment-item-img {
  width: 1.064815rem;
  height: 1.064815rem;
  float: left;
     -moz-border-radius: 50%;
       -o-border-radius: 50%;
  -webkit-border-radius: 50%;
          border-radius: 50%;
}
.ad-comment-item-describe {
  width: 7.407407rem;
  float: right;
  margin-left: 0.37037rem;
}
.ad-comment-item-user {
  font-size: 0.333333rem;
  color: #000;
  float: left;
}
.ad-comment-item-time {
  font-size: 0.314815rem;
  color: #5a5a5a;
  float: right;
}
.ad-comment-content {
  margin-top: 0.185185rem;
  line-height: 1.5;
  font-size: 0.333333rem;
}

.ad-btn {
  width: 8.148148rem;
  height: 0.925926rem;
  line-height: 0.925926rem;
  margin: 0 auto;
  background: #fdcc07;
  font-size: 0.37037rem;
  margin-top: 0.222222rem;
}
.ad-join-btn-disable {
  background: #ccc;
  color: #fff;
}
.clearfix {
  zoom: 1;
  *zoom: 1;
}
.clearfix:after {
  content: ".";
  display: block;
  font-size: 0;
  height: 0;
  clear: both;
  visibility: hidden
}
</style>
