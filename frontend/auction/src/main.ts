import './assets/main.css'
import 'primevue/resources/themes/aura-light-green/theme.css'
import Button from "primevue/button"

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(PrimeVue);
app.use(createPinia());
app.use(router);

app.mount('#app')
