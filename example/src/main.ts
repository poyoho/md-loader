import { createApp } from "vue"
import App from "./App.vue"
import demoBlock from "./demo-block/demo-block.vue"
import "./styles/code.css"
import "./styles/custom-blocks.css"
import "./styles/layout.css"
import "./styles/vars.css"

const app = createApp(App)

app.component("DemoBlock", demoBlock)
app.mount("#app")

export default app