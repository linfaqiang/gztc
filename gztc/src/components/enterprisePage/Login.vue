<template>
  <div class="enterprise-login"></div>
</template>
<script>
import { Toast } from 'vant'
export default {
  data () {
    return {}
  },
  methods: {
    enterpriseLogin () {
      this.$http.post('/api/qysso/authorizeWork').then((res) => {
        if (res.data.success) {
          window.location.href = res.data.result
        }
      }).catch((err) => {
        Toast.fail(err.message)
      })
    }
  },
  created () {
    this.enterpriseLogin()
  }
}
</script>
<style>
.enterprise-login{
  visibility: hidden;
}
</style>
