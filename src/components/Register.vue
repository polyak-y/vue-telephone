<template>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
    class="formRegistration"
    @submit.prevent="submitHandler"
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
      required
    ></v-text-field>
    
    <v-text-field
      v-model="confirmPassword"
      :rules="confirmPasswordRules"
      type="password"
      label="Повторите пароль"
      class="mb-3"
      required
    ></v-text-field>

    <transition  name='errorAnimateRegister'>
      <p v-if="errorAuthReg" class="errorMessageRegister error--text">Пользователь с указанными данными уже зарегистрирован в системе</p>
    </transition>

    <v-btn
      :disabled="!valid || loading"
      color="secondary"
      style="margin-left: 0"
      :loading="loading"
      class="VPregisterOrLoginButton"
      type="submit"
    >
      Зарегистрироваться
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
      loading: false,
      valid: true,
      email: '',
      emailRules: [
        v => !!v || 'Заполните поле',
        v => /.+@.+\..+/i.test(v) || 'Не корректный e-mail'
      ],
      password: '',
      passwordRules: [
        v => !!v || 'Заполните поле'
      ],
      confirmPassword: '',
      confirmPasswordRules: [
        v => v === this.password || 'Пароли не совпадают'
      ]
    }
  },
  computed: {
    errorAuthReg() {
      return this.$store.getters.errorAuthReg
    }
  },
  methods: {
    submitHandler () { // клик на кнопку зарегистрироваться
      if (this.$refs.form.validate()) { 

        this.loading = true
        
        const dataFormRegister = {
          email: this.email,
          password: this.password 
        }

        this.$store.dispatch('addUser', dataFormRegister)
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
  .formRegistration {
    position: relative;
  }

  .errorMessageRegister {
    font-family: 'Scada', sans-serif!important;
    font-size: 16px;
    margin-top: -10px;
  }

  .errorAnimateRegister-enter {
    opacity: 0;
  }

  .errorAnimateRegister-enter-active  {
    transition: all 1s;
  }

  .errorAnimateRegister-leave-active { 
    transition: all 1s;
  }

  .errorAnimateRegister-leave-to { 
    opacity: 0;
  }

  @media (max-width: 768px) {
    .errorMessageRegister {
      line-height: 17px;
    }
  }
 
</style>