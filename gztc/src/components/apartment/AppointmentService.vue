<template>
  <div class="appointment-page">
    <!--头部-->
    <sub-header title="预约看房"></sub-header>
    <!--头部-->
    <div class="form-gruop">
      <form action="#">
        <dl>
          <dt>
            <div class="name-item">
              项目名称：{{companyName}}
            </div>
          </dt>
          <dd>
            <label><i>*</i>意向户型：</label>
            <input type="text" v-model="projectName" placeholder="请选择" readonly="readonly" @click="onProjectName()" onfocus="this.blur()">
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
         <button type="button" @click="onSubmitAppoint()">确&nbsp;&nbsp;认</button>
       </div>
      </form>
    </div>
    <!--服务项目-->
    <van-popup position="bottom" v-model="IsPickerShow">
      <van-picker show-toolbar title="意向户型" :columns="columns" @cancel="onPickerCancel" @confirm="onPickerConfirm" />
    </van-popup>
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
import { getSubmitAttra, getHouseType } from '@/api/index'
import { Popup, Picker, DatetimePicker, Toast, Loading } from 'vant'
import { formatter } from '@/assets/utils'
import { mapGetters } from 'vuex'
export default {
  name: 'ApartmentService',
  data () {
    return {
      IsPickerShow: false,
      isTimeShow: false,
      projectName: '',
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
      recommend: {},
      hId: 0,
      aId: 0,
      refId: 0,
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
  created () {
    this.uerName = this.getUserInfo.nickname
    this.mobilePhone = this.getUserInfo.mobile
    this.refId = this.$route.query.refId
    let projectId = window.sessionStorage.getItem('projectId')
    let projectName = window.sessionStorage.getItem('projectName')
    if (this.$route.query.hid) {
      this.aId = this.$route.query.hid
    } else {
      this.aId = projectId
    }
    if (this.$route.query.name) {
      this.companyName = this.$route.query.name
    } else {
      this.companyName = projectName
    }
    getHouseType({aid: this.aId}).then((res) => {
      if (res.data.success) {
        this.houseTypes = res.data.result
        this.houseTypes.forEach((item) => {
          this.columns.push(item.name)
        })
      }
    }).catch((err) => {
      Toast.fail(err.message)
    })
  },
  computed: {
    ...mapGetters(['getUserInfo'])
  },
  methods: {
    onProjectName () {
      this.IsPickerShow = true
    },
    onPickerConfirm (value, index) {
      this.projectName = value
      this.IsPickerShow = false
      for (let i = 0; i < this.houseTypes.length; i++) {
        if (this.houseTypes[i].name === value) {
          this.hId = this.houseTypes[i].id
          break
        }
      }
    },
    onPickerCancel () {
      this.IsPickerShow = false
    },
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
      let reg = /^[1][3,5,7,8][0-9]{9}$/
      if (this.projectName === '') {
        Toast('请选择意向户型')
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
          aId: this.aId,
          hId: this.hId,
          linkman: this.uerName,
          mobile: this.mobilePhone,
          time: this.appointTime,
          remark: this.appointText,
          refId: this.refId
        }).then((res) => {
          this.showLoadding = false
          if (res.data.success) {
            if (res.data.result === 0) {
              Toast.success('预约成功')
              this.$router.go(-1)
              // this.$router.push({
              //   path: 'HouseOrderDetail',
              //   query: {
              //     id: this.aId
              //   }
              // })
            } else {
              Toast.fail('预约失败')
            }
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
  padding-top: .388889rem;
  background-color: #fff;
}
.form-gruop dl dt{
  padding: .277778rem .37037rem;
  background-color: #f9f9f9;
}
.form-gruop dl dt .name-item{
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
