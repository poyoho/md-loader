import "@poyoho/md-loader-themes/src/simple/index.css"

import MdComponent from "@poyoho/md-loader-components"
import { createApp } from "vue"

import App from "./App.vue"
import componentTest from "./component-test.vue"

const app = createApp(App)

app.component("component-test", componentTest)

app.mount("#app")
MdComponent.install()

export default app
