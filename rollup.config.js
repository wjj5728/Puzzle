import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import json from "rollup-plugin-json";
import { uglify } from "rollup-plugin-uglify";

export default {
  input: "src/main.js",
  output: {
    format: "umd",
    file: "build/puzzle.js",
    name: "Puzzle",
    banner: "/* eslint-disable */"
  },
  plugins: [
    resolve(),
    commonjs(),
    json(),
    babel({
      exclude: "node_modules/**"
    }),
    uglify({
      output: {
        comments: function(node, comment) {
          if (comment.type === "comment2") {
            // multiline comment
            return /@preserve|eslint|@license|@cc_on/i.test(comment.value);
          }
          return false;
        }
      }
    })
  ]
};
