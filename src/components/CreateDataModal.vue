<template>
  <v-row justify="center">
    <v-dialog
      v-model="showModal"
      v-if="showModal"
      transition="dialog-bottom-transition"
      hide-overlay
      fullscreen
    >
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="hideModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Create new task</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
            dark
            text
            @click="submitData"
            :disabled="isSaveButtonDisable"
          >
            Save
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container>
        <v-row>
          <v-col cols="12" sm="12" md="12">
            <v-text-field
              v-model="subject"
              :rules="rulesSubject"
              label="Subject*"
              hint="Enter name of the task you want to record"
              required
            >
            </v-text-field>
          </v-col>
        </v-row>
      </v-container>
      </v-card>
    </v-dialog>
    <CommonModal ref="CommonModal"></CommonModal>
    <LoadingModal ref="LoadingModal"></LoadingModal>
  </v-row>
</template>

<script>
import axios from 'axios';
import CommonModal from '@/components/CommonModal.vue';
import LoadingModal from '@/components/LoadingModal.vue';

export default {
  name: 'CreateDataModal',
  components: {
    CommonModal,
    LoadingModal,
  },
  data: () => ({
    showModal: false,
    subject: null,
    rulesSubject: [
      (v) => !!v || 'Subject name is required',
    ],
    isSaveButtonDisable: true,
  }),
  watch: {
    subject() {
      const isDisabled = this.subject.length > 0
        ? this.isSaveButtonDisable = false
        : this.isSaveButtonDisable = true;
      this.isSaveButtonDisable = isDisabled;
    },
  },
  methods: {
    async submitData() {
      this.showLoading(true);
      this.sessionID = this.$store.getters.getUUID;
      const dataToSend = {
        subject: this.subject,
        sessionID: this.sessionID,
      };
      await axios({
        method: 'post',
        url: 'http://localhost:3000/list/create',
        data: dataToSend,
        timeout: 10000,
      })
        .then((res) => {
          if (res.status !== 200) {
            const message = 'Failed to process login request, credentials isn\'t valid';
            this.openModal(message);
            return;
          }
          this.$emit('resyncParent', 'CreateDataModal');
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 401) {
              this.$router.push({ name: 'Login' });
              return;
            }
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
    },
    openModal(message) {
      this.$refs.CommonModal.showModalFunction(message);
    },
    showLoading(boolean) {
      this.$refs.LoadingModal.showModalFunction(boolean);
    },
    showModalFunction() {
      this.showModal = true;
    },
    hideModal() {
      this.showModal = false;
    },
  },
};
</script>
