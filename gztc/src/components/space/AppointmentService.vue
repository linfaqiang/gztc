<template>
  <div class="appointment-page">
    <!--头部-->
    <sub-header title="预约看房"></sub-header>
    <!--头部-->
    <div class="form-gruop">
      <form action="#">
        <dl>
          <dd>
            <label><i>*</i>单位名称：</label>
            <input type="text" v-model="companyName" placeholder="请输入" disabled="disabled">
          </dd>
          <dd>
            <label><i>*</i>联&nbsp;系&nbsp;人：</label>
            <input type="tel" v-model="uerName" placeholder="请输入">
          </dd>
          <dd>
            <label><i>*</i>手&nbsp;&nbsp;&nbsp;&nbsp;机：</label>
            <input type="text" v-model="mobilePhone" placeholder="请输入" maxlength="11">
          </dd>
          <dd>
            <label><i>*</i>预约时间：</label>
            <input type="text" v-model="appointTime" placeholder="请选择"  readonly="readonly" @click="onAppointTime()" onfocus="this.onblur()">
          </dd>
          <dd class="textarea-item">
            <label><i>&nbsp;</i>备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：</label>
            <textarea v-model="appointText" placeholder="请输入" maxlength="200"></textarea>
            <span class="words-num">{{appointText.length}}/200</span>
          </dd>
       </dl>
       <div class="btn-item">
         <button type="button" @click="onSubmitAppoint">确&nbsp;&nbsp;认</button>
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
import { getSubmitAttra } from '@/api/index'
import { Popup, Picker, DatetimePicker, Toast, Loading } from 'vant'
import { formatter } from '@/assets/utils'
import { mapGetters } from 'vuex'
export default {
  name: 'SpaceService',
  data () {
    return {
      IsPickerShow: false,
      isTimeShow: false,
      companyName: '',
      uerName: '',
      mobilePhone: '',
      appointTime: '',
      appointText: '',
      columns: [],
      minHour: 10,
      maxHour: 20,
      minDate: new Date(),
      maxDate: new Date(2030, 12, 31),
      currentDate: new Date(),
      houseTypes: [],
      hId: 0,
      showLoadding: false
    }
  },
  components: {
    SubHeader,
    [Popup.name]: Popup,
    [Picker.name]: Picker,
    [DatetimePicker.name]: DatetimePicker,
    [Toast.name]: Toast,
    [Loading.name]: Loading
  },
  computed: {
    ...mapGetters(['selectParkId'])
  },
  created () {
    this.companyName = this.$route.query.name
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
      var reg = /^[1][3,4,5,7,8][0-9]{9}$/
      if (this.projectName === '') {
        Toast('请选择服务项目')
      } else if (this.companyName === '') {
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
        getSubmitAttra({
          pid: this.getUserInfo.selectParkId,
          aId: 5,
          linkman: this.uerName,
          mobile: this.mobilePhone,
          time: this.appointTime,
          remark: this.appointText
        }).then((res) => {
          if (res.data.result === 0) {
            this.showLoadding = false
            Toast.success('预约成功')
            this.$router.back(-1)
          } else {
            Toast.fail('预约失败')
          }
        }).catch((err) => {
          Toast.fail(err.message)
        })
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
