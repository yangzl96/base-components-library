// 打包时外部依赖
const EXTERNAL_BASE = [
  "vue",
  /^\.\//,
  /^\.\.\//,
];
// 打包类型
const FORMAT = process.env.FORMAT;
// 输入文件的完整路径
const INPUT = process.env.INPUT;
// 输出文件的完整名称
const OUTPUT = process.env.OUTPUT;
// 输出目录的完整路径
const TARGET = process.env.TARGET;
/**
 * 打包时的配置
 */
export const buildOption = {
  lib: {
    // 打包类型
    formats: [FORMAT],
    // 输入文件完整路径
    entry: INPUT,
    // 输出文件名称
    fileName: () => OUTPUT,
  },
  rollupOptions: {
    // 外部的库依赖
    external: EXTERNAL_BASE,
  },
  // 输出目录完整路径
  outDir: TARGET,
  // 是否清空输出目录
  emptyOutDir: false,
  // 是否压缩文件
  minify: false,
};
