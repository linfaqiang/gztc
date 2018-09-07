<template>
  <div class="set-enterprise">
    <!--头部-->
    <sub-header title="绑定企业信息"></sub-header>
    <div class="set-phone-input">
     <div class="set-phone-new">
        <input type="text" name="" v-model="enterprise" placeholder="输入企业名称" @input="enterpriseInput">
      </div>
      <div class="se-tip">提示：请输入所在企业全称</div>
    </div>
    <div :class="btnComplementEnable">
      <div :class="btnComplementEnable" @click="submitRegisterInfo">完&nbsp;&nbsp;成</div>
    </div>
    <!--提交加载Loading-->
    <div class="loading-spinner-item" v-show="showLoadding">
      <van-loading color="white" />
    </div>
  </div>
</template>
<script>
import SubHeader from '@/components/common/SubHeader'
import { Toast, Loading } from 'vant'
import { SetCookie } from '@/sys.util'
export default {
  name: 'RedirectPage',
  components: {
    SubHeader,
    [Toast.name]: Toast,
    [Loading.name]: Loading
  },
  data () {
    return {
      enterprise: '',
      showLoadding: false,
      btnComplementEnable: {
        'sp-submit-box': true,
        'sp-submit-btn-disable': true
      },
      userInfo: {}
    }
  },
  created () {
    this.userInfo = this.$store.getters.getUserInfo
    if (this.userInfo.isLogin === 'true' || this.userInfo.isLogin === true) {
      this.$router.push('Index')
    }
  },
  methods: {
    // 判断是否为空
    isEmpty (str) {
      return str.trim().length === 0
    },
    // 企业输入事件
    enterpriseInput () {
      if (this.isEmpty(this.enterprise)) {
        this.btnComplementEnable['sp-submit-btn-disable'] = true
      } else {
        this.btnComplementEnable['sp-submit-btn-disable'] = false
      }
    },
    // 保存数据信息 (暂时存放在cookie中)
    saveUserIfo (userInfo) {
      SetCookie('isLogin', userInfo.isLogin)
      SetCookie('parkId', userInfo.parkId)
      SetCookie('parkName', userInfo.parkName)
      SetCookie('enterpriseId', userInfo.enterpriseId)
      SetCookie('enterpriseName', userInfo.enterpriseName)
      SetCookie('mobile', userInfo.mobile)
      SetCookie('nickname', userInfo.nickname)
      SetCookie('memberLogo', userInfo.memberLogo)
      SetCookie('selectParkId', userInfo.selectParkId)
      SetCookie('selectParkName', userInfo.selectParkName)
    },
    // 设置企业 POST /api/member/saveMemberEnterprise
    submitRegisterInfo () {
      var that = this
      var userInfo = that.$store.getters.getUserInfo
      var params = {
        pid: this.$route.query.parkId,
        mobile: this.$route.query.phone,
        name: this.enterprise,
        code: this.$route.query.code
      }
      if (this.btnComplementEnable['sp-submit-btn-disable']) {
        Toast('请输入企业名称')
        return
      }
      if (userInfo.isLogin) {
        that.$router.push('Index')
        return
      }
      that.showLoadding = true
      this.$http.post('/api/member/saveMemberEnterprise', params).then(function (res) {
        that.showLoadding = false
        if (res.data.data === 0) {
          userInfo.isLogin = true
          userInfo.parkId = params.parkId
          userInfo.parkName = params.parkName
          userInfo.phone = params.mobile
          userInfo.enterprise = params.name
          userInfo.phone = params.mobile
          userInfo.selectParkId = params.parkId
          userInfo.selectParkId = params.parkName

          // that.saveUserIfo(userInfo)
          // that.$store.dispatch('commitUserInfo', userInfo)
          that.$router.push('Index')
        } else if (res.data.data === 1) {
          Toast('注册失败')
        } else if (res.data.data === 2) {
          Toast('企业名不能为空')
        } else if (res.data.data === 2) {
          Toast('必填不能为空')
        }
      })
    }
  }
}
</script>
<style scoped>
.set-enterprise {
  position: fixed;
  background: #fff;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.se-tip {
  font-size: 0.37037rem;
  color: #929292;
  width: 90%;
  margin: 0 auto;
  line-height: 2;
  text-align: left;
}
.set-phone-input {
  background: #fff;
  padding-top: 0.555556rem;
}
.set-phone-new {
  width: 90%;
  height: 1.388889rem;
  line-height: 1rem;
  margin: 0 auto;
  margin-top: 0.555556rem;
  text-align: center;
  padding: 0 0.37037rem;
  border-bottom: 1px solid #2d2d2d;
}
.set-phone-new > input {
  width: 100%;
  border: none;
  text-align: center;
  float: left;
  padding-top: 0.333333rem;
  font-size: 0.37037rem;
}
.sp-submit-box {
  width: 100%;
  background: #f9f9f9;
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
.sp-submit-btn-disable {
  background: #ccc;
  color: #fff;
}
</style>
