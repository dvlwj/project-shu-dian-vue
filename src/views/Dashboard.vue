<template>
  <v-app>
    <v-container class="fill-height" fluid>
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
              >
                <v-list-item-content>
                  <v-list-item-title>
                    Subject : {{item.subject}}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
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

axios.defaults.withCredentials = true;

export default {
  name: 'Dashboard',
  components: {
    CommonModal,
    LoadingModal,
  },
  data: () => ({
    username: null,
    sessionID: null,
    item: 5,
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
          if (res.status !== 200) {
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
  },
};
</script>
<style lang="less" scoped>
  .v-list{
    margin-top: 64px;
    width:100%;
  }
</style>
