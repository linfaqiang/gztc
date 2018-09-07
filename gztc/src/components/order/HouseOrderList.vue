<template>
  <div class="house-order-list">
    <!--头部-->
    <sub-header title="预约看房单"></sub-header>
    <!-- 列表信息 -->
    <van-list class="hol-c-list" v-model="loading" :finished="finished" @load="onLoad">
      <div class="pol-c-item clearfix" v-for="(item, index) in houseList" :key="index" @click="toHouseOrderDetail(item.id)">
        <img class="pol-c-i-img" :src="item.mobileCover">
        <div class="pol-c-i-describe">
          <div class="pol-c-i-title">{{item.attractInvestmentName}}</div>
          <div class="pol-c-i-option">意向户型：{{item.houseType}}</div>
          <div class="pol-c-i-option">提交时间：{{item.createTime}}</div>
          <div class="pol-c-i-option">预约时间：{{item.bookingsTime}}</div>
        </div>
      </div>
      <div v-if="isEmpty" class="empty-item">暂无预约看房单信息</div>
    </van-list>
  </div>
</template>
<script>
import { List, Toast } from 'vant'
import SubHeader from '@/components/common/SubHeader'
export default {
  components: {
    [List.name]: List,
    [Toast.name]: Toast,
    SubHeader
  },
  data () {
    return {
      houseList: [],
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
    toHouseOrderDetail (id) {
      this.$router.push({
        name: 'HouseOrderDetail',
        query: {
          id: id
        }
      })
    },
    // 查询活动 POST /api/service/getHouseOrder
    onLoad () {
      var that = this
      var queryData = {
        'pid': that.userInfo.selectParkId,
        'page': that.pageNum,
        'size': 5
      }
      that.$http.post('/api/service/getHouseOrder', queryData).then(function (res) {
        that.loading = false
        if (res.data.result.length > 0) {
          that.pageNum += 1
          var houseListTemp = res.data.result
          for (var i = 0; i < houseListTemp.length; i++) {
          }
          that.houseList = that.houseList.concat(houseListTemp)
        } else {
          that.finished = true
          if (!that.houseList.length) {
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
  .empty-item{
    padding: .185185rem 0;
    text-align: center;
  }
</style>
