import { createApp } from 'vue'
import App from './App.vue'
import Axios from 'axios'
const Vue = createApp(App)

createApp(App).mount('#app')

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

Vue.provide('$http', Vue.config.globalProperties.$http)
Axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
Axios.defaults.withCredentials = true;

export { axios };
