<template>
  <div class="time-picker">
    <div class="time-container">
      <div class="clearfix time-container-top">
        <span>选择时间</span>
        <span>开放时间：{{timeObjList[0].time}}至{{timeObjList[timeObjList.length - 1].time}}</span>
      </div>
      <div class="time-list clearfix">
        <div :class="item.class" v-for="(item, index) in timeObjList" :key="index" @click="pickTime(index)">
          {{item.time}}
        </div>
      </div>
      <div class="select-time">
        已选：
        <span v-if="bookingStartTime !== ''">{{bookingStartTime}}
          <span v-if="bookingStartTime!==bookingEndTime"> 至 {{bookingEndTime}}</span>
        </span>
      </div>
      <div class="ctp-btn">
        <div class="ctp-btn-sure" @click="pickTimeSure">确认</div>
        <div class="ctp-btn-cancel" @click="pickTimeCancel">取消</div>
      </div>
    </div>
  </div>
</template>
<script>
import SubHeader from '@/components/common/SubHeader'
import { Toast } from 'vant'
export default {
  name: 'ParkSelect',
  components: {
    SubHeader,
    [Toast.name]: Toast
  },
  props: ['timeObjList'],
  data () {
    return {
      reserveTime: {},
      startIndex: -1,
      endIndex: -1,
      bookingStartTime: '',
      bookingEndTime: ''
    }
  },
  created () {
    this.reserveTime = this.$store.getters.getReserveTime
  },
  methods: {
    // 确认选择时间
    pickTimeSure () {
      this.reserveTime.bookingStartTime = this.bookingStartTime
      this.reserveTime.bookingEndTime = this.bookingEndTime
      this.reserveTime.timeShow = false
      this.$store.dispatch('commitReserveTime', this.reserveTime)
    },
    // 取消按钮
    pickTimeCancel () {
      this.$emit('hideTimePick')
    },
    // 选择时间
    pickTime (index) {
      var timeObjListTemp = this.timeObjList
      var startIndex = this.startIndex
      var endIndex = this.endIndex
      var isDisable = false
      if (startIndex === -1) {
        startIndex = index
      }
      if (endIndex === -1) {
        endIndex = index
      }
      // 重新选择时间
      if (startIndex !== endIndex) {
        for (var i = startIndex; i <= endIndex; i++) {
          timeObjListTemp[i].class['ctp-pick-item'] = false
        }
        startIndex = index
        endIndex = index
      }
      if (startIndex === endIndex) {
        if (startIndex < index) {
          endIndex = index
        } else {
          startIndex = index
        }
        for (var j = startIndex; j <= endIndex; j++) {
          if (this.reserveTime.reservationsTime.indexOf(timeObjListTemp[j].time) > -1) {
            isDisable = true
            Toast('时间段不能包含已被预约时间')
            break
          }
        }
        if (isDisable) {
          this.timeObjList[startIndex].class['ctp-pick-item'] = false
          this.timeObjList[endIndex].class['ctp-pick-item'] = false
          this.timeObjList[index].class['ctp-pick-item'] = true
          this.startIndex = index
          this.endIndex = index
          return
        } else {
          for (var k = startIndex; k <= endIndex; k++) {
            timeObjListTemp[k].class['ctp-pick-item'] = true
          }
        }
      }
      this.startIndex = startIndex
      this.endIndex = endIndex
      this.bookingStartTime = timeObjListTemp[this.startIndex].time
      this.bookingEndTime = timeObjListTemp[this.endIndex].time
      this.timeObjList = timeObjListTemp
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
.time-picker {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.time-container {
  width: 8.981481rem;
  height: 14.166667rem;
  overflow: auto;
  background: #fff;
  margin: 0 auto;
  margin-top: 1.851852rem;
  text-align: left;
  padding: 0.37037rem;
}
.time-container-top {
  font-size: 0.37037rem;
}
.time-container-top span {
  width: 50%;
  float: left;
  display: inline-block;
}
.time-list {
  width: 100%;
  max-height: 10.648148rem;
  overflow: auto;
  background: #f9f9f9;
  padding: 0.37037rem 0.17037rem;
  margin-top: 0.37037rem;
}
.time-item {
  min-width: 3.518519rem;
  height: 0.740741rem;
  line-height: 0.833333rem;
  padding: 0 0.37037rem;
  font-size: 0.333333rem;
  margin: 0.297778rem 0 0 0.297778rem;
  float: left;
  text-align: center;
  background: #fff;
  border: 1px solid #e9e9e9;
     -moz-border-radius: 0.046296rem;
       -o-border-radius: 0.046296rem;
  -webkit-border-radius: 0.046296rem;
          border-radius: 0.046296rem;
}
.ctp-selected-item {
  background: #e5e5e5;
  border: none;
}
.ctp-pick-item {
  background: #fdcc07;
  color: #fff;
  border: none;
}
.time-item-current {
  border: 1px solid #303030;
  background: #fdcc07;
}
.time-item-select {
  background: #fdcc07;
}
.select-time {
  margin-top: 0.277778rem;
  font-size: 0.314815rem;
}
.ctp-btn {
  width: 100%;
  position: absolute;
  left: -0.066185rem;
  bottom: 0.37037rem;
  padding: 0 0.77037rem;
  height: 0.925926rem;
}
.ctp-btn-sure {
  width: 3.611111rem;
  height: 0.925926rem;
  line-height: 0.925926rem;
  text-align: center;
  background: #fdcc07;
  float: left;
  font-size: 0.37037rem;
     -moz-border-radius: 0.046296rem;
       -o-border-radius: 0.046296rem;
  -webkit-border-radius: 0.046296rem;
          border-radius: 0.046296rem;
}
.ctp-btn-cancel {
  width: 3.611111rem;
  height: 0.925926rem;
  float: right;
  line-height: 0.925926rem;
  text-align: center;
  background: #d4d4d4;
  font-size: 0.37037rem;
     -moz-border-radius: 0.046296rem;
       -o-border-radius: 0.046296rem;
  -webkit-border-radius: 0.046296rem;
          border-radius: 0.046296rem;
}
</style>
