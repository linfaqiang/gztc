<template>
  <div class="place-order-list">
    <!--头部-->
    <sub-header title="会议室场地单"></sub-header>
    <div class="pol-search-box">
      <span :class="searchItem[0]" @click="searchByAll">全部</span>
      <span :class="searchItem[1]" @click="searchByPlace">场地</span>
      <span :class="searchItem[2]" @click="searchByMeet">会议室</span>
    </div>
    <van-list class="pol-list-box" v-model="loading" :finished="finished" @load="onLoad">
      <div class="pol-list-item clearfix" v-for="(item) in placeOrderList" :key="item.id" @click="toPlaceOrderDetail(item.id)">
        <div class="pol-statu-tip" v-if="item.codeStatus===0">未验证</div>
        <div class="pol-statu-tip pol-statu-tip-u" v-if="item.codeStatus===1">已验证</div>
        <div class="pol-statu-tip pol-statu-tip-u" v-if="item.codeStatus===2">已失效</div>
        <img class="pol-list-item-img" :src="item.mobileCover">
        <div class="pol-list-item-describe">
          <div class="pol-lid-option pol-lid-name">{{item.placeInfoName}}</div>
          <div class="pol-lid-option">服务类型： {{item.typeName}}预定</div>
          <div class="pol-lid-option pol-lid-submit-time">提交时间： {{item.createTime}}</div>
          <div class="pol-lid-option">预约时间： {{item.bookingsStartTime}}</div>
        </div>
      </div>
      <div v-if="isEmpty" class="empty-item">暂无会议室场地预定信息</div>
    </van-list>
  </div>
</template>
<script>
import SubHeader from '@/components/common/SubHeader'
import { List } from 'vant'
export default {
  data () {
    return {
      loading: false,
      finished: false,
      isEmpty: false,
      pageNum: 1,
      isLoad: false,
      userInfo: {},
      placeOrderList: [],
      type: '',
      searchItem: [{
        'pol-search-item': true,
        'pol-active-item': true
      }, {
        'pol-search-item': true,
        'pol-active-item': false
      }, {
        'pol-search-item': true,
        'pol-active-item': false
      }]
    }
  },
  components: {
    SubHeader,
    [List.name]: List
  },
  computed: {
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.userInfo = this.$store.getters.getUserInfo
    },
    searchByAll () {
      this.placeOrderList = []
      this.pageNum = 1
      this.type = ''
      this.searchItem[0]['pol-active-item'] = true
      this.searchItem[1]['pol-active-item'] = false
      this.searchItem[2]['pol-active-item'] = false
      this.finished = false
      this.onLoad()
    },
    searchByPlace () {
      this.placeOrderList = []
      this.pageNum = 1
      this.type = 2
      this.searchItem[0]['pol-active-item'] = false
      this.searchItem[1]['pol-active-item'] = true
      this.searchItem[2]['pol-active-item'] = false
      this.finished = false
      this.onLoad()
    },
    searchByMeet () {
      this.placeOrderList = []
      this.pageNum = 1
      this.type = 1
      this.searchItem[0]['pol-active-item'] = false
      this.searchItem[1]['pol-active-item'] = false
      this.searchItem[2]['pol-active-item'] = true
      this.finished = false
      this.onLoad()
    },
    // 场地服务单 POST /api/service/placeInfoList
    onLoad () {
      if (this.isLoad) {
        return
      }
      var that = this
      var queryData = {
        pid: that.userInfo.selectParkId,
        page: that.pageNum,
        size: 5
      }
      that.isLoad = true
      if (that.type !== '') {
        queryData.type = that.type
      }
      this.$http.post('/api/service/placeInfoList', queryData).then(function (res) {
        that.isLoad = false
        that.loading = false
        if (res.data.result.length > 0) {
          that.pageNum++
          var result = res.data.result
          for (var i = 0; i < result.length; i++) {
            if (result[i].placeInfoType === '1') {
              result[i].typeName = '会议室'
            } else {
              result[i].typeName = '场地'
            }
            result[i].createTime = result[i].createTime.substring(0, result[i].createTime.lastIndexOf(':'))
            that.placeOrderList.push(result[i])
          }
        } else {
          that.finished = true
          if (!that.placeOrderList.length) {
            that.isEmpty = true
          } else {
            that.isEmpty = false
          }
        }
      }).catch(function (err) {
        console.log(err)
      })
    },
    // 跳详情页
    toPlaceOrderDetail (id) {
      this.$router.push({
        name: 'PlaceOderDetail',
        query: {
          id: id
        }
      })
    }
  }
}
</script>
<style>
  .empty-item{
    padding: .185185rem 0;
    text-align: center;
  }
</style>
