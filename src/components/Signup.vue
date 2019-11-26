<template>
  <v-content>
    <v-container >
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar dark flat>
              <v-toolbar-title>
                <v-spacer />
                TESTAPP SIGNUP
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
                <v-form @submit.prevent="signup">
                  <v-text-field outlined v-model="email" type="email" label="Email" :rules="[rules.required]"></v-text-field>  
                  <v-text-field outlined v-model="password" label="Password"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.required, rules.min]"
                    :type="show1 ? 'text' : 'password'"
                    hint="At least 6 characters"
                    counter
                    @click:append="show1 = !show1">
                  </v-text-field>
                  <v-text-field outlined v-model="password_confirmation" label="Password Confirmation"
                    :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.required, rules.min, passwordConfirmationRule]"
                    :type="show2 ? 'text' : 'password'"
                    hint="At least 6 characters"
                    counter
                    @click:append="show2 = !show2">
                  </v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary" @click="signup()">Sign up</v-btn>
              </v-card-actions>
            
          </v-card>
          <div class="vaction">
            <v-btn text outlined small to="/">Login</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
  </template>
  
  <script>
  export default {
    name: 'Signup',
    data () {
      return {
        email: '',
        password: '',
        password_confirmation: '',
        error: '',
        show1: false,
        show2: false,
        rules: {
          required: value => !!value || 'Required.',
          min: v => v.length >= 6 || 'Min 6 characters',
        },
        dialog: false,
      }
    },
    created () {
      this.checkSignedIn()
    },
    updated () {
      this.checkSignedIn()
    },
    methods: {
      signup () {
        if (this.password !== this.password_confirmation){
          this.error  = "Password and Password confirmation does not match"
          this.dialog = true
          return
        }
        this.$http.plain.post('/signup', { email: this.email, password: this.password, password_confirmation: this.password_confirmation })
          .then(response => this.signupSuccessful(response))
          .catch(error => this.signupFailed(error))
      },
      signupSuccessful (response) {
        if (!response.data.csrf) {
          this.signupFailed(response)
          return
        }
        localStorage.csrf = response.data.csrf
        localStorage.access = response.data.access
        localStorage.signedIn = true
        this.error = ''
        this.$router.replace('/todos')
      },
      signupFailed (error) {
        this.error = (error.response && error.response.data && error.response.data.error) || 'Something went wrong'
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
      }
    },
    computed: {
      passwordConfirmationRule() {
        return () => (this.password === this.password_confirmation) || 'Password must match'
      }
    },
    // watch: {
    //   password_confirmation: function (val) {
    //     this.rePass = (val === this.password)
    //   }
    // }
  }
  </script>
  
  <style lang="css">
  .form-signup {
    width: 70%;
    max-width: 500px;
    padding: 10% 15px;
    margin: 0 auto;
  }
  .vaction{
    justify-content: center;
    margin: 30px;
    padding: auto;
    text-align: center;
  }
  </style>