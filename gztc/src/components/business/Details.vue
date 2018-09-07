<template>
  <div class="news-details-page">
    <!--头部-->
    <sub-header :title="title"></sub-header>
    <!--详情内容-->
    <div class="details-content">
      <h3>{{enterDetails.fullName}}</h3>
      <div class="date-item">
        <p>发布时间：{{enterDetails.createTime | formatDate}}</p>
      </div>
      <div class="content-list" v-html="enterDetails.remark"></div>
    </div>
  </div>
</template>
<script>
import { Toast } from 'vant'
import { getEnterDetails } from '@/api/index'
import SubHeader from '@/components/common/SubHeader'
export default {
  name: 'BusinessDetails',
  data () {
    return {
      title: '',
      enterId: 0,
      enterDetails: {}
    }
  },
  components: {
    [Toast.name]: Toast,
    SubHeader
  },
  filters: {
    formatDate (date) {
      return (date || '').split(' ')[0].toString()
    }
  },
  created () {
    this.enterId = this.$route.query.id
    switch (this.$route.query.type) {
      case 0: // 企业列表
        this.title = '企业详情'
        break
      case 1: // 企业列表
        this.title = '商家详情'
        break
      default:
        this.title = '商家详情'
    }
    getEnterDetails({id: this.enterId}).then((res) => {
      if (res.data.success) {
        this.enterDetails = res.data.result
      }
    }).catch((err) => {
      Toast.fail(err.message)
    })
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
