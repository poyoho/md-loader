import { createApp } from "vue"
import App from "./App.vue"
import demoBlock from "./demo-block/index.vue";
import "highlight.js/styles/atom-one-light.css"
import "./styles/markdown.css"

const app = createApp(App)

app.component("DemoBlock", demoBlock);
app.mount("#app")

export default app