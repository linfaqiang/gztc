<template>
  <div class="details-project-page">
    <!--头部-->
    <sub-header :title="title"></sub-header>
    <!--详情内容-->
    <div class="details-content">
      <div class="img-item">
        <van-swipe :autoplay="5000" @change="onChange">
          <van-swipe-item v-for="pic in recommend.pic" :key="pic.id">
            <img :src="pic.url" alt="" @click="onPreviewImageSwipe(recommend.pic, pic)">
          </van-swipe-item>
        </van-swipe>
        <div class="banner-num-item">{{picNum}}/<span>{{picLength}}</span></div>
      </div>
      <div class="content-item">
        <h3>广州羊城同创汇50㎡办公室</h3>
        <h5><span>50000</span> 元/月  (单价：200元/㎡·月)</h5>
        <h6>高速wifi、空调、投影仪、视频会议、茶水会议可加50个座位</h6>
        <dl class="address-list region-list">
          <dd>
            <span>
              使用性质: <b>商业</b>
            </span>
          </dd>
          <dd>
            <span>
              建筑面积: <b>50㎡</b>
            </span>
          </dd>
          <dd>
            <span>
              实用率：<b>98%</b>
            </span>
          </dd>
          <dd>
            <span>
              租期：<b>3年</b>
            </span>
            <span>
              管理费：<b>20元/㎡/月</b>
            </span>
          </dd>
          <dd>
            <span>
              免租期：<b>2个月</b>
            </span>
          </dd>
        </dl>
        <div class="contact-item">
          <a href="tel:020-123456789">平台服务热线：020-12345678</a>
        </div>
      </div>
    </div>
    <div class="footer-item-details">
      <dl>
        <dd><button type="button" @click="wechatisShare()">推荐</button></dd>
        <dd>
          <button class="copy" id="copyBtn" data-clipboard-action="copy" :data-clipboard-text="pageUrl" @click="copyPolicyNo()">复制URL</button>
        </dd>
        <dt><button type="button" @click="reservations(recommend.type)">预约看房</button></dt>
      </dl>
    </div>
    <div id="g_fen_xiang" v-show="$store.state.isShare" @click="hideShare()">
      <span>
        <img src="static/img/recomment/fen_xiang.png">
      </span>
      <div class="bg"></div>
    </div>
  </div>
</template>
<script>
import { Tab, Tabs, Toast, Swipe, SwipeItem } from 'vant'
import { getRecommend, requireShare } from '@/api/index'
import SubHeader from '@/components/common/SubHeader'
import wx from 'weixin-js-sdk'
import { mapGetters } from 'vuex'
export default {
  name: 'ApartmentDetails',
  components: {
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Toast.name]: Toast,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    SubHeader
  },
  data () {
    return {
      title: '户型详情',
      attractId: 0,
      attractType: 0,
      recommend: {},
      pageUrl: '',
      picNum: 1,
      picLength: 1
    }
  },
  created () {
    this.attractId = this.$route.query.id
    this.attractType = this.$route.query.type
    this.pageUrl = window.location.href
    this.showShare = this.getShare.isShare
    // 获取项目详情
    getRecommend({
      pid: this.getUserInfo.selectParkId,
      aid: 5,
      type: 0
    }).then((res) => {
      if (res.data.success) {
        this.recommend = res.data.result
        this.picLength = this.recommend.pic.length
        requireShare(
          this.recommend.name,
          this.recommend.introduce,
          '/ApartmentDetails?' + 'parkId=' + this.recommend.parkId + '&id=' + this.recommend.id + '&type=' + this.recommend.type + '&mid=' + this.getUserInfo.id,
          this.recommend.mobileCover
        )
      }
    }).catch((err) => {
      Toast.fail(err.message)
    })
  },
  computed: {
    ...mapGetters(['getUserInfo', 'getShare'])
  },
  methods: {
    /* 预约看房 */
    reservations (type) {
      switch (type) {
        case 0:
          this.$router.push({
            name: 'ApartmentService',
            query: {
              hid: this.recommend.id,
              name: this.recommend.name,
              phone: this.recommend.contactPhone,
              linkman: this.recommend.linkman,
              refId: this.getUserInfo.id
            }
          })
          break
        case 1:
          this.$router.push({
            name: 'ApartmentService',
            query: {
              hid: this.recommend.id,
              name: this.recommend.name,
              phone: this.recommend.contactPhone,
              linkman: this.recommend.linkman,
              refId: this.getUserInfo.id
            }
          })
          break
        case 2:
          this.$router.push({
            path: 'SpaceService',
            query: {
              hid: this.recommend.id,
              phone: this.recommend.contactPhone,
              linkman: this.recommend.linkman,
              refId: this.getUserInfo.id
            }
          })
          break
      }
    },
    copyPolicyNo () {
      this.$copyText(this.pageUrl).then(function (e) {
        Toast('复制成功')
      }, function (e) {
        console.log(e)
      })
    },
    onChange (index) {
      this.picNum = index + 1
    },
    wechatisShare () {
      this.$store.commit('setShare', true)
    },
    hideShare () {
      this.$store.commit('setShare', false)
    },
    onPreviewImage (pics, pic) {
      let imgs = []
      pics.forEach((item) => {
        imgs.push(item.imageUrl)
      })
      wx.ready(function () {
        wx.previewImage({
          current: pic.imageUrl, // 当前显示图片的http链接
          urls: imgs // 需要预览的图片http链接列表
        })
      })
    },
    onPreviewImageSwipe (pics, pic) {
      let imgs = []
      pics.forEach((item) => {
        imgs.push(item.url)
      })
      wx.ready(function () {
        wx.previewImage({
          current: pic.url, // 当前显示图片的http链接
          urls: imgs // 需要预览的图片http链接列表
        })
      })
    }
  }
}
</script>
<style scoped>
img {
  max-width: 100%;
}
.details-project-page .content-item{
  font-size: .333333rem;
  text-align: left;
  margin-bottom: .222222rem;
  padding: 0 .555556rem .462963rem .555556rem;
  background-color: #fff;
}
.details-project-page .content-item > h3{
  color: #3b3b3b;
  font-size: .444444rem;
  padding: .277778rem 0;
}
.details-project-page .content-item > h5{
   font-size: .37037rem;
  padding-bottom: .277778rem;
}
.details-project-page .content-item > h5 span{
  color: #ff0000;
}
.details-project-page .content-item > h6{
  color: #747474;
  font-size: .296296rem;
  padding-bottom: .240741rem;
}
.details-project-page .content-item > .region-list{
  background-color: #f5f5f5;
}
.details-project-page .content-item > .address-list dd{
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
  justify-content: space-between;
  -webkit-justify-content: space-between;
  padding: .240741rem .092593rem;
  border-bottom: .018519rem solid #fff;
}
.details-project-page .content-item > .address-list dd:last-child{
  border: 0;
}
.details-project-page .content-item > .address-list dd span{
  color: #686868;
  font-size: .333333rem;
}
.details-project-page .content-item > .address-list dd b{
  color: #1a1a1a;
  font-weight: normal;
}
.details-project-page .content-item > .address-list dd span:first-child::before{
  content: "";
  display: inline-block;
  vertical-align: middle;
  width: .092593rem;
  height: .092593rem;
  margin: 0 .277778rem;
  border-radius: 50%;
  background-color: #ccc;
}
.details-project-page .content-item > .address-list dd span:last-child{
  padding-right: .462963rem;
}
.details-project-page .content-item .contact-item{
  width: 100%;
  margin-top: .555556rem;
  border-radius: .037037rem;
  background-color: #3d3d3d;
}
.details-project-page .content-item .contact-item a{
  display: block;
  padding: .185185rem 0;
  color: #fff;
  text-align: center;
  font-size: .296296rem;
}
.details-project-page .details-content{
  padding-bottom: 1.240741rem;
}
.details-project-page .matching-item h3{
  font-size: .444444rem;
  text-align: left;
}
.details-project-page .matching-item p{
  font-size: .333333rem;
  text-align: left;
  line-height: .592593rem;
}
.details-project-page .matching-item img{
  max-width: 100%;
}
.details-project-page .footer-item-details{
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1.240741rem;
  border-top: 1px solid #dbdbdb;
  background-color: #fff;
  z-index: 999;
}
.details-project-page .footer-item-details dl{
  height: 100%;
  padding: 0 .333333rem;
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
  align-items: center;
  -webkit-box-align: center;
  -webkit-align-items: center;
  justify-content: space-around;
  -webkit-justify-content: space-around;
}
.details-project-page .footer-item-details dl dd button{
  border: 0;
  outline: none;
  width: 1.62037rem;
  height: .703704rem;
  border-radius: 4px;
  border: .018519rem solid #fecd05;
  background-color: #fff;
}
.details-project-page .footer-item-details dl dt button{
  border: 0;
  outline: none;
  width: 4.861111rem;
  height: .703704rem;
  border-radius: 4px;
  background-color: #fecd05;
}
.details-project-page .copy-item{
  border: 0;
  outline: none;
  width: 0;
  height: 0;
  opacity: 0;
}
.details-project-page .details-content .img-item{
  position: relative;
  width: 10rem;
}
.img-item .banner-num-item{
  position: absolute;
  right: .787037rem;
  bottom: .481481rem;
  color: #fff;
  font-size: .5rem;
}
.img-item .banner-num-item > span{
  font-size: .407407rem;
}
.introduce-text{
  padding: 0 .138889rem;
  line-height: .592593rem;
  text-align: left;
}
.van-swipe{
  width: 100%;
}
.van-swipe .van-swipe-item{
  width: 100%;
}
.van-swipe .van-swipe-item img{
  width: 100%;
}
#g_fen_xiang {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 100;
  top: 0;
  left: 0;
  cursor: pointer;
  z-index: 1000;
}
#g_fen_xiang span {
  position: absolute;
  z-index: 5;
  width: 16em;
  float: right;
  top: 0;
  right: 0;
}
#g_fen_xiang span img {
  width: 100%;
}
#g_fen_xiang .bg {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.8);
}
</style>
