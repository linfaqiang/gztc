<template>
  <div class="news-details-page">
    <!--头部-->
    <sub-header title="消息详情"></sub-header>
    <!--详情内容-->
    <div class="details-content">
      <h3>{{infoDetails.title}}</h3>
      <div class="date-item">
        <p>{{infoDetails.createTime}}</p>
      </div>
      <div class="content-list" v-html="infoDetails.content"></div>
    </div>
  </div>
</template>
<script>
import { Toast } from 'vant'
import { messageDetails, messageCount } from '@/api/index'
import SubHeader from '@/components/common/SubHeader'
import { mapGetters } from 'vuex'
export default {
  name: 'InfomationDetails',
  data () {
    return {
      infoId: 0,
      msgCount: 0,
      infoDetails: {}
    }
  },
  components: {
    [Toast.name]: Toast,
    SubHeader
  },
  computed: {
    ...mapGetters(['getUserInfo'])
  },
  methods: {
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
    messageDetails({id: this.infoId}).then((res) => {
      if (res.data.success) {
        this.infoDetails = res.data.result
      }
    }).catch((err) => {
      Toast.fail(err.message)
    })
    this.getMessageCount()
  }
}
</script>
<style scoped>
img {
  max-width: 100%;
}
.news-details-page{
  background-color: #fff;
}
.details-content{
  padding: 0 .611111rem;
  text-align: left;
}
.details-content > h3{
  color: #3b3b3b;
  font-size: .444444rem;
  padding: .4rem 0;
  line-height: .555556rem;
}
.details-content .date-item{
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
  justify-content: space-between;
  -webkit-justify-content: space-between;
  padding-bottom: .185185rem;
}
.details-content .date-item > p{
  color: #5d5d5d;
  font-size: .296296rem;
}
.details-content .date-item button{
  border: 0;
  outline: none;
  width: .759259rem;
  height: .462963rem;
  font-size: .259259rem;
  background-color: #fdcc06;
}
.content-list p{
  color: #4e4e4e;
  line-height: .5rem;
  font-size: .37037rem;
}
</style>
