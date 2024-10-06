import image from "@rollup/plugin-image";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

export default {
  input: "./examples/index.js",
  output: {
    dir: "docs",
    format: "iife",
  },
  plugins: [
    nodeResolve({
      extensions: [".js", ".png"],
    }),
    image({
      extensions: /\.(png)$/,
      limit: 10000,
    }),
    terser(),
  ],
};
