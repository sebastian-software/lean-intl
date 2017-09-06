import resolve from "rollup-plugin-node-resolve"
import commonjs from "rollup-plugin-commonjs"

export default {
  input: "../src/index.js",
  output: {
    format: "iife",
    file: "runnerfile.js",
    name: "IntlPolyfill"
  },
  plugins: [ resolve(), commonjs() ]
}