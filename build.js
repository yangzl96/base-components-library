// import { defineConfig, build } from "vite";
// import DefineOptions from "unplugin-vue-define-options/vite";
// import vue from "@vitejs/plugin-vue";
// import fsExtra from "fs-extra";

const path = require("path");
const { defineConfig, build } = require("vite");
const vue = require("@vitejs/plugin-vue");
const fsExtra = require("fs-extra");
const fs = require("fs");

// 打包入口文件
const entryDir = path.resolve(__dirname, "./components");
// 出口文件
const outputDir = path.resolve(__dirname, "./lib");

// vite基础配置
const baseConfig = defineConfig({
  configFile: false,
  publicDir: false,
  plugins: [vue()],
});

// rollup配置
const rollupOptions = {
  external: ["vue"],
  output: {
    globals: {
      vue: "Vue",
    },
  },
};

// 全量打包构建
const buildAll = async () => {
  await build(
    defineConfig({
      ...baseConfig,
      build: {
        rollupOptions,
        lib: {
          entry: path.resolve(entryDir, "index.js"),
          name: "index",
          fileName: "index",
          formats: ["es", "umd"],
        },
        outDir: outputDir,
      },
    })
  );
};

// 单组件打包构建
// name: 组件名称
const buildSingle = async name => {
  await build(
    defineConfig({
      ...baseConfig,
      build: {
        rollupOptions,
        lib: {
          entry: path.resolve(entryDir, name),
          name: "index",
          fileName: "index",
          formats: ["es", "umd"],
        },
        outDir: path.resolve(outputDir, name),
      },
    })
  );
};

// 给每个组件单独生成自己的package.json
const createPackageJson = name => {
  const fileStr = `{
    "name": "${name}",
    "version": "0.0.0",
    "main": "index.umd.js",
    "module": "index.es.js",
    "style": "style.css"
  }`;
  fsExtra.outputFile(path.resolve(outputDir, `${name}/package.json`), fileStr, "utf-8");
};

// 打包成库
const buildLib = async () => {
  await buildAll();

  // 获取组件名称组成的数组
  const components = fs.readdirSync(entryDir).filter(name => {
    // 完整组件的目录
    const componentDir = path.resolve(entryDir, name);
    const isDir = fs.lstatSync(componentDir).isDirectory();
    // 是目录 且包含 Index.ts
    return isDir && fs.readdirSync(componentDir).includes("index.js");
  });

  for (const name of components) {
    // 构建单组件
    await buildSingle(name);
    // 生成单组件的package.json
    createPackageJson(name);
  }
};

buildLib();
