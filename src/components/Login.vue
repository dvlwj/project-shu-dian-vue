<template>
  <h1>Welcome to {{appName}}</h1>
</template>

<script>

import { VUE_APP_NAME } from "process.env";

export default {
  name: 'Login',
  appName: VUE_APP_NAME,
};

</script>
