/*
    rollup 配置文件
*/
import postcss from "rollup-plugin-postcss";
import { eslint } from "rollup-plugin-eslint";
import commonjs from "rollup-plugin-commonjs";
import clear from "rollup-plugin-clear";
import external from "rollup-plugin-peer-deps-external";
import url from "rollup-plugin-url";

import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve";
import { uglify } from "rollup-plugin-uglify";
import replace from "rollup-plugin-replace";
import json from "rollup-plugin-json";

export default {
  input: "src/index.js",
  output: {
    // 可以是 dir 表示输出目录 也可以是 file 表示输出文件
    dir: "build",
    format: "cjs",
    sourceMap: true,
    entryFileNames: "[name]/index.js",
    exports: "named",
    globals: {
      react: "React", // 这跟external 是配套使用的，指明global.React即是外部依赖react
      antd: "antd"
    }
  },
  //告诉rollup不要将此lodash打包，而作为外部依赖
  external: ["react", "lodash", "antd"],

  // 是否开启代码分割
  experimentalCodeSplitting: true,
  plugins: [
    postcss({
      // modules: true, // 增加 css-module 功能
      extensions: [".less", ".css"],
      use: [
        [
          "less",
          {
            javascriptEnabled: true
          }
        ]
      ],
      //   inject: isDev, // dev 环境下的 样式是入住到 js 中的，其他环境不会注入
      extract: false // 无论是 dev 还是其他环境这个配置项都不做 样式的抽离
    }),
    url(),
    babel({
      exclude: ["node_modules/**"]
    }),
    resolve(),
    commonjs({
      include: ["node_modules/**"]
    }),
    json(),
    eslint({
      include: ["src/**/*.js"],
      exclude: ["src/styles/**"]
    }),
    replace({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    }),
    process.env.NODE_ENV === "production" && uglify()
  ]
};
