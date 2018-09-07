<template>
  <div class="park-select">
    <!--头部-->
    <sub-header title="园区选择"></sub-header>
    <!--新闻列表-->
    <div class="park-box">
      <div class="park-box-title">
        当前园区： {{ userInfo.selectParkName }}
      </div>
      <div class="park-container" v-for="(item, index) in parkList" :key="item.id">
        <div class="pc-park-title">
          {{ item.area }}
        </div>
        <div class="pc-park-list clearfix" >
          <span :class="park.class" @click="selectParkAction(park, index, selfIndex)" v-for="(park, selfIndex) in item.children" :key="park.id">
            {{ park.name }}
          </span>
        </div>
      </div>
    </div>
    <div class="select-park-btn">
      <div class="select-park-btn-sure" @click="submitAction">确&nbsp;&nbsp;认</div>
    </div>
  </div>
</template>
<script>
import SubHeader from '@/components/common/SubHeader'
import { Toast } from 'vant'
import { SetCookie } from '@/sys.util'
export default {
  name: 'ParkSelect',
  components: {
    SubHeader,
    [Toast.name]: Toast
  },
  data () {
    return {
      userInfo: {},
      selectPark: {},
      parkList: [],
      registerInfo: {}
    }
  },
  created () {
    var userInfoTemp = this.$store.getters.getUserInfo
    this.userInfo = userInfoTemp
    this.registerInfo = this.$store.getters.getRegisterInfo
    this.selectPark.id = userInfoTemp.selectParkId
    this.selectPark.name = userInfoTemp.selectParkName
    this.getParkList()
  },
  methods: {
    /**
     * 选择园区事件
     */
    selectParkAction (park, areaIndex, selfIndex) {
      this.selectPark = park
      for (var i = 0; i < this.parkList.length; i++) {
        var areaList = this.parkList[i].children
        for (var j = 0; j < areaList.length; j++) {
          areaList[j].class['park-item-select'] = false
        }
      }
      this.parkList[areaIndex].children[selfIndex].class['park-item-select'] = true
    },
    // 确认操作
    submitAction () {
      SetCookie('selectParkId', this.selectPark.id)
      SetCookie('selectParkName', encodeURI(this.selectPark.name))
      this.userInfo.selectParkId = this.selectPark.id
      this.userInfo.selectParkName = this.selectPark.name
      this.$store.dispatch('commitUserInfo', this.userInfo)
      this.$router.push({
        name: 'Index',
        query: {
          parkId: this.selectPark.id
        }
      })
    },
    /**
     * 获取园区信息
     */
    getParkList: function () {
      var that = this
      this.$http.get('/api/index/parkList').then(function (res) {
        that.parkList = that.parkListHandle(res.data.result)
      })
    },
    /**
     * 处理园区列表信息
     */
    parkListHandle: function (parkList) {
      var parkInfoList = []
      var parkInfoObj = {}
      for (var i = 0; i < parkList.length; i++) {
        var currentObj = parkList[i]

        if (!parkInfoObj[currentObj.area]) {
          parkInfoObj[currentObj.area] = {}
          parkInfoObj[currentObj.area].id = currentObj.area
          parkInfoObj[currentObj.area].area = currentObj.codeText
          parkInfoObj[currentObj.area].children = []
        }

        currentObj.class = {
          'park-item': true,
          'park-item-current': parseInt(this.userInfo.selectParkId) === currentObj.id,
          'park-item-select': false
        }
        parkInfoObj[currentObj.area].children.push(currentObj)
      }
      for (var obj in parkInfoObj) {
        parkInfoList.push(parkInfoObj[obj])
      }
      return parkInfoList
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
.park-select {
  width: 100%;
}
.park-box {
  width: 95%;
  margin: 0 auto;
  margin-bottom: 1.666667rem;
     -moz-border-radius: 0.185185rem;
       -o-border-radius: 0.185185rem;
  -webkit-border-radius: 0.185185rem;
          border-radius: 0.185185rem;
}
.park-box-title {
  width: 100%;
  height: 1.111111rem;
  line-height: 1.111111rem;
  font-size: 0.37037rem;
  color: #404040;
  text-align: left;
}
.park-container {
  width: 100%;
  padding: 0 0.277778rem;
  background: #fff;
}
.pc-park-title {
  height: 1.111111rem;
  font-size: 0.444444rem;
  line-height: 1;
  color: #3b3b3b;
  text-align: left;
  padding-top: 0.462963rem;
}
.pc-park-list {
  margin-left: -2.5%;
  padding-bottom: 0.462963rem;
}
.park-item {
  min-width: 2.777777rem;
  height: 0.833333rem;
  line-height: 0.833333rem;
  padding: 0 0.37037rem;
  font-size: 0.333333rem;
  margin: 0.277778rem 0 0 0.277778rem;
  float: left;
  border: 1px solid #e9e9e9;
     -moz-border-radius: 0.046296rem;
       -o-border-radius: 0.046296rem;
  -webkit-border-radius: 0.046296rem;
          border-radius: 0.046296rem;
}
.park-item-current {
  border: 1px solid #303030;
  background: #fdcc07;
}
.park-item-select {
  background: #fdcc07;
}
.select-park-btn {
  position: fixed;
  width: 100%;
  height: 1.666667rem;
  bottom: 0;
  left: 0;
  background: #f9f9f9;
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
}
</style>
