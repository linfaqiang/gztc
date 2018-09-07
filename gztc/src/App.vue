<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>
<script>
import { GetCookie } from '@/sys.util'
import { requireConfig, messageCount } from '@/api/index'
export default {
  name: 'App',
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isRouterAlive: true,
      msgCount: 0
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    },
    /**
     * 获取消息数量
     */
    getMessageCount () {
      for (let i = 0; i < 6; i++) {
        messageCount({type: i}).then((res) => {
          if (res.data.success) {
            this.msgCount += res.data.result
            this.$store.dispatch('commitMessageCount', this.msgCount)
          }
        }).catch((err) => {
          console.log(err.message)
        })
      }
    }
  },
  created () {
    var userInfo = {
      id: GetCookie('id'),
      isLogin: GetCookie('isLogin') === 'true',
      parkId: GetCookie('parkId'),
      parkName: decodeURI(GetCookie('parkName')),
      enterpriseId: GetCookie('enterpriseId'),
      enterpriseName: decodeURI(GetCookie('enterpriseName')),
      mobile: GetCookie('mobile'),
      nickname: decodeURI(GetCookie('nickname')),
      memberLogo: decodeURI(GetCookie('memberLogo')),
      selectParkId: decodeURI(GetCookie('selectParkId')),
      selectParkName: decodeURI(GetCookie('selectParkName'))
    }
    this.$store.dispatch('commitUserInfo', userInfo)
    this.getMessageCount()
  },
  mounted () {
    requireConfig()
  }
}
</script>

<style>
html *{
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
}

html,
body {
  min-height: 100%;
  background-color: #f9f9f9;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

a{
  text-decoration: none !important;
}
a:hover, a:active{
  text-decoration: none !important;
}
.router-link-active {
  text-decoration: none !important;
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
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  position: absolute;
  will-change: transform;
  -webkit-will-change: transform;
  transition: transform 0.4s ease;
  -webkit-transition: transform 0.4s ease;
}

.slide-right-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
  -webkit-transform: translate3d(-100%, 0, 0);
}

.slide-right-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
  -webkit-transform: translate3d(100%, 0, 0);
}

.slide-left-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
  -webkit-transform: translate3d(100%, 0, 0);
}

.slide-left-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
  -webkit-transform: translate3d(-100%, 0, 0);
}
</style>
