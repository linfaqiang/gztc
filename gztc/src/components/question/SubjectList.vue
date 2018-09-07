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
          <div class="date-item">截至日期：<span>{{questionDetail.closeTime | formatDate}}</span></div>
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
                <textarea placeholder="|请输入" v-model="question.topics.answer" @blur="answerOn(question)" maxlength="500"></textarea>
                <span class="words-num">{{question.topics.answer.length}}/500</span>
              </div>
              <ul v-else>
                <li v-for="(option, index) in question.options" :key="index" :class="{active: option.isActive}" @click="singleOn(question, index)">
                  {{option.optionNumber}}、{{option.optionValue}}
                  <input type="text" class="supplement-item" v-model="option.supplement" v-if="option.isSup === '1'" placeholder="请输入" />
                </li>
              </ul>
            </dd>
          </dl>
        </div>
      </div>
      <div class="footer-item" v-if="questionTopics.length !== 0">
        <button type="button" @click="submitQuestion()">确&nbsp;&nbsp;认</button>
      </div>
      <!--提交加载Loading-->
      <div class="loading-spinner-item" v-show="showLoadding">
        <van-loading color="white" />
      </div>
    </div>
</template>
<script>
import { Toast, Loading } from 'vant'
import { getQuestionTopics, getQuestionDetail, submitTopics } from '@/api/index'
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
      isSubmitTopics: false,
      showLoadding: false
    }
  },
  components: {
    [Toast.name]: Toast,
    [Loading.name]: Loading,
    SubHeader
  },
  created () {
    this.qmid = this.$route.query.id
    getQuestionTopics({pid: this.getUserInfo.selectParkId, qmid: this.qmid}).then((res) => {
      if (res.data.success) {
        res.data.result.forEach((item) => {
          this.questionTopics.push(item)
          this.questionList.push({
            topicsId: '0',
            optionsId: '',
            supContent: '0',
            answerContent: ''
          })
        })
        this.questionTopics.forEach((item) => {
          this.$set(item, 'isSelected', false)
          if (item.topics.topicType !== 2 && item.options) {
            item.options.forEach((option) => {
              this.$set(option, 'isActive', false)
              if (option.isSup === '1') {
                this.$set(option, 'supplement', '')
              }
            })
          } else {
            this.$set(item.topics, 'answer', '')
          }
        })
      }
    }).catch((err) => {
      Toast.fail(err.message)
    })
    getQuestionDetail({pid: this.getUserInfo.selectParkId, qmid: this.qmid}).then((res) => {
      if (res.data.success) {
        this.questionDetail = res.data.result
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
    singleOn (question, index) {
      if (question.topics.topicType === 0) {
        question.options.forEach((item) => {
          item.isActive = false
        })
      }
      if (question.options[index].isActive) {
        question.options[index].isActive = false
        question.isSelected = false
      } else {
        question.options[index].isActive = true
        question.isSelected = true
      }
    },
    answerOn (question) {
      if (question.topics.answer !== '') {
        question.isSelected = true
      } else {
        question.isSelected = false
      }
    },
    submitQuestion () {
      this.questionTopics.forEach((item, index) => {
        this.questionList[index].topicsId = String(item.topics.id)
        if (item.topics.topicType !== 2 && item.options) { // 单选、多选
          if (item.topics.topicType === 0) {
            item.options.forEach((option) => {
              if (option.isActive) {
                if (option.isSup === '1') {
                  this.questionList[index].supContent = option.supplement
                }
                this.questionList[index].optionsId = String(option.id)
              }
            })
          }
          if (item.topics.topicType === 1) {
            item.options.forEach((option) => {
              if (option.isActive) {
                this.questionList[index].optionsId += option.id + ','
              }
            })
          }
        } else { // 简答
          this.questionList[index].answerContent = item.topics.answer
        }
      })
      let selectedAll = this.questionTopics.every((item, index) => {
        return item.isSelected
      })
      if (selectedAll) {
        this.showLoadding = true
        submitTopics({
          pid: this.getUserInfo.selectParkId,
          qmid: this.qmid,
          topics: JSON.stringify(this.questionList)
        }).then((res) => {
          this.showLoadding = false
          if (res.data.result === 0) {
            Toast.success('提交成功')
            this.$router.go(-1)
          } else if (res.data.result === 1) {
            Toast.fail('此问卷已回答')
          } else {
            Toast.fail('问卷不存在，请重试')
          }
        }).catch((err) => {
          Toast.fail(err.message)
        })
      } else {
        Toast('您还没答完所有题目')
      }
    }
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
  position: relative;
  padding-top: .185185rem;
}
.subject-content .subject-list dl dd .textarea-item textarea{
  width: 100%;
  height: 3.037037rem;
  padding: .277778rem;
}
.subject-content .subject-list dl dd .textarea-item .words-num{
  position: absolute;
  right: 0;
  bottom: .185185rem;
  color: #929292;
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
