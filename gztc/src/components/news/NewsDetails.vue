<template>
  <div class="news-details-page">
    <!--头部-->
    <sub-header title="新闻详情"></sub-header>
    <!--详情内容-->
    <div class="details-content">
      <h3>{{newsDetail.title}}</h3>
      <div class="date-item">
        <p>{{newsDetail.publishTime}}</p>
        <button type="button" v-if="newsDetail.type === 2">公告</button>
      </div>
      <div class="content-list" v-html="newsDetail.content"></div>
    </div>
  </div>
</template>
<script>
import { Toast } from 'vant'
import { getNewsDetail } from '@/api/index'
import SubHeader from '@/components/common/SubHeader'
export default {
  name: 'NewsDetails',
  data () {
    return {
      newsDetail: {}
    }
  },
  components: {
    [Toast.name]: Toast,
    SubHeader
  },
  created () {
    getNewsDetail({id: this.$route.query.id}).then((res) => {
      if (res.data.success) {
        this.newsDetail = res.data.result
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
  padding: .5rem 0;
  line-height: .555556rem;
}
.details-content .date-item{
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
  justify-content: space-between;
  -webkit-justify-content: space-between;
  padding-bottom: .185185rem;
  border-bottom: 1px solid #dbdbdb;
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
