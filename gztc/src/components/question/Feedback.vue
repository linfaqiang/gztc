<template>
  <div class="feedback-page">
    <!--头部-->
    <sub-header title="意见反馈"></sub-header>
    <!--表单-->
    <div class="form-content">
      <form ref="form">
        <div class="tab-item">
          <button type="button" v-for="(bar, index) in navbar" :class="{active: bar.isActive}" :key="index" @click="tonggleOn(index)">{{bar.text}}</button>
        </div>
        <div class="control-item">
          <label>*标&nbsp;&nbsp;&nbsp;&nbsp;题 ：</label>
          <input type="text" v-model="feedbackTitle" placeholder="|请输入" maxlength="20" @input="limitValue()">
        </div>
        <div class="control-item">
          <div class="textarea-item">
            <label>*内&nbsp;&nbsp;&nbsp;&nbsp;容 ：</label>
            <textarea v-model="feedbackText" placeholder="|请输入" maxlength="200"></textarea>
            <span class="words-num">{{feedbackText.length}}/200</span>
          </div>
        </div>
        <div class="control-item">
          <label>添加图片：</label>
          <div class="file-item">
            <label for="fileImg">+选择添加</label>
            <input type="file" ref="fileImg" id="fileImg" accept="image/*" multiple="multiple" @change="changeFile">
          </div>
          <div class="showimg-list" v-if="fileImgs.length > 0">
            <div class="show-img" v-for="(fileImg, index) in fileImgs" :key="index">
              <img :src="fileImg" class="fileimg-item" alt="">
              <van-icon name="clear" @click="clearImg(index)"/>
            </div>
          </div>
        </div>
        <div class="btn-item">
         <button type="button" @click="submitSuggestOn">提&nbsp;&nbsp;交</button>
       </div>
      </form>
    </div>
    <!--历史列表-->
    <div class="history-list">
      <h3>历史记录</h3>
      <van-list v-model="loading" :finished="finished" @load="onLoad" >
        <ul>
          <li v-for="record in records" :key="record.id">
            <a href="javascript:;">
              <div class="title-item">
                <h4>
                  <strong v-if="record.type === 2">【建议】</strong>
                  <strong v-if="record.type === 1">【投诉】</strong>
                  {{record.title}}
                </h4>
                <button type="button" class="tag-item" v-if="record.status === 0">已提交</button>
                <button type="button" class="tag-item" v-if="record.status === 1">受理</button>
                <button type="button" class="tag-item end" v-if="record.status === 2">打回</button>
              </div>
              <div class="content-item">
                <p>{{record.content}}</p>
                <div class="img-list">
                  <div class="img-item" v-for="(image, index) in record.attachment" :key="index">
                    <img :src="image.url" alt="">
                  </div>
                </div>
              </div>
              <div class="date-item">{{record.createTime}}</div>
            </a>
          </li>
        </ul>
        <div v-if="isEmpty" class="empty-item">暂无记录</div>
      </van-list>
    </div>
    <div class="loading-spinner-item" v-show="showLoadding">
      <van-loading color="white" />
    </div>
  </div>
</template>
<script>
import { List, Toast, Icon, Loading } from 'vant'
import { getSuggestHistories, instance } from '@/api/index'
import SubHeader from '@/components/common/SubHeader'
import { mapGetters } from 'vuex'
import { checkFileExt } from '@/assets/utils'
export default {
  name: 'Feedback',
  data () {
    return {
      feedbackTitle: '',
      feedbackText: '',
      feedbackFile: [],
      records: [],
      loading: false,
      finished: false,
      isEmpty: false,
      showLoadding: false,
      pageNum: 0,
      pageType: 2,
      fileImgs: [],
      navbar: [
        {text: '建议', type: 2, isActive: true},
        {text: '投诉', type: 1, isActive: false}
      ]
    }
  },
  components: {
    [List.name]: List,
    [Toast.name]: Toast,
    [Icon.name]: Icon,
    [Loading.name]: Loading,
    SubHeader
  },
  inject: ['reload'],
  computed: {
    ...mapGetters(['getUserInfo'])
  },
  methods: {
    onLoad () {
      this.pageNum++
      getSuggestHistories({
        pid: this.getUserInfo.selectParkId,
        page: this.pageNum
      }).then((res) => {
        this.loading = false
        if (res.data.success) {
          if (res.data.result.length) {
            res.data.result.forEach((item) => {
              this.records.push(item)
            })
          } else {
            this.finished = true
            if (!this.records.length) {
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
    tonggleOn (index) {
      this.navbar.forEach((item) => {
        item.isActive = false
      })
      this.navbar[index].isActive = true
      this.pageType = this.navbar[index].type
    },
    changeFile (e) {
      let files = e.target.files
      console.log(e.target.files)
      for (let i = 0; i < files.length; i++) {
        if (this.feedbackFile.length >= 5) {
          Toast('最多只能添加五张图片')
          return false
        } else {
          this.feedbackFile.push(files[i])
          let fileExt = files[i].type.substring(files[i].type.lastIndexOf('/')).toLowerCase()
          let FR = new FileReader()
          FR.onload = (e) => {
            if (files[i].size > 5242880) {
              Toast('选择的图片不能大于5M！')
              return false
            } else if (!checkFileExt(fileExt)) {
              Toast('上传格式为gif、jpeg、jpg、png')
              return false
            } else {
              if (this.fileImgs.length < 5) {
                this.fileImgs.push(e.target.result)
              } else {
                Toast('最多只能添加五张图片')
                return false
              }
            }
          }
          FR.readAsDataURL(files[i])
        }
      }
    },
    clearImg (index) {
      this.fileImgs.splice(index, 1)
      this.feedbackFile.splice(index, 1)
    },
    emptyImg (img) {
      if (!img.match(/jpg|gif|png|jpeg/i)) {
        return false
      }
      return true
    },
    limitValue () {
      if (this.feedbackTitle.length >= 20) {
        Toast('请输入最多20个字符')
      }
    },
    submitSuggestOn () {
      let fileObj = this.feedbackFile
      let param = new FormData()
      param.append('pid', this.getUserInfo.selectParkId)
      param.append('type', this.pageType)
      if (this.fileImgs.length !== 0) {
        fileObj.forEach((item, index) => {
          param.append('file' + index, item)
        })
      }
      param.append('title', this.feedbackTitle)
      param.append('content', this.feedbackText)
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }

      if (this.feedbackTitle === '') {
        Toast('请输入标题')
      } else if (this.feedbackText === '') {
        Toast('请输入内容')
      } else {
        this.showLoadding = true
        instance.post('/api/question/submitSuggest', param, config).then((res) => {
          this.showLoadding = false
          if (res.data.success) {
            if (res.data.result === 0) {
              Toast.success('提交成功')
              this.reload()
            } else {
              Toast.fail('提交失败')
            }
          }
        }).catch((err) => {
          this.showLoadding = false
          Toast.fail(err.message)
        })
      }
    }
  }
}
</script>
<style scoped>
img {
  max-width: 100%;
}
.form-content{
  text-align: left;
  padding: 0 .277778rem;
  margin-bottom: .351852rem;
  background-color: #fff;
}
.tab-item{
  padding: .333333rem 0 .333333rem .388889rem;
}
.tab-item button{
  border: 0;
  outline: 0;
  width: 2.722222rem;
  height: .703704rem;
  margin-right: .240741rem;
  border-radius: .037037rem;
  border: 1px solid #cbcbcf;
  background-color: #f2f2f2;
}
.tab-item .active{
  border: .018519rem solid #262729;
  background-color: #fdcc07;
}
.control-item{
  text-align: left;
  padding-bottom: .259259rem;
}
.control-item > label{
  display: inline-block;
  vertical-align: top;
  width: 1.851852rem;
  line-height: .685185rem;
  text-align: right;
}
.control-item .textarea-item > label{
  display: inline-block;
  vertical-align: top;
  width: 1.851852rem;
  line-height: .685185rem;
  text-align: right;
}
.control-item input[type="text"]{
  width: 6.916667rem;
  height: .685185rem;
  padding-left: .222222rem;
  border: 1px solid #cbcbcf;
  border-radius: .055556rem;
}
.control-item textarea{
  width: 6.916667rem;
  height: 3rem;
  padding: .222222rem;
  border: 1px solid #cbcbcf;
  border-radius: .055556rem;
}
.textarea-item{
  position: relative;
}
.textarea-item .words-num{
  position: absolute;
  right: .740741rem;
  bottom: .185185rem;
  color: #929292;
}
.file-item{
  position: relative;
  display: inline-block;
  width: 2.703704rem;
  height: .685185rem;
}
.file-item > label{
  position: absolute;
  left: 0;
  top: 0;
  display: block;
  width: 100%;
  height: 100%;
  line-height: .685185rem;
  color: #4e4e4e;
  font-size: .333333rem;
  text-align: center;
  border-radius: .037037rem;
  border: 1px solid #cbcbcf;
  background-color: #f2f2f2;
}
.file-item > input[type="file"]{
  width: 100%;
  height: 100%;
  visibility: hidden;
}
.btn-item{
  padding: .324074rem .537037rem .62963rem .537037rem;
}
.btn-item button{
  border: 0;
  outline: none;
  width: 100%;
  height: .740741rem;
  border-radius: .092593rem;
  color: #1a1a1a;
  font-size: .37037rem;
  background-color: #fdcc07;
}
.history-list{
  text-align: left;
  background-color: #fff;
}
.history-list > h3{
  color: #4e4e4e;
  font-size: .37037rem;
  text-indent: .37037rem;
  line-height: 1.111111rem;
  border-bottom: 1px solid #cbcbcf;
}
.history-list ul {
  padding: 0 .277778rem;
}
.history-list li{
  padding: .462963rem .259259rem 0 .259259rem;
  border-bottom: .018519rem solid #dbdbdb;
}
.history-list li:last-child{
  border: 0;
}
.history-list li .title-item{
  position: relative;
  padding-right: 1.574074rem;
}
.history-list li .title-item h4{
  color: #4e4e4e;
  font-size: .333333rem;
  line-height: .555556rem;
}
.history-list li .title-item h4 strong{
  color: #f6372c;
  font-weight: normal;
}
.history-list li .title-item .tag-item{
  border: 0;
  outline: none;
  position: absolute;
  right: 0;
  top: .185185rem;
  padding: .027778rem .138889rem;
  font-size: .277778rem;
  border-radius: .037037rem;
  background-color: #fdcc07;
}
.history-list li .content-item > p{
  color: #919191;
  font-size: .314815rem;
  line-height: .444444rem;
}
.history-list li .content-item .img-list{
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
}
.history-list li .content-item .img-item{
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
  padding-top: .259259rem;
}
.history-list li .content-item .img-item img{
  display: block;
  width: 1.388889rem;
  height: 1.388889rem;
  margin-right: .259259rem;
}
.date-item{
  color: #919191;
  font-size: .277778rem;
  padding: .259259rem 0;
}
.showimg-list{
  display: block;
  padding-left: 1.851852rem;
  padding-top: .185185rem;
}
.show-img{
  position: relative;
  display: inline-block;
  vertical-align: middle;
  margin-right: .277778rem;
}
.show-img .van-icon-clear{
  position: absolute;
  right: -.092593rem;
  top: -.092593rem;
  font-size: .37037rem;
}
.fileimg-item{
  vertical-align: middle;
  width: .925926rem;
  height: .925926rem;
}
.undata-item{
  padding: .185185rem 0;
  text-align: center;
}
.empty-item{
  padding: .185185rem 0;
  text-align: center;
}
.loading-spinner-item{
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1000;
}
.loading-spinner-item .van-loading{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
}
</style>
