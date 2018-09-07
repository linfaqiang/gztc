<template>
    <div class="subject-page">
      <!--头部-->
      <sub-header title="题目列表"></sub-header>
      <!--内容-->
      <div class="subject-content">
        <h3>{{questionDetail.title}}</h3>
        <h6>{{questionDetail.remark}}</h6>
        <div class="tag-date">
          <div class="tag-item" v-if="questionDetail.status === 0">未发布</div>
          <div class="tag-item" v-if="questionDetail.status === 1">调查中</div>
          <div class="tag-item end" v-if="questionDetail.status === 2">完结</div>
          <div class="date-item">截止日期：<span>{{questionDetail.closeTime | formatDate}}</span></div>
        </div>
        <p class="total-item">题目数：{{questionTopics.length}}</p>
        <div class="subject-list">
          <dl>
            <dd v-for="(question, index) in questionTopics" :key="question.topics.id">
              <h4>
                {{index+1}}&nbsp;
                <span v-if="question.topics.topicType === 0">单选</span>
                <span v-if="question.topics.topicType === 1">多选</span>
                <span v-if="question.topics.topicType === 2">简答</span>
                &nbsp;{{question.topics.topicName}}
              </h4>
              <div class="textarea-item" v-if="question.topics.topicType === 2">
                <textarea placeholder="|请输入" v-model="question.topics.answer" disabled="disabled"></textarea>
              </div>
              <ul v-else>
                <li v-for="(option, index) in question.options" :key="index" :class="{active: option.isActive}">
                  {{option.optionNumber}}、{{option.optionValue}}
                  <input type="text" class="supplement-item" v-if="option.isSup === '1' && option.supplement !== ''"  v-model="option.supplement" disabled="disabled" />
                </li>
              </ul>
            </dd>
          </dl>
        </div>
      </div>
    </div>
</template>
<script>
import { Toast } from 'vant'
import { myQuestionTopics, myQuestionDetail } from '@/api/index'
import SubHeader from '@/components/common/SubHeader'
import { mapGetters } from 'vuex'
export default {
  name: 'NewsDetails',
  data () {
    return {
      qmid: 0,
      questionTopics: [],
      questionDetail: {},
      questionList: [],
      isSubmitTopics: false
    }
  },
  components: {
    [Toast.name]: Toast,
    SubHeader
  },
  created () {
    this.qmid = this.$route.query.id
    myQuestionDetail({pid: this.getUserInfo.selectParkId, qmid: this.qmid}).then((res) => {
      if (res.data.success) {
        this.questionDetail = res.data.result
      }
    }).catch((err) => {
      Toast.fail(err.message)
    })
    myQuestionTopics({pid: this.getUserInfo.selectParkId, qmid: this.qmid}).then((res) => {
      if (res.data.success) {
        this.questionTopics = res.data.result
        this.questionTopics.forEach((item) => {
          if (item.topics.topicType !== 2 && item.options) {
            if (item.topics.topicType === 0) { // 单选
              item.options.forEach((option) => {
                if (option.id === Number(item.record.topicOptionsId)) {
                  this.$set(option, 'isActive', true)
                  if (option.isSup === '1') {
                    this.$set(option, 'supplement', item.record.supContent)
                  } else {
                    this.$set(option, 'supplement', '')
                  }
                } else {
                  this.$set(option, 'isActive', false)
                }
              })
            }
            if (item.topics.topicType === 1) { // 多选
              item.options.forEach((option, index) => {
                if (String(option.id) === item.record.topicOptionsId.split(',')[index]) {
                  this.$set(option, 'isActive', true)
                } else {
                  this.$set(option, 'isActive', false)
                }
              })
            }
          } else {
            if (item.record.answerContent !== '') {
              this.$set(item.topics, 'answer', item.record.answerContent)
            }
          }
        })
      }
    }).catch((err) => {
      Toast.fail(err.message)
    })
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
  }
}
</script>
<style scoped>
img {
  max-width: 100%;
}
.subject-content{
  padding: 0 .277778rem 1.296296rem .277778rem;
  text-align: left;
}
.subject-content > h3{
  color: #000000;
  font-size: .407407rem;
  padding: .462963rem .444444rem .296296rem .444444rem;
  line-height: .592593rem;
}
.subject-content > h6{
  color: #919191;
  font-size: .277778rem;
  padding: 0 .444444rem;
  line-height: .462963rem;
}
.tag-date{
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
  align-items: center;
  -webkit-align-items: center;
  justify-content: space-between;
  -webkit-justify-content: space-between;
  padding: .37037rem .444444rem;
}
.tag-date .tag-item{
  display: inline-block;
  vertical-align: middle;
  padding: .027778rem .166667rem;
  text-align: center;
  border-radius: .037037rem;
  background-color: #fecd05;
}
.tag-date .end-item{
  color: #fff;
  background-color: #a1a1a1;
}
.total-item{
   padding: 0 .444444rem .407407rem .444444rem;
}
.subject-content .subject-list dl dd{
  font-size: .333333rem;
  padding: .296296rem .425926rem;
  margin-bottom: .259259rem;
  border: 1px solid #dedede;
  background-color: #fff;
}
.subject-content .subject-list dl dd li{
  padding: .185185rem 0;
}
.subject-content .subject-list dl dd li.active{
  color: #f6372c;
}
.subject-content .subject-list dl dd h4{
  line-height: .555556rem;
}
.subject-content .subject-list dl dd h4 span{
  display: inline-block;
  vertical-align: middle;
  width: .87963rem;
  height: .37037rem;
  line-height: .37037rem;
  color: #fecd05;
  font-size: .277778rem;
  text-align: center;
  border-radius: .037037rem;
  background-color: #373737;
}
.subject-content .subject-list dl dd .textarea-item{
  padding-top: .185185rem;
}
.subject-content .subject-list dl dd .textarea-item textarea{
  width: 100%;
  height: 3.037037rem;
  padding: .277778rem;
}
.footer-item{
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #dbdbdb;
  padding: .185185rem 1.018519rem;
  background-color: #fff;
  z-index: 999;
}
.footer-item > button{
  border: 0;
  outline: none;
  display: block;
  width: 100%;
  height: .916667rem;
  border-radius: .037037rem;
  background-color: #fdcc07;
}
.supplement-item{
  display: block;
  margin-left: .462963rem;
}
</style>
