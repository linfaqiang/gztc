<template>
  <div class="details-project-page">
    <!--头部-->
    <sub-header title="项目详情"></sub-header>
    <!--详情内容-->
    <div class="details-content">
      <div class="img-item">
        <van-swipe :autoplay="6000">
          <van-swipe-item><img :src="recommend.mobileCover" alt=""></van-swipe-item>
        </van-swipe>
      </div>
      <div class="content-item">
        <h3>{{recommend.name}}</h3>
        <dl class="address-list">
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
          <dd>
            <span>
              地址：<b>{{recommend.address}}</b>
            </span>
          </dd>
          <dd>
            <span>
              容积率：<b>{{recommend.plotRatio}}%</b>
            </span>
            <span>
              绿化率：<b>{{recommend.greenRatio}}%</b>
            </span>
          </dd>
          <dt>
            <p class="remarks">项目描述：</p>
            <p class="remarks-text" v-html="recommend.introduce"></p>
          </dt>
        </dl>
      </div>
      <div class="details-tab">
        <div class="tab-list">
          <div class="tab-content">
            <strong class="house-title">户型</strong>
            <van-tabs>
              <van-tab v-for="houseType in houseTypeList" :title="houseType.name" :key="houseType.id">
                <img :src="houseType.imageUrl" alt="">
              </van-tab>
            </van-tabs>
          </div>
        </div>
        <div class="matching-item" v-html="recommend.matching">
          <br/>
          <h3>配套</h3>
          <br/>
        </div>
      </div>
    </div>
    <div class="footer-item">
      <dl>
        <dd><button type="button">推荐</button></dd>
        <dd><button type="button">复制URL</button></dd>
        <dt><button type="button" @click="reservations()">预约看房</button></dt>
      </dl>
    </div>
  </div>
</template>
<script>
import { Swipe, SwipeItem, Tab, Tabs, Toast } from 'vant'
import { getRecommend, getHouseType } from '@/api/index'
import SubHeader from '@/components/common/SubHeader'
import { mapGetters } from 'vuex'
export default {
  name: 'SpaceDetails',
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Toast.name]: Toast,
    SubHeader
  },
  data () {
    return {
      gardenId: 0,
      recommend: {},
      houseTypeList: []
    }
  },
  created () {
    getRecommend({pid: this.getUserInfo.selectParkId, aid: 5, type: 0}).then((res) => {
      console.log(res)
      this.recommend = res.data.result
    }).catch((err) => {
      console.log(err.message)
    })
    getHouseType({pid: this.getParkId, aid: 5}).then((res) => {
      this.houseTypeList = res.data.result
    }).catch((err) => {
      console.log(err.message)
    })
  },
  computed: {
    ...mapGetters(['getUserInfo'])
  },
  methods: {
    /* 预约看房 */
    reservations () {
      this.$router.push({
        name: 'SpaceService',
        query: {
          id: this.recommend.id,
          name: this.recommend.name
        }
      })
    }
  }
}
</script>
<style>
img {
  max-width: 100%;
}
.content-item{
  font-size: .333333rem;
  text-align: left;
  margin-bottom: .222222rem;
  padding: 0 .555556rem .462963rem .555556rem;
  background-color: #fff;
}
.content-item > h3{
  color: #3b3b3b;
  font-size: .444444rem;
  padding: .277778rem 0;
}
.content-item > .address-list dd{
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
  padding: .138889rem 0;
}

.content-item > .address-list dd span{
  flex: 1;
  -webkit-flex: 1;
  -webkit-box-flex: 1;
  color: #686868;
  font-size: .333333rem;
}
.content-item > .address-list dd b{
  color: #1a1a1a;
  font-weight: normal;
}
.content-item .address-list dt .remarks{
  padding: .138889rem 0 .277778rem 0;
}
.content-item .address-list dt .remarks-text{
  line-height: .555556rem;
  padding: .138889rem .231481rem;
  border: 1px solid #989898;
  background-color: #f4f4f4;
}
.details-content{
  padding-bottom: 1.240741rem;
}
.details-tab{
  padding: 0 .277778rem;
  padding-top: .425926rem;
  background-color: #fff;
}
.tab-list{
  padding-bottom: .092593rem;
}
.details-tab .tab-content{
  position: relative;
}
.details-tab .house-title{
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
.van-tabs--line{
  padding-top: .722222rem;
}
.van-tabs--line .van-tabs__wrap{
  width: 60%;
  height: .740741rem;
  border: 1px solid #989898;
  border-bottom: 0;
}
.van-tabs__wrap--scrollable .van-tab{
  flex: 0 0 33.33333333333333333333%;
  border-right: 1px solid #989898;
  border-bottom: 1px solid #989898;
  background-color: #f4f4f4;
}
.van-tabs__wrap{
  left: auto;
  right: 0;
  top: -1px;
}
.van-tabs__content{
  padding: .185185rem;
  border: 1px solid #989898;
  border-top: 0;
  overflow: hidden;
}
.van-tabs--line .van-tabs__wrap .van-tab--active{
  border: 0;
  color: #171717;
  background-color: #fff;
}
.van-tabs--line .van-tabs__wrap .van-tabs__line{
  bottom: -2px;
  background-color: #fff;
}
.van-tabs__nav--line{
  padding: 0;
}
.van-tab{
  padding: 0 .138889rem;
  line-height: .740741rem;
}
.matching-item h3{
  font-size: .444444rem;
  text-align: left;
}
.matching-item p{
  font-size: .333333rem;
  text-align: left;
  line-height: .592593rem;
}
.footer-item{
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1.240741rem;
  border-top: 1px solid #dbdbdb;
  background-color: #fff;
  z-index: 999;
}
.footer-item dl{
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
.footer-item dl dd button{
  border: 0;
  outline: none;
  width: 1.62037rem;
  height: .703704rem;
  border-radius: 4px;
  border: .018519rem solid #fecd05;
  background-color: #fff;
}
.footer-item dl dt button{
  border: 0;
  outline: none;
  width: 4.861111rem;
  height: .703704rem;
  border-radius: 4px;
  background-color: #fecd05;
}
</style>
