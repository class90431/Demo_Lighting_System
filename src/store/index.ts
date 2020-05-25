import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    maskData: []
  },
  mutations: {
    MASKDATA(state, payload) {
      state.maskData = payload
      console.log(state.maskData)
    },
    CHANGEDATA(state) {
      // state.maskData = 
    }
  },
  actions: {
    storeData(context, payload) {
      context.commit('MASKDATA', payload.data)
    },
    removeData(context, payload){
      console.log('removeData')
      context.commit('CHANGEDATA')
    }
  },
  modules: {
  }
})
