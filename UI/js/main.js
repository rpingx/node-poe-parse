import Vue from 'vue';
import App from './App.vue';
import router from './router/index';

import axiosConfig from './configs/axios.config.js';

window.addEventListener("load", function () {
    new Vue({
        el: '#app',
        router,
        template: '<App/>',
        components: {App}
    });
});