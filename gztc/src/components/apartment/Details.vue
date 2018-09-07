<template>
  <div class="details-project-page">
    <!--头部-->
    <sub-header title="项目详情"></sub-header>
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
        <h3>{{recommend.name}}</h3>
        <h5><span>100-200</span> 元/㎡·月</h5>
        <dl class="address-list region-list">
          <dd>
            <span>
              类型：
              <b v-if="recommend.type === 0">项目</b>
              <b v-if="recommend.type === 1">公寓</b>
              <b v-if="recommend.type === 2">众创空间</b>
            </span>
            <span>
              所属区域：<b>广州</b>
            </span>
          </dd>
          <dd v-if="recommend.type !== 2">
            <span>
              建筑类型：<b>{{recommend.buildingType}}</b>
            </span>
            <span>
              容积率：<b>{{recommend.plotRatio}}</b>
            </span>
          </dd>
        </dl>
        <dl class="address-list">
          <dd>
            <span>
              地址：<b>{{recommend.address}}</b>
            </span>
          </dd>
          <dd v-if="recommend.type === 2">
            <span>
              入驻楼盘名称：<b>{{getUserInfo.selectParkName}}</b>
            </span>
          </dd>
          <dd v-if="recommend.type === 2">
            <span v-if="recommend.payType !== ''">
              付款方式：<b>{{recommend.payType}}</b>
            </span>
            <span v-if="recommend.propertyFee !== ''">
              物业费：<b>{{recommend.propertyFee}}</b>
            </span>
          </dd>
          <dt v-if="recommend.introduce !== ''">
            <p class="remarks">项目描述：</p>
            <p class="remarks-text" v-html="recommend.introduce"></p>
          </dt>
        </dl>
        <div class="contact-item">
          <a href="tel:020-123456789">服务热线： 020-123456789</a>
        </div>
      </div>
      <!--户型列表-->
      <div class="housetype-list">
        <div class="housetype-title">
          <span>&nbsp;&nbsp;招商户型</span>
          <a href="javascript:;">更多&nbsp;&nbsp;></a>
        </div>
        <ul>
          <li>
            <a href="javascript:;">
              <div class="list-content">
                <div class="pic-item">
                  <img src="static/img/recomment/project.jpg" alt="">
                </div>
                <div class="describe-item">
                  <h4>
                    <span>羊城同创汇一楼临街店铺50㎡火热招租中，免一个月 <b></b></span>
                  </h4>
                  <p>
                    <strong>3100</strong> 元/月
                    <span>50 ㎡</span>
                  </p>
                </div>
              </div>
              <div class="list-button">
                <button type="button">推&nbsp;&nbsp;荐</button>
                <button type="button">了解详情</button>
              </div>
            </a>
          </li>
        </ul>
      </div>
      <div class="details-tab">
        <div class="tab-list" v-if="recommend.type !== 2 && houseTypeList.length > 0">
          <div class="tab-content">
            <strong class="house-title">户型</strong>
            <van-tabs>
              <van-tab v-for="houseType in houseTypeList" :title="houseType.name" :key="houseType.id">
                <img :src="houseType.imageUrl" alt="" @click="onPreviewImage(houseTypeList, houseType)">
                <div class="introduce-text" v-html="houseType.introduce"></div>
              </van-tab>
            </van-tabs>
          </div>
        </div>
        <div class="matching-item" v-if="recommend.traffic !== ''">
          <div v-html="recommend.traffic"></div>
          <br>
        </div>
        <div class="matching-item" v-if="recommend.matching !== ''">
          <div v-html="recommend.matching"></div>
          <br>
        </div>
        <div class="matching-item" v-if="recommend.remark !==''">
          <div v-html="recommend.remark"></div>
          <br>
        </div>
      </div>
    </div>
    <div class="footer-item-details">
      <dl>
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
import { getRecommend, getHouseType, requireShare } from '@/api/index'
import SubHeader from '@/components/common/SubHeader'
import wx from 'weixin-js-sdk'
import { mapGetters } from 'vuex'
// import copy from 'copy-to-clipboard'
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
      attractId: 0,
      attractType: 0,
      recommend: {},
      houseTypeList: [],
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
      aid: this.attractId,
      type: this.attractType
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
    // 获取户型
    getHouseType({aid: this.attractId}).then((res) => {
      if (res.data.success) {
        this.houseTypeList = res.data.result
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
<style>
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
  padding-bottom: .277778rem;
}
.details-project-page .content-item > h5 span{
  color: #f6372c;
}
.details-project-page .content-item > .region-list{
  padding: .138889rem 0;
  border-top: 1px solid #c2c6c8;
  border-bottom: 1px solid #c2c6c8;
}
.details-project-page .content-item > .address-list dd{
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
  padding: .138889rem 0;
}
.details-project-page .content-item > .address-list dd span{
  flex: 1;
  -webkit-flex: 1;
  -webkit-box-flex: 1;
  color: #686868;
  font-size: .333333rem;
}
.details-project-page .content-item > .address-list dd b{
  color: #1a1a1a;
  font-weight: normal;
}
.details-project-page .content-item .address-list dt .remarks{
  padding: .138889rem 0 .138889rem 0;
}
.details-project-page .content-item .address-list dt .remarks-text{
  line-height: .555556rem;
}
.details-project-page .content-item .contact-item{
  width: 100%;
  margin-top: .240741rem;
  border-radius: .037037rem;
  border: 1px solid #a6a6a6;
  background-color: #f7f7f7;
}
.details-project-page .content-item .contact-item a{
  display: block;
  padding: .185185rem 0;
  color: #2b2b2b;
  text-align: center;
  font-size: .296296rem;
}
.details-project-page .details-content{
  padding-bottom: 1.240741rem;
}
.details-project-page .details-tab{
  padding: 0 .277778rem;
  padding-top: .425926rem;
  background-color: #fff;
}
.tab-list{
  padding-bottom: .092593rem;
}
.details-project-page .details-tab .tab-content{
  position: relative;
}
.details-project-page .details-tab .house-title{
  position: absolute;
  left: 0;
  top: -2px;
  width: 40%;
  height: .759259rem;
  line-height: .555556rem;
  font-size: .444444rem;
  font-weight: normal;
  text-align: left;
  text-indent: .185185rem;
  border-bottom: 1px solid #989898;
}
.details-project-page .van-tabs--line{
  padding-top: .722222rem;
}
.details-project-page .van-tabs--line .van-tabs__wrap{
  width: 60%;
  height: .740741rem;
  border: 1px solid #989898;
  border-bottom: 0;
}
.details-project-page .van-tabs__wrap--scrollable .van-tab{
  flex: 0 0 33.33333333333333333333%;
  border-right: 1px solid #989898;
  border-bottom: 1px solid #989898;
  background-color: #f4f4f4;
}
.details-project-page .van-tabs__wrap{
  left: auto;
  right: 0;
  top: -1px;
}
.details-project-page .van-tabs__content{
  padding: .185185rem;
  border: 1px solid #989898;
  border-top: 0;
  overflow: hidden;
}
.details-project-page .van-tabs--line .van-tabs__wrap .van-tab--active{
  border-bottom: 0;
  color: #171717;
  background-color: #fff;
}
.details-project-page .van-tabs--line .van-tabs__wrap .van-tabs__line{
  bottom: -2px;
  background-color: #fff;
}
.details-project-page .van-tabs__nav--line{
  padding: 0;
}
.details-project-page .van-tab{
  padding: 0 .138889rem;
  line-height: .740741rem;
  border-right: 1px solid #9c9c9c;
  border-bottom: 1px solid #9c9c9c;
  background-color: #f4f4f4;
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
.housetype-title{
  position: relative;
  text-align: left;
  padding: 0 .148148rem;
}
.housetype-title span {
  position: absolute;
  left: 0.148148rem;
  top: 0;
  width: 2.222222rem;
  height: .740741rem;
  font-size: .444444rem;
  background-color: #fff;
}
.housetype-title span:before{
  content: "";
  display: inline-block;
  vertical-align: middle;
  width: .092593rem;
  height: .092593rem;
  border-radius: 50%;
  background-color: #ffcd00;
}
.housetype-title a{
  display: block;
  padding: .138889rem 0;
  color: #8c8c8c;
  font-size: .277778rem;
  text-align: right;
  border-bottom: .018519rem solid #ccc;
}
.housetype-list{
  padding: .277778rem .277778rem 0 .277778rem;
  margin-bottom: .222222rem;
  background-color: #fff;
}
.housetype-list ul{
  padding: 0 .148148rem;
}
.housetype-list ul li{
  position: relative;
  border-bottom: 1px solid #ccc;
}
.housetype-list ul li:last-child{
  border: 0;
}
.housetype-list ul li a{
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
  justify-content: space-between;
  -webkit-justify-content: space-between;
  padding: .555556rem 0;
  color: #0d0d0d;
}
.housetype-list li .list-content{
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
}
.housetype-list li .pic-item img{
  display: block;
  max-width: 100%;
  width: 1.722222rem;
  height: 1.509259rem;
}
.housetype-list li .describe-item{
  position: relative;
  padding-left: .333333rem;
  text-align: left;
}
.housetype-list li .describe-item h4{
  position: relative;
  font-size: .333333rem;
}
.housetype-list li .describe-item h4 span{
  display: inline-block;
  vertical-align: middle;
  max-width: 4.814815rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.housetype-list li .describe-item h4 b{
  display: inline-block;
  vertical-align: middle;
  width: .740741rem;
  height: .287037rem;
  background-image: url(../../../static/img/recomment/laud.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: .314815rem .287037rem;
}
.housetype-list li .describe-item p{
  position: absolute;
  left: .333333rem;
  bottom: 0;
}
.housetype-list li .describe-item p strong{
  color: #f6372c;
  font-weight: normal;
}
.housetype-list li .list-button{
  position: absolute;
  right: 0;
  top: .555556rem;
}
.housetype-list li .list-button button{
  display: block;
  width: 1.944444rem;
  height: .62963rem;
  margin-bottom: .231481rem;
  border-radius: .037037rem;
  border: 1px solid #ffcd00;
  color: #1d1d1d;
  font-size: .296296rem;
  background-color: #ffcd00;
}
.housetype-list li .list-button button:first-child{
  background-color: #fff;
}
</style>
