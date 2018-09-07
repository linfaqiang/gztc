import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  registerInfo: {},
  userInfo: {
    id: '',
    isLogin: false,
    parkId: -1,
    parkName: '',
    enterpriseId: '',
    enterpriseName: '',
    mobile: '',
    nickname: '',
    memberLogo: '',
    selectParkId: '',
    selectParkName: ''
  },
  token: '',
  isShare: false,
  messageCount: 0
}

const actions = {
  commitRegisterInfo ({commit}, registerInfo) {
    commit('setRegisterInfo', registerInfo)
  },
  commitUserInfo ({commit}, userInfo) {
    commit('setUserInfo', userInfo)
  },
  commitMessageCount ({commit}, messageCount) {
    commit('setMessageCount', messageCount)
  }
}
const mutations = {
  setRegisterInfo (state, registerInfo) {
    state.registerInfo = registerInfo
  },
  setUserInfo (state, userInfo) {
    state.userInfo = userInfo
  },
  setShare (state, share) {
    state.isShare = share
  },
  setMessageCount (state, messageCount) {
    state.messageCount = messageCount
  }
}

const getters = {
  getRegisterInfo: state => {
    return state.registerInfo
  },
  getUserInfo: state => {
    return state.userInfo
  },
  getShare: state => {
    return state.isShare
  },
  getMessageCount: state => {
    return state.messageCount
  }
}

const store = new Vuex.Store({
  state,
  actions,
  mutations,
  getters
})
export default store
