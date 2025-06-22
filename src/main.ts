import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";

import App from "./App.vue";
import router from "./router";
import i18n from "./plugins/i18n";

// PrimeVue styles - v4 uses different import structure
import "primeicons/primeicons.css";

// Patch for build: provide dummy crypto.getRandomValues if missing (Node.js build workaround)
if (typeof globalThis.crypto === "undefined") {
  globalThis.crypto = {
    getRandomValues: function <T extends ArrayBufferView | null>(array: T): T {
      if (array && array instanceof Uint8Array) {
        for (let i = 0; i < array.length; i++) array[i] = 0;
        return array;
      }
      throw new Error("Expected a Uint8Array");
    },
    subtle: undefined,
    randomUUID: () => "00000000-0000-4000-8000-000000000000",
  } as unknown as Crypto;
}

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(PrimeVue, {
  ripple: true,
  inputStyle: "outlined",
});
app.use(ToastService);
app.use(ConfirmationService);

app.mount("#app");
