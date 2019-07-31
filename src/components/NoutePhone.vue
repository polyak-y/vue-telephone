<template>  
  <v-container class="VPcontPhone"> 
    <app-snack-bar-alerts></app-snack-bar-alerts>
    <transition name="loadAn" mode="out-in">
      <v-layout key="noLoad" v-if="!loading" class="VPcardLayout">
        <v-flex>
          <v-card class="telephoneCard d-flex column">
            <v-card-title class="primary white--text headline">
            <span class="VPtitle">Телефонный справочник</span>
              <v-text-field
                v-model="search"
                label="Поиск абонента..."
                dark
                flat
                solo-inverted
                hide-details
                clearable
                clear-icon="close" 
                prepend-inner-icon="search"
                class="VPsearch"
              ></v-text-field>

              <v-btn fab color="accent" class="VPlistAbonentsButton" dark @click="openList = !openList">
                <v-icon dark v-if="!openList">contact_phone</v-icon>
                <v-icon dark v-else>close</v-icon>
              </v-btn>  
       
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <div v-on="on">
                    <app-full-modal-add></app-full-modal-add> 
                  </div>              
                </template> 
                <span>Добавить абонента</span>
              </v-tooltip>
            
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn fab color="error" dark v-on="on" @click="exitAccount">
                    <v-icon dark>exit_to_app</v-icon>
                  </v-btn>           
                </template> 
                <span>Выход</span>
              </v-tooltip>

            </v-card-title>

            <v-layout justify-space-between pa-3 VPwrapCont>
            <!-- =================левая часть=================== -->
              <v-flex xs5  class="leftPartPhone" :class="{'open': openList}" @click="clickAbonentsHandler"> 
                <v-treeview              
                  :active.sync="active"
                  :items="items"
                  :search="search"
                  :filter="filter"                
                  activatable
                  active-class="primary--text"
                  class="grey lighten-5"
                  open-on-click
                  transition
                >
                  <template v-slot:prepend="{ item, active }">
                    <v-icon v-if="!item.children" :color="active ? 'primary' : ''">
                      sentiment_satisfied_alt
                    </v-icon>                  
                  </template>               
                </v-treeview>
              </v-flex>
              <!-- =================правая часть=================== -->
              <v-flex d-flex text-xs-center class="VPpositionR">
                <v-scroll-y-transition mode="out-in">
                  <div v-if="!selected" class="title grey--text text--lighten-1 font-weight-light" style="align-self: center;">
                    Выберите абонента
                  </div>

                  <v-card v-else :key="selected.id" class="pt-4 mx-auto VPpips" flat max-width="100%">
                    <!-- ===== float button ===== -->
                    <v-speed-dial
                      v-model="fab"
                      :top="top"                    
                      :right="right"                   
                      :direction="direction"
                      :transition="transition"                    
                    >
                      <template v-slot:activator>
                        <v-btn v-model="fab" color="secondary" dark fab>
                          <v-icon>build</v-icon>
                          <v-icon>close</v-icon>
                        </v-btn>
                      </template>                         

                      <!-- кнопка редактировать данные абонента -->
                      <v-tooltip left>
                        <template v-slot:activator="{ on }">
                          <div v-on="on" class="pips">
                            <app-full-modal-edit @closeFab="fab = $event" :fabProps="fab" :activAbonent="selected"></app-full-modal-edit>   
                          </div>              
                        </template> 
                        <span>Редактировать данные абонента</span>
                      </v-tooltip>         

                      <v-tooltip left>
                        <template v-slot:activator="{ on }">
                          <v-btn fab dark small color="error" v-on="on" @click="deleteAbonent">
                            <v-icon>delete</v-icon>
                          </v-btn>
                        </template>
                        <span>Удалить абонента</span>
                      </v-tooltip>                    
                    </v-speed-dial>
                    <!-- ===== end float button ===== -->

                    <v-card-text>
                      <v-avatar size="100" class="avatarAbonents mb-4">
                        <v-img :src="selected.imageSrc"></v-img>
                      </v-avatar>                                           
                      <div class="mainAbonent">
                        <p><b>Имя:</b> {{ selected.name }}</p>
                        <p><b>Телефон:</b> {{ selected.phone }}</p>
                        <p><b>Дата рождения:</b> {{ selected.birthday }}</p>                      
                        <p><b>Email:</b> {{ selected.email }}</p>
                        <p><b>Telegram:</b> {{ selected.telegram }} </p>
                        <p><b>Место работы:</b> {{ selected.work }}</p>   
                      </div>                 
                    </v-card-text>
                  </v-card>
                </v-scroll-y-transition>
              </v-flex>
            </v-layout>
          </v-card>       
        </v-flex>       
      </v-layout>    
      <!-- если список не подгрузился показываем лоадер -->
      <v-layout key="yesLoad" class=VPloading v-else>
        <v-flex class="VPloading__flex">
          <v-card color="primary" dark>
          <v-card-text class="containerProgress">
            Пожалуйста подождите...
            <v-progress-linear
              indeterminate
              color="white"
              class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
        </v-flex>      
      </v-layout>        
    </transition>
  </v-container>
</template>

<script>
  import FullModalAdd from './FullModalAdd'
  import FullModalEdit from './FullModalEdit'
  import SnackBarAlerts from './SnackBarAlerts'

  export default {
    data: () => ({   
      openList: false,   
      search: null,
      caseSensitive: false,
      active: [],      
      /* float button */
      direction: 'bottom',
      fab: false,
      top: true,
      right: true,     
      transition: 'scale-transition'
    }),
    computed: {
      items () {
        return [
          {
            id: 1,
            name: 'Семья',
            children: this.abonents.filter(elem => elem.category === 'Семья')
          },
          {
            id: 2,
            name: 'Друзья',
            children: this.abonents.filter(elem => elem.category === 'Друзья')
          },
          {
            id: 3,
            name: 'Работа',
            children: this.abonents.filter(elem => elem.category === 'Работа')
          },    
          {
            id: 4,
            name: 'Другое',
            children: this.abonents.filter(elem => elem.category === 'Другое')
          }  
        ]
      },
      selected () {
       
        if (!this.active.length) { 
          return undefined
        } 
        this.fab= false
        const id = this.active[0]

        return this.abonents.find(abonent => abonent.id === id)
      },
      filter () {
        return this.caseSensitive
          ? (item, search, textKey) => item[textKey].indexOf(search) > -1
          : undefined
      },
      abonents(){
        return this.$store.getters.postAllAbonents
      },
      loading() {
        return this.$store.getters.loading
      },
      
    },  
    methods: {
      async deleteAbonent() {
        await this.$store.dispatch('clearSnackDispatch')

        this.$store.dispatch('deleteAbonent', {id: this.selected.id, imageName: this.selected.imageName})
        .then(() => {
          this.$store.dispatch('snackState', {
            text: 'Абонент удален из справочника',
            color: 'success',
            value: true
          })
        })
      },
      exitAccount() {
        this.$store.dispatch('exitAccount')
      },
      clickAbonentsHandler(event) { //клик для моб. устройств, закрываюший список контактов
        if(event.target.closest('.v-treeview-node__children') && this.active.length > 0) {
          this.openList = false
        }
      }
    },
    components: {
      appFullModalAdd: FullModalAdd,
      appFullModalEdit: FullModalEdit,
      appSnackBarAlerts: SnackBarAlerts
    },
    created() {     
      this.$store.dispatch('getFireBaseDataAbonents') //находится в addData.js - для получения всех абонентов пользователя      
    },
    destroyed() {
      this.$store.dispatch('clearSnackDispatch') 
    }  
  }
</script>

<style>
  .telephoneCard {
    width: 100%;
    border-radius: 7px;
    height: calc(100vh - 48px);
    flex-direction: column;
    background: rgba(255, 255, 255, .4)!important;
  }

  .VPlistAbonentsButton {
    display: none;
  }

  .telephoneCard .v-card__title {
    flex-grow: 0!important;
    padding: 8px 16px;
    border-radius: 7px 7px 0 0;
  }

  .telephoneCard .v-input__slot  {
    border: 1px solid rgba(255, 255, 255, .3);
  }

  .leftPartPhone {
    background: #fafafa;
    padding: 15px;
    padding-left: 0;    
    max-height: 100%;
    overflow: auto;
    border: 1px solid #d3d3d3;
    border-radius: 7px;
  }

  .VPwrapCont {
    max-height: 100%;
    overflow: auto;
  }  

  .leftPartPhone::-webkit-scrollbar-button {
    background-image:url('');
    background-repeat:no-repeat;
    width:5px;
    height:0px
  }

  .leftPartPhone ::-webkit-scrollbar-track {
    background: green;
  }

  .leftPartPhone::-webkit-scrollbar-thumb {
    -webkit-border-radius: 0px;
    border-radius: 0px;
    background-color:#0277BD;
  }

  .leftPartPhone::-webkit-scrollbar-thumb:hover{
    background-color:#039BE5;
  }

  .leftPartPhone::-webkit-resizer{
    background-image:url('');
    background-repeat:no-repeat;
    width:4px;
    height:0px
  }

  .leftPartPhone::-webkit-scrollbar{
    width: 5px;
  }

  .leftPartPhone .v-treeview-node--leaf  {
    margin-left: 15px;
  }

  .VPtitle {
    margin-right: 15px;
    font-family: 'Scada', sans-serif!important;
    font-weight: bold;
  }  

  .avatarAbonents  .v-image{
    border: 3px solid #039be5;
  }

  .mainAbonent p {
     font-family: 'Scada', sans-serif!important;
     font-size: 18px;
     margin-bottom: 5px;
  }

  .mainAbonent p:first-child {
     font-size: 25px;
     font-weight: bold;
     color: #039be5;
  }

  .VPloading {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .VPloading__flex {
    flex-grow: 0;
  }

  .containerProgress {
    font-family: 'Scada', sans-serif!important;
    font-size: 18px;
    position: fixed;
    width: 250px;
    background: #039BE5;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .v-speed-dial {
    position: absolute!important;
    right: 0;
    top: 0px!important;
  }

  .v-btn--floating {
    position: relative;
  }

  .VPpositionR {
    position: relative;
  }  

  .leftPartPhone  .v-treeview-node__label {
    font-family: 'Scada', sans-serif!important;
    font-size: 18px;   
    color: rgba(0,0,0, .54);
  }

  .leftPartPhone .v-treeview-node__content > .v-treeview-node__label:first-child {
    text-transform: uppercase;
    font-weight: bold;
    color: #000;
    margin-left: -19px;
  }

  .v-treeview-node__root.primary--text .v-treeview-node__label {
    color: #039be5 ;
  }

  .leftPartPhone .v-treeview-node__content  {
    padding: 10px 0 10px 25px;
    border-bottom: 1px solid #ececec;
    transition: all .3s;
  }

  .leftPartPhone .v-treeview-node__content:hover {
    background: #ececec;
  }

  .loadAn-enter {
    opacity: 0;
  }

  .loadAn-enter-active  {
    transition: all .5s;
  }

  .loadAn-leave-active { 
    transition: all .5s;
  }

  .loadAn-leave-to { 
    opacity: 0;
  }

  .VPsearch {
    font-family: 'Scada', sans-serif!important;
    margin-right: 15px!important;
  }
 
  .VPpips.theme--light.v-sheet {
    background: rgba(255,255,255, .4);
  }

 /* ====================media======================= */
  @media (max-width: 768px) {    
    .VPlistAbonentsButton {
      display: block;
    }

    .VPcontPhone {
      display: flex;
      flex-direction: column;
    }

    .telephoneCard {
      height: 100%;
      flex-grow: 1;
      border-radius: 7px;
    }

    .telephoneCard .headline {
      height: 116px;
      box-sizing: border-box;
    }

    .VPcardLayout {
      height: 100%;
    }

    .VPpositionR {
      order: -1;
    }

    .VPpositionR .title {
      padding-top: 15px;
      padding-bottom: 15px;
    } 

    .leftPartPhone.xs5 {
      max-width: none;
      width: calc(100vw - 32px);
      height: 100%;
      max-height: 100%!important;
      flex-grow: 1;
      border-radius: 0 0 7px 7px;
      position: absolute;
      top: 0;
      left: -100%;
      padding: 15px;      
      z-index: 98;
      transition: all .3s;
    }

    .leftPartPhone.xs5.open {
      left: 0;
    }

    .VPwrapCont {
      flex-direction: column;
      padding: 0!important; 
      position: relative;     
    }

    .VPtitle {
      width: 100%;
      text-transform: uppercase;
      text-align: center;
      margin-right: 0;
    }    
  }

  @media (max-width: 550px) {
    .telephoneCard .v-card__title {
      justify-content: flex-end;
    }

    .telephoneCard .headline {
      height: 194px;
      box-sizing: border-box;
    }

    .VPsearch {
      width: 100%;
      margin-top: 15px!important;
      margin-bottom: 15px!important;
      margin-right: 0!important;
    } 
  }

  @media (max-width: 500px) {
    .telephoneCard .headline {
      height: 200px;
    }

    .leftPartPhone.xs5 {
      width: 100%;      
    }  

    .VPtitle {
      margin-top: 10px;
    }

    .VPcontPhone {
     padding: 0;
    }
  }

  @media (max-width: 450px) {
    .VPtitle {
      font-size: 18px;
    }
  }

   @media (max-width: 350px) {
    .mainAbonent p {
      font-size: 16px;
    }

    .mainAbonent p:first-child {
     font-size: 20px;     
    }
  }

</style>