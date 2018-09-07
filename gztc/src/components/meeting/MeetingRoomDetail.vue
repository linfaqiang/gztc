<template>
  <div class="meeting-room-detail">
    <!--头部-->
    <sub-header title="会议室详情"></sub-header>

    <!-- banner -->
    <div class="mrd-banner">
      <van-swipe :autoplay="3000">
        <van-swipe-item v-for="(item, index) in meetingRoom.picResult" :key="index">
          <div class="mrd-banner-link">
            <img :src="item.url">
            <div class="banner-index">
              <span class="current-index">{{ index + 1 }}/</span>
              <span class="count-index">{{ meetingRoom.picResult.length }}</span>
            </div>
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>
    <!-- banner -->

    <!-- 详情 -->
    <div class="mrd-detail">
      <div class="mrd-name">
        {{meetingRoom.name}}
      </div>
      <div class="mrd-detail-item clearfix">
        <div class="mrd-detail-item-h">
          <span class="mr-item-property">楼层：</span>
          {{meetingRoom.floor}}
        </div>
        <div class="mrd-detail-item-h">
          <span class="mr-item-property">容纳人数：</span>
          {{meetingRoom.capacity}}
        </div>
      </div>
      <div class="mrd-detail-item clearfix">
        <div class="mrd-detail-item-h">
          <span class="mr-item-property">收费类型：</span>
          <span v-if="meetingRoom.cost > 0">收费</span>
          <span v-if="meetingRoom.cost === 0">免费</span>
        </div>
        <div class="mrd-detail-item-h">
          <span class="mrl-price-num">{{meetingRoom.cost}}</span>元/小时
        </div>
      </div>
      <div class="mrd-detail-item">
        <span class="mr-item-property">开放时间：</span>
        {{meetingRoom.selectedStartTime}} 至 {{meetingRoom.selectedEndTime}}
      </div>
      <div class="mrd-detail-item">
        <span class="mr-item-property">配套：</span>
      </div>
      <div class="mrd-detail-item mrd-project-describe">
        {{meetingRoom.groupedEquipment}}
      </div>
      <div class="mrd-detail-item">
        <span class="mr-item-property">提示：</span>
        {{meetingRoom.remind}}
      </div>
    </div>
    <!-- 详情 -->
    <!-- 预约按钮 -->
    <div class="select-park-btn">
      <div class="select-park-btn-sure" @click="toMeetingRoomAppointment">预&nbsp;&nbsp;约</div>
    </div>
    <!-- 预约按钮 -->
  </div>
</template>
<script>
import SubHeader from '@/components/common/SubHeader'
import { Swipe, SwipeItem } from 'vant'
export default {
  name: 'MeetingRoomDetail',
  components: {
    SubHeader,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem
  },
  data () {
    return {
      meetingRoom: {},
      id: ''
    }
  },
  created () {
    this.id = this.$route.query.id
    this.getMeetingRongList()
  },
  methods: {
    // 预约
    toMeetingRoomAppointment () {
      this.$router.push({
        name: 'MeetingRoomAppointment',
        query: {
          id: this.id
        }
      })
    },
    /**
     * 会议室列表查询 POST /api/place/placeInfo
     */
    getMeetingRongList () {
      var that = this
      var queryData = {
        id: that.id
      }
      this.$http.post('/api/place/placeInfo', queryData).then(function (res) {
        that.meetingRoom = res.data.result
      })
    }
  }
}
</script>
<style>
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
.mrd-banner {
  width: 100%;
  height: 7.574074rem;
}
.mrd-banner-link {
  width: 100%;
  height: 7.574074rem;
  display: block;
  position: relative;
}
.mrd-banner-link img {
  width: 100%;
  height: 7.574074rem;
}
.banner-index {
  position: absolute;
  z-index: 888;
  cursor: red;
  bottom: 0.462963rem;
  right: 0.648148rem;
}
.current-index {
  color: #fff;
  font-size: 0.462963rem;
}
.count-index {
  color: #fff;
  font-size: 0.333333rem;
}

.mrd-detail {
  width: 100%;
  text-align: left;
  background: #fff;
  padding: 0.37037rem 0.555556rem 0.37037rem 0.555556rem;
  margin-bottom: 2.074074rem;
  border-bottom: 1px solid #dedede;
}
.mrd-detail-item-h {
  width: 50%;
  float: left;
}
.mr-item-property {
  color: #686868;
}
.mrd-name{
  width: 100%;
  font-size: 0.425926rem;
  line-height: 1.2;
  color: #383838;
  overflow: auto;
  margin-bottom: 0.185185rem;
  white-space: nowrap;
}
.mrl-price-num {
  color: #ed0000;
}
.mrd-detail-item {
  margin-top: 0.37037rem;
}
.mrd-project-describe {
  padding: 0.222222rem;
  border: 1px solid #9c9c9c;
}

.select-park-btn {
  position: fixed;
  width: 100%;
  height: 1.666667rem;
  bottom: 0;
  left: 0;
  background: #fff;
  border-top: 1px solid #dedede;
}
.select-park-btn-sure {
  width: 80%;
  height: 0.925926rem;
  line-height: 0.925926rem;
  margin: 0 auto;
  background: #fdcc07;
  font-size: 0.37037rem;
  color: #000;
  margin-top: 0.333333rem;
     -moz-border-radius: 0.074074rem;
       -o-border-radius: 0.074074rem;
  -webkit-border-radius: 0.074074rem;
          border-radius: 0.074074rem;
}
</style>
