import "@poyoho/md-loader-themes/src/simple/index.css"

import MdComponent from "@poyoho/md-loader-components"
import { createApp } from "vue"

import App from "./App.vue"

const app = createApp(App)
app.mount("#app")

MdComponent.install()

export default app
