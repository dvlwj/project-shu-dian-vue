<template>
  <v-app>
      <v-app-bar app color="primary" dark>
        <div class="d-flex align-center">
          <h3>To Do List</h3>
        </div>

        <v-spacer></v-spacer>
        <p>v1.0.0</p>
      </v-app-bar>
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
                <v-toolbar-title>Register</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-icon>mdi-login</v-icon>
              </v-toolbar>
              <v-card-text>
                  <v-text-field
                    label="Username"
                    name="username"
                    prepend-icon="mdi-account"
                    type="text"
                    v-model="registerUsername"
                    :rules="rulesUsername"
                    required
                  ></v-text-field>
                  <v-text-field
                    id="password"
                    label="Password"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                    v-model="registerPassword"
                    :rules="rulesPassword"
                    required
                  ></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  color="warning"
                  @click="$router.go(-1)"
                >
                  Back
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  type="submit"
                  color="primary"
                  :disabled="isDisabled"
                  @click="registerCredentials"
                >
                  Submit
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
</template>

<script>
import axios from 'axios';
import CommonModal from '@/components/CommonModal.vue';
import LoadingModal from '@/components/LoadingModal.vue';

export default {
  name: 'Register',
  components: {
    CommonModal,
    LoadingModal,
  },
  data: () => ({
    isDisabled: true,
    valid: true,
    registerUsername: '',
    rulesUsername: [
      (v) => !!v || 'Name is required',
    ],
    registerPassword: '',
    rulesPassword: [
      (v) => !!v || 'Password is required',
    ],
    lazy: true,
    modalMessage: null,
  }),
  watch: {
    registerUsername() {
      if (this.registerUsername.length > 0 && this.registerPassword.length > 0) {
        this.isDisabled = false;
      }
    },
    registerPassword() {
      if (this.registerUsername.length > 0 && this.registerPassword.length > 0) {
        this.isDisabled = false;
      }
    },
  },
  computed: {
  },
  methods: {
    async registerCredentials() {
      const dataToSend = {
        username: this.registerUsername,
        password: this.registerPassword,
      };
      if (this.$refs.form.validate()) {
        this.showLoading(true);
        await axios({
          method: 'post',
          url: 'http://localhost:3000/user/create',
          data: dataToSend,
          timeout: 10000,
        })
          .then((res) => {
            const { message } = res.data;
            this.openModal(message);
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
    toRegisterPage() {
      this.$router.push({ name: 'Register' });
    },
  },
};
</script>
