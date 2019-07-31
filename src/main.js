import Vue from 'vue'
import './plugins/vuetify'
import Vuetify from 'vuetify'
import App from './App.vue'
import * as firebase from "firebase/app"
import store from './store'
import 'font-awesome/css/font-awesome.min.css'  


Vue.config.productionTip = false

Vue.use(Vuetify, { 
  theme: {
    primary: '#039BE5', //cветло-синий
    secondary: '#0277BD', // темно-синий
    accent: '#607D8B', //сине-серый
    error: '#E57373',//ошибка светло-красная
    warning: '#EEFF41',
    info: '#607D8B', //
    success: '#7CB342' //светло-зеленый
  }
})

Vue.use(Vuetify, {
  iconfont: 'fa4'
})


new Vue({
  render: h => h(App),
  store: store,
  created() {
    firebase.initializeApp({
      apiKey: "AIzaSyB_Eo1pPhVpeNE9DS6NZxjC4BmfZkA8GCM",
      authDomain: "vue-telephone.firebaseapp.com",
      databaseURL: "https://vue-telephone.firebaseio.com",
      projectId: "vue-telephone",
      storageBucket: "vue-telephone.appspot.com",
      messagingSenderId: "1097914112812",
      appId: "1:1097914112812:web:0dfac513c03ec2a2"
    })
  }
}).$mount('#app')
