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

import nested from "postcss-nested";
import cssnext from "postcss-cssnext";
import cssnano from "cssnano";

const env = process.env.NODE_ENV;

export default {
  input: "src/index.js",
  output: {
    file: "lib/hiynn-layout.js",
    format: "cjs",
    indent: false
    // globals: {
    //   react: "React", // 这跟external 是配套使用的，指明global.React即是外部依赖react
    //   antd: "antd"
    // }
  },
  //告诉rollup不要将此lodash打包，而作为外部依赖
  external: ["react", "lodash", "antd"],

  // 是否开启代码分割
  experimentalCodeSplitting: true,
  plugins: [
    postcss({
      // modules: true, // 增加 css-module 功能
      extensions: [".pcss", ".less", ".css"],
      plugins: [nested(), cssnext({ warnForDuplicates: false }), cssnano()],
      use: [
        [
          "less",
          {
            javascriptEnabled: true
          }
        ]
      ],
      //   inject: isDev, // dev 环境下的 样式是入住到 js 中的，其他环境不会注入
      extract: true // 无论是 dev 还是其他环境这个配置项都不做 样式的抽离
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
      "process.env.NODE_ENV": JSON.stringify(env)
    }),
    env === "production" && uglify()
  ]
};
