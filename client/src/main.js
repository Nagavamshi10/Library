import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueResource from 'vue-resource'
import Interceptor from 'http-interceptor'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
Vue.use(VueResource);
Vue.config.productionTip = false;
library.add(faHome)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.http.interceptors.push((request, next) => {
  // Add the access token to the request headers for every API call
    const accessToken = store.state.token;
    if (accessToken) {
      request.headers.set('Authorization', accessToken);
    }
  next(function(response){
    //logging the response body
    console.log(response.body)
});
});

import { store } from './store/store';
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
