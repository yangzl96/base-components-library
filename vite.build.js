/**
 * 打包配置
 */
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import DefineOptions from "unplugin-vue-define-options/vite";
import { buildOption } from "./scripts1/build-config";

export default defineConfig({
  mode: "production",
  publicDir: false,
  plugins: [vue(), DefineOptions()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  build: buildOption,
});
