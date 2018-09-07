<template>
  <div class="appointment-page">
    <!--头部-->
    <sub-header title="预约申请"></sub-header>
    <!--头部-->
    <div class="form-gruop">
      <form action="#">
        <dl>
          <dd>
            <label><i>*</i>单位名称：</label>
            <input type="text" v-model="companyName" placeholder="请输入">
          </dd>
          <dd>
            <label><i>&nbsp;</i>单&nbsp;&nbsp;元&nbsp;&nbsp;号：</label>
            <input type="text" v-model="unitNum" placeholder="请输入">
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
            <label><i>*</i>预约时间：</label>
            <input type="text" v-model="appointTime" placeholder="请选择"  readonly="readonly" @click="onAppointTime()" onfocus="this.blur()">
          </dd>
          <dd class="textarea-item">
            <label><i>&nbsp;</i>备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：</label>
            <textarea v-model="appointText" placeholder="请输入" maxlength="200"></textarea>
            <span class="words-num">{{appointText.length}}/200</span>
          </dd>
       </dl>
       <div class="btn-item">
         <button type="button" @click="onSubmitAppoint">预&nbsp;&nbsp;约</button>
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
import { submitService } from '@/api/index'
import { formatter } from '@/assets/utils'
import { Popup, DatetimePicker, Toast, Loading } from 'vant'
import { mapGetters } from 'vuex'
export default {
  name: 'AppointmentService',
  data () {
    return {
      isTimeShow: false,
      companyName: '',
      uerName: '',
      mobilePhone: '',
      appointTime: '',
      appointText: '',
      unitNum: '',
      minHour: 10,
      maxHour: 20,
      minDate: new Date(),
      maxDate: new Date(2030, 12, 31),
      currentDate: new Date(),
      sid: -1,
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
  methods: {
    onAppointTime () {
      this.isTimeShow = true
    },
    onTimeConfirm (value, index) {
      this.appointTime = formatter('yyyy-MM-dd hh:mm:ss', value)
      this.isTimeShow = false
    },
    onTimeCancel () {
      this.isTimeShow = false
    },
    onSubmitAppoint () {
      var reg = /^[1][3,5,7,8][0-9]{9}$/
      if (this.companyName === '') {
        Toast('请填写单位名称')
      } else if (this.uerName === '') {
        Toast('请填写姓名')
      } else if (this.mobilePhone === '') {
        Toast('请填写手机号码')
      } else if (!reg.test(this.mobilePhone)) {
        Toast('手机号码格式不对')
      } else if (this.appointTime === '') {
        Toast('请选择预约时间')
      } else {
        this.showLoadding = true
        submitService({
          sId: this.sid,
          stId: 0,
          companyName: this.companyName,
          unit: this.unitNum,
          name: this.uerName,
          mobile: this.mobilePhone,
          time: this.appointTime,
          remark: this.appointText,
          pid: this.getUserInfo.selectParkId
        }).then((res) => {
          this.showLoadding = false
          if (res.data.success) {
            if (res.data.result.state === '0') {
              Toast.success('预约成功')
              this.$router.push({
                path: 'ServiceOrderDetail',
                query: {
                  id: Number(res.data.result.soId)
                }
              })
            } else {
              Toast.fail(res.data.message)
            }
          }
        }).catch((err) => {
          Toast.fail(err.message)
        })
      }
    }
  },
  computed: {
    ...mapGetters(['getUserInfo'])
  },
  created () {
    this.sid = this.$route.query.id
    this.companyName = this.getUserInfo.enterpriseName
    this.uerName = this.getUserInfo.nickname
    this.mobilePhone = this.getUserInfo.mobile
  }
}
</script>
<style scoped>
img {
  max-width: 100%;
}
.form-gruop{
  font-size: .37037rem;
}
.form-gruop dl{
  padding: 0 .740741rem;
  background-color: #fff;
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
