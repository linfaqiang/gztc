<template>
  <div class="house-order-list">
    <!--头部-->
    <sub-header title="付费服务单"></sub-header>
    <div class="sol-search-box clearfix">
      <span :class="item.class" v-for="(item, index) in searchItem" :key="item.id" @click="searchOrder(item.id, index)">{{item.text}}</span>
    </div>
    <!-- 列表信息 -->
    <van-list class="sol-c-list" v-model="loading" :finished="finished" @load="onLoad">
      <div class="sol-c-item clearfix" v-for="(item) in orderList" :key="item.id" @click="toChargeOrderDetail(item.id)">
        <div class="sol-c-title">
          {{item.serviceName}}
          <span class="sol-c-t-small">{{item.itemName}}</span>
        </div>
        <div class="sol-c-item-option">
          提交时间： {{item.cerateTime}}
        </div>
        <div class="sol-c-item-option">
          预约时间： {{item.bookingsTime}}
        </div>
        <div :class="item.class">
          {{item.statusName}}
        </div>
      </div>
      <div v-if="isEmpty" class="empty-item">暂无付费服务单信息</div>
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
      orderList: [],
      userInfo: {},
      loading: false,
      finished: false,
      isEmpty: false,
      isLoad: false,
      pageNum: 1,
      prevIndex: 0,
      serviceType: 1,
      serviceId: '',
      searchItem: [{
        'id': '',
        'text': '全部',
        'msgCount': '',
        'class': {
          'pol-search-item': true,
          'pol-active-item': true
        }
      }]
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.userInfo = this.$store.getters.getUserInfo
      this.getServiceType()
    },
    // 插叙操作
    searchOrder (id, index) {
      var that = this
      that.searchItem[that.prevIndex].class['pol-active-item'] = false
      that.prevIndex = index
      that.searchItem[index].class['pol-active-item'] = true
      that.pageNum = 1
      that.serviceId = id
      that.orderList = []
      that.finished = false
      that.onLoad()
    },
    // 查询息服务类型 POST /api/service/payServiceType
    getServiceType () {
      var that = this
      that.$http.post('/api/service/payServiceType').then(function (res) {
        if (res.data.success) {
          if (res.data.result) {
            var serviceList = res.data.result
            for (var i = 0; i < serviceList.length; i++) {
              var searchItemObj = {}
              searchItemObj.id = serviceList[i].id
              searchItemObj.text = serviceList[i].name
              searchItemObj.type = serviceList[i].type
              searchItemObj.msgCount = serviceList[i].msgCount
              searchItemObj.class = {}
              searchItemObj.class['pol-search-item'] = true
              searchItemObj.class['pol-active-item'] = false

              that.searchItem.push(searchItemObj)
            }
          }
        } else {
          Toast.fail(res.data.message)
        }
      })
    },
    // 详情页
    toChargeOrderDetail (id) {
      this.$router.push({
        name: 'ChargeOrderDetail',
        query: {
          id: id
        }
      })
    },
    // 查询服务单列表 POST /api/service/serviceOrderList
    onLoad () {
      if (this.isLoad) {
        return
      }
      var that = this
      var queryData = {
        page: that.pageNum,
        size: 8,
        pid: that.userInfo.selectParkId,
        serviceType: that.serviceType
      }
      that.isLoad = true
      if (that.serviceId !== '') {
        queryData.serviceId = that.serviceId
      }
      this.$http.post('/api/service/serviceOrderList', queryData).then(function (res) {
        that.isLoad = false
        that.loading = false
        if (res.data.success) {
          var result = res.data.result
          if (result.length > 0) {
            // 0：服务申请、1：已派单、2：已接单、3：已报价、4：已支付、5：服务中、6：已服务、7：已完成、8：已取消
            that.pageNum++
            for (var i = 0; i < result.length; i++) {
              var temp = result[i]
              temp.bookingsTime = temp.bookingsTime.substring(0, temp.bookingsTime.lastIndexOf(':'))
              temp.cerateTime = temp.cerateTime.substring(0, temp.cerateTime.lastIndexOf(':'))
              temp.class = {}
              temp.class['sol-c-statu'] = true
              // sol-c-statu-a sol-c-statu
              switch (temp.status) {
                case 0:
                  temp.statusName = '未验证'
                  temp.class['sol-c-statu-a'] = false
                  break
                case 1:
                  temp.statusName = '已派单'
                  temp.class['sol-c-statu-a'] = false
                  break
                case 2:
                  temp.statusName = '已接单'
                  temp.class['sol-c-statu-a'] = false
                  break
                case 3:
                  temp.statusName = '已报价'
                  temp.class['sol-c-statu-a'] = false
                  break
                case 4:
                  temp.statusName = '已支付'
                  temp.class['sol-c-statu-a'] = false
                  break
                case 5:
                  temp.statusName = '服务中'
                  temp.class['sol-c-statu-a'] = false
                  break
                case 6:
                  temp.statusName = '已服务'
                  temp.class['sol-c-statu-a'] = false
                  break
                case 7:
                  temp.statusName = '已完成'
                  temp.class['sol-c-statu-a'] = true
                  break
                case 8:
                  temp.statusName = '已取消'
                  temp.class['sol-c-statu-a'] = true
                  break
              }
              that.orderList.push(temp)
            }
          } else {
            that.finished = true
            if (!that.orderList.length) {
              that.isEmpty = true
            } else {
              that.isEmpty = false
            }
          }
        } else {
          that.finished = true
          Toast.fail(res.data.message)
        }
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
