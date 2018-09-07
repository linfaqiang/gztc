<template>
  <div class="appointment-page">
    <!--头部-->
    <sub-header title="参观预约"></sub-header>
    <!--头部-->
    <div class="form-gruop">
      <form action="#">
        <dl>
          <dt>
            <div class="name-item">{{vpTitle}}</div>
          </dt>
          <dd>
            <label><i>*</i>收费类型：</label>
            <div class="cost-item">{{ vpChargeType === 0 ? '免费' : '收费'}}</div>
          </dd>
          <dd>
            <label><i>*</i>来访单位：</label>
            <input type="text" v-model="companyName" placeholder="请输入">
          </dd>
          <dd>
            <label><i>*</i>访客人数：</label>
            <input type="number" v-model="visitorNum" placeholder="请输入" @keyup="maxLength">
          </dd>
          <dd>
            <label><i>*</i>联&nbsp;系&nbsp;人：</label>
            <input type="text" v-model="uerName" placeholder="请输入">
          </dd>
          <dd>
            <label><i>*</i>手&nbsp;&nbsp;&nbsp;&nbsp;机：</label>
            <input type="tel" v-model="mobilePhone" placeholder="请输入" maxlength="11">
          </dd>
          <dd>
            <label><i>*</i>访问时间：</label>
            <input type="text" v-model="visitTime" placeholder="请选择"  readonly="readonly" @click="onAppointTime(e)" onfocus="this.blur()">
          </dd>
          <dd class="textarea-item">
            <label><i>&nbsp;</i>备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：</label>
            <textarea v-model="visitText" placeholder="请输入" maxlength="200"></textarea>
            <span class="words-num">{{visitText.length}}/200</span>
          </dd>
       </dl>
       <div class="btn-item">
         <button type="button" @click="onSubmitAppoint">提交预约</button>
       </div>
      </form>
    </div>
    <!--预约时间-->
    <van-popup position="bottom" v-model="isTimeShow">
      <van-datetime-picker v-model="currentDate" type="datetime" :min-date="minDate" :max-date="maxDate" @cancel="onTimeCancel" @confirm="onTimeConfirm"/>
    </van-popup>
    <!--提交加载Loading-->
    <div class="loading-spinner-item" v-show="showLoadding">
      <van-loading color="white" />
    </div>
  </div>
</template>
<script>
import SubHeader from '@/components/common/SubHeader'
import { Popup, DatetimePicker, Toast, Loading } from 'vant'
import { getVisitApply } from '@/api/index'
import { formatter } from '@/assets/utils'
import { mapGetters } from 'vuex'
export default {
  name: 'VisitAppointment',
  data () {
    return {
      isTimeShow: false,
      companyName: '',
      visitorNum: '',
      uerName: '',
      mobilePhone: '',
      visitTime: '',
      visitText: '',
      minHour: 10,
      maxHour: 20,
      minDate: new Date(),
      maxDate: new Date(2030, 12, 31),
      currentDate: new Date(),
      proId: 0,
      vpTitle: '',
      vpChargeType: -1,
      cost: -1,
      showLoadding: false
    }
  },
  components: {
    SubHeader,
    [Popup.name]: Popup,
    [DatetimePicker.name]: DatetimePicker,
    [Toast.name]: Toast,
    [Loading.name]: Loading
  },
  created () {
    this.proId = this.$route.query.proId
    this.vpTitle = this.$route.query.vpTitle
    this.vpChargeType = this.$route.query.vpChargeType
    this.cost = this.$route.query.cost
    this.uerName = this.getUserInfo.nickname
    this.mobilePhone = this.getUserInfo.mobile
    this.companyName = this.getUserInfo.enterpriseName
  },
  computed: {
    ...mapGetters(['getUserInfo'])
  },
  methods: {
    onAppointTime () {
      this.isTimeShow = true
    },
    onTimeConfirm (value, index) {
      this.visitTime = formatter('yyyy-MM-dd hh:mm:ss', value)
      this.isTimeShow = false
    },
    onTimeCancel () {
      this.isTimeShow = false
    },
    onSubmitAppoint () {
      var that = this
      var reg = /^[1][3,5,7,8][0-9]{9}$/
      if (this.companyName === '') {
        Toast('请填单位名称')
      } else if (this.visitorNum === '') {
        Toast('请填写人数')
      } else if (this.uerName === '') {
        Toast('请填写姓名')
      } else if (this.mobilePhone === '') {
        Toast('请填写手机号码')
      } else if (!reg.test(this.mobilePhone)) {
        Toast('手机号码格式不对')
      } else if (this.visitTime === '') {
        Toast('请选择访问时间')
      } else {
        this.showLoadding = true
        getVisitApply({
          proId: this.proId,
          parkId: this.getUserInfo.selectParkId,
          company: this.companyName,
          name: this.uerName,
          phone: this.mobilePhone,
          time: this.visitTime,
          num: this.visitorNum,
          remark: this.visitText,
          cost: this.cost
        }).then((res) => {
          this.showLoadding = false
          if (res.data.success) {
            Toast.success(res.data.message)
            var result = res.data.result
            if (res.data.result.cost === 0) {
              that.$router.go(-1)
            } else {
              that.$router.push({
                name: 'SelectPay',
                query: {
                  money: result.cost,
                  orderNo: result.orderNo,
                  orderId: result.id,
                  orderType: '3',
                  redirectUrl: 'Introduction'
                }
              })
            }
          } else {
            Toast.fail(res.data.message)
          }
        }).catch((err) => {
          Toast.fail(err.message)
        })
      }
    },
    maxLength (e) {
      if (e.target.value >= 1000) {
        this.visitorNum = 1000
      }
    }
  }
}
</script>
<style>
img {
  max-width: 100%;
}
.form-gruop{
  font-size: .37037rem;
}
.form-gruop dl{
  padding: .398148rem .740741rem .148148rem .740741rem;
  background-color: #fff;
}
.form-gruop dl dt{
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
  justify-content: space-between;
  -webkit-justify-content: space-between;
  padding: .277778rem .37037rem;
  background-color: #f9f9f9;
}
.form-gruop dl dt .name-item{
  width: 60%;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.form-gruop dl dd .cost-item{
  height: 1.296296rem;
  line-height: .972222rem;
  padding: .185185rem 0 .185185rem 2.407407rem;
  text-align: left;
}
.form-gruop dl dd{
  position: relative;
  border-bottom: .027778rem solid #2d2d2d;
}
.form-gruop dl dd:last-child{
  border: 0;
}
.form-gruop dl dd label{
  position: absolute;
  left: 0;
  top: 0;
  width: 2.037037rem;
  line-height: 1.296296rem;
  text-align: right;
}
.form-gruop dl dd label i{
  color: #fdcc07;
  font-style: normal;
}
.form-gruop dl dd input{
  border:0;
  outline: none;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  width: 100%;
  height: 1.296296rem;
  padding: .185185rem 0 .185185rem 2.407407rem;
  text-align: left;
  background-color: transparent;
}
.form-gruop dl .textarea-item{
  position: relative;
  text-align: left;
  padding-bottom: .4rem;
}
.form-gruop dl .textarea-item label{
  position: static;
  display: block;
}
.form-gruop dl dd textarea{
  border:0;
  outline: none;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  display: block;
  width: 100%;
  height: 2.962963rem;
  padding: 0 0 .185185rem 0;
  background-color: transparent;
}
.form-gruop dl .textarea-item .words-num{
  position: absolute;
  right: 0;
  bottom: .185185rem;
  color: #929292;
}
.btn-item{
  padding: 1.296296rem .925926rem 0 .925926rem;
}
.btn-item button{
  border: 0;
  outline: none;
  width: 100%;
  height: .925926rem;
  border-radius: .092593rem;
  color: #1a1a1a;
  font-size: .37037rem;
  background-color: #fdcc07;
}
</style>
