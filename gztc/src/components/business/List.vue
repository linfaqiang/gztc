<template>
  <div class="new-list-page">
    <!--头部-->
    <sub-header title="企业列表"></sub-header>
    <!--新闻列表-->
    <div class="new-list">
      <van-list v-model="loading" :finished="finished" @load="onLoad()">
        <ul>
          <li v-for="enterprise in enterpriseList" :key="enterprise.id">
              <router-link :to="{path: 'BusinessDetails', query: {id: enterprise.id, type: 0}}">
                <div class="img-container">
                  <img :src="enterprise.logo">
                </div>
                <div class="text-container">
                  <p>{{enterprise.fullName}}</p>
                  <button class="notice-item">{{enterprise.enterpriseLabel}}</button>
                  <div class="time-con">{{enterprise.createTime}}</div>
                </div>
              </router-link>
          </li>
        </ul>
        <div v-if="isEmpty" class="empty-item">暂无数据</div>
      </van-list>
    </div>
  </div>
</template>
<script>
import { List, Toast } from 'vant'
import { enterpriseList } from '@/api/index'
import SubHeader from '@/components/common/SubHeader'
import { mapGetters } from 'vuex'
export default {
  components: {
    [List.name]: List,
    [Toast.name]: Toast,
    SubHeader
  },
  data () {
    return {
      enterpriseList: [],
      loading: false,
      finished: false,
      isEmpty: false,
      pageNum: 0
    }
  },
  computed: {
    ...mapGetters(['getUserInfo'])
  },
  methods: {
    onLoad () {
      this.pageNum++
      enterpriseList({
        parkId: this.getUserInfo.selectParkId,
        type: 1,
        pageNum: this.pageNum,
        pageSize: 6
      }).then((res) => {
        this.loading = false
        if (res.data.success) {
          if (res.data.result.length) {
            res.data.result.forEach((item) => {
              this.enterpriseList.push(item)
            })
          } else {
            this.finished = true
            if (!this.enterpriseList.length) {
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
.new-list-page .new-list{
  padding: 0 .648148rem;
  background-color: #fff;
}
.new-list-page .new-list li{
  position: relative;
  padding: .416667rem 0;
  border-bottom: 1px solid #dbdbdb;
}
.new-list-page .new-list li:last-child{
  border: 0;
}
.new-list-page .new-list li a{
  display: -webkit-box;
  display: flex;
  display: -webkit-flex;
  justify-content: flex-start;
  -webkit-justify-content: flex-start;
}
.new-list-page .new-list .img-container{
  width: 2.157407rem;
  height: 2.157407rem;
  margin-right: .537037rem;
  overflow: hidden;
  display: -webkit-box;
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  -webkit-justify-content: center;
  align-items: center;
  -webkit-align-items: center;
}
.new-list-page .new-list .img-container img{
  display: block;
  width: 100%;
  height: 100%;
}
.new-list-page .new-list .text-container{
  position: relative;
  width: 5.685185rem;
  text-align: left;
}
.new-list-page .new-list .text-container p{
  color: #3b3b3b;
  font-size: .407407rem;
  line-height: .555556rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.new-list-page .new-list .text-container .time-con{
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  color: #636363;
  font-size: .277778rem;
  line-height: .444444rem;
}
.new-list-page .new-list .text-container .notice-item{
  border: 0;
  outline: none;
  color: #1a1a1a;
  padding: .027778rem .138889rem;
  font-size: .259259rem;
  margin-top: .138889rem;
  border-radius: .037037rem;
  text-align: center;
  background-color: #fecd05;
}
.empty-item{
  padding: .185185rem 0;
  text-align: center;
}
</style>
