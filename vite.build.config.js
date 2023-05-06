import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import DefineOptions from "unplugin-vue-define-options/vite";

export default defineConfig({
  build: {
    publicDir:false,
    minify: false,
    lib: {
      entry: "./components/card/index.js",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["vue"],
      output: [
        {
          format: "es",
          entryFileNames: "[name].js",
          preserveModules: true,
          preserveModulesRoot: "components",
          dir: "es",
        }
      ],
    },
  },
  plugins: [vue()],
});
