import { execa } from 'execa';


/**
 * 执行打包命令
 * @param format 打包类型, es | cjs
 * @param name 组件名称
 * @param input 输入路径
 * @param output 输出文件
 * @param target 输出目录
 * @param directory 组件目录
 */
export function build(
  format,
  input,
  output,
  target,
) {
  return execa('vite', ['build', '--config', 'vite.build.js'], {
    stdio: 'inherit',
    env: {
      NODE_ENV: 'production',
      FORMAT: format,
      INPUT: input,
      OUTPUT: output,
      TARGET: target,
    }
  });
}