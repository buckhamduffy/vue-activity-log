import Vue from 'vue';
import Dev from './serve.vue';
import BootstrapVue from 'bootstrap-vue';

require('bootstrap/dist/css/bootstrap.css')
Vue.use(BootstrapVue)
Vue.config.productionTip = false;

new Vue({
  render: (h) => h(Dev),
}).$mount('#app');
