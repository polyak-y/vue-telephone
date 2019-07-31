<template>  
    <v-snackbar
      :bottom="y === 'bottom'"
      :left="x === 'left'"
      :multi-line="mode === 'multi-line'"
      :right="x === 'right'"
      :timeout="timeout"
      :top="y === 'top'"
      :value="snackBar.value"
      :vertical="mode === 'vertical'"
      :color="snackBar.color"
      class="VPsnack"      
    >
      {{ snackBar.text }}
      <v-btn :color="snackBar.color" fab depressed small dark @click="closeSnackBar">
        <v-icon color="white">close</v-icon>
      </v-btn>
    </v-snackbar>
</template>

<script>
  export default {
    data () {
      return {
        y: 'top',
        x: null,
        mode: '',
        timeout: 6000,
      }
    },
    computed: {
      snackBar() {
        return this.$store.getters.snakState
      }
    },
    methods: {
      closeSnackBar() {
         this.$store.dispatch('clearSnackDispatch')
      }
    }     
  }
</script>

<style>  
  .VPsnack .v-snack__wrapper {
    min-width: 700px;    
    height: auto!important;
    font-family: 'Scada', sans-serif!important;
    font-size: 19px;
  }

  .VPsnack .v-snack__content {
    height: auto; 
    min-height: 70px;
  } 

  @media (max-width: 768px) {
    .VPsnack .v-snack__wrapper {
      min-width: 100%;      
    }
  }

  @media (max-width: 500px) {
    .VPsnack .v-snack__content {
      font-size: 17px;
    }    
  }

  
</style>