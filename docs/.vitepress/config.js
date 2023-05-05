import { defineConfig } from "vitepress";
import { demoBlockPlugin } from "vitepress-theme-demoblock";
import DefineOptions from "unplugin-vue-define-options/vite";
import vue from "@vitejs/plugin-vue";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "组件库",
  description: "一个基础的组件库",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "组件", link: "/button" },
      { text: "快速开始", link: "/quick-start" },
    ],

    sidebar: [
      {
        text: "导览",
        items: [{ text: "快速开始", link: "/quick-start" }],
      },
      {
        text: "组件",
        items: [{ text: "按钮 Button", link: "/button" }],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
  markdown: {
    config: (md) => {
      md.use(demoBlockPlugin);
    },
  },
  vite: {
    plugins: [DefineOptions()],
  },
});
