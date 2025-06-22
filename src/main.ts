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
    getRandomValues: (arr: any) => {
      // Fill with zeros as a fallback; adjust as needed for your use case
      if (ArrayBuffer.isView(arr)) {
        arr.fill(0);
        return arr;
      }
      throw new Error("Expected an array-like object");
    },
  };
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
