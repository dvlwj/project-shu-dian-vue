<template>
  <div>
    <v-card class="mt-3">
      <v-card-title>
        <v-app-bar app color="amber darken-4" flex dark>
          <div class="d-flex align-center">
            <p>Chat Group |  Discussion Board</p>
          </div>
        </v-app-bar>
      </v-card-title>
      <v-form
        ref="form"
        v-model="valid"
        :lazy-validation="lazy"
        @submit.prevent
      >
        <v-card-text style="margin-top:5vh">
            <v-text-field
              label="Name"
              type="text"
              v-model="user"
              placeholder="Your name"
              outlined
              hint="If no name filled, it's will displayed as anonymous"
            ></v-text-field>
            <v-textarea
              counter
              label="Message*"
              :auto-grow="true"
              :clearable="true"
              :rows="3"
              v-model="message"
              placeholder="Your Message*"
              hint="Message you want to send"
              outlined
              :rules="(v) => !!v || 'Message is required'"
              required
            ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="error"
            @click="$router.go(-1)"
          >
            Back
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            type="submit"
            color="success"
            :disabled="isDisabled"
            @click="sendMessage"
          >
            Send
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
    <v-card>
      <v-card-text class="overflow-y-auto" style="max-height: 50vh">
        <div class="messages">
          <v-list three-line>
            <div
              v-for="msg in messages"
              :key="msg.ts"
            >
              <v-list-item-content>
                <v-list-item-title>
                  <strong>
                    {{ msg.user ? msg.user : 'Anonymous' }}:
                  </strong>
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ msg.message }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </div>
          </v-list>
        </div>
      </v-card-text>
    </v-card>
  </div>

</template>

<script>
import io from 'socket.io-client';

const PORT = process.env.PORT ?? 3001;
export default {
  name: 'chat',
  data: () => ({
    isDisabled: true,
    valid: true,
    user: '',
    message: '',
    messages: [],
    socket: io(`localhost:${PORT}`),
    lazy: true,
  }),
  watch: {
    message() {
      this.isDisabled = this.message.length > 0 ? this.isDisabled = false : this.isDisabled = true;
    },
  },
  methods: {
    sendMessage() {
      this.socket.emit('SEND_MESSAGE', {
        user: this.user,
        message: this.message,
        ts: Date.now() + this.user[0],
      });
      this.message = '';
    },
  },
  mounted() {
    this.socket.on('MESSAGE', (data) => this.messages.push(data));
  },
};
</script>
