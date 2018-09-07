<template>
  <div class="new-list-page">
    <!--头部-->
    <sub-header title="活动报名单"></sub-header>

    <!-- 列表信息 -->
    <div class="activity-list">
      <van-list v-model="loading" :finished="finished" @load="onLoad">
        <div class="i-activity-box" v-for="(item, index) in activityList" :key="index">
          <span class="pol-cd-item-state" v-if="item.codeStatus===0">未验证</span>
          <span class="pol-cd-item-state pol-cd-item-state-u" v-if="item.codeStatus===1">已验证</span>
          <span class="pol-cd-item-state pol-cd-item-state-u" v-if="item.codeStatus===2">已失效</span>
          <div class="i-activity-info clearfix" @click="toActivityOrderDetail(item.id)">
            <div class="i-iactivity-img">
              <img :src="item.mobileCover">
              <div class="i-activity-type">
                {{item.classifyName}}
              </div>
            </div>
            <div class="i-activity-detail">
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
              <div :class="item.class">
                {{item.satus}}
              </div>
              <div class="i-activity-address">
                {{item.actAddress}}
              </div>
            </div>
          </div>
        </div>
        <div v-if="isEmpty" class="empty-item">暂无活动报名单信息</div>
      </van-list>
    </div>
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
      isEmpty: false,
      pageNum: 1
    }
  },
  created () {
    this.userInfo = this.$store.getters.getUserInfo
  },
  methods: {
    // 查看详情
    toActivityOrderDetail (id) {
      this.$router.push({
        name: 'ActivityOrderDetail',
        query: {
          id: id
        }
      })
    },
    // 查询活动 POST /api/service/activityApplyList
    onLoad () {
      var that = this
      var queryData = {
        'pid': that.userInfo.selectParkId,
        'page': that.pageNum,
        'size': 5
      }
      if (that.timeSearch !== 0) {
        queryData.time = that.timeSearch
      }
      if (that.stateSearch !== -1) {
        queryData.status = that.stateSearch
      }
      that.$http.post('/api/service/activityApplyList', queryData).then(function (res) {
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
          if (!that.activityList.length) {
            that.isEmpty = true
          } else {
            that.isEmpty = false
          }
        }
      }).catch((err) => {
        Toast.fail(err.message)
      })
    }
  }
}
</script>
<style scoped>
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
  position: relative;
}
.pol-cd-item-state {
  background: #fecd05;
  font-size: 0.259259rem;
  padding: 0.037037rem 0.092593rem;
     -moz-border-radius: 0.074074rem;
       -o-border-radius: 0.074074rem;
  -webkit-border-radius: 0.074074rem;
          border-radius: 0.074074rem;
  position: absolute;
  left: 0.1482593rem;
  top: 0.582593rem;
}
.pol-cd-item-state-u {
  background: #9c9c9c;
  color: #fff;
}
.i-activity-info {
  height: 4.685185rem;
  padding: 0.462963rem 0.277778rem;
  text-align: left;
  border: 1px solid #969696;
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
  height: 0.359259rem;
  font-size: 0.259259rem;
  line-height: 1.2;
  overflow: hidden;
  white-space: nowrap;
  margin-top: 0.277778rem;
  color: #303030;
}
.i-activity-detail {
  width: 5.740741rem;
  float: left;
  margin-left: 0.462963rem;
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
.i-activity-status {
  width: 1.296296rem;
  height: 0.37037rem;
  line-height: 0.37037rem;
  text-align: center;
  font-size: 0.259259rem;
  color: #1a1a1a;
  background: #fecd05;
  margin-top: 0.277778rem;
}
.i-activity-end {
  color: #fff;
  background: #c1c1c1;
}
.i-activity-address {
  font-size: 0.259259rem;
  line-height: 1;
  margin-top: 0.277778rem;
  color: #636363;
  margin-top: 0.333333rem;
}
.empty-item{
  padding: .185185rem 0;
  text-align: center;
}
</style>
