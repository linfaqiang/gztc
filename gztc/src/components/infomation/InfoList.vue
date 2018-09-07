<template>
  <div class="infomation-list">
    <!--头部-->
    <sub-header title="消息列表"></sub-header>
    <!--列表内容-->
    <div class="info-list-content">
      <van-list v-model="loading" :finished="finished" @load="onLoad" >
        <ul>
          <li v-for="info in infoList" :key="info.id">
            <router-link :to="{path: 'InfomationDetails', query: {id: info.id}}">
              <h4>
                <b v-if="info.type === 0">预约看房消息</b>
                <b v-if="info.type === 1">预约申请消息</b>
                <b v-if="info.type === 2">会议室/场地消息</b>
                <b v-if="info.type === 3">付费服务消息</b>
                <b v-if="info.type === 4">活动报名消息</b>
                <b v-if="info.type === 5">平台消息</b>
                <strong v-if="info.status === 0">未读</strong>
                <strong v-if="info.status === 1" class="end">已读</strong>
                <span>{{info.createTime}}</span>
              </h4>
              <p v-html="info.content"></p>
            </router-link>
          </li>
        </ul>
      </van-list>
      <div v-if="isEmpty" class="empty-item">暂无消息</div>
    </div>
  </div>
</template>
<script>
import { List, Toast } from 'vant'
import { messageList, messageCount } from '@/api/index'
import SubHeader from '@/components/common/SubHeader'
import { mapGetters } from 'vuex'
export default {
  name: 'InfomationList',
  data () {
    return {
      loading: false,
      finished: false,
      pageNum: 0,
      isEmpty: false,
      infoId: -1,
      infoType: -1,
      infoList: [],
      msgCount: 0
    }
  },
  components: {
    [List.name]: List,
    [Toast.name]: Toast,
    SubHeader
  },
  computed: {
    ...mapGetters(['getUserInfo'])
  },
  methods: {
    onLoad () {
      this.pageNum++
      messageList({
        id: this.infoId, // 会员ID
        type: this.infoType,
        pageNum: this.pageNum,
        pageSize: 10
      }).then((res) => {
        this.loading = false
        if (res.data.success) {
          if (res.data.result.length) {
            res.data.result.forEach((item) => {
              this.infoList.push(item)
            })
          } else {
            this.finished = true
            if (!this.infoList.length) {
              this.isEmpty = true
            } else {
              this.isEmpty = false
            }
          }
        }
      }).catch((err) => {
        Toast.fail(err.message)
      })
    },
    /**
     * 获取消息数量
     */
    getMessageCount () {
      for (let i = 0; i < 6; i++) {
        messageCount({id: this.getUserInfo.id, type: i}).then((res) => {
          if (res.data.success) {
            this.msgCount += res.data.result
            this.$store.dispatch('commitMessageCount', this.msgCount)
          }
        }).catch((err) => {
          console.log(err.message)
        })
      }
    }
  },
  created () {
    this.infoId = this.$route.query.id
    this.infoType = this.$route.query.type
    this.getMessageCount()
  }
}
</script>
<style scoped>
img {
  max-width: 100%;
}
.info-list-content{
  text-align: left;
  padding: .5rem .277778rem 0 .277778rem;
  font-size: .314815rem;
  border-bottom: 1px solid #dcdcdc;
  background-color: #fff;
}
.info-list-content li{
  margin-bottom: .518519rem;
  padding: .111111rem .37037rem .277778rem .37037rem;
  border: .018519rem solid #f2f2f2;
  background-color: #f9f9fb;
}
.info-list-content li a{
  display: block;
  color: #2d2d2d;
}
.info-list-content li h4{
  position: relative;
  padding: .185185rem 0;
  font-size: .333333rem;
}
.info-list-content li h4 b{
  font-weight: normal;
}
.info-list-content li h4 strong{
  display: inline-block;
  vertical-align: middle;
  padding: .027778rem .138889rem;
  border-radius: .037037rem;
  font-size: .277778rem;
  font-weight: normal;
  text-align: center;
  background-color: #fecd05;
}
.info-list-content li h4 strong.end{
  color: #fff;
  background-color: #b7b7b7;
}
.info-list-content li h4 span{
  position: absolute;
  right: 0;
  top: 50%;
  font-size: .277778rem;
  transform: translate(0, -50%);
  -webkit-transform: translate(0, -50%)
}
.info-list-content li p{
  font-size: .314815rem;
  line-height: .555556rem;
}
.empty-item{
  padding: .185185rem 0;
  text-align: center;
}
</style>
