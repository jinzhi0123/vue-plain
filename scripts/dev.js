const { build } = require('esbuild')

const args = require('minimist')(process.argv.slice(2))
const { resolve } = require('path') //node内置模块，用来解析路径

//minimist解析命令行参数

const target = args._[0] || 'reactivity'
const format = args.f || 'global'

//导入package.json文件
const pkg = require(resolve(__dirname, `../packages/${target}/package.json`))

// 输出格式
const outputFormat = format.startsWith('global') ? 'iife' : format === 'cjs' ? 'cjs' : 'esm'

// startsWith() 方法用来判断当前字符串是否以另外一个给定的子字符串开头，
// 并根据判断结果返回 true 或 false。

// 输出路径
const outfile = resolve(__dirname, `../packages/${target}/dist/${target}.${format}.js`)


//esbuild打包

build({
  entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
  outfile,
  bundle: true,
  sourcemap: true,
  format: outputFormat,
  globalName: pkg.buildOptions?.name,
  platform: format === 'cjs' ? 'node' : 'browser',
  watch: {
    onRebuild(error) {
      if (!error) console.log('rebuilt...')
    }
  }
}).then(() => {
  console.log('watching...')
})
