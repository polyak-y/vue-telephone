import * as firebase from 'firebase/app'
import 'firebase/database'

export default {
  state: {
    user: null,
    localStore: false,
    errorAuth: false,
    errorAuthReg: false,
    authVisible: true, //используется в App.vue, для того чтобы при перезагрузке когда пользователь зарегистрирован не показывалась форма входа/регистрации пока в локалсторадж заносятся данные
  },
  mutations: {
    addStateUser(state, payload) {      
      state.user = payload
    },
    localStoreState(state, payload) {
      state.localStore = payload
    },
    removeUser(state) {
      state.user = null 
    },   
    authorizationLog(state, payload) {
      state.errorAuth = payload
    },
    authorizationReg(state, payload) {
      state.errorAuthReg = payload
    },    
    authVisibleState(state, payload) {
      state.authVisible = payload
    }
  },
  actions: {
    async addUser({commit}, payload) { //клик на кнопку зарегистрироваться в Register.vue
      commit('authorizationReg', false) //удалили ошибку авторизации

      try {
        const fbVal = await firebase.database().ref('users').orderByChild('email').equalTo(payload.email).once('value')
        const userData = fbVal.val()

        if(!userData) {
          const newUserId = await firebase.database().ref('users').push(payload) //положили в базу данных сведения о пользователе email и пароль   
          commit('addStateUser', newUserId.key) //id объекта с данными пользователя положили в state   
          localStorage.setItem('user', newUserId.key)   
          commit('localStoreState', true)
        } else {
          commit('authorizationReg', true) // поставили ошибку авторизации  
        }        
      } catch(e) {
        console.log(e)
      }      
    },
    async loginned({commit}, payload) { //клик на кнопку войти в Login.vue

      commit('authorizationLog', false) //удалили ошибку авторизации

      try {
        const fbVal = await firebase.database().ref('users').orderByChild('email').equalTo(payload.email).once('value')
        const userData = fbVal.val()

        if(userData) {
          let arrUserData = Object.entries(userData)[0]
          
          if(arrUserData[1].email === payload.email && arrUserData[1].password === payload.password) { // если логин и пароль совпадают
            commit('addStateUser', arrUserData[0]) //id объекта с данными пользователя положили в state   
            localStorage.setItem('user', arrUserData[0])   
            commit('localStoreState', true) //сделали localstore = true                
          } else {
            commit('authorizationLog', true) // поставили ошибку авторизации           
          }          
        } else {
          commit('authorizationLog', true) // поставили ошибку авторизации           
        }        
      }catch(e) {
        console.log('Ошибка при входе в приложение: ', e)
      }      
    },
    async reloadUser({commit}, payload) { //загружает id пользователя из localstorage. Использую в App.vue, срабатывает при перезагрузке   
      commit('authVisibleState', false) 
      const fbVal = await firebase.database().ref(`users/${payload}`).once('value')
      const userData = fbVal.val()

      if(userData) {
        commit('addStateUser', payload)
        commit('localStoreState', true)              
      } else {
        localStorage.removeItem('user')
        commit('authVisibleState', true)
      }
    },
    exitAccount({commit}) {//при нажатии на кнопку выхода в NoutePhone.vue
      localStorage.removeItem('user')
      commit('removeUser')
      commit('localStoreState', false)
      commit('authVisibleState', true) 
    }
  },
  getters:{
    user(state) {
      return state.user
    },
    localStore(state) {
      return state.localStore
    },
    errorAuth(state) {
      return state.errorAuth
    },
    errorAuthReg(state) {
      return state.errorAuthReg
    },    
    authVisible(state) {
      return state.authVisible
    }
  } 
}