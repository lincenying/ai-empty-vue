import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import elementInstall from './config/element'
import router from './router'
import './assets/scss/global/animate.min.css'
import './assets/scss/global/rem.scss'
import './assets/scss/global/global.scss'
import 'virtual:uno.css'
import './assets/scss/style.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(elementInstall)

app.mount('#app')
