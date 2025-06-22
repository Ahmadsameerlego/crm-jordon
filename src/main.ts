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
