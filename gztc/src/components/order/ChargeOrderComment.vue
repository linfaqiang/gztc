<template>
  <div class="coc-box-container">
    <!--头部-->
    <sub-header title="评价"></sub-header>
    <!--内容-->
    <div class="coc-content">
      <div class="coc-content-item">
        <label>评分：</label>
        <span :class="item.class" v-for="(item, index) in sorceClass" :key="index" @click="setSorce(index)"></span>
      </div>
      <div class="coc-content-item">
        <label>评论：</label>
        <textarea class="coc-content-item-areatext" v-model="remark" placeholder="请输入" maxlength="200"></textarea>
        <span class="coc-words-num">{{remark.length}}/200</span>
      </div>
    </div>
    <div class="sp-submit-box">
      <div :class="btnNextEnable" @click="submitSorce">提&nbsp;&nbsp;交</div>
    </div>
  </div>
</template>
<script>
import SubHeader from '@/components/common/SubHeader'
import { Toast } from 'vant'
export default {
  data () {
    return {
      sorceClass: [],
      score: 0,
      remark: '',
      id: '',
      userInfo: {}
    }
  },
  components: {
    SubHeader,
    [Toast.name]: Toast
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.userInfo = this.$store.getters.getUserInfo
      this.id = this.$route.query.id
      this.initSorce()
    },
    setSorce (index) {
      this.score = index + 1
      for (var i = 0; i < this.sorceClass.length; i++) {
        if (i <= index) {
          this.sorceClass[i].class['coc-c-i-sorce-active'] = true
        } else {
          this.sorceClass[i].class['coc-c-i-sorce-active'] = false
        }
      }
    },
    // 提交评价 POST /api/service/evaluate
    submitSorce () {
      var that = this
      var queryData = {
        'pid': that.userInfo.selectParkId,
        'orderId': that.id,
        'score': that.score,
        'remark': that.remark
      }
      that.$http.post('/api/service/evaluate', queryData).then(function (res) {
        if (res.data.success) {
          if (res.data.result === '0' || res.data.result === 0) {
            that.$router.push({
              name: 'ChargeOrderDetail',
              query: {
                id: that.id
              }
            })
          } else {
            Toast.fail('评价失败')
          }
        } else {
          Toast.fail(res.date.message)
        }
      })
    },
    initSorce () {
      for (var i = 0; i < 5; i++) {
        var obj = {}
        obj.class = {
          'coc-c-i-sorce': true,
          'coc-c-i-sorce-active': false
        }
        this.sorceClass.push(obj)
      }
    }
  }
}
</script>
<style>
.coc-box-container {
  width: 100%;
  height: 100%;
  background: #f9f9f9;
}
.coc-content {
  width: 100%;
  background: #fff;
  padding: 0.648148rem 0.555556rem 1.296296rem 0.555556rem;
}
.coc-content-item {
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
  padding: .185185rem 0;
  margin-bottom: 0.555556rem;
  position: relative;
}
.coc-c-i-sorce {
  width: .555556rem;
  height: .518519rem;
  margin: 0 .185185rem;
  background-image: url(../../../static/img/enterprise/icon.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
}
.coc-c-i-sorce-active{
  background-image: url(../../../static/img/enterprise/icon-selected.png);
}
.coc-content-item-areatext {
  flex: 1;
  border: 1px solid #dbdbdb;
  outline: none;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  display: block;
  height: 2.262963rem;
  padding: 0.074074rem;
  margin-left: 0.074074rem;
  background-color: transparent;
}
.coc-words-num {
  position: absolute;
  bottom: 0.222222rem;
  right: 6px;
  color: #ccc;
}
.sp-submit-box {
  width: 80%;
  height: 0.925926rem;
  margin: 0 auto;
  line-height: 0.925926rem;
  text-align: center;
  font-size: 0.37037rem;
  background: #fdcc07;
  margin-top: 2.777778rem;
     -moz-border-radius: 0.074074rem;
       -o-border-radius: 0.074074rem;
  -webkit-border-radius: 0.074074rem;
          border-radius: 0.074074rem;
}
.disable-btn {
  font-size: 0.37037rem;
  float: right;
     -moz-border-radius: 0.074074rem;
       -o-border-radius: 0.074074rem;
  -webkit-border-radius: 0.074074rem;
          border-radius: 0.074074rem;
  background: #ccc;
  color: #fff;
}
.sp-submit-btn-disable {
  background: #ccc;
  color: #fff;
}
</style>
