// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import Theme from "vitepress/theme";
import Demo from "vitepress-theme-demoblock/dist/client/components/Demo.vue";
import DemoBlock from "vitepress-theme-demoblock/dist/client/components/DemoBlock.vue";
// 本地引入
// import jinkeUI from "../../../components";

// 打包后全量引入
import jinkeUI from "../../../es";

// 打包后按需引入
// import { JinkeButton } from "../../../es";

// 打包全局样式引入
import "../../../dist/style.css";

import "./style.css";

export default {
  ...Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  },
  enhanceApp({ app, router, siteData }) {
    app.use(jinkeUI);
    // app.use(JinkeButton);
    app.component("Demo", Demo);
    app.component("DemoBlock", DemoBlock);
  },
};
