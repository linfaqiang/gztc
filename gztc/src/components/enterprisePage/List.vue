<template>
  <div class="service-ticker">
    <!--头部-->
    <enterprise-header title="服务服务单"></enterprise-header>
    <!--内容-->
    <div class="navbar-item">
      <div class="navbar-inner">
        <ul ref="navbarList">
          <li v-for="(serviceCate, index) in serviceCates" :class="{active: serviceCate.isActive}" :key="serviceCate.id" @click="tonggleOn(index, serviceCate.id)" ref="navbarItem">
            <span v-if="serviceCate.serviceName === '全部'">&nbsp;&nbsp;{{serviceCate.serviceName}}&nbsp;&nbsp;</span>
            <span v-else>{{serviceCate.serviceName}}（{{serviceCate.num}}）</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="list-item">
      <van-list v-model="loading" :finished="finished" ref="list">
        <ul>
          <li v-for="serviceOrder in serviceOrderList" :key="serviceOrder.id" @click="toDetails(serviceOrder.id, serviceOrder.status)">
            <h4>{{serviceOrder.serviceName}}&nbsp;&nbsp;<span>{{serviceOrder.itemName}}</span>
              <b v-if="serviceOrder.status === 0">服务申请</b>
              <b v-if="serviceOrder.status === 1">已派单</b>
              <b v-if="serviceOrder.status === 2">已接单</b>
              <b v-if="serviceOrder.status === 3">已报价</b>
              <b v-if="serviceOrder.status === 4">已支付</b>
              <b v-if="serviceOrder.status === 5">服务中</b>
              <b v-if="serviceOrder.status === 6">已服务</b>
              <b v-if="serviceOrder.status === 7" class="end">已完成</b>
              <b v-if="serviceOrder.status === 8">已取消</b>
            </h4>
            <p>收费范围：{{serviceOrder.price}}元</p>
            <p>提交时间：{{serviceOrder.cerateTime }}</p>
            <p>派单时间：{{serviceOrder.sendTime }}</p>
            <p>预约时间：{{serviceOrder.bookingsTime}}</p>
            <div class="btn-item">
              <button type="button" v-if="serviceOrder.status === 1">接单</button>
              <button type="button" v-if="serviceOrder.status === 2">报价</button>
              <button type="button" v-if="serviceOrder.status === 4">服务</button>
              <button type="button" v-if="serviceOrder.status === 6">完成</button>
            </div>
          </li>
        </ul>
      </van-list>
    </div>
  </div>
</template>
<script>
import { List, Toast } from 'vant'
import { Encrypt } from '@/cryptojs.util'
import { SetCookie } from '@/sys.util'
import { getService, getServiceOrderList } from '@/api/enterprise'
import enterpriseHeader from '@/components/enterprisePage/Header'
export default {
  data () {
    return {
      voucher: {},
      serviceOrderList: [],
      serviceCates: [],
      loading: false,
      finished: false,
      pageNum: 0
    }
  },
  components: {
    [List.name]: List,
    [Toast.name]: Toast,
    enterpriseHeader
  },
  methods: {
    /**
     * 获取用户信息
     */
    getRedirectVoucher () {
      let isUid = Boolean(window.sessionStorage.getItem('isUid'))
      if (isUid) {
        this.getServiceNav()
        this.$nextTick(() => {
          this.$refs.list.$emit('load', this.onLoad(''))
        })
      } else {
        this.$http.post('/api/qysso', this.voucher).then((res) => {
          if (res.data.success) {
            var primaryToken = res.data.result.uid + '_' + res.data.result.token
            var token = Encrypt(primaryToken)
            SetCookie('token', token)
            if (res.data.result.state !== -1) {
              window.sessionStorage.setItem('isUid', 'true')
              this.getServiceNav()
              this.$nextTick(() => {
                this.$refs.list.$emit('load', this.onLoad(''))
                this.scrollOn('')
              })
            } else {
              this.loading = false
              this.finished = true
              console.log('不成功')
            }
          } else {
            this.loading = false
            this.finished = true
            console.log('不成功')
          }
        }).catch((err) => {
          console.log(err.message)
        })
      }
    },
    getServiceNav () {
      getService().then((res) => {
        if (res.data.success) {
          this.serviceCates = res.data.result
          this.serviceCates.forEach((item) => {
            this.$set(item, 'isActive', false)
          })
          this.serviceCates.unshift({id: '', serviceName: '全部', num: -1, isActive: true})
          let sumWidth = 0
          this.$nextTick(() => {
            for (let i = 0; i < this.serviceCates.length; i++) {
              sumWidth += parseFloat(this.$refs.navbarItem[i].getBoundingClientRect().width) + parseFloat(window.getComputedStyle(this.$refs.navbarItem[i])['marginRight'])
            }
            this.$refs.navbarList.style.width = sumWidth + 'px'
          })
        }
      }).catch((err) => {
        console.log(err.message)
      })
    },
    onLoad (id) {
      this.pageNum++
      console.log(this.pageNum)
      getServiceOrderList({page: this.pageNum, orderType: id}).then((res) => {
        this.loading = false
        if (res.data.success) {
          if (res.data.result.length) {
            res.data.result.forEach((item) => {
              this.serviceOrderList.push(item)
            })
          } else {
            this.finished = true
          }
        }
      }).catch((err) => {
        console.log(err.message)
      })
    },
    tonggleOn (index, id) {
      this.pageNum = 0
      this.serviceOrderList = []
      this.serviceCates.forEach((item) => {
        item.isActive = false
      })
      this.serviceCates[index].isActive = true
      this.$nextTick(() => {
        this.$refs.list.$emit('load', this.onLoad(id))
        this.scrollOn(id)
      })
    },
    toDetails (id, status) {
      this.$router.push({
        path: 'enterpriseDetails',
        query: {
          id: id
        }
      })
    },
    scrollOn (id) {
      this.$nextTick(() => {
        document.body.scrollTop = 0
        window.onscroll = () => {
          // 变量scrollTop是滚动条滚动时，距离顶部的距离
          let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
          // 变量windowHeight是可视区的高度
          let windowHeight = document.documentElement.clientHeight || document.body.clientHeight
          // 变量scrollHeight是滚动条的总高度
          let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
          // 滚动条到底部的条件
          if (scrollTop + windowHeight === scrollHeight) {
            this.$refs.list.$emit('load', this.onLoad(id))
          }
        }
      })
    }
  },
  created () {
    this.voucher.code = this.$route.query.code
    this.voucher.state = this.$route.query.state
    this.getRedirectVoucher()
  }
}
</script>
<style scoped>
img{
  max-width: 100%;
}
.navbar-item{
  position: fixed;
  left: 0;
  top: 1.157407rem;
  width: 100%;
  padding: .37037rem .277778rem;
  background-color: #f9f9f9;
  z-index: 999;
}
.navbar-item .navbar-inner{
  width: 100%;
  overflow-x: auto;
}
.navbar-item ul{
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
  width: 100rem;
}
.navbar-item ul li{
  display: inline-block;
  vertical-align: middle;
  padding: 0 .138889rem;
  height: .592593rem;
  line-height: .592593rem;
  margin-right: .277778rem;
  border: 1px solid #cbcbcf;
  border-radius: .037037rem;
  background-color: #fff;
  cursor: pointer;
}
.navbar-item ul li.active{
  border: .018519rem solid #262729;
  background-color: #fdcc07;
}
.list-item{
  padding: 1.388889rem .277778rem 0 .277778rem;
  background-color: #fff;
}
.list-item ul{
  padding: 0 .37037rem;
}
.list-item ul li{
  position: relative;
  text-align: left;
  padding: .203704rem 0 .388889rem 0;
  border-bottom: 1px solid #dbdbdb;
}
.list-item ul li:last-child{
  border: 0;
}
.list-item ul li h4{
  position: relative;
  padding: .305556rem 0;
  font-size: .388889rem;
}
.list-item ul li h4 span{
  font-size: .314815rem;
}
.list-item ul li h4 b{
  position: absolute;
  right: 0;
  top: 50%;
  display: inline-block;
  height: .37037rem;
  line-height: .37037rem;
  margin-top: -0.185185rem;
  padding: 0 .12963rem;
  text-align: center;
  font-size: .277778rem;
  border-radius: .037037rem;
  background-color: #fecd05;
}
.list-item ul li h4 b.end{
  color: #fff;
  background-color: #9b9b9b;
}
.list-item ul li p{
  font-size: .314815rem;
  line-height: .462963rem
}
.list-item ul li .btn-item{
  position: absolute;
  right: 0;
  bottom: .42rem;
}
.list-item ul li .btn-item button{
  border: 0;
  outline: none;
  width: 1.759259rem;
  height: .555556rem;
  border-radius: .037037rem;
  color: #fff;
  font-size: .296296rem;
  background-color: #f6372c;
}
.empty-item{
  background-color: #f9f9f9;
}
</style>
