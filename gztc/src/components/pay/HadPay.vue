<template>
  <div class="pay-select">
    <!--新闻列表-->
    <div class="hp-pay-box">
      <div class="hp-p-success">支付成功！</div>
      <div class="hp-p-complement-btn" @click="complementPay">完&nbsp;&nbsp;&nbsp;成</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ParkSelect',
  data () {
    return {
      id: ''
    }
  },
  created () {
    this.redirectUrl = this.$route.query.redirectUrl
    this.id = this.$route.query.id
  },
  methods: {
    // 在线支付 POST /h5/pay/pay.html
    complementPay () {
      this.$router.push({
        name: this.redirectUrl,
        query: {
          id: this.id
        }
      })
    }
  }
}
</script>
<style>
</style>
