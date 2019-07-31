<template>
  <v-container class="containerTabs">
    <v-layout >
      <v-flex xs12>
        <h2 class="text-xs-center mb-2 VPheader">Зарегистрируйтесь или войдите</h2>
        <v-tabs 
          v-model="active" 
          color="primary" 
          dark 
          slider-color="#B3E5FC"
          max="200"
          grow     
          class="tabsBlock elevation-5"                      
        >

          <v-tab v-for="item in items" :key="item.title" ripple style="cursor: pointer" :class="['VP50', {'oneVP': item.title === 'Вход'}]">
            <v-icon class="mr-1">{{ item.icon }}</v-icon> 
            {{ item.title }}
          </v-tab>
          <!-- ================================ -->
          <v-tab-item v-for="n of 2" :key="n">
            <v-card flat>
              <v-card-text>
                <app-login v-if="n === 1"></app-login>
                <app-register v-else></app-register>
              </v-card-text>
            </v-card>           
          </v-tab-item>

        </v-tabs>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Register from './Register'
import Login from './Login'


export default {
   data () {
      return {
        items: [
          {
            title: 'Вход', 
            icon: 'how_to_reg'
          }, 
          { title: 'Регистрация', 
            icon: 'library_books'           
          }
        ],
        active: null        
      }
    },
    components: {
      appRegister: Register,
      appLogin: Login
    }
}
</script>

<style>
 .tabsBlock {
   max-width: 600px;
   margin: 0 auto;
 }

 .containerTabs {
   display: flex;
   align-items: center;
 }

 .v-tabs__slider {
   height: 4px;
 }

 .VPheader {
   font-family: 'Scada', sans-serif!important;
   color: rgb(85, 84, 84);   
 }

 .VP50 {
   width: 50%;
 }

 @media (max-width: 500px) {
   .VP50 {
     width: 100%;
     height: 48px;
   }

   .v-tabs__container {
     height: auto;
     overflow: visible;
     flex-wrap: wrap;
   }

   .v-tabs__slider-wrapper {
     display: none;
   }
   
   .oneVP {
     border-bottom: 1px solid rgba(255, 255, 255, .41);
   }

   .VPheader {
     font-size: 19px;
     line-height: 22px;
   }
 }
  
</style>
