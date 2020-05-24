<template>
  <v-app>
    <v-container fluid>
        <v-row class="fill-height">
          <v-list
            :disabled="disabled"
            :dense="dense"
            :two-line="twoLine"
            :three-line="threeLine"
            :shaped="shaped"
            :flat="flat"
            :subheader="subheader"
            :sub-group="subGroup"
            :rounded="rounded"
            class="fill-height"
          >
            <v-subheader>
              Hi {{username}} !
              <br/>
              Your to do list is :
            </v-subheader>
            <v-list-item-group v-model="item" color="primary">
              <v-list-item
                v-for="(item, i) in items"
                :key="i"
                :inactive="inactive"
                class="d-flex"
              >
                <v-list-item-icon class="align-self-center">
                  <v-icon>mdi-chevron-right</v-icon>
                </v-list-item-icon>
                <v-list-item-content class="align-self-center">
                  <v-list-item-title>
                    Subject : {{item.subject}}
                  </v-list-item-title>
                </v-list-item-content>
                <v-btn
                  class="ma-2"
                  color="success"
                  @click="processDetails(item.id)"
                >
                  Details
                  <v-icon right>mdi-page-next</v-icon>
                </v-btn>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-row>
    </v-container>
    <v-fab-transition>
      <v-btn
        color="primary"
        large
        dark
        bottom
        right
        fixed
        fab
        @click="processNew"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-fab-transition>
    <CommonModal ref="CommonModal"></CommonModal>
    <LoadingModal ref="LoadingModal"></LoadingModal>
    <CreateDataModal ref="CreateDataModal" v-on:resyncParent="resyncParent"></CreateDataModal>
    <DetailsModal ref="DetailsModal" v-on:resyncParent="resyncParent"></DetailsModal>
  </v-app>
</template>

<script>
import axios from 'axios';
import CommonModal from '@/components/CommonModal.vue';
import LoadingModal from '@/components/LoadingModal.vue';
import CreateDataModal from '@/components/CreateDataModal.vue';
import DetailsModal from '@/components/DetailsModal.vue';

axios.defaults.withCredentials = true;

export default {
  name: 'Dashboard',
  components: {
    CommonModal,
    LoadingModal,
    CreateDataModal,
    DetailsModal,
  },
  data: () => ({
    username: null,
    sessionID: null,
    item: 0,
    items: null,
    disabled: false,
    dense: false,
    twoLine: false,
    threeLine: true,
    shaped: false,
    flat: false,
    subheader: false,
    inactive: false,
    subGroup: false,
    nav: false,
    rounded: false,
  }),
  mounted() {
    this.getList();
    this.getUsername();
  },
  methods: {
    async getList() {
      this.showLoading(true);
      this.sessionID = this.$store.getters.getUUID;
      const dataToSend = {
        sessionID: this.sessionID,
      };
      await axios({
        method: 'post',
        url: 'http://localhost:3000/list/',
        data: dataToSend,
        timeout: 10000,
      })
        .then((res) => {
          if (res.status === 204) {
            const message = 'Your to do list still empty. You can start to input now';
            this.openModal(message);
          } else if (res.status !== 200) {
            const message = 'Failed to process login request, credentials isn\'t valid';
            this.openModal(message);
            return;
          }
          const responsePayload = res.data;
          const dataFromResponse = responsePayload.data;
          this.items = dataFromResponse;
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
    getUsername() {
      this.username = this.$store.getters.getUsername;
    },
    openModal(message) {
      this.$refs.CommonModal.showModalFunction(message);
    },
    showLoading(boolean) {
      this.$refs.LoadingModal.showModalFunction(boolean);
    },
    processDetails(id) {
      this.$refs.DetailsModal.showModalFunction(id);
    },
    processNew() {
      this.$refs.CreateDataModal.showModalFunction();
    },
    async resyncParent(modalName) {
      await this.getList();
      if (modalName === 'CreateDataModal') {
        this.$refs.CreateDataModal.hideModal();
      } else if (modalName === 'DeleteDataModal') {
        this.$refs.DetailsModal.hideModal();
      } else if (modalName === 'UpdateDataModal') {
        this.$refs.DetailsModal.hideModal();
      }
    },
  },
};
</script>
<style lang="less" scoped>
  .v-list{
    margin-top: 64px;
    width:100%;
  };
</style>
