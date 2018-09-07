<template>
  <div class="park-select">
  </div>
</template>
<script>
import { Toast } from 'vant'
import { SetCookie } from '@/sys.util'
export default {
  name: 'ParkSelect',
  components: {
    [Toast.name]: Toast
  },
  data () {
    return {
      userInfo: {}
    }
  },
  created () {
    this.userInfo = this.$store.getters.getUserInfo
    this.login()
  },
  methods: {
    login () {
      var that = this
      this.$http.post('/api/sso/authorize').then(function (res) {
        if (res.data.success) {
          that.userInfo.selectParkId = ''
          that.userInfo.selectParkName = ''
          that.$store.dispatch('commitUserInfo', that.userInfo)
          SetCookie('selectParkId', that.userInfo.selectParkId)
          SetCookie('selectParkName', that.userInfo.selectParkName)
          window.location = res.data.result
        } else {
          this.$router.push({
            name: 'Index'
          })
        }
      }).catch(function (err) {
        console.log(err.message)
        that.$router.push({
          name: 'Index'
        })
      })
    }
  }
}
</script>
<style>
</style>
