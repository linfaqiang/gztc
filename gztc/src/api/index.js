import request from '@/http.js'
import wx from 'weixin-js-sdk'
import store from '@/store/index'
export const instance = request.create({
  withCredentials: true
})
/**
 * 服务分类更多
 */
export function getMoreServiceCate (data) {
  return request({
    url: '/api/serviceCate/moreServiceCate',
    method: 'POST',
    data
  })
}
/**
 * 新闻列表
 */
export function getNewsList (data) {
  return request({
    url: '/api/newbulletin/moreNewsbulletin',
    method: 'POST',
    data
  })
}
/**
 * 新闻详情
 */
export function getNewsDetail (data) {
  return request({
    url: '/api/newbulletin/newsbulletinDetails',
    method: 'POST',
    data
  })
}
/**
 * 企业/商家详情
 */
export function getEnterDetails (data) {
  return request({
    url: '/api/enterprise/enterDetails',
    method: 'POST',
    data
  })
}
/**
 * 获得户型
 */
export function getHouseType (data) {
  return request({
    url: '/api/attract/getHouseType',
    method: 'POST',
    data
  })
}
/**
 * 项目推荐
 */
export function getRecommend (data) {
  return request({
    url: '/api/attract/recommend',
    method: 'POST',
    data
  })
}
/**
 * 看房预约
 */
export function getSubmitAttra (data) {
  return request({
    url: '/api/attract/submitAttra',
    method: 'POST',
    data
  })
}
/**
 * 参观项目
 */
export function getVisitProject (data) {
  return request({
    url: '/api/visit/visitProject',
    method: 'POST',
    data
  })
}
/**
 * 参观项目
 */
export function getVisitApply (data) {
  return request({
    url: '/api/visit/visitApply',
    method: 'POST',
    data
  })
}
/**
 * 预约，付费服务二级页面通用接口
 */
export function getServicelevel2 (data) {
  return request({
    url: '/api/serviceCate/servicelevel2',
    method: 'POST',
    data
  })
}
/**
 * 会议室/场地消息总数接口
 */
export function getPlaceMessageCount () {
  return request({
    url: '/api/personal/placeMessageCount',
    method: 'GET'
  })
}
/**
 * 看房单消息总数接口
 */
export function getSeeHouseMessageCount (data) {
  return request({
    url: '/api/personal/seeHouseMessageCount?parkId=' + data.parkId,
    method: 'GET'
  })
}
/**
 * 活动报名单总数接口
 */
export function activityApplyCount (data) {
  return request({
    url: '/api/personal/activityApplyCount',
    method: 'POST',
    data
  })
}
/**
 * 预约申请单，付费服务单消息总数接口
 */
export function serviceOrderCount (data) {
  return request({
    url: '/api/personal/serviceOrderCount',
    method: 'POST',
    data
  })
}
/**
 * 我的问卷总数量
 */
export function myQuestionCount (data) {
  return request({
    url: '/api/personal/myQuestionCount',
    method: 'POST',
    data
  })
}
/**
 * 问卷列表
 */
export function getQuestionList (data) {
  return request({
    url: '/api/question/questionList',
    method: 'POST',
    data
  })
}
/**
 * 问卷题目
 */
export function getQuestionTopics (data) {
  return request({
    url: '/api/question/getQuestionTopics',
    method: 'POST',
    data
  })
}
/**
 * 问卷详情
 */
export function getQuestionDetail (data) {
  return request({
    url: '/api/question/questionDetail',
    method: 'POST',
    data
  })
}
/**
 * 我的问卷列表
 */
export function myQuestionList (data) {
  return request({
    url: '/api/question/myQuestionList',
    method: 'POST',
    data
  })
}
/**
 * 我的问卷答题
 */
export function myQuestionTopics (data) {
  return request({
    url: '/api/question/myQuestionTopics',
    method: 'POST',
    data
  })
}
/**
 * 我的问卷详情
 */
export function myQuestionDetail (data) {
  return request({
    url: '/api/question/myQuestionDetail',
    method: 'POST',
    data
  })
}
/**
 * 交卷
 */
export function submitTopics (data) {
  return request({
    url: '/api/question/submitTopics',
    method: 'POST',
    data
  })
}
/**
 * 投诉建议提交
 */
export function submitSuggest (data) {
  return request({
    url: '/api/question/submitSuggest',
    method: 'POST',
    data
  })
}
/**
 * 投诉建议历史纪录
 */
export function getSuggestHistories (data) {
  return request({
    url: '/api/question/suggestHistories',
    method: 'POST',
    data
  })
}
/**
 * 服务
 */
export function getService (data) {
  return request({
    url: '/api/service/service',
    method: 'POST',
    data
  })
}
/**
 * 服务分类
 */
export function getServiceCate (data) {
  return request({
    url: '/api/service/serviceCate',
    method: 'POST',
    data
  })
}
/**
 * 服务项目列表
 */
export function getServiceItem (data) {
  return request({
    url: '/api/service/serviceItem',
    method: 'POST',
    data
  })
}
/**
 * 提交预约单
 */
export function submitService (data) {
  return request({
    url: '/api/service/submitService',
    method: 'POST',
    data
  })
}
/**
 * 最新两条消息
 */
export function latestTwo (data) {
  return request({
    url: '/api/message/latestTwo',
    method: 'POST',
    data
  })
}
/**
 * 消息总数
 */
export function messageCount (data) {
  return request({
    url: '/api/message/messageCount',
    method: 'POST',
    data
  })
}
/**
 * 消息列表
 */
export function messageList (data) {
  return request({
    url: '/api/message/messageList',
    method: 'POST',
    data
  })
}
/**
 * 消息详情
 */
export function messageDetails (data) {
  return request({
    url: '/api/message/messageDetails',
    method: 'POST',
    data
  })
}
/**
 * 会员修改手机号确认
 */
export function updateMemPhone (data) {
  return request({
    url: '/api/personal/updateMemPhone',
    method: 'POST',
    data
  })
}
/**
 * 发送手机CODE
 */
export function sendMobileCode (data) {
  return request({
    url: '/api/sso/sendMobileCode',
    method: 'POST',
    data
  })
}
/**
 * 企业列表
 */
export function enterpriseList (data) {
  return request({
    url: '/api/enterprise/enterpriseList',
    method: 'POST',
    data
  })
}
/**
 * js-jdk需要的数据
 */
export function getWxjs (data) {
  return request({
    url: '/api/index/getWxjs',
    method: 'POST',
    data
  })
}
/**
 * js-jdk配置
 */
export function requireConfig () {
  let authUrl = encodeURI(window.location.href)
  getWxjs({resultUrl: authUrl}).then((res) => {
    if (res.data.success) {
      wx.config({
        debug: false,
        appId: res.data.result.appid,
        timestamp: res.data.result.timestamp,
        nonceStr: res.data.result.noncestr,
        signature: res.data.result.signature,
        jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'previewImage']
      })
      wx.error(function (res) {
        console.log('验证失败返回的信息:', res)
      })
    }
  }).catch((err) => {
    console.log(err.message)
  })
}
/**
 * js-jdk
 */
export function requireShare (title, desc, curHref, imgUrl) {
  let u = navigator.userAgent
  if (u.indexOf('Android') > -1) {
    requireConfig()
  }
  wx.ready(function () {
    wx.onMenuShareTimeline({
      title: title, // 分享标题
      desc: desc, // 分享描述
      link: 'http://m.topchainspace.com' + curHref, // 分享链接
      imgUrl: imgUrl, // 分享图标
      success: function () {
        store.commit('setShare', false)
        alert('分享成功')
      },
      cancel: function () {
        alert('分享失败')
      }
    })
    wx.onMenuShareAppMessage({
      title: title, // 分享标题
      desc: desc, // 分享描述
      link: 'http://m.topchainspace.com' + curHref, // 分享链接
      imgUrl: imgUrl, // 分享图标
      success: function () {
        store.commit('setShare', false)
        alert('分享成功')
      },
      cancel: function () {
        store.commit('setShare', false)
        alert('分享失败')
      }
    })
  })
}
