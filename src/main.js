import Vue from 'vue'
import App from './App.vue'
import router from "./router"
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Vant from 'vant'
import 'vant/lib/index.css';
import store from "./store/index";
import './permission';

import Vconsole from 'vconsole'
 
let vConsole = new Vconsole()
 
Vue.use(vConsole);

Vue.use(Vant);
Vue.config.productionTip = false
Vue.use(ElementUI);

new Vue({
    store,
    router,
    render: h => h(App),
}).$mount('#app')

var u = navigator.userAgent,
    app = navigator.appVersion;
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端