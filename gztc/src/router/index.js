import Vue from 'vue'
import Router from 'vue-router'
import { Dialog } from 'vant'
import { GetCookie } from '@/sys.util'

import enterpriseLogin from '@/components/enterprisePage/Login' // 企业号登录
import enterpriseList from '@/components/enterprisePage/List' // 企业号服务单详情
import enterpriseDetails from '@/components/enterprisePage/Details' // 企业号服务单详情
import AppointmentService from '@/components/appointment/AppointmentService' // 预约服务
import AppointmentDetails from '@/components/appointment/Details' // 预约服务详情

const Index = resolve => require(['@/components/index/Index'], resolve)

// 租赁
const SubLease = resolve => require(['@/components/lease/SubLease'], resolve)

const PersonCenter = resolve => require(['@/components/center/PersonCenter'], resolve)

const AccountSetting = resolve => require(['@/components/center/AccountSetting'], resolve)
// 服务分类
const ServiceType = resolve => require(['@/components/service/ServiceType'], resolve)

// 新闻列表
const NewsList = resolve => require(['@/components/news/NewsList'], resolve)

// 新闻列表
const NewsDetails = resolve => require(['@/components/news/NewsDetails'], resolve)

// 预约看房（项目）
const ApartmentService = resolve => require(['@/components/apartment/AppointmentService'], resolve)

// 预约看房（众创空间）
const SpaceService = resolve => require(['@/components/apartment/SpaceService'], resolve)

// 户型列表
const HouseTypeList = resolve => require(['@/components/apartment/HouseTypeList'], resolve)

// 户型详情
const HouseTypeDetails = resolve => require(['@/components/apartment/HouseTypeDetails'], resolve)

// 项目详情
const ApartmentDetails = resolve => require(['@/components/apartment/Details'], resolve)

// 项目详情
const ProjectDetails = resolve => require(['@/components/apartment/ProjectDetails'], resolve)

// 报修服务
const ServiceRepair = resolve => require(['@/components/service/ServiceRepair'], resolve)

// 服务预约
const Appointment = resolve => require(['@/components/service/Appointment'], resolve)

// 问题反馈
const Feedback = resolve => require(['@/components/question/Feedback'], resolve)

// 问卷列表
const Questionnaire = resolve => require(['@/components/question/Questionnaire'], resolve)

// 问卷详情
const SubjectList = resolve => require(['@/components/question/SubjectList'], resolve)

// 我的问卷列表
const MySubject = resolve => require(['@/components/question/MySubject'], resolve)

// 我的问卷列表
const MyQuestionnaireList = resolve => require(['@/components/question/MyQuestionnaireList'], resolve)

// 首页园区选择
const ParkSelect = resolve => require(['@/components/park/ParkSelect'], resolve)

// 会议室列表
const MeetingRoomList = resolve => require(['@/components/meeting/MeetingRoomList'], resolve)

// 会议室详情
const MeetingRoomDetail = resolve => require(['@/components/meeting/MeetingRoomDetail'], resolve)

const MeetingRoomAppointment = resolve => require(['@/components/meeting/MeetingRoomAppointment'], resolve)

// 场地列表
const PlaceList = resolve => require(['@/components/place/PlaceList'], resolve)

// 场地详情
const PlaceDetail = resolve => require(['@/components/place/PlaceDetail'], resolve)

// 场地预约
const PlaceAppointment = resolve => require(['@/components/place/PlaceAppointment'], resolve)

const RedirectPage = resolve => require(['@/components/RedirectPage'], resolve)

// 园区简介
const Introduction = resolve => require(['@/components/visit/Introduction'], resolve)

// 参观预约
const VisitAppointment = resolve => require(['@/components/visit/Appointment'], resolve)

// 活动列表
const ActivityList = resolve => require(['@/components/activity/ActivityList'], resolve)

// 活动详情
const ActivityDetail = resolve => require(['@/components/activity/ActivityDetail'], resolve)

// 参见活动
const ActiveJoin = resolve => require(['@/components/activity/ActiveJoin'], resolve)

// 绑定企业
const EnterpriseSetting = resolve => require(['@/components/login/EnterpriseSetting'], resolve)

// 账户设置园区
const SettingPark = resolve => require(['@/components/login/SettingPark'], resolve)

// 验证手机
const VerificationPhone = resolve => require(['@/components/login/VerificationPhone'], resolve)

// 商家详情
const BusinessDetails = resolve => require(['@/components/business/Details'], resolve)

// 消息列表
const InfomationList = resolve => require(['@/components/infomation/InfoList'], resolve)

// 消息分类
const InfomationType = resolve => require(['@/components/infomation/InfoType'], resolve)

// 消息详情
const InfomationDetails = resolve => require(['@/components/infomation/Details'], resolve)

// 场地服务单列表
const PlaceOrderList = resolve => require(['@/components/order/PlaceOrderList'], resolve)

// 场地服务单详情
const PlaceOderDetail = resolve => require(['@/components/order/PlaceOderDetail'], resolve)

// 活动服务单列表
const ActivityOrderList = resolve => require(['@/components/order/ActivityOrderList'], resolve)

// 活动服务单详情
const ActivityOrderDetail = resolve => require(['@/components/order/ActivityOrderDetail'], resolve)

// 预约看房单列表
const HouseOrderList = resolve => require(['@/components/order/HouseOrderList'], resolve)

// 预约看房单详情
const HouseOrderDetail = resolve => require(['@/components/order/HouseOrderDetail'], resolve)

// 服务单列表
const ServiceOrderList = resolve => require(['@/components/order/ServiceOrderList'], resolve)

// 服务单列表
const ServiceOrderDetail = resolve => require(['@/components/order/ServiceOrderDetail'], resolve)

// 付费服务单列表
const ChargeOrderList = resolve => require(['@/components/order/ChargeOrderList'], resolve)

// 付费服务单详情
const ChargeOrderDetail = resolve => require(['@/components/order/ChargeOrderDetail'], resolve)

// 服务评价
const ChargeOrderComment = resolve => require(['@/components/order/ChargeOrderComment'], resolve)

// 支付选择
const SelectPay = resolve => require(['@/components/pay/SelectPay'], resolve)

// 支付完成
const HadPay = resolve => require(['@/components/pay/HadPay'], resolve)

// 企业列表
const BusinessList = resolve => require(['@/components/business/List'], resolve)

// 商家列表
const SellerList = resolve => require(['@/components/business/SellerList'], resolve)

// 我的推荐
const MyRecommend = resolve => require(['@/components/order/MyRecommend'], resolve)

// 快速登录
const Login = resolve => require(['@/components/login/Login'], resolve)

Vue.use(Router)

const router = new Router({
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: [{
    path: '/Index',
    name: 'Index',
    meta: {
      requireAuth: false
    },
    component: Index
  }, {
    path: '/PersonCenter', // 个人中心
    name: 'PersonCenter',
    meta: {
      requireAuth: true
    },
    component: PersonCenter
  }, {
    path: '/AccountSetting',
    name: 'AccountSetting',
    meta: {
      requireAuth: true
    },
    component: AccountSetting
  }, {
    path: '/SubLease',
    name: 'SubLease',
    component: SubLease
  }, {
    path: '/ServiceType',
    name: 'ServiceType',
    component: ServiceType
  }, {
    path: '/NewsList',
    name: 'NewsList',
    component: NewsList
  }, {
    path: '/NewsDetails',
    name: 'NewsDetails',
    component: NewsDetails
  }, {
    path: '/ApartmentDetails',
    name: 'ApartmentDetails',
    component: ApartmentDetails
  }, {
    path: '/ApartmentService',
    name: 'ApartmentService',
    meta: {
      requireAuth: true
    },
    component: ApartmentService
  }, {
    path: '/SpaceService',
    name: 'SpaceService',
    meta: {
      requireAuth: true
    },
    component: SpaceService
  }, {
    path: '/HouseTypeList',
    name: 'HouseTypeList',
    component: HouseTypeList
  }, {
    path: '/HouseTypeDetails',
    name: 'HouseTypeDetails',
    component: HouseTypeDetails
  }, {
    path: '/ServiceRepair',
    name: 'ServiceRepair',
    component: ServiceRepair
  }, {
    path: '/Feedback',
    name: 'Feedback',
    meta: {
      requireAuth: true
    },
    component: Feedback
  }, {
    path: '/Questionnaire',
    name: 'Questionnaire',
    component: Questionnaire
  }, {
    path: '/SubjectList',
    component: SubjectList
  }, {
    path: '/MyQuestionnaireList',
    name: 'MyQuestionnaireList',
    meta: {
      requireAuth: true
    },
    component: MyQuestionnaireList
  }, {
    path: '/MySubject',
    name: 'MySubject',
    meta: {
      requireAuth: true
    },
    component: MySubject
  }, {
    path: '*',
    component: Index,
    redirect: '/Index'
  }, {
    path: '/ParkSelect',
    name: 'ParkSelect',
    component: ParkSelect
  }, {
    path: '/MeetingRoomList',
    name: 'MeetingRoomList',
    component: MeetingRoomList
  }, {
    path: '/MeetingRoomDetail',
    name: 'MeetingRoomDetail',
    component: MeetingRoomDetail
  }, {
    path: '/RedirectPage',
    name: 'RedirectPage',
    component: RedirectPage
  }, {
    path: '/Introduction',
    name: 'Introduction',
    component: Introduction
  }, {
    path: '/VisitAppointment',
    name: 'VisitAppointment',
    meta: {
      requireAuth: true
    },
    component: VisitAppointment
  }, {
    path: '/ActivityList',
    name: 'ActivityList',
    component: ActivityList
  }, {
    path: '/ActivityDetail',
    name: 'ActivityDetail',
    component: ActivityDetail
  }, {
    path: '/EnterpriseSetting',
    name: 'EnterpriseSetting',
    component: EnterpriseSetting
  }, {
    path: '/VerificationPhone',
    name: 'VerificationPhone',
    component: VerificationPhone
  }, {
    path: '/SettingPark',
    name: 'SettingPark',
    component: SettingPark
  }, {
    path: '/ActiveJoin',
    name: 'ActiveJoin',
    meta: {
      requireAuth: true
    },
    component: ActiveJoin
  }, {
    path: '/BusinessDetails',
    name: 'BusinessDetails',
    component: BusinessDetails
  }, {
    path: '/Appointment',
    name: 'Appointment',
    meta: {
      requireAuth: true
    },
    component: Appointment
  }, {
    path: '/MeetingRoomAppointment',
    name: 'MeetingRoomAppointment',
    meta: {
      requireAuth: true
    },
    component: MeetingRoomAppointment
  }, {
    path: '/PlaceList',
    name: 'PlaceList',
    component: PlaceList
  }, {
    path: '/PlaceAppointment',
    name: 'PlaceAppointment',
    meta: {
      requireAuth: true
    },
    component: PlaceAppointment
  }, {
    path: '/PlaceDetail',
    name: 'PlaceDetail',
    component: PlaceDetail
  }, {
    path: '/InfomationList',
    name: 'InfomationList',
    component: InfomationList
  }, {
    path: '/InfomationType',
    name: 'InfomationType',
    meta: {
      requireAuth: true
    },
    component: InfomationType
  }, {
    path: '/InfomationDetails',
    name: 'InfomationDetails',
    meta: {
      requireAuth: true
    },
    component: InfomationDetails
  }, {
    path: '/PlaceOrderList',
    name: 'PlaceOrderList',
    meta: {
      requireAuth: true
    },
    component: PlaceOrderList
  }, {
    path: '/PlaceOderDetail',
    name: 'PlaceOderDetail',
    meta: {
      requireAuth: true
    },
    component: PlaceOderDetail
  }, {
    path: '/ActivityOrderList',
    name: 'ActivityOrderList',
    meta: {
      requireAuth: true
    },
    component: ActivityOrderList
  }, {
    path: '/ActivityOrderDetail',
    name: 'ActivityOrderDetail',
    meta: {
      requireAuth: true
    },
    component: ActivityOrderDetail
  }, {
    path: '/HouseOrderList',
    name: 'HouseOrderList',
    meta: {
      requireAuth: true
    },
    component: HouseOrderList
  }, {
    path: '/HouseOrderDetail',
    name: 'HouseOrderDetail',
    meta: {
      requireAuth: true
    },
    component: HouseOrderDetail
  }, {
    path: '/ServiceOrderList',
    name: 'ServiceOrderList',
    meta: {
      requireAuth: true
    },
    component: ServiceOrderList
  }, {
    path: '/ChargeOrderList',
    name: 'ChargeOrderList',
    meta: {
      requireAuth: true
    },
    component: ChargeOrderList
  }, {
    path: '/ChargeOrderDetail',
    name: 'ChargeOrderDetail',
    meta: {
      requireAuth: true
    },
    component: ChargeOrderDetail
  }, {
    path: '/SelectPay',
    name: 'SelectPay',
    meta: {
      requireAuth: true
    },
    component: SelectPay
  }, {
    path: '/HadPay',
    name: 'HadPay',
    meta: {
      requireAuth: true
    },
    component: HadPay
  }, {
    path: '/enterpriseLogin',
    name: 'enterpriseLogin',
    component: enterpriseLogin
  }, {
    path: '/enterpriseList',
    name: 'enterpriseList',
    component: enterpriseList
  }, {
    path: '/enterpriseDetails',
    name: 'enterpriseDetails',
    component: enterpriseDetails
  }, {
    path: '/BusinessList',
    name: 'BusinessList',
    component: BusinessList
  }, {
    path: '/SellerList',
    name: 'SellerList',
    component: SellerList
  }, {
    path: '/AppointmentService',
    name: 'AppointmentService',
    meta: {
      requireAuth: true
    },
    component: AppointmentService
  }, {
    path: '/ChargeOrderComment',
    name: 'ChargeOrderComment',
    meta: {
      requireAuth: true
    },
    component: ChargeOrderComment
  }, {
    path: '/AppointmentDetails',
    name: 'AppointmentDetails',
    component: AppointmentDetails
  }, {
    path: '/MyRecommend',
    name: 'MyRecommend',
    meta: {
      requireAuth: true
    },
    component: MyRecommend
  }, {
    path: '/ProjectDetails',
    name: 'ProjectDetails',
    component: ProjectDetails
  }, {
    path: '/Login',
    name: 'Login',
    component: Login
  }, {
    path: '/ServiceOrderDetail',
    name: 'ServiceOrderDetail',
    component: ServiceOrderDetail
  }]
})
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (GetCookie('isLogin') === 'false') {
      Dialog.confirm({
        title: '提示',
        message: '请先登录',
        confirmButtonText: '马上登录'
      }).then(() => {
        next({
          path: '/Login'
        })
      })
    } else {
      next()
    }
  } else {
    next()
  }
})
export default router
