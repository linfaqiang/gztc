<template>
  <div class="my-recommend-list">
    <!--头部-->
    <sub-header title="我的推荐"></sub-header>
    <!-- 列表信息 -->
    <van-list class="mrsol-c-list" v-model="loading" :finished="finished" @load="onLoad">
      <div class="mr-c-item clearfix" v-for="(item) in orderList" :key="item.id">
        <img class="comment-item-img" :src="item.memberLogo">
        <div class="mr-comment-item-describe">
          <div class="mr-c-i-d-item">
            微信名称： {{item.customerName}}
          </div>
          <div class="mr-c-i-d-item">
            手机： {{item.customerPhone}}
          </div>
          <div class="mr-c-i-d-item">
            推荐时间： {{item.recommendedTime}}
          </div>
        </div>
      </div>
      <div v-if="isEmpty" class="empty-item">暂无推荐信息</div>
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
      pageNum: 1
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.userInfo = this.$store.getters.getUserInfo
    },
    // 查询我的推荐列表 POST /api/personal/getMyRecommended
    onLoad () {
      var that = this
      var queryData = {
        page: that.pageNum
      }
      this.$http.post('/api/personal/getMyRecommended', queryData).then(function (res) {
        that.loading = false
        if (res.data.success) {
          var result = res.data.result
          if (result && result.length > 0) {
            that.pageNum++
            that.orderList = that.orderList.concat(result)
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
.mrsol-c-list {
  padding: 0 0.648148rem;
}
.mr-c-item {
  border-bottom: 1px solid #dcdcdc;
  padding: 0.648148rem 0;
}
.comment-item-img {
  width: 1.064815rem;
  height: 1.064815rem;
  float: left;
     -moz-border-radius: 50%;
       -o-border-radius: 50%;
  -webkit-border-radius: 50%;
          border-radius: 50%;
}
.mr-c-i-h {
  width: 49%;
  display: inline-block;
}
.mr-comment-item-describe {
  width: 7.12963rem;
  float: right;
  text-align: left;
  margin-left: 0.37037rem;
}
.mr-c-i-d-item {
  margin-bottom: 0.277778rem;
  font-size: 0.314815rem;
}

</style>
