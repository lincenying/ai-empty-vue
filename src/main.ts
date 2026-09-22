import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import elementInstall from './config/element'
import { needRem } from './design.config.ts'
import router from './router'
import './assets/scss/global/animate.min.css'
import './assets/scss/global/global.scss'
import 'virtual:uno.css'
import './assets/scss/style.scss'

/** 按需加载 rem 根字号后再挂载应用 */
async function bootstrap() {
    if (needRem)
        await import('./assets/scss/global/rem.scss')

    const app = createApp(App)

    app.use(elementInstall)
    app.use(createPinia())
    app.use(router)

    app.mount('#app')
}

bootstrap()
