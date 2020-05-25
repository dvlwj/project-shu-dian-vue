<template>
  <v-row justify="center">
    <v-dialog v-model="showModal" v-if="showModal" persistent>
      <v-card>
        <v-card-title class="headline">Details</v-card-title>
        <v-card-text>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <v-text-field
              label="Subject"
              v-model="formSubject"
              :rules="[v => !!v || 'Name is required']"
              required>
            </v-text-field>
            <v-select
              label="Status"
              v-model="formStatus"
              :items="statusList"
              required>
            </v-select>
            <v-text-field label="Created By" v-model="formCreatedBy" disabled></v-text-field>
            <v-text-field label="Created On" v-model="formCreatedOn" disabled></v-text-field>
            <v-text-field label="Updated By" v-model="formUpdatedBy" disabled></v-text-field>
            <v-text-field label="Updated On" v-model="formUpdatedOn" disabled></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn
            class="ma-2"
            color="error"
            @click="deleteData"
          >
            delete
            <v-icon right>mdi-delete-forever</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2"
            color="primary"
            @click="showModal = false"
          >
            close
            <v-icon right>mdi-close</v-icon>
          </v-btn>
          <v-btn
            class="ma-2"
            color="warning"
            @click="updateData"
            :disabled="isUpdateButtonDisable"
          >
            Update
            <v-icon right>mdi-check-all</v-icon>
          </v-btn>
        </v-card-actions>
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
  name: 'DetailsModal',
  components: {
    CommonModal,
    LoadingModal,
  },
  data: () => ({
    valid: true,
    showModal: false,
    isUpdateButtonDisable: true,
    id: null,
    data: null,
    sessionID: null,
    statusList: [
      'todo',
      'done',
    ],
    formSubject: null,
    formStatus: null,
    formCreatedBy: null,
    formCreatedOn: null,
    formUpdatedBy: null,
    formUpdatedOn: null,
  }),
  watch: {
    formSubject() {
      this.isUpdateButtonDisable = !(this.formSubject.length > 0);
    },
  },
  methods: {
    async getDetails() {
      this.showLoading(true);
      this.sessionID = this.$store.getters.getUUID;
      const dataToSend = {
        id: this.id,
        sessionID: this.sessionID,
      };
      await axios({
        method: 'post',
        url: 'http://localhost:3000/list/getDetails',
        data: dataToSend,
        timeout: 10000,
      })
        .then((res) => {
          if (res.status !== 200) {
            const message = 'Failed to process login request, credentials isn\'t valid';
            this.openModal(message);
            return;
          }
          const responseData = res.data.data;
          this.formSubject = responseData.subject;
          this.formStatus = responseData.status;
          this.formCreatedBy = responseData.created_by;
          this.formCreatedOn = responseData.created_on;
          this.formUpdatedBy = responseData.updated_by;
          this.formUpdatedOn = responseData.updated_on;
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
    async deleteData() {
      this.showLoading(true);
      this.sessionID = this.$store.getters.getUUID;
      const dataToSend = {
        id: this.id,
        sessionID: this.sessionID,
      };
      await axios({
        method: 'delete',
        url: 'http://localhost:3000/list/delete',
        data: dataToSend,
        timeout: 10000,
      })
        .then((res) => {
          if (res.status !== 200) {
            const message = 'Failed to process login request, credentials isn\'t valid';
            this.openModal(message);
            return;
          }
          this.$emit('resyncParent', 'DeleteDataModal');
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
    async updateData() {
      this.showLoading(true);
      this.sessionID = this.$store.getters.getUUID;
      const dataToSend = {
        id: this.id,
        status: this.formStatus,
        subject: this.formSubject,
        sessionID: this.sessionID,
      };
      await axios({
        method: 'put',
        url: 'http://localhost:3000/list/update',
        data: dataToSend,
        timeout: 10000,
      })
        .then((res) => {
          if (res.status !== 200) {
            const message = 'Failed to process login request, credentials isn\'t valid';
            this.openModal(message);
            return;
          }
          this.$emit('resyncParent', 'UpdateDataModal');
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
    showModalFunction(id) {
      this.id = id;
      this.getDetails();
      this.showModal = true;
    },
    hideModal() {
      this.showModal = false;
    },
  },
};
</script>
