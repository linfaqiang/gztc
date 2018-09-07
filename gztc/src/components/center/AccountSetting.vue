<template>
  <div class="set-phone">
    <!--头部-->
    <sub-header title="账户设置"></sub-header>
    <div class="as-c-mobile">当前手机号码：{{userInfo.mobile}}</div>
    <div class="set-phone-input">
     <div class="set-phone-new">
        <input type="text" name="" v-model="voucher.mobile" placeholder="输入新手机号码" maxlength="11" @input="phoneInput">
      </div>
      <div class="set-phone-code">
        <input type="text" name="" v-model="voucher.code" placeholder="输入验证码" @input="codeInput" maxlength="6">
        <div :class="btnIsEnable" @click="getCode">
          <span v-if="!timeshow">获取验证码</span>
          <span v-if="timeshow">{{timeCount}}s</span>
        </div>
      </div>
    </div>
    <div class="sp-submit-box">
      <div :class="btnNextEnable" @click="submitVoucher">确&nbsp;&nbsp;认</div>
    </div>
  </div>
</template>
<script>
import SubHeader from '@/components/common/SubHeader'
import { Toast } from 'vant'
import { SetCookie, GetCookie } from '@/sys.util'
export default {
  name: 'RedirectPage',
  components: {
    SubHeader,
    [Toast.name]: Toast
  },
  data () {
    return {
      voucher: {
        mobile: '',
        code: ''
      },
      userInfo: {},
      timeCount: 60,
      timeshow: false,
      btnIsEnable: {
        'sp-get-code': true,
        'disable-btn': true
      },
      btnNextEnable: {
        'sp-submit-btn': true,
        'sp-submit-btn-disable': true
      },
      TIME_COUNT_CONTANT: 60
    }
  },
  created () {
    this.init()
  },
  methods: {

    // 初始化
    init () {
      this.userInfo = this.$store.getters.getUserInfo
      var that = this
      var lastTime = parseInt(GetCookie('codeTiem'))
      var currentTime = new Date().getTime()
      var timeCountTemp = this.TIME_COUNT_CONTANT - parseInt((currentTime - lastTime) / 1000)
      this.timeCount = timeCountTemp > 0 ? timeCountTemp : this.TIME_COUNT_CONTANT
      if (timeCountTemp > 0) {
        var timer = null
        that.timeshow = true
        that.btnIsEnable['disable-btn'] = true
        timer = setInterval(function () {
          that.timeCount--
          if (that.timeCount === 0) {
            clearInterval(timer)
            that.timeCount = that.TIME_COUNT_CONTANT
            that.timeshow = false
            if (that.isPhone(this.voucher.mobile)) {
              that.btnIsEnable['disable-btn'] = false
            }
          }
        }, 1000)
      }
    },
    // 手机号码校验
    isPhone (mobile) {
      var phoneReg = /^[1][3,5,7,8][0-9]{9}$/
      return phoneReg.test(mobile)
    },
    // 验证码校验
    isCode (code) {
      var codeReg = /^[0-9]{6}$/
      return codeReg.test(code)
    },
    // 判断是否为空
    isEmpty (str) {
      return str.trim().length === 0
    },
    // 验证码输入事件
    codeInput () {
      if (this.isCode(this.voucher.code) && this.isPhone(this.voucher.mobile)) {
        this.btnNextEnable['sp-submit-btn-disable'] = false
      } else {
        this.btnNextEnable['sp-submit-btn-disable'] = true
      }
    },
    // 手机号码输入事件
    phoneInput () {
      this.codeInput()
      if (this.isPhone(this.voucher.mobile) && this.timeCount === this.TIME_COUNT_CONTANT) {
        this.btnIsEnable['disable-btn'] = false
      } else {
        this.btnIsEnable['disable-btn'] = true
      }
    },
    /**
     * 获取验证码 POST /api/sso/sendMobileCodeVer
     */
    getCode () {
      var that = this
      if (that.timeCount > 0 && that.timeCount !== 60) {
        Toast('验证码已发送，请过' + that.timeCount + '秒再次获取')
        return
      }
      if (this.btnIsEnable['disable-btn']) {
        return
      }
      var params = {
        'mobile': that.voucher.mobile
      }
      var getCodeTime = new Date().getTime()
      var timer = null
      SetCookie('codeTiem', getCodeTime)
      that.timeshow = true
      that.btnIsEnable['disable-btn'] = true
      timer = setInterval(function () {
        that.timeCount--
        if (that.timeCount === 0) {
          clearInterval(timer)
          that.timeCount = that.TIME_COUNT_CONTANT
          that.timeshow = false
          that.btnIsEnable['disable-btn'] = false
        }
      }, 1000)
      that.$http.post('/api/sso/sendMobileCode', params).then(function (res) {
        if (res.data.success && res.data.result === '0') {
          Toast('短信验证码发送成功')
        } else if (res.data.success && res.data.result === '1') {
          Toast(res.data.message)
        } else if (res.data.success && res.data.result === '2') {
          Toast(res.data.message)
        } else {
          Toast.fail(res.data.message)
          clearInterval(timer)
          that.timeCount = that.TIME_COUNT_CONTANT
          that.timeshow = false
          that.btnIsEnable['disable-btn'] = false
        }
      })
    },
    /**
     * 提交数据 POST /api/personal/updateMemPhone
     */
    submitVoucher () {
      var that = this
      if (that.btnNextEnable['sp-submit-btn-disable']) {
        return
      }
      that.$http.post('/api/personal/updateMemPhone', that.voucher).then(function (res) {
        if (res.data.success) {
          if (res.data.result === '0') {
            Toast.success('修改成功')
            SetCookie('mobile', that.voucher.mobile)
            that.userInfo.mobile = that.voucher.mobile
            that.$store.dispatch('commitUserInfo', that.userInfo)
            that.$router.push({
              name: 'PersonCenter'
            })
          } else {
            Toast.fail('验证码不正确')
          }
        } else {
          Toast.fail('验证码不正确')
        }
      })
    }
  }
}
</script>
<style scoped>
.set-phone {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #fff;
}
.set-phone-input {
  background: #fff;
  padding-top: 0.555556rem;
}
.set-phone-current {
  width: 90%;
  height: 1rem;
  line-height: 1rem;
  margin: 0 auto;
  background: #f9f9f9;
  text-align: left;
  padding: 0 0.37037rem;
  font-size: 0.37037rem;
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
  border: none;
  margin-left: 2.592593rem;
  text-align: left;
  float: left;
  padding-top: 0.333333rem;
  font-size: 0.37037rem;
}
.set-phone-code {
  width: 90%;
  height: 1.388889rem;
  line-height: 1rem;
  margin: 0 auto;
  margin-top: 0.555556rem;
  text-align: center;
  padding: 0 0.37037rem;
}
.set-phone-code > input {
  width: 50%;
  float: left;
  font-size: 0.37037rem;
  text-align: center;
  border: none;
}
.sp-get-code {
  width: 3.148148rem;
  height: 0.833333rem;
  background: #fdcc07;
  font-size: 0.37037rem;
  float: right;
     -moz-border-radius: 0.074074rem;
       -o-border-radius: 0.074074rem;
  -webkit-border-radius: 0.074074rem;
          border-radius: 0.074074rem;
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
.as-c-mobile {
  width: 8.555556rem;
  margin: 0 auto;
  font-size: 0.37037rem;
  line-height: 1.2;
  padding: 0.37037rem;
  color: #2d2d2d;
  text-align: left;
  background: #f9f9f9;
  margin-top: 0.740741rem;
}
</style>
