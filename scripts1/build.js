/** 打包组件库 */
import pLimit from "p-limit";
import fse from "fs-extra";
import { build } from "./build-util.js";

// 项目根目录
const PROJECT_PATH = process.cwd().replace(/\\/g, "/");
// 打包的源目录
const ROOT_PATH = `${PROJECT_PATH}/components`;
// 需要直接复制的文件后缀
const STATIC_SUFFIXS = [".less"];
// 限制并行任务数量
const LIMIT_TASK = 3; // Infinity | 8

setup();

async function setup() {
  const tasks = buildTarget(ROOT_PATH);
  console.log(`Start processing ${tasks.length} tasks...`);
  const limit = pLimit(LIMIT_TASK);
  await Promise.all(tasks.map((t) => limit(t)));
}

/**
 * 递归打包源文件
 * @param path 路径
 */
function buildTarget(path) {
  const tasks = [];
  const stat = fse.statSync(path);
  if (stat.isDirectory()) {
    const list = fse.readdirSync(path);
    for (const item of list) {
      buildTarget(path + "/" + item).forEach((t) => {
        tasks.push(t);
      });
    }
  } else if (isStatic(path)) {
    const output = path.substring(ROOT_PATH.length + 1);
    tasks.push(() => fse.copy(path, `${PROJECT_PATH}/es/${output}`));
    tasks.push(() => fse.copy(path, `${PROJECT_PATH}/lib/${output}`));
    console.log("copy---------", path, `${PROJECT_PATH}/es/${output}`);
  } else {
    const file = path.substring(path.lastIndexOf("/") + 1);
    const name = file.substring(0, file.lastIndexOf("."));
    const start = ROOT_PATH.length + 1;
    const end = path.lastIndexOf("/");
    const directory = "/" + (end <= start ? "" : path.substring(start, end));
    const output = `${name}.js`;
    tasks.push(() => build("es", path, output, `es${directory}`));
    tasks.push(() => build("cjs", path, output, `lib${directory}`));
  }
  return tasks;
}

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
