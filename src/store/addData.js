import * as firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/storage'

export default {
  state: {
    abonents: [],
    snakState: {
      value: false,
      text: 'Привет я снэкбар!',
      color: 'success'
    }
  },
  mutations: {
    addStateAbonents(state, payload) {
      state.abonents.push(payload) //заносим нового пользователя в state
    },
    addAllAbonentsState(state, payload) {
      state.abonents = payload //заносим весь полученный массив абонентов
    },
    updateData(state, payload) {
      let indexEditAbonent = state.abonents.findIndex(elem => elem.id === payload.id)
      return state.abonents.splice(indexEditAbonent, 1, payload)
    },
    deleteOneAbonent(state, payload) {      
      let indexEditAbonent = state.abonents.findIndex(elem => elem.id === payload)
      return state.abonents.splice(indexEditAbonent, 1)
    },
    clearAbonent(state) {
      state.abonents = []
    },
    changeSnack(state, payload) {
      state.snakState = {
        ...state.snakState,
        ...payload
      }
    },
    clearSnack(state) {
      state.snakState = {
        ...state.snakState,
        value: false
      }
    }
  },
  actions: {    
    async addDatabase({commit}, payload) { //добавление нового абонента в базу данных

      const addData = {
        name: payload.name,
        phone: payload.phone,
        category: payload.category,
        telegram: payload.telegram,
        birthday: payload.birthday,
        email: payload.email,
        work: payload.work,
        ownerId: payload.ownerId,
        imageSrc: '',   
        imageName: ''     
      }

      const stylePhone = '+' + addData.phone.substring(0,1) + "(" + addData.phone.substring(1,4) + ') ' + addData.phone.substring(4,7) + '-' + addData.phone.substring(7,9) + '-' + addData.phone.substring(9)
      addData.phone = stylePhone //преобразовали номер
      

      if(!payload.image) addData.imageSrc = 'https://firebasestorage.googleapis.com/v0/b/vue-telephone.appspot.com/o/1_j3byFpgqYxKQdvJgBofhqA.jpg?alt=media&token=096bf3d6-6294-4e14-a1b7-409ba4b67127' //если картинку не выбрали берем эту

      try {
        const idAbonent = await firebase.database().ref('phoneNumber').push(addData) //добавили объект addDatat в firebase
        addData.id = idAbonent.key //занесли в объект addData id добавленного номера
        
        if(payload.image) { //если загрузили картинку для абонента
          const image = payload.image
          
          const imageExt = image.name.slice(image.name.lastIndexOf('.')) //получили расширение картинки (png, jpg, svg  и т.д.)

          const fileData = await firebase.storage().ref(`imageAbonents/${idAbonent.key}${imageExt}`).put(payload.image) //переименованную картинку закинули в storage firebase. ad.key - это id объекта который занесли. Название картинки теперь = id.key
          const imageSrc = await fileData.ref.getDownloadURL() //получили ссылку на картинку

          await firebase.database().ref('phoneNumber').child(idAbonent.key).update({imageSrc: imageSrc, imageName: idAbonent.key + imageExt}) // это метод для внесения изменений в базу данных. 
          addData.imageSrc = imageSrc
          addData.imageName = idAbonent.key + imageExt
        }
        commit('addStateAbonents', addData)
      } catch(e) {
        
        commit('changeSnack', {
          text: `Ошибка при загрузке нового абонента: ${e}`,
          color: 'error',
          value: true
        })   

        throw error
      }      
    }, 
    async getFireBaseDataAbonents({commit, getters}) { //получение всех абонентов
      const allAbonents = []
      commit('clearAbonent')
      commit('setLoading', true)    

      try {       
        const fbVal = await firebase.database().ref('phoneNumber').orderByChild('ownerId').equalTo(getters.user).once('value')
        const abonentsData = fbVal.val()

        if(abonentsData) {
          Object.entries(abonentsData).forEach(([key, obj]) => {
            const oneAbonent = {
              name: obj.name,
              phone: obj.phone,
              category: obj.category,
              telegram: obj.telegram,
              birthday: obj.birthday,
              email: obj.email,
              work: obj.work,
              ownerId: obj.ownerId,
              imageSrc: obj.imageSrc,
              imageName: obj.imageName,
              id: key 
            }
            allAbonents.push(oneAbonent) 
          })
        } 

        commit('addAllAbonentsState', allAbonents)       
        
        setTimeout(()=> {
          commit('setLoading', false)
        },2000)

      } catch(e) {
        commit('changeSnack', {
          text: `Ошибка при получении абонентов из firebase: ${e}`,
          color: 'error',
          value: true
        })

        throw error
      }
    },
    async editOneNumberAbonent({commit}, payload){ //редактирование абонента

      const editData = {
        name: payload.name,
        phone: payload.phone,
        category: payload.category,
        telegram: payload.telegram,
        birthday: payload.birthday,
        email: payload.email,
        work: payload.work,
        ownerId: payload.ownerId,
        image: payload.image,
        imageSrc: payload.imageSrc,
        imageName: payload.imageName
      }

      const stylePhoneEdit = '+' + editData.phone.substring(0,1) + "(" + editData.phone.substring(1,4) + ') ' + editData.phone.substring(4,7) + '-' + editData.phone.substring(7,9) + '-' + editData.phone.substring(9)
      editData.phone = stylePhoneEdit //преобразовали номер

      if(!payload.image && !editData.imageSrc) editData.imageSrc = 'https://firebasestorage.googleapis.com/v0/b/vue-telephone.appspot.com/o/1_j3byFpgqYxKQdvJgBofhqA.jpg?alt=media&token=096bf3d6-6294-4e14-a1b7-409ba4b67127' //если картинку не выбрали берем эту
      
       try {
        await firebase.database().ref('phoneNumber').child(payload.id).update(editData) // это метод ля внесения изменений в базу данных. 
        
        editData.id = payload.id        
  
        if(payload.image) { //если загрузили картинку для абонента
          const image = payload.image 
          
          const imageExt = image.name.slice(image.name.lastIndexOf('.')) //получили расширение картинки (png, jpg, svg  и т.д.)
  
          const fileData = await firebase.storage().ref(`imageAbonents/${payload.id}${imageExt}`).put(payload.image) //переименованную картинку закинули в storage firebase. ad.key - это id объекта который занесли. Название картинки теперь = id.key
          const imageSrc = await fileData.ref.getDownloadURL() //получили ссылку на картинку
          await firebase.database().ref('phoneNumber').child(payload.id).update({imageSrc: imageSrc, imageName: payload.id + imageExt}) // это метод для внесения изменений в базу данных. 
          editData.imageSrc = imageSrc
          editData.imageName = payload.id + imageExt
        }  
        commit('updateData', editData)
  
       } catch(e) {
          commit('changeSnack', {
            text: `Ошибка при редактировании данных абонента: ${e}`,
            color: 'error',
            value: true
          })

          throw error
       }
    },
    async deleteAbonent({commit}, payload) { // удаление абонента и его картинки
      try {
        await firebase.database().ref('phoneNumber').child(payload.id).remove()       
        commit('deleteOneAbonent', payload.id) 
        if(payload.imageName) {
          await firebase.storage().ref(`imageAbonents/${payload.imageName}`).delete()
        }         
      }catch(e) {
        commit('changeSnack', {
          text: `Ошибка при удалении абонента: ${e}`,
          color: 'error',
          value: true
        })

        throw error
      }     
    },
    snackState({commit}, payload) { //показываем snackbar
      commit('changeSnack', payload)     
    },
    clearSnackDispatch({commit}) { //очищаем (скрываем) snackbar
      commit('clearSnack')
    }
  },
  getters:{
    postAllAbonents(state) {
      return state.abonents
    },
    snakState(state) {
      return state.snakState
    }
  } 
}
