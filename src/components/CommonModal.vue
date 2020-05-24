<template>
  <v-row justify="center">
    <v-dialog v-model="showModal" v-if="showModal" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Information</v-card-title>
        <v-card-text>{{modalMessage}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="showModal = false">ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: 'CommonModal',
  data: () => ({
    showModal: false,
    modalMessage: null,
  }),
  methods: {
    showModalFunction(message) {
      this.modalMessage = message;
      this.showModal = true;
    },
    hideModal() {
      this.showModal = false;
    },
  },
};
</script>
