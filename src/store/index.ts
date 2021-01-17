import Vue from 'vue'
import Vuex from 'vuex'
import mqtt from 'mqtt'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    MAP_DATA: []
  },
  mutations: {
    UPDATE_DATA(state, payload) {
      state.MAP_DATA = payload
    }
  },
  actions: {
    subscribeMQTT({ dispatch }) {
      const topic = `${process.env.VUE_APP_MQTT_TOPIC}`
      const client = mqtt.connect(`${process.env.VUE_APP_MQTT_HOST}`)
      client.on('connect', function () {
        console.log('connect success')
        //訂閱主题
        client.subscribe(topic, (error) => {
          if (!error) {
            console.log('訂閱成功')
          } else {
            console.log('訂閱失败')
          }
        })
      })
      client.on('message', function (topic, message: string) {
        // console.log('FROM : ', topic, JSON.parse(message))
        const newData = JSON.parse(message).features
        dispatch('updateData', { data: newData })

      })
    },
    removeData(context, ){
      console.log('removeData')
      context.commit('CHANGEDATA')
    }
  },
  modules: {
  }
})
