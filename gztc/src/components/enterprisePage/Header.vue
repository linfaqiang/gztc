<template>
  <div class="sub-header">
    <div class="header-container">
      <b class="back-icon" @click="back()">
        <van-icon name="arrow-left" />
      </b> {{title}}
      <strong class="right-icon"></strong>
    </div>
    <div class="header-bg"></div>
  </div>
</template>
<script>
import { Icon } from 'vant'
export default {
  data () {
    return {
    }
  },
  props: {
    title: String
  },
  components: {
    [Icon.name]: Icon
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    home () {
      this.$router.push('/Index')
    }
  }
}
</script>
<style>
.sub-header .header-bg{
  width: 100%;
  height: 1.157407rem;
}
.sub-header .header-container {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  color: #fff;
  font-size: .407407rem;
  height: 1.157407rem;
  line-height: 1.157407rem;
  background-color: #262729;
  z-index: 999;
}

.header-container .back-icon {
  position: absolute;
  left: 0;
  top: 0;
  width: 1.037037rem;
  height: 100%;
  text-align: center;
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
  align-items: center;
  -webkit-box-align: center;
  -webkit-align-items: center;
  justify-content: center;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
}

.header-container .right-icon {
  position: absolute;
  right: 0;
  top: 0;
  padding-right: .277778rem;
  height: 100%;
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
  align-items: center;
  -webkit-box-align: center;
  -webkit-align-items: center;
  justify-content: center;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
}

.header-container .home-icon {
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
  align-items: center;
  -webkit-box-align: center;
  -webkit-align-items: center;
  justify-content: center;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  width: 1.425926rem;
  height: 100%;
  color: #fdcc06;
  font-size: .555556rem;
}

.header-container .chat-icon {
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
  align-items: center;
  -webkit-box-align: center;
  -webkit-align-items: center;
  justify-content: center;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  width: .907407rem;
  height: 100%;
  color: #fdcc06;
  font-size: .555556rem;
}
.header-container .chat-infomation .van-icon-chat::after{
  content: "";
  position: absolute;
  top: -2px;
  right: -3px;
  width: 8px;
  height: 8px;
  border: 1px solid #fff;
  border-radius: 100%;
  background-color: #f44;
}
</style>
