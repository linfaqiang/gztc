<template>
  <div class="Index" v-cloak>
    <!-- header -->
    <div class="com-header clearfix">
      <div class="i-park" @click="goSelectPark">
        <span class="i-h-icon">
          <img src="../../assets/index/i_address.png">
        </span>
        <span class="i-h-address">{{ userInfo.selectParkName }}</span>
        <span class="i-h-select-icon">
          <img src="../../assets/index/i_select.png">
        </span>
      </div>
      <div v-if="getMessageCount > 0" class="i-header-news i-header-news-active" @click="toInfomation()">
        <van-icon name="chat"/>
      </div>
      <div v-else class="i-header-news" @click="toInfomation()">
        <van-icon name="chat"/>
      </div>
      <div class="i-header-login" @click="login" v-if="!userInfo.isLogin && showTopLogin">GO</div>
      <div class="i-head-portrait" v-if="userInfo.memberLogo !== ''" @click="toPersonCenter"><img :src="userInfo.memberLogo"></div>
    </div>
    <!-- header -->
    <!-- banner -->
    <div class="i-banner">
      <van-swipe :autoplay="3000">
        <van-swipe-item v-for="(item, index) in banners" :key="index">
          <a :href="item.url">
            <img :src="item.imgUrl">
          </a>
        </van-swipe-item>
      </van-swipe>
    </div>
    <!-- banner -->

    <!-- login -->
    <div class="i-login" v-if="!userInfo.isLogin">
      <div class="i-login-text" @click="login">请登录</div>
      <div class="i-login-btn" @click="login">go</div>
    </div>
    <!-- login -->

    <!-- service item -->
    <div class="i-service">
      <van-row>
        <van-col span="6" class="i-service-more" v-for="(item, index) in services" :key="index" v-if="services">
          <div @click="toServicePage(item.id, item.type, item.url)">
          <img class="i-service-img" :src="item.icon">
          <div class="i-service-name">
            {{ item.name }}
          </div>
        </div>
        </van-col>
        <van-col span="6" class="i-service-more" v-if="services.length===7">
          <div @click="toServiceType">
            <img class="i-service-img" src="../../assets/index/i_service_more.png">
            <div class="i-service-name">
              更多
            </div>
          </div>
        </van-col>
      </van-row>
    </div>
    <!-- service item -->

    <!-- news -->
    <div class="i-news" v-if="news.id">
      <div class="i-news-box clearfix">
        <div class="i-news-type">
          <img src="../../assets/index/i_news.png">
          <span class="i-news-type-name"> {{ news.typeName }} </span>
        </div>
        <div class="i-news-info"  @click="toNewsDetail(news.id)"> {{ news.title }}</div>
        <span class="i-news-more" @click="toNewsList">
          更多 &gt;
        </span>
      </div>
    </div>
    <!-- news -->

    <!-- project -->
    <div class="i-project" v-if="project.id">
      <div class="i-title">
        办公/商业
      </div>
      <div class="i-project-box">
        <div class="i-project-info"  @click="toApartmentDetails(project.id, 0)">
          <img :src="project.mobileCover">
          <div class="i-project-detail">
            <div class="i-project-name">{{ project.name }}</div>
            <div class="i-project-item clearfix">
              <span class="item-property">所属区域：</span>
              <span class="item-property-value">{{ project.parkName }}</span>
            </div>
            <div class="i-project-item clearfix">
              <span class="item-property">建筑类型：</span>
              <span class="item-property-value">{{ project.buildingType }}</span>
            </div>
            <div class="i-project-item clearfix">
              <span class="item-property">
                地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址&nbsp;&nbsp;：
              </span>
              <span class="item-property-value item-address-value">
                {{ project.address }}
              </span>
            </div>
            <div class="i-project-item clearfix">
              <div class="item-link-detail">
                <img src="../../assets/index/i_detail.png">
                <span class="item-link-describe">详情</span>
              </div>
              <div class="item-link-praise">
                <img src="../../assets/index/praise.png">
                <span class="item-link-describe">推荐</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- project -->

    <!-- Popular Entrepreneurship -->
    <div class="i-project" v-if="createSpace.id">
      <div class="i-title">
        腾讯众创空间
      </div>
      <div class="i-project-box">
        <div class="i-project-info" @click="toApartmentDetails(createSpace.id, 2)">
          <img :src="createSpace.mobileCover">
          <div class="i-project-detail">
            <div class="i-project-name">
              {{ createSpace.name }}
            </div>
            <div class="i-project-item clearfix">
              <span class="item-property">所属区域：</span>
              <span class="item-property-value">{{ createSpace.parkName }}</span>
            </div>
            <div class="i-project-item clearfix">
              <span class="item-property">建筑类型：</span>
              <span class="item-property-value">{{ createSpace.buildingType }}</span>
            </div>
            <div class="i-project-item clearfix">
              <span class="item-property">
                地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址&nbsp;&nbsp;：
              </span>
              <span class="item-property-value item-address-value">
                {{ createSpace.address }}
              </span>
            </div>
            <div class="i-project-item clearfix">
              <div class="item-link-detail">
                <img src="../../assets/index/i_detail.png">
                <span class="item-link-describe">详情</span>
              </div>
              <div class="item-link-praise">
                <img src="../../assets/index/praise.png">
                <span class="item-link-describe">推荐</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Popular Entrepreneurship -->

    <!-- 公寓banner -->
    <div class="i-apartment" v-if="apartment.id" @click="toApartmentDetails(apartment.id, 1)">
      <img :src="apartment.mobileCover">
    </div>
    <!-- 公寓banner -->

    <!-- activity -->
    <div class="i-activity" v-if="activityList.length>0">
      <div class="i-title">
        热门活动
        <span class="i-title-more" @click="toActivityList">
          更多 &gt;
        </span>
      </div>
      <div class="i-activity-box" v-for="(item, index) in activityList" :key="index" @click="toActivityDetail(item.id)">
        <div class="i-activity-info clearfix">
          <div class="i-iactivity-img">
            <img :src="item.mobileCover">
            <div class="i-activity-type">
              {{item.classifyName}}
            </div>
          </div>
          <div class="i-activity-detail">
            <div class="i-activity-detail-top">
              <div class="i-activity-time">
                <span v-if="item.actStatus < 2">{{item.actStartTime}} 至 </span>{{item.actEndTime}}
                <span v-if="item.actStatus > 1">截止</span>
                <span class="i-activity-cost" v-if="item.cost > 0">
                  门票：
                  <span class="i-activity-cost-num">￥{{item.cost}}</span>
                </span>
                <span class="i-activity-cost"  v-if="item.cost === 0">
                  免费
                </span>
              </div>
              <div class="i-activity-name">
                {{item.actTitle}}
              </div>
              <div class="i-activity-status-box">
                <span :class="item.class">{{item.satus}}</span>
              </div>
            </div>
            <div class="i-activity-address">
              {{item.actAddress}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- activity -->

    <!-- enterprise -->
    <div class="i-enterprise" v-if="enterpriseList.length>0">
      <div class="i-title">
        商家/企业速递
      </div>
      <div class="i-enterprise-box clearfix">
        <van-list v-model="loading" :finished="finished" @load="getEnterprise" >
          <div class="i-enterprise-item" v-for="(item, index) in enterpriseList" :key="index">
            <img class="i-enterprise-img" :src="item.logo">
            <div class="i-enterprise-name">
              {{ item.fullName }}
            </div>
            <div class="i-enterprise-industry">
              {{ item.enterpriseLabel }}
            </div>
            <div class="i-enterprise-detaile" @click="toEnterDetail(item.id)">
              了解详情
            </div>
          </div>
        </van-list>
      </div>
    </div>
    <!-- enterprise -->
  </div>
</template>

<script>
import { Row, Col, Swipe, SwipeItem, Toast, List, Icon } from 'vant'
import { SetCookie } from '@/sys.util'
import { mapGetters } from 'vuex'
export default {
  name: 'Index',
  park: {
    name: '',
    id: 1
  },
  components: {
    [List.name]: List,
    [Row.name]: Row,
    [Col.name]: Col,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Toast.name]: Toast,
    [Icon.name]: Icon
  },
  data () {
    return {
      showTopLogin: false,
      userInfo: {},
      banners: [],
      services: [],
      news: {},
      project: {},
      createSpace: {},
      apartment: {},
      activityList: [],
      enterpriseList: [],
      loading: false,
      finished: false,
      pageNum: 1
    }
  },
  created () {
    this.getBannerInfo()
    this.init()
  },
  computed: {
    ...mapGetters(['getMessageCount'])
  },
  methods: {
    /**
     * 页面初始化
     */
    init () {
      this.userInfo = this.$store.getters.getUserInfo
      var that = this
      that.$http.post('/api/member/getMemberData').then(function (res) {
        var result = res.data.data
        if (result.parkId === null || result.enterpriseName === null || result.mobile === null) {
          that.$http.post('/api/index/getDefaultPark').then(function (res) {
            that.initUserInfo({
              isLogin: false,
              parkId: res.data.result.parkId,
              parkName: res.data.result.parkName,
              enterpriseId: '',
              enterpriseName: '',
              mobile: '',
              nickname: '',
              memberLogo: '',
              selectParkId: res.data.result.parkId,
              selectParkName: res.data.result.parkName
            }, false)
            that.saveUserIfo()
            that.getInitData()
          })
        } else {
          that.initUserInfo(result, true)
          that.saveUserIfo()
          that.getInitData()
        }
      }).catch(function (error) {
        // 获取默认园区数据
        if (error.response.status === 401) {
          that.$http.post('/api/index/getDefaultPark').then(function (res) {
            that.initUserInfo({
              isLogin: false,
              parkId: res.data.result.parkId,
              parkName: res.data.result.parkName,
              enterpriseId: '',
              enterpriseName: '',
              mobile: '',
              nickname: '',
              memberLogo: '',
              selectParkId: res.data.result.parkId,
              selectParkName: res.data.result.parkName
            }, false)
            that.saveUserIfo()
            that.getInitData()
          })
        }
      })
    },
    // 初始化用户信息
    initUserInfo (result, isLogin) {
      var userInfo = this.userInfo
      userInfo.id = result.id
      userInfo.isLogin = isLogin
      userInfo.parkId = result.parkId
      userInfo.parkName = result.parkName
      userInfo.enterpriseId = result.enterpriseId
      userInfo.enterpriseName = result.enterpriseName
      userInfo.mobile = result.mobile
      userInfo.nickname = result.nickname
      userInfo.memberLogo = result.memberLogo
      if (userInfo.selectParkId === '' || userInfo.selectParkId === undefined || userInfo.selectParkId === 'undefined') {
        userInfo.selectParkId = result.parkId
        userInfo.selectParkName = result.parkName
      }
      this.$store.dispatch('commitUserInfo', userInfo)
      this.userInfo = userInfo
    },
    // 保存数据信息 (暂时存放在cookie中)
    saveUserIfo () {
      var userInfo = this.userInfo
      SetCookie('id', userInfo.id)
      SetCookie('isLogin', userInfo.isLogin)
      SetCookie('parkId', userInfo.parkId)
      SetCookie('parkName', encodeURI(userInfo.parkName))
      SetCookie('enterpriseId', userInfo.enterpriseId)
      SetCookie('enterpriseName', encodeURI(userInfo.enterpriseName))
      SetCookie('mobile', userInfo.mobile)
      SetCookie('nickname', encodeURI(userInfo.nickname))
      SetCookie('memberLogo', encodeURI(userInfo.memberLogo))
      SetCookie('selectParkId', userInfo.selectParkId)
      SetCookie('selectParkName', encodeURI(userInfo.selectParkName))
    },
    // 初始化数据
    getInitData () {
      this.getService()
      this.getNews()
      this.getProject()
      this.getCreateSpace()
      this.getApartment()
      this.getActivityList()
      this.getEnterprise()
    },
    /**
     * 登录
     */
    login () {
      var that = this
      this.$http.post('/api/sso/authorize').then(function (res) {
        if (res.data.success) {
          that.userInfo.selectParkId = ''
          that.userInfo.selectParkName = ''
          that.$store.dispatch('commitUserInfo', that.userInfo)
          SetCookie('selectParkId', that.userInfo.selectParkId)
          SetCookie('selectParkName', that.userInfo.selectParkName)
          window.location = res.data.result
        }
      })
    },
    // 跳个人中心
    toPersonCenter () {
      this.$router.push({
        name: 'PersonCenter'
      })
    },
    /**
     * 跳转园区选择页面
     */
    goSelectPark () {
      var that = this
      this.$router.push({
        name: 'ParkSelect',
        query: {
          parkId: that.userInfo.selectParkId
        }
      })
    },
    // 跳活动列表
    toActivityList () {
      this.$router.push({
        name: 'ActivityList'
      })
    },
    // 跳活动详情
    toActivityDetail (id) {
      this.$router.push({
        name: 'ActivityDetail',
        query: {
          id: id
        }
      })
    },
    // 跳新闻列表
    toNewsList () {
      this.$router.push({
        name: 'NewsList'
      })
    },
    // 跳新闻详情
    toNewsDetail (id) {
      this.$router.push({
        name: 'NewsDetails',
        query: {
          id: id
        }
      })
    },
    // 跳服务分类
    toServiceType () {
      this.$router.push({
        name: 'ServiceType'
      })
    },
    // 跳二级通用页面
    toServicePage (id, type, url) {
      if (url === null || url === '') {
        this.$router.push({
          name: 'SubLease',
          query: {
            id: id,
            type: type
          }
        })
      } else {
        this.$router.push({
          name: url,
          query: {
            id: id,
            type: type
          }
        })
      }
    },
    // 跳项目详情
    toApartmentDetails (id, type) {
      this.$router.push({
        name: 'ApartmentDetails',
        query: {
          id: id,
          type: type
        }
      })
    },
    /**
     * 查询banner
     */
    getBannerInfo () {
      var that = this
      this.$http.get('/api/index/bannerImgList').then(function (res) {
        that.banners = res.data.result
      })
    },
    /**
     * 查询服务分类 POST /api/serviceCate/serviceCateList
     */
    getService: function () {
      var that = this
      var queryData = {
        'parkId': that.userInfo.selectParkId
      }

      this.$http.post('/api/serviceCate/serviceCateList', queryData).then(function (res) {
        if (res.data.result !== 'null') {
          that.services = res.data.result
        }
      })
    },
    /**
     * 查询新闻公告
     */
    getNews: function () {
      var that = this
      var queryData = {
        'parkId': that.userInfo.selectParkId
      }

      this.$http.post('/api/newbulletin/newsbulletin', queryData).then(function (res) {
        if (res.data.result !== null) {
          that.news = res.data.result
          if (that.news.type === 1) {
            that.news.typeName = '新闻'
          } else if (that.news.type === 2) {
            that.news.typeName = '公告'
          }
        }
      })
    },
    /**
     * 查询项目
     */
    getProject: function () {
      var that = this
      var queryData = {
        'parkId': that.userInfo.selectParkId,
        'type': 0
      }

      this.$http.post('/api/index/indexAttract', queryData).then(function (res) {
        if (res.data.result !== null) {
          that.project = res.data.result
          window.sessionStorage.setItem('projectName', that.project.parkName)
          window.sessionStorage.setItem('projectId', that.project.id)
        }
      })
    },
    /**
     * 查询众创空间
     */
    getCreateSpace: function () {
      var that = this
      var queryData = {
        'parkId': that.userInfo.selectParkId,
        'type': 2
      }

      this.$http.post('/api/index/indexAttract', queryData).then(function (res) {
        if (res.data.result !== null) {
          that.createSpace = res.data.result
        }
      })
    },
    /**
     * 查询公寓
     */
    getApartment: function () {
      var that = this
      var queryData = {
        'parkId': that.userInfo.selectParkId,
        'type': 1
      }

      this.$http.post('/api/index/indexAttract', queryData).then(function (res) {
        if (res.data.result !== null) {
          that.apartment = res.data.result
        }
      })
    },
    /**
     * 查询活动 POST /api/activity/activityList
     */
    getActivityList: function () {
      var that = this
      var queryData = {
        'parkId': that.userInfo.selectParkId
      }
      this.$http.post('/api/activity/activityList', queryData).then(function (res) {
        if (res.data.result !== null) {
          var activityListTemp = res.data.result
          for (var i = 0; i < activityListTemp.length; i++) {
            activityListTemp[i].classifyName = activityListTemp[i].classifyName.replace(/,/g, ' / ')
            activityListTemp[i].actStartTime = activityListTemp[i].actStartTime.split(' ')[0]
            activityListTemp[i].actEndTime = activityListTemp[i].actEndTime.split(' ')[0]
            activityListTemp[i].class = {}
            activityListTemp[i].class['i-activity-status'] = true
            switch (activityListTemp[i].actStatus) {
              case 0:
              case 1:
                activityListTemp[i].satus = '即将开始'
                break
              case 2:
                activityListTemp[i].satus = '进行中'
                break
              case 3:
              case 4:
              case 5:
              case 6:
                activityListTemp[i].satus = '已结束'
                activityListTemp[i].class['i-activity-end'] = true
                break
            }
          }
          that.activityList = activityListTemp
        }
      })
    },
    /**
     * 查询企业 POST /api/enterprise/enterpriseList
     */
    getEnterprise () {
      var that = this
      var queryData = {
        'parkId': that.userInfo.selectParkId,
        'pageNum': that.pageNum,
        'pageSize': 4
      }
      this.$http.post('/api/enterprise/enterpriseList', queryData).then(function (res) {
        that.loading = false
        that.pageNum += 1
        if (res.data.result.length > 0) {
          var enterTemp = res.data.result
          for (var i = 0; i < enterTemp.length; i++) {
            enterTemp[i].enterpriseLabel = enterTemp[i].enterpriseLabel.replace(/,/g, ' / ')
            that.enterpriseList.push(enterTemp[i])
          }
        } else {
          that.finished = true
        }
      }).catch(function (err) {
        Toast.fail(err.message)
      })
    },
    /*
     * 企业商家详情跳转
    */
    toEnterDetail (id) {
      this.$router.push({
        path: 'BusinessDetails',
        query: {
          id: id
        }
      })
    },
    /*
     * 跳转消息中心
    */
    toInfomation () {
      this.$router.push('/InfomationType')
    }
  }
}
</script>
<style lang="css" scoped>
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
.index {
  background: #f9f9f9;
}
.com-header {
  width: 100%;
  height: 1.166667rem;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 8;
  background: #19191a;
}
.i-header-login {
  width: 0.740741rem;
  height: 0.740741rem;
  line-height: 0.740741rem;
  color: #fff;
  font-size: 0.277778rem;
  float: right;
  margin-top: 0.222222rem;
  margin-right: 0.222222rem;
  border: 2px solid #ffcd00;
     -moz-border-radius: 50%;
       -o-border-radius: 50%;
  -webkit-border-radius: 50%;
          border-radius: 50%;
}
.i-head-portrait {
  width: 0.740741rem;
  height: 0.740741rem;
  line-height: 0.740741rem;
  color: #fff;
  font-size: 0.277778rem;
  float: right;
  margin-top: 0.222222rem;
  margin-right: 0.222222rem;
  border: 2px solid #ffcd00;
     -moz-border-radius: 50%;
       -o-border-radius: 50%;
  -webkit-border-radius: 50%;
          border-radius: 50%;
}
.i-head-portrait img {
  width: 0.640741rem;
  height: 0.640741rem;
     -moz-border-radius: 50%;
       -o-border-radius: 50%;
  -webkit-border-radius: 50%;
          border-radius: 50%;
}
.i-header-news {
  width: 0.740741rem;
  height: 0.740741rem;
  line-height: 0.740741rem;
  margin-top: 0.3rem;
  margin-right: 0.222222rem;
  float: right;
  color: #fdcc06;
  font-size: .555556rem;
}
.i-header-news-active .van-icon-chat::after{
  content: "";
  position: absolute;
  top: -2px;
  right: -3px;
  width: 8px;
  height: 8px;
  border: 1px solid #fff;
  border-radius: 100%;
  background-color: #f44;
}
.i-header-news img {
  width: 0.740741rem;
  height: 0.740741rem;
}
.i-park {
  display: inline-block;
  float: left;
}
.i-park:hover {
  cursor: pointer;
}
.i-h-icon {
  width: 1.166667rem;
  height: 1.166667rem;
  float: left;
}
.i-h-icon img{
  width: 0.555556rem;
  height: 0.648148rem;
  margin-top: 0.231481rem;
}
.i-h-address {
  font-size: 0.37037rem;
  height: 1.166667rem;
  line-height: 1.166667rem;
  color: #fff;
  float: left;
}
.i-h-select-icon {
  float: left;
}
.i-h-select-icon img {
  width: 0.277778rem;
  height: 0.148148rem;
  margin-top: 0.537037rem;
  margin-left: 0.185185rem;
}

.i-banner {
  width: 10rem;
  height: 5.185185rem;
  margin-top: 1.166667rem;
}
.i-banner .van-swipe{
  width: 100%;
  height: 5.185185rem;
}
.i-banner .van-swipe-item{
  width: 100%;
  height: 5.185185rem;
}
.i-banner img {
  width: 100%;
  height: 5.185185rem;
}

.i-login {
  width: 100%;
  height: 1rem;
  background: #fff;
  position: relative;
}
.i-login-text {
  position: absolute;
  left: 5.416667rem;
  top: 0.237778rem;
  font-size: 0.444444rem;
  color: #000;
}
.i-login-btn {
  width: 1.574074rem;
  height: 1.574074rem;
  line-height: 1.574074rem;
  font-size: 0.444444rem;
  color: #000;
  position: absolute;
  top: -0.787037rem;
  right: 1.111111rem;
  background: #ffcd00;
     -moz-border-radius: 50%;
       -o-border-radius: 50%;
  -webkit-border-radius: 50%;
          border-radius: 50%;
}

.i-service {
  width: 100%;
  background: #fff;
}

.i-service-img {
  width: 0.833333rem;
  height: 0.833333rem;
  margin-top: 0.740741rem;
}

.i-service-name {
  margin-top: 0.37037rem;
  font-size: 0.37037rem;
}
.i-service-more:last-child {
  margin-bottom: 0.833333rem;
}

.i-news {
  width: 100%;
  height: 1.888889rem;
  background: #fff;
  border-bottom: 0.5px solid #e9e9e9;
}

.i-news-box {
  width: 95%;
  height: 1.0rem;
  margin: 0 auto;
  border: 0.5px solid #e9e9e9;
  background: #f9f9f9;
     -moz-border-radius: 0.092593rem;
       -o-border-radius: 0.092593rem;
  -webkit-border-radius: 0.092593rem;
          border-radius: 0.092593rem;
}

.i-news-type {
  width: 1.711111rem;
  height: 0.611111rem;
  float: left;
  margin-left: 0.092593rem;
  margin-top: 0.185185rem;
  background: #ffcd00;
  position: relative;
     -moz-border-radius: 0.053333rem;
       -o-border-radius: 0.053333rem;
  -webkit-border-radius: 0.053333rem;
          border-radius: 0.053333rem;
}

.i-news-type img {
  width: 0.722222rem;
  height: 0.425926rem;
  position: absolute;
  top: 0.092593rem;
  left: 0.092593rem;
}

.i-news-type-name {
  width: 0.762222rem;
  height: 0.425926rem;
  line-height: 0.425926rem;
  font-size: 0.333333rem;
  position: absolute;
  top: 0.092593rem;
  right: 0.092593rem;
}

.i-news-info{
  width: 6.021481rem;
  height: 1.0rem;
  line-height: 1.0rem;
  float: left;
  text-align: left;
  margin-left: 0.185185rem;
  font-size: 0.333333rem;
  color: #303030;
  overflow: auto;
  white-space: nowrap;
}

.i-news-more {
  float: right;
  height: 1.0rem;
  line-height: 1.0rem;
  font-size: 0.296296rem;;
  color: #636363;
  margin-right: 0.092593rem;
}

.i-project {
  width: 100%;
  margin-top: 0.277778rem;
  background: #fff;
  padding: 0.555556rem 0;
  border-top: 0.5px solid #e9e9e9;
  border-bottom: 0.5px solid #e9e9e9;
}

.i-title {
  width: 100%;
  padding-left: 2%;
  padding-right: 2%;
  font-size: 0.462963rem;
  line-height: 1.2;
  text-align: left;
  font-weight: bold;
}
.i-title-more {
  float: right;
  font-size: 0.296296rem;;
  color: #636363;
  font-weight: normal;
  margin-right: 0.092593rem;
}

.i-project-box {
  margin-top: 0.462963rem;
}
.i-project-info {
  width: 95%;
  height: 4.074074rem;
  padding: 0.277778rem;
  margin: 0 auto;
  text-align: left;
    border: 0.5px solid #dcdcdc;
     -moz-border-radius: 0.092593rem;
       -o-border-radius: 0.092593rem;
  -webkit-border-radius: 0.092593rem;
          border-radius: 0.092593rem;
}

.i-project-info img {
  width: 3.481481rem;
  height: 3.481481rem;
  float: left;
     -moz-border-radius: 0.046296rem;
       -o-border-radius: 0.046296rem;
  -webkit-border-radius: 0.092593rem;
          border-radius: 0.092593rem;
}

.i-project-detail {
  width: 5.0rem;
  height: 3.481481rem;
  float: right;
}

.i-project-name{
  width: 100%;
  font-size: 0.425926rem;
  line-height: 1.2;
  color: #383838;
  overflow: auto;
  white-space: nowrap;
}

.i-project-item{
   display: flex;
   width: 100%;
   line-height: 1.2;
   margin-top: 0.185185rem;
   overflow: auto;
   white-space: nowrap;
}
.i-project-detail .i-project-item:last-child {
  display: block;
}
.item-property {
  font-size: 0.277778rem;
  float: left;
  color: #737373;
}
.item-property-value{
  font-size: 0.277778rem;
  float: left;
  color: #383838;
  flex: 1;
}

.item-address-value {
  height: 0.833333rem;
  overflow: auto;
  white-space: normal;
}

.item-link-detail,
.item-link-praise {
  width: 2.314815rem;
  height: 0.555556rem;
  font-size: 0.314815rem;
  position: relative;
     -moz-border-radius: 0.053333rem;
       -o-border-radius: 0.053333rem;
  -webkit-border-radius: 0.053333rem;
          border-radius: 0.053333rem;
}

.item-link-detail {
  float: left;
  background: #ececec;
}

.item-link-praise{
  float: right;
  background: #ffcd00;
}

.item-link-praise img,
.item-link-detail img {
   width: 0.314815rem;
   height: 0.333333rem;
   position: absolute;
   top: 0.111111rem;
   left: 0.462963rem;
}

.item-link-describe {
  height: 0.555556rem;
  line-height: 0.555556rem;
  display: inline-block;
  margin-left: 1.055556rem;
}

.i-popular {
  width: 100%;
  height: 6.018519rem;
}

.i-activity {
  width: 100%;
}

.i-apartment {
  width: 100%;
  background: #f9f9f9;
  border-top: 0.5px solid #e9e9e9;
  border-bottom: 0.5px solid #e9e9e9;
}
.i-apartment img {
  width: 95%;
  margin-top: 0.407407rem;
  margin-bottom: 0.407407rem;
}

.i-activity {
  width: 100%;
  margin-top: 0.277778rem;
  padding: 0.462963rem 0;
  background: #fff;
  border-top: 0.5px solid #e9e9e9;
  border-bottom: 0.5px solid #e9e9e9;
}
.i-activity-box {
  width: 95%;
  margin: 0 auto;
  background: #f4f4f4;
  margin-top: 0.462963rem;
}
.i-activity-info {
  height: 4.685185rem;
  padding: 0.462963rem 0.277778rem;
  text-align: left;
  border: 0.5px solid #dcdcdc;
}
.i-iactivity-img {
  width: 2.685185rem;
  height: 3.240741rem;
  float: left;
}
.i-iactivity-img img {
  width: 2.685185rem;
  height: 3.240741rem;
}
.i-activity-type {
  width: 100%;
  font-size: 0.259259rem;
  line-height: 1.2;
  margin-top: 0.277778rem;
  color: #303030;
  white-space: nowrap;
  overflow: auto;
}
.i-activity-detail {
  width: 5.640741rem;
  float: left;
  margin-left: 0.462963rem;
}
.i-activity-detail-top {
  width: 5.640741rem;
  height: 3.240741rem;
}
.i-activity-time {
  font-size: 0.296296rem;
  color: #636363;
}
.i-activity-cost {
  float: right;
}
.i-activity-cost-num {
  color: #ed0000;
}
.i-activity-name {
  width: 100%;
  height: 1.944444rem;
  font-size: 0.444444rem;
  margin-top: 0.185185rem;
  line-height: 1.6;
  color: #000;
}
.i-activity-status-box {
  margin-top: 0.277777rem;
}
.i-activity-status {
  padding: 0.037037rem 0.094074rem;
  text-align: center;
  font-size: 0.259259rem;
  color: #1a1a1a;
  background: #fecd05;
  margin-top: 0.187778rem;
     -moz-border-radius: 0.034074rem;
       -o-border-radius: 0.034074rem;
  -webkit-border-radius: 0.034074rem;
          border-radius: 0.034074rem;
}
.i-activity-end {
  color: #fff;
  background: #c1c1c1;
}
.i-activity-address {
  font-size: 0.259259rem;
  line-height: 1;
  color: #636363;
  margin-top: 0.377778rem;
}

.i-enterprise {
  width: 100%;
  margin-top: 0.277778rem;
  padding: 0.462963rem 0.277778rem;
  background: #fff;
  border-top: 0.5px solid #e9e9e9;
  border-bottom: 0.5px solid #e9e9e9;
}
.i-enterprise-box {
  width: 100%;
  background: #f4f4f4;
  margin-top: 0.462963rem;
  padding-bottom: 0.37037rem;
}
.i-enterprise-item {
  width: 4.166667rem;
  height: 6.481481rem;
  border: 0.5px solid #e9e9e9;
  margin-top: 0.462963rem;
  margin-left: 0.37037rem;
  background: #fff;
  float: left;
     -moz-border-radius: 0.046296rem;
       -o-border-radius: 0.046296rem;
  -webkit-border-radius: 0.046296rem;
          border-radius: 0.046296rem;
}
.i-enterprise-img {
  width: 2.685185rem;
  height: 2.685185rem;
  margin-top: 0.37037rem;
  border: none;
}
.i-enterprise-name {
  width: 70%;
  height: 1.018519rem;
  font-size: 0.333333rem;
  line-height: 1.5;
  text-align: center;
  margin: 0 auto;
  margin-top: 0.277778rem;
}
.i-enterprise-industry {
  width: 70%;
  font-size: 0.277778rem;
  color: #757575;
  margin: 0 auto;
  margin-top: 0.277778rem;
  overflow: auto;
  white-space: nowrap;
}
.i-enterprise-detaile {
  width: 2.592593rem;
  height: 0.592593rem;
  line-height: 0.592593rem;
  text-align: center;
  font-size: 0.333333rem;
  color: 000;
  margin: 0 auto;
  margin-top: 0.277778rem;
  background: #fecd05;
     -moz-border-radius: 0.074074rem;
       -o-border-radius: 0.074074rem;
  -webkit-border-radius: 0.074074rem;
          border-radius: 0.074074rem;
}
</style>
