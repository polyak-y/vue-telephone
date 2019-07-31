<template>
  <v-layout row justify-center class="VPnoGrow">
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      
      <template v-slot:activator="{ on }">
        <v-btn fab color="secondary" v-on="on">
          <v-icon dark>person_add</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-toolbar dark color="primary" class="VPheaderModal">          
          <v-btn icon dark @click="closeFullModalAdd">
            <v-icon>close</v-icon>
          </v-btn>

          <v-toolbar-title class="VPtitleAddAb">Добавление нового абонента</v-toolbar-title>         
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
                    Выбрать изображение
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
                Добавить абонента
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

export default {
  data() {
    return {
      loadButton: false,
      valid: true,
      dialog: false,
      name: '',
      email: '',
      work: '',
      phone: '+7',
      telegram: '',
      mask: '+7(###) ###-##-##',
      date: '',
      dateFormatted: '',
      menu: false,     
      image: null,
      imageSrc: '',
      select: null,
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
    formatDate (date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${day}.${month}.${year}`
    },    
    closeFullModalAdd() {
      this.$refs.form.resetValidation()
      this.name = ''
      this.phone = '+7'
      this.telegram = ''
      this.date = ''
      this.dateFormatted = ''
      this.email = ''
      this.work = ''
      this.image = null
      this.imageSrc = ''
      this.dialog = false     
      this.select = null 
    },
    async validate() { //клик на кнопку сохранить
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
          work: this.work || 'Не указано',
          ownerId: this.$store.getters.user,
          image: this.image || null
        }

        this.$store.dispatch('addDatabase', data)
        .then(() => {     
          this.$store.dispatch('snackState', {
            text: 'Абонент успешно добавлен',
            color: 'success',
            value: true
          })

          this.loadButton = false

          this.$refs.form.resetValidation()
          this.name = ''
          this.phone = '+7'
          this.telegram = ''
          this.date = ''
          this.dateFormatted = ''
          this.email = ''
          this.work = ''
          this.image = null
          this.imageSrc = ''
          this.dialog = false     
          this.select = null      
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
        reader.readAsDataURL(file) // этот метод добаляем в reader.result код для предпросмотра файла

        reader.onload = () => {
          this.imageSrc = reader.result
        }
        
        this.image = file
      }  
    },
    deleteImageHandler(){
      this.imageSrc = ''
      this.image = null   
    }
  }  
}
</script>

<style>
  .VPtitleAddAb {
    font-family: 'Scada', sans-serif!important;
    font-size: 25px;
  } 

  .VPheaderModal {
    position: sticky;
    top: 0;
    z-index: 99;
  }

  @media (max-width: 420px) {
    .VPtitleAddAb {
      font-size: 20px;
    }
  }
 
  @media (max-width: 350px) {
    .VPtitleAddAb {
      font-size: 17px;
    }
  }

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

  @media (max-width: 500px) {
    .VPavatar {
      left: 0!important;
    }

    .VPwrapAvatar {
      text-align: center;
    }
  }

  .VPbuttonImg, .VPbuttonAddAb {
    width: 295px; 
    font-family: 'Scada', sans-serif!important;  
    font-size: 16px; 
  }

  @media (max-width: 660px) {
    .VPbuttonImg, .VPbuttonAddAb {
      margin-left: 0;
      margin-right: 20px;
    }
  }

  @media (max-width: 500px) {
    .VPbuttonAddAb, .VPbuttonImg  {
      width: 100%!important;
      margin-left: 0;
      margin-right: 0;
    }
  }
</style>