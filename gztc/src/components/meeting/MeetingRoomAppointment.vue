<template>
  <div class="mra-box">
    <!--头部-->
    <sub-header title="会议室预定"></sub-header>
    <div class="mra-container">
      <div class="com-form">
        <dl>
          <dd>
            <label>
              <span>*</span>
              选择日期:
            </label>
            <input type="text" name="" v-model="aDate" :formatter="formatter" placeholder="请选择" onfocus="this.blur()" readonly="true" @click="showDataPicker">
          </dd>
          <dd>
            <label>
              <span>*</span>
              选择时间:
            </label>
            <input type="text" v-model="aTime" name="" placeholder="请选择" onfocus="this.blur()" readonly="true" @click="showTimePicker">
          </dd>
          <dd>
            <p class="mra-time-cost">
              <span>共计{{hourCount}}小时</span><span>费用： {{cost}}元</span>
            </p>
          </dd>
        </dl>
      </div>
      <div class="com-form com-form-top">
        <dl>
          <dd>
            <label>
              <span>*</span>
              企业名称:
            </label>
            <input type="text" name="" v-model="enterprise" placeholder="请输入">
          </dd>
          <dd>
            <label>
              <span>*</span>
              联&nbsp;系&nbsp;人:
            </label>
            <input class="com-text-center" type="text" name="" v-model="userName" placeholder="请输入">
          </dd>
          <dd>
            <label>
              <span>*</span>
              手&nbsp;&nbsp;&nbsp;&nbsp;机:
            </label>
            <input type="text" v-model="mobile" name="" placeholder="请输入">
          </dd>
          <dd class="com-textarea-box">
            <label>
              备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：
            </label>
            <textarea v-model="appointText" placeholder="请输入" maxlength="200"></textarea>
            <span class="words-num">{{appointText.length}}/200</span>
          </dd>
        </dl>
      </div>
      <van-popup position="bottom" v-model="dateShow">
        <van-datetime-picker v-model="currentDate" type="date" @cancel="hidePicker" :min-date="minDate" :max-date="maxDate" @confirm="pickDate"/>
      </van-popup>
      <van-popup v-model="timeShow">
        <div class="time-picker" v-if="timeObjList.length > 0">
          <div class="time-container">
            <div class="clearfix time-container-top">
              <span>选择时间</span>
              <span>开放时间：{{timeObjList[0].time}}至{{timeObjList[timeObjList.length - 1].time}}</span>
            </div>
            <div class="time-list clearfix">
              <div :class="item.class" v-for="(item, index) in timeObjList" :key="index" @click="pickTime(index, item.disable)">
                {{item.time}}
              </div>
            </div>
            <div class="select-time">
              已选：
              <span v-if="bookingStartTime !== ''">{{bookingStartTime}}
                <span v-if="bookingStartTime!==bookingEndTime && bookingEndTime !== ''"> 至 {{bookingEndTime}}</span>
              </span>
            </div>
            <div class="ctp-btn">
              <div class="ctp-btn-sure" @click="pickTimeSure">确认</div>
              <div class="ctp-btn-cancel" @click="pickTimeCancel">取消</div>
            </div>
          </div>
        </div>
      </van-popup>
      <div class="aj-btn-box">
        <div class="ad-btn" @click="submitAppointment">确&nbsp;&nbsp;认</div>
      </div>
    </div>
    <!--提交加载Loading-->
    <div class="loading-spinner-item" v-show="showLoadding">
      <van-loading color="white" />
    </div>
  </div>
</template>
<script>
import { Popup, Picker, DatetimePicker, Toast, Loading } from 'vant'
import SubHeader from '@/components/common/SubHeader'
export default {
  components: {
    [Toast.name]: Toast,
    [Popup.name]: Popup,
    [Picker.name]: Picker,
    [DatetimePicker.name]: DatetimePicker,
    [Loading.name]: Loading,
    SubHeader
  },
  data () {
    return {
      id: '',
      mobile: '',
      userName: '',
      enterprise: '',
      aDate: '',
      currentDate: '',
      formatter: 'yyyy-mm-hh',
      minDate: new Date(),
      maxDate: new Date(2030, 12, 31), // 硬编码有问题
      aTime: '',
      userInfo: {},
      appointText: '',
      timeShow: false,
      dateShow: false,
      meetingRoom: {},
      reservationsTime: [], // 被预约时间
      availableTime: [], // 开放时间
      bookingStartTime: '',
      bookingEndTime: '',
      timeObjList: [],
      startIndex: -1,
      endIndex: -1,
      hourCount: 0, // 预定小时数
      cost: 0,
      isToday: false,
      showLoadding: false
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.userInfo = this.$store.getters.getUserInfo
      this.userName = this.userInfo.nickname
      this.mobile = this.userInfo.mobile
      this.enterprise = this.userInfo.enterpriseName
      this.id = parseInt(this.$route.query.id)
      this.getPlaceInfo()
    },
    // 显示时间
    showTimePicker () {
      if (this.aDate === '') {
        Toast('请先选择日期')
        return
      }
      this.timeShow = true
    },
    showDataPicker () {
      this.dateShow = true
    },
    // 选择日期
    pickDate (value, index) {
      this.dateShow = false
      var selectDate = new Date(value)
      selectDate.getFullYear()
      var selectDateValue = selectDate.getFullYear() + '-' + (selectDate.getMonth() + 1 < 10 ? ('0' + (selectDate.getMonth() + 1)) : selectDate.getMonth() + 1) + '-' + (selectDate.getDate() < 10 ? ('0' + selectDate.getDate()) : selectDate.getDate())
      if (selectDateValue === this.aDate) {
        return
      }
      this.aDate = selectDateValue
      this.aTime = ''
      this.bookingStartTime = ''
      this.bookingEndTime = ''
      this.getReservationsTime()
    },
    // 日期隐藏
    hidePicker () {
      this.dateShow = false
    },
    // 确认选择时间
    pickTimeSure () {
      if (this.bookingStartTime === this.bookingEndTime) {
        Toast('请选择时间段')
        return
      }
      if (this.bookingStartTime && this.bookingEndTime) {
        if (this.bookingStartTime !== this.bookingEndTime) {
          this.aTime = this.bookingStartTime + ' 至 ' + this.bookingEndTime
          this.hourCount = (this.endIndex - this.startIndex) * 0.5
          this.cost = this.hourCount * parseInt(this.meetingRoom.cost)
        }
      }
      this.timeShow = false
    },
    // 取消按钮
    pickTimeCancel () {
      this.timeShow = false
    },
    // 预约时间查询 POST /api/place/ReservationsTime
    getReservationsTime () {
      var that = this
      var queryData = {
        placeId: that.id,
        bookingsDate: that.aDate
      }
      that.$http.post('/api/place/ReservationsTime', queryData).then(function (res) {
        that.reservationsTime = []
        var result = res.data.result
        var reservationsTime = []
        var reservationsTimeObj = {}
        if ((new Date(that.aDate).toDateString()) === (new Date().toDateString())) {
          that.isToday = true
        } else {
          that.isToday = false
        }
        for (var i = 0; i < result.length; i++) {
          reservationsTime = reservationsTime.concat(that.getTimeList(result[i].bookingsStartTime, result[i].bookingsEndTime))
        }
        for (var k = 0; k < reservationsTime.length; k++) {
          reservationsTimeObj[reservationsTime[k]] = 1
        }
        for (var key in reservationsTimeObj) {
          that.reservationsTime.push(key)
        }
        that.setDisableItem()
      })
    },
    // 选择时间
    pickTime (index, disable) {
      if (disable) {
        return
      }
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
        if (endIndex - startIndex >= 2 || endIndex === startIndex) {
          for (var j = startIndex; j <= endIndex; j++) {
            if (this.reservationsTime.indexOf(timeObjListTemp[j].time) > -1) {
              isDisable = true
              Toast('时间段不能包含已被预约时间')
              break
            }
          }
        } else {
          isDisable = true
          Toast('预约时间最少为1个小时')
        }
        if (isDisable) {
          this.timeObjList[startIndex].class['ctp-pick-item'] = false
          this.timeObjList[endIndex].class['ctp-pick-item'] = false
          this.timeObjList[index].class['ctp-pick-item'] = true
          this.bookingStartTime = this.timeObjList[index].time
          this.bookingEndTime = ''
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
    },
    // 初始化时间
    setDisableItem () {
      this.timeObjList = []
      var reservationsTime = this.reservationsTime
      var availableTime = this.availableTime
      for (var i = 0; i < availableTime.length; i++) {
        var timeObj = {}
        timeObj.time = availableTime[i]
        timeObj.class = {
          'time-item': true,
          'ctp-selected-item': false,
          'ctp-pick-item': false
        }
        if (reservationsTime.indexOf(availableTime[i]) > -1) {
          timeObj.class['ctp-selected-item'] = true
          timeObj.disable = true
        }
        if (this.isToday) {
          if (new Date().getTime() > new Date(this.aDate.replace(/-/g, '/') + ' ' + availableTime[i] + ':00').getTime()) {
            timeObj.class['ctp-selected-item'] = true
            timeObj.disable = true
          }
        }
        this.timeObjList.push(timeObj)
      }
    },
    /**
     * 会议室列表查询 POST /api/place/placeInfo
     */
    getPlaceInfo () {
      var that = this
      var queryData = {
        id: that.id
      }
      that.$http.post('/api/place/placeInfo', queryData).then(function (res) {
        var result = res.data.result
        that.meetingRoom = result
        that.availableTime = that.getTimeList(result.selectedStartTime, result.selectedEndTime)
      })
    },
    // 获取时间列表
    getTimeList (startTime, endTime) {
      startTime = startTime.split(':')
      endTime = endTime.split(':')
      var GRADIENT = 30
      var startHour = this.timeToNum(startTime[0])
      var startMin = this.timeToNum(startTime[1])
      var endHour = this.timeToNum(endTime[0])
      var endMin = this.timeToNum(endTime[1])
      var availableTime = []
      var min = startMin
      for (var i = startHour; i <= endHour; i++) {
        var hour = i
        if (i < 10) {
          hour = '0' + i
        }
        if (min === 0) {
          availableTime.push(hour + ':' + min + '0')
          min = GRADIENT
        }
        if (min === GRADIENT) {
          if (i === endHour && endMin === 0) {
            break
          }
          availableTime.push(hour + ':' + min)
          min = 0
        }
      }
      return availableTime
    },
    // 时间转化为数字
    timeToNum (str) {
      if (str.indexOf('0') === 0) {
        str = str.substring(1)
      }
      return parseInt(str)
    },
    // 手机号码校验
    isPhone (mobile) {
      var phoneReg = /^[1][3,5,7,8][0-9]{9}$/
      return phoneReg.test(mobile)
    },
    // 判断是否为空
    isEmpty (str) {
      return str.trim().length === 0
    },
    // 提交数据校验
    checkData () {
      if (this.isEmpty(this.aDate)) {
        Toast('请选择日期')
        return true
      }
      if (this.isEmpty(this.bookingStartTime) && this.isEmpty(this.bookingEndTime)) {
        Toast('请选择时间')
        return true
      }
      if (this.isEmpty(this.enterprise)) {
        Toast('请填写企业名称')
        return true
      }
      if (this.isEmpty(this.userName)) {
        Toast('请填写姓名')
        return true
      }
      if (!this.isPhone(this.mobile)) {
        Toast('请填写正确的手机号码')
        return true
      }
      return false
    },
    // 提交预约 POST /api/place/appointment
    submitAppointment () {
      var that = this
      var queryData = {
        placeId: that.meetingRoom.id,
        parkId: this.userInfo.selectParkId,
        bookingsDate: this.aDate,
        startTime: this.bookingStartTime,
        endTime: this.bookingEndTime,
        name: this.userName,
        phone: this.mobile,
        company: this.enterprise,
        remark: this.appointText,
        cost: this.cost
      }
      if (that.checkData()) {
        return
      }
      that.showLoadding = true
      that.$http.post('/api/place/appointment', queryData).then(function (res) {
        that.showLoadding = false
        if (res.data.success) {
          var result = res.data.result
          if (result.cost === 0 || result.cost === '0') {
            that.$router.push({
              name: 'PlaceOderDetail',
              query: {
                id: result.id
              }
            })
            return
          }
          that.$router.push({
            name: 'SelectPay',
            query: {
              money: result.cost,
              orderNo: result.orderNo,
              orderId: result.id,
              orderType: '2',
              payOptionName: that.meetingRoom.name + '(会议室预定)',
              redirectUrl: 'PlaceOderDetail'
            }
          })
        } else {
          Toast(res.data.message)
        }
      })
    }
  }
}
</script>
<style scoped>
.mra-container {
  margin-bottom: 1.435185rem;
}
.time-picker {
  width: 100%;
  height: 100%;
}
.time-container {
  width: 8.981481rem;
  height: 14.166667rem;
  overflow: auto;
  background: #fff;
  text-align: left;
  padding: 0.37037rem;
}
.time-container-top {
  font-size: 0.37037rem;
}
.time-container-top span {
  float: left;
  display: inline-block;
}
.time-container-top span:last-child {
  float: right;
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
  color: #1b1b1b;
  border: 1px solid #dddddd;
     -moz-border-radius: 0.046296rem;
       -o-border-radius: 0.046296rem;
  -webkit-border-radius: 0.046296rem;
          border-radius: 0.046296rem;
}
.ctp-selected-item {
  background: #e5e5e5;
  color: #858585;
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
.mra-time-cost {
  line-height: 1.296296rem;
  text-align: right;
}
.mra-time-cost span {
  margin-left: 40px;
}
</style>
