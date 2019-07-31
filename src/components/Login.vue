<template>
  <v-form
    ref="form"
    v-model="valid"
    @submit.prevent="submitHandler"
    lazy-validation
  >
    <v-text-field
      v-model="email"
      :rules="emailRules"
      label="E-mail"
      required
    ></v-text-field>

    <v-text-field
      v-model="password"
      :rules="passwordRules"
      type="password"
      label="Пароль"
      class="mb-3"
      required
    ></v-text-field>

    <transition  name='errorAnimate'>
      <p v-if="errorAuth" class="errorMessage error--text">Пользователь с такими данными не зарегистрирован в системе</p>
    </transition>
    
        
    <v-btn 
      :disabled="!valid || loading" 
      :loading="loading" 
      color="secondary" 
      type='submit'      
      class="VPregisterOrLoginButton"
    >
      Войти
    </v-btn>

    <v-btn 
      color="error" 
      @click="reset" 
      class="VPregisterOrLoginButton"
    >
      Очистить форму
    </v-btn>                
  </v-form>
</template>

<script>
export default {
  data() {
    return {
      valid: true,
      loading: false,
      email: '',
      emailRules: [
        v => !!v || 'Заполните поле',
        v => /.+@.+\..+/i.test(v) || 'Не корректный e-mail'
      ],
      password: '',
      passwordRules: [
        v => !!v || 'Заполните поле'
      ]
    }
  },
  computed: {
    errorAuth() {
      return this.$store.getters.errorAuth
    }
  },
  methods: {
    submitHandler () { //клик на кнопку войти в форме входа      

      if (this.$refs.form.validate()) {
        
        this.loading = true

        const dataForm = {
          email: this.email,
          password: this.password
        }

        this.$store.dispatch('loginned', dataForm)
          .then(() => {
            this.loading = false
          })         
      }
    },
    reset () {
      this.$refs.form.reset()
    },
  }
}
</script>

<style>
  .VPregisterOrLoginButton {
    font-family: 'Scada', sans-serif!important;
    font-size: 16px;
  }

  .errorMessage {
    font-family: 'Scada', sans-serif!important;
    font-size: 16px;
    margin-top: -10px;
  }

  .errorAnimate-enter {
    opacity: 0;
  }

  .errorAnimate-enter-active  {
    transition: all 1s;
  }

  .errorAnimate-leave-active { 
    transition: all 1s;
  }

  .errorAnimate-leave-to { 
    opacity: 0;
  }
  
  @media (max-width: 768px) {
    .errorMessage {
      line-height: 17px;
    }
  }

  @media (max-width: 500px) {
    .VPregisterOrLoginButton {
      width: 100%;
      margin-left: 0;
    }
  }
</style>