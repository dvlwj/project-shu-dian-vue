<template>
  <div>
    <v-app id="login-form">
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-form
              ref="form"
              v-model="valid"
              :lazy-validation="lazy"
              @submit.prevent
            >
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Login</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-icon>mdi-login</v-icon>
              </v-toolbar>
              <v-card-text>
                  <v-text-field
                    label="Username"
                    name="username"
                    prepend-icon="mdi-account"
                    type="text"
                    v-model="loginUsername"
                    :rules="rulesUsername"
                    required
                  ></v-text-field>
                  <v-text-field
                    id="password"
                    label="Password"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                    v-model="loginPassword"
                    :rules="rulesPassword"
                    required
                  ></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  type="submit"
                  color="primary"
                  :disabled="isDisabled"
                  @click="loginCredentials"
                >
                  Login
                </v-btn>
              </v-card-actions>
            </v-card>
            </v-form>
          </v-col>
        </v-row>
      </v-container>
      <CommonModal ref="CommonModal"></CommonModal>
      <LoadingModal ref="LoadingModal"></LoadingModal>
    </v-app>
  </div>
</template>

<script>
import axios from 'axios';
import CommonModal from '@/components/CommonModal.vue';
import LoadingModal from '@/components/LoadingModal.vue';


export default {
  name: 'Login',
  components: {
    CommonModal,
    LoadingModal,
  },
  data: () => ({
    valid: true,
    loginUsername: '',
    rulesUsername: [
      (v) => !!v || 'Name is required',
    ],
    loginPassword: '',
    rulesPassword: [
      (v) => !!v || 'Password is required',
    ],
    lazy: true,
    modalMessage: null,
  }),
  // created: {
  //   checkSession() {
  //     const UUID = this.$store.getters.getUUID;
  //     const username = this.$store.getters.getUsername;
  //     if (UUID.length > 0 && username.length > 0) {
  //       alert('Yuhuuuuu');
  //     }
  //   },
  // },
  computed: {
  },
  methods: {
    async loginCredentials() {
      const dataToSend = {
        username: this.loginUsername,
        password: this.loginPassword,
      };
      if (this.$refs.form.validate()) {
        this.showLoading(true);
        await axios({
          method: 'post',
          url: 'http://localhost:3000/user/login',
          data: dataToSend,
          timeout: 10000,
        })
          .then((res) => {
            if (res.status === 204) {
              const message = 'Failed to process login request, credentials isn\'t valid';
              this.openModal(message);
            }
            this.storeCredentials(res);
            this.$router.push({ name: 'Dashboard' });
          })
          .catch((error) => {
            if (error.response) {
              const dataFromResponse = error.response.data;
              const { message } = dataFromResponse;
              this.openModal(message);
            } else if (error.request) {
              const dataFromResponse = error.response.data;
              const { message } = dataFromResponse;
              this.openModal(message);
            } else {
              const message = 'Some issue occured';
              this.openModal(message);
            }
          });
        this.showLoading(false);
      }
    },
    async storeCredentials(res) {
      const dataToSave = res.data;
      const usernameData = dataToSave.data.username;
      const UUIDData = dataToSave.data.UUID;
      this.$store.dispatch('setUsername', usernameData);
      this.$store.dispatch('setUUID', UUIDData);
    },
    openModal(message) {
      this.$refs.CommonModal.showModalFunction(message);
    },
    showLoading(boolean) {
      this.$refs.LoadingModal.showModalFunction(boolean);
    },
  },
};
</script>
