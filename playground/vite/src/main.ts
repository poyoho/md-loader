import "./styles/code.css"
import "./styles/custom-blocks.css"
import "./styles/layout.css"
import "./styles/vars.css"

import MdComponent from "@poyoho/md-loader-components"
import { createApp } from "vue"

import App from "./App.vue"

const app = createApp(App)
app.mount("#app")

MdComponent.install()

export default app
