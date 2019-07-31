<template>
  <v-layout row justify-center class="VPnoGrow">
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      
      <template v-slot:activator="{ on }">
        <v-btn fab dark small color="success" v-on="on">
          <v-icon>edit</v-icon>
        </v-btn> 
      </template> 

      <v-card>
        <v-toolbar dark color="primary" class="VPheaderModal">
          <v-btn icon dark @click="closeFabChange">
            <v-icon>close</v-icon>
          </v-btn>      

          <v-toolbar-title class="VPtitleEdit">Редактирование данных абонента: <b>{{activAbonent.name}}</b></v-toolbar-title>         
        </v-toolbar> 

        <v-container>
          <v-layout>
            <v-flex xs12>
              <v-form ref="form" v-model="valid" lazy-validation>
                <!-- поле для ввода ФИО -->
                <v-text-field 
                  v-model="name"
                  label="ФИО абонента*"
                  :rules="nameRules"
                  required
                  prepend-inner-icon="tag_faces"
                ></v-text-field>

                <!-- поле для ввода телефона -->
                <v-text-field 
                  v-model="phone"
                  label="Номер телефона*"
                  prepend-inner-icon="phone"
                  :rules="phoneRules"
                  required
                  :mask="mask"
                ></v-text-field>

                <!-- Селект для выбора категории -->
                <v-select
                  v-model="select"
                  :items="items"
                  :rules="[v => !!v || 'Выберите в какой категрии должен быть абонент']"
                  label="Категория*"
                  required
                  prepend-inner-icon="list"     
                ></v-select>
              
                <!-- поле для ввода телеграмма -->
                <v-text-field 
                  v-model="telegram"
                  label="Телеграм"
                  prepend-inner-icon="fa-telegram fa-lg"               
                ></v-text-field>             

                <!-- поле для календарика -->
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                  max-width="290px"
                  min-width="290px"                
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="dateFormatted"
                      label="Дата рождения"
                      prepend-inner-icon="event"
                      v-on="on"
                      readonly
                    ></v-text-field>
                  </template>

                  <v-date-picker 
                    class="VPcalendar"
                    v-model="date" 
                    picker-date
                    @input="menu = false" 
                    locale="ru"
                    first-day-of-week="1"     
                    header-color="secondary"                              
                  >
                  </v-date-picker>
                </v-menu>     

                <!-- поле для ввода email -->
                <v-text-field
                  v-model="email"                
                  label="E-mail"         
                  prepend-inner-icon="alternate_email"       
                ></v-text-field>
              
                <!-- поле для места работы -->
                <v-text-field
                  v-model="work"                
                  label="Место работы"         
                  prepend-inner-icon="work"       
                ></v-text-field>

                <!-- поле для загрузки изображений -->
                <v-layout>
                  <v-flex xs12 class="VPwrapAvatar">
                    <v-avatar size="88">
                      <v-img :src="this.imageSrc" class="mb-4 VPavatar"></v-img>
                    </v-avatar>
                  </v-flex>
                </v-layout>

                <v-layout>
                  <v-flex xs12> 
                    <v-btn class="secondary ml-0 VPbuttonImg" @click="triggerUpload">
                      Выбрать новое изображение
                      <v-icon right dark>cloud_upload</v-icon>
                    </v-btn>
                    <br>
                    <v-btn class="error ml-0 VPbuttonImg" :disabled="!imageSrc" @click="deleteImageHandler">
                      Удалить изображение
                      <v-icon right dark>delete_forever</v-icon>
                    </v-btn>

                    <input 
                      ref="fileInput" 
                      type="file" 
                      style="display: none" 
                      accept="image/*"
                      @change="onFileChange"
                    >                   
                  </v-flex>
                </v-layout>

                <v-divider class="mb-4 mt-2"></v-divider>
                                      
                <v-btn :disabled="!valid || loadButton" :loading="loadButton" color="success" @click="validate" class="ml-0 VPbuttonAddAb">
                  Отредактировать данные абонента
                </v-btn>

                <v-btn color="error" @click="reset" class="VPbuttonAddAb">
                  Очистить форму
                </v-btn>     
              </v-form>
            </v-flex>
          </v-layout>
        </v-container>       
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { setTimeout } from 'timers';
export default {
  props: ['activAbonent', 'fabProps'],
  data() {
    return {  
      fabPropsData: this.fabProps,
      loadButton: false,
      valid: true,
      dialog: false,
      name: this.activAbonent.name,
      email: this.activAbonent.email,
      work: this.activAbonent.work,
      phone: this.activAbonent.phone.replace(/\D+/g,""),
      telegram: this.activAbonent.telegram,
      mask: '+7(###) ###-##-##',
      date: '',
      dateFormatted: this.activAbonent.birthday,
      menu: false,     
      image: null,
      imageSrc: this.activAbonent.imageSrc,
      imageName: this.activAbonent.imageName,
      select: this.activAbonent.category,
      id: this.activAbonent.id,
      ownerId: this.activAbonent.ownerId,
      items: [
        'Семья',
        'Друзья',
        'Работа',
        'Другое'
      ],
      nameRules: [
        v => !!v || 'Поле обязательно для заполнения'        
      ],
      phoneRules: [
        v => v.length === 11 || 'Поле обязательно для заполнения'
      ]
    }
  },
  watch: {
    date () {
      this.dateFormatted = this.formatDate(this.date)
    }    
  },
  methods: {
    closeFabChange() {// метод для закрытия меню плавающей кнопки
      setTimeout(()=> {
        this.fabPropsData = false
        this.$emit('closeFab', this.fabPropsData) //closeFab = событие которое сработает когда мы кликнем на кнопку закрытия модального окна и она поменяет fab находящийся в родительском компоненте NoutePhone.vue, который закрывает float button
      }, 200)          
      
      this.dialog = false
    },
    formatDate (date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${day}.${month}.${year}`
    },    
    async validate() { //клик на кнопку отредактировать
      if (this.$refs.form.validate()) {
        
        await this.$store.dispatch('clearSnackDispatch')
        
        this.loadButton = true

        const data = {
          name: this.name,
          phone: this.phone,
          category: this.select,
          telegram: this.telegram || 'Не указан',
          birthday: this.dateFormatted || 'Не указана',
          email: this.email || 'Не указан',
          work: this.work || 'Не указана',
          ownerId: this.ownerId,
          image: this.image || null,
          imageSrc: this.imageSrc,
          imageName: this.imageName,
          id: this.id
        }
          
        this.$store.dispatch('editOneNumberAbonent', data)
        .then(()=> { 
          this.dialog = false 
          this.loadButton = false     
          this.$store.dispatch('snackState', {
            text: 'Данные абонента успешно отредактированы',
            color: 'success',
            value: true
          })                
        })
        .catch(() => {
          this.loadButton = false
        })                     
      }
    },
    reset () { //клик на кнопку сбросить форму
      this.$refs.form.reset()
      this.imageSrc = '' 
      this.loadButton = false     
    },
    triggerUpload(){ // клик на кнопку загрузки имитация на клик по input type=file
      this.$refs.fileInput.click()
    },
    onFileChange(event) { // выбор картинки
      const file = event.target.files[0]
      if(file) {
        const reader = new FileReader()   
        reader.readAsDataURL(file) // этот метод позволяет сделать предпросмотр выбранног файла   
        
        reader.onload = () => {
          this.imageSrc = reader.result
        }
      
        this.image = file
      } 
    },
    deleteImageHandler() { //удаление картинки
      this.imageSrc = ''
      this.image = null    
    }
  }  
}
</script>

<style>
  .VPnoGrow {
    flex-grow: 0;
  }

  .VPcalendar  .v-picker__title__btn:not(.v-picker__title__btn--active){
    opacity: 1;
    font-size: 35px;
    justify-content: center;
  }

  .VPcalendar .v-date-picker-title__date > div {
    font-size: 12px;
    text-align: center;
  }

  .VPavatar {
    position: relative;
    left: 85px;
    top: 7px;
  }

  .VPtitleEdit {
     font-family: 'Scada', sans-serif!important;
  }

  .VPbuttonImg {
    width: 295px;
  }
</style>