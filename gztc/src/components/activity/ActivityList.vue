<template>
  <div class="new-list-page">
    <!--头部-->
    <sub-header title="活动列表"></sub-header>

    <!-- 列表查询 -->
    <div class="mrl-search">
      <div class="mrl-search-item" @click="showTimePick">
        <label class="mrl-search-lable">时间:</label>
        <input type="hidden" name="" readonly="true"/>
        <span class="mrl-search-text">{{timeSearchText}}</span>
        <span class="mrl-search-icon">
          <img src="../../assets/m_room_select.png">
        </span>
      </div>
      <div class="mrl-search-item" @click="showStatePick">
        <label class="mrl-search-lable">进行状态:</label>
        <input type="hidden" name="" readonly="true"/>
        <span class="mrl-search-text">{{stateSearchText}}</span>
        <span class="mrl-search-icon">
          <img src="../../assets/m_room_select.png">
        </span>
      </div>
    </div>
    <!-- 列表查询 -->

    <!-- 列表信息 -->
    <div class="activity-list">
      <van-list v-model="loading" :finished="finished" @load="onLoad">
        <div class="i-activity-box" v-for="(item, index) in activityList" :key="index">
          <div class="i-activity-info clearfix" @click="toActiveList(item.id)">
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
      </van-list>
    </div>
    <!-- 列表信息 -->
    <van-popup position="bottom" v-model="timePicker">
      <van-picker  show-toolbar title="时间" :columns="activityTime" @cancel="onCancel" @confirm="selectTime"/>
    </van-popup>
    <van-popup position="bottom" v-model="statePicker">
      <van-picker  show-toolbar title="进行状态" :columns="activityStatus" @cancel="onCancel" @confirm="selectState"/>
    </van-popup>
  </div>
</template>
<script>
import { List, Toast, Picker, Popup } from 'vant'
import SubHeader from '@/components/common/SubHeader'
export default {
  components: {
    [List.name]: List,
    [Toast.name]: Toast,
    [Picker.name]: Picker,
    [Popup.name]: Popup,
    SubHeader
  },
  data () {
    return {
      activityList: [],
      userInfo: {},
      loading: false,
      finished: false,
      pageNum: 1,
      stateSearch: -1,
      stateSearchText: '全部',
      timeSearch: 0,
      timeSearchText: '全部',
      statePicker: false,
      timePicker: false,
      activityStatus: ['全部', '即将开始', '进行中', '已结束'],
      activityTime: ['全部', '本周', '本月']
    }
  },
  created () {
    this.userInfo = this.$store.getters.getUserInfo
  },
  methods: {
    showTimePick () {
      this.timePicker = true
    },
    showStatePick () {
      this.statePicker = true
    },
    selectState (value, index) {
      this.statePicker = false
      if (index === 0) {
        this.stateSearch = -1
      } else {
        this.stateSearch = index
      }
      this.stateSearchText = value
      this.pageNum = 1
      this.activityList = []
      this.onLoad()
    },
    selectTime (value, index) {
      this.timePicker = false
      this.timeSearch = index
      this.timeSearchText = value
      this.pageNum = 1
      this.activityList = []
      this.onLoad()
    },
    onCancel () {
      this.statePicker = false
      this.timePicker = false
    },
    // 查看详情
    toActiveList (id) {
      this.$router.push({
        name: 'ActivityDetail',
        query: {
          id: id
        }
      })
    },
    // 查询活动 POST /api/activity/activityList
    onLoad () {
      var that = this
      var queryData = {
        'parkId': that.userInfo.selectParkId,
        'pageNum': that.pageNum,
        'pageSize': 5
      }
      if (that.timeSearch !== 0) {
        queryData.time = that.timeSearch
      }
      if (that.stateSearch !== -1) {
        queryData.status = that.stateSearch
      }
      that.$http.post('/api/activity/moreactivity', queryData).then(function (res) {
        that.loading = false
        if (res.data.result.length > 0) {
          that.pageNum += 1
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
            that.activityList.push(activityListTemp[i])
          }
        } else {
          that.finished = true
        }
      }).catch((err) => {
        Toast.fail(err.message)
      })
    }
  }
}
</script>
<style scoped>
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

.activity-list {
  width: 100%;
  margin-top: 0.277778rem;
  padding: 0.009259rem 0;
  background: #fff;
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
  border: 1px solid #dcdcdc;
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
.i-activity-address {
  font-size: 0.259259rem;
  line-height: 1;
  color: #636363;
  margin-top: 0.377778rem;
}
</style>
