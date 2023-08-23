import { createApp } from 'vue'
import App from './App.vue'
import Axios from 'axios'
import router from '@/router'
import { createPinia } from 'pinia'
const Vue = createApp(App);
const store = createPinia();
import './assets/scss/fonts.scss'; // 전역 스타일 파일 추가
import './assets/scss/cursorLock.scss'; // 전역 스타일 파일 추가
// Vuetify
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

function url() {
    if ((document.location.href.slice(0, 5)) == 'https') {
        return document.location.href.slice(0, (document.location.href.length-1));
    }
    else {
        let baseAddress = document.location.href.slice(4, 7);
        baseAddress += (document.location.href.split('//')[1].split(':')[0] + ':3000');
        return 'http' + baseAddress;
    }
}

const axios = Axios.create({
    baseURL: url(),
    timeout: 600000
});

Vue.config.globalProperties.$http = Axios.create({
    baseURL: url(),
    timeout: 600000
});

const vuetify = createVuetify({
    components,
    directives,
})

Vue.provide('$http', Vue.config.globalProperties.$http)
Axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
Axios.defaults.withCredentials = true;

export { axios };
Vue.use(router)
    .use(vuetify)
    .use(store)
    .mount('#app')
