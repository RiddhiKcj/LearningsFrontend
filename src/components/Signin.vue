<template>
  <v-content>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar dark flat>
              <v-toolbar-title>
                <v-spacer />
                TESTAPP LOGIN
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-dialog v-model="dialog" max-width="400">
                  <v-card>
                    <v-card-title>   </v-card-title>
                    <v-card-text>
                      <h4 style="color:rgb(196, 19, 19)">{{ error }}</h4>
                    </v-card-text>
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="dialog = false" >
                      OK
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-form  @submit.prevent="signin">
                <v-text-field outlined v-model="email" type="email" label="Email" :rules="[rules.required]"></v-text-field>  
                <v-text-field outlined v-model="password" label="Password"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.required, rules.min]"
                  :type="show1 ? 'text' : 'password'"
                  hint="At least 6 characters"
                  counter
                  @click:append="show1 = !show1"></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" @click="signin()">Login</v-btn>
              
            </v-card-actions>

          </v-card>
            <p>        </p>
            <div class="vaction">
              <v-btn text outlined small to="/signup">Sign up</v-btn>
            </div>
            <p style="text-align: center; color: rgba(0, 0, 0, 0.54);"> Or Login Using</p>
            <p style="text-align: center; justify-content: center;">
              <v-btn text icon color="primary" @click="handleClickSignIn" v-if="!isSignIn">
              <v-icon>mdi-google</v-icon>
              </v-btn>
              <v-btn text icon color="primary" @click="handleClickSignOut" v-if="isSignIn">
                <v-icon>mdi-google</v-icon>out
              </v-btn>
            </p>

        </v-col>
      </v-row>

    </v-container>
  </v-content>

  </template>
  
  <script>
  export default {
    name: 'Signin',
    data () {
      return {
        email: '',
        password: '',
        error: '',
        isSignIn: false,
        dialog: false,
        show1: false,
        rules: {
          required: value => !!value || 'Required.',
          min: v => v.length >= 6 || 'Min 6 characters',
        },
        idtoken: '',
        accesstoken: ''
      }
    },
    created () {
      this.checkSignedIn()
    },
    updated () {
      this.checkSignedIn()
    },
    methods: {
      signin () {
        
        if (this.email == ''){
          this.error = "Email cannot be blank"
          this.dialog = true
          return
        }
        if (this.password == ''){
          this.error = "Password cannot be blank"
          this.dialog = true
          return
        }
        this.$http.plain.post('/signin', { email: this.email, password: this.password })
          .then(response => this.signinSuccessful(response))
          .catch(error => this.signinFailed(error))
      },
      signinSuccessful (response) {
        console.log("response : "+ response)
        console.log("data: " + response.data)
        if (!response.data.csrf) {
          this.signinFailed(response)
          return
        }
        localStorage.csrf = response.data.csrf
        localStorage.access = response.data.access
        localStorage.signedIn = true
        this.error = ''
        this.$router.replace('/todos')
      },
      signinFailed (error) {
        console.log('error: '+ error)
        console.log(error.response)
        this.error = (error.response || error.response.data || error.response.data.error) || ''
        if (this.error !== ''){
          this.dialog = true
        }
        delete localStorage.csrf
        delete localStorage.access
        delete localStorage.signedIn
      },
      checkSignedIn () {
        if (localStorage.signedIn) {
          this.$router.replace('/todos')
        }
      },
      handleClickSignIn() {
      
      this.$gAuth
        .signIn()
        .then(GoogleUser => {
          //on success do something
          var authRes = GoogleUser.getAuthResponse()
          this.idtoken = authRes.id_token
          this.accesstoken = authRes.access_token
          console.log("GoogleUser", GoogleUser);
          console.log("getAuthResponse", this.$gAuth.GoogleAuth.currentUser.get().getAuthResponse());
          this.isSignIn = this.$gAuth.isAuthorized; 
          this.$http.secured.post('/oauth/gauth', { idtoken: this.idtoken, accesstoken: this.accesstoken})
          .then(response => this.signinSuccessful(response))
          .then(payload => {
            console.log('JWT Payload', payload);
            console.log(payload.userId);
          })
          .catch(error => this.signinFailed(error))
        })
        .catch(error => {
          //on fail do something
          console.log(error)
          this.error = error
          if (this.error !== ''){
            this.dialog = true
          }
        });
    },
    handleClickSignOut(){
      this.$gAuth.signOut()
      .then(() => {
        // On success do something
        this.isSignIn = this.$gAuth.isAuthorized
      })
      .catch(error  => {
        // On fail do something
        this.error = error
        if (this.error !== ''){
          this.dialog = true
        }
      })
    } 
    }
    
  }
  </script>
  
  <style lang="css">

  label{
      text-align: center;
  }
  .v-toolbar__content{
    justify-content: center;
  }
  .vaction{
    justify-content: center;
    margin: 30px;
    padding: auto;
    text-align: center;
  }
  </style>
  