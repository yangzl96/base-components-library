import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
export default defineConfig({
  build: {
    minify:false,
    lib: {
      entry: "./components/index.js",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      //忽略打包vue文件
      external: ["vue"],
      output: [
        {
          format: "es",
          entryFileNames: "[name].js",
          preserveModules: true,
          preserveModulesRoot: 'components',
          dir: "es",
        },
        {
          format: "cjs",
          entryFileNames: "[name].js",
          preserveModules: true,
          preserveModulesRoot: 'components',
          dir: "lib",
          exports: 'named'
        },
      ],
    },
  },
  plugins: [vue()],
});
