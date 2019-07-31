<template> 
  <v-app>  
    <div class="appMain">  
      <transition name="appAn" mode="out-in" appear>      
        <app-noute-phone key="phone" v-if="localStore"></app-noute-phone>
        <app-register-login v-else-if="!localStore && authVisible" key="registerForm"></app-register-login>     
      </transition>   
    </div>
  </v-app>
</template> 

<script>
import RegisterOrLogin from './components/RegisterOrLogin'
import NoutePhone from './components/NoutePhone'

export default {  
  computed: {
    localStore() {
      return this.$store.getters.localStore
    },
    user() {
      return this.$store.getters.user
    },
    authVisible() {
      return this.$store.getters.authVisible
    }    
  },
  components: {
    appRegisterLogin: RegisterOrLogin,
    appNoutePhone: NoutePhone
  },
  created() {
    if(localStorage.getItem('user')) {
      this.$store.dispatch('reloadUser', localStorage.getItem('user'))
    }    
  }  
}
</script>

<style>
  body {
    font-family: 'Scada', sans-serif!important;
    font-size: 16px;
  }

  .appMain {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;    
    background: url('./img/building.jpg') no-repeat;
    background-size: cover;
    background-attachment: fixed;
  }

  .appAn-enter {
    opacity: 0;
  }

  .appAn-enter-active  {
    transition: all .5s;
  }

  .appAn-leave-active { 
    transition: all .5s;
  }

  .appAn-leave-to { 
    opacity: 0;
  }
</style>

