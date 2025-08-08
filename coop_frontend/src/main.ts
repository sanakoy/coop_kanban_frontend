import "./assets/main.css";
import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import clickOutside from "./directives/clickOutside";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.directive("click-outside", clickOutside);
app.mount("#app");
