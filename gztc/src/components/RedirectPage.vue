<template>
  <div class="redirect-page">
  </div>
</template>
<script>
import SubHeader from '@/components/common/SubHeader'
import { Encrypt } from '@/cryptojs.util'
import { SetCookie } from '@/sys.util'
import { Toast } from 'vant'
export default {
  name: 'RedirectPage',
  components: {
    SubHeader,
    [Toast.name]: Toast
  },
  data () {
    return {
      voucher: {}
    }
  },
  created () {
    this.voucher.code = this.$route.query.code
    this.voucher.state = this.$route.query.state
    this.getRedirectVoucher()
  },
  methods: {
    /**
     * 获取用户信息
     */
    getRedirectVoucher () {
      var that = this
      this.$http.post('/api/sso', that.voucher).then(function (res) {
        if (res.data.success) {
          var primaryToken = res.data.result.uid + '_' + res.data.result.token
          var token = Encrypt(primaryToken)
          // var EXPIRES_DAYS = 3
          SetCookie('token', token)
          if (res.data.result.state === 1) {
            that.$router.push('VerificationPhone')
          } else if (res.data.result.state === 0) {
            var userInfo = that.$store.getters.getUserInfo
            userInfo.isLogin = true
            that.$store.dispatch('commitUserInfo', userInfo)
            that.$router.push('Index')
          } else if (res.data.result.state === -1) {
            Toast.fail('授权失败，请联系微信客服')
            that.$router.push('Index')
          }
        } else {
          that.$router.push('Index')
        }
      })
    }
  }
}
</script>
<style>
</style>
