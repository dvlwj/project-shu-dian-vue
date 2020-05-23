<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <h3>To Do List</h3>
      </div>

      <v-spacer></v-spacer>
      <p>v1.0.0</p>
    </v-app-bar>
    <router-view />
  </v-app>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  data: () => ({
  }),
};
</script>
