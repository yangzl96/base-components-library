import { defineConfig, build } from "vite";
import DefineOptions from "unplugin-vue-define-options/vite";
import vue from "@vitejs/plugin-vue";
import fse from "fs-extra";
import plimit from "p-limit";

// 根目录
const bundleFilePath = process.cwd();
// 入口路径
const entryFile = bundleFilePath + "/components";

// 需要直接复制的文件后缀
const STATIC_SUFFIXS = [".less"];
// 需要打包的文件后缀
const INCLUDE_SUFFIXS = [".js", ".vue"];

const buildLib = async () => {
  // 收集打包文件
  const tasks = buildTarget(entryFile);
  // 控制并发
  const limit = plimit(8);
  await Promise.all(tasks.map((t) => limit(t)));
  // 全量构建 umd
  await buildAll();
};

// 插件: 修改导入路径
const ImportPathPlugin = () => {
  return {
    name: "ImportPathPlugin",
    apply: "build",
    enforce: "post",
    transform(src, id) {
      return {
        code: src
          .replace(/from\s'.*?\.vue'/g, (m) => m.replace(".vue", ""))
          .replace(/from\s".*?\.vue"/g, (m) => m.replace(".vue", "")),
      };
    },
  };
};

// vite 基础配置
const baseConfig = (format) => {
  const plugins = [vue(), DefineOptions()];
  // umd 格式不需要处理 路径
  if (format !== "umd") {
    plugins.push(ImportPathPlugin());
  }
  return defineConfig({
    mode: "production",
    publicDir: false,
    plugins,
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
  });
};

// 获取rollup基础配置
const getRollupOptions = (format) => {
  const external = format === "umd" ? ["vue"] : ["vue", /^\.\//, /^\.\.\//];
  return {
    external,
    output: {
      globals: {
        vue: "Vue",
      },
    },
  };
};

// 收集构建任务
const buildTarget = (path) => {
  const tasks = [];
  const stat = fse.statSync(path);
  // 有目录 递归
  if (stat.isDirectory()) {
    const dir = fse.readdirSync(path);
    for (const file of dir) {
      buildTarget(path + "/" + file).forEach((t) => {
        tasks.push(t);
      });
    }
  } else if (isStatic(path)) {
    // 需要复制的静态文件
    const output = path.substring(entryFile.length + 1);
    tasks.push(() => fse.copy(path, `${bundleFilePath}/es/${output}`));
    tasks.push(() => fse.copy(path, `${bundleFilePath}/lib/${output}`));
  } else if (isInclude(path)) {
    // 需要打包的文件
    const file = path.substring(path.lastIndexOf("/") + 1);
    const name = file.substring(0, file.lastIndexOf("."));
    const start = entryFile.length + 1;
    const end = path.lastIndexOf("/");
    const directory = "/" + (end <= start ? "" : path.substring(start, end));
    const output = `${name}.js`;
    const cName = getComponentName(name, directory);
    console.log("file: " + file);
    console.log("name: " + name);
    console.log("cname: " + cName);
    console.log("input: " + path);
    console.log("filename: " + output);
    console.log("target: " + `es${directory}`);
    console.log("directory: " + directory);
    console.log("--------------------------------------------");
    tasks.push(() => {
      buildTask("es", cName, path, output, `es${directory}`);
    });
    tasks.push(() => {
      buildTask("cjs", cName, path, output, `lib${directory}`);
    });
  }
  return tasks;
};

// 单个构建任务
const buildTask = async (format, cName, entry, filename, outDir) => {
  await build(
    defineConfig({
      ...baseConfig(format),
      build: {
        rollupOptions: getRollupOptions(format),
        lib: {
          entry,
          name: cName,
          fileName: () => filename,
          formats: [format],
        },
        outDir,
        // 是否清空输出目录(默认在根目录下，为true，因为组件需要循环打包，避免打包文件被清空)
        emptyOutDir: false,
        // 是否压缩文件
        minify: false,
      },
    })
  );
};

// 全量打包 umd
const buildAll = async () => {
  await build(
    defineConfig({
      ...baseConfig("umd"),
      build: {
        rollupOptions: getRollupOptions("umd"),
        lib: {
          entry: entryFile + "/index.js",
          name: "index",
          fileName: "index",
          formats: ["umd"],
        },
        outDir: "dist",
      },
    })
  );
};

/**
 * 判断文件是否直接复制不经过打包
 * @param path 文件路径
 */
function isStatic(path) {
  for (const suffix of STATIC_SUFFIXS) {
    if (path.endsWith(suffix)) {
      return true;
    }
  }
  return false;
}

/**
 * 判断文件是否需要打包
 * @param path 文件路径
 */
function isInclude(path) {
  for (const suffix of INCLUDE_SUFFIXS) {
    if (path.endsWith(suffix)) {
      return true;
    }
  }
  return false;
}

const getComponentName = (name, directory) => {
  if (name === "index") {
    if (!directory || directory === "/") {
      return "Jinke";
    }
    const dir = directory.substring(directory.lastIndexOf("/") + 1);
    return dir.toUpperCase() + Math.random();
  }
  return name.toUpperCase()+ Math.random();
};

// 开始构建
buildLib();
