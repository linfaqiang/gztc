<template>
    <div class="subject-page">
      <!--头部-->
      <sub-header title="问卷列表"></sub-header>
      <!--内容-->
      <div class="questionnaire-content">
        <van-list v-model="loading" :finished="finished" @load="onLoad" >
          <ul>
            <li v-for="question in questionList" :key="question.id">
              <router-link :to="{path:'SubjectList', query: {id: question.id}}">
                <h3>{{ question.title }}</h3>
                <div class="tag-date">
                  <div class="tag-item" v-if="question.status === 0">未发布</div>
                  <div class="tag-item" v-if="question.status === 1">调查中</div>
                  <div class="tag-item end" v-if="question.status === 2">完结</div>
                  <div class="date-item">截至日期：<span>{{question.closeTime | formatDate}}</span></div>
                </div>
                <div class="img-item">
                  <img :src="question.mobileCover " alt="">
                </div>
                <h6>{{question.remark}}</h6>
              </router-link>
            </li>
          </ul>
          <div v-if="isEmpty" class="empty-item">暂无问卷数据</div>
        </van-list>
      </div>
    </div>
</template>
<script>
import { List, Toast } from 'vant'
import { getQuestionList } from '@/api/index'
import SubHeader from '@/components/common/SubHeader'
import { mapGetters } from 'vuex'
export default {
  name: 'Questionnaire',
  data () {
    return {
      questionList: [],
      loading: false,
      finished: false,
      isEmpty: false,
      page: 0
    }
  },
  components: {
    [List.name]: List,
    [Toast.name]: Toast,
    SubHeader
  },
  filters: {
    formatDate (date) {
      return (date || '').split(' ')[0].toString()
    }
  },
  computed: {
    ...mapGetters(['getUserInfo'])
  },
  methods: {
    onLoad () {
      this.page++
      getQuestionList({
        page: this.page,
        pid: this.getUserInfo.selectParkId
      }).then((res) => {
        this.loading = false
        if (res.data.success) {
          if (res.data.result.length) {
            res.data.result.forEach((item) => {
              this.questionList.push(item)
            })
          } else {
            this.finished = true
            if (!this.questionList.length) {
              this.isEmpty = true
            } else {
              this.isEmpty = false
            }
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
img {
  max-width: 100%;
}
.questionnaire-content{
  padding: 0 .277778rem;
  text-align: left;
}
.questionnaire-content ul{
  padding-top: .537037rem;
}
.questionnaire-content ul li{
  padding: .277778rem .444444rem .407407rem .444444rem;
  margin-bottom: .259259rem;
  border: 1px solid #dddddd;
  background-color: #fff;
}
.questionnaire-content ul li a{
  display: block;
  color: #262626;
}
.questionnaire-content ul li h3{
  color: #000000;
  font-size: .407407rem;
  line-height: .592593rem;
}
.questionnaire-content ul li h6{
  color: #919191;
  font-size: .277778rem;
  line-height: .444444rem;
}
.questionnaire-content .img-item{
  padding-bottom: .185185rem;
}
.questionnaire-content .img-item img{
  display: block;
  width: 100%;
  max-height: 3.212963rem
}
.questionnaire-content .tag-date{
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
  align-items: center;
  -webkit-align-items: center;
  justify-content: space-between;
  -webkit-justify-content: space-between;
  padding: .222222rem 0;
}
.questionnaire-content .tag-date .tag-item{
  display: inline-block;
  vertical-align: middle;
  padding: .027778rem .166667rem;
  text-align: center;
  border-radius: .037037rem;
  background-color: #fecd05;
}
.questionnaire-content .tag-date .end-item{
  color: #fff;
  background-color: #a1a1a1;
}
.empty-item{
  padding: .185185rem 0;
  text-align: center;
}
</style>
