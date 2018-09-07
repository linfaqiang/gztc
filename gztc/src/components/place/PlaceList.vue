<template>
  <div class="meeting-room-list">
    <!--头部-->
    <sub-header title="场地列表"></sub-header>

    <!-- 会议室列表查询 -->
    <div class="mrl-search">
      <div class="mrl-search-item" @click="showCostType">
        <label class="mrl-search-lable">收费类型:</label>
        <input type="hidden" name="" readonly="true"/>
        <span class="mrl-search-text">{{costText}}</span>
        <span class="mrl-search-icon">
          <img src="../../assets/m_room_select.png">
        </span>
      </div>
      <div class="mrl-search-item" @click="showCapacity">
        <label class="mrl-search-lable">容纳人数:</label>
        <input type="hidden" name="" readonly="true"/>
        <span class="mrl-search-text">{{capacityText}}</span>
        <span class="mrl-search-icon">
          <img src="../../assets/m_room_select.png">
        </span>
      </div>
    </div>
    <!-- 会议室列表查询 -->

    <!-- 会议室列表 -->
    <van-list class="mrl-list-box" v-model="loading" :finished="finished" @load="onLoad">
      <div class="mrl-item clearfix" v-for="(item) in meetingRoomList" :key="item.id" @click="toPlaceDetail(item.id)">
        <span class="mrl-item-state-enable" v-if="item.placeStatus === 1">可预约</span>
        <span class="mrl-item-state-disable"  v-if="item.placeStatus === 0">今天已满</span>
        <div class="mrl-item-img">
          <img :src="item.mobileCover">
        </div>
        <div class="mrl-item-detail">
          <div class="mrl-item-name">
            {{ item.name }}
          </div>
          <div class="mrl-item-name clearfix">
            <span class="item-property">楼&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;层：</span>
            <p class="item-property-value">
              <span v-if="item.cost === 0">免费</span>
              <span  v-if="item.cost > 0">收费</span>
              <span class="mrl-price"><span class="mrl-price-num">{{ item.cost }}</span>元/小时</span>
            </p>
          </div>
          <div class="mrl-item-name clearfix">
            <span class="item-property">收费类型：</span>
            <span class="item-property-value">{{ item.cost }}</span>
          </div>
          <div class="mrl-item-name clearfix">
            <span class="item-property">容纳人数：</span>
            <span class="item-property-value">{{ item.capacity }}</span>
          </div>
          <div class="mrl-item-name clearfix">
            <span class="item-property">配&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;套：</span>
            <div class="item-property-value matching-value">{{ item.groupedEquipment }}</div>
          </div>
        </div>
      </div>
    </van-list>
     <van-popup position="bottom" v-model="costTypeShow">
      <van-picker  show-toolbar title="收费类型" :columns="costType" @cancel="onCancel" @confirm="selectCostType"/>
    </van-popup>
    <van-popup position="bottom" v-model="capacityShow">
      <van-picker  show-toolbar title="容纳人数" :columns="newCapacityList" @cancel="onCancel" @confirm="selectCapacity"/>
    </van-popup>
    <!-- 会议室列表 -->
  </div>
</template>
<script>
import SubHeader from '@/components/common/SubHeader'
import { List, Picker, Popup, Toast } from 'vant'
export default {
  name: 'MeetingRoomList',
  components: {
    SubHeader,
    [List.name]: List,
    [Toast.name]: Toast,
    [Picker.name]: Picker,
    [Popup.name]: Popup
  },
  data () {
    return {
      userInfo: {},
      loading: false,
      finished: false,
      pageSize: 4,
      pageNum: 1,
      pagerInfo: {
        pageSize: 4,
        pageNum: 1
      },
      cost: -1,
      capacity: '',
      costTypeShow: false,
      capacityShow: false,
      costText: '全部',
      capacityText: '全部',
      costType: ['全部', '收费', '免费'],
      capacityList: [],
      newCapacityList: ['全部'],
      meetingRoomList: []
    }
  },
  created () {
    this.userInfo = this.$store.getters.getUserInfo
    this.getCapacityList()
  },
  methods: {
    selectCostType (value, index) {
      this.costTypeShow = false
      this.costText = value
      this.pagerInfo.pageNum = 1
      this.meetingRoomList = []
      if (index === 0) {
        this.cost = -1
      } else if (index === 1) {
        this.cost = 1
      } else {
        this.cost = 0
      }
      this.onLoad()
    },
    selectCapacity (value, index) {
      this.capacityShow = false
      this.pagerInfo.pageNum = 1
      this.meetingRoomList = []
      this.capacityText = value
      if (index === 0) {
        this.capacity = ''
      } else {
        this.capacity = this.capacityList[index - 1]
      }
      this.onLoad()
    },
    showCapacity () {
      this.capacityShow = true
    },
    showCostType () {
      this.costTypeShow = true
    },
    onCancel () {
      this.costTypeShow = false
      this.capacityShow = false
    },
    /**
     * 会议室列表查询 POST /api/place/placeList
     */
    onLoad () {
      var that = this
      var queryData = {
        pageSize: that.pagerInfo.pageSize,
        pageNum: that.pagerInfo.pageNum,
        parkId: that.userInfo.selectParkId
      }
      if (this.cost >= 0) {
        queryData.cost = this.cost
      }
      if (this.capacity !== '') {
        queryData.capacity = this.capacity
      }
      this.$http.post('/api/place/placeList', queryData).then(function (res) {
        that.loading = false
        if (res.data.result.length > 0) {
          that.pagerInfo.pageNum += 1
          that.meetingRoomList = that.meetingRoomList.concat(res.data.result)
        } else {
          that.finished = true
        }
      }).catch(function (err) {
        Toast.fail(err.message)
      })
    },
    // 获取容纳人数 GET /api/place/capacityList
    getCapacityList () {
      var that = this
      this.$http.get('/api/place/capacityList').then(function (res) {
        that.capacityList = res.data.result
        var capacity = res.data.result
        for (var index = 0; index < capacity.length; index++) {
          that.newCapacityList[index + 1] = capacity[index].replace(/~/g, '至')
        }
      })
    },
    // 跳转详情页
    toPlaceDetail (id) {
      this.$router.push({
        name: 'PlaceDetail',
        query: {
          id: id
        }
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
.mrl-search {
  width: 100%;
  height: 1.074074rem;
  background: #fff;
}
.mrl-search-item {
  width: 50%;
  float: left;
  font-size: 0.314815rem;
  height: 1.074074rem;
  line-height: 1.074074rem;
}
.mrl-search-icon {
  display: inline-block;
}
.mrl-search-icon img {
  width: 0.277778rem;
  height: 0.185185rem;
}
.mrl-item {
  width: 100%;
  border-bottom: 1px solid #ccc;
  padding-top: 0.462963rem;
  padding-bottom: 0.362963rem;
  position: relative;
}
.mrl-item-img {
  width: 2.157407rem;
  height: 2.157407rem;
  float: left;
}
.mrl-item-img img {
  width: 2.157407rem;
  height: 2.157407rem;
}
.mrl-item-detail {
  width: 6.018519rem;
  float: left;
  position: relative;
  text-align: left;
  margin-left: 0.555556rem;
}
.mrl-price {
  float: right;
}
.mrl-price-num {
  color: #ed0000;
}
.mrl-item-name {
  width: 100%;
  font-size: 0.425926rem;
  line-height: 1.2;
  color: #383838;
  overflow: auto;
  margin-bottom: 0.185185rem;
  white-space: nowrap;
}
.item-property {
  width: 1.666667rem;
  font-size: 0.277778rem;
  float: left;
  color: #737373;
}
.item-property-value{
  width: 4.32963rem;
  font-size: 0.277778rem;
  text-align: left;
  float: left;
  color: #383838;
  overflow: auto;
}
.matching-value {
  display: inline-block;
  width: 4.32963rem;
  max-height: 0.925926rem;
  line-height: 1.5;
  white-space: normal;
}

.mrl-list-box {
  padding: 0 0.601852rem;
  margin-top: 0.314815rem;
  background: #fff;
}
.mrl-item-state-enable {
  color: #000;
  display: inline-block;
  font-size: 0.259259rem;
  line-height: 1.3;
  padding: 0 0.148148rem;
  position: absolute;
  top: 0.555556rem;
  left: -0.102963rem;
     -moz-border-radius: 0.044074rem;
       -o-border-radius: 0.044074rem;
  -webkit-border-radius: 0.044074rem;
          border-radius: 0.044074rem;
  background: #fecd05;
  z-index: 3
}
.mrl-item-state-disable {
  color: #fff;
  display: inline-block;
  font-size: 0.259259rem;
  line-height: 1.3;
  padding: 0 0.148148rem;
  background: #979797;
  position: absolute;
  top: 0.555556rem;
  left: -0.102963rem;
     -moz-border-radius: 0.044074rem;
       -o-border-radius: 0.044074rem;
  -webkit-border-radius: 0.044074rem;
          border-radius: 0.044074rem;
  z-index: 3
}
</style>
