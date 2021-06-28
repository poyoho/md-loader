const path =  require("path")
const chalk = require("chalk")
const rollup =  require("rollup")
const rm = require("rimraf")
const pkg = require("../packages/vite/package.json")
const deps = Object.keys(pkg.dependencies)
const esbuild = require("rollup-plugin-esbuild")
const tsc =  require("rollup-plugin-typescript2")

__dirname = path.join(__dirname, "../packages/vite/")
const tsconfigPath = path.join(__dirname, "tsconfig.json")
const _rollup_options = (_opts) => ({
  input: {
    input: path.join(__dirname, "index.ts"),
    plugins: [
      _opts.dts
        ? tsc({
          tsconfig: tsconfigPath,
          tsconfigOverride: {
            compilerOptions: {
              emitDeclarationOnly: true,
            },
          }
        })
        : esbuild({
          tsconfig: tsconfigPath,
        }),
    ],
    external(id) {
      // 不打包deps的项目
      return deps.some(k => new RegExp("^" + k).test(id))
    },
  },
  output: {
    format: "cjs",
    file: path.join(__dirname, "/dist/index.js")
  }
})

async function build() {
  console.log(chalk.green("build vite plugin markdown"))
  // dts
  let opts = _rollup_options({ dts: true })
  let bundle = await rollup.rollup(opts.input)
  await bundle.write(opts.output)
  // chunk
  opts = _rollup_options({ dts: false })
  bundle = await rollup.rollup(opts.input)
  await bundle.write(opts.output)
}

async function rmDir(dir) {
  return new Promise((resolve) => {
    rm(dir, {}, () => {
      resolve()
    })
  })
}

async function main () {
  await rmDir(path.join(__dirname, "dist"))
  await build()
}

main()
