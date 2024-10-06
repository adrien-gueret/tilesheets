import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

export default {
  input: "./index.js",
  output: {
    file: "tilesheets.min.js",
    format: "iife",
    name: "TilesheetsJS",
  },
  plugins: [
    nodeResolve({
      extensions: [".js"],
    }),
    terser(),
  ],
};
